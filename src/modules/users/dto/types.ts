export type SignUpResponse = {
  success: boolean;
  data: {
    organization: {
      id: string;
      name: string;
      subscriptionPlan: string;
      status: string;
    };
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    serviceCountries: {
      code: string;
      currency: string;
      isActive: boolean;
    }[];
    token: string;
  };
};
