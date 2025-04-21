import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InventoryDetail, InventoryItem } from '../../types/inventory.type';
import { LocationService } from '../../services/location.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryService } from '../../services/inventory.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '../../types/location.type';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-move-inventory',
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
  templateUrl: './move-inventory.component.html',
  styleUrl: './move-inventory.component.scss'
})
export class MoveInventoryComponent {
  readonly dialogRef = inject(MatDialogRef<MoveInventoryComponent>);
  readonly inventory = inject<{
    item: InventoryItem;
    inventory: InventoryDetail
  }>(MAT_DIALOG_DATA);
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

  async save() {
    const locationId = this.selectedPath[this.selectedPath.length - 1].id;
    const qty = this.qtyControl.value || 1;
    const itemId = this.inventory.item.id;
    const inventoryId = this.inventory.inventory.id;
    this.loading = true;
    const removeQty = this.inventory.inventory.quantity - qty;
    await lastValueFrom(this._inventoryService.updateItemInventory(itemId, inventoryId, removeQty));
    const result = await lastValueFrom(this._inventoryService.createItemInventory(itemId, qty, locationId));
    this.loading = false;
    this._snackBar.open('Inventory moved successfully', 'OK', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
    this.dialogRef.close(result);
  }
}
