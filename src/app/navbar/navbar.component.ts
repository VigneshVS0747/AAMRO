import { Component, HostListener, OnInit, Renderer2, computed, signal } from "@angular/core";
import { Router } from "@angular/router";
import { MenuService } from "./menu.service";
import { MenuItem } from "./menu.model";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { LoginService } from "../services/ums/login.service";
import { MenuAuth } from "src/app/Models/ums/Login.modal";
import { EndPoints, ActionPrivileges } from "../Models/ums/menus.modal";
import { Store } from "@ngrx/store";
import { setPrivileges } from "../store/user_privileges/privileges.actions";
import { setGuardPrivileges } from "../store/guard_privileges/guard_privileges.action";
import * as CryptoJS from "crypto-js";

import { FormControl } from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { setUserId } from "../store/UserIdStore/userId.action";
import { AppState } from "../store/UserIdStore/UserId.reducer";
import { MatDialog } from "@angular/material/dialog";
import { ChangepassworddialogComponent } from "../dialog/changepassworddialog/changepassworddialog.component";
import { environment } from "src/environments/environment.development";
import { MatTooltip } from "@angular/material/tooltip";
import { NofificationconfigurationService } from "../services/ums/nofificationconfiguration.service";
import { notificationpopup } from "../Models/ums/notificationconfiguration.modal";
import { SignalRconnectionService } from "../services/NotificationConnection/signal-rconnection.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { NotificationbellComponent } from "./notificationbell/notificationbell.component";
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

export type MenuItems = {
  icon: string;
  label: string;
  route: string;
}

const TREE_DATA: FoodNode[] = [
  {
    name: "Fruit",
    children: [{ name: "Apple" }, { name: "Banana" }, { name: "Fruit loops" }],
  },
  {
    name: "Vegetables",
    children: [
      {
        name: "Green",
        children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }],
      },
      {
        name: "Orange",
        children: [{ name: "Pumpkins" }, { name: "Carrots" }],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  images: string;
  menuUrl: string;
  moduleName: string;
  level: number;
  createdDate: string;
}

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})

export class NavbarComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  menus: MenuItem[] = [];
  isSearchVisible: boolean = false;
  searchValue: string = '';
  sampleMenu: MenuItem[] = [];
  dropdownOpen: boolean = false;
  toggleMenu: boolean = false;
  openSubmenuIndex: number | null = null;
  isSidebarClosed = false;
  LoggedUser: string | null;
  searchControl = new FormControl();
  //options: string[] = ['Angular', 'React', 'Vue', 'Svelte', 'Ember']; // Example options
  filteredOptions: Observable<MenuItem[]> | undefined;
  sample: any[] = [];
  selectedmenuUrl: any;
  menuname: string;
  collapsed = signal(false);
  sidenavWidth = computed(() => this.collapsed() ? '85px' : '250px')
  menuItem = signal<MenuItems[]>([
    {
      icon: 'attach_money',
      label: 'Dashboard',
      route: 'dashboard'
    }
  ])
  screenWidth: number;
  path = environment.Menuimage;
  notificationpopup: any[] = [];
  userId: any;
  previousnotification: any[] = [];
  previousNotificationCount: number;
  hasPopup: boolean;
  notification: any[]=[];
  constructor(
    private router: Router,
    private menuService: MenuService,
    private dialog: MatDialog,
    private loginService: LoginService,
    private store: Store<{ privileges: { privileges: any } }>,
    private guardStore: Store<{ guardPrivileges: { guardPrivileges: any } }>,
    private storeUserId: Store<{ app: AppState }>,
    private NS: NofificationconfigurationService,
    private signalRService: SignalRconnectionService,
    private _snackBar: MatSnackBar

  ) {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.screenWidth = window.innerWidth;
    this.onResize('');
  }

  ngOnInit() {
    this.LoggedUser = localStorage.getItem("User_id");
    console.log("LoggedUser", this.LoggedUser);
    this.initializeMenu();
    this.initializePrivilege();
    this.GetSearchMenus();
    this.GetUserId();
    this.SignalR();
    this.PushNotification();
    this.GetNotificationPopUp();
  }



  SignalR() {
    this.signalRService.valuesReceived$.subscribe((values: any) => {
      this.notificationpopup = JSON.parse(values);
      debugger;
      this.notificationpopup = this.notificationpopup.filter((item) => item.userId === this.userId);
      this.notification = this.notificationpopup.filter((item) => item.isPopup === 1);
      console.log(" this.notificationpopup", this.notificationpopup);
    });
  }

  PushNotification(){
    this.signalRService.PushReceived$.subscribe((value:any)=>{
      if(value == this.userId){
        this.openSnackBar("New notification received", "🔔");
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000,
    });
  }

  notificationbell() {
      const dialogRef = this.dialog.open(NotificationbellComponent, {
        data: {
          userId: this.userId
        }, disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.clearSingleNotification(result);
        }
      });
  }

  GetNotificationPopUp() {
    this.NS.GetNotificationpopUp().subscribe((data) => {
      this.notificationpopup = data;
      this.notificationpopup = data.filter(item => item.userId === this.userId);
      this.notification = this.notificationpopup.filter((item) => item.isPopup === 1);
    });
  }

  GetUserId() {
    this.userId = localStorage.getItem("Emp_id")!;
    var userId = localStorage.getItem("Emp_id")!;
    this.storeUserId.dispatch(setUserId({ userId }));
  }
  GetSearchMenus() {
    let decryptedData = JSON.parse(
      CryptoJS.AES.decrypt(
        localStorage.getItem("local_data")!,
        environment.secret_key
      ).toString(CryptoJS.enc.Utf8)
    );

    this.menuService.getMenuPrivileges(decryptedData).subscribe((data) => {
      this.sample = data;
    });
  }


  optionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedWarehouse = this.sample.find(
      (menu) => menu.menuName === event.option.viewValue
    );
    if (selectedWarehouse) {
      const selectedWarehouseId = selectedWarehouse.menuUrl;
      this.selectedmenuUrl = selectedWarehouseId;
      this.router.navigate([this.selectedmenuUrl]);
      //this.searchControl.reset('');
    }
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    if (filterValue === '%') {
      return this.sample;
    }
    return this.sample.filter((menu) =>
      menu.menuName.toLowerCase().includes(filterValue)
    );
  }

  initializePrivilege() {
    let decryptedData = JSON.parse(
      CryptoJS.AES.decrypt(
        localStorage.getItem("local_data")!,
        environment.secret_key
      ).toString(CryptoJS.enc.Utf8)
    );
    this.menuService.getMenuPrivileges(decryptedData).subscribe({
      next: (res: MenuAuth[]) => {
        if (res.length > 0) {
          let endPoint: any = EndPoints;
          let otherActions: any = ActionPrivileges;
          let preparedArray = [];
          let privileges: any = {};
          for (let i = 0; i < res.length; i++) {
            let parentPath = res[i].menuUrl;
            // "/" +
            // res[i].moduleName.toLowerCase() +
            // "/" +
            // res[i].menuUrl.toLowerCase();
            privileges[parentPath] = [];
            let pageView = 0;
            for (let [key, value] of Object.entries(res[i])) {
              if (value == true && endPoint[key]) {
                preparedArray.push(parentPath + "/" + endPoint[key]);
              }
              if (value == true && otherActions[key]) {
                privileges[parentPath].push(otherActions[key]);
                pageView++;
              }
            }
            if (pageView > 0) preparedArray.push(parentPath);
          }
          this.store.dispatch(setPrivileges({ value: privileges }));
          this.guardStore.dispatch(
            setGuardPrivileges({ value: preparedArray })
          );
          // console.log("privilages",privileges);
          //  this.router.navigate(["ums"]);
        }
      },
      error: (err) => {
        console.log("login error =>", err);
      },
    });
  }

  initializeMenu() {
    let decryptedData = JSON.parse(
      CryptoJS.AES.decrypt(
        localStorage.getItem("local_data")!,
        environment.secret_key
      ).toString(CryptoJS.enc.Utf8)
    );
    this.menuService.getDynamicMenu(decryptedData).subscribe({
      next: (res) => {
        let finalArray: MenuItem[] = [];
        let groupedObject: any = {};
        let subMenus: any = {};
        for (let i = 0; i < res.length; i++) {
          if (res[i].submenus && res[i].submenus?.length! > 0) {
            if (groupedObject[res[i].moduleName]) {
              let moduleLength =
                groupedObject[res[i].moduleName].submenus.length;
              for (let j = 0; j < moduleLength; j++) {
                if (
                  subMenus[res[i].moduleName].includes(res[i].menuHeaders) &&
                  groupedObject[res[i].moduleName].submenus[j][
                  res[i].menuHeaders
                  ]
                ) {
                  groupedObject[res[i].moduleName].submenus[j].submenus.push(
                    ...res[i].submenus
                  );
                } else if (
                  !subMenus[res[i].moduleName].includes(res[i].menuHeaders)
                ) {
                  let subMenu: any = {
                    menuName: res[i].menuHeaders,
                    menuUrl: res[i].menuHeaders.toLowerCase(),
                    [res[i].menuHeaders]: "identifier",
                    submenus: [...res[i].submenus],
                  };
                  subMenus[res[i].moduleName].push(res[i].menuHeaders); // console.log(subMenu);
                  groupedObject[res[i].moduleName].submenus.push(subMenu);
                }
              }
            } else {
              groupedObject[res[i].moduleName] = {
                menuName: res[i].moduleName,
                menuUrl: res[i].moduleName.toLowerCase(),
                submenus: [
                  {
                    menuName: res[i].menuHeaders,
                    menuUrl: res[i].menuHeaders.toLowerCase(),
                    [res[i].menuHeaders]: "identifier",
                    submenus: [...res[i].submenus],
                  },
                ],
              };
              subMenus[res[i].moduleName] = [res[i].menuHeaders];
            }
          }
        }
        finalArray = Object.values(groupedObject);


        this.dataSource.data = finalArray;
        console.log("data===>", this.dataSource.data);
      },
      error: (err) => console.log(err),
    });

    this.menuService.getMenuData().subscribe((data) => {
      this.sampleMenu = data;
    });
  }

  logout() {
    this.loginService.logout();
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  private _transformer = (node: MenuItem, level: number) => {
    // console.log("particular name",node);

    return {
      expandable: !!node.submenus && node.submenus.length > 0,
      name: node.menuName,
      menuUrl: node.menuUrl,
      images: node.images,
      moduleName: node.moduleName,
      level: level,
      createdDate: node.createdDate,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.submenus,
  );

  openDetails(name: string) {
    console.log("name===>", name);
  }

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  handleMenuToggle() {
    this.toggleMenu = !this.toggleMenu;
    this.treeControl.collapseAll();
    let sidebar = document.querySelector(".sidebar");
    let shrunkMenu = document.querySelector(".shrunken-menu-wrapper");
    let Menu = document.querySelector(".custom-mat-tree");
    sidebar?.classList.toggle("close");
    shrunkMenu?.classList.toggle("show-menu");
    Menu?.classList.toggle("remove-menu");
  }

  openToggleMenu(menu: string) {
    let navigateMenus = ["TOS", "MIS", "WMS"];
    if (navigateMenus.includes(menu)) return;
    this.handleMenuToggle();
    let openMenu = this.treeControl.dataNodes.findIndex(
      (ele) => ele.name === menu
    );
    this.treeControl.expand(this.treeControl.dataNodes[openMenu]);
  }

  ChangePass() {
    const dialogRef = this.dialog.open(ChangepassworddialogComponent, {

    });
  }

  umstoggle(name: any) {
    switch (name) {
      case 'UMS':
        this.menuname = "User Management System";
        break;
      case 'CRM':
        this.menuname = "Customer Relationship Management"
        break;
      case 'QMS':
        this.menuname = "Quotation Management System"
        break;
      default:
        this.menuname = this.menuname;
        break;
    }
  }

  showFirstImage: boolean = true;
  toggleImages() {
    this.showFirstImage = !this.showFirstImage;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 600) {
      this.collapsed.set(!this.collapsed());
      this.toggleImages();
    }
  }

  showTooltip(tooltip: MatTooltip) {
    tooltip.show();
    setTimeout(() => tooltip.hide(), 2000);
  }
  Rediect(Url: string, id: number) {
    this.router.navigate(["/" + Url + "/" + id]);
  }

  clearNotifications() {
    this.notificationpopup = [];
  }

  clearSingleNotification(index: number) {
    this.notificationpopup.splice(index, 1);
    this.notification.splice(index, 1);
  }
}
