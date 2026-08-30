import type { CommitteeCategory, Role } from "../constants/roles";

interface LoginResponse {
  token: string;
}

interface ApiError {
  error?: string;
  message?: string;
}

interface BaseRegisterRequest { // For visiteurs only
  username: string,
  email: string,
  password: string
}

interface RegisterRequest {
  username: string,
  email: string,
  password: string
  role: Role,
  committeeCategory: CommitteeCategory,
  year: number,
  committeeNumber: number
}

async function loginRequest(email: string, password: string): Promise<string> {
  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
        const data: ApiError = await res.json().catch(() => ({}));
        throw new Error(data.message ?? data.error ?? `Request failed (${res.status})`);
      }

  const data: LoginResponse = await res.json();
  return data.token;
}

async function baseRegisterRequest(username: string, email: string, password: string){
  const request: BaseRegisterRequest = {username, email, password}
  const res = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
        const data: ApiError = await res.json().catch(() => ({}));
        throw new Error(data.message ?? data.error ?? `Request failed (${res.status})`);
      }

  const data: LoginResponse = await res.json();
  return data.token;
}

async function adminRegisterRequest(username: string, email: string, password: string, role: Role, committeeCategory: CommitteeCategory, year: number, committeeNumber: number | undefined): Promise<string> {
  if (committeeNumber == undefined){
    committeeNumber = 0;
  }
  const request: RegisterRequest = {username, email, password, role, committeeCategory, year, committeeNumber}
  console.log(JSON.stringify(request));
  const res = await fetch("http://localhost:8080/auth/registerAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
        const data: ApiError = await res.json().catch(() => ({}));
        throw new Error(data.message ?? data.error ?? `Request failed (${res.status})`);
      }

  const data: LoginResponse = await res.json();
  return data.token;
}

export { loginRequest, baseRegisterRequest, adminRegisterRequest}