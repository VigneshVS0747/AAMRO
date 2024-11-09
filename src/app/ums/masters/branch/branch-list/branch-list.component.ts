import { Component, ViewChild } from "@angular/core";
import { Branch } from "../branch.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { BranchService } from "../branch.service";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { CommonService } from "src/app/services/common.service";
import Swal from "sweetalert2";
import { catchError, throwError } from "rxjs";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-branch-list",
  templateUrl: "./branch-list.component.html",
  styleUrls: ["./branch-list.component.css", "../../../ums.styles.css"],
})
export class BranchListComponent {
  branches: Branch[] = [];
  filter: any;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Branch>;
  showAddRow: boolean | undefined;
  Livestatus=0;

  displayedColumns: string[] = [
    "branchCode",
    "branchName",
    "aliasName",
    "branchType",
    "contactPerson",
    "contactNumber",
    "addressLine1",
    "addressLine2",
    "cityName",
    "stateName",
    "countryName",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private branchService: BranchService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>
  ) { }

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.branchService.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });

    this.dataSource = new MatTableDataSource(this.branches);
    this.getBranches();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        console.log("this.router.url===>", this.router.url);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }

  onFilterChange(filter: any) {
    this.branchService.setFilterState(filter);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortBranch: Sort) {
    if (sortBranch.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortBranch.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addBranch() {
    this.router.navigate(["/ums/master/branches/create"]);
  }

  onDelete(branch: Branch) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Branch!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.branchService
          .deleteBranch(branch.branchId)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The branch you are trying to delete is already in use. Do you want to in-active this branch ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.branchService
                    .isActiveBranch(branch.branchId)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getBranches();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Branch has been in-activated successfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getBranches();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "Branch is already in-active !",
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
              this.getBranches();
              this.showAddRow = false;
              Swal.fire("Deleted!", "Branch has been deleted", "success");
            }
          });
      }
    });
  }

  // onDelete(branch: Branch) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Delete Branch!..",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.branchService.deleteBranch(branch.branchId).subscribe((res) => {
  //         this.getBranches();
  //         Swal.fire("Deleted!", "Branch has been deleted", "success");
  //       });
  //     }
  //   });
  // }

  getBranches() {
    this.commonService.getBranches(this.Livestatus).subscribe((result) => {
      this.branches = result;
      console.log("branch===>", result);
      this.dataSource.data = this.branches;
    });
  }
}
