import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateDeliveryDto } from '@v1/delivery/dto/create-delivery.dto';
import { DeliveryService } from '@v1/delivery/delivery.service';
import { VehicleService } from '@v1/vehicle/vehicle.service';
import { DriverPickupRequestDto } from '@v1/delivery/dto/send-pickup-request.dto';

@Processor('placed-orders')
export class DeliveryConsumer {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly vehicleService: VehicleService,
  ) {}

  @Process()
  async initiatePickups(job: Job<CreateDeliveryDto>) {
    // ToDo: Change input to something correct
    const payload = job.data;
    // ToDo: Replace with Driver selection system
    const randomVehicles = await this.vehicleService.fetchRandomVehicles();
    const driversSelected: DriverPickupRequestDto[] = randomVehicles.map((each) => {
      return {
        driver: each.driver,
        vehicle: each,
      };
    });
    await this.deliveryService.sendPickupRequest(payload, driversSelected);
  }
}
