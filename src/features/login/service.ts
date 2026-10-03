import axiosCore from "@/lib/axiosCore";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
  redirectTo: string;
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await axiosCore.post<LoginResponse>("/api/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await axiosCore.post("/api/logout");
}
