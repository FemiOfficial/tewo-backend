import { Injectable, Req } from '@nestjs/common';
import { OrgControlService } from '../../services/org-control.service';
import { ControlCategory } from 'src/shared/db/typeorm/entities';
import { OrganizationControlStatus } from 'src/shared/db/typeorm/entities/organization-control.entity';
import { Args, Query } from '@nestjs/graphql';
import { AuthenticatedRequest } from 'src/shared/interfaces/authenticated-request.interface';

@Injectable()
export class OrgControlQueryResolver {
  constructor(private readonly orgControlService: OrgControlService) {}

  @Query(() => [ControlCategory])
  async getOrgControlCategories(
    @Args('status') status?: OrganizationControlStatus,
    @Req() req: AuthenticatedRequest,
  ) {
    const { organizationId } = req.user as { organizationId: string };

    return this.orgControlService.getOrgControlCategories(
      organizationId,
      status,
    );
  }
}
