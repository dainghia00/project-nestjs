import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IValidateUser } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: {
    email: string;
    password: string;
  }): Promise<IValidateUser> {
    return { email: payload.email, password: payload.password };
  }
}
