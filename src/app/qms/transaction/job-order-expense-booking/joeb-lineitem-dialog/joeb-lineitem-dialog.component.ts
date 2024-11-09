import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { JobOrderExpenseBookingService } from '../job-order-expense-booking.service';
import { JOCBLineItem, VendorIdbyCurrency } from '../job-order-expense-booking.model';

@Component({
  selector: 'app-joeb-lineitem-dialog',
  templateUrl: './joeb-lineitem-dialog.component.html',
  styleUrls: ['./joeb-lineitem-dialog.component.css']
})
export class JoebLineitemDialogComponent {
  lineItemId: any;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  titile: string;
  lineItemName: any;
  purchaseInvoiceHistory: JOCBLineItem[];
  jobOrderId: any;

  constructor(
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JoebLineitemDialogComponent>,
    public dialog: MatDialog,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService

  ) { dialogRef.disableClose = true; }

  ngOnInit() {
    debugger

    this.lineItemId=this.data.lineItemId;
    this.lineItemName=this.data.lineItemName;
    this.titile= this.lineItemName;
    this.jobOrderId=this.data.jobOrderId
    this.jobOrderExpenseBookingService.GetJOCostBookingPurchaseInvoiceHistory(this.lineItemId,this.jobOrderId).subscribe(res=>{
      this.purchaseInvoiceHistory=res;
    })
  }

  Close(){
    this.dialogRef.close()
  }

  formatDate(dateString: any): any {
    if(dateString!=null){
      return new Date(dateString);
    }
    else{
      return null;
    }
  }
}
