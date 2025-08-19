import { ICommandHandler } from '@nestjs/cqrs';
import { generateSecret, totp } from 'speakeasy';
import { BadRequestException } from '@nestjs/common';
import { SignInCommand } from '../impl/signin-command';
import { CommandHandler } from '@nestjs/cqrs';
import { AuthResponse } from '../../dto/types';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/db/typeorm/entities';
import bcrypt from 'bcrypt';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: SignInCommand): Promise<AuthResponse> {
    const { email, password, token } = command.signInDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('Invalid user email');
      }

      if (!user.isEmailVerified) {
        throw new BadRequestException('Email not verified');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new BadRequestException('Invalid user password');
      }

      if (token) {
        await this.validateMFARequest(user, token, queryRunner);
        await queryRunner.commitTransaction();

        return {
          requiresEmailVerification: user.isEmailVerified,
          requiresMFA: false,
          data: {
            organization: user.organizationId,
            user: user.id,
          },
        };
      }

      const mfa = this.generateMFA();

      await queryRunner.manager.update(
        User,
        { id: user.id },
        {
          mfaSecret: mfa.secret,
        },
      );

      await queryRunner.commitTransaction();

      return {
        requiresEmailVerification: user.isEmailVerified,
        requiresMFA: true,
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

  private async validateMFARequest(
    user: User,
    token: string,
    queryRunner: QueryRunner,
  ) {
    const isValid = this.verifyMFA(user, token);

    if (!isValid) {
      throw new BadRequestException('Invalid token or expired');
    }

    await queryRunner.manager.update(
      User,
      { id: user.id },
      {
        mfaSecret: null,
      },
    );

    return true;
  }
  private generateMFA(): {
    secret: string;
    code: string;
  } {
    const secret = generateSecret({
      name: 'Tewo AI',
      issuer: 'Tewo AI',
    });

    const code = totp({
      secret: secret.ascii,
      encoding: 'ascii',
      digits: 6,
    });

    return {
      secret: secret.ascii,
      code,
    };
  }

  private verifyMFA(user: User, token: string): boolean {
    return totp.verify({
      secret: user.mfaSecret!,
      token,
      window: 10,
      encoding: 'ascii',
    });
  }
}
