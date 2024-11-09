import { Component, ViewChild } from "@angular/core";
import { Employee } from "../employee.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { EmployeeService } from "../employee.service";

import { NotificationService } from "src/app/services/notification.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { CommonService } from "src/app/services/common.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { catchError, throwError } from "rxjs";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css", "../../../ums.styles.css"],
})
export class EmployeeListComponent {
  employees: Employee[] = [];
  Livestatus = 0;
  filter: any;
  showAddRow: boolean | undefined;
  pagePrivilege: Array<string>;

  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Employee>;

  displayedColumns: string[] = [
    "employeeCode",
    "employeeName",
    "departmentName",
    "reportingName",
    "designationName",
    "branchName",
    "cityName",
    "stateName",
    "countryName",
    "email",
    "contactNumber",
    "doj",
    "address",
    "empSignature",
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
    private employeeService: EmployeeService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>
  ) { }

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.employeeService.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });

    this.dataSource = new MatTableDataSource(this.employees);
    this.getEmployees();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortEmployee: Sort) {
    if (sortEmployee.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortEmployee.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
  onFilterChange(filter: any) {
    // Update filter state in the service
    this.employeeService.setFilterState(filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addEmployee() {
    this.router.navigate(["/ums/master/employ/create"]);
  }

  // onDelete(employee: Employee) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Delete the Employee!..",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.employeeService
  //         .deleteEmployee(employee.employeeId)
  //         .subscribe((res) => {
  //           this.getEmployees();
  //           Swal.fire("Deleted!", "Employee has been deleted", "success");
  //         });
  //     }
  //   });
  // }

  onDelete(employee: Employee) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Employee!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService
          .deleteEmployee(employee.employeeId)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The employee you are trying to delete is already in use. Do you want to in-active this employee ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.employeeService
                    .isActiveEmployee(employee.employeeId)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getEmployees();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Employee has been in-activated successfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getEmployees();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "Employee is already in-active !",
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
              this.getEmployees();
              this.showAddRow = false;
              Swal.fire("Deleted!", "Employee has been deleted", "success");
            }
          });
      }
    });
  }

  getEmployees() {
    this.commonService.getEmployees(this.Livestatus).subscribe((result) => {
      this.employees = result;
      console.log(result);
      this.dataSource.data = this.employees;
    });
  }
}
