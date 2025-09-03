import { ICommand } from '@nestjs/cqrs';
import { SignUpDto } from '../../dto/user.dto';

export class SignUpCommand implements ICommand {
  constructor(public readonly signUpDto: SignUpDto) {}
}
