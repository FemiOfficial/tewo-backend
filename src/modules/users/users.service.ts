import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus) {}

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
  ): Promise<{ message: string; error: boolean }> {
    return await this.commandBus.execute(
      new EmployeeInviteCommand(employeeInviteDto, organization),
    );
  }

  async acceptInvite(accessCode: string): Promise<AuthResponse> {
    return await this.commandBus.execute(new AcceptInviteCommand(accessCode));
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    return await this.commandBus.execute(new SignInCommand(signInDto));
  }
}
