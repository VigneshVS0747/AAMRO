import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { SVGIcon, fileExcelIcon } from "@progress/kendo-svg-icons";
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from "@progress/kendo-data-query";
import { GridComponent } from '@progress/kendo-angular-grid';
import { Customer } from'src/app/crm/master/customer/customer.model';

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
  selector: 'app-pctocustomer',
  templateUrl: './pctocustomer.component.html',
  styleUrls: ['./pctocustomer.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PctocustomerComponent implements OnInit  {
  pctoCustomerReport: Customer[] = [];
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
  
  constructor(private service: CustomerService,) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
  }
  onFilterChange(filterData: any) {
    debugger
    console.log('Filter Data:', filterData);
    const fdate = filterData.fromDate.format('DD-MMM-YYYY');
    const tdate = filterData.toDate.format('DD-MMM-YYYY');
    const country = filterData.country.length > 0 ? filterData.country : "0";
    const salesOwner = filterData.salesOwner.length > 0 ? filterData.salesOwner : "0";
    const salesExecutive = filterData.salesExecutive.length > 0 ? filterData.salesExecutive : "0";
    this.service.GetPCtoCustomerReport(fdate,tdate,country,salesOwner,salesExecutive).subscribe((res) => {
      this.pctoCustomerReport = res;
      console.log("this.pctoCustomerReport",this.pctoCustomerReport);
    });
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.pctoCustomerReport, { 
        filter: this.grid?.filter || undefined,
        sort: this.grid?.sort || undefined,
        group: this.grid?.group || [] 
      }).data as any[] 
    };

    return result;
  }
}
