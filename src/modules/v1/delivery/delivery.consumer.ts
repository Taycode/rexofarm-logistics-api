import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateDeliveryDto } from '@v1/delivery/dto/create-delivery.dto';
import { DeliveryService } from '@v1/delivery/delivery.service';

@Processor('placed-orders')
export class DeliveryConsumer {
	constructor(
    private readonly deliveryService: DeliveryService,
	) {}


  @Process()
	async initiatePickups(job: Job<CreateDeliveryDto>) {
		const payload = job.data;
		await this.deliveryService.initiatePickups(payload);
	}
}
