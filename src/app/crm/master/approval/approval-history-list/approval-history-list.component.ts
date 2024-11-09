import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ApprovalDashboard, ApprovalHistory } from '../approval-history.model';
import { ApprovalHistoryService } from '../approval-history.service';
import { CustomerService } from '../../customer/customer.service';
import { ApprovalHistoryDialogComponent } from '../approval-history-dialog/approval-history-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from '../approval-dialog/approval-dialog.component';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { VendorService } from '../../vendor/vendor.service';
import { PurchaseQuotationCuvService } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation-cuv.service';

@Component({
  selector: 'app-approval-history-list',
  templateUrl: './approval-history-list.component.html',
  styleUrls: ['./approval-history-list.component.css']
})
export class ApprovalHistoryListComponent {
  pagePrivilege: Array<string>;
  approvalDashboard: ApprovalDashboard[] = [];
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor(
    private store: Store<{ privileges: { privileges: any } }>,
    private router: Router,
    private UserIdstore: Store<{ app: AppState }>,
    public dialogHistory: MatDialog,
    public dialogApprove: MatDialog,

    private approvalHistoryService: ApprovalHistoryService,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private purchaseQuotationCuvService: PurchaseQuotationCuvService

  ) {
  }
  ngOnInit() {
    this.GetUserId();
    this.getAllApprovalDashboard();

    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getAllApprovalDashboard() {
    debugger
    this.approvalHistoryService.getAllApprovalDashboard(parseInt(this.userId$)).subscribe(result => {
      this.approvalDashboard = result;
      this.approvalDashboard=[...result]
    });
  }
  onview(dataItem: any) {
    debugger
    if (dataItem.screenId === 5) {
      this.customerService.isView = true;
      this.customerService.isEdit = false;
      this.customerService.isApprove = true;
      this.customerService.setItemId(dataItem.referenceId);
      this.router.navigate(["/crm/master/customer/create"]);
    } else if (dataItem.screenId === 6) {

      this.vendorService.setItemId(dataItem.referenceId);
      this.vendorService.isView = true;
      this.vendorService.isApprove = true;
      this.router.navigate(['/crm/master/vendor/create-edit-view']);
    }
    else if (dataItem.screenId === 13) {
      this.purchaseQuotationCuvService.setItemId(dataItem.referenceId);
      this.purchaseQuotationCuvService.isView = true;
      this.purchaseQuotationCuvService.isEdit = false;
      this.purchaseQuotationCuvService.isApprove = true;
      this.router.navigate(['/crm/transaction/purchasequotation/cuv']);
    }
  }
  onHistory(dataItem: any) {

    const dialogRef = this.dialogHistory.open(ApprovalHistoryDialogComponent, {
      data: {
        Data: dataItem,
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

      }
      else {

      }
    });
    this.getAllApprovalDashboard();
  }
  onApproval(dataItem: any) {
    debugger
    const dialogRef = this.dialogApprove.open(ApprovalDialogComponent, {
      data: {
        Data: dataItem,
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.getAllApprovalDashboard();
      }
      else {
        this.getAllApprovalDashboard();
      }
    });
    
  }
  onEdit(dataItem: any) {
    if (dataItem.screenId === 5) {
      this.customerService.isView = false;
      this.customerService.isEdit = true;
      this.customerService.isApprove = false;
      this.customerService.editFromApprove = true;
      this.customerService.setItemId(dataItem.referenceId);
      this.router.navigate(["/crm/master/customer/create"]);
    } else if (dataItem.screenId === 6) {

      this.vendorService.setItemId(dataItem.referenceId);
      this.vendorService.isView = false;
      this.vendorService.isApprove = false;
      this.vendorService.editFromApprove = true;
      this.router.navigate(['/crm/master/vendor/create-edit-view']);
    }
    else if (dataItem.screenId === 13) {
      this.purchaseQuotationCuvService.setItemId(dataItem.referenceId);
      this.purchaseQuotationCuvService.isView = false;
      this.purchaseQuotationCuvService.isEdit = true;
      this.purchaseQuotationCuvService.isApprove = false;
      this.purchaseQuotationCuvService.editFromApprove = true;
      this.router.navigate(['/crm/transaction/purchasequotation/cuv']);
    }
  }

}
