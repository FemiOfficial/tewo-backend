import { SendEmployeeInviteDto } from '../../dto/user.dto';

export class SendEmployeeInviteCommand {
  constructor(
    public readonly sendEmployeeInviteDto: SendEmployeeInviteDto,
    public readonly organization: string,
  ) {}
}
