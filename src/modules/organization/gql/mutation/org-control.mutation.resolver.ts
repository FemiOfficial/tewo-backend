import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentOrganization } from 'src/shared/custom-decorators/auth-decorator';
import { TokenPayload } from 'src/modules/token/guard/types';
import { OrgControlService } from '../../services/org-control.service';
import { AddOrgFrameworksMutationResult } from '../../dto/organization.dto';
import {
  SelectOrganizationFrameworkDto,
  UpsertControlWizardDocumentDto,
} from '../../dto/org-controls';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/token/guard/gql.quard';
import { ControlWizardDocument } from 'src/shared/db/typeorm/entities';
import { ControlService } from '../../services/control.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OrgControlMutationResolver {
  constructor(
    private readonly orgControlService: OrgControlService,
    private readonly controlService: ControlService,
  ) {}

  @Mutation(() => AddOrgFrameworksMutationResult)
  async addOrganizationFrameworks(
    @CurrentOrganization() organization: TokenPayload['organization'],
    @Args('addOrganizationFrameworksInput')
    addOrganizationFrameworksInput: SelectOrganizationFrameworkDto,
  ) {
    const { id: organizationId } = organization;

    const result = await this.orgControlService.addOrganizationFrameworks(
      organizationId,
      addOrganizationFrameworksInput.frameworkIds,
    );

    return {
      success: true,
      message: 'Organization Frameworks added successfully',
      data: result,
    };
  }

  @Mutation(() => ControlWizardDocument)
  async upsertControlWizardDocument(
    @CurrentOrganization() organization: TokenPayload['organization'],
    @Args('controlWizardId') controlWizardId: string,
    @Args('upsertControlWizardDocumentInput')
    upsertControlWizardDocumentDto: UpsertControlWizardDocumentDto,
  ) {
    return this.controlService.upsertControlWizardDocument(
      organization.id,
      controlWizardId,
      upsertControlWizardDocumentDto,
    );
  }
}
