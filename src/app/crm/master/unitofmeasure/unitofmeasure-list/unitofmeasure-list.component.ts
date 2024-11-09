import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { UOM } from '../unitofmeasure.model';
import { PageEvent } from '@angular/material/paginator';
import { UOMsService } from '../unitofmeasure.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/confirmation/delete-confirmation-dialog.component';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';


@Component({
  selector: 'app-unitofmeasure-list',
  templateUrl: './unitofmeasure-list.component.html',
  styleUrls: ['./unitofmeasure-list.component.css']
})
export class UnitofmeasureListComponent {
  totaluoms = 0;
  uomPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  pageIndex = 1;
  showAddRow: boolean | undefined;
  Date = new Date();
  uoms: UOM[] = [];
  ShowError = false;
  Livestatus = 0;
  skip = 0;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<UOM>;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  displayedColumns: string[] = [
    "uomCode",
    "uomName",
    "uomDescription",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  userId$: string;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private uomsService: UOMsService,
    private commonService: CommonService,
    private router: Router,
    private UserIdstore: Store<{ app: AppState }>,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>,
    private errorHandler: ApiErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.GetUserId();
    this.dataSource = new MatTableDataSource(this.uoms);
    this.getUOMS();
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortUOM: Sort) {
    if (sortUOM.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortUOM.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  onChangePage(data: PageEvent) {
    this.pageIndex = data.pageIndex + 1;
    this.uomPerPage = data.pageSize;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addUOM() {
    this.router.navigate(["/ums/department/create"]);
  }

  onDelete(uom: UOM) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the unit of measurement " +
          uom.uomName +
          "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.uomsService
          .deleteUOM(uom.uomId)
          .subscribe(
            (res) => {
              this.getUOMS();
              // this.notificationService.ShowSuccess(res.message, "Logistics");
              this.commonService.displayToaster(
                "success",
                "Success",
                res.message
              );
            },
            (error) => {
              this.commonService.displayToaster(
                "error",
                "Error",
                JSON.stringify(error)
              );
              // this.notificationService.ShowError(
              //   JSON.stringify(error),
              //   "Logistics"
              // );
            }
          );
      }
    });
  }


  
  getUOMS() {
    this.uomsService.getUOMs().subscribe((result:any) => {
      this.uoms = result;
    // console.log(this.uoms)
    });
  }
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: UOM = {
        uomId: 0,
        uomCode: "",
        uomName: "",
        uomDescription: "",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
        message: ''
      };
      this.uoms = [newRow, ...this.uoms];
      this.showAddRow = true;
      
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  onDescriptionInput(event: Event, dataItem:UOM ) {
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.uomDescription = inputValue;
    }
  }
  Save(obj: UOM) {
    if (obj.uomCode != "" && obj.uomName != "") {
     // console.log(obj);
      this.uomsService
        .addUOM(obj).subscribe((response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added Sucessfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.getlist();
          this.showAddRow = false;
        },
          (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if (stausCode === 500) {
              this.errorHandler.handleError(err);
            } else if (stausCode === 400) {
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          }
        );
        return false;
      }else{
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
  
    Update(obj:UOM){
      if(obj.uomCode!=''&& obj.uomName!=''){
        obj.updatedBy=parseInt(this.userId$);
        this.uomsService.updateUOM(obj).subscribe(response=>{
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Updated Sucessfully',
            showConfirmButton: false,
            timer: 2000
          })
          this.getlist();
          this.showAddRow = false; 
          
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
        }
      );
        return false;
  
      }else{
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
    // onDescriptionInput(event: Event, dataItem:PackageType ) {
    //   const inputValue = (event.target as HTMLInputElement).value;
    
    //   // Enforce the maximum character limit
    //   if (inputValue.length <= 500) {
    //     dataItem.description = inputValue;
    //   }
    // }

    oncancel(obj:UOM){
      obj.Isedit=false;
      this.getlist();
      this.showAddRow=false;
    }
  
    Edit(obj:UOM){
      this.uoms.forEach(element=>{
        element.Isedit=false;
      });
      obj.Isedit=true;
    }
  
   
    Delete(id: number) {
      Swal.fire({
        title: "Are you sure?",
        text: "Delete the UOM!..",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.uomsService.deleteUOM(id)
            .pipe(
              catchError((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Not able to delete",
                  text: "The UOM you are trying to delete is already in use. Do you want to in-active this UOM ?",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.uomsService
                      .IsActive(id)
                      .subscribe((res) => {
                        if (res.message === "SUCCESS") {
                          this.getlist();
                          Swal.fire(
                            "Success",
                            "UOM has been in-activated sucessfully",
                            "success"
                          );
                        } else if (res.message === "In-Active") {
                          this.getlist();
                          Swal.fire(
                            "Info",
                            "UOM is already in-active !",
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
                Swal.fire("Deleted!", "UOM has been deleted sucessfully", "success");
              }
            });
        }
      });
    }
  
  getlist() {
   // console.log(this.uoms)
    this.uomsService.getUOMs().subscribe((result:any) => {
      this.uoms = result;
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

