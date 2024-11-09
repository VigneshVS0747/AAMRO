import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { Industry } from 'src/app/Models/crm/master/Industry';
import { CommonService } from 'src/app/services/common.service';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { InfosourceService } from 'src/app/crm/master/infosource/infosource.service';
import { IndustryServiceService } from 'src/app/crm/master/industry-type/industry-type-service.service';
import { ModeofTransports} from 'src/app/Models/crm/master/Dropdowns';
import { forkJoin } from 'rxjs';

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
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  Livestatus = 1;
  comodity: Commodity[] = [];
  Modeoftrasport: ModeofTransports[] = [];
  country: Country[] = [];
  Infosource: Infosource[] = [];
  industryList: Industry[];

  filterForm = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    commodity: new FormControl(''),
    modeOfTransport: new FormControl(''),
    originCountry: new FormControl(''),
    destinationCountry: new FormControl(''),
    informationSource: new FormControl(''),
    industry: new FormControl('')
  })
  constructor(private fb: FormBuilder,
    private Cservice: CommonService,
    private Country: CountriesService,
    private SCamodity: CommodityService,
    private Sinfosource: InfosourceService,
    private IndustryTypeService: IndustryServiceService,
  ) {
    this.fetchDropDownData();
  }
  ngOnInit(): void {

  }
  fetchDropDownData(){
    const Country$ = this.Country.getAllCountries(this.Livestatus);
    const Comodity$ = this.SCamodity.getAllActiveCommodity();
    const Infosource$ = this.Sinfosource.getInfosource(this.Livestatus);
    const modeoftrasport$ = this.Cservice.getAllModeofTransport();
    const industry$ = this.IndustryTypeService.GetAllIndustry(this.Livestatus);

    forkJoin([Country$, modeoftrasport$, Comodity$, Infosource$, industry$]).subscribe({
      next: ([Country,modeoftrasport,Comodity,Infosource,industry]) => {
        this.country = Country
        this.Modeoftrasport = modeoftrasport
        this.comodity = Comodity
        this.Infosource = Infosource
        this.industryList = industry
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  onSearch() {
    debugger
    this.filterChange.emit(this.filterForm.value);
  }
}
