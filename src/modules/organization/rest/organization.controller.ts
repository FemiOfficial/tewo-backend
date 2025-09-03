import { Body, Controller, Injectable, UseGuards } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { RestAuthGuard } from '../../token/guard/jwt.guard';

@Injectable()
@UseGuards(RestAuthGuard)
@Controller('organization')
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
