import { BadRequestException, Injectable } from '@nestjs/common';

import {
  OrganizationCountryStatus,
  Organization,
  AccessCode,
  ServiceCountry,
  OrganizationCountry,
  User,
} from '../../shared/db/typeorm/entities';
import { Repository, DataSource } from 'typeorm';
import { SetupOrganizationDto } from './dto/organization.dto';
import { TokenPayload, TokenService } from '../token/token.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: Repository<Organization>,
    private readonly accessCodeRepository: Repository<AccessCode>,
    private readonly serviceCountryRepository: Repository<ServiceCountry>,
    private readonly organizationCountryRepository: Repository<OrganizationCountry>,
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly dataSource: DataSource,
  ) {}

  async setup(setupOrganizationDto: SetupOrganizationDto) {
    const { firstName, lastName, countryCode, organizationName, email, code } =
      setupOrganizationDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const accessCode = await this.assertSetupAccessCode(code, email);
      const serviceCountry = await this.assertCountryCode(countryCode);

      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
      });
      const savedUser = await queryRunner.manager.save(user);

      // Create organization
      const organization = this.organizationRepository.create({
        name: organizationName,
        subscriptionPlan: 'free_tier',
        ownerId: savedUser.id,
      });
      const savedOrganization = await queryRunner.manager.save(organization);

      const organizationCountry = this.organizationCountryRepository.create({
        organizationId: savedOrganization.id,
        serviceCountryId: serviceCountry.id,
        status: OrganizationCountryStatus.PRIMARY,
        isActive: true,
      });
      await queryRunner.manager.save(organizationCountry);

      // Mark access code as used
      await queryRunner.manager.update(
        AccessCode,
        { code: accessCode, email: email },
        { isUsed: true },
      );

      const tokenPayload = await this.generateTokenPayload(
        savedOrganization,
        savedUser,
      );
      const token = await this.tokenService.signToken(tokenPayload);

      await queryRunner.commitTransaction();

      return {
        success: true,
        data: {
          organization: savedOrganization,
          user: savedUser,
          serviceCountry,
          token,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // async addCountryToOrganization(organizationId: string, countryCode: string) {
  //   // Verify organization exists
  //   const organization = await this.organizationRepository.findOne({
  //     where: { id: organizationId },
  //   });

  //   if (!organization) {
  //     throw new BadRequestException('Organization not found');
  //   }

  //   // Verify country exists and is active
  //   await this.assertCountryCode(countryCode);

  //   const serviceCountry = await this.serviceCountryRepository.findOne({
  //     where: { code: countryCode },
  //   });

  //   // Check if organization already has this country
  //   const existingOrgCountry = await this.organizationCountryRepository.findOne(
  //     {
  //       where: {
  //         organizationId,
  //         serviceCountryId: serviceCountry.id,
  //       },
  //     },
  //   );

  //   if (existingOrgCountry) {
  //     throw new BadRequestException(
  //       `Organization already operates in ${countryCode}`,
  //     );
  //   }

  //   // Add the country to organization
  //   const organizationCountry = this.organizationCountryRepository.create({
  //     organizationId,
  //     serviceCountryId: serviceCountry.id,
  //     status: 'secondary', // Additional countries are secondary
  //   });

  //   await this.organizationCountryRepository.save(organizationCountry);

  //   return { success: true, message: `Added ${countryCode} to organization` };
  // }

  async getOrganizationCountries(organizationId: string) {
    const organizationCountries = await this.organizationCountryRepository.find(
      {
        where: { organizationId, isActive: true },
        relations: ['serviceCountry'],
      },
    );

    return organizationCountries.map((oc) => ({
      countryCode: oc.serviceCountry.code,
      countryName: oc.serviceCountry.name,
      status: oc.status,
      isActive: oc.isActive,
    }));
  }

  private async generateTokenPayload(
    organization: Organization,
    user: User,
  ): Promise<TokenPayload> {
    const serviceCountries = await this.organizationCountryRepository.find({
      where: { organizationId: organization.id, isActive: true },
      relations: ['serviceCountry'],
    });

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        subscriptionPlan: organization.subscriptionPlan,
        status: organization.status,
        serviceCountries: serviceCountries.map((sc) => ({
          id: sc.serviceCountry.id,
          code: sc.serviceCountry.code,
          currency: sc.serviceCountry.currency,
          isActive: sc.isActive,
        })),
      },
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private async assertCountryCode(
    countryCode: string,
  ): Promise<ServiceCountry> {
    const serviceCountry = await this.serviceCountryRepository.findOne({
      where: { code: countryCode },
    });

    if (!serviceCountry) {
      throw new BadRequestException(
        `Country with code ${countryCode} not found`,
      );
    }

    if (!serviceCountry.isActive) {
      throw new BadRequestException(
        `Country ${countryCode} is currently not available`,
      );
    }

    return serviceCountry;
  }

  private async assertSetupAccessCode(
    code: string,
    email: string,
  ): Promise<AccessCode> {
    const accessCode = await this.accessCodeRepository.findOne({
      where: {
        code: code,
        email: email,
      },
    });

    if (!accessCode) {
      throw new BadRequestException(
        'Invalid access code, please contact our support team to request access',
      );
    }

    if (accessCode.expiresAt < new Date()) {
      throw new BadRequestException(
        'Access code has expired, please contact our support team to request access',
      );
    }

    if (accessCode.isUsed) {
      throw new BadRequestException(
        'Access code has already been used, please contact our support team to request access',
      );
    }

    return accessCode;
  }
}
