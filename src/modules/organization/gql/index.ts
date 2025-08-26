import { OrgControlQueryResolver } from './query/org-control.query.resolver';
import { ControlQueryResolver } from './query/control.query.resolver';
import { ControlMutationResolver } from './mutation/control.mutation.resolver';

export const orgGqlResolvers = [
  OrgControlQueryResolver,
  ControlQueryResolver,
  ControlMutationResolver,
];
