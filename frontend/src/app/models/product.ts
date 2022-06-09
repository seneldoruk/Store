export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantity: number;
}

export interface ProductParams {
  orderBy: string;
  search?: string;
  types?: string[];
  brands?: string[];
  pageNumber: number;
  pageSize: number;
}
