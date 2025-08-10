import * as bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '../impl/signup.command';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import {
  AccessCode,
  AccessCodeType,
  Organization,
  OrganizationCountry,
  OrganizationCountryStatus,
  Role,
  ServiceCountry,
  User,
  UserRoles,
} from '../../../../shared/db/typeorm/entities';
import {
  TokenPayload,
  TokenService,
  TokenUserRoles,
} from '../../../token/token.service';
import { BadRequestException } from '@nestjs/common';
import { SignUpDto } from 'src/modules/users/dto/user.dto';
import { AuthResponse } from '../../dto/types';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly userRolesRepository: Repository<UserRoles>,
    private readonly roleRepository: Repository<Role>,
    private readonly accessCodeRepository: Repository<AccessCode>,
    private readonly organizationRepository: Repository<Organization>,
    private readonly serviceCountryRepository: Repository<ServiceCountry>,
    private readonly organizationCountryRepository: Repository<OrganizationCountry>,
    private readonly tokenService: TokenService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: SignUpCommand): Promise<AuthResponse> {
    const { firstName, lastName, countryCode, email, code, password } =
      command.signUpDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.assertUserEmail(email);
      const accessCode = await this.assertSetupAccessCode(code, email);
      const serviceCountry = await this.assertCountryCode(countryCode);

      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
      });
      const savedUser = await queryRunner.manager.save(user);

      // Create organization
      const savedOrganization = await this.createUserOrganization(
        savedUser,
        command.signUpDto,
        serviceCountry,
        queryRunner,
      );

      // Assign user role
      await this.assignUserRole(savedUser, 'owner', queryRunner);

      // Mark access code as used
      await queryRunner.manager.update(
        AccessCode,
        { code: accessCode, email: email },
        { isUsed: true },
      );

      await this.sendVerifyEmailNotification(email);
      await queryRunner.commitTransaction();

      return {
        requiresEmailVerification: true,
        requiresMFA: false,
        data: {
          organization: savedOrganization.id,
          user: savedUser.id,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createUserOrganization(
    user: User,
    signUpDto: SignUpDto,
    serviceCountry: ServiceCountry,
    queryRunner: QueryRunner,
  ) {
    const organization = this.organizationRepository.create({
      name: signUpDto.organizationName,
      subscriptionPlan: 'free_tier',
      ownerId: user.id,
    });
    const savedOrganization = await queryRunner.manager.save(organization);

    const organizationCountry = this.organizationCountryRepository.create({
      organizationId: savedOrganization.id,
      serviceCountryId: serviceCountry.id,
      status: OrganizationCountryStatus.PRIMARY,
      isActive: true,
    });
    await queryRunner.manager.save(organizationCountry);
    return savedOrganization;
  }

  private async assignUserRole(
    user: User,
    role: 'owner',
    queryRunner: QueryRunner,
  ): Promise<TokenUserRoles[]> {
    const roleObject = await this.roleRepository.findOne({
      where: { name: role },
    });

    if (!roleObject) {
      throw new BadRequestException('Could not assign role to user');
    }

    const userRole = this.userRolesRepository.create({
      userId: user.id,
      roleId: roleObject.id,
    });

    await queryRunner.manager.save(userRole);

    const userRoles = await queryRunner.manager.find(UserRoles, {
      where: { userId: user.id },
      relations: ['role', 'user', 'role.permissions'],
    });

    const roles = userRoles.map((userRole) => ({
      id: userRole.id,
      name: userRole.role.name,
      permissions: userRole.role.permissions
        .map((permission) => permission.keys)
        .flat(),
    }));

    return roles as unknown as TokenUserRoles[];
  }

  private async generateTokenPayload(
    organization: Organization,
    user: User,
    userRoles: TokenUserRoles[],
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
        roles: userRoles,
      },
    };
  }

  private async assertUserEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    return false;
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

  private async sendVerifyEmailNotification(
    email: string,
  ): Promise<AccessCode> {
    const accessCode = this.accessCodeRepository.create({
      email: email,
      type: AccessCodeType.VERIFY_EMAIL,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    await this.accessCodeRepository.save(accessCode);

    // TODO: Send email notification

    return accessCode;
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
