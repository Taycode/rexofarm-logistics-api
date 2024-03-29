import { Module } from '@nestjs/common';
import { DriversService } from '@v1/drivers/drivers.service';
import { DriversRepository } from '@v1/drivers/drivers.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from '@v1/drivers/schemas/driver.schema';
import { DriversController } from '@v1/drivers/drivers.controller';

@Module({
	controllers: [DriversController],
	imports: [MongooseModule.forFeature([{
		name: Driver.name,
		schema: DriverSchema,
	}])],
	providers: [DriversService, DriversRepository],
	exports: [DriversService],
})
export class DriversModule {}
