import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { CommonService } from 'src/app/services/common.service';
import { Employee } from 'src/app/ums/masters/employee/employee.model';

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
  selector: 'app-pctocustomer-report',
  templateUrl: './pctocustomer-report.component.html',
  styleUrls: ['./pctocustomer-report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PctocustomerReportComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  Livestatus = 1;
  salesOwnerList: Employee[];
  country: Country[] = [];


  filterForm = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    country: new FormControl(''),
    salesOwner: new FormControl(''),
    salesExecutive: new FormControl('')
  })
  constructor(private fb: FormBuilder,
    private Cservice: CommonService
  ) {
    
  }
  ngOnInit(): void {

    this.getEmployeeList();
    this.getCountryMasterListdata();
  }

  onSearch() {
    debugger
    this.filterChange.emit(this.filterForm.value);
  }
  getEmployeeList() {
    this.Cservice.getEmployees(this.Livestatus).subscribe(result => {
      this.salesOwnerList = result;
    });
  }
  getCountryMasterListdata() {
    this.Cservice.getCountries(this.Livestatus).subscribe((result) => {
      this.country = result;
    });
  }
}

  

