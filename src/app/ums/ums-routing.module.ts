import { NgModule } from "@angular/core";
// import { RouterModule, Routes } from "@angular/router";
import { DesignationListComponent } from "./masters/designation/designation-list/designation-list.component";
import { DepartmentListComponent } from "./masters/department/department-list/department-list.component";
import { CountryListComponent } from "./masters/countries/country-list/country-list.component";
import { StateListComponent } from "./masters/states/state-list/state-list.component";
import { CurrencyListComponent } from "./masters/currencies/currency-list/currency-list.component";
import { CurrencyCreateComponent } from "./masters/currencies/currency-create/currency-create.component";
import { CityListComponent } from "./masters/cities/city-list/city-list.component";
import { LoginComponent } from "./admin/user/login/login.component";
import { DashboardlayoutComponent } from "../dashboardlayout/dashboardlayout.component";
import { BranchListComponent } from "./masters/branch/branch-list/branch-list.component";
import { BranchCreateComponent } from "./masters/branch/branch-create/branch-create.component";
import { EmployeeListComponent } from "./masters/employee/employee-list/employee-list.component";
import { EmployeeCreateComponent } from "./masters/employee/employee-create/employee-create.component";
import { ActCreateComponent } from "./masters/access-control-template/act-create/act-create.component";
import { ActListComponent } from "./masters/access-control-template/act-list/act-list.component";
// import { UserListComponent } from './admin/user/user-list/user-list.component';
// import { UserCreateComponent } from './admin/user/user-create/user-create.component';
import { AuthorizationitemComponent } from "./admin/authorizationitem/authorizationitem.component";
import { AuthorizationmatrixComponent } from "./admin/authorizationmatrix/authorizationmatrix.component";
import { AuthorizationmatrixlistComponent } from "./admin/authorizationmatrixlist/authorizationmatrixlist.component";
import { NotificationconfigurationComponent } from "./admin/notificationconfiguration/notificationconfiguration.component";
import { UserListComponent } from "./admin/user/user-list/user-list.component";
import { UserCreateComponent } from "./admin/user/user-create/user-create.component";
import { AuthorizationitemmasterComponent } from "./admin/authorizationitemmaster/authorizationitemmaster.component";
import { NotificationconfigurationlistComponent } from "./admin/notificationconfigurationlist/notificationconfigurationlist.component";
import { ApprovalConfigurationComponent } from "./admin/approval-configuration/approval-configuration.component";
import { RouterModule, Routes } from "@angular/router";
import { ApprovalConfigurationListComponent } from "./admin/approval-configuration-list/approval-configuration-list.component";
import { DynamicGuard } from "../guards/auth.guard";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { EncryptDecryptComponent } from "./masters/encrypt-decrypt/encrypt-decrypt.component";
import { CurrencysaplistComponent } from "./masters/currencies/currency-sap/currencysaplist/currencysaplist.component";

const umsRoutes: Routes = [
   //{ path: "", redirectTo: "login", pathMatch: "full" },
  // { path: "login", component: LoginComponent },
  {
    path: "",
    component: DashboardlayoutComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      // { path: "**", component: CurrencyListComponent },
      {
        path: "dashboard",
        component: LandingPageComponent,
      },
      //Designation
      {
        path: "master/designations",
        component: DesignationListComponent,
        canActivate: [DynamicGuard],
      },

      //Department
      {
        path: "master/departments",
        component: DepartmentListComponent,
        canActivate: [DynamicGuard],
      },
      //same component for both create and edit

      //Country
      {
        path: "master/countries",
        component: CountryListComponent,
        canActivate: [DynamicGuard],
      },
      //State
      {
        path: "master/states",
        component: StateListComponent,
        canActivate: [DynamicGuard],
      },

      //City
      {
        path: "master/cities",
        component: CityListComponent,
        canActivate: [DynamicGuard],
      },

      //Currency
      {
        path: "master/currencies",
        component: CurrencyListComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/currencies/create",
        component: CurrencyCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/currencies/edit/:currencyId",
        component: CurrencyCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/currencies/view/:currencyId",
        component: CurrencyCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/currencysaplist",
        component: CurrencysaplistComponent,
      }, //same component for both create and edit

      //Branch
      {
        path: "master/branches",
        component: BranchListComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/branches/create",
        component: BranchCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/branches/edit/:branchId",
        component: BranchCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/branches/view/:branchId",
        component: BranchCreateComponent,
        canActivate: [DynamicGuard],
      }, //same component for both create and edit

      //Employee
      {
        path: "master/employ",
        component: EmployeeListComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/employ/create",
        component: EmployeeCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/employ/edit/:employeeId",
        component: EmployeeCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/employ/view/:employeeId",
        component: EmployeeCreateComponent,
        canActivate: [DynamicGuard],
      }, //same component for both create and edit

      //Access Control
      {
        path: "activity/acts",
        component: ActListComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/acts/create",
        component: ActCreateComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/acts/edit/:accessControlId",
        component: ActCreateComponent,
        canActivate: [DynamicGuard],
      }, //same component for both create and edit
      {
        path: "activity/acts/view/:accessControlId",
        component: ActCreateComponent,
        canActivate: [DynamicGuard],
      },

      //User Managment
      {
        path: "activity/users",
        component: UserListComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/users/create",
        component: UserCreateComponent,
         canActivate: [DynamicGuard],
      },
      {
        path: "activity/users/edit/:userId/:readOnly",
        component: UserCreateComponent,
         canActivate: [DynamicGuard],
      }, //same component for both create and edit

      //Authorization Item
      {
        path: "master/authitem/create",
        component: AuthorizationitemmasterComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/authitem",
        component: AuthorizationitemComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/authitem/edit/:id",
        component: AuthorizationitemmasterComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/authitem/view/:id",
        component: AuthorizationitemmasterComponent,
        canActivate: [DynamicGuard],
      },

      //Authorization Matrix
      {
        path: "activity/authmat/create",
        component: AuthorizationmatrixComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/authmat/edit/:id/:readOnly",
        component: AuthorizationmatrixComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/authmat/view/:id/:readOnly",
        component: AuthorizationmatrixComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/authmat",
        component: AuthorizationmatrixlistComponent,
        canActivate: [DynamicGuard],
      },

      //Notification Configuration//
      {
        path: "activity/notificationconfiguration/create",
        component: NotificationconfigurationComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/notificationconfiguration/edit/:id",
        component: NotificationconfigurationComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/notificationconfiguration/view/:id",
        component: NotificationconfigurationComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/notificationconfiguration",
        component: NotificationconfigurationlistComponent,
        canActivate: [DynamicGuard],
      },

      //Notification Configuration//
      {
        path: "activity/approvalconfiguration/create",
        component: ApprovalConfigurationComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/approvalconfiguration",
        component: ApprovalConfigurationListComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/approvalconfiguration/edit/:id",
        component: ApprovalConfigurationComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "activity/approvalconfiguration/view/:id",
        component: ApprovalConfigurationComponent,
        canActivate: [DynamicGuard],
      },
      {
        path: "master/enc&drc",
        component:EncryptDecryptComponent,
      },
    ],
  },
  { path: "**", redirectTo: "login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(umsRoutes)],
  exports: [RouterModule],
})
export class UmsRoutingModule {}
