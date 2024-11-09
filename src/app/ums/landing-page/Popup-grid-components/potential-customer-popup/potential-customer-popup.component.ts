import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { State,process  } from "@progress/kendo-data-query";
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';

@Component({
  selector: 'app-potential-customer-popup',
  templateUrl: './potential-customer-popup.component.html',
  styleUrls: ['./potential-customer-popup.component.css']
})
export class PotentialCustomerPopupComponent {
  
  public PCstate: State = {
    skip: 0,
    take: 10,
  };
  PCskip: number = 0;
  PCpageSize = 10;
  PCustomerGridData:any;
  sizes = [10, 20, 50];
  buttonCount = 3;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public router: Router,private jobTypeService: JobtypeserviceService,){}
 
  ngOnInit(): void {
    console.log(this.data?.list)
    this.loadPCGridData();
  }

  public PCpageChange({ skip, take }: PageChangeEvent): void {
    this.PCskip = skip;
    this.PCpageSize = take;
  }
  public onPCStateChange(state: State) {
    this.PCstate = state;
    this.loadPCGridData();
  }

  loadPCGridData(){
    this.PCustomerGridData = process(this.data?.list, this.PCstate) as GridDataResult;
  }
}
