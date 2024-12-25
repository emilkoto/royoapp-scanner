import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InventoryItem } from '../../types/inventory.type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryService } from '../../services/inventory.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocationService } from '../../services/location.service';
import { Location } from '../../types/location.type';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss'
})
export class AddInventoryComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddInventoryComponent>);
  readonly inventory = inject<InventoryItem>(MAT_DIALOG_DATA);
  readonly _snackBar = inject(MatSnackBar);
  readonly _locationService = inject(LocationService);
  readonly _inventoryService = inject(InventoryService);
  levelMsg = '';
  loading = false;

  selectedPath: Location[] = [];
  currentLocations: Location[] = [];
  qtyControl = new FormControl<number>(1, [Validators.required, Validators.min(1)]);

  ngOnInit(): void {
    this.loading = true;
    this._locationService.rootLocations().subscribe(locations => {
      this.currentLocations = locations;
      this.loading = false;
    });
  }

  selectLocation(location: Location) {
    this.selectedPath.push(location);
    this.currentLocations = location.children || [];
    this.loadLocations(location.id);
  }

  private loadLocations(id: number) {
    this.loading = true;
    this._locationService.location(id).subscribe(location => {
      this.currentLocations = location.children || [];
      this.loading = false;
    });
  }

  close() {
    this.dialogRef.close();
  }

  chipIcon(name: string): { icon: string, color: string } {
    if (name.toLowerCase().includes('rack')) {
      return { icon: 'dns', color: 'rack' };
    } else if (name.toLowerCase().includes('bin')) {
      return { icon: 'archive', color: 'bin' };
    } else if (name.toLowerCase().includes('level')) {
      return { icon: 'linear_scale', color: 'level' };
    } else if (name.toLowerCase().includes('left') || name.toLowerCase().includes('right')) {
      return { icon: 'swap_horiz', color: 'position' };
    }
    return { icon: 'location_on', color: '' };
  }

  increment() {
    if (this.qtyControl.value === null) {
      this.qtyControl.setValue(1);
      return;
    }
    this.qtyControl.setValue(this.qtyControl.value + 1);
  }

  decrement() {
    if (this.qtyControl.value === null) {
      this.qtyControl.setValue(1);
      return;
    }
    if (this.qtyControl.value == 1) {
      this.qtyControl.setValue(1);
    } else[
      this.qtyControl.setValue(this.qtyControl.value - 1)
    ]
  }

  save() {
    const lastLocation = this.selectedPath[this.selectedPath.length - 1];
    const qty = this.qtyControl.value as number;
    this.loading = true;
    this._inventoryService.createItemInventory(this.inventory.id, qty, lastLocation.id).subscribe((result) => {
      this.loading = false;
      this._snackBar.open('Inventory added', 'close', { duration: 2000 });
      this.dialogRef.close(result);
    });
  }

}
