import { Injectable } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Injectable()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
}
