import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModeofTransportService } from './modeOfTransport.service';
//import { LiveAnnouncer } from '@angular/cdk/a11y';
import Swal from "sweetalert2";
import { catchError } from 'rxjs';
import { ModeofTransport } from 'src/app/Models/crm/master/ModeofTransport';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';

@Component({
  selector: 'app-mode-of-transport',
  templateUrl: './mode-of-transport.component.html',
  styleUrls: ['./mode-of-transport.component.css']
})
export class ModeOfTransportComponent implements OnInit {
  modeofTransport: ModeofTransport[]=[];
  showAddRow: boolean | undefined;
  Date = new Date();
  pagePrivilege: Array<string>;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  userId$: string;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
  
  constructor(
    private modeoftrnsptservice: ModeofTransportService,
    private UserIdstore: Store<{ app: AppState }>, 
    private store: Store<{ privileges: { privileges: any } }>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.GetUserId()
    this.getModeofTransport();
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

  //#region Get All Mode of Transport
  getModeofTransport() {
    this.modeoftrnsptservice.getAllModeofTransport().subscribe((result) => {
      this.modeofTransport = result;
    });
  }
  //#endregion

  //#region Add new row
  Add(){
    if (!this.showAddRow) {
      const newRow: ModeofTransport = {
        modeofTransportId: 0,
        modeofTransportCode: "",
        modeofTransportName: "",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
      };
      this.modeofTransport = [newRow, ...this.modeofTransport];
      this.showAddRow = true;
    }
  }
  //#endregion

  //#region Validate whether the field is valid
  ValidateField(item: any) {
    return item !== ''?false:true
    // if (item !== "") {
    //   return false;
    // } else {
    //   return true;
    // }
  }
  //#endregion

  //#region Edit
  Edit(obj:any){
    this.modeofTransport.forEach(element=>{
      element.Isedit=false;
    });
    obj.Isedit=true;
    this.showAddRow=false;
  }
  //#endregion

  //#region Save new Mode of Transport
  Save(obj: ModeofTransport) {
    if (obj.modeofTransportCode != "" && obj.modeofTransportName != "") {
      this.modeoftrnsptservice.addModeofTtansport(obj).pipe(
        catchError((error) => {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Mode of Transport is already exists!",
            showConfirmButton: false,
            timer: 2000,
          });
          throw error;
        })
      ).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getModeofTransport();
        this.showAddRow = false;
      })
      return false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please fill the mandatory fields',
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    }
  }
  //#endregion

  //#region Update Mode of Transport
  Update(obj: any) {
    if (obj.modeofTransportCode != "" && obj.modeofTransportName != "") {
      obj.updatedBy=parseInt(this.userId$);
      this.modeoftrnsptservice.updateModeofTransport(obj).pipe(
        catchError((error) => {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Mode of Transport is already exists!",
            showConfirmButton: false,
            timer: 2000,
          });
          throw error;
        })
      ).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getModeofTransport();
      });
      return false;
    } else {
      Swal.fire({
        icon: 'error',
          title: 'Oops!',
          text: 'Please fill the mandatory fields',
          showConfirmButton: false,
          timer: 2000
      })
      return true;
    }
  }
  //#endregion

  //#region delete record
  Delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this Mode of transport!..',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.modeoftrnsptservice.deleteModeofTtansport(id)
          .subscribe((res) => {
            if (res.message === 'SUCCESS') {
              this.getModeofTransport();
              this.showAddRow = false;
              Swal.fire(
                'Deleted!',
                'Mode of Transport has been deleted',
                'success'
              );
            }
          });
      }
    });
  }
  //#endregion
   
  //#region cancel the action add/edit
  oncancel(obj:any){
    obj.Isedit=false;
    this.getModeofTransport();
    this.showAddRow=false;
  }
  //#endregion

  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPress(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
    }
  }
  /// to reach submit button
  handleChange(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChange(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancel(dataItem)
    }
  }
  //#endregion
}
