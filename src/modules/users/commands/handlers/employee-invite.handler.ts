import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { SendEmployeeInviteCommand } from '../impl/employee-invite.command';
import { AuthResponse } from '../../dto/types';
import { createId } from '@paralleldrive/cuid2';
import { DataSource, Repository } from 'typeorm';
import dayjs from 'dayjs';
import {
  AccessCodeType,
  Role,
  User,
  UserRoles,
  AccessCode,
} from '../../../../shared/db/typeorm/entities';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(SendEmployeeInviteCommand)
export class SendEmployeeInviteHandler
  implements ICommandHandler<SendEmployeeInviteCommand>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: Repository<User>,
    private readonly userRolesRepository: Repository<UserRoles>,
    private readonly accessCodeRepository: Repository<AccessCode>,
  ) {}

  async execute(command: SendEmployeeInviteCommand): Promise<AuthResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, firstName, lastName, role } =
        command.sendEmployeeInviteDto;

      const { organization } = command;

      const exisitngAccessCode = await this.accessCodeRepository.findOne({
        where: {
          email,
          type: AccessCodeType.EMPLOYEE_INVITE_SIGNUP,
          organization,
        },
      });

      if (exisitngAccessCode && !exisitngAccessCode.isUsed) {
        throw new BadRequestException('User already accepted the invite.');
      }

      if (
        exisitngAccessCode &&
        !exisitngAccessCode.isUsed &&
        dayjs().isBefore(dayjs(exisitngAccessCode.expiresAt))
      ) {
        // resend the invite
      }

      const accessCode = createId();
      const accessCodeEntity = this.accessCodeRepository.create({
        code: accessCode,
        type: AccessCodeType.EMPLOYEE_INVITE_SIGNUP,
        email,
        expiresAt: dayjs().add(1, 'day').toDate(),
      });

      await queryRunner.manager.save(accessCodeEntity);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
