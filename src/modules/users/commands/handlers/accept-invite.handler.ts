import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { AcceptInviteCommand } from '../impl/accpet-invite.command';
import { DataSource, Repository } from 'typeorm';
import { AccessCode } from 'src/shared/db/typeorm/entities/access-code.entity';
import { AccessCodeType } from 'src/shared/db/typeorm/entities/access-code.entity';
import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';
import {
  UserRoles,
  User,
  Invite,
  InviteStatus,
} from '../../../../shared/db/typeorm/entities';
import { AuthResponse } from '../../dto/types';

@CommandHandler(AcceptInviteCommand)
export class AcceptInviteHandler
  implements ICommandHandler<AcceptInviteCommand>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: Repository<User>,
    private readonly userRolesRepository: Repository<UserRoles>,
  ) {}

  async execute(command: AcceptInviteCommand): Promise<AuthResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const accessCode = await queryRunner.manager.findOne(AccessCode, {
        where: {
          code: command.accessCode,
        },
      });
      if (!accessCode) {
        throw new BadRequestException('Invalid access code');
      }
      if (accessCode.type !== AccessCodeType.EMPLOYEE_INVITE_SIGNUP) {
        throw new BadRequestException('Invalid access code');
      }

      if (
        accessCode.expiresAt &&
        dayjs().isAfter(dayjs(accessCode.expiresAt))
      ) {
        throw new BadRequestException(
          'Access code has expired, please request for another invite',
        );
      }

      const invite = await queryRunner.manager.findOne(Invite, {
        where: {
          email: accessCode.email,
          organizationId: accessCode.organization,
          status: InviteStatus.PENDING,
        },
      });
      if (!invite) {
        throw new BadRequestException('Invalid access code');
      }

      if (dayjs().isAfter(dayjs(invite.expiresAt))) {
        throw new BadRequestException('Invite has expired');
      }

      const user = this.userRepository.create({
        email: accessCode.email,
        firstName: invite.firstName,
        lastName: invite.lastName,
        organizationId: invite.organizationId,
      });

      const userRoles = this.userRolesRepository.create({
        roleId: invite.role,
        userId: user.id,
        organizationId: invite.organizationId,
      });

      await Promise.all([
        queryRunner.manager.save(user),
        queryRunner.manager.save(userRoles),
        queryRunner.manager.update(
          Invite,
          { id: invite.id },
          {
            status: InviteStatus.ACCEPTED,
          },
        ),
        queryRunner.manager.update(
          AccessCode,
          { id: accessCode.id },
          {
            isUsed: true,
          },
        ),
      ]);

      await queryRunner.commitTransaction();
      return {
        requiresEmailVerification: false,
        requiresMFA: false,
        requireSignIn: true,
        data: {
          organization: user.organizationId,
          user: user.id,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
