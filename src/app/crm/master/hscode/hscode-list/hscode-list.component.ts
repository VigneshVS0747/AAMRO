import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HsCode } from 'src/app/Models/crm/master/HsCode';
import { HscodeService } from '../hscode.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-hscode-list',
  templateUrl: './hscode-list.component.html',
  styleUrls: ['./hscode-list.component.css']
})
export class HscodeListComponent {
  hsCodes: any[] = [];
 // hsCodePermit: HsCodePermit[] = [];
 // hsCodePart: HsCodePart[] = [];
  //hsCodeDocument: HsCodeDocument[] = [];
  pagePrivilege: Array<string>;
  Livestatus=0;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
  
  constructor(
    private hscodeSvc: HscodeService,  
    private store: Store<{ privileges: { privileges: any } }>,
    private router: Router) { }

  ngOnInit(): void {
    this.getHSCodeItems();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }
  add() {
    this.router.navigate(["/crm/master/hscode/create"]);
    this.hscodeSvc.isView = false;
    this.hscodeSvc.setItemId(0)
  }
  //#region Get All HSCodes in list
  getHSCodeItems() {
    this.hscodeSvc.getAllHsCodes(this.Livestatus).subscribe(result => {
      this.hsCodes = result;
      console.log("result",result);
    })
  }
  //#endregion Get All Hscode in list
  
  onview(item: any){
    if(item){
      this.hscodeSvc.isView=true;
      this.hscodeSvc.setItemId(item.hsCodeId);
      this.router.navigate(["/crm/master/hscode/create"]);
    }
  }

  //#region Delete Hscode
  onDelete(hsCode: any) {
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
        this.hscodeSvc.deletehSCode(hsCode.hsCodeId)
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
            this.getHSCodeItems();
            Swal.fire(
              'Deleted!',
              'HS Code has been deleted',
              'success'
            )
          });
      }
    })
  }
  //#endregion

  //#region edit
  onEdit(item: any) {
    this.hscodeSvc.setItemId(item.hsCodeId);
    this.hscodeSvc.isView = false;
    this.router.navigate(['/crm/master/hscode/create']);
  }
  //#endregion
}
