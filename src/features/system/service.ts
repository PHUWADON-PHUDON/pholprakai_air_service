import axiosCore from "@/lib/axiosCore";

export type AirSystem = {
  id: string;
  name: string;
  modelCount: number;
};

export async function getSystems(): Promise<AirSystem[]> {
  const response = await axiosCore.get<AirSystem[]>("/api/air/systems");
  return response.data;
}

export async function createSystem(name: string): Promise<AirSystem> {
  const response = await axiosCore.post<AirSystem>("/api/air/systems", { name });
  return response.data;
}

export async function updateSystem({ id, name }: { id: string; name: string }): Promise<AirSystem> {
  const response = await axiosCore.put<AirSystem>(`/api/air/systems/${id}`, { name });
  return response.data;
}

export async function deleteSystem(id: string): Promise<void> {
  await axiosCore.delete(`/api/air/systems/${id}`);
}
