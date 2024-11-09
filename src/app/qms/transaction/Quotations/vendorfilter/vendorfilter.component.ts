import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { VendorfilterdialogComponent } from 'src/app/crm/transaction/RFQ/vendorfilterdialog/vendorfilterdialog.component';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { QuotationService } from '../quotation.service';
import { vendorQuotationFilterList } from '../quotation-model/quote';
import Swal from 'sweetalert2';
import { LineitemService } from 'src/app/crm/master/lineitemcategory/lineitem.service';
import { lineitem } from 'src/app/Models/crm/master/linitem';

@Component({
  selector: 'app-vendorfilter',
  templateUrl: './vendorfilter.component.html',
  styleUrls: ['./vendorfilter.component.css']
})
export class VendorfilterComponent implements OnInit {
  vendorFilter: FormGroup;
  userId$: string;
  date: any;
  country: Country[]=[];
  filteredOriginCountries: Observable<Country[]> | undefined;
  SelectedOriginCountryId: number;
  filteredvendors: vendorQuotationFilterList[]=[];
  public selectedItem: any = null;
  enable: boolean;
  LineItemcat:lineitem[]=[];
  lineitemname: any;
  lineitenId: any;
  lineitemId: any;
  constructor(private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private Country: CountriesService,
    public dialogRef: MatDialogRef<VendorfilterdialogComponent>,
    private Qs:QuotationService,
    private LS:LineitemService
  ){
this.fetchDropDownData();
  }
  ngOnInit(): void {
   this.vandorfilterForm();
   this.lineItem();
   debugger;
   this.lineitemId = this.data.lineItemId;
  }

vandorfilterForm(){
 
    this.vendorFilter = this.fb.group({
      vendorId: [''],
      potentialvendorId: [''],
      pq: [''],
      c:[''],
      countryId: [null],
      serviceTypeId: [null],
      flag: [""],
      mapped:[false],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date]
    }, { validator: this.atLeastOneSelected });
  }
  atLeastOneSelected(control: FormGroup): Validators | null {
    const vendorId = control.get('vendorId')?.value;
    const potentialvendorId = control.get('potentialvendorId')?.value;
    const pq = control.get('pq')?.value;
    const c = control.get('c')?.value;
    
    return (vendorId || potentialvendorId ) ? null : { atLeastOneSelected: true };
  }

  VendorFilter(){

    if (this.vendorFilter.valid) {
      var vendorType="";
      var filterType=null;
      var lineitem  =null;
      var pq=0;
      var serviceString;
      var vendor = this.vendorFilter.controls["vendorId"].value;
      var Pvendor = this.vendorFilter.controls["potentialvendorId"].value;
      var PQ = this.vendorFilter.controls["pq"].value;
      var C = this.vendorFilter.controls["c"].value;
      const serviceArray = this.vendorFilter.controls["serviceTypeId"].value;
      const Mapped = this.vendorFilter.controls["mapped"].value;
      if(serviceArray!=null){
        serviceString = serviceArray.join(',');
      }else{
        serviceString = null;
      }
      if(vendor==true && Pvendor==true && C==true && PQ==true){
        vendorType='B'
        filterType='B'
        if(Mapped==true){
          lineitem =this.lineitemId
        }
      }
      else if(vendor==true && Pvendor==true && PQ==true){
        vendorType='B'
        filterType='PQ'
        if(Mapped==true){
          lineitem =this.lineitemId
        }
      }
      else if(vendor==true && Pvendor==true && C==true){
        vendorType='B'
        filterType='C'
        if(Mapped==true){
          lineitem =this.lineitemId
        }
      }
      else if(vendor==true && Pvendor==true){
        vendorType='B'
        filterType=null
        lineitem =null
      }
      else if (vendor==true && PQ==true){
        vendorType='V' 
       filterType='PQ'
       if(Mapped==true){
        lineitem =this.lineitemId
      }
      }
      else if (Pvendor==true && PQ==true){
        vendorType='PV'
        filterType='PQ'
        if(Mapped==true){
          lineitem =this.lineitemId
        }
      }
      else if (vendor==true && C==true){
        vendorType='V' 
        filterType='C'  
        lineitem =this.lineitemId
      }
      else if (Pvendor==true && C==true){
        vendorType='PV'
       filterType='C'
       if(Mapped==true){
        lineitem =this.lineitemId
      }
      }
      else if(vendor==true){
        vendorType='V'
        filterType=null
        lineitem =null
        
      }
      else if (Pvendor==true){
        vendorType='PV' 
       filterType=null
       lineitem =null
      }
      
      
     
      var FilterPayload={
        ...this.vendorFilter.value,
        country:this.SelectedOriginCountryId,
        vendorType:vendorType,
        filterType:filterType,
        lineItemCategory:serviceString,
        lineitem:lineitem,
        mapped:Mapped,
      }
      this.Qs.GetFiltervendors(FilterPayload).subscribe((res=>{
       this.filteredvendors = res;
       console.log("this.filteredvendors---------->",this.filteredvendors)
      }));
  }
  // else{
  //     Swal.fire({
  //       icon: "error",
  //       title: "Please Select",
  //       text: " 1 . At 1st level select Either Vendor / Potential Vendor/ 2. At 2nd level select Either PQ / Contract",
  //       confirmButtonColor: "#007dbd",
  //       showConfirmButton: true,
  //     });
  //   }
  }
  onVendorCheckboxChange(event:any){
    if(event.checked==true){
      this.enable=true; 
    }else{
      this.enable=false;
    }
  
  }

  //#region  Line Item Category
  lineItem(){
    this.LS.GetAlllineItem(1).subscribe((res)=>{
      this.LineItemcat = res;
    })
  }
  public toggleCheckbox(dataItem: any): void {
    if (this.selectedItem === dataItem) {
      this.selectedItem = null;  // Deselect if the same item is clicked
    } else {
      this.selectedItem = dataItem;  // Select the new item
    }
  }

  public isChecked(dataItem: any): boolean {
    return this.selectedItem === dataItem;
  }

  fetchDropDownData() {
    const Country$ = this.Country.getAllCountries(1);

    forkJoin([ Country$]).subscribe({
      next: ([Country]) => {  
        this.country = Country;
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
  optionSelectedOriginCountry(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = this.country.find(
      (country) => country.countryName === event.option.viewValue
    );
    if (selectedCountry) {
      const selectedCountryId = selectedCountry.countryId;
      this.SelectedOriginCountryId = selectedCountryId;
    }
  }

  AddToList(){
    this.dialogRef.close(this.selectedItem);
  }

  Close(){
    this.dialogRef.close();
  }
}
