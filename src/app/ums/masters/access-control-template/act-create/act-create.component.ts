import { Component } from "@angular/core";
import { MenuItem } from "src/app/navbar/menu.model";
import { MenuService } from "src/app/navbar/menu.service";
import { MatTableDataSource } from "@angular/material/table";
import {
  AccessControlTemplate,
  AccessControlTemplateMenus,
} from "../act.model";
import { ActService } from "../act.service";
import { NotificationService } from "src/app/services/notification.service";
import { FormBuilder, FormControl, FormGroup, NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: "app-act-create",
  templateUrl: "./act-create.component.html",
  styleUrls: ["./act-create.component.css", "../../../ums.styles.css"],
})
export class ActCreateComponent {

  checkbox: boolean = false;
  selectAllOption = false;
  showpopup!: boolean;
  selectAll: any;
  deletedsubmenu: any[] = [];
  uniquesubmenu: any[] = [];
  selectedmenu:any[]=[];
  livestatus:any;
  selectedCheckbox: boolean;
  selectAllOptions(event: any): void {
    this.showbutton = false;
    var data = (this.selectAll = event.checked);
    if (event.checked) {
      this.selectedItems = this.submenu.map((option) => option.menuId);
      //this.select.push(...this.selectedItems);
      this.selectedItems.forEach((item) => {
        this.select.push(item);
      });
    } else {
      this.selectedItems = [];
    }
  }
  selectedItems: any[] = [];
  selected: number[] = [];
  unchange: any[] = [];
  select: string[] = [];
  notunique: number[] = [];
  unique: string[] = [];
  errorMessage!: string;
  selectedMenuHeaders = new FormControl([]);
  selectedsubMenuHeaders = new FormControl([]);
  selectedModuleId: number = 0;
  selectedModule!: number | null;
  actStatus: boolean = true;
  showtable!: boolean;
  showbutton!: boolean;
  title: string = "New Access Control Template";
  displayedColumns: string[] = [
    "sno",
    "menuName",
    "eview",
    "eadd",
    "eedit",
    "edelete",
    "eprint",
    "eexport",
    "ecancel",
    "eapprove",
    "eafterApprove",
    "eappHis",
    "eauditLog",
  ];

  menus!: MenuItem[];
  modules!: MenuItem[];
  menuHeaders: MenuItem[] | null = null;

  flatMenus: AccessControlTemplateMenus[] = [];
  dataSource!: MatTableDataSource<AccessControlTemplateMenus>; // Define the type for MatTableDataSource
  editedAct: AccessControlTemplate | null = null;
  currentPath: string = "";
  isCreatedFlag: boolean = true; // Whether it is in Add or Edit
  private accessControlId: number = 0;
  selectedHeader: number[] = [];
  populatemenu: any[] = [];
  populatestoredmenu: any[] = [];
  submenu: any[] = [];
  disablefields: boolean = false;
  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private menuService: MenuService,
    private actService: ActService,
    private notificationService: NotificationService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
     this.livestatus = true;
    // Initialize the MatTabl;eDataSource here
    this.dataSource = new MatTableDataSource<AccessControlTemplateMenus>([]);
    this.currentPath = this.router.url;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      /* Edit */
      if (
        this.currentPath ==
        "/ums/activity/acts/edit/" + paramMap.get("accessControlId")
      ) {
        this.disablefields = false;
        this.showtable = true;

        this.title = "Update Access Control Template";

        this.accessControlId = Number(paramMap.get("accessControlId"));

        this.isCreatedFlag = false;
        this.actService.getAct(this.accessControlId).subscribe((actData) => {
          this.editedAct = actData;
          this.livestatus = this.editedAct?.livestatus
          console.log(
            "editaccesssssssssssssssssssssssssssssssssss====>",
            actData
          );
          this.selectedmenu.push(this.editedAct?.menus?.map(
            (menu) => menu.menuId
          ));
          this.selectedmenu.forEach((item) => {
            this.unchange.push(...item);
          });
          console.log(
            "this.unchange",
            this.unchange
          );


          this.populatestoredmenu = this.editedAct?.menus ?? [];

          //this.dataSource = new MatTableDataSource<AccessControlTemplateMenus>(this.flatMenus); // Set the data source

          this.menuService.getMenuData().subscribe((data) => {
            this.menus = data;
            if (this.menus.length > 0) {
              this.modules = this.menus.filter((item) => item.parentId === 0);
            } else {
              console.log("No menu itmes found!");
            }
          });
        });
      } else {
        /* Add */
        this.disablefields = false;
        this.actStatus = true;
        this.isCreatedFlag = true;
        this.accessControlId = 0;
        this.menuService.getMenuData().subscribe((data) => {
          this.menus = data;
          this.modules = this.menus.filter((item) => item.parentId === 0);
        });
      }
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      /* View */
      if (
        this.currentPath ==
        "/ums/activity/acts/view/" + paramMap.get("accessControlId")
      ) {
        this.showtable = true;
        this.disablefields = true;

        this.title = "View Access Control Template";

        this.accessControlId = Number(paramMap.get("accessControlId"));

        this.isCreatedFlag = false;
        this.actService.getAct(this.accessControlId).subscribe((actData) => {
          this.editedAct = actData;
          this.livestatus = this.editedAct?.livestatus
          console.log("edit=============>", actData);

          this.populatestoredmenu = this.editedAct?.menus ?? [];

          //this.dataSource = new MatTableDataSource<AccessControlTemplateMenus>(this.flatMenus); // Set the data source

          this.menuService.getMenuData().subscribe((data) => {
            this.menus = data;
            if (this.menus.length > 0) {
              this.modules = this.menus.filter((item) => item.parentId === 0);
            } else {
              console.log("No menu itmes found!");
            }
          });
        });
      }
    });
  }

  findTopLevelParentMenu(
    menuId: number,
    data: MenuItem[],
    topLevelParent?: MenuItem
  ): MenuItem | null {
    for (const item of data) {
      if (item.menuId === menuId) {
        // Found the menu, return the top-level parent if available
        return topLevelParent || item;
      }
      if (item.submenus) {
        const parentMenu = this.findTopLevelParentMenu(
          menuId,
          item.submenus,
          topLevelParent || item
        );
        if (parentMenu) {
          // Found the menu in a submenu, return it
          return parentMenu;
        }
      }
    }
    // Menu not found
    return null;
  }

  // Usage example to find the parent menu for a specific submenu (e.g., menuId = 13)

  // Function to flatten the hierarchical menu data
  flattenMenuData(menuItems: MenuItem[]): AccessControlTemplateMenus[] {
    const result: AccessControlTemplateMenus[] = [];

    function flatten(menu: MenuItem) {
      if (
        (!menu.submenus || menu.submenus.length === 0) &&
        menu.parentId !== 0
      ) {
        // This menu has no submenus, so add it to the result
        result.push({
          accessMenusId: 0,
          accessControlId: 0,
          menuId: menu.menuId,
          menuName: menu.menuName,
          eview: false,
          eadd: false,
          eedit: false,
          edelete: false,
          eprint: false,
          eexport: false,
          ecancel: false,
          ereject: false,
          eapprove: false,
          eafterApprove: false,
          eappHis: false,
          eauditLog: false,
          selectall:false
        });
      } else {
        // Recursively process submenus
        for (const submenu of menu.submenus || []) {
          flatten(submenu);
        }
      }
    }

    for (const menu of menuItems) {
      flatten(menu);
    }

    return result;
  }

  valueChange($event: any) {
    //set the two-way binding here
    this.actStatus = $event.checked;
  }

  displayMenus() {
    this.showbutton = false;
    console.log("this.selectAll", this.selectAll);

    if (this.selectAll === true) {
      console.log("this.selectAll==>", this.selectAll);

      if (this.select.length > 0) {
        if (this.unchange.length > 0) {
          var data = (this.unique = this.select.filter(
            (value: any) => !this.unchange.includes(value)
          ));
          console.log("uniquedta===>", data);
          const value = this.selectedMenuHeaders.value;
          const value2 = this.unique;
          const auth = {
            headerid: value,
            submenuid: value2,
          };
          this.actService.Getmenuheaderbyid(auth).subscribe((result) => {
            this.populatemenu = result;
            this.populatestoredmenu.push(...this.populatemenu);
            console.log("result===>", this.populatestoredmenu);
            this.populatestoredmenu.forEach((item) => {
             
              this.unchange.push(item.menuId);
            });
          });

          this.showtable = true;
          //this.showbutton = true;
          this.selectedMenuHeaders.setValue([]);
          this.showpopup = false;
          this.select=[];
          this.unchange=[];
          this.selectedModule = null;
          this.selectedItems = [];
          this.menuHeaders=[];
          this.submenu=[];
        } else {
          const value = this.selectedMenuHeaders.value;
          const value2 = this.select;
          const auth = {
            headerid: value,
            submenuid: value2,
          };
          this.actService.Getmenuheaderbyid(auth).subscribe((result) => {
            this.populatemenu = result;
            this.populatestoredmenu.push(...this.populatemenu);
            console.log("result===>", this.populatestoredmenu);
            this.populatestoredmenu.forEach((item) => {
              
              this.unchange.push(item.menuId);
            });
          });

          this.showtable = true;
          //this.showbutton = true;
          this.selectedMenuHeaders.setValue([]);
          this.showpopup = false;
          this.select=[];
          this.unchange=[];
          this.selectedModule = null;
          this.selectedItems = [];
          this.menuHeaders=[];
          this.submenu=[];
        }
      }
    } else {
      console.log(" this.notunique==>", this.notunique);

      if (
        this.notunique.length === this.unchange.length &&
        this.notunique.every((value, index) => value === this.unchange[index])
      ) {
        // Arrays have the same values, do not allow
        //alert("already exist!....");
      } else {
        const value = this.selectedMenuHeaders.value;
        const value2 = this.notunique;
        const auth = {
          headerid: value,
          submenuid: value2,
        };
        this.actService.Getmenuheaderbyid(auth).subscribe((result) => {
          this.populatemenu = result;
          this.populatestoredmenu.push(...this.populatemenu);
          this.populatestoredmenu.forEach((item) => {
            this.unchange.push(item.menuId);
            console.log("this.unchange===>", this.unchange);
          });
        });

        this.showtable = true;
        //this.showbutton = true;
        this.selectedMenuHeaders.setValue([]);
        this.showpopup = false;
        this.select=[];
        this.unchange=[];
        this.selectedModule = null;
        this.selectedItems = [];
        this.menuHeaders=[];
          this.submenu=[];
      }
    }
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
      if (this.deletedsubmenu.length > 0) {
        this.submenu = result;
        //let resultArray1 = this.submenu.filter(item => !this.deletedsubmenu.includes(item));
        //this.submenu=[...this.uniquesubmenu];
        console.log("this.submenu==>", this.submenu);
      } else {
        this.submenu = result;
        console.log("this.submenu==>", this.submenu);
      }
    });
    this.selectAll = false;
  }

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

  getSelectedMenuHeaders() {
    const selectedMenuHeaderNames: string[] =
      (this.selectedMenuHeaders.value as string[]) || [];

    const selectedMenuHeaderDetails: MenuItem[] = [];
    if (this.menuHeaders !== null) {
      for (const mh of this.menuHeaders) {
        if (selectedMenuHeaderNames.includes(mh.menuName)) {
          selectedMenuHeaderDetails.push(mh);
        }
      }
      return selectedMenuHeaderDetails;
    } else return "";
  }

  onCheckboxChange(
    menuItem: AccessControlTemplateMenus,
    actionName: any,event: any
  ): void {
    // Update the dataSource
    (menuItem as any)[actionName] = !(menuItem as any)[actionName];
  if (!this.checkActions(menuItem)) {
      menuItem.selectall = false;
  }else{
      menuItem.selectall = true;
    }

  }
  checkActions(menuItem: any): boolean {
    if(menuItem.eview == true && menuItem.eadd == true && 
      menuItem.eedit == true && menuItem.edelete == true && 
      menuItem.eprint ==true && menuItem.ecancel==true && 
      menuItem.eexport==true && menuItem.eafterApprove == true&&
      menuItem.eappHis == true && menuItem.eauditLog== true){
        return true; // All actions are true
      }else{
        return false; // At least one action is false
      }
}
  onSaveAct(form: NgForm) {
    if (form.valid && this.populatestoredmenu.length > 0){
      const formData = form.value;
      const act: AccessControlTemplate = {
        accessControlId: 0, // 0 for Add >0 for update
        accessControlCode: formData.actCode,
        accessControlName: formData.actName,
        livestatus: this.actStatus,
        createdBy: 1,
        createdDate: new Date(),
        updatedBy: 0,
        updatedDate: new Date(),
        menus: this.populatestoredmenu,
      };
      console.log("act===>", act);
  
      if (this.isCreatedFlag) {
        /* Add */
        this.actService.addAct(act).subscribe(
          (res) => {
            form.resetForm();
            this.populatemenu = [];
            this.showtable = false;
            this.initializeControls();
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Added Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.router.navigate(["/ums/activity/acts"]);
          },
          (error) => {
            if(error.error.message == 'DUPLICATE'){
              this.commonService.displayToaster(
                "error",
                "Error",
                "Access control Already exist!!"
              );
            }
          }
        );
      } else {
        /* Update */
        act.accessControlId = this.accessControlId;
        this.actService.updateAct(act).subscribe(
          (res) => {
            form.resetForm();
            this.initializeControls();
            this.resetNavigation();
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Updated Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.router.navigate(["/ums/activity/acts"]);
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
    }else{
      this.commonService.displayToaster(
        "error",
        "Error",
        "Please enter mandatory fields"
      );
    }
    
  }

  resetNavigation() {
    if (this.currentPath.includes("/ums/act")) {
      this.router.navigate(["/ums/acts"]);
    }
  }

  resetButtonClick(form: NgForm) {
    if(this.accessControlId!=0){
      this.getlist();
      //window.location.reload();
       
    }else{
      form.resetForm();
      this.populatestoredmenu = [];
      this.showtable = false;
      this.submenu = [];
      this.menuHeaders = [];
      //(this.modules = []), this.initializeControls();
      //window.location.reload();
    }
    
  }

  initializeControls() {
    this.actStatus = true;
    this.flatMenus = [];
    this.dataSource = new MatTableDataSource<AccessControlTemplateMenus>(
      this.flatMenus
    );
    this.isCreatedFlag = true;
  }

  returnToList() {
    this.router.navigate(["/ums/activity/acts"]);
  }

  onchangesubmenu(data: number) {}

  deleteItem(item: any, AccessmenuId: number) {
    if (AccessmenuId != null) {
      Swal.fire({
        title: "Are you sure?",
        text: "Delete the AccessMenus!..",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.actService.DeleteAccessMenus(AccessmenuId).subscribe((res) => {
            Swal.fire("Deleted!", "Menus has been deleted.", "success");
          });
        } else {
          this.actService.getAct(this.accessControlId).subscribe((actData) => {
            this.editedAct = actData;
            console.log("edit====>", actData);

            this.populatestoredmenu = this.editedAct?.menus ?? [];
          });
        }
      });
      const index = this.populatestoredmenu.findIndex(
        (data) => data.menuName === item.menuName
      );
      if (index !== -1) {
        this.populatestoredmenu.splice(index, 1);
      }
      if (this.populatestoredmenu.length == 0) {
        this.showtable = false;
      }
      const index1 = this.submenu.findIndex(
        (data) => data.menuId === item.menuId
      );
      if (index1 !== -1) {
        this.submenu.splice(index1, 1);
        this.deletedsubmenu.push(item);
      }
    } else {
      const index = this.populatestoredmenu.findIndex(
        (data) => data.menuName === item.menuName
      );
      if (index !== -1) {
        this.populatestoredmenu.splice(index, 1);
      }
      if (index !== -1) {
        this.unchange.splice(index, 1);
       
      }
      if (this.populatestoredmenu.length == 0) {
        this.showtable = false;
      }
      const index1 = this.submenu.findIndex(
        (data) => data.menuId === item.menuId
      );
      if (index1 !== -1) {
        this.submenu.splice(index1, 1);
        this.deletedsubmenu.push(item);
      }
     
    }
  }
  onSelectionChange(event: any) {
    this.showbutton = false;
    this.notunique = event.value.filter(
      (value: any) => !this.unchange.includes(value)
    );
  }
  show() {
    this.showpopup = true;
  }
  getlist(){
    this.actService.getAct(this.accessControlId).subscribe((actData) => {
      this.editedAct = actData;
      console.log(
        "editaccesssssssssssssssssssssssssssssssssss====>",
        actData
      );
      this.selectedmenu.push(this.editedAct?.menus?.map(
        (menu) => menu.menuId
      ));
      this.selectedmenu.forEach((item) => {
        this.unchange.push(...item);
      });
      console.log(
        "this.unchange",
        this.unchange
      );


      this.populatestoredmenu = this.editedAct?.menus ?? [];
  });
}
onCheckboxChangeSelectALL(
  menuItem: AccessControlTemplateMenus,
  actionName: any
): void {
  // Update the dataSource
  (menuItem as any)[actionName] = !(menuItem as any)[actionName];

  if (menuItem.selectall == true) {
    menuItem.selectall = true;
    menuItem.eview = true;
    menuItem.eadd = true;
    menuItem.eedit = true;
    menuItem.edelete = true;
    menuItem.eprint = true;
    menuItem.eexport = true;
    menuItem.ecancel = true;
    menuItem.eafterApprove = true;
    menuItem.eappHis = true;
    menuItem.eauditLog = true;
}else{
  menuItem.selectall = false;
  menuItem.eview = false;
  menuItem.eadd = false;
  menuItem.eedit = false;
  menuItem.edelete = false;
  menuItem.eprint = false;
  menuItem.eexport = false;
  menuItem.ecancel = false;
  menuItem.eafterApprove = false;
  menuItem.eappHis = false;
  menuItem.eauditLog = false;
  }
}
selectAllCheckBoxes(row: any,actionName: any, event: any) { 
  if(event.checked==true){
    const action = [
      { actionName: 'selectall' },
      { actionName: 'eview' },
      { actionName: 'eadd' },
      { actionName: 'eedit' },
      { actionName: 'edelete' },
      { actionName: 'eprint' },
      { actionName: 'eexport' },
      { actionName: 'ecancel' },
      { actionName: 'eafterApprove' },
      { actionName: 'eappHis' },
      { actionName: 'eauditLog' }
    ];
  
    for (const item of action) {
      this.onCheckboxChangeSelectALL(row, item.actionName);
    }
  }else{
    const action = [
      { actionName: 'selectall' },
      { actionName: 'eview' },
      { actionName: 'eadd' },
      { actionName: 'eedit' },
      { actionName: 'edelete' },
      { actionName: 'eprint' },
      { actionName: 'eexport' },
      { actionName: 'ecancel' },
      { actionName: 'eafterApprove' },
      { actionName: 'eappHis' },
      { actionName: 'eauditLog' }
    ];
  
    for (const item of action) {
      this.onCheckboxChangeSelectALL(row, item.actionName);
    }
  }
   
}
}



