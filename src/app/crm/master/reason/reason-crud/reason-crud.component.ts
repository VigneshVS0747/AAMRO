import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { catchError, throwError } from 'rxjs';
import { Reason, ReasonFlag } from 'src/app/Models/crm/master/Reason';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reason-crud',
  templateUrl: './reason-crud.component.html',
  styleUrls: ['./reason-crud.component.css']
})
export class ReasonCrudComponent {
  reason: Reason[] = [];
  reasonFlags: ReasonFlag[] = [];
  showAddRow: boolean;
  Date = new Date();
  selectedreasonFlagId:number;
  keyword = "reasonFlag";
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  userId$: string;
  Livestatus=0;
  pagePrivilege: Array<string>;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
    skip = 0;
  reasonFlag: any;
  constructor(
    private reasonmstSvc: ReasonService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
  ) { }
  ngOnInit(): void {
    this.GetUserId();
    this.getReasons();
    this.getReasonflag();

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

  //#region Get All Reason
  getReasons() {
    this.reasonmstSvc.getAllReason(this.Livestatus).subscribe((result) => {
      this.reason = result;
    });
  }
  //#endregion
  getReasonflag(){
    this.reasonmstSvc.getAllReasonFlag().subscribe((result)=>{
       this.reasonFlags=result;
    })
  }

  selectEvent(item: any) {
    this.selectedreasonFlagId = item.reasonFlagId;
    this.reasonFlag=item.reasonFlag;

  }
  onInputChange(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.reasonFlags.some(rsn => rsn.reasonFlag.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.reasonFlag = '';

    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  //#region Add new row
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});

    if (!this.showAddRow) {
      const newRow: Reason = {
        reasonId: 0,
        reasonCode: "",
        reasonName: "",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
        reasonFlagId: 0,
        remarks: '',
        reasonFlag: ''
      };
      this.reason = [newRow, ...this.reason];
      this.showAddRow = true;
    }
  }
  //#endregion
  onRemarksInput(event: Event, dataItem:Reason ) {
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.remarks = inputValue;
    }
  }
  //#region Validate whether the field is valid
  ValidateField(item: any) {
    return item !== '' ? false : true
  }
  //#endregion

  //#region Edit
  Edit(obj: any) {
    this.selectedreasonFlagId=obj.reasonFlagId;
    this.reasonFlag=obj.reasonFlag;
    this.reason.forEach(element => {
      element.reasonFlag=obj.reasonFlag
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }
  //#endregion
  Empty()
  {
    this.reasonFlag=''
  }
  //#region Save new Mode of Transport
  Save(obj: Reason) {
    debugger
    obj.reasonFlagId=this.selectedreasonFlagId;
    obj.reasonFlag=this.reasonFlag;
    if (obj.reasonCode != "" && obj.reasonName != "" && obj.reasonFlag != '' ) {
      this.reasonmstSvc.addReason(obj).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getReasons();
        this.showAddRow = false;
        this.reasonFlag = '';
      },
      (err: HttpErrorResponse) => {
        let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
        if(stausCode === 500){
          this.errorHandler.handleError(err);
        } else if(stausCode === 400){
          this.errorHandler.FourHundredErrorHandler(err);
        } else {
          this.errorHandler.commonMsg();
        }
      },
    )
      return false;
    } else {
      Swal.fire({
        icon: 'info',
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
  Update(obj: Reason) {
    obj.reasonFlagId=this.selectedreasonFlagId;
    obj.reasonFlag=this.reasonFlag;
    if (obj.reasonCode != "" && obj.reasonName != "" && obj.reasonFlag != '') {
        obj.updatedBy=parseInt(this.userId$);
      this.reasonmstSvc.updateReason(obj).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.reasonFlag='';
        this.getReasons();
      },
      (err: HttpErrorResponse) => {
        let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
        if(stausCode === 500){
          this.errorHandler.handleError(err);
        } else if(stausCode === 400){
          this.errorHandler.FourHundredErrorHandler(err);
        } else {
          this.errorHandler.commonMsg();
        }
      },
    );
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
      text: 'Delete this Reason!..',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reasonmstSvc.deleteReason(id).pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Reason you are trying to delete is already in use. Do you want to in-active this Reason ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.reasonmstSvc.isActiveReason(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getReasons();
                    this.showAddRow = false;
                    Swal.fire(
                      "Success",
                      "Reason has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getReasons();
                    this.showAddRow = false;
                    Swal.fire("Info", "Reason is already in-active !", "info");
                  }
                });
              }
            });
            return throwError(error); // Re-throw the error to propagate it to the subscriber
          })
        )
          .subscribe((res) => {
            if (res.message === 'SUCCESS') {
              this.getReasons();
              this.showAddRow = false;
              Swal.fire(
                'Deleted!',
                'Reason has been deleted Sucessfully.',
                'success'
              );
            }
          });
      }
    });
  }
  //#endregion
  //#region cancel the action add/edit
  oncancel(obj: any) {
    obj.Isedit = false;
    this.getReasons();
    this.showAddRow = false;
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
