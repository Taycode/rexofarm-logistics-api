import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from '@v1/delivery/dto/create-delivery.dto';
import { DeliveryRepository } from '@v1/delivery/repositories/delivery.repository';
import { Driver } from '@v1/drivers/schemas/driver.schema';
import { DeliveryStatus } from '@v1/delivery/enums/delivery.enum';
import { Delivery } from '@v1/delivery/schemas/delivery.schema';
import { DriverPickupRequestDto } from '@v1/delivery/dto/send-pickup-request.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PickupRequestRepository } from '@v1/delivery/repositories/pickup-request.repository';
import { CreatePickupRequestDto } from '@v1/delivery/dto/create-pickup-request.dto';
import { PickupRequestStatus } from '@v1/delivery/enums/pickup-request.enum';
import { VehicleService } from '@v1/vehicle/vehicle.service';
import { VehicleSelectionService } from "@v1/vehicle-selection/vehicle-selection.service";
import { EachProductEntity } from "@v1/vehicle-selection/entities/product-orders.entity";
import { Vehicle } from "@v1/vehicle/schema/vehicle.schema";

@Injectable()
export class DeliveryService {
	constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly pickupRequestRepository: PickupRequestRepository,
		private readonly vehicleSelectionService: VehicleSelectionService,
		@InjectConnection() private readonly connection: Connection,
	) {}

	DELIVERY_STATUS_WEIGHT = {
		[DeliveryStatus.UNASSIGNED]: 1,
		[DeliveryStatus.ASSIGNED]: 2,
		[DeliveryStatus.ONGOING]: 3,
		[DeliveryStatus.DELIVERED]: 4,
	};

	async sendPickupRequest(payload: CreateDeliveryDto, selectedDrivers: DriverPickupRequestDto[]) {
		const session = await this.connection.startSession();
		await session.withTransaction((async (txn) => {
			// Create Delivery
			const delivery = await this.deliveryRepository.create({
				...payload,
			}, txn);

			// Prepare Pickup requests
			const pickupRequestPayload = selectedDrivers.map((each) => {
				return {
					...each,
					orderId: payload.orderId,
					delivery,
				} as CreatePickupRequestDto;
			});

			// Send Pickup Requests
			await this.pickupRequestRepository.create(pickupRequestPayload, txn);
			await txn.commitTransaction();
		}));
		await session.endSession();
	}

	async fetchDriverDeliveries(driver: Driver) {
		return this.deliveryRepository.find({ driver });
	}

	async fetchOneDriverDelivery(driver: Driver, deliveryId: string) {
		return this.deliveryRepository.findOne({ driver, _id: deliveryId });
	}

	async fetchPickupRequests(driver: Driver) {
		return this.pickupRequestRepository.findWithPopulation(
			{ driver },
			'delivery',
		);
	}

	async fetchOnePickupRequest(driver: Driver, pickupRequestId: string) {
		return this.pickupRequestRepository.findOneWithPopulation(
			{ driver, _id: pickupRequestId },
			'delivery',
		);
	}

	async acceptPickupRequest(driver: Driver, pickupRequestId: string) {
		const session = await this.connection.startSession();
		await session.withTransaction(async (txn) => {
			// Update pickup request
			const updatedPickupRequest = await this.pickupRequestRepository.transactionalFindOneAndUpdate(
				{
					_id: pickupRequestId,
					status: PickupRequestStatus.AWAITING_RESPONSE,
				},
				{
					status: PickupRequestStatus.ACCEPTED,
				},
				txn,
				{ new: true },
			);

			if (!updatedPickupRequest) throw new Error('Pending Pickup request not found');

			await this.pickupRequestRepository.transactionalFindOneAndUpdate(
				{
					delivery: updatedPickupRequest.delivery,
					status: PickupRequestStatus.AWAITING_RESPONSE,
				},
				{
					status: PickupRequestStatus.REVOKED,
				},
				txn,
			);

			const updatedDelivery = await this.deliveryRepository.transactionalFindOneAndUpdate(
				{
					_id: updatedPickupRequest.delivery,
					status: DeliveryStatus.UNASSIGNED,
				},
				{
					status: DeliveryStatus.ASSIGNED,
					driver,
				},
				txn,
				{ new: true },
			);

			if (!updatedDelivery) throw new Error('Unassigned delivery not found');
			await txn.commitTransaction();
		});
		await session.endSession();
	}

	async updateDeliveryStatus(driver: Driver, delivery: Delivery, newStatus: DeliveryStatus) {
		const newStatusWeight = this.DELIVERY_STATUS_WEIGHT[newStatus];
		const oldStatusWeight = this.DELIVERY_STATUS_WEIGHT[delivery.status];
		if (newStatusWeight > oldStatusWeight) {
			return this.deliveryRepository.findOneAndUpdate({ driver, _id: delivery._id }, {
				status: newStatus,
			}, { new: true });
		}
		throw new Error('Could not update delivery status');
	}

	private prepareVehicleSelectionPayload(payload: CreateDeliveryDto): EachProductEntity[] {
		const { items } = payload;
		return items.map(
			(eachItem) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { itemName, ...remainingPayload } = eachItem;
				return {
					...remainingPayload,
				}
			}
		)
	}

	private preparePickupRequestPayload(vehicles: Vehicle[]): DriverPickupRequestDto[] {
		return vehicles.map((each) => {
			return {
				driver: each.driver,
				vehicle: each,
			};
		});
	}


	async initiatePickups(payload: CreateDeliveryDto) {
		const selectionPayload = this.prepareVehicleSelectionPayload(payload);
		const fitVehicles = await this.vehicleSelectionService.fetchVehiclesFit(selectionPayload);
		const driversSelected = this.preparePickupRequestPayload(fitVehicles)
		await this.sendPickupRequest(payload, driversSelected);
	}
}
