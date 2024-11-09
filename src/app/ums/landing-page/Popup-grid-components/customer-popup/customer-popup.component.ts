import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { State,process  } from "@progress/kendo-data-query";
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';

@Component({
  selector: 'app-customer-popup',
  templateUrl: './customer-popup.component.html',
  styleUrls: ['./customer-popup.component.css']
})
export class CustomerPopupComponent {

  CustomerGridData:any;
  public Cstate: State = {
    skip: 0,
    take: 10,
  };
  Cskip: number = 0;
  CpageSize = 10;
  sizes = [10, 20, 50];
  buttonCount = 3;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public router: Router,private jobTypeService: JobtypeserviceService,){}
 
  ngOnInit(): void {
    console.log(this.data?.list)
    this.loadCGridData();
  }

  public CpageChange({ skip, take }: PageChangeEvent): void {
    this.Cskip = skip;
    this.CpageSize = take;
  }
  public onCStateChange(state: State) {
    this.Cstate = state;
    this.loadCGridData();
  }

  loadCGridData(){
    this.CustomerGridData = process(this.data?.list, this.Cstate) as GridDataResult;
  }

  onCellClick(dataItem: any, field: string): void {
    console.log(`Cell clicked! Field: ${field}, Data: ${dataItem}`);
    // Add additional logic here based on `dataItem` and `field`
  }
}
