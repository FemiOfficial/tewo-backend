import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseMutationResult {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
export class GenericStringMutationResult extends BaseMutationResult {
  @Field(() => String, { nullable: true })
  data?: string;
}

@ObjectType()
export class GenericNumberMutationResult extends BaseMutationResult {
  @Field(() => Number, { nullable: true })
  data?: number;
}

@ObjectType()
export class GenericBooleanMutationResult extends BaseMutationResult {
  @Field(() => Boolean, { nullable: true })
  data?: boolean;
}
