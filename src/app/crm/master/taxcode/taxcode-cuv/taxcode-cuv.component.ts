import { Component } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { FormControl, NgForm } from "@angular/forms";
import { isEmptyString } from "src/app/ums/ums.util";
import Swal from "sweetalert2";
import { TaxcodeService } from "../taxcode.service";
import { TaxCode } from "../taxcode.model";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatOptionSelectionChange } from "@angular/material/core";
import { Country } from "src/app/ums/masters/countries/country.model";
import { CommonService } from "src/app/services/common.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
@Component({
  selector: 'app-taxcode-cuv',
  templateUrl: './taxcode-cuv.component.html',
  styleUrls: ['./taxcode-cuv.component.css']
})
export class TaxcodeCuvComponent {
  title: string = "New TaxCode";
  isLocal: boolean = false;
  taxcodeStatus: boolean = true;
  ShowError: boolean = false;
  disablefields: boolean = false;
  effectivedate!: Date;
  maxDate: Date | undefined;
  editedTaxCode: TaxCode | null = null;
  currentPath: string = "";
  isCreatedFlag: boolean = true; // Whether it is in Add or Edit
  private taxCodeId: number = 0;
  isInvalidDate: boolean;
  date!: Date | null;
  selectedCountryId: number;
  states: any;
  countries: Country[] = [];
  currentCountry!: string;
  currentTaxType!:string;
  filteredCountries: any[] = [];
  //filteredTaxtype:any[]=[];
  selectedCurrencyId: number = 0;
  Livestatus = 1;
  filteredTaxCode: any;
  taxcodes: TaxCode[] = [];
  // Assuming taxType is an array of objects with a taxType property
  // taxType: any = [
  //   {
  //     full: "type1",
  //     short: "T1"
  //   },
  //   {
  //     full: "type2",
  //     short: "T2"
  //   },
  //   {
  //     full: "type3",
  //     short: "T3"
  //   },
  // ];
  selectedTaxtype: string = "T1";
  
  selectedCountryControl = new FormControl(this.selectedTaxtype);
  userId$: string;

  constructor(
    private UserIdstore: Store<{ app: AppState }>,
    private taxcodeService: TaxcodeService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService,
    public route: ActivatedRoute
  ) {
    this.maxDate = new Date();
   // console.log(this.taxtype)
  }

  ngOnInit(): void {
    this.GetUserId();
    this.date = new Date();
    this.currentPath = this.router.url;
    this.commonService.getCountries(this.Livestatus).subscribe((result:any) => {
      this.countries = result;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //console.log(this.currentPath)
      /* Edit */
      if (
        this.currentPath ==
        "/ums/currencies/edit/" + paramMap.get("currencyId")
      ) {
        this.disablefields = false;
        this.title = "Update TaxCode";
        this.taxCodeId = Number(paramMap.get("currencyId"));
        //console.log(this.TaxCodeId)
        this.isCreatedFlag = false;
        this.taxcodeService
          .getTaxCode(this.taxCodeId)
          .subscribe((taxcodeData) => {
            console.log(taxcodeData)
            this.editedTaxCode = {
              taxCodeId: taxcodeData.taxCodeId,
              txCode: taxcodeData.txCode,
              taxCodeName: taxcodeData.taxCodeName,
              taxType: taxcodeData.taxType,
              taxPer: taxcodeData.taxPer,
              effectiveDate: taxcodeData.effectiveDate,
              countryId: taxcodeData.countryId,
              countryName: taxcodeData.countryName,
              livestatus: taxcodeData.livestatus,
              createdby: taxcodeData.createdby,
              createddate: taxcodeData.createdDate,
              updatedby: taxcodeData.updatedby,
              updateddate: taxcodeData.updateddate,
            };
            this.selectedCountryId = this.editedTaxCode.countryId;
            this.currentCountry = this.editedTaxCode.countryName;
            this.currentTaxType= this.editedTaxCode.taxType
            this.taxcodeStatus = this.editedTaxCode.livestatus ? true : false;
            this.date = this.editedTaxCode.effectiveDate;
           // this.selectedtaxType = this.editedTaxCode.taxType.toString();
          });
      } else {
        /* Add */
        this.disablefields = false;
        this.taxcodeStatus = true;
        this.isCreatedFlag = true;
        this.taxCodeId = 0;
      //  this.taxType = any;
        //this.date = this.editedTaxCode?.EffectiveDate;
      }
    });

    /*View*/
    this.currentPath = this.router.url;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (
        this.currentPath ==
        "/ums/currencies/view/" + paramMap.get("currencyId")
      ) {
        
        this.disablefields = true;
        this.title = "View TaxCode";
        this.taxCodeId = Number(paramMap.get("currencyId"));
        this.isCreatedFlag = false;
        this.taxcodeService
          .getTaxCode(this.taxCodeId)
          .subscribe((taxcodeData) => {
            this.editedTaxCode = {
              
              taxCodeId: taxcodeData.taxCodeId,
              txCode: taxcodeData.txCode,
              taxCodeName: taxcodeData.taxCodeName,
              taxType: taxcodeData.taxType,
              taxPer: taxcodeData.taxPer,
              effectiveDate: taxcodeData.effectiveDate,
              countryId: taxcodeData.countryId,
              countryName: taxcodeData.countryName,
              livestatus: taxcodeData.livestatus,
              createdby: taxcodeData.createdby,
              createddate: taxcodeData.createdDate,
              updatedby: taxcodeData.updatedby,
              updateddate: taxcodeData.updateddate,


              
            };
            this.selectedCountryId = this.editedTaxCode.countryId;
            this.currentCountry = this.editedTaxCode.countryName;
            this.currentTaxType= this.editedTaxCode.taxType
            this.taxcodeStatus = this.editedTaxCode.livestatus ? true : false;
            this.date = this.editedTaxCode.effectiveDate;
            //this.selectedtaxType = this.editedTaxCode.taxType.toString();
          });
      }
    });
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  valueChange($event: any) {
    //set the two-way binding here
    this.taxcodeStatus = $event.checked;
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value;
    if (event.value === null) {
      this.isInvalidDate = true;
    } else {
      this.isInvalidDate = false;
    }
  }
  onCountrySelected(event: MatOptionSelectionChange, country: Country) {
    if (event.isUserInput) {
      this.selectedCountryId = country.countryId;
    }
  }
  // istaxTypeSelected(): boolean {
  //   return (
  //     this.selectedtaxType !== undefined
  //   ); /* 1 for Warehouse and 2 for Office */
  // }
  

// doFilter(value:any){
//   if (value === '%') {
//     const filtered = this.countries.filter(
//       (country) =>
//         this.currentCountry &&
//         country.countryName
//           .toLowerCase()
//           .includes(this.currentCountry.toLowerCase())
//     );
//     if(value.length>=3) {
//     if (filtered.length > 0) {
//       this.filteredCountries = filtered;
//     } else {
//       this.selectedCountryId = 0;

//       if (this.currentCountry) {
//         // Invalid country name

//         this.filteredCountries = [
//           { countryName: "Not found", countryId: 0, isNotFound: true },
//         ];
//       } else {
//         //All country list if no input
//         this.filteredCountries = this.countries;
//       }
//     }
//   } 
// }
// }
  
  onSaveTaxCode(form: NgForm) {
   const selectedDate = this.date;
     //#region Update DOJ w.r.to the datatype\ 
      const formData = form.value;
      this.ShowError = true;
      if (form.invalid) {
        form.form.markAllAsTouched();
        return;
      }
    //  if (
    //    isEmptyString(formData.TaxCodeValue) ||
    //    isEmptyString(formData.TaxCodeName) ||
    //    isEmptyString(formData.TaxCodeType) ||
    //   isEmptyString(formData.PercentageOfTax) ||
    //   isEmptyString(formData.EffectiveDate) ||
    //   isEmptyString(formData.countryName)   
    // ) {
    //   return;
    // }
    
     let a = typeof (this.date)
     console.log(this.date)
     let adjustedDate: Date
    if (a.toString() === 'object') {
      const offset = new Date().getTimezoneOffset();
      adjustedDate = new Date(formData.date.getTime() - (offset * 60 * 1000));
       formData.EffectiveDate = (adjustedDate);
       console.log(formData.EffectiveDate)
    }
    if (a != 'object') {
      formData.EffectiveDate = this.date;
      console.log(formData.EffectiveDate)
    }
    
    //Getting user input values from Form
    //Custom logic required field
    console.log(typeof(formData.taxType))

    const taxCode: TaxCode = {
      taxCodeId: 0, // 0 for Add >0 for update
      //trim is necessary that it will remove the leading and trailing whitespaces
      txCode: formData.txCode,
      taxCodeName: formData.taxCodeName,
      taxType: formData.taxType,
      taxPer: formData.taxPer,
      effectiveDate: formData.date,
      countryId:this.selectedCountryId,//      countryId: this.selectedCountryId,
      countryName:formData.countryName,
      livestatus: this.taxcodeStatus ? true : false,
      createdby: parseInt(this.userId$),
      createddate: new Date(),
      updatedby: parseInt(this.userId$),
      updateddate: new Date(),
    };

    if (this.isCreatedFlag) {
      /* Add */
   console.log(taxCode);
      this.taxcodeService.addTaxCode(taxCode).subscribe(
        (res) => {
          form.resetForm();
          this.initializeControls();
          this.resetNavigation();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added Sucessfully",
            showConfirmButton: false,
            timer: 2000,
          });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Duplicate",
            text: error.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    } else {
      /* Update */
      taxCode.taxCodeId = this.taxCodeId;
      taxCode.updatedby=parseInt(this.userId$);
      this.taxcodeService.updateTaxCode(taxCode).subscribe(
        (res) => {
          form.resetForm();
          this.initializeControls();
          this.resetNavigation();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "updated Sucessfully",
            showConfirmButton: false,
            timer: 2000,
          });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: JSON.stringify(error),
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    }
  }

  resetNavigation() {
    if (this.currentPath.includes("/ums/currency")) {
      this.router.navigate(["/ums/currencies"]);
    }
  }

  initializeControls() {
    
    this.taxcodeStatus = true;
    this.isInvalidDate = false;
    this.ShowError = false;
    this.date = null;
  }
  resetButtonClickforSave(form: NgForm) {
    form.resetForm();
    this.initializeControls();

  }
  resetButtonClick() {
    this.editedTaxCode = {
      taxCodeId: 0,
      txCode: "",
      taxCodeName: "",
      taxType: "",
      taxPer: "",
      effectiveDate: null,
      countryId: 0,
      countryName: "",
      livestatus: true,
      createdby: parseInt(this.userId$),
      createddate: "",
      updatedby: parseInt(this.userId$),
      updateddate: "",
      
    };
    this.taxcodeService
      .getTaxCode(this.taxCodeId)
      .subscribe((taxcodeData) => {
        this.editedTaxCode = {
          taxCodeId: taxcodeData.taxCodeId,
          txCode: taxcodeData.txCode,
          taxCodeName: taxcodeData.taxCodeName,
          taxType: taxcodeData.taxType,
          taxPer: taxcodeData.taxPer,
          effectiveDate: taxcodeData.effectiveDate,
              countryId: taxcodeData.countryId,
              countryName: taxcodeData.countryName,
              livestatus: taxcodeData.livestatus,
              createdby: taxcodeData.createdby,
              createddate: taxcodeData.createdDate,
              updatedby: taxcodeData.updatedby,
              updateddate: taxcodeData.updateddate,
        };
        this.selectedCountryId = this.editedTaxCode.countryId;
        this.currentCountry = this.editedTaxCode.countryName;
        this.currentTaxType= this.editedTaxCode.taxType
        this.taxcodeStatus = this.editedTaxCode.livestatus ? true : false;
        this.date = this.editedTaxCode.effectiveDate;
       // this.selectedtaxType = this.editedTaxCode.taxType.toString();

      });
  }

  returnToList() {
    this.router.navigate(["/ums/currencies"]);
  }

  onKeydown($event: any) {
    // filter away which is not numbers,apace, hyphen,+
    let unallowableValues: Array<string | number> = [ "~" ,"`",
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "|",
      "{",
      "}",
      "[",
      "]",
      ";",
      ":",
      "<",
      ">",
      ",",
     // ".",
      222,
      191,
      220,
    ];
    unallowableValues.forEach((data: any) => {
      if ($event.keyCode == data || $event.key == data) {
        $event.preventDefault();
      }
    });
    if (
      ($event.keyCode >= 65 && $event.keyCode <= 90) ||
      ($event.keyCode == 187)
    ) {
      $event.preventDefault();
    }
  }
  
  // doFilter(value: number) {
  //   debugger
  //   // Check if the entered value exists in the list of countries
  //   if (value === 1) {
  //     const filtered = this.countries.filter(
  //       (country) =>
  //         this.currentCountry &&
  //         country.countryName
  //           .toLowerCase()
  //           .includes(this.currentCountry.toLowerCase())
  //     );

  //     if (filtered.length > 3) {
  //       this.filteredCountries = filtered;
  //     } else {
  //       this.selectedCountryId = 0;

  //       if (this.currentCountry) {
  //         // Invalid country name

  //         this.filteredCountries = [
  //           { countryName: "Not found", countryId: 0, isNotFound: true },
  //         ];
  //       } else {
  //         //All country list if no input
  //         this.filteredCountries = this.countries;
  //       }
  //     }
    
  //   }
  // }

  filter(value: any) {
    if(value==='%'){
      this.filteredCountries = this.countries;
    }
      if(value.length>=3) {
      // Check if the entered value exists in the list of cities
      const filtered = this.countries.filter(
        (countries) =>
          this.currentCountry &&
          countries.countryName
            .toLowerCase()
            .includes(this.currentCountry.toLowerCase())
      );
      if (filtered.length > 0) {
        this.filteredCountries = filtered;
      } else {
        this.selectedCurrencyId = 0;
        if (this.currentCountry) {
          // Invalid state name
          this.filteredCountries = [
            { currencyName: "Not found", CurrencyId: 0, isNotFound: true },
          ];
        } //All city list if no input
        else {
          this.filteredCountries = this.countries;
        }
      }
    }
    if((value.length<3||!value)&& value!='%'){
      this.filteredCountries=[]
    }
  }
  
  // filterTaxtype(value:any){
  //   if(value==='%'){
  //     this.filteredTaxtype = this.taxType;
  //   }
  // }
  // onTaxtypeSelected(event: MatOptionSelectionChange, value: any){
  //   if (event.isUserInput) {
  //     console.log(event.isUserInput);
      
  //   }
  // }
}
