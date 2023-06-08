import {
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { User } from './schemas/users.schema';

@ApiTags('Users')
@ApiBearerAuth()
@ApiExtraModels(User)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class UsersController {
  constructor() { }
}
