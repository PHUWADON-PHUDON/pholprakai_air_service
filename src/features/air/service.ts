import axiosCore from "@/lib/axiosCore";
import type { Brand } from "@/features/brand/service";
import type { AirModelInput } from "@/lib/airModelInput";

export type AirModel = {
  id: string;
  name: string;
  modelCode: string;
  btu: number;
  isSaveElectricity: boolean;
  enegyLabel: number;
  seer: number;
  priceInstall: number;
  priceDefault: number;
  stock: number;
  isOutOfStock: boolean;
  installWarranty: number;
  compressorWarranty: number;
  sparePartWarranty: number;
  brandId: string;
  systemId: string;
  brand: Pick<Brand, "id" | "name">;
  system: { id: string; name: string };
  imageUrl: string;
  imageUrls: string[];
};

export async function getAirModels(brandId?: string): Promise<AirModel[]> {
  const response = await axiosCore.get<AirModel[]>("/api/air", {
    params: brandId ? { brandId } : undefined,
  });
  return response.data;
}

export async function getAirModel(id: string): Promise<AirModel> {
  const response = await axiosCore.get<AirModel>(`/api/air/${id}`);
  return response.data;
}

export async function createAirModel(input: AirModelInput): Promise<AirModel> {
  const response = await axiosCore.post<AirModel>("/api/air", input);
  return response.data;
}

export async function updateAirModel({ id, input }: { id: string; input: AirModelInput }): Promise<AirModel> {
  const response = await axiosCore.put<AirModel>(`/api/air/${id}`, input);
  return response.data;
}

export async function deleteAirModel(id: string): Promise<void> {
  await axiosCore.delete(`/api/air/${id}`);
}

export async function uploadAirImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const response = await axiosCore.post<{ url: string }>("/api/air/images/upload", data);
  return response.data.url;
}

export type CatalogItem = {
  id: string;
  name: string;
  modelCode: string;
  btu: number;
  isSaveElectricity: boolean;
  enegyLabel: number;
  seer: number;
  priceInstall: number;
  priceDefault: number;
  stock: number;
  isOutOfStock: boolean;
  installWarranty: number;
  compressorWarranty: number;
  sparePartWarranty: number;
  brandName: string;
  brandImageUrl: string;
  systemName: string;
  imageUrl: string;
  imageUrls: string[];
};

export type CatalogFilters = {
  brands: { id: string; name: string }[];
  systems: { id: string; name: string }[];
  btus: number[];
};

export type CatalogParams = {
  brandId: string;
  systemId: string;
  btu: string;
  sort: "name" | "price-asc" | "price-desc" | "btu-asc";
  page: number;
  limit: number;
};

export type CatalogPage = {
  items: CatalogItem[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getCatalogFilters(): Promise<CatalogFilters> {
  const response = await axiosCore.get<CatalogFilters>("/api/air/catalog/filters");
  return response.data;
}

export async function getCatalogPage(params: CatalogParams): Promise<CatalogPage> {
  const response = await axiosCore.get<CatalogPage>("/api/air/catalog", { params });
  return response.data;
}
