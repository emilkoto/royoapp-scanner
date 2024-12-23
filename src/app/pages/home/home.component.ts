import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InventoryService } from '../../services/inventory.service';
import { InventoryDetail, InventoryItem } from '../../types/inventory.type';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateQtyComponent } from '../../components/update-qty/update-qty.component';
import { StateService } from '../../services/state.service';
import { AddInventoryComponent } from '../../components/add-inventory/add-inventory.component';

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
    MatDialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly _inventoryService = inject(InventoryService);
  readonly _stateService = inject(StateService);
  readonly _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);


  defaultEan = '98723645q7644';

  item: InventoryItem | null = null;

  ngOnInit(): void {
    this._stateService.scanning.subscribe({
      next: (value) => {
        if (value)
          this.scan();
      }
    })
  }

  scan() {
    this._inventoryService.searchByEan(this.defaultEan).subscribe({
      next: (item) => {
        this.item = item;
        this.item.inventory.sort((a, b) => b.quantity - a.quantity);
      },
      error: (error) => console.error(error)
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
      data: this.item
    });
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
}
