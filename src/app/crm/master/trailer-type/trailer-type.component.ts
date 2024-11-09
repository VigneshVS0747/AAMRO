import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TrailerType } from 'src/app/Models/crm/master/trailerType';
import { CommonService } from 'src/app/services/common.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';

import { TrailerTypeService } from './trailer-type.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-trailer-type',
  templateUrl: './trailer-type.component.html',
  styleUrls: ['./trailer-type.component.css']
})
export class TrailerTypeComponent {
  showAddRow: boolean | undefined;
  Date = new Date();
  TrailerType: TrailerType[] = [];
  ShowError = false;
  Livestatus = 0;
  pagePrivilege: Array<string>;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  constructor(private TrailerTypeService:TrailerTypeService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private UserIdstore: Store<{ app: AppState }>,
    private ErrorHandling:ErrorhandlingService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private errorHandler: ApiErrorHandlerService){}

  ngOnInit(): void {
    this.GetUserId();
   this.GetTrailerType();
   this.initializePage();
  }
  initializePage() {
   
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }
  GetTrailerType() {
    this.TrailerTypeService.GetAllTrailerType(this.Livestatus).subscribe({
      next: (res) => {
        this.TrailerType = res;
        console.log("res==>", res);
      },
      error: (error) => {
        console.log("error==>", error);

        
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

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: TrailerType = {
        trailerTypeId: 0,
        trailerTypeCode: '',
        trailerTypeName: '',
        trailerDescription: '',
        livestatus:true,
        createdBy:parseInt(this.userId$),
        createdDate:this.Date,
        updatedBy:parseInt(this.userId$),
        updatedDate:this.Date,
        Isedit: true,
        message: ''
      };
      this.TrailerType = [newRow, ...this.TrailerType];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  onDescriptionInput(event: Event, dataItem:TrailerType ) {
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.trailerDescription = inputValue;
    }
  }
  Save(obj:TrailerType) {
    if (obj.trailerTypeCode != "" && obj.trailerTypeName != "") {
      console.log(obj);
      this.TrailerTypeService
        .CreateTrailerType(obj).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
               res.message
            );
            console.log("res==>", res);
            this.getlist();
            this.showAddRow = false;
          },
          error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if(stausCode === 500){
              this.errorHandler.handleError(err);
            } else if(stausCode === 400){
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          },
        });
      return false;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    }
  }

  Update(obj: TrailerType) {
    if (obj.trailerTypeCode != "" && obj.trailerTypeName != "") {
      obj.updatedBy=parseInt(this.userId$);
      this.TrailerTypeService.CreateTrailerType(obj).subscribe({
        next: (res) => {
          this.commonService.displayToaster(
            "success",
            "Success",
             res.message
          );
          console.log("res==>", res);
          this.getlist();
          this.showAddRow = false;
        },
        error: (err: HttpErrorResponse) => {
          let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
          if(stausCode === 500){
            this.errorHandler.handleError(err);
          } else if(stausCode === 400){
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        },
      });
      return false;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    }
  }

  oncancel(obj: TrailerType) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: TrailerType) {
    this.TrailerType.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the TrailerType!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.TrailerTypeService.DeleteTrailerType(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The TrailerType you are trying to delete is already in use. Do you want to in-active this department ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.TrailerTypeService
                    .IsActive(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        Swal.fire(
                          "Success",
                          "TrailerType has been in-activated sucessfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();     
                        Swal.fire(
                          "Info",
                          "TrailerType is already in-active !",
                          "info"
                        );
                      }
                    });
                }
              });
              return throwError(error); // Re-throw the error to propagate it to the subscriber
            })
          )
          .subscribe((res) => {
            if (res.message === "SUCCESS") {
              this.getlist();
              Swal.fire("Deleted!", "TrailerType has been deleted", "success");
            }
          });
      }
    });
  }

  getlist() {
    this.TrailerTypeService.GetAllTrailerType(this.Livestatus).subscribe((result) => {
      this.TrailerType = result;
    });
  }
  ValidateField(item: any) {
    if (item !== "") {
      return false;
    } else {
      return true;
    }
  }
  //#region Keyboard tab operation

  /// to provoke csave or update method
  hndlKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
    }
  }
  /// to reach submit button
  handleChange(event: any, dataItem: any) {
    if (event.key === "Tab" || event.key === "Enter") {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChange(event: any) {
    if (event.key === "Tab") {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.oncancel(dataItem);
    }
  }
  openDescriptionDialog(description: string) {
    const dialogRef = this.dialog.open(DescriptiondialogComponent, {
      width: '400px', // Set the width of the dialog
      height: '270px', // Set the height of the dialog
      data: { description: description },autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

}
