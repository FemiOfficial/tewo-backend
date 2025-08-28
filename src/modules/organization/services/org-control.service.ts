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
import { DataSource, In, Repository } from 'typeorm';
import { OrgFrameworkWithCategoriesDto } from '../dto/org-controls';

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
    private readonly dataSource: DataSource,
  ) {}

  async getOrgFrameworks(
    organizationId: string,
  ): Promise<OrgFrameworkWithCategoriesDto[]> {
    const organizationFrameworks = await this.orgFrameworkRepository.find({
      where: {
        organizationId,
      },
      relations: [
        'framework',
        'framework.controlCategories',
        'framework.controlCategories.controls',
      ],
    });

    const categoryIds = organizationFrameworks.flatMap((orgFramework) =>
      orgFramework.framework.controlCategories.map(
        (controlCategory) => controlCategory.id,
      ),
    );

    const uniqueCategoryIds = [...new Set(categoryIds)];

    const allControlCategories = await this.controlCategoryRepository.find({
      where: {
        id: In(uniqueCategoryIds),
      },
      relations: ['frameworks'],
    });

    const allOrganizationControls = await this.orgControlRepository.find({
      where: {
        organizationId,
        categoryId: In(uniqueCategoryIds),
      },
      relations: ['control'],
    });

    const result = organizationFrameworks.map((framework) => {
      // get categories for the framework
      const categories = allControlCategories
        .filter((category) =>
          category.frameworks.some((f) => f.id === framework.frameworkId),
        )
        .map((category) => ({
          ...category,
          controls: allOrganizationControls.filter(
            (control) => control.categoryId === category.id,
          ),
        }));

      return {
        ...framework.framework,
        controlCategories: categories,
      };
    });

    return result;
  }

  async getOrgAutomationIntegrations(
    organizationId: string,
    status?: OrganizationIntegrationStatus,
  ): Promise<OrganizationIntegration[]> {
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
  ): Promise<ControlCategory[]> {
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

  async getOrgControls(
    organizationId: string,
    categoryId: number,
  ): Promise<OrganizationControl[]> {
    const result = await this.orgControlRepository.find({
      where: {
        organizationId,
        categoryId,
      },
      relations: ['control', 'category', 'assignedUser'],
    });

    return result;
  }

  async addOrganizationFrameworks(
    organizationId: string,
    frameworkIds: number[],
  ): Promise<OrganizationFrameworks[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      // check control already assigned to org and remove them from the list
      const existingOrgControls = await this.orgControlRepository.find({
        where: {
          organizationId,
          controlId: In(orgControls.map((control) => control.controlId)),
        },
      });

      const controlsToAdd = orgControls.filter(
        (control) =>
          !existingOrgControls.some((c) => c.controlId === control.controlId),
      );

      const promises: any[] = [this.orgFrameworkRepository.save(orgFrameworks)];

      if (controlsToAdd.length !== 0) {
        promises.push(this.orgControlRepository.save(controlsToAdd));
      }

      await Promise.all(promises);

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

      await queryRunner.commitTransaction();
      return allControlsSaved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
