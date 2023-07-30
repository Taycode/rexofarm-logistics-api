import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';

import { CloudinaryModule } from '@v1/cloudinary/cloudinary.module';
import { DriversModule } from '@v1/drivers/drivers.module';
import { KycModule } from '@v1/kyc/kyc.module';
import { BullModule } from '@nestjs/bullmq';

import { DeliveryModule } from '@v1/delivery/delivery.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { VehicleModule } from './vehicle/vehicle.module';
import UsersModule from './users/users.module';
import AuthModule from './auth/auth.module';
import { createBullMqOptions } from '../../common/utils/redis-option.util';
// import AdminPanelModule from './admin/admin-panel.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/user', module: UsersModule },
      { path: '/driver', module: DriversModule },
      { path: '/vehicle', module: VehicleModule },
      { path: '/delivery', module: DeliveryModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    AuthModule,
    UsersModule,
    CloudinaryModule,
    DriversModule,
    KycModule,
    VehicleModule,
    DeliveryModule,
    BullModule.forRootAsync({
      useFactory: createBullMqOptions,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'placed-orders',
      adapter: BullMQAdapter,
    }),
    // AdminPanelModule,
  ],
})
export default class V1Module {}
