import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  SystemIntegration,
  SystemIntegrationCategory,
} from '../../../../shared/db/typeorm/entities';
import { OrgControlService } from '../../services/org-control.service';
import {
  GetAutomationIntegrationCategoriesInputDto,
  GetAutomationIntegrationsInputDto,
} from '../../dto/org-controls';

@Resolver()
export class OrgControlQueryResolver {
  constructor(private readonly orgControlService: OrgControlService) {}
  @Query(() => [SystemIntegration])
  async getAutomationIntegrations(
    @Args('getAutomationIntegrationsInput')
    getAutomationIntegrationsInput: GetAutomationIntegrationsInputDto,
  ) {
    return this.orgControlService.getSystemIntegrations(
      getAutomationIntegrationsInput.category,
    );
  }

  @Query(() => [SystemIntegrationCategory])
  async getAutomationIntegrationCategories(
    @Args('getAutomationIntegrationCategoriesInput')
    getAutomationIntegrationCategoriesInput: GetAutomationIntegrationCategoriesInputDto,
  ) {
    return this.orgControlService.getSystemIntegrationCategories(
      getAutomationIntegrationCategoriesInput.active,
    );
  }
}
