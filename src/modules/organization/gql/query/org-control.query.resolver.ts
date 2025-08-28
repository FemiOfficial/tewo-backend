import { OrgControlService } from '../../services/org-control.service';
import {
  ControlCategory,
  OrganizationControl,
  ControlWizard,
} from 'src/shared/db/typeorm/entities';
import { OrganizationControlStatus } from 'src/shared/db/typeorm/entities/organization-control.entity';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TokenPayload } from 'src/modules/token/guard/types';
import { GqlAuthGuard } from 'src/modules/token/guard/gql.quard';
import { UseGuards } from '@nestjs/common';
import { CurrentOrganization } from 'src/shared/custom-decorators/auth-decorator';
import { ControlService } from '../../services/control.service';
import { GetOrgFrameworksResultDto } from '../../dto/org-controls';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OrgControlQueryResolver {
  constructor(
    private readonly orgControlService: OrgControlService,
    private readonly controlService: ControlService,
  ) {}

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

  @Query(() => GetOrgFrameworksResultDto)
  async getOrgFrameworks(
    @CurrentOrganization() organization: TokenPayload['organization'],
  ) {
    const { id: organizationId } = organization;

    const result =
      await this.orgControlService.getOrgFrameworks(organizationId);
    return { frameworks: result };
  }

  @Query(() => [OrganizationControl])
  async getOrgControlsByCategory(
    @CurrentOrganization() organization: TokenPayload['organization'],
    @Args('categoryId', { type: () => String }) categoryId: string,
  ) {
    const { id: organizationId } = organization;

    return this.orgControlService.getOrgControls(
      organizationId,
      Number(categoryId),
    );
  }

  @Query(() => ControlWizard, { nullable: true })
  async getControlWizardByControlId(
    @CurrentOrganization() organization: TokenPayload['organization'],
    @Args('controlId') controlId: string,
    @Args('isDefault') isDefault: boolean,
  ) {
    return await this.controlService.getControlWizardByControlId(
      controlId,
      isDefault,
      organization.id,
    );
  }

  // @Query(() => [ControlWizardSchedule])
  // async getControlWizardSchedules(
  //   @CurrentOrganization() organization: TokenPayload['organization'],
  //   @Args('controlWizardId') controlWizardId: string,
  //   @Args('isDefault') isDefault: boolean,
  // ) {
  //   return await this.controlService.getControlWizardSchedules(
  //     controlWizardId,
  //     isDefault,
  //     organization.id,
  //   );
  // }

  // @Query(() => [ControlWizardForm])
  // async getControlWizardForms(
  //   @CurrentOrganization() organization: TokenPayload['organization'],
  //   @Args('controlWizardId') controlWizardId: string,
  //   @Args('isDefault') isDefault: boolean,
  // ) {
  //   return await this.controlService.getControlWizardForms(
  //     controlWizardId,
  //     isDefault,
  //     organization.id,
  //   );
  // }

  // @Query(() => [ControlWizardFormField])
  // async getControlWizardFormFields(
  //   @CurrentOrganization() organization: TokenPayload['organization'],
  //   @Args('controlWizardId') controlWizardId: string,
  //   @Args('formId') formId: string,
  //   @Args('isDefault') isDefault: boolean,
  // ) {
  //   return await this.controlService.getControlWizardFormFields(
  //     controlWizardId,
  //     formId,
  //     isDefault,
  //     organization.id,
  //   );
  // }

  // @Query(() => [ControlWizardDocument])
  // async getControlWizardDocuments(
  //   @CurrentOrganization() organization: TokenPayload['organization'],
  //   @Args('controlWizardId') controlWizardId: string,
  //   @Args('isDefault') isDefault: boolean,
  // ) {
  //   return await this.controlService.getControlWizardDocuments(
  //     controlWizardId,
  //     isDefault,
  //     organization.id,
  //   );
  // }
}
