import {
  Controller,
  UseInterceptors, HttpCode, HttpStatus, Body, Patch, UseGuards, Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiBody, ApiConflictResponse,
  ApiExtraModels, ApiInternalServerErrorResponse, ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import UsersService from '@v1/users/users.service';
// import { JwtService } from '@nestjs/jwt';
import ChangePasswordDto from '@v1/users/dto/change-password.dto';
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import { User } from './schemas/users.schema';
import { CustomRequest } from '../../../types/request.type';

@ApiTags('Users')
@ApiBearerAuth()
@ApiExtraModels(User)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class UsersController {
  constructor(
      private readonly userService: UsersService,
  ) {
  }

  @ApiBody({ type: ChangePasswordDto })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
    description: '201, Success',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              email: 'string',
              password: 'string',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: '400. ValidationException',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '409. ConflictResponse',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('change-password')
  async changePassword(
    @Req() req:CustomRequest,
    @Body() payload:ChangePasswordDto,
  ) {
    const { user } = req;
    await this.userService.changePassword(payload, user._id);
  }

	@HttpCode(HttpStatus.OK)
	@Patch('verify/initiate')
  async initiateUserVerification(@Req() req: CustomRequest) {
	  const { user } = req;
	  const payload = await this.userService.initiateVerifyUser(user);
	  return { verificationToken: payload };
  }
}
