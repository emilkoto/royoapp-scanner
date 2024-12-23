import { Component, inject, OnInit } from '@angular/core';
import { InventoryDetail } from '../../types/inventory.type';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InventoryService } from '../../services/inventory.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-qty',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './update-qty.component.html',
  styleUrl: './update-qty.component.scss'
})
export class UpdateQtyComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UpdateQtyComponent>);
  readonly inventory = inject<InventoryDetail>(MAT_DIALOG_DATA);
  readonly _snackBar = inject(MatSnackBar);
  readonly _inventoryService = inject(InventoryService);
  qtyControl = new FormControl(0, [Validators.required, Validators.min(0)]);

  ngOnInit(): void {
    console.log(this.inventory);
    this.qtyControl.setValue(this.inventory.quantity);
  }

  save() {
    this.inventory.quantity = this.qtyControl.value ?? 0;
    this._inventoryService.updateItemInventory(this.inventory.itemId, this.inventory.id, this.inventory.quantity)
      .subscribe({
        next: () => {
          this.dialogRef.close(this.inventory);
          this._snackBar.open('Quantity updated', 'Close', { duration: 1000 });
        },
        error: (error) => {
          console.error(error)
          this._snackBar.open('An error occurred', 'Close', { duration: 1000 });
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
