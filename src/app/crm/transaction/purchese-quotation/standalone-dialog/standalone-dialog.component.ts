import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { Vendor } from 'src/app/Models/crm/master/Vendor';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor-service';
import { PotentialVendor } from 'src/app/crm/master/potential-vendor/potential-vendor.model';
import { ServiceTypeServiceService } from 'src/app/crm/master/servicetype/service-type-service.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { CommonService } from 'src/app/services/common.service';
import { Country } from 'src/app/ums/masters/countries/country.model';

@Component({
  selector: 'app-standalone-dialog',
  templateUrl: './standalone-dialog.component.html',
  styleUrls: ['./standalone-dialog.component.css']
})
export class StandaloneDialogComponent {
  filterForm: FormGroup;
  countryIdValue: any;
  CountryDatalist:Country[];
  liveStatus = 1;
  filteredCountryOptions$: Observable<any[]>;
  vendorCheck: boolean =false;
  potentialVendorCheck: boolean =false;
  bothCheck: boolean =false;
  serviceTypeList: ServiceType[];
  filteredServiceTypeListOptions$: Observable<any[]>;
  serviceTypeId: any;
  vendorList:Vendor[]=[];
  potentialVendorList: PotentialVendor[]=[];
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialog: MatDialog,
    private serviceTypeService: ServiceTypeServiceService,
    private potentialVendorService: PotentialVendorService,
    private vendorService: VendorService,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StandaloneDialogComponent>
  ) { dialogRef.disableClose = true; }

  ngOnInit() {
    this.iniForm();
    this.getCountryMasterListdata();
    this.GetAllServiceType();
  }
  iniForm() {
    this.filterForm = this.fb.group({
      vendor: [false],
      potentialVendor: [false],
      both: [false],
      countryId: [0],
      serviceType:[[]]
    });
  }

  Filter() {
    debugger
    if(this.vendorCheck==true && this.potentialVendorCheck==true)
    {
      this.getVendorItems();
      this.getAllPotentialVendor();

    }else if(this.vendorCheck==true){
       this.getVendorItems();
    }
    else
    {
      this.getAllPotentialVendor();
    }
  }
  Close() {
    this.dialogRef.close();
  }
  //#region country autocomplete
  getCountryMasterListdata() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.filterForm.controls['countryId'].valueChanges.pipe(
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
    this.filterForm.controls['countryId'].setValue('');
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.countryIdValue = selectedCountry.countryId;
  }

 
  //#endregion Get All Service Type
  GetAllServiceType() {
    this.serviceTypeService.GetAllServiceType(this.liveStatus).subscribe(res => {
      this.serviceTypeList = res;
      this.ServiceTypeFun();
    })
  }
  ServiceTypeFun() {
    this.filteredServiceTypeListOptions$ = this.filterForm.controls['serviceType'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.serviceTypeName)),
      map((name: any) => (name ? this.filteredServiceTypeListOptions(name) : this.serviceTypeList?.slice()))
    );
  }
  private filteredServiceTypeListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.serviceTypeList.filter((option: any) => option.serviceTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataServiceType();
  }
  NoDataServiceType(): any {
    this.filterForm.controls['serviceType'].setValue('');
    return this.serviceTypeList;
  }
  displayServiceTypeListLabelFn(data: any): string {
    return data && data.serviceTypeName ? data.serviceTypeName : '';
  }
  ServiceTypeListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.serviceTypeId = selectedValue.serviceTypeId;
  }
  //#endregion

  vendor(event: any) {
    const isChecked: boolean = event.target.checked;
    if (isChecked) {
      this.vendorCheck = true;
    }
    else {
      this.vendorCheck = false;
      this.bothCheck=false;
      this.filterForm.controls['both'].setValue(false)
    }
   if(this.vendorCheck && this.potentialVendorCheck)
    {
      this.bothCheck=true;
      this.filterForm.controls['both'].setValue(true)
    }
  }
  potentialVendor(event:any) {
    const isChecked: boolean = event.target.checked;
    if (isChecked)
    {
      this.potentialVendorCheck=true;
    } 
    else{
      this.potentialVendorCheck=false;
      this.bothCheck=false;
      this.filterForm.controls['both'].setValue(false)
    }
    if(this.vendorCheck && this.potentialVendorCheck)
    {
      this.bothCheck=true;
      this.filterForm.controls['both'].setValue(true)
    }
  }
  both(event:any) {
    const isChecked: boolean = event.target.checked;
    if (isChecked)
    {
      this.bothCheck=true;
      this.filterForm.controls['vendor'].setValue(true)
      this.filterForm.controls['potentialVendor'].setValue(true)
      this.vendorCheck = true;
      this.potentialVendorCheck=true;

    }else{
      this.bothCheck=false;
      this.filterForm.controls['vendor'].setValue(false)
      this.filterForm.controls['potentialVendor'].setValue(false)
      this.potentialVendorCheck=false;
      this.vendorCheck = false;
    }
  }

  getVendorItems() {
    this.vendorService.getAllVendor().subscribe(result => {
    this.vendorList = result;
    this.dialogRef.close(this.vendorList);
    })
  }
  getAllPotentialVendor()
  {
    this.potentialVendorService.getAllActivePotentialVendor().subscribe(result => {
    this.potentialVendorList = result;
    this.dialogRef.close(this.potentialVendorList);
    });
  }
  
}
