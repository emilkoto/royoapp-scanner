import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { InventoryDetail, InventoryItem, InventoryPagination } from '../types/inventory.type';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  readonly apiUrl = environment.apiUrl;
  readonly _httpClient: HttpClient = inject(HttpClient);
  readonly _authService = inject(AuthService);
  readonly _stateService = inject(StateService);


  searchByEan = (ean: string) => this._httpClient.get<InventoryItem>(`${this.apiUrl}/items/searchByEan?ean=${ean}`).pipe(tap(() => {
    this._stateService.setLoading(false);
  }));

  createItemInventory = (itemId: number, quantity: number, locationId: number) => this._httpClient.post<InventoryDetail>(`${this.apiUrl}/items/${itemId}/inventory`, { locationId, quantity }).pipe(tap(() => {
    this._stateService.setLoading(false);
  }));

  updateItemInventory = (itemId: number, inventoryId: number, quantity: number) => this._httpClient.put<InventoryDetail>(`${this.apiUrl}/items/${itemId}/inventory/${inventoryId}`, { quantity }).pipe(tap(() => {
    this._stateService.setLoading(false);
  }));

  deteleItemInventory = (itemId: number, inventoryId: number) => this._httpClient.delete<{ message: string }>(`${this.apiUrl}/items/${itemId}/inventory/${inventoryId}`).pipe(tap(() => {
    this._stateService.setLoading(false);
  }));

  search = (page: number, pageSize: number, orderBy: string, order: string, search?: string, location?: number): Observable<InventoryPagination> => {
    let url = `${this.apiUrl}/items?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&order=${order}`;

    if (search) url += `&search=${search}`;
    if (location) url += `&location=${location}`;

    return this._httpClient.get<InventoryPagination>(url).pipe(tap(() => {
      this._stateService.setLoading(false);
    }));
  }




}
