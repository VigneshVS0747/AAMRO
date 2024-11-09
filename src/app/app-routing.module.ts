import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UmsRoutingModule } from "./ums/ums-routing.module";
import { LoginComponent } from "./ums/admin/user/login/login.component";
import { AuthGuard, LoginGuard } from "./guards/auth.guard";
const routes: Routes = [
  { path: "", pathMatch: "full",redirectTo: "login" },
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: "ums",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./ums/ums-routing.module").then((m) => m.UmsRoutingModule),
  },
  {
    path: "crm",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./crm/crm-routing.module").then((m) => m.CrmRoutingModule),
  },
  {
    path: "qms",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./qms/qms-routing.module").then((m) => m.QmsRoutingModule),
  },
  { path: 'reports', loadChildren: () => import('./crm/reports/reports.module').then(m => m.ReportsModule) },
  { path: "**", redirectTo: "ums", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
