import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './confirmation/delete-confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmationDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent)
    return dialogRef.afterClosed();

  }
}
