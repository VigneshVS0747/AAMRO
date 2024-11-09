import { Component, ViewChild } from "@angular/core";
import {
  AccessControlTemplate,
  AccessControlTemplateMenus,
} from "../act.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ActService } from "../act.service";
import { NotificationService } from "src/app/services/notification.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import Swal from "sweetalert2";
import { catchError, throwError } from "rxjs";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-act-list",
  templateUrl: "./act-list.component.html",
  styleUrls: ["./act-list.component.css", "../../../ums.styles.css"],
})
export class ActListComponent {
  acts: AccessControlTemplate[] = [];
  pagePrivilege: Array<string>;

  displayedColumns: string[] = [
    "accessControlName",
    "accessControlCode",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];

  subtableColumns: string[] = [
    "sno",
    "menuName",
    "eview",
    "eadd",
    "eedit",
    "edelete",
    "eprint",
    "eexport",
    "ecancel",
    "ereject",
    "eapprove",
    "eafterApprove",
    "eappHis",
    "eauditLog",
  ];

  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<AccessControlTemplate>;
  subDataSource!: MatTableDataSource<AccessControlTemplateMenus>;
  selectedRow: any = null;
  filter: any;
  showAddRow: boolean | undefined;
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private actService: ActService,
    private commonService: CommonService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.actService.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });
    this.dataSource = new MatTableDataSource(this.acts);
    this.getActs();
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
  onFilterChange(filter: any) {
    this.actService.setFilterState(filter);
  }

  announceSortChange(sortAct: Sort) {
    if (sortAct.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortAct.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.toggleSubtable(this.selectedRow); //to remove the subtable
  }

  toggleSubtable(row: any): void {
    if (this.selectedRow === row) {
      // If the same row is clicked, hide the subtable
      this.selectedRow.showSubtable = false;
      this.selectedRow = null;
    } else {
      // Show the subtable for the clicked row

      this.selectedRow = row;
      this.selectedRow.showSubtable = true;
      this.subDataSource = new MatTableDataSource(this.selectedRow.menus);
    }
  }

  onDelete(act: AccessControlTemplate) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete Access Control!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.actService
          .deleteAct(act.accessControlId)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The Access Control Template you are trying to delete is referred.Do you want to In-active",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.actService
                    .IsActiveAct(act.accessControlId)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getActs();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Access Control Template has been In-activated successfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getActs();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "Access Control Template is already in-active !",
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
              this.getActs();

              Swal.fire(
                "Deleted!",
                "Access Control Template has been deleted",
                "success"
              );
            }
          });
      }
    });
  }

  addAct() {
    this.router.navigate(["/ums/activity/acts/create"]);
  }

  getActs() {
    this.commonService.getActs().subscribe((result) => {
      this.acts = result.map((act) => {
        return {
          ...act,
          createdDate: new Date(act.createdDate.toString()),
          updatedDate: new Date(act.updatedDate.toString()),
        };
      });
      this.dataSource.data = this.acts;
    });
  }
}
