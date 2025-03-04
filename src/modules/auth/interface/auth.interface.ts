export interface AuthResult {
  message: string;
  result?: boolean;
  data?: {
    user?: {
      firstName: string;
      lastName: string;
      email: string;
      role?: string;
    };
    accessToken: string;
  };
  error?: Object;
}

export interface LoginInput {
  email: string;
  password: string;
}
