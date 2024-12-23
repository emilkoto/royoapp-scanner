import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
// import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'royoapp-scanner';
  _authService = inject(AuthService);
  user$ = this._authService.user$;

  // startScan = async () => {
  //   const options: CapacitorBarcodeScannerOptions = {
  //     cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
  //     scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
  //     hint: CapacitorBarcodeScannerTypeHint.ALL,
  //     scanButton: false,
  //     scanText: 'Please scan the barcode',

  //   }
  //   CapacitorBarcodeScanner.scanBarcode(options).then((result) => {
  //     console.log(result);
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // };

}
