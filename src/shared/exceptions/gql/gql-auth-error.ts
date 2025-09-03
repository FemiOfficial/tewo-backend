import { AuthenticationError } from 'apollo-server-express';

export class GqlAuthError extends AuthenticationError {
  constructor() {
    super('You are not authorized to access this API');
  }
}
