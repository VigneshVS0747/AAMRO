import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DesignationsService } from "../designations.service";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { MatSort, Sort } from "@angular/material/sort";
import { Designation } from "../../../../Models/ums/designation.model";
import { MatTableDataSource } from "@angular/material/table";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatDialog } from "@angular/material/dialog";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { CommonService } from "src/app/services/common.service";
import Swal from "sweetalert2";
import { catchError, throwError } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: "app-designation-list",
  templateUrl: "./designation-list.component.html",
  styleUrls: ["./designation-list.component.css", "../../../ums.styles.css"],
})
export class DesignationListComponent implements OnInit, AfterViewInit {
  designations: Designation[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  Livestatus = 0;
  userId$:string;
  skip = 0;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  dataSource!: MatTableDataSource<Designation>;
  pagePrivilege: Array<string>;

  displayedColumns: string[] = [
    "designationCode",
    "designationName",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private commonService: CommonService,
    private designationsService: DesignationsService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>
  ) {
    this.initializePage();
  }

  ngOnInit(): void { }

  initializePage() {
    this.dataSource = new MatTableDataSource(this.designations);
    this.getDesignations();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    this.UserIdstore.select("app").subscribe({
      next:(res)=>{
       this.userId$=res.userId;
      }
    });
    console.log("this.userId$",this.userId$);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortDesignation: Sort) {
    if (sortDesignation.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortDesignation.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addDesignation() {
    this.router.navigate(["/ums/designation/create"]);
  }

  onDelete(designation: Designation) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the designation " +
          designation.designationName +
          "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.designationsService
          .deleteDesignation(designation.designationId)
          .subscribe(
            (res) => {
              this.getDesignations();
              // this.notificationService.ShowSuccess(res.message, "Logistics");
              this.commonService.displayToaster(
                "success",
                "Success",
                res.message
              );
            },
            (error) => {
              // this.notificationService.ShowError(
              //   JSON.stringify(error),
              //   "Logistics"
              // );
              this.commonService.displayToaster(
                "error",
                "Error",
                JSON.stringify(error)
              );
            }
          );
      }
    });
  }

  getDesignations() {
    this.commonService.getDesignations(this.Livestatus).subscribe((result) => {
      this.designations = result;
      this.dataSource.data = this.designations;
    });
  }

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: Designation = {
        designationId: 0,
        designationCode: "",
        designationName: "",
        livestatus: true,
        createdBy:parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy:parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
      };
      this.designations = [newRow, ...this.designations];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Save(obj: Designation) {
    if (obj.designationCode != "" && obj.designationName != "") {
      console.log(obj);
      this.designationsService
        .addDesignation(obj)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Designation already exists!",
              showConfirmButton: false,
              timer: 2000,
            });
            throw error;
          })
        )
        .subscribe((response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.getlist();
          this.showAddRow = false;
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

  Update(obj: Designation) {
    if (obj.designationCode != "" && obj.designationName != "") {
      const Designation = {
        ...obj,
        updatedBy:parseInt(this.userId$)
      }
      console.log(obj);
      this.designationsService.updateDesignation(Designation).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
      }
      ,(error) => {
        if(error.error.ErrorDetails.includes('UNIQUE KEY')){
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Designation already exists!!",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      });
      return false;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the manitory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    }
  }
  oncancel(obj: Designation) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: Designation) {
    this.showAddRow = false;
    this.designations.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }

  // Delete(id: number) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Delete the Designation!..",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.designationsService.deleteDesignation(id).subscribe((res) => {
  //         this.getlist();
  //         Swal.fire("Deleted!", "Designation has been deleted", "success");
  //       });
  //     }
  //   });
  // }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Designation!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.designationsService
          .deleteDesignation(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The designation you are trying to delete is already in use. Do you want to in-active this designation ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.designationsService
                    .isActiveDesignation(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Designation has been in-activated successfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "Designation is already in-active !",
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
              Swal.fire("Deleted!", "Designation has been deleted", "success");
            }
          });
      }
    });
  }

  getlist() {
    this.commonService.getDesignations(this.Livestatus).subscribe((result) => {
      this.designations = result;
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

  //#endregion
}
