import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
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
  selector: 'app-grid-filter',
  templateUrl: './grid-filter.component.html',
  styleUrls: ['./grid-filter.component.css','../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GridFilterComponent implements OnInit{

  @Output() filterChange = new EventEmitter<any>();
  @Input() selectOptions: any[] = [];
  searchTextDrp: any[]=[];
  

  constructor(private commonService: CommonService,private Jtype: JobtypeserviceService,){

  }

  ngOnInit(): void{
    this.filterForm.get('searchBy')?.valueChanges.subscribe(value => {
      let checkValue = this.selectOptions?.find(option =>option?.searchBy === value)
      if(checkValue){
        this.getOptionsForSelectedField(); 
      }
    });
  }

  filterForm = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    searchBy: new FormControl(''),
    searchText: new FormControl(''),
  })

  onSearch() {
    this.filterChange.emit(this.filterForm.value);
  }

  getSelectedFieldType() {
    const selectedField = this.filterForm.get('searchBy')?.value;
    if(selectedField == ''){
      this.filterForm.controls.searchText.disable();
    } else {
      this.filterForm.controls.searchText.enable(); 
    }
    if(selectedField === 'Date'){
      return 'date';
    } else if(selectedField === 'Job Category' || selectedField === 'Job Type' || selectedField === 'Status'){
      return 'select';
    } else {
      return 'input';
    }
  }

  getOptionsForSelectedField() {
    this.filterForm.controls.searchText.reset();
    const selectedFieldId = this.filterForm.get('searchBy')?.value;

    const screen = this.selectOptions.find(option => option?.screenName);
    console.log(screen)
    
    //Enquiry Page
    if(selectedFieldId === 'Status' && screen?.screenName === 'Enquiry'){
      this.commonService.getAllEnquiryStatus().subscribe((res:any)=>{
        console.log(res);
        this.searchTextDrp = res.map((item: any) => ({
          value: item.enquiryStatusId,
          viewValue: item.enquiryStatus
        }));
      });
    } else if(selectedFieldId === 'Job Category'){
      this.Jtype.GetAllJobCategory().subscribe((res:any)=>{
        console.log(res);
        this.searchTextDrp = res.map((item: any) => ({
          value: item.jobCategoryId,
          viewValue: item.jobCategory
        }));
      });
    }
    else {
      this.searchTextDrp = [];
    }
    return [];
  }
}
