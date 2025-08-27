import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './types';
import { AuthenticatedRequest } from './types';

@Injectable()
export class RestAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.cookies.access_token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        request.cookies.access_token,
        {
          secret,
        },
      );

      request.organization = payload.organization;
      request.user = payload.user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
