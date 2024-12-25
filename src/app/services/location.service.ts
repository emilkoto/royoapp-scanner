import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { StateService } from './state.service';
import { tap } from 'rxjs';
import { Location } from '../types/location.type';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  apiUrl = environment.apiUrl;
  _httpClient: HttpClient = inject(HttpClient);
  readonly _authService = inject(AuthService);
  readonly _stateService = inject(StateService);


  rootLocations = () => this._httpClient.get<Location[]>(`${this.apiUrl}/locations/root`).pipe(tap(() => {
    this._stateService.setLoading(false);
  }));

  location = (id: number) => this._httpClient.get<Location>(`${this.apiUrl}/locations/${id}`).pipe(tap(() => {
    this._stateService.setLoading(false);
  }));
}
