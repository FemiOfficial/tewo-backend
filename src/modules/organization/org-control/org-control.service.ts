import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationControl } from '../../../shared/db/typeorm/entities/organization-control.entity';

@Injectable()
export class OrgControlService {
  constructor(
    @InjectRepository(OrganizationControl)
    private readonly organizationControlRepository: Repository<OrganizationControl>,
  ) {}

  
}
