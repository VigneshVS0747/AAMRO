import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin, startWith, map } from 'rxjs';
import { LineitemService } from 'src/app/crm/master/lineitemcategory/lineitem.service';
import { VendorfilterdialogComponent } from 'src/app/crm/transaction/RFQ/vendorfilterdialog/vendorfilterdialog.component';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { vendorQuotationFilterList } from 'src/app/qms/transaction/Quotations/quotation-model/quote';
import { QuotationService } from 'src/app/qms/transaction/Quotations/quotation.service';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-line-vendor-filter',
  templateUrl: './line-vendor-filter.component.html',
  styleUrls: ['./line-vendor-filter.component.css']
})
export class LineVendorFilterComponent {
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
    
    return (vendorId || potentialvendorId) ? null : { atLeastOneSelected: true };
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
        PQ=1
        C=1
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
      console.log("FilterPayload---------->",FilterPayload)
      this.Qs.GetFiltervendors(FilterPayload).subscribe((res=>{
       this.filteredvendors = res;
       console.log("this.FilteredVendorList---------->",this.filteredvendors)
      }));
  }
  else{
      Swal.fire({
        icon: "error",
        title: "Please Select",
        text: "Either Vendor / Potential Vendor",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
    }
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
