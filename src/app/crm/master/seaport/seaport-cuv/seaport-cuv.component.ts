import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { State } from 'src/app/ums/masters/states/state.model';
import { Observable, map, startWith } from 'rxjs';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { City } from 'src/app/Models/ums/city.model';
import { Router } from '@angular/router';
import { SeaportService } from '../seaport.service';
import { PortType, Seaport } from 'src/app/Models/crm/master/Seaport';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-seaport-cuv',
  templateUrl: './seaport-cuv.component.html',
  styleUrls: ['./seaport-cuv.component.css']
})
export class SeaportCuvComponent {
  processTitle= 'Add';

  ShowError: boolean = false;
  seaportStatus: boolean = true;
  Livestaus = 1

  seaportForm: FormGroup;
  
  airportcommonID:number=0;

  CountryDatalist: Country[] = [];
  filteredCountryOptions$: Observable<any[]>;
  countryIdValue: number;

  StateDatalist: State[] = [];
  filteredStateOptions$: Observable<any[]>;
  stateIdValue: number;

  CityDatalist: City[]=[];
  filteredCityOptions$: Observable<any[]>;
  cityIdValue: number;

  PorttypeDatalist: PortType[]=[];
  filteredPorttypeOptions$: Observable<any[]>;
  portTypeIdValue: number;

  getSeaportData: any;
  seaportMasterDataModel: Seaport = new Seaport();
  @ViewChild('form') form:NgForm;
  viewMode:boolean=false
  disablefields: boolean = false;
  userId$: string;
  constructor(private router: Router,
    private formbuilder: FormBuilder,
    private seaportmstrSvc: SeaportService,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
    ) {
    this.getCountryMasterListdata();
    this.getPorttypeMasterListdata();
  }
  ngOnInit(): void {
    this.GetUserId();
    this.seaportForm = this.formbuilder.group({
      seaportId:0,
      seaportCode: ["", Validators.required],
      seaportName: ["", Validators.required],
      country: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      porttype:["",Validators.required],
      latitude: [""],
      longitude: [""],
      livestatus:true
    });
    if(this.seaportmstrSvc.itemId && !this.seaportmstrSvc.isView){
      this.processTitle='Edit';
      this.seaportmstrSvc.getSeaport(this.seaportmstrSvc.itemId).subscribe(res=>{
        this.getSeaportData=res;   
        console.log(this.getSeaportData);

        if(this.getSeaportData!=0){
          this.setSeaportvalues();
        }
      })
    }
    if(this.seaportmstrSvc.isView){
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
    this.seaportmstrSvc.getSeaport(this.seaportmstrSvc.itemId).subscribe(res=>{
      this.getSeaportData=res;
      
      if(this.getSeaportData!=0){
        this.setFormControlsReadonly(true);
        this.setSeaportvalues();
      }
    })
  }
  //dynamically make all the form controls readonly if view
  setFormControlsReadonly(readonly: boolean): void {
    Object.keys(this.seaportForm.controls).forEach(controlName => {
      const control = this.seaportForm.get(controlName);
      
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
  setSeaportvalues(){    
    this.airportcommonID=this.getSeaportData.seaportId;
    this.countryIdValue=this.getSeaportData.countryId;
    this.stateIdValue=this.getSeaportData.stateId;
    this.cityIdValue=this.getSeaportData.cityId;
    this.portTypeIdValue=this.getSeaportData.portTypeId;
    this.seaportForm.controls['seaportCode'].setValue(this.getSeaportData.seaportCode);
    this.seaportForm.controls['seaportName'].setValue(this.getSeaportData.seaportName);
    this.seaportForm.controls['country'].setValue(this.getSeaportData);
    this.seaportForm.controls['state'].setValue(this.getSeaportData);
    this.seaportForm.controls['city'].setValue(this.getSeaportData);
    this.seaportForm.controls['porttype'].setValue(this.getSeaportData);
    this.seaportForm.controls['latitude'].setValue(this.getSeaportData.latitude);
    this.seaportForm.controls['longitude'].setValue(this.getSeaportData.longitude);
    this.seaportForm.controls['livestatus'].setValue(this.getSeaportData.livestatus); 
  }
  //#endregion
  returnToList() {
    this.router.navigate(['crm/master/seaport']);
  }
   //#region country autocomplete
   getCountryMasterListdata() {
    this.seaportmstrSvc.getCountries(this.Livestaus).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.seaportForm.controls['country'].valueChanges.pipe(
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
    this.seaportForm.controls['country'].setValue('');
    //this.countryIdValue = 0;
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;

    this.countryIdValue = selectedCountry.countryId;
    this.seaportForm.controls['state'].setValue('');
    this.cityIdValue=0;
    this.seaportForm.controls['city'].setValue('');
    this.cityIdValue=0;
    this.getStateMasterListdata();
    
    //this.getCompanyMasterListdata();
  }
  //#endregion

  //#region state autocomplete
  getStateMasterListdata() {
    this.countryIdValue;
    //let targtype = "State"
    this.seaportmstrSvc.getStatesForSelectedCountry(this.countryIdValue).subscribe(result => {
        this.StateDatalist = result;
        this.StateTypeFun();
    });
  }
  StateTypeFun() {
    this.filteredStateOptions$ = this.seaportForm.controls['state'].valueChanges.pipe(
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
    this.seaportForm.controls['state'].setValue('');
    this.stateIdValue = 0;
    return this.StateDatalist;
  }
  displayStateLabelFn(statedata: any): string {
    return statedata && statedata.stateName ? statedata.stateName : '';
  }

  clearStateNameData() {
    this.stateIdValue = 0;
   // this.companyIdValue = 0;
    this.seaportForm.controls['state'].reset();
    //this.airportForm.controls['country'].reset();
  }

  StateSelectedoption(StateData: any) {
    let selectedState = StateData.option.value;
    
    this.stateIdValue = selectedState.stateId;
    this.seaportForm.controls['city'].setValue('');
    this.cityIdValue=0;
    this.getCityMasterListdata();

  }
  //#endregion
 
  //#region city autocomplete
  getCityMasterListdata() {
    this.stateIdValue;    
    this.seaportmstrSvc.getCityForSelectedState(this.stateIdValue).subscribe((res: any) => {
        this.CityDatalist = res;
        this.CityTypeFun();        
    });
    
  }
  CityTypeFun() {
    this.filteredCityOptions$ = this.seaportForm.controls['city'].valueChanges.pipe(
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
    this.seaportForm.controls['city'].setValue('');
    this.cityIdValue = 0;
    return this.CityDatalist;
  }
  displayCityLabelFn(citydata: any): string {
    return citydata && citydata.cityName ? citydata.cityName : '';
  }
  
  clearCityNameData() {
    this.cityIdValue = 0;
    this.seaportForm.controls['city'].reset();
    
  }
  
  CitySelectedoption(CityData: any) {
    let selectedCity = CityData.option.value;
    this.cityIdValue = selectedCity.cityId;
  }
  //#endregion

  //#region port type autocomplete
  getPorttypeMasterListdata() {
    this.seaportmstrSvc.getPorttype().subscribe((res: any) => {
        this.PorttypeDatalist = res;  
        console.log(this.PorttypeDatalist);
              
        this.PortTypeFun();        
    });
    
  }
  PortTypeFun() {
    this.filteredPorttypeOptions$ = this.seaportForm.controls['porttype'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.portType)),
      map((name: any) => (name ? this.filterPorttypeFunType(name) : this.PorttypeDatalist?.slice()))
    );
    
  }
  private filterPorttypeFunType(name: string): any[] {
    const filterValue = name.toLowerCase();     
    //return this.CompanyDatalist.filter((option: any) => option.company.toLowerCase().includes(filterValue));
    const results= this.PorttypeDatalist.filter((option: any) => option.portType.toLowerCase().includes(filterValue));
    return results.length ? results : this.PorttypeNoData();
  }
  PorttypeNoData(): any {
    this.seaportForm.controls['porttype'].setValue('');
    this.portTypeIdValue = 0;
    return this.PorttypeDatalist;
  }
  displayPorttypeLabelFn(porttypedata: any): string {
    return porttypedata && porttypedata.portType ? porttypedata.portType : '';
  }
  
  clearPorttypeNameData() {
    this.portTypeIdValue = 0;
    this.seaportForm.controls['porttype'].reset();
  }
  
  PorttypeSelectedoption(PorttypeData: any) {
    let selectedPorttyppe = PorttypeData.option.value;    
    this.portTypeIdValue = selectedPorttyppe.portTypeId;    
  }
  //#endregion
  
  onSaveAirport() {    
    if(this.seaportForm.valid){
      this.seaportMasterDataModel.SeaportId=this.airportcommonID;
      this.seaportMasterDataModel.SeaportCode=this.seaportForm.controls['seaportCode'].value;
      this.seaportMasterDataModel.SeaportName =this.seaportForm.controls['seaportName'].value;
      this.seaportMasterDataModel.CityId=this.cityIdValue;
      this.seaportMasterDataModel.PortTypeId=this.portTypeIdValue;
      this.seaportMasterDataModel.Latitude=this.seaportForm.controls['latitude'].value;
      this.seaportMasterDataModel.Longitude=this.seaportForm.controls['longitude'].value;
      this.seaportMasterDataModel.Livestatus=this.seaportForm.controls['livestatus'].value?true:false;
      this.seaportMasterDataModel.CreatedBy=parseInt(this.userId$);
      this.seaportMasterDataModel.CreatedDate=new Date();
      this.seaportMasterDataModel.UpdatedBy=parseInt(this.userId$);
      this.seaportMasterDataModel.UpdatedDate=new Date();
      console.log(this.seaportMasterDataModel);
      
    
       if(this.seaportMasterDataModel.SeaportId==0){
        this.seaportmstrSvc.addSeaport(this.seaportMasterDataModel).subscribe((res) => {
          this.seaportForm.reset();
          this.seaportForm.controls['livestatus'].setValue(true);
          this.router.navigate(['crm/master/seaport']);
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
          if(stausCode === 500){
            this.errorHandler.handleError(err);
          } else if(stausCode === 400){
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        });
       }
       else{
        this.seaportmstrSvc.updateSeaport(this.seaportMasterDataModel).subscribe((res) => {
          if(res){
            this.seaportForm.reset();
            this.seaportForm.controls['livestatus'].setValue(true);
            this.router.navigate(['crm/master/seaport']);
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
          if(stausCode === 500){
            this.errorHandler.handleError(err);
          } else if(stausCode === 400){
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        });
       }
    }
    else {
      this.seaportForm.markAllAsTouched();
      return
    }
  }
  reset(form: any) {
    this.seaportStatus = true;
    this.seaportForm.reset();
    this.seaportForm = this.formbuilder.group({
      seaportId:0,
      seaportCode: ["", Validators.required],
      seaportName: ["", Validators.required],
      country: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      porttype:["",Validators.required],
      latitude: [""],
      longitude: [""],
      livestatus:true
    });
  }
}
