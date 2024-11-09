import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Enquiry } from 'src/app/Models/crm/master/transactions/Enquiry';
import { PurchaseQuotationCuvService } from '../purchase-quotation-cuv.service';
import { PurchaseQuotation } from '../purchase-quotation.model';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-expiry-dialog',
  templateUrl: './expiry-dialog.component.html',
  styleUrls: ['./expiry-dialog.component.css']
})
export class ExpiryDialogComponent {
  enquiry: Enquiry[] = []; isChecked: boolean = false;
  purchaseQuotation: PurchaseQuotation[];

  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  userId$: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private purchaseQuotationCuvService: PurchaseQuotationCuvService,
    public dialogRef: MatDialogRef<ExpiryDialogComponent>,
    private UserIdstore: Store<{ app: AppState }>,) {
  }

  ngOnInit(): void {
    this.GetUserId();
    this.getAllList();
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getAllList() {
    this.purchaseQuotationCuvService.PurchaseQuotationGetAllByValidity().subscribe(res => {
      this.purchaseQuotation = res;
    });
  }

  toggleSelectAll(event: any): void {
    debugger
    const checked = event.checked;
    this.purchaseQuotation.forEach(item => {
      item.selected = checked;
      item.updatedBy=parseInt(this.userId$);
    });
    this.isChecked = checked; 
  }


  toggleSelect(event: any): void {
    debugger
    this.isChecked = this.purchaseQuotation.some(item => item.selected);
    this.purchaseQuotation.some(item => item.updatedBy==parseInt(this.userId$))
  }

  Close() {
    this.dialogRef.close(this.purchaseQuotation);
  }

  Closemodal() {
    this.dialogRef.close();
  }
}
