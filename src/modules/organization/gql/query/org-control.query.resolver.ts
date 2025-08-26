import { Resolver } from '@nestjs/graphql';

@Resolver()
export class OrgControlQueryResolver {
  constructor(private readonly orgControlService: OrgControlService) {}
} 