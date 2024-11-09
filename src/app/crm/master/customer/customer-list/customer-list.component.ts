import { Component } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router';
import { Customer } from '../customer.model';
import Swal from 'sweetalert2';
import { FollowuphistoryComponent } from 'src/app/crm/transaction/Enquiry/enquiry/FollowUphistory/followuphistory/followuphistory.component';
import { MatDialog } from '@angular/material/dialog';
import { FollowUpHistoryParms } from 'src/app/Models/crm/master/transactions/Followup';
import { Store } from '@ngrx/store';
import { ApprovalHistoryService } from '../../approval/approval-history.service';
import { ApprovalDashboard } from '../../approval/approval-history.model';
import { ApprovalHistoryDialogComponent } from '../../approval/approval-history-dialog/approval-history-dialog.component';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent {
  customers: Customer[];
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  approvalDashboard: ApprovalDashboard[] = [];
  approvevalue: ApprovalDashboard | undefined;
  userId$: string;

  constructor(
    private UserIdstore: Store<{ app: AppState }>,
    private customerService: CustomerService,
    private approvalHistoryService: ApprovalHistoryService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    public dialog: MatDialog,private Ns:NofificationconfigurationService) {

  }

  ngOnInit() {
    this.GetUserId();
    this.getAllCustomer();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    })
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  getAllCustomer() {
    this.customerService.getAllCustomer().subscribe(result => {
      this.customers = result;
    });
  }

  add() {
    this.customerService.isView = false;
    this.customerService.isEdit = false;
    this.router.navigate(["/crm/master/customer/create"]);
    this.customerService.setItemId(0)
  }

  onEdit(item: any) {
    this.customerService.isView = false;
    this.customerService.isEdit = true;
    this.customerService.setItemId(item.customerId);
    this.router.navigate(["/crm/master/customer/create"]);
  }

  onview(item: any) {
    if (item) {
      this.customerService.isView = true;
      this.customerService.isEdit = false;
      this.customerService.setItemId(item.customerId);
      this.router.navigate(["/crm/master/customer/create"]);
    }
  }
  approveHistory(id: any) {
    debugger
    this.customerService.isApproveHistory = true;
    const dialogRef = this.dialog.open(ApprovalHistoryDialogComponent, {
      data: {
        Data: id,
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

      }
      else {

      }
      this.customerService.isApproveHistory = false;

    });
  }
  onDelete(data: any) {
    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete " + data.customerName + '...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(data.customerId).subscribe((res) => {
          const parms ={
            MenuId:26,
            currentUser:this.userId$,
            activityName:"Deletion",
            id:data.customerId,
            code:data.customerCode
          }
          this.Ns.TriggerNotification(parms).subscribe((res=>{

          }));
          this.getAllCustomer();
          Swal.fire(
            'Deleted!',
            'Customer ' + data.customerName + ' has been deleted',
            'success'
          )
        },);
      }
    })

  }
  OpenHistory(basedocnameId: number, id: number, statusId: number) {
    const payload: FollowUpHistoryParms = {
      baseDocNameId: basedocnameId,
      baseDocId: id
    }
    const dialogRef = this.dialog.open(FollowuphistoryComponent, {
      data: {
        parms: payload,
        screen: 4,
        status: statusId,
      }, disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result != null) {
      //   this.EnqPackage.push(result);
      //   this.EnqPackage = [...this.EnqPackage];
      // }
    });
  }

}
