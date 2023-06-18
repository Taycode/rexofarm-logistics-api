import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';

import AuthModule from './auth/auth.module';
import UsersModule from './users/users.module';
import { CloudinaryModule } from '@v1/cloudinary/cloudinary.module';
import { DriversModule } from '@v1/drivers/drivers.module';
import { KycModule } from '@v1/kyc/kyc.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { DeliveryModule } from '@v1/delivery/delivery.module';
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
    // AdminPanelModule,
  ],
})
export default class V1Module {}
