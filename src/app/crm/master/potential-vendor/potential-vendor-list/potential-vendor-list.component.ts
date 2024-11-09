import { Component } from '@angular/core';
import { PotentialVendorService } from '../potential-vendor.service';
import { Router } from '@angular/router';
import { PotentialVendor } from '../potential-vendor.model';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FollowuphistoryComponent } from 'src/app/crm/transaction/Enquiry/enquiry/FollowUphistory/followuphistory/followuphistory.component';
import { FollowUpHistoryParms } from 'src/app/Models/crm/master/transactions/Followup';
import { Store } from '@ngrx/store';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';


@Component({
  selector: 'app-potential-vendor-list',
  templateUrl: './potential-vendor-list.component.html',
  styleUrls: ['./potential-vendor-list.component.css']
})
export class PotentialVendorListComponent {
  potentialVendor: PotentialVendor[]=[];
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  userId$: any;

  constructor(private potentialVendorSvc:PotentialVendorService,
    private store: Store<{ privileges: { privileges: any } }>,
    private router: Router, public dialog: MatDialog,private Ns:NofificationconfigurationService, private UserIdstore: Store<{ app: AppState }>){}
 
 ngOnInit(): void {
   this.getAllPotentialVendor();
   this.GetUserId();  
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
 getAllPotentialVendor()
 {

   debugger
   
   this.potentialVendorSvc.getAllPotentialVendor().subscribe(result => {
   this.potentialVendor = result;
   console.log(this.potentialVendor)
   });
 }
 
 add(){
   this.potentialVendorSvc.isView=false;
   this.potentialVendorSvc.isEdit=false;
   this.router.navigate(["/crm/master/potentialvendor/create"]);
   this.potentialVendorSvc.setItemId(0)
  }
 
  onEdit(item:any)
  {
    if(item.pvStatusId==3){
      Swal.fire({
        title: 'Exist',
        text: "The " + item.vendorName + ' potential vendor is already moved to vendor...!',
        icon: 'warning',
        confirmButtonText: 'ok'
      })
      return
    }
   this.potentialVendorSvc.isView=false;
   this.potentialVendorSvc.isEdit=true;
   this.potentialVendorSvc.setItemId(item.potentialVendorId);
   this.router.navigate(["/crm/master/potentialvendor/create"]);
 
  }
 
  onview(item:any)
  {
   if(item){
     this.potentialVendorSvc.isView=true;
     this.potentialVendorSvc.isEdit=false;
     this.potentialVendorSvc.setItemId(item.potentialVendorId);
     this.router.navigate(["/crm/master/potentialvendor/create"]);
 
   }
  }
  
  onMail(data:any)
  {
 alert('Mail');
  }

  onDelete(data:any)
  {
   Swal.fire({
     title: 'Are you sure to?',
     text: "Delete " + data.vendorName + '...!',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Yes, delete it!'
   }).then((result) => {
     if (result.isConfirmed) {
       this.potentialVendorSvc.deletePotentialVendor(data.potentialVendorId).subscribe((res) => {
        const parms ={
          MenuId:27,
          currentUser:this.userId$,
          activityName:"Deletion",
          id:data.potentialVendorId,
          code:data.potentialVendorCode
        }
        this.Ns.TriggerNotification(parms).subscribe((res=>{

        }));
         this.getAllPotentialVendor();
         Swal.fire(
           'Deleted!',
           'Potential Vendor ' + data.vendorName + ' has been deleted',
           'success'
         )
       },);
     }
   })
 
  }
  followup(data:any)
  {
 
  }

  pVToVendor(data:any)
  {
    if (data.pvStatusId == 4) {
      Swal.fire({
        title: 'Info',
        text: "The " + data.vendorName + ' potential vendor is Unable to move Vendor...!',
        icon: 'info',
        confirmButtonText: 'ok'
      })
      return;
    }
    if(data.pvStatusId==3){
      Swal.fire({
        title: 'Exist',
        text: "The " + data.vendorName + ' potential vendor is already moved to vendor...!',
        icon: 'warning',
        confirmButtonText: 'ok'
      })
      return;
    }
    if (data.pvStatusId == 2) {
      Swal.fire({
        title: 'Info',
        text: "The " + data.vendorName + ' potential vendor is already In-Active...!',
        icon: 'info',
        confirmButtonText: 'ok'
      })
      return;
    }
    this.potentialVendorSvc.movetoVendor=true;
    this.potentialVendorSvc.setItemId(data.potentialVendorId);
    this.router.navigate(["/crm/master/vendor/create-edit-view"]);
  }

  OpenHistory(basedocnameId:number,id:number,statusId:number){
    const payload:FollowUpHistoryParms={
      baseDocNameId: basedocnameId,
      baseDocId: id
    }
    const dialogRef = this.dialog.open(FollowuphistoryComponent, {
      data: {
        parms:payload,
        screen:6,
        status:statusId, 
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
