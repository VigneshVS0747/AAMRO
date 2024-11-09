import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Vendor } from 'src/app/Models/crm/master/Vendor';
import { VendorService } from '../vendor.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FollowuphistoryComponent } from 'src/app/crm/transaction/Enquiry/enquiry/FollowUphistory/followuphistory/followuphistory.component';
import { FollowUpHistoryParms } from 'src/app/Models/crm/master/transactions/Followup';
import { Store } from '@ngrx/store';
import { ApprovalHistoryDialogComponent } from '../../approval/approval-history-dialog/approval-history-dialog.component';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css','../../../../ums/ums.styles.css']
})
export class VendorListComponent {
  vendor:Vendor[]=[];
  pagePrivilege: Array<string>;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
  
  constructor(
    private vendorSvc: VendorService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    public dialog: MatDialog) { 
      this.getVendorItems();
    }
ngOnInit()
{
  this.store.select("privileges").subscribe({
    next: (res) => {
      console.log("this.pagePrivilege res===>", res);
      this.pagePrivilege = res.privileges[this.router.url.substring(1)];
      console.log("this.pagePrivilege ===>", this.pagePrivilege);
    },
  });

}
  //#region Get All Vendor in list
  getVendorItems() {
    this.vendorSvc.getAllVendor().subscribe(result => {
      this.vendor = result;
      console.log(this.vendor);
    })
  }
  //#endregion
  add(){
    this.router.navigate(["/crm/master/vendor/create-edit-view"]);
    this.vendorSvc.isView = false;
    this.vendorSvc.setItemId(0)
  }
  onview(item: any){
    if(item){
      this.vendorSvc.isView=true;
      this.vendorSvc.setItemId(item.vendorId);
      this.router.navigate(["/crm/master/vendor/create-edit-view"]);
    }
  }
  approveHistory(id: any) {
    debugger
    this.vendorSvc.isApproveHistory = true;
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
      this.vendorSvc.isApproveHistory = false;

    });
  }

  //#region Delete Hscode
  onDelete(vendor: any) {
    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete this record...!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vendorSvc.deleteVendor(vendor.vendorId)
          // .pipe(
          //   catchError((error) => {
          //     Swal.fire({
          //       icon: "error",
          //       title: "Not able to delete",
          //       text: "The Airport you are trying to delete is already in use. Do you want to in-active this Airport ?",
          //       showCancelButton: true,
          //       confirmButtonColor: "#3085d6",
          //       cancelButtonColor: "#d33",
          //       confirmButtonText: "Yes!",
          //     })
          //     .then((result) => {
          //       if (result.isConfirmed) {
          //         this.airportSvc.isActiveAirport(airport.airportId).subscribe((res) => {
          //           if (res.message === "SUCCESS") {
          //             this.getAirports();
          //             Swal.fire(
          //               "Success",
          //               "Airport has been in-activated sucessfully",
          //               "success"
          //             );
          //           } else if (res.message === "In-Active") {
          //             this.getAirports();
          //             Swal.fire("Info", "Airport is already in-active !", "info");
          //           }
          //         });
          //       }
          //     });
          //     return throwError(error); // Re-throw the error to propagate it to the subscriber
          //   })
          // )
          .subscribe((res:any) => {
            this.getVendorItems();
            Swal.fire(
              'Deleted!',
              'Vendor has been deleted',
              'success'
            )
          });
      }
    })
  }
  //#endregion

  //#region edit
  onEdit(item: any) {    
    this.vendorSvc.setItemId(item.vendorId);
    this.vendorSvc.isView = false;
    this.router.navigate(['/crm/master/vendor/create-edit-view']);
  }
  //#endregion
  OpenHistory(basedocnameId:number,id:number,statusId:number){
    const payload:FollowUpHistoryParms={
      baseDocNameId: basedocnameId,
      baseDocId: id
    }
    const dialogRef = this.dialog.open(FollowuphistoryComponent, {
      data: {
        parms:payload,
        screen:5,
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
