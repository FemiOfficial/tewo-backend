import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { TokenService } from '../../modules/token/token.service';
import { TokenPayload } from 'src/modules/token/guard/types';
import {
  Organization,
  OrganizationCountry,
  User,
  UserRoles,
} from '../db/typeorm/entities';
import { AuthAPIResponse, AuthResponse } from 'src/modules/users';
import { InjectRepository } from '@nestjs/typeorm';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { init } from '@paralleldrive/cuid2';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthInterceptor.name);
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(Organization)
    private organisationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(
        async (
          response: AuthResponse,
        ): Promise<AuthAPIResponse | AuthResponse> => {
          const __IS_DEV__ =
            this.configService.getOrThrow('NODE_ENV') === 'development';
          const cookieOptions: CookieOptions = {
            httpOnly: true,
            sameSite: __IS_DEV__ ? 'lax' : 'strict',
            secure: !__IS_DEV__,
            maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
            path: '/',
          };
          const { requiresEmailVerification, requiresMFA, data } = response;
          const { organization, user } = data;
          const httpResponse = context.switchToHttp().getResponse<Response>();

          const [organizationObj, userObj] = await Promise.all([
            this.getOrganization(organization),
            this.getUser(user),
          ]);

          if (!organizationObj || !userObj) {
            throw new InternalServerErrorException(
              'Something went wrong with request!',
            );
          }

          const tokenPayload = this.getAuthPayload(organizationObj, userObj);
          httpResponse.statusCode = 201;

          if (!requiresMFA && !requiresEmailVerification) {
            // generate the token here
            const { token } = await this.generateToken(tokenPayload);
            const refreshToken = init({ length: 24 })();

            await this.userRepository.update(userObj.id, {
              metadata: {
                refreshToken,
              },
            });

            httpResponse.cookie('access_token', token, cookieOptions);
            httpResponse.cookie('refresh_token', refreshToken, cookieOptions);
            httpResponse.statusCode = 200;

            return {
              ...response,
              token,
              tokenExpiry: this.configService.getOrThrow('JWT_EXPIRES_IN'),
              data: tokenPayload,
            };
          }

          return {
            ...response,
            data: tokenPayload,
          };
        },
      ),
    );
  }

  private async getOrganization(organization: string) {
    const organizationObj = await this.organisationRepository.findOne({
      where: {
        id: organization,
      },
      select: [
        'id',
        'name',
        'subscriptionPlan',
        'status',
        'organizationCountries',
      ],
      relations: ['organizationCountries.serviceCountry'],
    });

    return organizationObj;
  }

  private async getUser(user: string) {
    const userObj = await this.userRepository.findOne({
      where: {
        id: user,
      },
      select: ['id', 'email', 'userRoles'],
      relations: ['userRoles.role'],
    });

    return userObj;
  }

  private getAuthPayload(organizationObj: Organization, userObj: User) {
    return {
      organization: {
        id: organizationObj.id,
        name: organizationObj.name,
        subscriptionPlan: organizationObj.subscriptionPlan,
        status: organizationObj.status,
        serviceCountries: organizationObj.organizationCountries.map(
          (country: OrganizationCountry) => ({
            id: country.id,
            code: country.serviceCountry.code,
            currency: country.serviceCountry.currencyCode,
            isActive: country.serviceCountry.isActive,
          }),
        ),
      },
      user: {
        id: userObj.id,
        email: userObj.email,
        roles: userObj.userRoles.map((role: UserRoles) => {
          return {
            id: role.role.id,
            name: role.role.name,
          };
        }),
      },
    };
  }

  async generateToken(tokenPayload: TokenPayload) {
    const token = await this.tokenService.signToken(tokenPayload);

    return { token, tokenExpiry: process.env.JWT_EXPIRES_IN, tokenPayload };
  }
}
