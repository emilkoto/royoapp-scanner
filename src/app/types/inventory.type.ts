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
