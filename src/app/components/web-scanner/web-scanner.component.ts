import { Component, inject, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-web-scanner',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Scan Barcode</h2>
    <mat-dialog-content>
      <div id="web-scanner-container" style="width: 100%; min-height: 300px;"></div>
      @if (errorMessage) {
        <p style="color: red; text-align: center; padding: 10px;">{{ errorMessage }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button (click)="close()" style="background: #c62828; color: white;">
        <mat-icon>close</mat-icon> Cancel
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    ::ng-deep .mat-mdc-dialog-content {
      padding: 0 !important;
      overflow: hidden;
    }
    #web-scanner-container {
      width: 100%;
      min-height: 300px;
    }
  `]
})
export class WebScannerComponent implements AfterViewInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<WebScannerComponent>);
  private html5Qrcode: Html5Qrcode | null = null;
  errorMessage = '';

  ngAfterViewInit(): void {
    this.startScanner();
  }

  private async startScanner() {
    try {
      this.html5Qrcode = new Html5Qrcode('web-scanner-container');
      await this.html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          this.dialogRef.close(decodedText);
        },
        () => {
          // Ignore scan failures (no barcode found yet)
        }
      );
    } catch (err: any) {
      this.errorMessage = 'Camera not available: ' + (err?.message || err);
    }
  }

  close() {
    this.stopScanner();
    this.dialogRef.close(null);
  }

  private async stopScanner() {
    if (this.html5Qrcode) {
      try {
        await this.html5Qrcode.stop();
        this.html5Qrcode.clear();
      } catch (_) {}
      this.html5Qrcode = null;
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
