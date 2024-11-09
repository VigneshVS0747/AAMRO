import { Component } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AuthorizationMatrix,
  UserHeader,
  UserMenus,
  UserMenuObject,
  UserPayload,
  ActionStatus,
  ChangedActionInfo,
} from "../user.model";
import { CommonService } from "src/app/services/common.service";
import { UserService } from "../user.service";
import { MatDialog } from "@angular/material/dialog";
import { AuthorizationMatrixDialogComponent } from "src/app/dialog/authorization-matrix/authorization-matrix-dialog.component";
import {
  AccessControlTemplate,
  AccessControlTemplateMenus,
} from "src/app/ums/masters/access-control-template/act.model";
import { Employee } from "src/app/ums/masters/employee/employee.model";
import { AccessControlDialogComponent } from "src/app/dialog/access-control-dialog/access-control-dialog.component";
import { MenuItem } from "src/app/navbar/menu.model";
import { MenuService } from "src/app/navbar/menu.service";
import { ActService } from "src/app/ums/masters/access-control-template/act.service";
@Component({
  selector: "app-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.css", "../../../ums.styles.css"],
})
export class UserCreateComponent {
  errorMessage!: string;
  selectedEmployeeId!: number;
  selectedAccessControl: AccessControlTemplate;
  selectedAuthorizationId!: number;
  employees: Employee[] = [];
  acts: AccessControlTemplate[] = [];
  actm: AccessControlTemplateMenus[] = [];
  userMenus: UserMenus[] = [];
  ams: AuthorizationMatrix[] = [];
  userStatus: boolean = true;
  employeeCode: string = "";
  hide: boolean = false;
  employeePassword: string = "";
  title: string = "New User";
  displayedColumns: string[] = [
    "sno",
    "menuName",
    "actionView",
    "actionAdd",
    "actionEdit",
    "actionDelete",
    "actionPrint",
    "actionExport",
    "actionCancel",
    "actionApp",
    "actionAppEdit",
    "actionAppHis",
    "actionAuditLog",
    "delete",
  ];
  dataSource!: MatTableDataSource<Partial<UserMenuObject>>; // Define the type for MatTableDataSource
  editedUser: UserHeader | null = null;
  isCreatedFlag: boolean = true; // Whether it is in Add or Edit
  isReadOnly: boolean = false; // Whether it is in Add or Edit
  userId: number = 0;
  modifiedAuthorizationId: number = 0;
  actionId: number = 0;
  Livestatus = 1;

  //Act apply//
  selectedModule!: number | null;
  selectedMenuHeaders = new FormControl([]);
  selectedItems: any[] = [];
  menus!: MenuItem[];
  modules!: MenuItem[];
  menuHeaders: MenuItem[] | null = null;
  submenu: any[] = [];
  selectAll: any;
  select: string[] = [];
  showpopup: boolean;
  showbutton: boolean;
  unchange: any[] = [];
  unique: string[] = [];
  populatemenu: any[] = [];
  populatestoredmenu: any[] = [];
  showtable: boolean;
  SelectedSubmenuId: number[]=[];
  disableFields:boolean = true;
  passwordStrength: string;
  passwordIsValid: any;
  Mfa: boolean = false;
  locked: boolean = false;

  constructor(
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private ucmService: UserService,
    private commonService: CommonService,
    private actService: ActService,
    private router: Router,
    private menuService: MenuService,
  ) {}

  ngOnInit() {
    this.initializePage();
    this.GetMenu();
  }

  initializePage() {
    this.dataSource = new MatTableDataSource<Partial<UserMenuObject>>([]);
    this.commonService.getEmployees(this.Livestatus).subscribe((data) => {
      this.employees = data;
    });
    let isReadOnly = JSON.parse(
      this.route.snapshot.paramMap.get("readOnly") || "false"
    );
    if (isReadOnly) {
      this.title = "View User";
      this.isCreatedFlag = false;
      this.isReadOnly = true;
      this.updateUserAuthorization();
    } else {
      let isEdit = Number(this.route.snapshot.paramMap.get("userId"));
      if (isEdit) {
        this.title = "Update User";
        this.isCreatedFlag = false;
        this.disableFields = false;
        this.updateUserAuthorization();
      } else {
        this.userStatus = true;
        this.isCreatedFlag = true;
      }
    }

    this.commonService
    .getAuthorizationMatrix(this.Livestatus)
    .subscribe((data) => {
      this.ams = data;
    });
  }

  updateUserAuthorization() {
    this.userId = Number(this.route.snapshot.paramMap.get("userId"));
    this.ucmService.getUser(this.userId).subscribe((userData) => {

      console.log("userData",userData);
      this.selectedEmployeeId = userData?.employeeId;
      this.selectedAuthorizationId = userData.authorizationId;
      let changedMenus = userData?.changedActionInfo;
      let actionStatus = userData?.actionStatus;
      this.employeeCode = userData?.employeeCode;
      this.employeePassword = userData?.employeePassword;
      this.Mfa = userData?.mfa;
      this.locked = userData?.locked;
      let changedMenuIds = [...new Set(changedMenus.map((ele) => ele.menuId))];
      actionStatus.forEach((ele: any) => {
        if (changedMenuIds.includes(ele.menuId)) {
          let selectedMenu = changedMenus.filter(
            (menu) => ele.menuId == menu.menuId
          );
          selectedMenu.forEach((selectedMenuItem) => {
            let changes = {
              actionId: selectedMenuItem.actionId,
              authorizationId: selectedMenuItem.authorizationId,
              menuActionId: selectedMenuItem.menuActionId,
              menuId: selectedMenuItem.menuId,
            };
            let actionName =
              selectedMenuItem.actionName.charAt(0).toLowerCase() +
              selectedMenuItem.actionName.slice(1);
            ele[actionName] = changes;
          });
        }
      });
      this.dataSource = new MatTableDataSource<Partial<UserMenuObject>>(
        actionStatus
      );
    });
  }

  valueChange($event: any) {
    this.userStatus = $event.checked;
  }
  valueChangeMfa(event: any) {
    this.Mfa = event.checked;
  }

  valueChangelocked(event: any) {
    this.locked = event.checked;
  }

  onIconClicked(menu: any, fieldName: string) {
    let selectedMenu = menu[fieldName as keyof UserMenuObject];
    let payload = {
      isReadOnly: this.isReadOnly,
      selectedAuthorizationId: 0,
    };
    if (typeof selectedMenu == "boolean")
      payload.selectedAuthorizationId = this.selectedAuthorizationId;
    if (typeof selectedMenu == "object")
      payload.selectedAuthorizationId = selectedMenu.authorizationId;
    const dialogRef = this.dialog.open(AuthorizationMatrixDialogComponent, {
      data: payload,
      width: "auto", // Set the width to "auto"
      autoFocus: true, // Enable autofocus
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result || this.isReadOnly) return;
      if (result == this.selectedAuthorizationId) {
        menu[fieldName] = true;
      } else {
        this.modifiedAuthorizationId = result;
        this.ucmService.getActionId(0, fieldName).subscribe({
          next: (res) => {
            menu[fieldName] = {
              authorizationId: result,
              actionId: res.id,
            };
          },
          error: (err) => {
            console.log("actionID==========>", err);
          },
        });
      }
    });
  }

  onCheckboxChange(menuItem: UserMenuObject, actionName: keyof UserMenuObject) {
    if (this.isReadOnly) return;
    (menuItem as any)[actionName] = !(menuItem as any)[actionName];
    if (actionName != "eview" && actionName != "eadd") {
      menuItem.eview = true;
    }
  }

  openAccessDialogue() {
    let passedValues = {
      ...(this.selectedAccessControl && {
        accessControlId: this.selectedAccessControl.accessControlId,
      }),
      ...(this.selectedAuthorizationId && {
        selectedAuthorizationId: this.selectedAuthorizationId,
      }),
    };
    const dialogRef = this.dialog.open(AccessControlDialogComponent, {
      ...(this.selectedAuthorizationId && { data: passedValues }),
      width: "40%",
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.time("Add menus");
      console.log("result===>", result);
      if (!result) return;
      this.selectedAccessControl = result.selectedAccessControl;
      this.disableFields = false;
      //this.selectedAuthorizationId = result.selectedAuthorizationId;
      console.timeEnd("Add menus");
      this.displayMenus();
    });
  }

  displayMenus() {
    console.time("Validation time");
    type PartialUserMenuObject = Partial<UserMenuObject>;
    let menuItems: any = this.selectedAccessControl.menus;
    let validatedMenus: any = [];
    if (this.dataSource.data.length > 0) {
      let exist = this.dataSource.data.map((ele: any) => ele.menuId);
      console.log("exist menuItems==>", exist);
      validatedMenus.push(...this.dataSource.data);
      for (let i = 0; i < menuItems.length; i++) {
        if (!exist.includes(menuItems[i].menuId))
          validatedMenus.push(menuItems[i]);
      }
      menuItems = validatedMenus;
    }
    this.dataSource = new MatTableDataSource<PartialUserMenuObject>(menuItems);
    console.timeEnd("Validation time");
    console.log("this.dataSource ====>", this.dataSource);
  }

  onSaveUser(form: NgForm) {
    if (form.invalid) return;
    if (this.dataSource.data.length == 0) {
      document.querySelector(".info-div")?.classList.toggle("danger");
    }
    if (this.dataSource.data.length == 0) return;
    let actionStatus: ActionStatus[] = [];
    let changedActionInfo: ChangedActionInfo[] = [];
    type PartialPerson = Partial<UserPayload>;

    let payload: PartialPerson = {
      actionStatus: actionStatus,
      changedActionInfo: changedActionInfo,
    };
    this.dataSource.data.forEach((ele) => {
      let actionObject: any = {};
      let changedObject: any = {};
      Object.entries(ele).forEach(([key, value]) => {
        if (typeof value == "object") {
          changedObject = value;
          actionObject[key] = true;
          changedObject["menuId"] = ele.menuId;
          changedObject["menuName"] = ele.menuName;
          if (ele.userId) changedObject["userId"] = ele.userId;
          payload!.changedActionInfo!.push(changedObject);
        } else if (typeof value == "boolean") {
          actionObject[key] = value;
        }
      });
      if (ele.userMenusId) actionObject["userMenusId"] = ele.menuId;
      if (ele.userId) actionObject["userId"] = ele.userId;
      actionObject["menuId"] = ele.menuId;
      actionObject["menuName"] = ele.menuName;
      payload!.actionStatus!.push(actionObject);
    });
    const formData = form.value;
    payload.authorizationId = this.selectedAuthorizationId;
    payload.employeeId = formData.selectedEmployeeId;
    payload.employeeName = formData.selectedEmployeeName;
    payload.employeeCode = formData.employeeCode;
    payload.employeePassword = formData.employeePassword;
    payload!.createdby = 1;
    payload!.updatedby = 0;
    payload.livestatus = this.userStatus;
    payload.mfa = this.Mfa;
    payload.locked = this.locked
    if (this.isCreatedFlag) {
      /* Add */
      this.ucmService.add(payload).subscribe({
        next: (res) => {
          form.resetForm();
          this.router.navigate(["/ums/activity/users"]);
          this.commonService.displayToaster(
            "success",
            "Success",
            "Added successfully"
          );
        },
        error: (error) => {
          console.log("error==>", error);
          if (error.error.message == "DUPLICATE")
            this.commonService.displayToaster(
              "error",
              "Error",
              "The Employee has Already mapped!!!"
            );
        },
      });
    } else {
      /* Update */
      payload.userId = this.userId;
      console.log("Update", payload);
      this.ucmService.updateUser(payload).subscribe({
        next: (res) => {
          this.commonService.displayToaster(
            "success",
            "Success",
            "Updated successfully"
          );
          form.resetForm();
          this.router.navigate(["/ums/activity/users"]);
        },
        error: (error) => {
          console.log("error==>", error);

          if (error.error.message == "DUPLICATE")
            this.commonService.displayToaster(
              "error",
              "Error",
              "The Employee has Already mapped!!!"
            );
        },
      });
    }
  }

  resetButtonClick(form: NgForm) {
    let isEdit = Number(this.route.snapshot.paramMap.get("userId"));
    if (isEdit) {
      this.title = "Update User";
      this.isCreatedFlag = false;
      this.disableFields = false;
      this.updateUserAuthorization();
    }else{
      form.resetForm();
      this.initializeControls();
      this.dataSource = new MatTableDataSource<Partial<UserMenuObject>>([]);
    } 
  }

  initializeControls() {
    this.userStatus = true;
    this.isCreatedFlag = true;
    this.dataSource = new MatTableDataSource<Partial<UserMenuObject>>([]);
  }

  returnToList() {
    this.router.navigate(["/ums/activity/users"]);
  }

  onDeleteUserMenu(index: number) {
    this.dataSource.data.splice(index, 1);
    this.dataSource = new MatTableDataSource<Partial<UserMenuObject>>(
      this.dataSource.data
    );
  }

  //////////////////////////////////////////////////////


  updateModule() {
    const matchingMenus = this.menus.filter(
      (menu) => menu.menuId === this.selectedModule
    );
    if (
      matchingMenus.length > 0 &&
      matchingMenus[0].submenus &&
      matchingMenus[0].submenus.length > 0
    ) {
      const submenus = matchingMenus[0].submenus.map(
        (submenu) => submenu as MenuItem
      );
      this.menuHeaders = submenus;
    } else {
      // Handle the case where there are no submenus or no matching menus
      // set this.menuHeaders to null or take other actions.
      this.menuHeaders = null;
    }
  }

  GetMenu(){
    this.menuService.getMenuData().subscribe((data) => {
      this.menus = data;
      this.modules = this.menus.filter((item) => item.parentId === 0);
    });
  }

  onchangeheader() {
    const value = this.selectedMenuHeaders.value;
    //const value2 = this.selectedsubMenuHeaders.value;
    console.log(value);
    const auth = {
      headerid: value,
      submenuid: [0],
    };
    this.actService.Getsubmenubyid(auth).subscribe((result) => {
      
        this.submenu = result;
        //let resultArray1 = this.submenu.filter(item => !this.deletedsubmenu.includes(item));
        //this.submenu=[...this.uniquesubmenu];
        console.log("this.submenu==>", this.submenu);
     
    });
    this.selectAll = false;
  }
  onSelectionChange(event: any) {
    this.SelectedSubmenuId = event.value;
  }
  
  show() {
    this.showpopup = true;
  }


  displayMenusact() {
    if(this.userId == 0){
      type PartialUserMenuObject = Partial<UserMenuObject>;
      let menuItems: any = this.selectedAccessControl.menus;
      let validatedMenus: any = [];
      const value = this.selectedMenuHeaders.value;
      const value2 = this.SelectedSubmenuId;
      const auth = {
        headerid: value,
         submenuid: value2,
       };
  
      this.actService.Getmenuheaderbyid(auth).subscribe((result) => {
        this.populatemenu = result;
        this.populatemenu.forEach((item) => {
          // Create a copy of the current item with parentId and menuUrl removed
          let itemCopy = {...item};
          delete itemCopy.parentId;
          delete itemCopy.menuUrl;
      
          // Check if the menuId of the current item is not included in menuItems
          if (!menuItems.some((menuItem: { menuId: any; }) => menuItem.menuId === item.menuId)) {
              // If it's not included, push the modified item to the notIncludedMenuItems array
              menuItems.push(itemCopy);
          }
      });
        
        this.dataSource = new MatTableDataSource<PartialUserMenuObject>(menuItems);
        this.selectedMenuHeaders.setValue([]);
        this.selectedItems=[];
        this.selectedModule = null;
        this.menuHeaders=[];
        this.submenu=[];
      });
    }
    else{
      type PartialUserMenuObject = Partial<UserMenuObject>;
      let exist = this.dataSource.data;
    const value = this.selectedMenuHeaders.value;
    const value2 = this.SelectedSubmenuId;
    const auth = {
      headerid: value,
       submenuid: value2,
     };

    this.actService.Getmenuheaderbyid(auth).subscribe((result) => {
      this.populatemenu = result;
      this.populatemenu.forEach((item) => {
        // Create a copy of the current item with parentId and menuUrl removed
        let itemCopy = {...item};
        delete itemCopy.parentId;
        delete itemCopy.menuUrl;
    
        // Check if the menuId of the current item is not included in menuItems
        if (!exist.some((menuItem => menuItem.menuId === item.menuId))) {
            // If it's not included, push the modified item to the notIncludedMenuItems array
            exist.push(itemCopy);
        }else{
          this.commonService.displayToaster(
            "info",
            "Info",
            "The menu is already exist!.."
          );
        }
    });
      
      this.dataSource = new MatTableDataSource<PartialUserMenuObject>(exist);
      this.selectedMenuHeaders.setValue([]);
      this.selectedItems=[];
      this.selectedModule = null;
      this.menuHeaders=[];
      this.submenu=[];
    });
    }
  }

  passwordValid(event: any) {
    this.passwordIsValid = event;
  }

  validatePassword(event:any) {
    if (event.invalid) {
      event.control.markAsTouched();
    }
  }
}
