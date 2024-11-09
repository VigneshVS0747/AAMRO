import { Component, OnInit, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { SVGIcon, fileExcelIcon } from "@progress/kendo-svg-icons";
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from "@progress/kendo-data-query";
import { GridComponent } from '@progress/kendo-angular-grid';
import { Rfqgeneral } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { RfqService } from 'src/app/crm/transaction/RFQ/rfq.service';

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
  selector: 'app-rfqwithpendingpq-report',
  templateUrl: './rfqwithpendingpq-report.component.html',
  styleUrls: ['./rfqwithpendingpq-report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RfqwithpendingpqReportComponent implements OnInit  {
  rfqWithPendingPQReport: Rfqgeneral[] = [];
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
  
  constructor(private rfqService: RfqService,) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
  }
  onFilterChange(filterData: any) {
    debugger
    console.log('Filter Data:', filterData);
    const fdate = filterData.fromDate.format('DD-MMM-YYYY');
    const tdate = filterData.toDate.format('DD-MMM-YYYY');
    const rfqAgainst = filterData.rfqAgainst.length > 0 ? filterData.rfqAgainst : "0";
    const referenceNo = filterData.referenceNo.length > 0 ? filterData.referenceNo : "0";
    const rfqNo = filterData.rfqNo.length > 0 ? filterData.rfqNo : "0";
    const rfqStatus = filterData.rfqStatus.length > 0 ? filterData.rfqStatus : "0";
    this.rfqService.GetPendingPQReportByFilterdColumn(fdate,tdate,rfqAgainst,referenceNo,rfqNo,rfqStatus).subscribe((res) => {
      this.rfqWithPendingPQReport = res;
      console.log("this.enquiryReort",this.rfqWithPendingPQReport);
    });
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.rfqWithPendingPQReport, { 
        filter: this.grid?.filter || undefined,
        sort: this.grid?.sort || undefined,
        group: this.grid?.group || [] 
      }).data as any[] 
    };

    return result;
  }
}
