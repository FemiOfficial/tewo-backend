import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EmployeeInviteCommand } from '../impl/employee-invite.command';
import { createId } from '@paralleldrive/cuid2';
import { DataSource, Repository } from 'typeorm';
import dayjs from 'dayjs';
import {
  AccessCodeType,
  Invite,
  User,
  UserRoles,
  AccessCode,
  InviteStatus,
} from '../../../../shared/db/typeorm/entities';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(EmployeeInviteCommand)
export class EmployeeInviteHandler
  implements ICommandHandler<EmployeeInviteCommand>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: Repository<User>,
    private readonly userRolesRepository: Repository<UserRoles>,
    private readonly inviteRepository: Repository<Invite>,
    private readonly accessCodeRepository: Repository<AccessCode>,
  ) {}

  async execute(command: EmployeeInviteCommand): Promise<{
    message: string;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const inviteExpiresAt = dayjs().add(1, 'day').toDate();

    try {
      const { email, firstName, lastName, role } = command.employeeInviteDto;

      const { organization } = command;

      const exisitingInvite = await queryRunner.manager.findOne(Invite, {
        where: {
          email,
          organizationId: organization,
        },
      });

      if (exisitingInvite && exisitingInvite.status === InviteStatus.ACCEPTED) {
        throw new BadRequestException('User already accepted the invite.');
      }

      if (
        exisitingInvite &&
        exisitingInvite.status === InviteStatus.PENDING &&
        dayjs().isBefore(dayjs(exisitingInvite.expiresAt))
      ) {
        // TODO: Send email to the user
        await queryRunner.commitTransaction();
        throw new BadRequestException(
          'Invite already sent to the user and it is still valid. Please user should check their email for the invite.',
        );
      }

      if (exisitingInvite) {
        await Promise.all([
          queryRunner.manager.update(
            Invite,
            { id: exisitingInvite.id },
            {
              status: InviteStatus.PENDING,
              expiresAt: inviteExpiresAt,
            },
          ),
          queryRunner.manager.update(
            AccessCode,
            { id: exisitingInvite.id },
            {
              expiresAt: inviteExpiresAt,
            },
          ),
        ]);

        await queryRunner.commitTransaction();
        return {
          message: 'Invite resent successfully',
        };
      }

      const accessCode = createId();

      const [accessCodeEntity, inviteEntity] = await Promise.all([
        this.accessCodeRepository.create({
          code: accessCode,
          type: AccessCodeType.EMPLOYEE_INVITE_SIGNUP,
          email,
          organization,
          expiresAt: inviteExpiresAt,
        }),
        this.inviteRepository.create({
          email,
          firstName,
          lastName,
          organizationId: organization,
          role,
          status: InviteStatus.PENDING,
          expiresAt: inviteExpiresAt,
        }),
      ]);

      await Promise.all([
        queryRunner.manager.save(accessCodeEntity),
        queryRunner.manager.save(inviteEntity),
      ]);

      // TODO: Send email to the user
      await queryRunner.commitTransaction();

      return {
        message: 'Invite sent successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
