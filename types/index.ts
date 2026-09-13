export interface Product {
  id: string;
  serialNumber: string;
  productName: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  total: number;
  categories: number;
  withImage: number;
  addedLast30Days: number;
  recentProducts: Product[];
}
