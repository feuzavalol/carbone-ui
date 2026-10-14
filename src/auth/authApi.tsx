import type { CommitteeCategory, Role } from "../constants/roles";
import { API_URL } from "../constants/url";
import type { FilledUser } from "../types/authTypes";

interface LoginResponse {
  success: boolean,
  token: string,
  message: string
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
  const res = await fetch(`${API_URL}/auth/login`, {
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
  console.log("We're trying to register");
  const request: BaseRegisterRequest = {username, email, password}
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  console.log(res);
  if (!res.ok) {
        const data: ApiError = await res.json().catch(() => ({}));
        throw new Error(data.message ?? data.error ?? `Request failed (${res.status})`);
      }

  const data: LoginResponse = await res.json();

  return data.token;
}

async function adminRegisterRequest(user: FilledUser, token: string): Promise<LoginResponse> {
  if (user.committee == null || user.committee == undefined){
    user.committee = "BRE";
  }
  if (user.number == undefined || user.role != "LIS"){
    user.number = 0;
  }

  const request: RegisterRequest = {
    username: user.name, 
    email: user.email, 
    password: user.password, 
    role: user.role, 
    committeeCategory: user.committee, 
    year: user.year, 
    committeeNumber: user.number
  }
  console.log(JSON.stringify(request));
  const res = await fetch(`${API_URL}/auth/registerAdmin`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
        const data: ApiError = await res.json().catch(() => ({}));
        throw new Error(data.message ?? data.error ?? `Request failed (${res.status})`);
      }

  const data: LoginResponse = await res.json();
  return data;
}

export { type LoginResponse, loginRequest, baseRegisterRequest, adminRegisterRequest }