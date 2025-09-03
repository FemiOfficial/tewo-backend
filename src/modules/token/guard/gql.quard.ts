import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GqlAuthError } from 'src/shared/exceptions/gql/gql-auth-error';
import { AuthenticatedRequest } from './types';
import { TokenPayload } from './types';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as AuthenticatedRequest;

    console.log('making gql auth guard check')
    console.log('request.cookies', request.cookies);

    if (!request.cookies.access_token) {
      throw new GqlAuthError();
    }

    const jwtPayload: TokenPayload = this.jwtService.verify(
      request.cookies.access_token,
      {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      },
    );

    if (!jwtPayload) {
      throw new GqlAuthError();
    }

    request.organization = jwtPayload.organization;
    request.user = jwtPayload.user;

    return true;
  }
}
