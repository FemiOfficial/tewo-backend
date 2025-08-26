import { Request } from 'express';
import { OrganizationStatus } from 'src/shared/db';

export type TokenPayload = {
  organization: {
    id: string;
    name: string;
    subscriptionPlan: string;
    status: OrganizationStatus;
    serviceCountries: {
      id: string;
      code: string;
      currency: string;
      isActive: boolean;
    }[];
  };
  user: {
    id: string;
    email: string;
    roles: {
      id: string;
      name: string;
    }[];
  };
};
export interface AuthenticatedRequest extends Request {
  organization: TokenPayload['organization'];
  user: TokenPayload['user'];
  cookies: { access_token: string; refresh_token: string };
}
