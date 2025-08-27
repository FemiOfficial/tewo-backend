import { Injectable } from '@nestjs/common';

import {
  Framework,
  OrganizationCountry,
  Control,
  ControlCategory,
  OrganizationFrameworks,
  OrganizationControl,
} from '../../../shared/db/typeorm/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
