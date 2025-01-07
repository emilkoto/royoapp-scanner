import { Location } from "./location.type";

export interface InventoryItem {
    id: number;
    name: string;
    description?: string;
    sku?: string;
    ean?: string;
    deleted: boolean;
    enabled: boolean;
    inventory: InventoryDetail[]
}

export interface InventoryDetail {
  id: number,
  itemId: number,
  quantity: number,
  tree: Location[]
}


export interface InventoryPagination {
  current_page: number;
  data: InventoryItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}
