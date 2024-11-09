import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { City } from "src/app/Models/ums/city.model";
import { Currency } from "src/app/ums/masters/currencies/currency.model";
import { Branch } from "../branch.model";

import { NotificationService } from "src/app/services/notification.service";
import { NgForm } from "@angular/forms";
import { BranchService } from "../branch.service";
import { State } from "src/app/ums/masters/states/state.model";
import { Country } from "src/app/ums/masters/countries/country.model";
import { CommonService } from "src/app/services/common.service";
import { MatOptionSelectionChange } from "@angular/material/core";
import { isEmptyString } from "src/app/ums/ums.util";

import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { StatesService } from "../../states/states.service";
import { CitiesService } from "../../cities/cities.service";

@Component({
  selector: "app-branch-create",
  templateUrl: "./branch-create.component.html",
  styleUrls: ["./branch-create.component.css", "../../../ums.styles.css"],
})
export class BranchCreateComponent implements OnInit {
  isSubmitted: boolean = false;
  selectedBranchType!: string;
  title: string = "New Branch";
  branchStatus: boolean = true;

  currentCity!: string;
  cities: City[] = [];
  selectedCityId: number = 0;
  filteredCities: any[] = [];
  Livestaus = 1;

  currentState!: string;
  states: State[] = [];
  selectedStateId: number = 0;
  filteredStates: any[] = [];
  disablefields: boolean = false;

  currentCountry!: string;
  countries: Country[] = [];
  selectedCountryId: number = 0;
  filteredCountries: any[] = [];

  currentCurrency!: string;
  currencies: Currency[] = [];
  selectedCurrencyId: number = 0;
  filteredCurrencies: any[] = [];

  editedBranch: Branch | null = null;
  currentPath: string = "";
  isCreatedFlag: boolean = true; // Whether it is in Add or Edit
  private branchId: number = 0;
  aliasName: any;
  branchName: any;
  userId$:string;
  allcurrencies: Currency[];
  allstates: State[];
  allcountries: Country[];
  allCities: City[];

  @ViewChild('input2') input2: ElementRef<HTMLInputElement>;
  form: NgForm;

  constructor(
    private branchService: BranchService,
    private commonService: CommonService,
    private Cs:CitiesService,
    private Ss:StatesService,
    private notificationService: NotificationService,
    private router: Router,
    public route: ActivatedRoute,
    private UserIdstore: Store<{ app: AppState }>
  ) {}

  ngOnInit(): void {

    this.GetUserId();
    //this.commonService.getCountries(this.Livestaus);
    this.commonService.getCountries(this.Livestaus).subscribe((result) => {
      this.countries = result;
      this.doFilter(1);
    });

    this.commonService.getCountries(0).subscribe((result) => {
      this.allcountries = result;
      this.doFilter(1);
    });

    this.commonService.getCurrencies(this.Livestaus).subscribe((result) => {
      this.currencies = result;
      this.doFilter(4);
    });

    this.commonService.getCurrencies(0).subscribe((result) => {
      this.allcurrencies = result;
      this.doFilter(4);
    });

    this.Ss.getStates(0).subscribe((result) => {
      this.allstates = result;
      this.doFilter(2);
    });
    this.Cs.getCities(0).subscribe((result) => {
      this.allCities= result;
      this.doFilter(2);
    });

    this.currentPath = this.router.url;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      /* Edit */
      if (
        this.currentPath ==
        "/ums/master/branches/edit/" + paramMap.get("branchId")
      ) {
        this.disablefields = false;
        this.title = "Update Branch";
        this.branchId = Number(paramMap.get("branchId"));

        this.isCreatedFlag = false;
        this.branchService.getBranch(this.branchId).subscribe((branchData) => {
          this.editedBranch = branchData;
          this.selectedBranchType = this.editedBranch.branchType.toString();

          this.selectedCountryId = this.editedBranch.countryId;
          this.currentCountry = this.editedBranch.countryName;
          this.commonService
            .getStatesForSelectedCountry(this.selectedCountryId)
            .subscribe((result) => {
              this.states = result;
              this.doFilter(2);
            });
          this.selectedStateId = this.editedBranch.stateId;
          this.currentState = this.editedBranch.stateName;
          this.commonService
            .getCityForSelectedState(this.selectedStateId)
            .subscribe((result) => {
              this.cities = result;
              this.doFilter(3);
            });
          this.selectedCityId = this.editedBranch.cityId;
          this.currentCity = this.editedBranch.cityName;
          this.selectedCurrencyId = this.editedBranch.currencyId;
          this.currentCurrency = this.editedBranch.currencyName;
          this.branchStatus = this.editedBranch.livestatus ? true : false;
        });
      } else {
        /* Add */
        this.disablefields = false;
        this.branchStatus = true;
        this.isCreatedFlag = true;
        this.branchId = 0;
      }
    });

    /*View*/
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (
        this.currentPath ==
        "/ums/master/branches/view/" + paramMap.get("branchId")
      ) {
        this.disablefields = true;
        this.title = "View Branch";
        this.branchId = Number(paramMap.get("branchId"));

        this.isCreatedFlag = false;
        this.branchService.getBranch(this.branchId).subscribe((branchData) => {
          this.editedBranch = branchData;
          this.selectedBranchType = this.editedBranch.branchType.toString();

          this.selectedCountryId = this.editedBranch.countryId;
          this.currentCountry = this.editedBranch.countryName;
          this.commonService
            .getStatesForSelectedCountry(this.selectedCountryId)
            .subscribe((result) => {
              this.states = result;
            });
          this.selectedStateId = this.editedBranch.stateId;
          this.currentState = this.editedBranch.stateName;
          this.commonService
            .getCityForSelectedState(this.selectedStateId)
            .subscribe((result) => {
              this.cities = result;
            });
          this.selectedCityId = this.editedBranch.cityId;
          this.currentCity = this.editedBranch.cityName;
          this.selectedCurrencyId = this.editedBranch.currencyId;
          this.currentCurrency = this.editedBranch.currencyName;
          this.branchStatus = this.editedBranch.livestatus ? true : false;
        });
      }
    });
  }
  GetUserId(){  
    this.UserIdstore.select("app").subscribe({
      next:(res)=>{
       this.userId$=res.userId;
      }
    });
  }

  valueChange($event: any) {
    //set the two-way binding here
    this.branchStatus = $event.checked;
  }

  isBranchTypeSelected(): boolean {
    return (
      this.selectedBranchType !== undefined
    ); /* 1 for Warehouse and 2 for Office */
  }

  doFilter(value: number) {
    // Check if the entered value exists in the list of countries
    if (value === 1) {
      const filtered = this.countries.filter(
        (country) =>
          this.currentCountry &&
          country.countryName
            .toLowerCase()
            .includes(this.currentCountry.toLowerCase())
      );

      if (filtered.length > 0) {
        this.filteredCountries = filtered;
      } else {
        this.selectedCountryId = 0;

        if (this.currentCountry) {
          // Invalid country name

          this.filteredCountries = [
            { countryName: "Not found", countryId: 0, isNotFound: true },
          ];
        } else {
          //All country list if no input
          this.filteredCountries = this.countries;
        }
      }
    } else if (value === 2) {
      // Check if the entered value exists in the list of states
      const filtered = this.states.filter(
        (state) =>
          this.currentState &&
          state.stateName
            .toLowerCase()
            .includes(this.currentState.toLowerCase())
      );

      if (filtered.length > 0) {
        this.filteredStates = filtered;
      } else {
        this.selectedStateId = 0;

        if (this.currentState) {
          // Invalid state name

          this.filteredStates = [
            { stateName: "Not found", stateId: 0, isNotFound: true },
          ];
        } //All state list if no input
        else {
          this.filteredStates = this.states;
        }
      }
    } else if (value === 3) {
      // Check if the entered value exists in the list of cities
      const filtered = this.cities.filter(
        (city) =>
          this.currentCity &&
          city.cityName.toLowerCase().includes(this.currentCity.toLowerCase())
      );

      if (filtered.length > 0) {
        this.filteredCities = filtered;
      } else {
        this.selectedCityId = 0;

        if (this.currentCity) {
          // Invalid state name

          this.filteredCities = [
            { cityName: "Not found", cityId: 0, isNotFound: true },
          ];
        } //All city list if no input
        else {
          this.filteredCities = this.cities;
        }
      }
    } else if (value === 4) {
      // Check if the entered value exists in the list of cities
      const filtered = this.currencies.filter(
        (currency) =>
          this.currentCurrency &&
          currency.currencyName
            .toLowerCase()
            .includes(this.currentCurrency.toLowerCase())
      );

      if (filtered.length > 0) {
        this.filteredCurrencies = filtered;
      } else {
        this.selectedCurrencyId = 0;

        if (this.currentCity) {
          // Invalid state name

          this.filteredCurrencies = [
            { currencyName: "Not found", CurrencyId: 0, isNotFound: true },
          ];
        } //All city list if no input
        else {
          this.filteredCurrencies = this.currencies;
        }
      }
    }
  }

  onCountrySelected(event: MatOptionSelectionChange, country: Country) {
    if (event.isUserInput) {
      this.selectedCountryId = country.countryId;
      this.commonService
        .getStatesForSelectedCountry(this.selectedCountryId)
        .subscribe((result) => {
          this.states = result;
          this.doFilter(2);
        });
      //Reset the values
      this.selectedStateId = 0;
      this.currentState = "";
      this.filteredStates = [];
    }
  }

  onStateSelected(event: MatOptionSelectionChange, state: State) {
    if (event.isUserInput) {
      this.selectedStateId = state.stateId;
      this.commonService
        .getCityForSelectedState(this.selectedStateId)
        .subscribe((result) => {
          this.cities = result;
         this.doFilter(3);
        });
      //Reset the values
      this.selectedCityId = 0;
      this.currentCity = "";
      this.filteredCities = [];
    }
  }

  onCitySelected(event: MatOptionSelectionChange, city: City) {
    if (event.isUserInput) {
      this.selectedCityId = city.cityId;
    }
  }

  onCurrencySelected(event: MatOptionSelectionChange, currency: Currency) {
    if (event.isUserInput) {
      this.selectedCurrencyId = currency.currencyId;
      //this.doFilter(4)
    }
  }

  onSaveBranch(form: NgForm) {
    this.isSubmitted = true;
    if (form.invalid) {
      form.form.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    //Custom logic for Currency
    if (
      this.selectedCurrencyId === 0 ||
      this.allcurrencies.filter(
        (currency) =>
          currency.currencyName.toLowerCase() ===
          this.currentCurrency.toLocaleLowerCase()
      ).length === 0
    ) {
      this.currentCurrency="";
      return;
    }

    //Custom logic for Country
    if (
      this.selectedCountryId == 0 ||
      this.allcountries.filter(
        (country) =>
          country.countryName.toLowerCase() ===
          this.currentCountry.toLocaleLowerCase()
      ).length === 0
    ) {
      this.currentCountry = "";
      return;
    }

    //Custom logic for state
    if (
      this.selectedStateId === 0 ||
      this.allstates.filter(
        (state) =>
          state.stateName.toLowerCase() ===
          this.currentState.toLocaleLowerCase()
      ).length === 0
    ) {
      this.currentState="";
      return;
    }

    //Custom logic for City
    if (
      this.selectedCityId == 0 ||
      this.allCities.filter(
        (city) =>
          city.cityName.toLowerCase() === this.currentCity.toLocaleLowerCase()
      ).length === 0
    ) {
      this.currentCity;
      return;
    }

    

    //Getting user input values from Form
    const formData = form.value;
    //Custom logic required field
    if (
      isEmptyString(formData.branchCode) ||
      isEmptyString(formData.branchName) ||
      isEmptyString(this.input2.nativeElement.value) ||
      isEmptyString(formData.contactPerson) ||
      isEmptyString(formData.branchAddressLine1)
    ) {
      return;
    }

    const branch: Branch = {
      branchId: 0, // 0 for Add >0 for update
      branchCode: formData.branchCode.trim(), //trim is necessary that it will remove the leading and trailing whitespaces
      branchName: formData.branchName.trim(),
      aliasName:  this.input2.nativeElement.value.trim(),
      branchType: formData.branchType,
      contactPerson: formData.contactPerson.trim(),
      contactNumber: formData.contactNumber,
      branchAddressLine1: formData.branchAddressLine1.trim(),
      branchAddressLine2: formData.branchAddressLine2,
      cityId: this.selectedCityId,
      cityName: "", // Only related id is saved
      stateId: this.selectedStateId,
      stateName: "",
      countryId: this.selectedCountryId,
      countryName: "",
      currencyId: this.selectedCurrencyId,
      currencyName: "",
      livestatus: this.branchStatus ? true : false,
      createdBy: parseInt(this.userId$),
      createdDate: new Date(),
      updatedBy: parseInt(this.userId$),
      updatedDate: new Date(),
    };

    /* Add */
    if (this.isCreatedFlag) {
      this.branchService.addBranch(branch).subscribe(
        (res) => {
          form.resetForm();
          this.initializeControls();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.returnToList();
        },
        (error) => {
          console.log(error.error.ErrorDetails);
          if (error.error.message == "DUPLICATE") {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Branch  already exists!",
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: JSON.stringify(error.error.ErrorDetails),
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      );
    } else {
      /* Update */
      branch.branchId = this.branchId;
      branch.updatedBy = parseInt(this.userId$)

      this.branchService.updateBranch(branch).subscribe(
        (res) => {
          form.resetForm();
          this.initializeControls();
          this.resetNavigation();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Updated successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.returnToList();
        },(error) => {
          if(error.error.ErrorDetails.includes('UNIQUE KEY')){
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Branch already exists!!",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      );
    }
  }

  resetNavigation() {
    if (this.currentPath.includes("/ums/master/branch")) {
      this.router.navigate(["/ums/master/branches"]);
    }
  }

  initializeControls() {
    this.branchStatus = true;
    this.isSubmitted = false;
  }

  resetButtonClickforSave(form: NgForm) {
    form.resetForm();
    this.initializeControls();
  }
  resetButtonClick() {
    this.editedBranch = {
      branchId: 0,
      branchCode: "",
      branchName: "",
      aliasName: "",
      branchType: 0,
      contactPerson: "",
      contactNumber: "",
      branchAddressLine1: "",
      branchAddressLine2: "",
      cityId: 0,
      cityName: "",
      stateId: 0,
      stateName: "",
      countryId: 0,
      countryName: "",
      currencyId: 0,
      currencyName: "",
      livestatus: true,
      createdBy: 0,
      createdDate: "",
      updatedBy: null,
      updatedDate: "",
    };
    this.branchService.getBranch(this.branchId).subscribe((branchData) => {
      this.editedBranch = branchData;
      this.selectedBranchType = this.editedBranch.branchType.toString();

      this.selectedCountryId = this.editedBranch.countryId;
      this.currentCountry = this.editedBranch.countryName;
      this.commonService
        .getStatesForSelectedCountry(this.selectedCountryId)
        .subscribe((result) => {
          this.states = result;
        });
      this.selectedStateId = this.editedBranch.stateId;
      this.currentState = this.editedBranch.stateName;
      this.commonService
        .getCityForSelectedState(this.selectedStateId)
        .subscribe((result) => {
          this.cities = result;
        });
      this.selectedCityId = this.editedBranch.cityId;
      this.currentCity = this.editedBranch.cityName;
      this.selectedCurrencyId = this.editedBranch.currencyId;
      this.currentCurrency = this.editedBranch.currencyName;
      this.branchStatus = this.editedBranch.livestatus ? true : false;
    });
  }

  returnToList() {
    this.router.navigate(["/ums/master/branches"]);
  }
  updateAliasName(newValue: string) {
    // Check if editedBranch is not null or undefined before updating aliasName
    this.aliasName = newValue;
  }

  //#region phone number validation
  onKeydown($event: any) {
    // filter away which is not numbers,space, hyphen,+
    let unallowableValues: Array<string | number> = ["~","`","!","@","#","$","%","^","&","*","(",")","_","|","{","}","[","]",";",":","<",">",",",".",222,191,220];
    unallowableValues.forEach((data: any) => {
      if ($event.keyCode == data || $event.key == data) {
        $event.preventDefault();
      }
    });
    if (
      ($event.keyCode >= 65 && $event.keyCode <= 90) ||
      ($event.keyCode == 187 && $event.key != "+")
    ) {
      $event.preventDefault();
    }
  }
  //#endregion

  setName(event:any) {
    this.editedBranch?.aliasName == event.viewModel;
     
  }
  patchValue(value:any,form: NgForm){
    form.controls['aliasName'].setErrors(null);
    this.input2.nativeElement.value = value;
  }
}
