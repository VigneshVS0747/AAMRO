import { Component, ViewChild } from "@angular/core";
import { UserHeader, UserMenus, UserMenusAction } from "../user.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { UserService } from "../user.service";
import { CommonService } from "src/app/services/common.service";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";


@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css", "../../../ums.styles.css"],
})
export class UserListComponent {
  users: UserHeader[] = [];
  userMenus: UserMenus[] = [];
  umas: UserMenusAction[] = [];
  filter: any;
  displayedColumns: string[] = [
    "userCode",
    "employeeCode",
    "authorizationMatrixName",
    "livestatus",
    "view",
    // "edit",
    // "delete",
  ];

  // subtableColumns: string[] = [
  //   "sno",
  //   "menuName",
  //   "actionView",
  //   "actionAdd",
  //   "actionEdit",
  //   "actionDelete",
  //   "actionPrint",
  //   "actionExport",
  //   "actionCancel",
  //   "actionReject",
  //   "actionApprove",
  //   "actionAfterApprove",
  //   "actionAppHis",
  //   "actionAuditLog",
  // ];

  @ViewChild(MatSort) sort!: MatSort;
  pagePrivilege: Array<string>;

  dataSource!: MatTableDataSource<UserHeader>;
  subDataSource!: MatTableDataSource<UserMenus>;
  selectedRow: any = null;
  isUserIdColumnVisible: boolean = false;

    //kendo pagination//
    sizes = [10,20, 50];
    buttonCount = 2
    pageSize =10;
  constructor(
    private dialog: MatDialog,
    private store: Store<{ privileges: { privileges: any } }>,
    private _liveAnnouncer: LiveAnnouncer,
    private ucmService: UserService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.dataSource = new MatTableDataSource(this.users);
    this.getUsers();
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
    //console.log("The usermenus are " + JSON.stringify(this.selectedRow.menus));
    if (this.selectedRow === row) {
      // If the same row is clicked, hide the subtable
      this.selectedRow.showSubtable = false;
      this.selectedRow = null;
    } else {
      // Show the subtable for the clicked row
      this.selectedRow = row;
      this.selectedRow.showSubtable = true;
      //alert(JSON.stringify(row.menus));
      //console.log(JSON.stringify(row.menus));
      this.subDataSource = new MatTableDataSource(this.selectedRow.menus);
    }
  }

  onDelete(ucm: UserHeader) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the User Details",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          this.ucmService.deleteUser(ucm.userId).subscribe({
            next: (res: any) => {
              this.getUsers();
              Swal.fire("Deleted!", "User has been deleted.", "success");
            },
            error: (err) => {
              this.commonService.displayToaster(
                "error",
                "Error",
                "Something went wrong"
              );
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // onDelete(ucm: UserHeader) {
  //   const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
  //     data: {
  //       message:
  //         "Are you sure you want to delete the user " + ucm.employeeName + "?",
  //       dialogTitle: "Confirm Delete",
  //       buttonName: "Delete",
  //       showCancelButton: true,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.ucmService.deleteUser(ucm.userId).subscribe(
  //         (res) => {
  //           this.getUsers();
  //           // this.notificationService.ShowSuccess(res.message, "Logistics");
  //           this.commonService.displayToaster(
  //             "success",
  //             "Success",
  //             "User has been deleted"
  //           );
  //         },
  //         (error) => {
  //           // this.notificationService.ShowError(
  //           //   JSON.stringify(error),
  //           //   "Logistics"
  //           // );
  //           this.commonService.displayToaster(
  //             "error",
  //             "Error",
  //             "Something went wrong!"
  //           );
  //         }
  //       );
  //     }
  //   });
  // }

  addUser() {
    this.router.navigate(["/ums/activity/users/create"]);
  }

  getUsers() {
    this.commonService.getUsers().subscribe((result) => {
      this.users = result;
      console.log("this.users------------------------>",this.users);
      this.dataSource.data = this.users;
    });
  }

  initializeAuthorization(): UserMenusAction {
    return {
      menuActionId: 0,
      userMenusId: 0,
      actionId: 0,
      authorizationId: 0,
    };
  }

  // updateUserMenusAction(userMenus: UserMenus[]): void {
  //   this.commonService.getUserMenuActions().subscribe((data) => {
  //     this.umas = data;

  //     userMenus.forEach((userMenu) => {
  //       const userMenusActions = this.umas.filter(
  //         (uma) => uma.userMenusId === userMenu.userMenusId
  //       );

  //       userMenusActions.forEach((userMenusAction) => {
  //         switch (userMenusAction.actionId) {
  //           case 1:
  //             userMenu.authorizationView = userMenusAction;
  //             break;
  //           case 2:
  //             userMenu.authorizationAdd = userMenusAction;
  //             break;
  //           case 3:
  //             userMenu.authorizationEdit = userMenusAction;
  //             break;
  //           case 4:
  //             userMenu.authorizationDelete = userMenusAction;
  //             break;
  //           case 5:
  //             userMenu.authorizationPrint = userMenusAction;
  //             break;
  //           case 6:
  //             userMenu.authorizationExport = userMenusAction;
  //             break;
  //           case 7:
  //             userMenu.authorizationCancel = userMenusAction;
  //             break;
  //           case 8:
  //             userMenu.authorizationReject = userMenusAction;
  //             break;
  //           case 9:
  //             userMenu.authorizationApp = userMenusAction;
  //             break;
  //           case 10:
  //             userMenu.authorizationAppEdit = userMenusAction;
  //             break;
  //           case 11:
  //             userMenu.authorizationAppHis = userMenusAction;
  //             break;
  //           case 12:
  //             userMenu.authorizationAuditLog = userMenusAction;
  //             break;
  //           default:
  //             break;
  //         }
  //       });
  //     });
  //   });
  // }
}
