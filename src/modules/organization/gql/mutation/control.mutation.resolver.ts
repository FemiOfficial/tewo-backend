import { Mutation, Resolver } from '@nestjs/graphql';
import { ControlService } from '../../services/control.service';

@Resolver()
export class ControlMutationResolver {
  constructor(private readonly controlService: ControlService) {}

  // async addOrganizationFramework
}
