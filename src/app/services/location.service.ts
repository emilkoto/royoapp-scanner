import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  apiUrl = environment.apiUrl;
  _httpClient: HttpClient = inject(HttpClient);

}
