import { BadRequestException, Injectable } from '@nestjs/common';

import {
  Framework,
  OrganizationCountry,
  Control,
  ControlCategory,
  OrganizationFrameworks,
  OrganizationControl,
} from '../../../shared/db/typeorm/entities';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectOrganizationFrameworkDto } from '../dto/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationCountry)
    private readonly organizationCountryRepository: Repository<OrganizationCountry>,
    @InjectRepository(Framework)
    private readonly frameworkRepository: Repository<Framework>,
    @InjectRepository(Control)
    private readonly controlRepository: Repository<Control>,
    @InjectRepository(ControlCategory)
    private readonly controlCategoryRepository: Repository<ControlCategory>,
    @InjectRepository(OrganizationFrameworks)
    private readonly organizationFrameworkRepository: Repository<OrganizationFrameworks>,
    @InjectRepository(OrganizationControl)
    private readonly organizationControlRepository: Repository<OrganizationControl>,
  ) {}

  async getOrganizationCountries(organizationId: string) {
    const organizationCountries = await this.organizationCountryRepository.find(
      {
        where: { organizationId, isActive: true },
        relations: ['serviceCountry', 'organization'],
      },
    );

    return organizationCountries.map((oc) => ({
      organization: {
        id: oc.organization.id,
        name: oc.organization.name,
        subscriptionPlan: oc.organization.subscriptionPlan,
        status: oc.organization.status,
      },
      country: {
        code: oc.serviceCountry.code,
        name: oc.serviceCountry.name,
        currency: oc.serviceCountry.currency,
        status: oc.status,
        isActive: oc.isActive,
      },
    }));
  }

  async getFrameAllWorks() {
    const frameworks = await this.frameworkRepository.find({
      where: {},
      relations: ['controlCategories', 'controlCategories.controls'],
    });

    return frameworks;
  }

  async getOrgFrameworks(
    organizationId: string,
  ): Promise<{ id: string; name: string; shortCode: string }[]> {
    const frameworks = await this.organizationFrameworkRepository.find({
      where: { organizationId },
      relations: ['framework'],
    });

    const result = frameworks.map((orgFramework: OrganizationFrameworks) => {
      return {
        id: orgFramework.id,
        name: orgFramework.framework.name,
        shortCode: orgFramework.framework.shortCode,
      };
    });

    return result;
  }

  async selectOrganizationFramework(
    selectOrganizationFrameworkDto: SelectOrganizationFrameworkDto,
    organizationId: string,
  ) {
    const frameworks = await this.frameworkRepository.find({
      where: {
        id: In(selectOrganizationFrameworkDto.frameworkIds),
      },
      relations: ['controlCategories', 'controlCategories.controls'],
    });

    if (
      frameworks.length !== selectOrganizationFrameworkDto.frameworkIds.length
    ) {
      throw new BadRequestException('Invalid framework ids');
    }

    const organizationFrameworks = frameworks.map((framework) => ({
      organizationId,
      frameworkId: framework.id,
    }));

    const orgControls: Partial<OrganizationControl>[] = [];

    frameworks.map((framework) => {
      const controls = framework.controlCategories.map((category) => {
        return category.controls.map((control) => {
          orgControls.push({
            organizationId,
            controlId: control.id,
            categoryId: category.id,
            status: 'to_do',
          });
        });
      });

      return controls;
    });

    await Promise.all([
      this.organizationFrameworkRepository.save(organizationFrameworks),
      this.organizationControlRepository.save(orgControls),
    ]);

    return this.getOrgFrameworks(organizationId);
  }

  async getOrganizationControlCategories(organizationId: string) {
    const organizationFrameworks =
      await this.organizationFrameworkRepository.find({
        where: { organizationId },
        relations: ['framework', 'framework.controlCategories'],
      });

    return organizationFrameworks.map((orgFramework) => ({
      id: orgFramework.id,
      name: orgFramework.framework.name,
      shortCode: orgFramework.framework.shortCode,
      controlCategories: orgFramework.framework.controlCategories.map(
        (category) => ({
          id: category.id,
          name: category.name,
          controls: category.controls,
        }),
      ),
    }));
  }

  async getOrganizationControls(organizationId: string, categoryId: string) {
    const organizationControls = await this.organizationControlRepository.find({
      where: { organizationId, categoryId: Number(categoryId) },
    });

    return organizationControls;
  }
}
