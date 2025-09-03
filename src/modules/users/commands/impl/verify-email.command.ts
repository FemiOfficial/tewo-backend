import { ICommand } from '@nestjs/cqrs';
import { VerifyEmailDto } from '../../dto/user.dto';

export class VerifyEmailCommand implements ICommand {
  constructor(public readonly verifyEmailDto: VerifyEmailDto) {}
}
