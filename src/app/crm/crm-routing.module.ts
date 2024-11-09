import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardlayoutComponent } from '../dashboardlayout/dashboardlayout.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: DashboardlayoutComponent,
    children:[
      {
        path: "master",
        canActivate: [AuthGuard],
        loadChildren: () => import("./master/master-routing.module").then((m) => m.MasterRoutingModule),
      }
    ]
  },
  {
    path: "",
    component: DashboardlayoutComponent,
    children:[
      {
        path: "transaction",
        canActivate: [AuthGuard],
        loadChildren: () => import("./transaction/transaction-routing.module").then((m) => m.TransactionRoutingModule),
      }
    ]
  },
  {
    path: "",
    component: DashboardlayoutComponent,
    children:[
      {
        path: "reports",
        canActivate: [AuthGuard],
        loadChildren: () => import("./reports/reports-routing.module").then((m) => m.ReportsRoutingModule),
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
