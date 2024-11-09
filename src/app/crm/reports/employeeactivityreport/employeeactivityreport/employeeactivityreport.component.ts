import { Component, OnInit, ViewChild } from '@angular/core';
import { EnquiryService } from 'src/app/crm/transaction/Enquiry/enquiry.service';
import { Enquiry, EnquirySalesfunnel, Enquiryvaliditycloser } from 'src/app/Models/crm/master/transactions/Enquiry';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { SVGIcon, fileExcelIcon } from "@progress/kendo-svg-icons";
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from "@progress/kendo-data-query";
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { FollowupService } from 'src/app/crm/transaction/FollowUp/followup.service';
import { FollowUplist } from 'src/app/Models/crm/master/transactions/Followup';

export const MY_FORMATS = {
  parse: {
    dateInput: ['DD/MM/YYYY', 'DD/MMM/YYYY'] as any,
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-employeeactivityreport',
  templateUrl: './employeeactivityreport.component.html',
  styleUrls: ['./employeeactivityreport.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmployeeactivityreportComponent implements OnInit {
  empActivityReport: FollowUplist[] = [];
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;

  @ViewChild(GridComponent) grid: GridComponent;
  public fileExcelIcon: SVGIcon = fileExcelIcon;
  public group: { field: string }[] = [
    {
      field: "enquiryNumber",
    },
  ];
  
  constructor(private service: FollowupService,) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
  }
  onFilterChange(filterData: any) {
    debugger
    console.log('Filter Data:', filterData);
    const fdate = filterData.fromDate.format('DD-MMM-YYYY');
    const tdate = filterData.toDate.format('DD-MMM-YYYY');
    const followUpStatus = filterData.followUpStatus.length > 0 ? filterData.followUpStatus : "0";
    this.service.GetEmpActivityReportByFilterdColumn(fdate,tdate,followUpStatus).subscribe((res) => {
      this.empActivityReport = res;
      console.log("this.empActivityReport",this.empActivityReport);
    });
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.empActivityReport, { 
        filter: this.grid?.filter || undefined,
        sort: this.grid?.sort || undefined,
        group: this.grid?.group || [] 
      }).data as any[] 
    };

    return result;
  }
}