import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ControlCategory,
  Framework,
  OrganizationControl,
  OrganizationControlStatus,
  OrganizationFrameworks,
  OrganizationIntegration,
  SystemIntegration,
} from 'src/shared/db/typeorm/entities';
import { OrganizationIntegrationStatus } from 'src/shared/db/typeorm/entities/organization-integration.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrgControlService {
  constructor(
    @InjectRepository(OrganizationFrameworks)
    private readonly orgFrameworkRepository: Repository<OrganizationFrameworks>,
    @InjectRepository(OrganizationControl)
    private readonly orgControlRepository: Repository<OrganizationControl>,
    @InjectRepository(OrganizationIntegration)
    private readonly orgIntegrationRepository: Repository<OrganizationIntegration>,
    @InjectRepository(SystemIntegration)
    private readonly systemIntegrationRepository: Repository<SystemIntegration>,
    @InjectRepository(Framework)
    private readonly frameworkRepository: Repository<Framework>,
    @InjectRepository(ControlCategory)
    private readonly controlCategoryRepository: Repository<ControlCategory>,
  ) {}

  async getOrgFrameworks(organizationId: string) {
    return this.orgFrameworkRepository.find({
      where: {
        organizationId,
      },
      relations: ['framework', 'audits'],
    });
  }

  async getOrgAutomationIntegrations(
    organizationId: string,
    status?: OrganizationIntegrationStatus,
  ) {
    return this.orgIntegrationRepository.find({
      where: {
        organizationId,
        status,
      },
      relations: ['systemIntegration'],
    });
  }

  async getOrgControlCategories(
    organizationId: string,
    status?: OrganizationControlStatus,
  ) {
    const queryBuilder = this.orgControlRepository.createQueryBuilder(
      'organization_controls',
    );

    queryBuilder
      .select('DISTINCT organization_controls.categoryId', 'category')
      .where('organization_controls.organizationId = :organizationId', {
        organizationId,
      });

    if (status) {
      queryBuilder.andWhere('organization_controls.status = :status', {
        status,
      });
    }

    const results = await queryBuilder.getRawMany();

    return results.map((orgControl) => orgControl.category as ControlCategory);
  }

  async getOrgControls(organizationId: string, categoryId: number) {
    return this.orgControlRepository.find({
      where: {
        organizationId,
        categoryId,
      },
      relations: ['control', 'control.category'],
    });
  }
}
