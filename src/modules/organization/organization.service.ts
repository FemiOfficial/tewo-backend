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
        relations: ['serviceCountry'],
      },
    );

    return organizationCountries.map((oc) => ({
      countryCode: oc.serviceCountry.code,
      countryName: oc.serviceCountry.name,
      status: oc.status,
      isActive: oc.isActive,
    }));
  }
}
