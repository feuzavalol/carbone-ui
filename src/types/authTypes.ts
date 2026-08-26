import type { Role } from "../constants/roles";

interface DecodedToken {
  sub: string; // email, since that's what we set as the JWT subject
  role: Role;
  exp: number; // expiration date
  iat: number; 
}

interface AuthUser {
  email: string;
  role: Role;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export type { DecodedToken, AuthUser, AuthContextValue }