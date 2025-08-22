import { Controller } from '@nestjs/common';
import { OrgControlService } from './org-control.service';

@Controller('organization/control/wizard')
export class OrgControlController {
  constructor(private readonly orgControlService: OrgControlService) {}
}
