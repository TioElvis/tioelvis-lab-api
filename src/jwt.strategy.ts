import { Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          const signedCookie = request.cookies['token'];

          if (!signedCookie) {
            return null;
          }

          const unsignedResult = request.unsignCookie(signedCookie);

          if (unsignedResult.valid) {
            return unsignedResult.value;
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  validate(payload: { id: string }) {
    return { id: payload.id };
  }
}
