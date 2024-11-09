import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { JobOrderRevenueBookingService } from '../Job-order-revenue.service';
import { JORBLineItem } from '../Job-order-revenue-modals';

@Component({
  selector: 'app-jorb-lineitem-dialog',
  templateUrl: './jorb-lineitem-dialog.component.html',
  styleUrls: ['./jorb-lineitem-dialog.component.css']
})
export class JorbLineitemDialogComponent {
  lineItemId: any;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  titile: string;
  lineItemName: any;
  proformaInvoiceHistory: JORBLineItem[];
  jobOrderId: any;

  constructor(
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JorbLineitemDialogComponent>,
    public dialog: MatDialog,
    private jobOrderRevenueBookingService: JobOrderRevenueBookingService

  ) { dialogRef.disableClose = true; }

  ngOnInit() {
    debugger

    this.lineItemId=this.data.lineItemId;
    this.lineItemName=this.data.lineItemName;
    this.titile= this.lineItemName;
    this.jobOrderId=this.data.jobOrderId;
    this.jobOrderRevenueBookingService.GetJORevenueBookingProformaInvoiceHistory(this.lineItemId,this.jobOrderId).subscribe(res=>{
      this.proformaInvoiceHistory=res;
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
