import { Injectable, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Injectable()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('setup')
  async setup(@Body() setupOrganizationDto: SetupOrganizationDto) {
    return this.organizationService.setup(setupOrganizationDto);
  }
}