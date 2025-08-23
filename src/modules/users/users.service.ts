import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from './commands/impl/signup.command';
import {
  EmployeeInviteDto,
  SignInDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto/user.dto';
import { AuthResponse } from './dto/types';
import { VerifyEmailCommand } from './commands/impl/verify-email.command';
import { EmployeeInviteCommand } from './commands/impl/employee-invite.command';
import { AcceptInviteCommand } from './commands/impl/accpet-invite.command';
import { SignInCommand } from './commands/impl/signin-command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AccessCode,
  AccessCodeType,
  User,
} from '../../shared/db/typeorm/entities';
import dayjs from 'dayjs';
import speakeasy from 'speakeasy';
@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AccessCode)
    private readonly accessCodeRepository: Repository<AccessCode>,
  ) {}

  async addUserWaitlistAccessCode(email: string) {
    const userEmailAlreadyAdded = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (userEmailAlreadyAdded) {
      throw new BadRequestException(
        'This email is already taken by an exisiting user',
      );
    }

    const userCodeAlreadySent = await this.accessCodeRepository.findOne({
      where: {
        email,
      },
    });

    if (userCodeAlreadySent) {
      throw new BadRequestException(
        'This email has already been sent an access code',
      );
    }

    const secret = speakeasy.generateSecret();
    const code = speakeasy.totp({
      secret: secret.ascii,
      encoding: 'ascii',
      digits: 6,
    });

    //TODO:  send code to user here

    const accessCode = this.accessCodeRepository.create({
      email,
      secret: secret.ascii,
      expiresAt: dayjs().add(1, 'day').toDate(),
      isUsed: false,
      type: AccessCodeType.SIGNUP,
    });

    await this.accessCodeRepository.save(accessCode);

    return { message: 'Waitlist access code has been sent to you email' };
  }

  async signup(signUpDto: SignUpDto): Promise<AuthResponse> {
    return await this.commandBus.execute(new SignUpCommand(signUpDto));
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<AuthResponse> {
    return await this.commandBus.execute(
      new VerifyEmailCommand(verifyEmailDto),
    );
  }

  async sendEmployeeInvite(
    employeeInviteDto: EmployeeInviteDto,
    organization: string,
    invitedBy: string,
  ): Promise<{ message: string; error: boolean }> {
    return await this.commandBus.execute(
      new EmployeeInviteCommand(employeeInviteDto, organization, invitedBy),
    );
  }

  async acceptInvite(accessCode: string): Promise<AuthResponse> {
    return await this.commandBus.execute(new AcceptInviteCommand(accessCode));
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    return await this.commandBus.execute(new SignInCommand(signInDto));
  }
}
