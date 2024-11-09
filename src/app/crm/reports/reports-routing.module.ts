import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnquiryReportComponent } from './enquiry-report/enquiry-report.component';
import { PctocustomerComponent } from './pctocustomer-report/pctocustomer/pctocustomer.component';
import {RfqwithpendingpqReportComponent} from './rfqwithpendingpq-report/rfqwithpendingpq-report/rfqwithpendingpq-report.component';
import { EmployeewisependingfollowupComponent } from './employeewisependingfollowup/employeewisependingfollowup/employeewisependingfollowup.component';
import { EmployeeactivityreportComponent } from './employeeactivityreport/employeeactivityreport/employeeactivityreport.component';

const routes: Routes = [
  {path:'enquiryreport', component:EnquiryReportComponent},
  {path:'pctocustomer', component: PctocustomerComponent},
  {path:'rfqwithpendingpq', component: RfqwithpendingpqReportComponent},
  {path:'employeewisependingfollowup', component: EmployeewisependingfollowupComponent},
  {path:'empactivityreport', component: EmployeeactivityreportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
