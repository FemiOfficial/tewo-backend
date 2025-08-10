import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from './commands/impl/signup.command';
import {
  SendEmployeeInviteDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto/user.dto';
import { AuthResponse } from './dto/types';
import { VerifyEmailCommand } from './commands/impl/verify-email.command';

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
    sendEmployeeInviteDto: SendEmployeeInviteDto,
  ): Promise<AuthResponse> {
    return await this.commandBus.execute(
      new SendEmployeeInviteCommand(sendEmployeeInviteDto),
    );
  }
}
