import { Field, ObjectType } from '@nestjs/graphql';
import { OrganizationFrameworks } from 'src/shared/db/typeorm/entities';
import { BaseMutationResult } from 'src/shared/types/gql/base-mutation-result.dto';

@ObjectType()
export class AddOrgFrameworksMutationResult extends BaseMutationResult {
  @Field(() => [OrganizationFrameworks], { nullable: true })
  data: OrganizationFrameworks[];
}
