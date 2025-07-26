import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OrganizationStatus } from '../../shared/db';

export type TokenPayload = {
  organization: {
    id: string;
    name: string;
    subscriptionPlan: string;
    status: OrganizationStatus;
    serviceCountries: {
      id: string;
      code: string;
      currency: string;
      isActive: boolean;
    }[];
  };
  user: {
    id: string;
    email: string;
  };
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: Number(this.configService.getOrThrow('JWT_EXPIRES_IN')),
    });
  }
}
