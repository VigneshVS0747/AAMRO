import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { RegionMappingComponent } from './region-mapping/region-mapping.component';
import { MaterialModule } from '../../material.module';
import { GridModule } from "@progress/kendo-angular-grid";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegionMappingComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    MaterialModule,
    GridModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MasterModule { }
