import { Injectable } from '@nestjs/common';

import { OrganizationCountry } from '../../shared/db/typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationCountryRepository: Repository<OrganizationCountry>,
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
}
