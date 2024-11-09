import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { State,process  } from "@progress/kendo-data-query";
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';

@Component({
  selector: 'app-enquiry-popup',
  templateUrl: './enquiry-popup.component.html',
  styleUrls: ['./enquiry-popup.component.css']
})
export class EnquiryPopupComponent implements OnInit{
 
  EgridData:any;
  public Estate: State = {
    skip: 0,
    take: 10,
  };
  EpageSize = 10;
  Eskip: number = 0;
  sizes = [10, 20, 50];
  buttonCount = 3;

 constructor(@Inject(MAT_DIALOG_DATA) public data: any,public router: Router,private jobTypeService: JobtypeserviceService,){}
 
  ngOnInit(): void {
    console.log(this.data?.list)
    this.loadEGridData();
  }

  EpageChange({ skip, take }: PageChangeEvent): void {
    this.Eskip = skip;
    this.EpageSize = take;
  }
  public onEStateChange(state: State) {
    this.Estate = state;
    this.loadEGridData();
  }

  loadEGridData(){
    this.EgridData = process(this.data?.list, this.Estate) as GridDataResult;
  }

  onCellClick(dataItem: any, field: string): void {
    console.log(`Cell clicked! Field: ${field}, Data: ${dataItem}`);

    if(field === 'enquiryNumber'){
      console.log(dataItem?.enquiryId)
      let id = dataItem?.enquiryId;
      this.router.navigate([`/crm/transaction/enquiry/view/${id}`])
    } else if(field === 'jobTypeName'){
      this.jobTypeService.isView=true;
      this.jobTypeService.isEdit=false;
      this.jobTypeService.setItemId(dataItem.jobTypeId);
      this.router.navigate(["/crm/master/jobtype/create"]);
    }
  }
}
