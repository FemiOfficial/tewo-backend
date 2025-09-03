import { ICommand } from '@nestjs/cqrs';
import { SignInDto } from '../../dto/user.dto';

export class SignInCommand implements ICommand {
  constructor(public readonly signInDto: SignInDto) {}
}
