import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { CommonService } from 'src/app/services/common.service';
import { ServiceTypeServiceService } from './service-type-service.service';
import Swal from 'sweetalert2';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.css']
})
export class ServicetypeComponent implements OnInit {
  showAddRow: boolean | undefined;
  Date = new Date();
  ServiceType: ServiceType[] = [];
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
  constructor(private ServiceTypeService: ServiceTypeServiceService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private ErrorHandling: ErrorhandlingService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>
) { }

  ngOnInit(): void {
    this.GetServiceType();
    this.initializePage();
    this.GetUserId();
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

  GetServiceType() {
    this.ServiceTypeService.GetAllServiceType(this.Livestatus).subscribe({
      next: (res) => {
        this.ServiceType = res;
        console.log("res==>", res);
      },
      error: (error) => {
        console.log("error==>", error);


      },
    });
  }
  onDescriptionInput(event: Event, dataItem: ServiceType) {
    const inputValue = (event.target as HTMLInputElement).value;

    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.serviceDescription = inputValue;
    }
  }
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: ServiceType = {
        serviceTypeId: 0,
        serviceTypeCode: '',
        serviceTypeName: '',
        serviceDescription: '',
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
        message: ''
      };
      this.ServiceType = [newRow, ...this.ServiceType];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Save(obj: ServiceType) {
    if (obj.serviceTypeCode != "" && obj.serviceTypeName != "") {
      console.log(obj);
      this.ServiceTypeService
        .CreateServiceType(obj).subscribe({
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
          error: (error) => {
            var ErrorHandle = this.ErrorHandling.handleApiError(error)
            this.commonService.displayToaster(
              "error",
              "Error",
              ErrorHandle
            );
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

  Update(obj: ServiceType) {
    if (obj.serviceTypeCode != "" && obj.serviceTypeName != "") {
      obj.updatedBy=parseInt(this.userId$);
      this.ServiceTypeService.CreateServiceType(obj).subscribe({
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
        error: (error) => {
          var ErrorHandle = this.ErrorHandling.handleApiError(error)
          this.commonService.displayToaster(
            "error",
            "Error",
            ErrorHandle
          );
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

  oncancel(obj: ServiceType) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: ServiceType) {
    this.ServiceType.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Service Type!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ServiceTypeService.DeleteServiceType(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The Service Type you are trying to delete is already in use. Do you want to in-active this Service Type ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.ServiceTypeService
                    .IsActive(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        Swal.fire(
                          "Success",
                          "Service Type has been in-activated sucessfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();
                        Swal.fire(
                          "Info",
                          "Service Type is already in-active !",
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
              Swal.fire("Deleted!", "Service Type has been deleted sucessfully", "success");
            }
          });
      }
    });
  }


  getlist() {
    this.ServiceTypeService.GetAllServiceType(this.Livestatus).subscribe((result) => {
      this.ServiceType = result;
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
