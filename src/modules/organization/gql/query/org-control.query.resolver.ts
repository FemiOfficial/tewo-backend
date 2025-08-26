import { Injectable } from '@nestjs/common';
import { OrgControlService } from '../../services/org-control.service';
import { ControlCategory } from 'src/shared/db/typeorm/entities';
import { OrganizationControlStatus } from 'src/shared/db/typeorm/entities/organization-control.entity';
import { Args, Query } from '@nestjs/graphql';
import { CurrentOrganization } from 'src/shared/custom-decorators/auth-decorator';
import { TokenPayload } from 'src/modules/token/guard/types';

@Injectable()
export class OrgControlQueryResolver {
  constructor(private readonly orgControlService: OrgControlService) {}

  @Query(() => [ControlCategory])
  async getOrgControlCategories(
    @CurrentOrganization() organization: TokenPayload['organization'],
    @Args('status') status?: OrganizationControlStatus,
  ) {
    console.log(organization);
    const { id: organizationId } = organization;

    return this.orgControlService.getOrgControlCategories(
      organizationId,
      status,
    );
  }
}
