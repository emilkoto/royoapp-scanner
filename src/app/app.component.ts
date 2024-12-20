import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet,
    MatSlideToggleModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'royoapp-scanner';


  startScan = async () => {
    const options: CapacitorBarcodeScannerOptions = {
      cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
      scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
      hint: CapacitorBarcodeScannerTypeHint.ALL,
      scanButton: false,
      scanText: 'Please scan the barcode',
    }
    CapacitorBarcodeScanner.scanBarcode(options).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  };

}
