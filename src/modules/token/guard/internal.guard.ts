import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { createHmac } from 'crypto';

@Injectable()
export class InternalGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const signature = request.headers['x-internal-signature'];

    if (!signature) {
      throw new UnauthorizedException('Internal Auth Signature is required');
    }

    const secret = this.configService.getOrThrow<string>('INTERNAL_SECRET');

    this.validateInternalRequest(secret, request);

    return true;
  }

  validateInternalRequest(internalSecret: string, request: Request) {
    const expectedSignature = createHmac('sha256', internalSecret)
      .update(JSON.stringify(request.body))
      .digest('hex');

    const actualSignature = request.headers['x-internal-signature'];

    if (expectedSignature !== actualSignature) {
      throw new UnauthorizedException('Invalid request signature');
    }
  }
}
