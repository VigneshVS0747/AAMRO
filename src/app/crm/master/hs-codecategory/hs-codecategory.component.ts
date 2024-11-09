import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Hscodecategory } from 'src/app/Models/crm/master/Hscodecategory';
import { CommonService } from 'src/app/services/common.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { HscodecategoryService } from './hscodecategory.service';
import { HsCodeCategory } from 'src/app/Models/crm/master/HsCode';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-hs-codecategory',
  templateUrl: './hs-codecategory.component.html',
  styleUrls: ['./hs-codecategory.component.css']
})
export class HsCodecategoryComponent implements OnInit {

  showAddRow: boolean | undefined;
  Date = new Date();
  hSCodeCategory:Hscodecategory[] = [];
  ShowError = false;
  Livestatus = 0;
  skip = 0;
  pagePrivilege: Array<string>;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor(private HSCService:HscodecategoryService,
    private commonService: CommonService
    ,private ErrorHandling:ErrorhandlingService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
){}

  ngOnInit(): void {
    this.GetUserId();
   this.GetIndustryType();
   this.initializePage();
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
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
  GetIndustryType() {
    this.HSCService.GetAllhSCodeCategory(this.Livestatus).subscribe({
      next: (res) => {
        this.hSCodeCategory = res;
        console.log("res==>", res);
      },
      error: (error) => {
        console.log("error==>", error);

        
      },
    });
  }

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow:Hscodecategory = {
        hsCodeCategoryId: 0,
        hsCodeCategoryCode: '',
        hsCodeCategoryName: '',
        description: '',
        livestatus: true,
        createdBy:parseInt(this.userId$),
        createdDate:this.Date,
        updatedBy:parseInt(this.userId$),
        updatedDate:this.Date,
        Isedit: true,
        message: ''
      };
      this.hSCodeCategory = [newRow, ...this.hSCodeCategory];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Save(obj:Hscodecategory) {
    if (obj.hsCodeCategoryCode != "" && obj.hsCodeCategoryName != "") {
      console.log(obj);
      this.HSCService
        .CreatehSCodeCategory(obj).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
              "Added Sucessfully"
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

  Update(obj:Hscodecategory) {
    if (obj.hsCodeCategoryCode != "" && obj.hsCodeCategoryName != "") {
      obj.updatedBy=parseInt(this.userId$);
      this.HSCService.UpdatehSCodeCategory(obj).subscribe({
        next: (res) => {
          this.commonService.displayToaster(
            "success",
            "Success",
            "Updated Sucessfully"
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

  oncancel(obj: Hscodecategory) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: Hscodecategory) {
    this.hSCodeCategory.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }
  onDescriptionInput(event: Event, dataItem:Hscodecategory ) {
    const inputValue = (event.target as HTMLInputElement).value;
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.description = inputValue;
    }
  }
  

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the HsCodecategory!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.HSCService
          .DeletehSCodeCategory(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The HsCodecategory you are trying to delete is already in use. Do you want to in-active this department ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.HSCService
                    .IsActive(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "HsCodecategory has been in-activated sucessfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "HsCodecategory is already in-active !",
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
              this.showAddRow = false;
              Swal.fire("Deleted!", "HsCodecategory has been deleted", "success");
            }
          });
      }
    });
  }

  getlist() {
    this.HSCService.GetAllhSCodeCategory(this.Livestatus).subscribe((result) => {
      this.hSCodeCategory = result;
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
