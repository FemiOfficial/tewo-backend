import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from './commands/impl/signup.command';
import { SignUpDto } from './dto/user.dto';
import { SignUpResponse } from './dto/types';

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus) {}

  async signup(signUpDto: SignUpDto): Promise<SignUpResponse> {
    return await this.commandBus.execute(new SignUpCommand(signUpDto));
  }
}
