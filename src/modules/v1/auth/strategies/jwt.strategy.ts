import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import UsersRepository from '@v1/users/repositories/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'), // replace with your own secret
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.fetchUserWithDriver(payload._id);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
