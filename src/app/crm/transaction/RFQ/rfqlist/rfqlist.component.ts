import { Component, OnInit } from '@angular/core';
import { RfqService } from '../rfq.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Rfqgeneral } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import Swal from 'sweetalert2';
import { FollowUpHistoryParms } from 'src/app/Models/crm/master/transactions/Followup';
import { FollowuphistoryComponent } from '../../Enquiry/enquiry/FollowUphistory/followuphistory/followuphistory.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { PqcompareComponent } from '../pqcompare/pqcompare.component';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { EmailComponent } from 'src/app/ums/Email/email/email.component';
import { EnquiryService } from '../../Enquiry/enquiry.service';

@Component({
  selector: 'app-rfqlist',
  templateUrl: './rfqlist.component.html',
  styleUrls: ['./rfqlist.component.css']
})
export class RfqlistComponent implements OnInit {
  RFQLIST: Rfqgeneral[] = [];
  pagePrivilege: Array<string>;
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  constructor(private RFQS: RfqService, private router: Router, public dialog: MatDialog,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,private Ns:NofificationconfigurationService,private route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.GetUserId();
    this.Redirect();
  }

  GetALLRFQ() {
    this.RFQS.GetAllRfq(parseInt(this.userId$)).subscribe((res) => {
      this.RFQLIST = res
      console.log("this.RFQLIST", this.RFQLIST);
    });
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
        //Get list by login user...
        this.GetALLRFQ();
      }
    });
  }
  onEdit(id: number) {
    this.RFQS.isView = false;
    this.RFQS.isEdit = true;
    this.router.navigate(["/crm/transaction/rfq/create"]);
    this.RFQS.setItemId(id);
  }
  Redirect() {
    var Id = this.route.snapshot.params["id"];
    if(Id!=null){
      this.RFQS.isView = true;
      this.RFQS.isEdit = false;
      this.router.navigate(["/crm/transaction/rfq/create"]);
      this.RFQS.setItemId(Id);
    }
  }
  view(id: number) {
    this.RFQS.isView = true;
    this.RFQS.isEdit = false;
    this.router.navigate(["/crm/transaction/rfq/create"]);
    this.RFQS.setItemId(id);
  }


  Delete(data:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the RFQ!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.RFQS.DeleteRFQ(data.rfqId).subscribe((res) => {
          const parms ={
            MenuId:62,
            currentUser:this.userId$,
            activityName:"Deletion",
            id:data.rfqId,
            code:data.rfqNumber
          }
          this.Ns.TriggerNotification(parms).subscribe((res=>{

          }));
          this.GetALLRFQ();
          Swal.fire(
            'Deleted!',
            'RFQ has been deleted',
            'success'
          )
        });

      }
    })
  }


  Add() {
    this.RFQS.isView = false;
    this.RFQS.isEdit = false;
    this.router.navigate(["/crm/transaction/rfq/create"]);
    this.RFQS.setItemId(0);
  }
  PQ(id: number,statusId:number) {
    if(statusId==1)
      {
        this.RFQS.rfq = true;
        this.RFQS.Fromrfq = true;
        this.router.navigate(["/crm/transaction/purchasequotationgenerate"]);
        this.RFQS.setItemId(id);
      }
      else{
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "The RFQ status is not open.",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
   
  }

  OpenHistory(basedocnameId: number, RfqId: number, statusId: number) {
    const payload: FollowUpHistoryParms = {
      baseDocNameId: basedocnameId,
      baseDocId: RfqId
    }
    const dialogRef = this.dialog.open(FollowuphistoryComponent, {
      data: {
        parms: payload,
        screen: 2,
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
  SendMail(id:number){
    this.RFQS.GetRFQbasedVendorEmail(id).subscribe(
      (response) => {
        console.log("response",response)
        const customerEmail = response.customerEmail;
        const pdfBase64 = response.pdf;

        const dialogRef = this.dialog.open(EmailComponent, {
          data: {
            id:id,
            email: customerEmail,
            pdf: pdfBase64,
            screenId:62
          },
        width: '100%',
        height:'85%'
     });
     
      },
      (error: any) => {
        console.error('Error fetching email and PDF:', error);
        // Handle the error as needed
      }
    );
      
  }


  PQCompare(){
    const dialogRef = this.dialog.open(PqcompareComponent, {
      data: {
      }, disableClose: true, autoFocus: false
    });
  }
}
