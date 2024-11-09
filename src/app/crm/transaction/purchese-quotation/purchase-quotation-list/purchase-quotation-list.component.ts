import { Component } from '@angular/core';
import { PurchaseQuotationCuvService } from '../purchase-quotation-cuv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PQvaliditycloser, PurchaseQuotation } from '../purchase-quotation.model';
import Swal from 'sweetalert2';
import { FollowuphistoryComponent } from '../../Enquiry/enquiry/FollowUphistory/followuphistory/followuphistory.component';
import { MatDialog } from '@angular/material/dialog';
import { FollowUpHistoryParms } from 'src/app/Models/crm/master/transactions/Followup';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { ExpiryDialogComponent } from '../expiry-dialog/expiry-dialog.component';
import { ApprovalHistoryDialogComponent } from 'src/app/crm/master/approval/approval-history-dialog/approval-history-dialog.component';

@Component({
  selector: 'app-purchase-quotation-list',
  templateUrl: './purchase-quotation-list.component.html',
  styleUrls: ['./purchase-quotation-list.component.css']
})
export class PurchaseQuotationListComponent {
  purchaseQuotation: PurchaseQuotation[];
  pagePrivilege: Array<string>;
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor(private router: Router,
    public dialog: MatDialog,
    public dialogExpiry: MatDialog,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private purchaseQuotationCuvService: PurchaseQuotationCuvService,
    private Ns:NofificationconfigurationService,private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.GetUserId();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    this.Redirect();

  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
        //Get list by login user...
        this.getAllList();
      }
    });
  }
  getAllList() {
    this.purchaseQuotationCuvService.getAllPurchaseQuotation(parseInt(this.userId$)).subscribe(res => {
      // this.purchaseQuotation = res.map(item => {
      //   const formattedpqDate = this.formatDate(item.pqDate);
      //   return { ...item, pqDate: formattedpqDate };
      // });
      this.purchaseQuotation = res?.map(item => {
        return {
          ...item,
          pqDate: item.pqDate === '1900-01-01T00:00:00' ? null : new Date(item.pqDate),
        };
      });
      console.log(this.purchaseQuotation);
    });
  }

  formatDate(dateString: any): Date {
    return new Date(dateString);
  }

  // Is equal to
  // formatDate(dateString: any): Date {
  //   const dateOnly = new Date(dateString);
  //   dateOnly.setHours(0, 0, 0, 0); 
  //   return dateOnly;
  // }

  add() {
    this.purchaseQuotationCuvService.isView = false;
    this.purchaseQuotationCuvService.isEdit = false;
    this.router.navigate(["/crm/transaction/purchasequotationgenerate"]);
    this.purchaseQuotationCuvService.setItemId(0)
  }
  onEdit(data: any) {
    this.purchaseQuotationCuvService.isView = false;
    this.purchaseQuotationCuvService.isEdit = true;
    this.router.navigate(["/crm/transaction/purchasequotation/cuv"]);
    this.purchaseQuotationCuvService.setItemId(data.purchaseQuoteId)
  }
  onDelete(data: any) {
    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete " + data.pqNumber + '...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.purchaseQuotationCuvService.purchaseQuotationDelete(data.purchaseQuoteId).subscribe((res) => {
          this.getAllList();
          const parms ={
            MenuId:59,
            currentUser:this.userId$,
            activityName:"Deletion",
            id:data.purchaseQuoteId,
            code:data.pqNumber
          }
          this.Ns.TriggerNotification(parms).subscribe((res=>{
            console.log(res);
          }));
          Swal.fire(
            'Deleted!',
            'Customer ' + data.pqNumber + ' has been deleted',
            'success'
          )
        },);
      }
    })

  }
  Redirect() {
    var Id = this.route.snapshot.params["id"];
    if(Id!=null){
      this.purchaseQuotationCuvService.isView = true;
      this.purchaseQuotationCuvService.isEdit = false;
      this.router.navigate(["/crm/transaction/purchasequotation/cuv"]);
      this.purchaseQuotationCuvService.setItemId(Id);
    }
  }
  onview(data: any) {
    this.purchaseQuotationCuvService.isView = true;
    this.purchaseQuotationCuvService.isEdit = false;
    this.router.navigate(["/crm/transaction/purchasequotation/cuv"]);
    this.purchaseQuotationCuvService.setItemId(data.purchaseQuoteId)
  }
  OpenHistory(basedocnameId: number, id: number, statusId: number) {
    const payload: FollowUpHistoryParms = {
      baseDocNameId: basedocnameId,
      baseDocId: id
    }
    const dialogRef = this.dialog.open(FollowuphistoryComponent, {
      data: {
        parms: payload,
        screen: 7,
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
  OpenValidity(){
    const dialogRef = this.dialogExpiry.open(ExpiryDialogComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {

      const PayLoad: PQvaliditycloser = {
        pqList: result
      }
      this.purchaseQuotationCuvService.PostPQStatusList(PayLoad).subscribe((res) => {
        Swal.fire(
          'Closed!',
          'Purchase Quotation has been Closed',
          'success'
        )
        this.getAllList();
      });
    });
  }
  approveHistory(id: any) {
    debugger
    this.purchaseQuotationCuvService.isApproveHistory = true;
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
      this.purchaseQuotationCuvService.isApproveHistory = false;

    });
  }
}
