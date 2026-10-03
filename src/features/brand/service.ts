import axiosCore from "@/lib/axiosCore";

export type Brand = {
  id: string;
  name: string;
  image: string;
  modelCount: number;
};

export type BrandInput = { name: string; image: string };

export async function getBrands(): Promise<Brand[]> {
  const response = await axiosCore.get<Brand[]>("/api/air/brands");
  return response.data;
}

export async function createBrand(input: BrandInput): Promise<Brand> {
  const response = await axiosCore.post<Brand>("/api/air/brands", input);
  return response.data;
}

export async function updateBrand({ id, input }: { id: string; input: BrandInput }): Promise<Brand> {
  const response = await axiosCore.put<Brand>(`/api/air/brands/${id}`, input);
  return response.data;
}

export async function deleteBrand(id: string): Promise<void> {
  await axiosCore.delete(`/api/air/brands/${id}`);
}

export async function uploadBrandImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const response = await axiosCore.post<{ url: string }>("/api/air/brands/upload", data);
  return response.data.url;
}
