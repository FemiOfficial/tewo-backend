import { OrgControlQueryResolver } from './query/org-control.query.resolver';
import { ControlQueryResolver } from './query/control.query.resolver';
import { OrgControlMutationResolver } from './mutation/org-control.mutation.resolver';

export const orgGqlResolvers = [
  OrgControlQueryResolver,
  ControlQueryResolver,
  OrgControlMutationResolver,
];
