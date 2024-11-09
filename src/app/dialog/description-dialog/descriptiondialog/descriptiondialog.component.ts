import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-descriptiondialog',
  templateUrl: './descriptiondialog.component.html',
  styleUrls: ['./descriptiondialog.component.css']
})
export class DescriptiondialogComponent {
  description: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DescriptiondialogComponent>) {
    this.description = this.data.description;
    dialogRef.disableClose = true;
  }
  Close()
  {
    this.dialogRef.close();
  }
}
