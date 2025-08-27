import { OrgControlService } from '../../services/org-control.service';
import { ControlCategory, Framework } from 'src/shared/db/typeorm/entities';
import { OrganizationControlStatus } from 'src/shared/db/typeorm/entities/organization-control.entity';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TokenPayload } from 'src/modules/token/guard/types';
import { GqlAuthGuard } from 'src/modules/token/guard/gql.quard';
import { UseGuards } from '@nestjs/common';
import { CurrentOrganization } from 'src/shared/custom-decorators/auth-decorator';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OrgControlQueryResolver {
  constructor(private readonly orgControlService: OrgControlService) {}

  @Query(() => [ControlCategory])
  async getOrgControlCategories(
    @CurrentOrganization() organization: TokenPayload['organization'],
    @Args('status', { type: () => OrganizationControlStatus, nullable: true })
    status?: OrganizationControlStatus,
  ) {
    const { id: organizationId } = organization;

    return this.orgControlService.getOrgControlCategories(
      organizationId,
      status,
    );
  }

  @Query(() => [Framework])
  async getOrgFrameworks(
    @CurrentOrganization() organization: TokenPayload['organization'],
  ) {
    const { id: organizationId } = organization;

    return this.orgControlService.getOrgFrameworks(organizationId);
  }
}
