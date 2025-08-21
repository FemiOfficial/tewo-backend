import { ICommand } from '@nestjs/cqrs';

export class SetupControlWizardCommand implements ICommand {
  constructor(
    public readonly organizationId: string,
    public readonly controlWizardId: string,
  ) {}
}
