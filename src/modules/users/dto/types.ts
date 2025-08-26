import { TokenPayload } from '../../token/guard/types';

export type AuthResponse = {
  requiresEmailVerification: boolean;
  requiresMFA: boolean;
  requireSignIn?: boolean;
  token?: string;
  data: {
    organization: string;
    user: string;
  };
};

export type AuthAPIResponse = {
  requiresEmailVerification: boolean;
  requiresMFA: boolean;
  token?: string;
  tokenExpiry?: string;
  data: TokenPayload;
};
