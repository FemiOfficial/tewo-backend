import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationControl } from '../../../shared/db/typeorm/entities/organization-control.entity';
import {
  SystemIntegration,
  SystemIntegrationCategory,
} from '../../../shared/db/typeorm/entities/system-integrations.entity';

@Injectable()
export class OrgControlService {
  constructor(
    @InjectRepository(OrganizationControl)
    private readonly organizationControlRepository: Repository<OrganizationControl>,
    @InjectRepository(SystemIntegration)
    private readonly systemIntegrationRepository: Repository<SystemIntegration>,
  ) {}

  async getSystemIntegrations(category: SystemIntegrationCategory) {
    const systemIntegrations = await this.systemIntegrationRepository.find({
      where: { category },
    });
    return systemIntegrations;
  }

  // access control management endpoints
  // get access system control categories
  // schedule access control review schedule and assign to a user (employee)
  // cancel a schedule
  // approve / decline a scheduled review
  // honor an assessment schedule

}
