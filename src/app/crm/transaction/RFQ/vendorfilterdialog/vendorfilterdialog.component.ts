import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { packagetypeService } from 'src/app/crm/master/packagetype/packagetype.service';
import { ServiceTypeServiceService } from 'src/app/crm/master/servicetype/service-type-service.service';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { RfqService } from '../rfq.service';
import { VendorAddressList, VendorContactList, vendorfilterList } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { RfqvendorcontactdialogComponent } from '../rfqvendorcontactdialog/rfqvendorcontactdialog.component';
import { RfqaddressdialogComponent } from '../rfqaddressdialog/rfqaddressdialog.component';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { LineitemService } from 'src/app/crm/master/lineitemcategory/lineitem.service';
import { lineitem } from 'src/app/Models/crm/master/linitem';

@Component({
  selector: 'app-vendorfilterdialog',
  templateUrl: './vendorfilterdialog.component.html',
  styleUrls: ['./vendorfilterdialog.component.css']
})
export class VendorfilterdialogComponent implements OnInit {

  vendorFilter:FormGroup;
  SelectedOriginCountryId: any;
  potentialvendor: string = 'Potential Vendor';

  filteredOriginCountries: Observable<Country[]> | undefined;
  country: Country[]=[];
  Livestatus=1;
  serviceTypeList:ServiceType[]=[];
  date: any;
  FilteredVendorList:vendorfilterList[]=[];
  vendorcontactlist: VendorContactList[]=[];
  vendorAddresslist: VendorAddressList[]=[];
  indexofcontact: number;
  vendorcontactFilterByIndex: any[]=[];
  indexofAddress: number;
  vendorAddressFilterByIndex: any[]=[];
  Activevendors: vendorfilterList[]=[];
  vendorEditList: vendorfilterList[]=[];
  userId$: string;
  LineItemcat:lineitem[]=[];
  serviceArray: any;

  constructor(private fb:FormBuilder,
    public dialog: MatDialog,
    private commodityService: CommodityService,
    private packagetypeServices: packagetypeService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private Country: CountriesService,
    private serviceTypeService: ServiceTypeServiceService,
    private RFQS:RfqService,
    public dialogRef: MatDialogRef<VendorfilterdialogComponent>,
    private LS:LineitemService
    ){
      this.fetchDropDownData();
    
  }

 
  ngOnInit(): void {
    this.GetUserId();
    this.vandorfilterForm();
    this.vendorEditList=this.data.Dataarray;
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  vandorfilterForm(){
 
    this.vendorFilter = this.fb.group({
      vendorId: [''],
      potentialvendorId: [''],
      countryId: [null],
      serviceTypeId: [null],
      flag: [""],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date]
    }, { validator: this.atLeastOneSelected });
  }
  atLeastOneSelected(control: FormGroup): Validators | null {
    const vendorId = control.get('vendorId')?.value;
    const potentialvendorId = control.get('potentialvendorId')?.value;
    
    return (vendorId || potentialvendorId) ? null : { atLeastOneSelected: true };
  }

  VendorFilter(){
debugger
    if (this.vendorFilter.valid) {
      var flag="";
      var serviceString;
      var vendor = this.vendorFilter.controls["vendorId"].value;
      var Pvendor = this.vendorFilter.controls["potentialvendorId"].value;
      this.serviceArray = this.vendorFilter.controls["serviceTypeId"].value;
      if(this.serviceArray==""){
        this.serviceArray =null;
      }
      if(this.serviceArray!=null){
        serviceString = this.serviceArray.join(',');
      }else{
        serviceString = null;
      }
      if(vendor==true && Pvendor==true){
        flag="B"
      }else if(vendor==true){
        flag="V"
      }
      else if (Pvendor==true){
        flag="PV"
      }
      var FilterPayload={
        ...this.vendorFilter.value,
        countryId:this.SelectedOriginCountryId,
        flag:flag,
        serviceTypeId:serviceString
      }
  
     this.RFQS.GetFiltervendors(FilterPayload).subscribe((res)=>{
     this.FilteredVendorList = res;
     console.log("this.FilteredVendorList---------->",this.FilteredVendorList)
     });
    }else{
      Swal.fire({
        icon: "error",
        title: "Please Select",
        text: "Either Vendor / Potential Vendor",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
    }

    

  }

  optionSelectedOriginCountry(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = this.country.find(
      (country) => country.countryName === event.option.viewValue
    );
    if (selectedCountry) {
      const selectedCountryId = selectedCountry.countryId;
      this.SelectedOriginCountryId = selectedCountryId;
    }
  }

  fetchDropDownData() {
    const Country$ = this.Country.getAllCountries(this.Livestatus);
    const Sservice$ = this.serviceTypeService.GetAllServiceType(this.Livestatus);
    const Lineitem$ = this.LS.GetAlllineItem(1);

    forkJoin([ Country$,Sservice$,Lineitem$]).subscribe({
      next: ([Country,Sservice,Lineitem]) => {  
        this.country = Country;
        this.serviceTypeList = Sservice;
        this.LineItemcat = Lineitem;
        console.log(" this.LineItemcat==>",  this.LineItemcat);
        this.Filters();
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  Filters(){
    this.filteredOriginCountries = this.vendorFilter.get('countryId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this._filterOriginCountries(name) : this.country?.slice()))
    );
  }

  private _filterOriginCountries(value: string): Country[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.country.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.vendorFilter.controls["countryId"].setValue("");
    }

    return filterresult;
  }

  toggleCheckbox(i:number,Vid:number,event:any){
      const exists = this.vendorEditList.some(item => item.vendorId === Vid);
      if (exists) {
        this.FilteredVendorList[i].active = this.FilteredVendorList[i].active=false;
        this.FilteredVendorList=[...this.FilteredVendorList];
        Swal.fire({
          icon: "error",
          title: "Duplicate",
          text: "Selected Potential vendor/ Vendor is already added in the list",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.FilteredVendorList[i].active=false;
            this.FilteredVendorList =[... this.FilteredVendorList];
          }
        });
      }else{
        this.FilteredVendorList[i].active = this.FilteredVendorList[i].active ? false : true;
        this.FilteredVendorList[i].createdBy =1;
        this.FilteredVendorList[i].updatedBy =1;
      } 
  }

  AddtoList(){
    //this.Activevendors = this.FilteredVendorList;
    this.Activevendors = this.FilteredVendorList.filter(item => item.active === true);
    if(this.Activevendors.length>0){
      const Filtervendors ={
        activevendors:this.Activevendors,
        //activecontacts:this.vendorcontactFilterByIndex,
        //activeaddress:this.vendorAddressFilterByIndex
      }
      this.dialogRef.close(Filtervendors);
    }else{
      Swal.fire({
        icon:"warning",
        title: "Select",
        text: "Please select vendors",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
    }
   
  }
  CEmpty() {
    this.SelectedOriginCountryId = null;
    //this.vendorFilter.controls['countryId'].setValue('');
  }

  Close(){
    this.dialogRef.close();
  }
}
