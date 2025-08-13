import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { TokenPayload, TokenService } from '../../modules/token/token.service';
import { Repository } from 'typeorm';
import {
  Organization,
  OrganizationCountry,
  User,
  UserRoles,
} from '../db/typeorm/entities';
import { AuthAPIResponse, AuthResponse } from 'src/modules/users';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(Organization)
    private organisationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(
        async (
          response: AuthResponse,
        ): Promise<AuthAPIResponse | AuthResponse> => {
          console.log(response);
          const { requiresEmailVerification, requiresMFA, data } = response;
          const { organization, user } = data;

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

          if (!requiresMFA && !requiresEmailVerification) {
            // generate the token here
            const { token } = await this.generateToken(tokenPayload);

            return {
              ...response,
              token,
              tokenExpiry: process.env.JWT_EXPIRES_IN,
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
