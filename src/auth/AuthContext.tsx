import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { loginRequest } from "./authApi";
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

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwt(token: string): AuthUser {
  const decoded = jwtDecode<DecodedToken>(token);
  return { email: decoded.sub, role: decoded.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    const jwt = await loginRequest(email, password); // the function from block 1
    setToken(jwt);
    setUser(decodeJwt(jwt));
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}