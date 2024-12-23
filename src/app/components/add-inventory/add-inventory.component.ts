import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InventoryItem } from '../../types/inventory.type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryService } from '../../services/inventory.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss'
})
export class AddInventoryComponent {
  readonly dialogRef = inject(MatDialogRef<AddInventoryComponent>);
  readonly inventory = inject<InventoryItem>(MAT_DIALOG_DATA);
  readonly _snackBar = inject(MatSnackBar);
  readonly _inventoryService = inject(InventoryService);


  close() {
    this.dialogRef.close();
  }

}
