import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { RfqAgainst} from 'src/app/Models/crm/master/Dropdowns';
import { CommonService } from 'src/app/services/common.service';
import { Dropdown} from 'src/app/Models/crm/master/Dropdowns';

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
  selector: 'app-rfqwithpendingpq',
  templateUrl: './rfqwithpendingpq.component.html',
  styleUrls: ['./rfqwithpendingpq.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class RfqwithpendingpqComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  Livestatus = 1;
  RfqAgainstList: RfqAgainst[];
  jobOrderNoList: Dropdown[];
  rfqNoList: Dropdown[];
  rfqStatusList: Dropdown[];
  enquiryNoList: Dropdown[];

  filterForm = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    rfqAgainst: new FormControl(''),
    referenceNo: new FormControl(''),
    rfqNo: new FormControl(''),
    rfqStatus: new FormControl(''),
  })
  constructor(private fb: FormBuilder,
    private Cservice: CommonService,
  ) {
  }
  ngOnInit(): void {

    this.getAllRfqAgainstList();
    this.getAllEnquiryNoList();
    this.getAllJobOrderNoList();
    this.getAllRfqNoList();
    this.getAllRfqNoList();
    this.getAllRfqStatusList();
  }
  getAllRfqAgainstList() {
    this.Cservice.GetAllRfqAgainst().subscribe(result => {
      this.RfqAgainstList = result;
    });
  }
  getAllEnquiryNoList() {
    this.Cservice.GetAllEnquiryNo().subscribe(result => {
      this.enquiryNoList = result;
    });
  }
  getAllJobOrderNoList() {
    this.Cservice.GetAllJobOrderNo().subscribe(result => {
      this.jobOrderNoList = result;
    });
  }
  getAllRfqNoList() {
    this.Cservice.GetAllRfqNo().subscribe(result => {
      this.rfqNoList = result;
    });
  }
  getAllRfqStatusList() {
    this.Cservice.GetAllRFQStatuss().subscribe(result => {
      this.rfqStatusList = result;
    });
  }

  onSearch() {
    debugger
    this.filterChange.emit(this.filterForm.value);
  }
}

