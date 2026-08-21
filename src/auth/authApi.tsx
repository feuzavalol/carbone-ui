interface LoginResponse {
  token: string;
}

interface ApiError {
  error?: string;
  message?: string;
}

export async function loginRequest(email: string, password: string): Promise<string> {
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