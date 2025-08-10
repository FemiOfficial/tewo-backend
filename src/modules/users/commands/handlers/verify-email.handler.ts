import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '../impl/verify-email.command';
import { Repository } from 'typeorm';
import { User } from 'src/shared/db/typeorm/entities';
import {
  AccessCode,
  AccessCodeType,
} from 'src/shared/db/typeorm/entities/access-code.entity';
import { BadRequestException } from '@nestjs/common';
import { AuthResponse } from '../../dto/types';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly accessCodeRepository: Repository<AccessCode>,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<AuthResponse> {
    const { email, code } = command.verifyEmailDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['organization'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const accessCode = await this.accessCodeRepository.findOne({
      where: { email, code, type: AccessCodeType.VERIFY_EMAIL },
    });

    if (!accessCode) {
      throw new BadRequestException('Invalid access code');
    }

    if (accessCode.expiresAt < new Date()) {
      throw new BadRequestException('Access code has expired');
    }

    await this.userRepository.update(accessCode.email, {
      isEmailVerified: true,
      updatedAt: new Date(),
    });

    await this.accessCodeRepository.update(accessCode.id, {
      isUsed: true,
      updatedAt: new Date(),
    });

    return {
      requiresEmailVerification: false,
      requiresMFA: false,
      data: {
        organization: user.organization.id,
        user: user.id,
      },
    };
  }
}
