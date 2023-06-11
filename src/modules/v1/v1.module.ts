import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';

import AuthModule from './auth/auth.module';
import UsersModule from './users/users.module';
import { CloudinaryModule } from '@v1/cloudinary/cloudinary.module';
import { DriversModule } from '@v1/drivers/drivers.module';
import { KycModule } from '@v1/kyc/kyc.module';
// import AdminPanelModule from './admin/admin-panel.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/users', module: UsersModule },
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
    // AdminPanelModule,
  ],
})
export default class V1Module {}
