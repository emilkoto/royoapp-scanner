import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InventoryService } from '../../services/inventory.service';
import { InventoryDetail, InventoryItem, InventoryPagination } from '../../types/inventory.type';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime, take } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateQtyComponent } from '../../components/update-qty/update-qty.component';
import { StateService } from '../../services/state.service';
import { AddInventoryComponent } from '../../components/add-inventory/add-inventory.component';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerScanResult, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly _inventoryService = inject(InventoryService);
  readonly _stateService = inject(StateService);
  readonly _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  searchInputControl = new FormControl<string>('');
  filteredOptions$: BehaviorSubject<InventoryPagination> = new BehaviorSubject<InventoryPagination>(
    {
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 0,
      last_page: 1,
      last_page_url: '',
      next_page_url: '',
      per_page: 10,
      prev_page_url: '',
      to: 0,
      total: 0
    }
  );


  defaultEan = '6932586200052';

  item: InventoryItem | null = null;

  ngOnInit(): void {
    this._stateService.scanning.subscribe({
      next: (value) => {
        if (value)
          this.startScan();
        // this.scan(this.defaultEan);
        // this.scan(this.defaultEan);
      }
    })

    this.searchInputControl.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        if (value && value.length > 3) {
          this.search(value);
        } else {
          this.filteredOptions$.next({
            current_page: 1,
            data: [],
            first_page_url: '',
            from: 0,
            last_page: 1,
            last_page_url: '',
            next_page_url: '',
            per_page: 10,
            prev_page_url: '',
            to: 0,
            total: 0
          });
        }
      }
    });

    this._stateService.test.subscribe({
      next: (value) => {
        if (value)
          this.scan(this.defaultEan);
      }
    })
  }

  search(s: string) {
    this._inventoryService.search(1, 10, 'name', 'asc', s).subscribe({
      next: (data) => {
        this.filteredOptions$.next(data);
      }
    });
  }

  displayOption(option: InventoryItem): string {
    return option ? `${option.name} | ${option.sku} | ${option.description?.substring(0, 15)}` : '';
  }

  optionSelected(option: MatAutocompleteSelectedEvent) {
    this._inventoryService.itemInventory(option.option.value.id).subscribe({
      next: (item) => {
        this.item = item;
        this.item.inventory.sort((a, b) => b.quantity - a.quantity);
      }
    });


    // clear search
    this.filteredOptions$.next({
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 0,
      last_page: 1,
      last_page_url: '',
      next_page_url: '',
      per_page: 10,
      prev_page_url: '',
      to: 0,
      total: 0
    });

    this.searchInputControl.setValue('', { emitEvent: false });
  }

  errorMessage = '';

  scan(ean: string) {
    this._inventoryService.searchByEan(ean).subscribe({
      next: (item) => {
        this.item = item;
        this.item.inventory.sort((a, b) => b.quantity - a.quantity);
      },
      error: (error) => {
        this.errorMessage = 'Item not found!';
        this._stateService.setLoading(false);
      }
    });
  }

  async startScan() {
    const options: CapacitorBarcodeScannerOptions = {
      cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
      scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
      hint: CapacitorBarcodeScannerTypeHint.ALL,
      scanButton: true,
      scanText: 'Scan',
      scanInstructions: 'Please scan the barcode'
    }

    CapacitorBarcodeScanner.scanBarcode(options).then((result: CapacitorBarcodeScannerScanResult) => {
      console.log(result);
      this.scan(result.ScanResult);
    }).catch((error) => {
      console.log(error);
    });
  }

  incrementQty(inventory: InventoryDetail) {
    inventory.quantity++;
    this._inventoryService.updateItemInventory(inventory.itemId, inventory.id, inventory.quantity)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this._snackBar.open('Quantity updated!', 'save', { duration: 1000 });
        },
        error: () => {
          this._snackBar.open('Error updating quantity!', 'error', { duration: 2000 });
        }
      });
  }

  decrementQty(inventory: InventoryDetail) {
    inventory.quantity--;
    this._inventoryService.updateItemInventory(inventory.itemId, inventory.id, inventory.quantity)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this._snackBar.open('Quantity updated!', 'save', { duration: 1000 });
        },
        error: () => {
          this._snackBar.open('Error updating quantity!', 'error', { duration: 2000 });
        }
      });
  }

  deleteInventory(inventory: InventoryDetail) {
    if (!confirm('Are you sure you want to delete this inventory?')) return;
    this._inventoryService.deteleItemInventory(inventory.itemId, inventory.id).subscribe({
      next: () => {
        this.item?.inventory.splice(this.item?.inventory.indexOf(inventory), 1);
        this._snackBar.open('Inventory deleted!', 'save', { duration: 1000 });
      },
      error: () => {
        this._snackBar.open('Error deleting inventory!', 'error', { duration: 2000 });
      }
    });
  }

  openUpdateQty(inventory: InventoryDetail) {
    this.dialog.open(UpdateQtyComponent, {
      width: '250px',
      data: inventory
    });
  }

  openAddInventory() {
    this.dialog.open(AddInventoryComponent, {
      width: '98%',
      height: '600px',
      maxHeight: '98%',
      data: this.item
    });
    this.dialog.afterAllClosed.subscribe({
      next: () => {
        if (this.item)
          this._inventoryService.itemInventory(this.item?.id).subscribe({
            next: (item) => {
              this.item = item;
              this.item.inventory.sort((a, b) => b.quantity - a.quantity);
            }
          });
      }
    })
  }

  close() {
    this.item = null;
  }
}
