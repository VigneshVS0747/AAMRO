import { Component, Inject } from '@angular/core';
import { Observable, map, startWith } from 'rxjs';
import { City } from 'src/app/Models/ums/city.model';
import { CommonService } from 'src/app/services/common.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { State } from 'src/app/ums/masters/states/state.model';
import { AddressCrudService } from '../../address/address-crud.service';
import { AddressType } from 'src/app/Models/crm/master/AddresssType';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerAddress } from '../customer.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';

@Component({
  selector: 'app-c-address-dialog',
  templateUrl: './c-address-dialog.component.html',
  styleUrls: ['./c-address-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class CAddressDialogComponent {
  AddressForm: FormGroup

  CountryDatalist: Country[] = [];
  filteredCountryOptions$: Observable<any[]>;
  countryIdValue: number;

  StateDatalist: State[] = [];
  filteredStateOptions$: Observable<any[]>;
  stateIdValue: number;
  CityDatalist: City[] = [];
  filteredCityOptions$: Observable<any[]>;
  cityIdValue: number;
  liveStatus = 1;
  stateName: any;
  countryName: any;
  AddressList: AddressType[] = [];
  filteredAddressOptions$: Observable<any[]>;
  addressTypeId: any;
  addresstypeName: any;
  cityName: any;
  exists: any;
  customerAddress: CustomerAddress[] = [];
  existAddress: boolean;
  date = new Date;
  editedContact: CustomerAddress[];
  viewMode: boolean;
  userId$: string;

  constructor(private fb: FormBuilder,
    private commonService: CommonService,
    private addressCrudService: AddressCrudService,
    private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CAddressDialogComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.GetUserId();
    this.iniForm();
    this.customerAddress = this.data.list;
    this.getCountryMasterListdata();
    this.getAddresstype();
    this.editMode();
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  restrictInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9()+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  iniForm() {
    this.AddressForm = this.fb.group({
      cAddressId: [0],
      customerId: [0],
      addressName: ['', Validators.required],
      addressTypeId: ['', Validators.required],
      countryId: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      phoneNumber: ['', Validators.required],
      primaryAddress: [false],
      liveStatus: [true],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date],
    });
  }

  AddtoAddressList() {
    debugger
    if (this.AddressForm.valid) {
      const AddressDetail: CustomerAddress = {
        ...this.AddressForm.value,
        addressTypeId: this.addressTypeId,
        countryId: this.countryIdValue,
        stateId: this.stateIdValue,
        cityId: this.cityIdValue,
        addresstypeName: this.addresstypeName,
        countryName: this.countryName,
        stateName: this.stateName,
        cityName: this.cityName,
      }
      AddressDetail.updatedBy = parseInt(this.userId$);
      const primary = this.AddressForm.controls['primaryAddress'].value;
      //this.exists = this.customerAddress.some(item => item.primaryAddress == primary);
      this.customerAddress.forEach(x => {
        if (x.primaryAddress == true && x.primaryAddress == primary) {
          this.exists = true;
        }
      });
      if (this.exists) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Primary address already added...!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        });
        this.exists = false;
        this.AddressForm.controls['primaryAddress'].setValue(false);
        return;
      }
      const addressName = this.AddressForm.controls['addressName'].value;
      this.existAddress = this.customerAddress.some(item => item.addressName == addressName);
      if (this.existAddress) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: " Contact Person already exist!",
          showConfirmButton: true,
        });
        this.existAddress = false;
        return
      }
      //first address added will be the primary address 
      if (this.customerAddress.length == 0) {
        AddressDetail.primaryAddress = true;
      }
      this.dialogRef.close(AddressDetail);
      this.AddressForm.reset();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.AddressForm.markAllAsTouched();
      this.validateall(this.AddressForm);
    }

  }
  private validateall(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateall(control);
      }
    });
  }
  editMode() {
    debugger
    if (this.data.mode == 'Edit') {
      this.AddressForm.patchValue(this.data.addressDate);
      this.addressTypeId = this.data.addressDate.addressTypeId;
      this.countryIdValue = this.data.addressDate.countryId;
      this.stateIdValue = this.data.addressDate.stateId;
      this.cityIdValue = this.data.addressDate.cityId;

      this.AddressForm.controls['addressTypeId'].setValue(this.data.addressDate);
      this.AddressForm.controls['countryId'].setValue(this.data.addressDate);
      this.AddressForm.controls['stateId'].setValue(this.data.addressDate);
      this.AddressForm.controls['cityId'].setValue(this.data.addressDate);

      this.addresstypeName = this.data.addressDate.addresstypeName
      this.countryName = this.data.addressDate.countryName
      this.stateName = this.data.addressDate.stateName
      this.cityName = this.data.addressDate.cityName
      
      this.commonService.getStatesForSelectedCountry(this.countryIdValue).subscribe(result => {
        this.StateDatalist = result;
        this.StateTypeFun();
      });
      
        this.commonService.getCityForSelectedState(this.stateIdValue).subscribe((res: any) => {
          this.CityDatalist = res;
          this.CityTypeFun();
        });

    }
    else if (this.data.mode == 'View') {
      this.AddressForm.disable();
      this.viewMode = true;
      this.AddressForm.patchValue(this.data.addressDate);
      this.addressTypeId = this.data.addressDate.addressTypeId;
      this.countryIdValue = this.data.addressDate.countryId;
      this.stateIdValue = this.data.addressDate.stateId;
      this.cityIdValue = this.data.addressDate.cityId;

      this.AddressForm.controls['addressTypeId'].setValue(this.data.addressDate);
      this.AddressForm.controls['countryId'].setValue(this.data.addressDate);
      this.AddressForm.controls['stateId'].setValue(this.data.addressDate);
      this.AddressForm.controls['cityId'].setValue(this.data.addressDate);

      this.addresstypeName = this.data.addressDate.addresstypeName
      this.countryName = this.data.addressDate.countryName
      this.stateName = this.data.addressDate.stateName
      this.cityName = this.data.addressDate.cityName

    }
  }
  Close() {
    this.dialogRef.close();
    this.AddressForm.reset();
  }
  //Dropdown
  //#region country autocomplete
  getAddresstype() {
    this.addressCrudService.GetAllActiveAddressType().subscribe(result => {
      this.AddressList = result;
      this.AddressFun();
    });
  }

  AddressFun() {
    this.filteredAddressOptions$ = this.AddressForm.controls['addressTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.addresstypeName)),
      map((name: any) => (name ? this.filteredAddressOptions(name) : this.AddressList?.slice()))
    );
  }
  private filteredAddressOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.AddressList.filter((option: any) => option.addresstypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataAddress();
  }
  NoDataAddress(): any {
    this.AddressForm.controls['addressTypeId'].setValue('');
    return this.AddressList;
  }
  displayAddressLabelFn(data: any): string {
    return data && data.addresstypeName ? data.addresstypeName : '';
  }
  AddressSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.addressTypeId = selectedValue.addresstypeId;
    this.addresstypeName = selectedValue.addresstypeName;
  }

  //#endregion


  //#region country autocomplete
  getCountryMasterListdata() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.AddressForm.controls['countryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this.filterCountryFunType(name) : this.CountryDatalist?.slice()))
    );
  }
  private filterCountryFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CountryDatalist.filter((option: any) => option.countryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoData();
  }
  NoData(): any {
    this.AddressForm.controls['countryId'].setValue('');
    //this.countryIdValue = 0;
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.countryIdValue = selectedCountry.countryId;
    this.countryName = selectedCountry.countryName;
    this.getStateMasterListdata();
    this.StateNoData()
    this.CityNoData();

    //this.getCompanyMasterListdata();
  }
  //#endregion

  //#region state autocomplete
  getStateMasterListdata() {
    debugger
    this.countryIdValue;
    //let targtype = "State"
    this.commonService.getStatesForSelectedCountry(this.countryIdValue).subscribe(result => {
      this.StateDatalist = result;
      this.StateTypeFun();
    });
  }
  StateTypeFun() {
    this.filteredStateOptions$ = this.AddressForm.controls['stateId'].valueChanges.pipe(
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
    this.AddressForm.controls['stateId'].setValue('');
    this.stateIdValue = 0;
    return this.StateDatalist;
  }
  displayStateLabelFn(statedata: any): string {
    return statedata && statedata.stateName ? statedata.stateName : '';
  }

  clearStateNameData() {
    this.stateIdValue = 0;
    // this.companyIdValue = 0;
    this.AddressForm.controls['stateId'].reset();
    this.AddressForm.controls['cityId'].reset();
  }

  StateSelectedoption(StateData: any) {
    let selectedState = StateData.option.value;
    this.stateIdValue = selectedState.stateId;
    this.stateName = selectedState.stateName;

    this.CityNoData();
    this.getCityMasterListdata()
  }
  //#endregion

  //#region city autocomplete
  getCityMasterListdata() {
    this.stateIdValue;
    this.commonService.getCityForSelectedState(this.stateIdValue).subscribe((res: any) => {
      this.CityDatalist = res;
      this.CityTypeFun();
    });

  }
  CityTypeFun() {
    this.filteredCityOptions$ = this.AddressForm.controls['cityId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this.filterCityFunType(name) : this.CityDatalist?.slice()))
    );

  }
  private filterCityFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    //return this.CompanyDatalist.filter((option: any) => option.company.toLowerCase().includes(filterValue));
    const results = this.CityDatalist.filter((option: any) => option.cityName.toLowerCase().includes(filterValue));
    return results.length ? results : this.CityNoData();
  }
  CityNoData(): any {
    this.AddressForm.controls['cityId'].setValue('');
    this.cityIdValue = 0;
    return this.CityDatalist;
  }
  displayCityLabelFn(citydata: any): string {
    return citydata && citydata.cityName ? citydata.cityName : '';
  }

  clearCityNameData() {
    this.cityIdValue = 0;
    this.AddressForm.controls['cityId'].reset();

  }

  CitySelectedoption(CityData: any) {
    let selectedCity = CityData.option.value;
    this.cityIdValue = selectedCity.cityId;
    this.cityName = selectedCity.cityName;

  }
  //#endregion
}
