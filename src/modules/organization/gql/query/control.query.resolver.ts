import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  Framework,
  FrameworkStatus,
  SystemIntegration,
  SystemIntegrationCategory,
  ControlCategory,
} from '../../../../shared/db/typeorm/entities';
import { ControlService } from '../../services/control.service';
import {
  GetAutomationIntegrationCategoriesInputDto,
  GetAutomationIntegrationsInputDto,
} from '../../dto/org-controls';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/token/guard/gql.quard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ControlQueryResolver {
  constructor(private readonly controlService: ControlService) {}
  @Query(() => [SystemIntegration])
  async getAutomationIntegrations(
    @Args('getAutomationIntegrationsInput')
    getAutomationIntegrationsInput: GetAutomationIntegrationsInputDto,
  ) {
    return this.controlService.getSystemIntegrations(
      getAutomationIntegrationsInput.category,
      getAutomationIntegrationsInput.status,
    );
  }

  @Query(() => [SystemIntegrationCategory])
  async getAutomationIntegrationCategories(
    @Args('getAutomationIntegrationCategoriesInput')
    getAutomationIntegrationCategoriesInput: GetAutomationIntegrationCategoriesInputDto,
  ) {
    return this.controlService.getSystemIntegrationCategories(
      getAutomationIntegrationCategoriesInput.status,
    );
  }

  @Query(() => [Framework])
  async getFrameworks(
    @Args('status', { type: () => FrameworkStatus, nullable: true })
    status?: FrameworkStatus,
  ) {
    return this.controlService.getFrameworks(status || FrameworkStatus.ACTIVE);
  }

  @Query(() => [ControlCategory])
  async getUniqueControlCategoriesByFrameworks(
    @Args('frameworkIds', { type: () => [Number] }) frameworkIds: number[],
  ) {
    return this.controlService.getUniqueControlCategoriesByFrameworks(
      frameworkIds,
    );
  }

  // @Query(() => [ControlCategory])
  // async getUniqueControlCategoriesByFramework(
  //   @Args('frameworkId') frameworkId: string,
  // ) {
  //   return this.orgControlService.getUniqueControlCategoriesByFramework(
  //     frameworkId,
  //   );
  // }
}
