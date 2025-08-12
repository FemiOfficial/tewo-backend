import { EmployeeInviteDto } from '../../dto/user.dto';

export class EmployeeInviteCommand {
  constructor(
    public readonly employeeInviteDto: EmployeeInviteDto,
    public readonly organization: string,
    public readonly invitedBy: string,
  ) {}
}
