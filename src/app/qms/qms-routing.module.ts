import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QmsRoutingModule { }
