import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private scanningHandler = new BehaviorSubject<Date | null>(null);
  private loadingHandler = new BehaviorSubject<boolean>(false);

  startScanning = () => this.scanningHandler.next(new Date());
  setLoading = (loading: boolean) => this.loadingHandler.next(loading);

  get scanning() {
    return this.scanningHandler.asObservable();
  }

  get loading() {
    return this.loadingHandler.asObservable();
  }

}
