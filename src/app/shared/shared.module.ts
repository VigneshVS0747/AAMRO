import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridFilterComponent } from './grid-filter/grid-filter.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportFilterComponent } from './report-filter/report-filter/report-filter.component';
import { PctocustomerReportComponent } from './pctocustomer-report/pctocustomer-report/pctocustomer-report.component';
import { RfqwithpendingpqComponent } from './rfqwithpendingpq/rfqwithpendingpq/rfqwithpendingpq.component';
import { EmpwisependingfollowupComponent } from './empwisependingfollowup/empwisependingfollowup/empwisependingfollowup.component';
import { EmpactivityReportFilterComponent } from './empactivity-report-filter/empactivity-report-filter/empactivity-report-filter.component';

@NgModule({
  declarations: [GridFilterComponent, ReportFilterComponent, PctocustomerReportComponent, RfqwithpendingpqComponent, EmpwisependingfollowupComponent, EmpactivityReportFilterComponent],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    GridFilterComponent, ReportFilterComponent, PctocustomerReportComponent,RfqwithpendingpqComponent, EmpwisependingfollowupComponent, EmpactivityReportFilterComponent 
  ]
})
export class SharedModule { }
