import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FollowupStatus} from 'src/app/Models/crm/master/Dropdowns';
import { CommonService } from 'src/app/services/common.service';

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
  selector: 'app-empactivity-report-filter',
  templateUrl: './empactivity-report-filter.component.html',
  styleUrls: ['./empactivity-report-filter.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmpactivityReportFilterComponent  implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  Livestatus = 1;
  Followupstatus: FollowupStatus[] = [];


  filterForm = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    followUpStatus: new FormControl(''),
  })
  constructor(private fb: FormBuilder,
    private Cservice: CommonService
  ) {
    
  }
  ngOnInit(): void {
    this.getFollowUpStatusList();
 
  }

  onSearch() {
    debugger
    this.filterChange.emit(this.filterForm.value);
  }
  getFollowUpStatusList() {
    this.Cservice.getAllFollowupStatus().subscribe(result => {
      this.Followupstatus = result;
    });
  }

}

