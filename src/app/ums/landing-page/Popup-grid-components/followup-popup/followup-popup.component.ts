import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { State,process  } from "@progress/kendo-data-query";
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';

@Component({
  selector: 'app-followup-popup',
  templateUrl: './followup-popup.component.html',
  styleUrls: ['./followup-popup.component.css']
})
export class FollowupPopupComponent {

  public FgridData: any;
  public Fstate: State = {
    skip: 0,
    take: 10,
  };
  Fskip: number = 0;
  FpageSize = 10;
  sizes = [10, 20, 50];
  buttonCount = 3;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public router: Router,private jobTypeService: JobtypeserviceService,){}
 
  ngOnInit(): void {
    console.log(this.data?.list)
    this.loadFGridData();
  }

  public FpageChange({ skip, take }: PageChangeEvent): void {
    this.Fskip = skip;
    this.FpageSize = take;
  }
  public onFStateChange(state: State) {
    this.Fstate = state;
    this.loadFGridData();
  }

  loadFGridData(){
    this.FgridData = process(this.data?.list, this.Fstate) as GridDataResult;
  }

  onCellClick(dataItem: any, field: string): void {
    console.log(`Cell clicked! Field: ${field}, Data: ${dataItem}`);
    if(field === 'followUpCode'){
      let id = dataItem?.followUpId;
      this.router.navigate([`/crm/transaction/followup/view/${id}`])
    }
  }
}
