import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  Framework,
  FrameworkStatus,
  SystemIntegration,
  SystemIntegrationCategory,
  Control,
} from '../../../../shared/db/typeorm/entities';
import { OrgControlService } from '../../services/org-control.service';
import {
  GetAutomationIntegrationCategoriesInputDto,
  GetAutomationIntegrationsInputDto,
} from '../../dto/org-controls';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/token/guard/gql.quard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OrgControlQueryResolver {
  constructor(private readonly orgControlService: OrgControlService) {}
  @Query(() => [SystemIntegration])
  async getAutomationIntegrations(
    @Args('getAutomationIntegrationsInput')
    getAutomationIntegrationsInput: GetAutomationIntegrationsInputDto,
  ) {
    return this.orgControlService.getSystemIntegrations(
      getAutomationIntegrationsInput.category,
      getAutomationIntegrationsInput.status,
    );
  }

  @Query(() => [SystemIntegrationCategory])
  async getAutomationIntegrationCategories(
    @Args('getAutomationIntegrationCategoriesInput')
    getAutomationIntegrationCategoriesInput: GetAutomationIntegrationCategoriesInputDto,
  ) {
    return this.orgControlService.getSystemIntegrationCategories(
      getAutomationIntegrationCategoriesInput.status,
    );
  }

  @Query(() => [Framework])
  async getFrameworks(
    @Args('status', { nullable: true }) status?: FrameworkStatus,
  ) {
    return this.orgControlService.getFrameworks(
      status || FrameworkStatus.ACTIVE,
    );
  }

  @Query(() => [Control])
  async getControlsByFramework(@Args('frameworkId') frameworkId: string) {
    return this.orgControlService.getControlsByFramework(frameworkId);
  }
}
