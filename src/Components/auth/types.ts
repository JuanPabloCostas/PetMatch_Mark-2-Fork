import { SignInResponse } from 'next-auth/react';

export interface CustomSignInResponse extends SignInResponse {
  user?: {
    isAdmin: boolean;
  } | null;
}