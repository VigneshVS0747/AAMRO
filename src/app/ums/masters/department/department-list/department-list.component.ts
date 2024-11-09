import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Department } from "../department.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { DepartmentsService } from "../departments.service";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { CommonService } from "src/app/services/common.service";
import { PageEvent } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { Observable, catchError, throwError } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.css", "../../../ums.styles.css"],
})
export class DepartmentListComponent implements OnInit, AfterViewInit {
  
  totalDepartments = 0;
  departmentPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  pageIndex = 1;
  showAddRow: boolean | undefined;
  Date = new Date();
  departments: Department[] = [];
  ShowError = false;
  Livestatus = 0;
  
  skip = 0;
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;

  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Department>;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  displayedColumns: string[] = [
    "departmentCode",
    "departmentName",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  pagePrivilege: Array<string>;
  userId$:string;

  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private departmentsService: DepartmentsService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>
  ) {}

  ngOnInit(): void {
    this.initializePage();
    this.getDepartments();
  }

  initializePage() {
    let i =0;
    this.dataSource = new MatTableDataSource(this.departments);
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
    if(this.pagePrivilege.includes("view")){
      this.getDepartments();
    }else{
      
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortDepartment: Sort) {
    if (sortDepartment.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortDepartment.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  onChangePage(data: PageEvent) {
    this.pageIndex = data.pageIndex + 1;
    this.departmentPerPage = data.pageSize;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addDepartment() {
    this.router.navigate(["/ums/department/create"]);
  }

  onDelete(department: Department) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the department " +
          department.departmentName +
          "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.departmentsService
          .deleteDepartment(department.departmentId)
          .subscribe(
            (res) => {
              this.getDepartments();
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

  getDepartments() {
    this.commonService.getDepartments(this.Livestatus).subscribe((result) => {
      this.departments = result;
      this.dataSource.data = this.departments;
    });
  }
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: Department = {
        departmentId: 0,
        departmentCode: "",
        departmentName: "",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy:parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
      };
      this.departments = [newRow, ...this.departments];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Save(obj: Department) {
    if (obj.departmentCode != "" && obj.departmentName != "") {
      console.log(obj);
      this.departmentsService
        .addDepartment(obj)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Department already exists!!",
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

  Update(obj: Department) {
    const Department = {
      ...obj,
      updatedBy:parseInt(this.userId$)
    }
    if (obj.departmentCode != "" && obj.departmentName != "") {
      console.log(obj);
      this.departmentsService.updateDepartment(Department).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
        this.showAddRow = false;
      }
      ,(error) => {
        if(error.error.ErrorDetails.includes('UNIQUE KEY')){
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Department already exists!!",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
      );
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

  oncancel(obj: Department) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: Department) {
    this.departments.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }

  // Delete(id:number){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "Delete the department!..",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //     }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.departmentsService.deleteDepartment(id).subscribe((res) => {
  //         this.getlist();
  //         this.showAddRow = false;
  //         Swal.fire(
  //           'Deleted!',
  //           'Department has been deleted',
  //           'success'
  //         )
  //       });

  //     }
  //     })
  // }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Department!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentsService
          .deleteDepartment(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The department you are trying to delete is already in use. Do you want to in-active this department ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.departmentsService
                    .IsActiveDepartment(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Department has been in-activated successfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "Department is already in-active !",
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
              Swal.fire("Deleted!", "Department has been deleted", "success");
            }
          });
      }
    });
  }

  getlist() {
    this.commonService.getDepartments(this.Livestatus).subscribe((result) => {
      this.departments = result;
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
