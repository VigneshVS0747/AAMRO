import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ExcelExportModule } from "@progress/kendo-angular-excel-export";
import { IntlModule } from '@progress/kendo-angular-intl';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MaterialModule } from '../../material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { EnquiryReportComponent } from './enquiry-report/enquiry-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PctocustomerComponent } from './pctocustomer-report/pctocustomer/pctocustomer.component';
import { RfqwithpendingpqReportComponent } from './rfqwithpendingpq-report/rfqwithpendingpq-report/rfqwithpendingpq-report.component';
import { EmployeewisependingfollowupComponent } from './employeewisependingfollowup/employeewisependingfollowup/employeewisependingfollowup.component';
import { EmployeeactivityreportComponent } from './employeeactivityreport/employeeactivityreport/employeeactivityreport.component';


@NgModule({
  declarations: [
    EnquiryReportComponent,
    PctocustomerComponent,
    RfqwithpendingpqReportComponent,
    EmployeewisependingfollowupComponent,
    EmployeeactivityreportComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReportsRoutingModule,
    ExcelExportModule,IntlModule,
    GridModule,ExcelModule,
    ButtonsModule,
    SharedModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsModule { }
