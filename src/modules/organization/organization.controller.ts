import { Injectable } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Injectable()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // // endpoints here
  // // - get controls (show those in todo e.t.c)
  // -

  // // - get control categories
  // // - get frameworks
  // // update control
  // // delete control
  // // create control
}
