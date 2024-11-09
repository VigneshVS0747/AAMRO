import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { RegionMappingComponent } from './region-mapping/region-mapping.component';
import { DynamicGuard } from 'src/app/guards/auth.guard';

const routes:Routes = [
  {
    path:'region-mapping',
    component:RegionMappingComponent,canActivate: [DynamicGuard]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
