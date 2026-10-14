import type { Role } from "../constants/roles";
import type { CommitteeCategory } from "../constants/roles";

interface DecodedToken {
  sub: string; // email, since that's what we set as the JWT subject
  id: string;
  role: Role;
  committeeId: string;
  exp: number; // expiration date
  iat: number; 
}

interface AuthUser {
  email: string;
  role: Role;
  committeeId: string;
  id: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

type User = {
  name: string,
  email: string,
  password: string,
  committee: CommitteeCategory | null,
  role: Role | null,
  number: number | null,
  year: number 
}

type FilledUser = {
  name: string,
  email: string,
  password: string,
  committee: CommitteeCategory,
  role: Role,
  number: number | null,
  year: number 
}

const emptyUser = {
  name: "",
  email: "",
  password: "",
  committee: null,
  role: null,
  number: null,
  year: 2026 // TODO: change to be dynamically picked
}

export type { DecodedToken, AuthUser, AuthContextValue }
export type { User, FilledUser }
export { emptyUser }