import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { EnquiryService } from 'src/app/crm/transaction/Enquiry/enquiry.service';
import { Enquiry } from 'src/app/Models/crm/master/transactions/Enquiry';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { SVGIcon, fileExcelIcon } from "@progress/kendo-svg-icons";
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from "@progress/kendo-data-query";
import { GridComponent } from '@progress/kendo-angular-grid';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-enquiry-report',
  templateUrl: './enquiry-report.component.html',
  styleUrls: ['./enquiry-report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EnquiryReportComponent implements OnInit {
  enquiryReport: Enquiry[] = [];
  enquiryCustomizeColumns: any[] = [];
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
    dialogRef: any;

  @ViewChild('myCityDialog') cityDialog = {} as TemplateRef<string>;
  @ViewChild(GridComponent) grid: GridComponent;
  public fileExcelIcon: SVGIcon = fileExcelIcon;
  public group: { field: string }[] = [
    {
      field: "enquiryNumber",
    },
  ];
  
  constructor(private service: EnquiryService,public dialog: MatDialog) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    this.getCustomizeColumn();
  }

  getCustomizeColumn(){
    this.enquiryCustomizeColumns =[
      {columnName: 'Enquiry Date', orderNo: 0, isSelected: false},
      {columnName: 'Enquiry Number', orderNo: 0, isSelected: false},
      {columnName: 'Origin Country', orderNo: 0, isSelected: false},
      {columnName: 'Customer Category', orderNo: 0, isSelected: false},
      {columnName: 'Customer Name', orderNo: 0, isSelected: false},
      {columnName: 'Sales Owner', orderNo: 0, isSelected: false},
      {columnName: 'Sales Executive', orderNo: 0, isSelected: false},
      {columnName: 'Job Type', orderNo: 0, isSelected: false}
    
  ];
  }
  
openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }


  onFilterChange(filterData: any) {
    debugger
    console.log('Filter Data:', filterData);
    const fdate = filterData.fromDate.format('DD-MMM-YYYY');
    const tdate = filterData.toDate.format('DD-MMM-YYYY');
    const modeOfTransport = filterData.modeOfTransport.length > 0 ? filterData.modeOfTransport : "0";
    const originCountry = filterData.originCountry.length > 0 ? filterData.originCountry : "0";
    const destinationCountry = filterData.destinationCountry.length > 0 ? filterData.destinationCountry : "0";
    const informationSource = filterData.informationSource.length > 0 ? filterData.informationSource : "0";
    const commodity = filterData.commodity.length > 0 ? filterData.commodity : "0";
    this.service.GetEnquiryReportByFilterdColumn(fdate,tdate,modeOfTransport,originCountry,destinationCountry,informationSource,commodity).subscribe((res) => {
      this.enquiryReport = res;
      console.log("this.enquiryReort",this.enquiryReport);
    });
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.enquiryReport, { 
        filter: this.grid?.filter || undefined,
        sort: this.grid?.sort || undefined,
        group: this.grid?.group || [] 
      }).data as any[] 
    };

    return result;
  }
  closeDialog(): void {
    this.dialog.closeAll();
  }
}
