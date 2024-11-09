import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AirportService } from '../airport.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { Observable, map, startWith } from 'rxjs';
import { State } from 'src/app/ums/masters/states/state.model';
import { City } from 'src/app/Models/ums/city.model';
import Swal from 'sweetalert2';
import { Airport } from 'src/app/Models/crm/master/Airport';
import { AnimationStyleMetadata } from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
@Component({
  selector: 'app-airport-create',
  templateUrl: './airport-create.component.html',
  styleUrls: ['./airport-create.component.css']
})
export class AirportCreateComponent {
  processTitle= 'Add';

  ShowError: boolean = false;
  airportStatus: boolean = true;
  Livestaus = 1

  airportForm: FormGroup;
  
  airportcommonID:number=0;

  CountryDatalist: Country[] = [];
  filteredCountryOptions$: Observable<any[]>;
  countryIdValue:any;

  StateDatalist: State[] = [];
  filteredStateOptions$: Observable<any[]>;
  stateIdValue:any;

  CityDatalist: City[]=[];
  filteredCityOptions$: Observable<any[]>;
  cityIdValue: any;

  getAiportData: any;
  airportMasterDataModel: Airport = new Airport();

  @ViewChild('form') form:NgForm;
  viewMode:boolean=false
  disablefields: boolean = false;
  userId$: string;
  constructor(private router: Router,
    private formbuilder: FormBuilder,
    private airportmstrSvc: AirportService,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
    ) {
    this.getCountryMasterListdata();
  }

  ngOnInit(): void {
    this.GetUserId();
    this.airportForm = this.formbuilder.group({
      airportId:0,
      airportCode: ["", Validators.required],
      airportName: ["", Validators.required],
      country: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      latitude: ["" ],
      longitude: ["" ],
      livestatus:true
    });
    if(this.airportmstrSvc.itemId && !this.airportmstrSvc.isView){
      this.processTitle='Edit';
      this.airportmstrSvc.getAirport(this.airportmstrSvc.itemId).subscribe(res=>{
        this.getAiportData=res;
        this.countryIdValue=this.getAiportData.countryId;
        this.stateIdValue=this.getAiportData.stateId;
        this.getCityMasterListdata();
        this.getStateMasterListdata();
        if(this.getAiportData!=0){
          this.setAirportvalues();
        }
      })
    }
    if(this.airportmstrSvc.isView){
      this.view();
      this.viewMode=true;
   }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  //#region view
  view(){
    this.processTitle='View';
    this.airportmstrSvc.getAirport(this.airportmstrSvc.itemId).subscribe(res=>{
      this.getAiportData=res;
      if(this.getAiportData!=0){
        this.setFormControlsReadonly(true);
        this.setAirportvalues();
      }
    })
  }
  //dynamically make all the form controls readonly if view
  setFormControlsReadonly(readonly: boolean): void {
    Object.keys(this.airportForm.controls).forEach(controlName => {
      const control = this.airportForm.get(controlName);
      
      if (control) {
        if (readonly) {
          control.disable();
        } else {
          control.enable();
        }
      }
    });
  }
  //#endregion

  //#region Get edit based data and set in form
  setAirportvalues(){    
    this.airportcommonID=this.getAiportData.airportId;
    this.countryIdValue=this.getAiportData.countryId;
    this.stateIdValue=this.getAiportData.stateId;
    this.cityIdValue=this.getAiportData.cityId;
    this.airportForm.controls['airportCode'].setValue(this.getAiportData.airportCode);
    this.airportForm.controls['airportName'].setValue(this.getAiportData.airportName);
    this.airportForm.controls['country'].setValue(this.getAiportData);
    this.airportForm.controls['state'].setValue(this.getAiportData);
    this.airportForm.controls['city'].setValue(this.getAiportData);
    this.airportForm.controls['latitude'].setValue(this.getAiportData.latitude);
    this.airportForm.controls['longitude'].setValue(this.getAiportData.longitude);
    this.airportForm.controls['livestatus'].setValue(this.getAiportData.livestatus);
  }
  //#endregion
  returnToList() {
    this.router.navigate(['crm/master/airport']);
  }

  //#region country autocomplete
  getCountryMasterListdata() {
    this.airportmstrSvc.getCountries(this.Livestaus).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.airportForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this.filterCountryFunType(name) : this.CountryDatalist?.slice()))
    );
  }
  private filterCountryFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    //return this.CountryDatalist.filter((option: any) => option.country.toLowerCase().includes(filterValue));
    const results = this.CountryDatalist.filter((option: any) => option.countryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoData();
  }
  NoData(): any {
    this.airportForm.controls['country'].setValue('');
    //this.countryIdValue = 0;
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;

    this.countryIdValue = selectedCountry.countryId;
    this.airportForm.controls['state'].setValue('');
    this.cityIdValue=0;
    this.airportForm.controls['city'].setValue('');
    this.cityIdValue=0;
    this.getStateMasterListdata();
    //this.getCompanyMasterListdata();
  }
  //#endregion

  //#region state autocomplete
  getStateMasterListdata() {
    this.countryIdValue;
    //let targtype = "State"
    this.airportmstrSvc.getStatesForSelectedCountry(this.countryIdValue).subscribe(result => {
        this.StateDatalist = result;
        this.StateTypeFun();
    });
  }
  StateTypeFun() {
    this.filteredStateOptions$ = this.airportForm.controls['state'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.stateName)),
      map((name: any) => (name ? this.filterStateFunType(name) : this.StateDatalist?.slice()))
    );
  }
  private filterStateFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    //return this.StateDatalist.filter((option: any) => option.state.toLowerCase().includes(filterValue));
    const results = this.StateDatalist.filter((option: any) => option.stateName.toLowerCase().includes(filterValue));
    return results.length ? results : this.StateNoData();
  }
  StateNoData(): any {
    this.airportForm.controls['state'].setValue('');
    this.stateIdValue = 0;
    return this.StateDatalist;
  }
  displayStateLabelFn(statedata: any): string {
    return statedata && statedata.stateName ? statedata.stateName : '';
  }

  clearStateNameData() {
    this.stateIdValue = 0;
   // this.companyIdValue = 0;
    this.airportForm.controls['state'].reset();
    //this.airportForm.controls['country'].reset();
  }

  StateSelectedoption(StateData: any) {
    let selectedState = StateData.option.value;
    
    this.stateIdValue = selectedState.stateId;
    this.airportForm.controls['city'].setValue('');
    this.cityIdValue=0;
    this.getCityMasterListdata()
  }
  //#endregion
 
  //#region city autocomplete
  getCityMasterListdata() {
    this.stateIdValue;    
    this.airportmstrSvc.getCityForSelectedState(this.stateIdValue).subscribe((res: any) => {
        this.CityDatalist = res;
        this.CityTypeFun();        
    });
    
  }
  CityTypeFun() {
    this.filteredCityOptions$ = this.airportForm.controls['city'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this.filterCityFunType(name) : this.CityDatalist?.slice()))
    );
    
  }
  private filterCityFunType(name: string): any[] {
    const filterValue = name.toLowerCase();     
    //return this.CompanyDatalist.filter((option: any) => option.company.toLowerCase().includes(filterValue));
    const results= this.CityDatalist.filter((option: any) => option.cityName.toLowerCase().includes(filterValue));
    return results.length ? results : this.CityNoData();
  }
  CityNoData(): any {
    this.airportForm.controls['city'].setValue('');
    this.cityIdValue = 0;
    return this.CityDatalist;
  }
  displayCityLabelFn(citydata: any): string {
    return citydata && citydata.cityName ? citydata.cityName : '';
  }
  
  clearCityNameData() {
    this.cityIdValue = 0;
    this.airportForm.controls['city'].reset();
    
  }
  
  CitySelectedoption(CityData: any) {
    let selectedCity = CityData.option.value;
    this.cityIdValue = selectedCity.cityId;
  }
  //#endregion

  onSaveAirport() {
    if(this.airportForm.valid){
      this.airportMasterDataModel.AirportId=this.airportcommonID;
      this.airportMasterDataModel.AirportCode=this.airportForm.controls['airportCode'].value;
      this.airportMasterDataModel.AirportName =this.airportForm.controls['airportName'].value;
     // this.airportMasterDataModel.CountryName=this.airportForm.controls['country'].value.countryName;
      this.airportMasterDataModel.CountryId=this.countryIdValue;
      //this.airportMasterDataModel.StateName=this.airportForm.controls['state'].value.stateName;
      this.airportMasterDataModel.StateId=this.stateIdValue;
      //this.airportMasterDataModel.CityName=this.airportForm.controls['city'].value.cityName;
      this.airportMasterDataModel.CityId=this.cityIdValue;
      this.airportMasterDataModel.Latitude=this.airportForm.controls['latitude'].value;
      this.airportMasterDataModel.Longitude=this.airportForm.controls['longitude'].value;
      this.airportMasterDataModel.AirportCode=this.airportForm.controls['airportCode'].value;
      this.airportMasterDataModel.Livestatus=this.airportForm.controls['livestatus'].value?true:false;
      this.airportMasterDataModel.CreatedBy=parseInt(this.userId$);
      this.airportMasterDataModel.CreatedDate=new Date();
      this.airportMasterDataModel.UpdatedBy=parseInt(this.userId$);
      this.airportMasterDataModel.UpdatedDate=new Date()
       if(this.airportMasterDataModel.AirportId==0){
        this.airportmstrSvc.addAirport(this.airportMasterDataModel).subscribe((res) => {
          this.airportForm.reset();
          this.airportForm.controls['livestatus'].setValue(true);
          this.router.navigate(['crm/master/airport']);
           Swal.fire({
             icon: 'success',
             title: 'Success',
             text: 'Added Sucessfully',
             showConfirmButton: false,
             timer: 2000
           })
         },
          (err: HttpErrorResponse) => {

            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if (stausCode === 500) {
              this.errorHandler.handleError(err);
            } else if (stausCode === 400) {
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }

            //  // this.airportForm.controls['airportCode'].setValue('');
            //    Swal.fire({
            //      icon: 'error',
            //      title: 'Duplicate',
            //      text: 'Airport is already exist...!',
            //      showConfirmButton: false,
            //      timer: 2000
            //    })
          });
       }
       else{
        this.airportmstrSvc.updateAirport(this.airportMasterDataModel).subscribe((res) => {
          if(res){
            this.airportForm.reset();
            this.airportForm.controls['livestatus'].setValue(true);
            this.router.navigate(['crm/master/airport']);
             Swal.fire({
               icon: 'success',
               title: 'Success',
               text: 'Updated Sucessfully',
               showConfirmButton: false,
               timer: 2000
             })
          }
        },
          (err: HttpErrorResponse) => {

            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if (stausCode === 500) {
              this.errorHandler.handleError(err);
            } else if (stausCode === 400) {
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }

            //  // this.airportForm.controls['airportCode'].setValue('');
            //    Swal.fire({
            //      icon: 'error',
            //      title: 'Duplicate',
            //      text: 'Airport is already exist...!',
            //      showConfirmButton: false,
            //      timer: 2000
            //    })
          });
      }
    }
    else {
      this.airportForm.markAllAsTouched();
      return
    }
  }
  valueChange($event: any) {
    //set the two-way binding here 
    this.airportStatus = $event.checked
  }

  reset(form: any) {
    if(this.airportmstrSvc.itemId && !this.airportmstrSvc.isView){
      this.processTitle='Edit';
      this.airportmstrSvc.getAirport(this.airportmstrSvc.itemId).subscribe(res=>{
        this.getAiportData=res;
        console.log(this.getAiportData);
        
        if(this.getAiportData!=0){
          this.setAirportvalues();
        }
      })
    }else{
      this.airportStatus = true;
      this.airportForm.reset();
      this.airportForm = this.formbuilder.group({
       airportId:0,
       airportCode: ["", Validators.required],
       airportName: ["", Validators.required],
       country: ["", Validators.required],
       state: ["", Validators.required],
       city: ["", Validators.required],
       latitude: ["" ],
       longitude: ["" ],
       livestatus:true
     });
    }
   
  }
  CEmpty() {
    this.countryIdValue = null;
    this.stateIdValue = null;
    this.cityIdValue = null;
    this.airportForm.controls['state'].setValue('');
    this.airportForm.controls['city'].setValue('');
  }
}