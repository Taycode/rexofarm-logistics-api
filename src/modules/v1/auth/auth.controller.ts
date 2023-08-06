import {
  Body,
  Controller,
  HttpCode,
  Post,
  Patch,
  HttpStatus,
  UseInterceptors, HttpException,
  Req, UseGuards, Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  getSchemaPath, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

import UsersService from '@v1/users/users.service';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import SignUpDto from '@v1/users/dto/controller/sign-up.dto';
import { JWTAuthGuard } from '@v1/auth/guards/jwt.guard';
import CreateUserverifDto from '@v1/auth/dto/create-userverif.dto';
import AuthService from './auth.service';
import SignInDto from './dto/sign-in.dto';
import JwtTokensDto from './dto/jwt-tokens.dto';
import { CustomRequest } from '../../../types/request.type';

@ApiTags('Auth')
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(JwtTokensDto)
@Controller()
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(JwtTokensDto),
        },
      },
    },
    description: 'Returns jwt tokens',
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
  @Post('sign-in')
  async signIn(@Body() payload: SignInDto): Promise<JwtTokensDto> {
    const userToken = await this.authService.login(payload);
    if (userToken) return userToken;
    throw new HttpException('Credentials are incorrect', HttpStatus.BAD_REQUEST);
  }

  @ApiBody({ type: SignUpDto })
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
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() payload: SignUpDto): Promise<any> {
    const result = await this.usersService.create(payload);
    return { message: 'Success! please verify your email', data: result };
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('fetch-me')
  async fetchMe(@Req() req: CustomRequest) {
    const { user } = req;
    return user;
  }

  @ApiBody({ type: String })
  @ApiNotFoundResponse({})
  @ApiOkResponse({
    description: '201, Success',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('forgot-password/otp-request')
  async forgotPasswordOtpRequest(@Body() email:string):Promise<any> {
    await this.authService.forgotPasswordOtpRequest(email);
    return { message: 'Otp has been sent' };
  }

  @ApiOkResponse({
    description: '201,Success',
  })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password/otp-verify')
  async verifyForgotPasswordOtp(@Body() payload:CreateUserverifDto):Promise<any> {
    const token = await this.authService.verifyForgotPasswordOtp(payload);
    return { message: 'Otp verification successfull', data: token };
  }


  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(JwtTokensDto),
        },
      },
    },
    description: 'Returns jwt tokens',
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
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Patch('reset-password')
  async resetPassword(@Body() password:string, @Req() req: CustomRequest):Promise<any> {
    const { user } = req;
    const token = await this.authService.resetPassword({ email: user.email, password });
    return { message: 'successfully changed password', token };
  }
}
