export type AuthResponse = {
  requiresEmailVerification: boolean;
  requiresMFA: boolean;
  data: {
    organization: string;
    user: string;
  };
};
