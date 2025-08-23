import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '../impl/verify-email.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  User,
  AccessCode,
  AccessCodeType,
} from '../../../../shared/db/typeorm/entities';
import { BadRequestException } from '@nestjs/common';
import { AuthResponse } from '../../dto/types';
import * as speakeasy from 'speakeasy';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AccessCode)
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

    const isValid = speakeasy.totp.verify({
      secret: accessCode.secret,
      encoding: 'ascii',
      token: code,
      window: 10,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.userRepository.update(accessCode.id, {
      isEmailVerified: true,
      updatedAt: new Date(),
    });

    await this.accessCodeRepository.update(accessCode.id, {
      isUsed: true,
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
