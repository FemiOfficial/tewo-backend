export type AuthResponse = {
  requiresEmailVerification: boolean;
  requiresMFA: boolean;
  requireSignIn?: boolean;
  data: {
    organization: string;
    user: string;
  };
};
