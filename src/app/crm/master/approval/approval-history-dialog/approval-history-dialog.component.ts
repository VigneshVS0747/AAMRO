import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApprovalDashboard, ApprovalHistory, ApprovalLevelsSummary } from '../approval-history.model';
import { ApprovalHistoryService } from '../approval-history.service';
import { CustomerService } from '../../customer/customer.service';
import { Customer } from '../../customer/customer.model';
import { VendorService } from '../../vendor/vendor.service';
import { PurchaseQuotationCuvService } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation-cuv.service';
import { PurchaseQuotation } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation.model';

@Component({
  selector: 'app-approval-history-dialog',
  templateUrl: './approval-history-dialog.component.html',
  styleUrls: ['./approval-history-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class ApprovalHistoryDialogComponent {
  form: FormGroup;
  approveHistory: ApprovalHistory[];
  id: number;
  sId: number;
  approvedashboard: ApprovalDashboard;
  customer: Customer;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  menuId: number;
  approvalLevelsSummary: ApprovalLevelsSummary[];
  vendor: any;
  purchaseQuitaton: PurchaseQuotation;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApprovalHistoryDialogComponent>,
    private approvalHistoryService: ApprovalHistoryService,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private purchaseQuotationCuvService: PurchaseQuotationCuvService


  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {

    if (this.customerService.isApproveHistory) {
      this.id = this.data.Data
      this.sId = 5;
    }
    else if (this.vendorService.isApproveHistory) {
      this.id = this.data.Data
      this.sId = 6;
    } else if (this.purchaseQuotationCuvService.isApproveHistory) {
      this.id = this.data.Data
      this.sId = 13;
    } else {
      this.approvedashboard = this.data.Data;
      this.id = this.approvedashboard.referenceId;
      this.sId = this.approvedashboard.screenId;
    }

    this.GetApprovalHistoryById();

    this.form = this.fb.group({
      screenName: [null],
      referenceNumber: [null],
    })
    if (this.sId == 5) {
      this.menuId = 26;
      this.customerService.getAllCustomerById(this.id).subscribe(res => {
        this.customer = res.customer;
        this.form.controls['screenName'].setValue('Customer');
        this.form.controls['referenceNumber'].setValue(this.customer.customerCode);

      })
    } else if (this.sId == 6) {
      debugger
      this.menuId = 28;
      this.vendorService.getVendorbyId(this.id).subscribe(res => {
        this.vendor = res.vendors;
        this.form.controls['screenName'].setValue('Vendor');
        this.form.controls['referenceNumber'].setValue(this.vendor.vendorCode);

      })
    }
    else if (this.sId == 13) {
      debugger
      this.menuId = 59;
      this.purchaseQuotationCuvService.getAllPurchaseQuotationById(this.id).subscribe(res => {
        this.purchaseQuitaton = res.purchaseQuotation;
        this.form.controls['screenName'].setValue('Purchase Quotation');
        this.form.controls['referenceNumber'].setValue(this.purchaseQuitaton.pqNumber);
      })
    }
    this.GetApprovalLevelsSummary()
  }
  GetApprovalHistoryById() {
    this.approvalHistoryService.GetApprovalHistoryById(this.id, this.sId).subscribe(x => {
      this.approveHistory = x;
    });
  }
  GetApprovalLevelsSummary() {
    this.approvalHistoryService.GetApprovalLevelsSummary(this.menuId, this.sId, this.id).subscribe(res => {
      this.approvalLevelsSummary = res;
      console.log('approvalLevelsSummary', this.approvalLevelsSummary)
    });
  }

  Close() {
    this.dialogRef.close();
  }
}
