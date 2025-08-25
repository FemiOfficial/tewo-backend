import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GqlAuthError } from 'src/shared/exceptions/gql/gql-auth-error';
// import { GqlAuthError } from 'src/shared/exceptions/gql/gql-auth-error';

interface AuthenticatedRequest extends Request {
  organization: TokenPayload['organization'];
  user: TokenPayload['user'];
  cookies: { access_token: string; refresh_token: string };
}

interface TokenPayload {
  organization: {
    id: string;
  };
  user: {
    id: string;
  };
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as AuthenticatedRequest;

    const jwtPayload: TokenPayload = this.jwtService.verify(
      request.cookies.access_token,
      {
        secret: this.configService.get('JWT_SECRET'),
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
