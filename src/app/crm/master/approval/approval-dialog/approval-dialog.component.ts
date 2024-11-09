import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonService } from 'src/app/services/common.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { ApprovalHistoryDialogComponent } from '../approval-history-dialog/approval-history-dialog.component';
import { ApprovalDashboard, ApprovalHistory } from '../approval-history.model';
import { ApprovalHistoryService } from '../approval-history.service';
import { CustomerService } from '../../customer/customer.service';
import { Customer } from '../../customer/customer.model';
import Swal from 'sweetalert2';
import { VendorService } from '../../vendor/vendor.service';

@Component({
  selector: 'app-approval-dialog',
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class ApprovalDialogComponent {
  userId$: string;
  viewMode: boolean;
  remarks = new FormControl();
  approvedashboard: ApprovalDashboard;
  date = new Date;
  customerData: Customer;
  vendorData: any;

  constructor(private router: Router, private fb: FormBuilder,
    private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApprovalHistoryDialogComponent>,
    private commonService: CommonService,
    private ErrorHandling: ErrorhandlingService,
    private approvalHistoryService: ApprovalHistoryService,
    private customerService: CustomerService,
    private vendorService: VendorService,


  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    debugger
    this.GetUserId();
    this.approvedashboard = this.data.Data;
    console.log(this.approvedashboard);

  }


  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  approve() {
    //---------------- Check the account details and approve

    //Customer Screen
    if (this.approvedashboard.screenId == 5) {

      this.customerService.getAllCustomerById(this.approvedashboard.referenceId).subscribe(res => {
        this.customerData = res.customer;
         for (let ele of res.documentChecklist) {
        if (ele.mandatory && ele.documentName == "") {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Please fill the mandatory documents for this Customer " + this.customerData.customerCode + ".",
            showConfirmButton: true,
          });
          return;
        }
      }
        if (
          (this.customerData.creditDays == null ||
            this.customerData.creditLimit == null ||
            this.customerData.tradeLicenseNumber == null ||
            this.customerData.tradeLicenseExpiryDate == null ||
            this.customerData.trn == null ||
            this.customerData.customerRankingId == null)
        ) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Please fill the account details for this Customer " + this.customerData.customerCode + ".",
            showConfirmButton: true,
          });
          this.dialogRef.close();
          return;
        } else {
          const approvalHistory: ApprovalHistory = {
            approvalHistoryId: 0,
            screenId: this.approvedashboard.screenId,
            referenceId: this.approvedashboard.referenceId,
            cycle: 1,
            levelId: this.approvedashboard.levelId,
            approverId: parseInt(this.userId$),
            date: this.date,
            statusId: 3,
            remarks: this.remarks.value,
            createdBy: parseInt(this.userId$),
            createdDate: new Date(),
            updatedBy: parseInt(this.userId$),
            updatedDate: new Date(),
            screen: '',
            employeeName: '',
            levelNumber: 0,
            approvalStatus: ''
          };
          this.approveMethods(approvalHistory);
        }
      });
    }else if (this.approvedashboard.screenId == 6){
      debugger
      this.vendorService.getVendorbyId(this.approvedashboard.referenceId).subscribe(res => {
        this.vendorData = res.vendors;
        console.log('this.vendorData',res);
        
         for (let ele of res.vDocuments) {
        if (ele.mandatory && ele.documentName == "") {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Please fill the mandatory documents for this Vendor " + this.vendorData.vendorCode + ".",
            showConfirmButton: true,
          });
          return;
        }
      }
        if (
          ( this.vendorData.creditDays == null ||
            this.vendorData.creditLimit == null ||
            this.vendorData.tradeLicenseNumber == null ||
            this.vendorData.tradeLicenseExpiryDate == null ||
            this.vendorData.trn == null ||
            this.vendorData.vendorRankingId == null)
        ) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Please fill the account details for this Vendor " + this.vendorData.vendorCode + ".",
            showConfirmButton: true,
          });
          this.dialogRef.close();
          return;
        } else {
          const approvalHistory: ApprovalHistory = {
            approvalHistoryId: 0,
            screenId: this.approvedashboard.screenId,
            referenceId: this.approvedashboard.referenceId,
            cycle: 1,
            levelId: this.approvedashboard.levelId,
            approverId: parseInt(this.userId$),
            date: this.date,
            statusId: 3,
            remarks: this.remarks.value,
            createdBy: parseInt(this.userId$),
            createdDate: new Date(),
            updatedBy: parseInt(this.userId$),
            updatedDate: new Date(),
            screen: '',
            employeeName: '',
            levelNumber: 0,
            approvalStatus: ''
          };
          this.approveMethods(approvalHistory);
        }
      });
    }else if(this.approvedashboard.screenId == 13){

      const approvalHistory: ApprovalHistory = {
        approvalHistoryId: 0,
        screenId: this.approvedashboard.screenId,
        referenceId: this.approvedashboard.referenceId,
        cycle: 1,
        levelId: this.approvedashboard.levelId,
        approverId: parseInt(this.userId$),
        date: this.date,
        statusId: 3,
        remarks: this.remarks.value,
        createdBy: parseInt(this.userId$),
        createdDate: new Date(),
        updatedBy: parseInt(this.userId$),
        updatedDate: new Date(),
        screen: '',
        employeeName: '',
        levelNumber: 0,
        approvalStatus: ''
      };
      this.approveMethods(approvalHistory);
      
    }
  }
  approveMethods(approvalHistory:any){
    this.approvalHistoryService.SaveApprovalHistory(approvalHistory).subscribe({
      next: (res) => {
        this.commonService.displayToaster(
          "success",
          "Success",
          "Approved Sucessfully"
        );
      },
      error: (error) => {
        console.log(error)
        var ErrorHandle = this.ErrorHandling.handleApiError(error)
        this.commonService.displayToaster(
          "error",
          "Error",
          ErrorHandle
        );
      },
    });
    this.dialogRef.close('Approved');
  }

  sendBack() {
    const approvalHistory: ApprovalHistory = {
      approvalHistoryId: 0,
      screenId: this.approvedashboard.screenId,
      referenceId: this.approvedashboard.referenceId,
      cycle: 1,
      levelId: this.approvedashboard.levelId,
      approverId: parseInt(this.userId$),
      date: this.date,
      statusId: 5,
      remarks: this.remarks.value,
      createdBy: parseInt(this.userId$),
      createdDate: new Date(),
      updatedBy: parseInt(this.userId$),
      updatedDate: new Date(),
      screen: '',
      employeeName: '',
      levelNumber: 0,
      approvalStatus: ''
    };
    this.approvalHistoryService.SaveApprovalHistory(approvalHistory).subscribe({
      next: (res) => {
        this.commonService.displayToaster(
          "success",
          "Success",
          "Send Back sucessfully"
        );
      },
      error: (error) => {
        console.log(error)
        var ErrorHandle = this.ErrorHandling.handleApiError(error)
        this.commonService.displayToaster(
          "error",
          "Error",
          ErrorHandle
        );
      },
    })
    this.dialogRef.close('Send Back');
  }

  reject() {
    const approvalHistory: ApprovalHistory = {
      approvalHistoryId: 0,
      screenId: this.approvedashboard.screenId,
      referenceId: this.approvedashboard.referenceId,
      cycle: 1,
      levelId: this.approvedashboard.levelId,
      approverId: parseInt(this.userId$),
      date: this.date,
      statusId: 4,
      remarks: this.remarks.value,
      createdBy: parseInt(this.userId$),
      createdDate: new Date(),
      updatedBy: parseInt(this.userId$),
      updatedDate: new Date(),
      screen: '',
      employeeName: '',
      levelNumber: 0,
      approvalStatus: ''
    };
    this.approvalHistoryService.SaveApprovalHistory(approvalHistory).subscribe({
      next: (res) => {
        this.commonService.displayToaster(
          "success",
          "Success",
          "Rejected sucessfully"
        );
      },
      error: (error) => {
        console.log(error)
        var ErrorHandle = this.ErrorHandling.handleApiError(error)
        this.commonService.displayToaster(
          "error",
          "Error",
          ErrorHandle
        );
      },
    })
    this.dialogRef.close('Reject');
  }

  Close() {
    this.dialogRef.close();
  }
}
