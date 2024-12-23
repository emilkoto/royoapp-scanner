import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { InventoryDetail, InventoryItem } from '../types/inventory.type';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  apiUrl = environment.apiUrl;
  _httpClient: HttpClient = inject(HttpClient);
  _authService = inject(AuthService);

  searchByEan = (ean: string) => this._httpClient.get<InventoryItem>(`${this.apiUrl}/items/searchByEan?ean=${ean}`, {
    headers: {
      Authorization: `Bearer ${this._authService.accessToken}`
    }
  });

  updateItemInventory = (itemId: number, inventoryId: number, quantity: number) => this._httpClient.put<InventoryDetail>(`${this.apiUrl}/items/${itemId}/inventory/${inventoryId}`, { quantity }, {
    headers: {
      Authorization: `Bearer ${this._authService.accessToken}`
    }
  });

  deteleItemInventory = (itemId: number, inventoryId: number) => this._httpClient.delete<{ message: string }>(`${this.apiUrl}/items/${itemId}/inventory/${inventoryId}`, {
    headers: {
      Authorization: `Bearer ${this._authService.accessToken}`
    }
  });



}
