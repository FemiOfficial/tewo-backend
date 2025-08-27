import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ControlCategory,
  Framework,
  FrameworkStatus,
  OrganizationControl,
  OrganizationControlStatus,
  OrganizationFrameworks,
  OrganizationIntegration,
  SystemIntegration,
} from 'src/shared/db/typeorm/entities';
import { OrganizationIntegrationStatus } from 'src/shared/db/typeorm/entities/organization-integration.entity';
import { In, Repository } from 'typeorm';

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

  async addOrganizationFrameworks(
    organizationId: string,
    frameworkIds: number[],
  ) {
    const frameworks = await this.frameworkRepository.find({
      where: {
        id: In(frameworkIds),
        status: FrameworkStatus.ACTIVE,
      },
      relations: ['controlCategories', 'controlCategories.controls'],
    });

    if (frameworks.length !== frameworkIds.length) {
      throw new BadRequestException(
        'Ensurre all frameworks selected are valid and active',
      );
    }

    // filter out frameworks that are already added to the organization
    const existingFrameworks = await this.orgFrameworkRepository.find({
      where: {
        organizationId,
        frameworkId: In(frameworkIds),
      },
    });

    const frameworksToAdd = frameworks.filter(
      (framework) =>
        !existingFrameworks.some((f) => f.frameworkId === framework.id),
    );

    if (frameworksToAdd.length === 0) {
      throw new BadRequestException(
        'All frameworks selected are already added to the organization',
      );
    }

    const orgFrameworks = frameworksToAdd.map((framework) => ({
      organizationId,
      frameworkId: framework.id,
    }));

    // save the controls for the frameworks selected
    const uniqueControlsFromSelectedFrameworks = frameworks.flatMap(
      (framework) => framework.controlCategories,
    );

    const uniqueControlCategories = [
      ...new Set(uniqueControlsFromSelectedFrameworks),
    ];

    const orgControls = uniqueControlCategories.flatMap((controlCategory) =>
      controlCategory.controls.map((control) => ({
        organizationId,
        controlId: control.id,
        categoryId: controlCategory.id,
      })),
    );

    const uniqueOrgControls = [...new Set(orgControls)];

    await Promise.all([
      this.orgFrameworkRepository.save(orgFrameworks),
      this.orgControlRepository.save(uniqueOrgControls),
    ]);

    const allControlsSaved = await this.orgFrameworkRepository.find({
      where: {
        organizationId,
      },
      relations: [
        'framework',
        'framework.controlCategories',
        'framework.controlCategories.controls',
      ],
    });

    return allControlsSaved;
  }
}
