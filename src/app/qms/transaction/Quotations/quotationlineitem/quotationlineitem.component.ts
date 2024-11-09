import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, first, map, startWith, switchMap } from 'rxjs';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { vendorfilter, vendorfilterList } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { CommonService } from 'src/app/services/common.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { VendorfilterComponent } from '../vendorfilter/vendorfilter.component';
import { CalculationParameters, CalculationTypes, sourceFrom } from 'src/app/Models/crm/master/Dropdowns';
import { TaxCode } from 'src/app/crm/master/taxcode/taxcode.model';
import { changeExchange, Exchange, QlineItem, QLIVendorValue, QLIVendorValueDetail, vendorQuotationFilterList } from '../quotation-model/quote';
import Swal from 'sweetalert2';
import { PurchaseQuotationCuvService } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation-cuv.service';
import { QuotationService } from '../quotation.service';
import { JobOrderExpenseBookingService } from '../../job-order-expense-booking/job-order-expense-booking.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor.service';
import { VendorModelContainer } from 'src/app/Models/crm/master/Vendor';
import { PotentialVendorContainer } from 'src/app/crm/master/potential-vendor/potential-vendor.model';
import { JoebVendorfilterDialogComponent } from '../../job-order-expense-booking/joeb-vendorfilter-dialog/joeb-vendorfilter-dialog.component';
import { VendorIdbyCurrency } from '../../job-order-expense-booking/job-order-expense-booking.model';
import { CurrenciesService } from 'src/app/ums/masters/currencies/currencies.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';

@Component({
  selector: 'app-quotationlineitem',
  templateUrl: './quotationlineitem.component.html',
  styleUrls: ['./quotationlineitem.component.css', '../../../../ums/ums.styles.css']
})
export class QuotationlineitemComponent implements OnInit {
  QLineItem!: FormGroup;
  lineItemList: LineItemMaster[] = [];
  filteredLineItemOptions$: any;
  selectedLineItemId: any;
  selectedLineItemcatId: any;
  selectedLineItemcatName: any;
  selectedLineItemDescription: any;
  lineitemcatList: LineItemMaster[] = [];
  CountryDatalist: Country[] = [];
  selectedServiceinId: any;
  filteredCountryOptions$: any;
  enablevendor: boolean;
  selectedvendor: any;
  SelectedvendorId: any;
  SelectedLineName: any;
  SelectedLineCode: any;
  selectedServiceInName: any;
  selectedvendorName: any;
  CalculationParlist: CalculationParameters[] = [];
  filteredCalculationParOptions$: any;
  calculationParameterId: any;
  calculationParameter: any;
  CalculationTyplist: CalculationTypes[] = [];
  calculationTypeId: any;
  calculationType: any;
  filteredCalculationTypeOptions$: Observable<any[]>;
  taxcodelist: TaxCode[] = [];
  filteredTaxCodeOptions$: any;
  taxId: any;
  taxCodeName: any;
  Date = new Date();
  userId$: string;
  LineItem: any;
  selectedDestcountry: any;
  quotation: any;
  filteredvendors: vendorQuotationFilterList[] = [];
  filteredvendorOptions$: Observable<any[]>;
  sourceFromList: sourceFrom[] = [];
  filteredSourceFromOptions$: Observable<any[]>;
  selectedSourceFromId: any;
  selectedSourceFromName: any;
  PQandCdrp: vendorQuotationFilterList[];
  filteredRefNumberOptions$: any;
  selectedRefNumberId: any;
  selectedrefNumber: any;
  SelectedlineItemName: any;
  direct: boolean;
  vendorType: any;
  vendorTypeId: number;
  taxCodeId: any;
  Edit: boolean;
  view: boolean;
  selectedvendors: any;
  disablefields: boolean;
  currencyList: any[] = [];
  filteredCurrencyListOptions$: any;
  currencyId: any;
  currencyName: any;
  vendorDetails: any;
  potentialVendor: any;
  currencyReadonly: boolean;
  selectedvendorType: any;
  vendorcurrencyDetails: VendorIdbyCurrency[];
  FromcurrencyId: any;
  exchangecurrency: any;
  selectedvalueCustomercurrency: any;
  selectedminvalueCustomercurrency: any;
  minexchangecurrency: any;
  isAmendPriceReadonly: boolean;
  companycurrency: Currency;
  minValueInCompanyCurrency: any;
  valueInCompanyCurrency: any;
  taxper: any;
  cusexchange: number;
  vendorexchange: number;
  exchangecurrencyforvendor: any;
  valuecompanynew: number;
  minexchangecurrencyforvendor: any;
  minvaluevendor: number;
  QLIVendorValueDetails: any[] = [];
  currentvalue: any;
  mincurrency: any;
  calculationTypeReadonly: boolean;

  constructor(private fb: FormBuilder,
    private Ls: LineitemmasterService,
    private Cservice: CommonService, private vendorService: VendorService,
    private potentialVendorService: PotentialVendorService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private jobOrderExpenseBookingService: JobOrderExpenseBookingService,
    public dialogRef: MatDialogRef<QuotationlineitemComponent>, private Cs: CommonService, private pqServices: PurchaseQuotationCuvService, private Qs: QuotationService,
    private currencyS: CurrenciesService) {
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.GetLineItem();
    this.getServiceIn();
    this.GetAllCalculationParameter();
    this.GetAllCalculationType();
    this.getTaxCode();
    this.getCurrencyList();
    this.getCompanyCurrency();
    this.getAllvendors();
    this.getSourceFroms();
    this.EditMode();
    this.LineItem = this.data.LineData;
    this.FromcurrencyId = this.data.currencyId;
  }

  InitializeForm() {
    this.QLineItem = this.fb.group({
      qLineItemId: [0],
      quotationId: [0],
      lineItemId: ['', Validators.required],
      lineItemCode: [null],
      lineItemCategoryId: [null],
      lineItemCategoryName: [null, Validators.required],
      serviceInId: ['', Validators.required],
      countryName: [null],
      isVendor: [false, Validators.required],
      vendorId: [null],
      vendorName: [null],
      sourceFromId: [null],
      refNumberId: [null],
      vendorCurrencyId: [null],
      currencyName: [null],
      calculationParameterId: ['', Validators.required],
      calculationParameter: [null],
      calculationTypeId: ['', Validators.required],
      calculationType: [null],
      valueInCustomerCurrency: ['', Validators.required],
      minValueInCustomerCurrency: [0],
      valueInCompanyCurrency: [null],
      minValueInCompanyCurrency: [null],
      customerExchangeRate: [null],
      taxId: ['', Validators.required],
      taxCodeName: [null],
      taxPercentage: ['', Validators.required],
      remarks: [null],
      createdBy: 1,
      createdDate: this.Date,
      updatedBy: 1,
      updatedDate: this.Date,
      isAmendPrice: [false],
      qLIVendorValue: [null],
      valueInVendorCurrency: [null],
      minValueInVendorCurrency: [null]
    });
  }

  //# EditMode 
  EditMode() {

    if (this.data.mode == "Edit") {
      debugger;
      this.calculationTypeReadonly=true;
      this.Edit = true;
      this.disablefields = false;
      this.LineItem = this.data.LineList;
      this.QLineItem.patchValue(this.data.LineData);
      this.SelectedvendorId = this.data.LineData.vendorId,
        this.selectedLineItemId = this.data.LineData.lineItemId,
        this.SelectedlineItemName = this.data.LineData.lineItemName,
        this.selectedLineItemcatId = this.data.LineData.lineItemCategoryId,
        this.SelectedLineCode = this.data.LineData.lineItemCode,
        this.selectedLineItemcatName = this.data.LineData.lineItemCategoryName,
        this.selectedServiceinId = this.data.LineData.serviceInId,
        this.selectedServiceInName = this.data.LineData.countryName,
        this.selectedvendorName = this.data.LineData.vendorName,
        this.currencyId = this.data.LineData.vendorCurrencyId,
        this.currencyName = this.data.LineData.currencyName,
        this.calculationParameterId = this.data.LineData.calculationParameterId,
        this.calculationParameter = this.data.LineData.calculationParameter,
        this.calculationTypeId = this.data.LineData.calculationTypeId,
        this.calculationType = this.data.LineData.calculationType,
        this.taxId = this.data.LineData.taxId,
        this.taxCodeName = this.data.LineData.taxCodeName,
        this.selectedRefNumberId = this.data.LineData.refNumberId;
      this.selectedrefNumber = this.data.LineData.refNumber;
      this.selectedSourceFromId = this.data.LineData.sourceFromId;
      if(this.selectedSourceFromId){
        this.QLineItem.controls['refNumberId'].disable();
      }else{
        this.QLineItem.controls['refNumberId'].enable();
      }
      this.selectedSourceFromName = this.data.LineData.sourceFrom;
      this.cusexchange = this.data.LineData.customerExchangeRate;
      this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
        this.filteredvendors = res;

        var vendortype = this.filteredvendors.find(id => id.vendorId == this.SelectedvendorId);
        this.vendorType = vendortype?.vendorType;
        if (this.vendorType == 'V') {
          this.vendorTypeId = 2;
        } else if (this.vendorType == 'PV') {
          this.vendorTypeId = 1;
        }
      });
      if (this.data.LineData.isVendor == true) {
        this.enablevendor = true;
        this.QLineItem.controls["vendorId"].setValidators([Validators.required]);
        this.QLineItem.get('vendorId')?.updateValueAndValidity();
      } else {
        this.enablevendor = false;
        this.QLineItem.get('vendorId')?.setValidators([Validators.nullValidator]);
        this.QLineItem.get('vendorId')?.updateValueAndValidity();
      }
      this.QLineItem.controls["lineItemId"].setValue(this.data.LineData);
      this.QLineItem.controls["lineItemCategoryName"].setValue(this.data.LineData.lineItemCategoryName);
      this.QLineItem.controls["lineItemCode"].setValue(this.data.LineData.lineItemCode);
      this.QLineItem.controls["serviceInId"].setValue(this.data.LineData);
      this.QLineItem.controls["vendorId"].setValue(this.data.LineData);
      this.QLineItem.controls["calculationParameterId"].setValue(this.data.LineData);
      this.QLineItem.controls["vendorCurrencyId"].setValue(this.data.LineData);
      this.QLineItem.controls["calculationTypeId"].setValue(this.data.LineData);
      this.QLineItem.controls["taxId"].setValue(this.data.LineData);
      this.QLineItem.controls["sourceFromId"].setValue(this.data.LineData);
      this.QLineItem.controls["refNumberId"].setValue(this.data.LineData);
      this.QLineItem.controls["minValueInCustomerCurrency"].setValue(this.data.LineData.minValueInCustomerCurrency);
      this.QLineItem.controls["taxPercentage"].setValue(this.data.LineData.taxPercentage);
      let isAmendPrice = this.QLineItem.controls['isAmendPrice'].value
      if (this.selectedSourceFromId && isAmendPrice == false) {
        this.isAmendPriceReadonly = true
      } else if (this.selectedSourceFromId && isAmendPrice == true) {
        this.isAmendPriceReadonly = false
      }
      else if (this.selectedSourceFromId == 3 && isAmendPrice == false) {
        this.isAmendPriceReadonly = false
      }
      else if (!this.selectedSourceFromId) {
        this.isAmendPriceReadonly = false
      }
    } else if (this.data.mode == "view") {
      this.view = true;
      this.ViewMode();
    }

  }

  ViewMode() {
    this.disablefields = true;
    this.LineItem = this.data.LineList;
    this.QLineItem.disable();
    this.QLineItem.patchValue(this.data.LineData);
    this.SelectedvendorId = this.data.LineData.vendorId,
      this.selectedLineItemId = this.data.LineData.lineItemId,
      this.SelectedlineItemName = this.data.LineData.lineItemName,
      this.selectedLineItemcatId = this.data.LineData.lineItemCategoryId,
      this.SelectedLineCode = this.data.LineData.lineItemCode,
      this.selectedLineItemcatName = this.data.LineData.lineItemCategoryName,
      this.selectedServiceinId = this.data.LineData.serviceInId,
      this.selectedServiceInName = this.data.LineData.countryName,
      this.selectedvendorName = this.data.LineData.vendorName,
      this.currencyId = this.data.LineData.vendorCurrencyId,
      this.currencyName = this.data.LineData.currencyName,
      this.calculationParameterId = this.data.LineData.calculationParameterId,
      this.calculationParameter = this.data.LineData.calculationParameter,
      this.calculationTypeId = this.data.LineData.calculationTypeId,
      this.calculationType = this.data.LineData.calculationType,
      this.taxId = this.data.LineData.taxId,
      this.taxCodeName = this.data.LineData.taxCodeName,
      this.selectedRefNumberId = this.data.LineData.refNumberId;
    this.selectedrefNumber = this.data.LineData.refNumber;
    this.selectedSourceFromId = this.data.LineData.sourceFromId;
    this.selectedSourceFromName = this.data.LineData.sourceFrom;
    this.cusexchange = this.data.LineData.customerExchangeRate;

    // if(this.selectedSourceFromId==1){
    //   var vendortype = this.filteredvendors.find(id=>id.vendorId == this.SelectedvendorId);
    //    this.vendorType=vendortype?.vendorType;
    //   if(  this.vendorType=='V')
    //     {
    //       this.vendorTypeId=2;
    //     }else  if( this.vendorType=='PV')
    //     {
    //       this.vendorTypeId=1;
    //     }
    //   this.getvendor("pq",this.vendorTypeId,this.SelectedvendorId,this.selectedLineItemId);
    // }else{
    //   this.getvendor("contract",2,this.SelectedvendorId,this.selectedLineItemId);
    // }

    if (this.data.LineData.isVendor == true) {
      this.enablevendor = true;
      this.QLineItem.controls["vendorId"].setValidators([Validators.required]);
      this.QLineItem.get('vendorId')?.updateValueAndValidity();
    } else {
      this.enablevendor = false;
      this.QLineItem.get('vendorId')?.setValidators([Validators.nullValidator]);
      this.QLineItem.get('vendorId')?.updateValueAndValidity();
    }
    this.QLineItem.controls["lineItemId"].setValue(this.data.LineData);
    this.QLineItem.controls["lineItemCategoryName"].setValue(this.data.LineData.lineItemCategoryName);
    this.QLineItem.controls["lineItemCode"].setValue(this.data.LineData.lineItemCode);
    this.QLineItem.controls["serviceInId"].setValue(this.data.LineData);
    this.QLineItem.controls["vendorId"].setValue(this.data.LineData);
    this.QLineItem.controls["calculationParameterId"].setValue(this.data.LineData);
    this.QLineItem.controls["vendorCurrencyId"].setValue(this.data.LineData);
    this.QLineItem.controls["calculationTypeId"].setValue(this.data.LineData);
    this.QLineItem.controls["taxId"].setValue(this.data.LineData);
    this.QLineItem.controls["sourceFromId"].setValue(this.data.LineData);
    this.QLineItem.controls["refNumberId"].setValue(this.data.LineData);
    this.QLineItem.controls["minValueInCustomerCurrency"].setValue(this.data.LineData.minValueInCustomerCurrency);
    this.QLineItem.controls["taxPercentage"].setValue(this.data.LineData.taxPercentage);
  }


  //#endregion
  //#region GetLineItem
  GetLineItem() {
    this.Ls.GetAllLineItemMaster(1).subscribe((res => {
      this.lineItemList = res;
      this.lineItemFun();
      // this.EditMode();
    }));
  }
  lineItemFun() {
    this.filteredLineItemOptions$ = this.QLineItem.controls['lineItemId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.lineItemName)),
      map((name: any) => (name ? this.filteredLineItemOptions(name) : this.lineItemList?.slice()))
    );
  }
  private filteredLineItemOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.lineItemList.filter((option: any) => option.lineItemName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataLineItem();
  }
  NoDataLineItem(): any {
    this.QLineItem.controls['lineItemId'].setValue('');
    return this.lineItemList;
  }
  displayLineItemListLabelFn(data: any): string {
    return data && data.lineItemName ? data.lineItemName : '';
  }
  lineItemSelectedOption(data: any) {
    debugger;
    if (this.LineItem.length > 0) {
      const isItemExists = this.LineItem.some((item: { lineItemId: any; }) => item.lineItemId === data.option.value.lineItemId);

      if (isItemExists) {
        Swal.fire({
          icon: "error",
          title: "Duplicate",
          text: "The Line Item is selected Please choose another ",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        })
        this.QLineItem.get('lineItemId')?.setValue('');
        this.QLineItem.get('lineItemCategoryId')?.setValue('');
        this.QLineItem.get('lineItemCode')?.setValue('');
      }
    }

    let selectedValue = data.option.value;
    this.selectedLineItemId = selectedValue.lineItemId;
    this.SelectedLineCode = selectedValue.lineItemCode;
    this.SelectedlineItemName = selectedValue.lineItemName
    this.selectedLineItemcatId = selectedValue.lineItemCategoryId;
    this.selectedLineItemcatName = selectedValue.lineItemCategoryName;
    this.QLineItem.controls["lineItemCategoryName"].setValue(this.selectedLineItemcatName);
    this.QLineItem.controls["lineItemCode"].setValue(this.SelectedLineCode);
  }

  //  GetLineItem(){
  //   this.Ls.GetAllLineItemMaster(1).subscribe((res=>{
  //   this.lineItemList = res;
  //   console.log("this.lineItemList",this.lineItemList);
  //   this.lineItemFun();
  //   this.EditMode();
  //   }));
  //  }

  //  lineItemFun() {
  //   this.filteredLineItemOptions$ = this.QLineItem.controls['lineItemId'].valueChanges.pipe(
  //     startWith(''),
  //     map((value: any) => (typeof value === 'string' ? value : value?.lineItemCode)),
  //     map((name: any) => (name ? this.filteredLineItemOptions(name) : this.lineItemList?.slice()))
  //   );
  // }
  // private filteredLineItemOptions(name: string): any[] {
  //   const filterValue = name.toLowerCase();
  //   const results = this.lineItemList.filter((option: any) => option.lineItemCode.toLowerCase().includes(filterValue));
  //   return results.length ? results : this.NoDataLineItem();
  // }
  // NoDataLineItem(): any {
  //   this.QLineItem.controls['lineItemId'].setValue('');
  //   return this.lineItemList;
  // }
  // displayLineItemListLabelFn(data: any): string {
  //   return data && data.lineItemCode ? data.lineItemCode : '';
  // }
  // lineItemSelectedOption(data: any) {
  //   const isItemExists = this.LineItem.some((item: { lineItemId: any; }) => item.lineItemId === data.option.value.lineItemId);

  //   if (isItemExists) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Duplicate",
  //       text: "The Line Item is selected Please choose another ",
  //       confirmButtonColor: "#007dbd",
  //       showConfirmButton: true,
  //     })
  //     this.QLineItem.get('lineItemId')?.setValue('');
  //     this.QLineItem.get('lineItemCategoryId')?.setValue('');
  //   }else{
  //     let selectedValue = data.option.value;
  //     this.selectedLineItemId = selectedValue.lineItemId;
  //     this.SelectedLineCode = selectedValue.lineItemCode;
  //     this.selectedLineItemcatId = selectedValue.lineItemCategoryId;
  //     this.selectedLineItemcatName = selectedValue.lineItemCategoryName;
  //     this.QLineItem.controls["lineItemCategoryId"].setValue(this.selectedLineItemcatName);
  //     // this.Ls.GetbyLineItemCategoryId(this.selectedLineItemcatId).subscribe((res=>{
  //     //   this.lineitemcatList= res;
  //     //   console.log(" this.lineitemcatList", this.lineitemcatList);
  //     // }));
  //     //this.selectedLineItemDescription = this.lineitemcatList.
  //   } 
  // }
  //#endregion lineItem
  //#region  currency
  getCurrencyList() {
    this.Cs.getCurrencies(1).subscribe(result => {
      this.currencyList = result;
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.QLineItem.controls['vendorCurrencyId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.currencyName)),
      map((name: any) => (name ? this.filteredCurrencyListOptions(name) : this.currencyList?.slice()))
    );
  }
  private filteredCurrencyListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.currencyList.filter((option: any) => option.currencyName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCurrency();
  }
  NoDataCurrency(): any {
    this.QLineItem.controls['vendorCurrencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.currencyId = selectedValue.currencyId;
    this.currencyName = selectedValue.currencyName;


    if (this.selectedvalueCustomercurrency != null) {
        const payload: Exchange = {
          fromCurrencyId: this.currencyId,
          toCurrencyId:this.FromcurrencyId,
          value: this.selectedvalueCustomercurrency
        }
        this.Qs.CurrencyExchanges(payload).subscribe((res => {
          this.exchangecurrency = res;
          this.cusexchange = this.exchangecurrency.exchangeRate;
          this.QLineItem.controls['customerExchangeRate'].setValue(this.exchangecurrency.exchangeRate);
          var value1 = this.QLineItem.controls['valueInCustomerCurrency'].setValue(this.exchangecurrency.convertedValue);


          if (this.selectedminvalueCustomercurrency != null) {
            const payload: Exchange = {
              fromCurrencyId:this.currencyId ,
              toCurrencyId: this.FromcurrencyId,
              value:this.selectedminvalueCustomercurrency
            }

            this.Qs.CurrencyExchanges(payload).subscribe((res => {
              this.minexchangecurrency = res;
              console.log(" this.minexchangecurrency", this.minexchangecurrency);
              this.cusexchange = this.minexchangecurrency.exchangeRate;
              this.QLineItem.controls['customerExchangeRate'].setValue(this.minexchangecurrency.exchangeRate);
              var value1 = this.QLineItem.controls['minValueInCustomerCurrency'].setValue(this.minexchangecurrency.convertedValue);
            }));
          }
        }));
      }else{
        this.currentvalue = this.QLineItem.controls['valueInCustomerCurrency'].value;
        this.mincurrency = this.QLineItem.controls['minValueInCustomerCurrency'].value;
        if (this.currentvalue != null) {
          const payload: Exchange = {
            fromCurrencyId: this.currencyId,
            toCurrencyId: this.FromcurrencyId,
            value: this.currentvalue
          }
          this.Qs.CurrencyExchanges(payload).subscribe((res => {
            this.exchangecurrency = res;
            this.cusexchange = this.exchangecurrency.exchangeRate;
            this.QLineItem.controls['customerExchangeRate'].setValue(this.exchangecurrency.exchangeRate);
            var value1 = this.QLineItem.controls['valueInCustomerCurrency'].setValue(this.exchangecurrency.convertedValue);
  
  
            if (this.mincurrency != null) {
              const payload: Exchange = {
                fromCurrencyId:  this.currencyId,
                toCurrencyId: this.FromcurrencyId,
                value:this.mincurrency
              }
  
              this.Qs.CurrencyExchanges(payload).subscribe((res => {
                this.minexchangecurrency = res;
                console.log(" this.minexchangecurrency", this.minexchangecurrency);
                this.cusexchange = this.minexchangecurrency.exchangeRate;
                this.QLineItem.controls['customerExchangeRate'].setValue(this.minexchangecurrency.exchangeRate);
                var value1 = this.QLineItem.controls['minValueInCustomerCurrency'].setValue(this.minexchangecurrency.convertedValue);
              }));
            }
          }));
        }
      }
  }
  //#endregion

  //#region ServiceIn autocomplete
  getServiceIn() {
    debugger;
    this.Cservice.getCountries(1).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
      if (!this.Edit && !this.view) {
        this.selectedServiceinId = this.data.selectedDestcountry;
        this.quotation = this.data.quotation;
        var country = this.CountryDatalist.find(id => id.countryId == this.data.selectedDestcountry)
        this.QLineItem.controls["serviceInId"].setValue(country);
        this.selectedServiceInName = country?.countryName;
      }
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.QLineItem.controls['serviceInId'].valueChanges.pipe(
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
    this.QLineItem.controls['serviceInId'].setValue('');
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.selectedServiceinId = selectedCountry.countryId;
    this.selectedServiceInName = selectedCountry.countryName
  }

  //#region select CalculationParameter
  GetAllCalculationParameter() {
    this.Cservice.GetAllCalculationParameter().subscribe(result => {
      this.CalculationParlist = result;
      this.CalculationParFun()
    });
  }
  CalculationParFun() {
    this.filteredCalculationParOptions$ = this.QLineItem.controls['calculationParameterId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.calculationParameter)),
      map((name: any) => (name ? this.filteredCalculationParOptions(name) : this.CalculationParlist?.slice()))
    );
  }
  private filteredCalculationParOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CalculationParlist.filter((option: any) => option.calculationParameter.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCalculationPar();
  }
  NoDataCalculationPar(): any {
    this.QLineItem.controls['calculationParameterId'].setValue('');
    return this.CalculationParlist;
  }
  displayculationParLabelFn(data: any): string {
    return data && data.calculationParameter ? data.calculationParameter : '';
  }
  CalculationParSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.calculationParameterId = selectedValue.calculationParameterId;
    this.calculationParameter = selectedValue.calculationParameter;

    this.calculationTypeId = selectedValue.calculationTypeId;
    this.calculationType = selectedValue.calculationType;
    this.QLineItem.controls['calculationTypeId'].setValue(selectedValue);

    if (this.calculationType) {
      this.calculationTypeReadonly=true;
    } else {
      this.calculationTypeReadonly=false;
    } 

    if(this.calculationParameterId==30){
      this.QLineItem.controls['valueInCustomerCurrency'].setValue(0);
    }
    if(this.calculationParameterId==31){
      this.QLineItem.controls['valueInCustomerCurrency'].setValue(0);
    }


  }
  //#endregion
  //#region select culationType
  GetAllCalculationType() {
    this.Cservice.GetAllCalculationType().subscribe(result => {
      this.CalculationTyplist = result;
      this.CalculationTypeFun()
      console.log(this.CalculationTyplist)
    });
  }
  CalculationTypeFun() {
    this.filteredCalculationTypeOptions$ = this.QLineItem.controls['calculationTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.calculationType)),
      map((name: any) => (name ? this.filteredCalculationTypeOptions(name) : this.CalculationTyplist?.slice()))
    );
  }
  private filteredCalculationTypeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CalculationTyplist.filter((option: any) => option.calculationType.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCalculationType();
  }
  NoDataCalculationType(): any {
    this.QLineItem.controls['calculationTypeId'].setValue('');
    return this.CalculationTyplist;
  }
  displayculationTypeLabelFn(data: any): string {
    return data && data.calculationType ? data.calculationType : '';
  }
  CalculationTypeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.calculationTypeId = selectedValue.calculationTypeId;
    this.calculationType = selectedValue.calculationType;
  }

  //#region select taxcode
  getTaxCode() {
    this.Cservice.GetAllActiveTaxCodes().subscribe(result => {
      this.taxcodelist = result;
      this.TaxCodeFun()
    });
  }
  TaxCodeFun() {
    this.filteredTaxCodeOptions$ = this.QLineItem.controls['taxId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.taxCodeName)),
      map((name: any) => (name ? this.filteredTaxCodeOptions(name) : this.taxcodelist?.slice()))
    );
  }
  private filteredTaxCodeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.taxcodelist.filter((option: any) => option.taxCodeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataTaxCode();
  }
  NoDataTaxCode(): any {
    this.QLineItem.controls['taxId'].setValue(null);
    return this.taxcodelist;
  }
  displayTaxCodeLabelFn(data: any): string {
    return data && data.taxCodeName ? data.taxCodeName : '';
  }

  TaxCodeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.taxId = selectedValue.taxCodeId;
    this.taxCodeId = selectedValue.taxCodeId;
    this.taxCodeName = selectedValue.taxCodeName;
    this.taxper = selectedValue.taxPer
    this.QLineItem.controls["taxPercentage"].setValue(this.taxper);

    if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
      const payload: Exchange = {
        fromCurrencyId: this.FromcurrencyId,
        toCurrencyId: this.companycurrency.currencyId,
        value: this.QLineItem.controls['valueInCustomerCurrency'].value
      }
      console.log("payload1", payload);
      this.Qs.CurrencyExchanges(payload).subscribe((res => {
        this.valueInCompanyCurrency = res;
        console.log(" this.comp1", this.valueInCompanyCurrency);
        this.cusexchange = this.valueInCompanyCurrency.exchangeRate;
        var value1 = this.QLineItem.controls['valueInCompanyCurrency'].setValue(this.valueInCompanyCurrency.convertedValue);
      }));
    }
    if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
      const payload: Exchange = {
        fromCurrencyId: this.FromcurrencyId,
        toCurrencyId: this.companycurrency.currencyId,
        value: this.QLineItem.controls['minValueInCustomerCurrency'].value
      }
      console.log("payload2", payload);
      this.Qs.CurrencyExchanges(payload).subscribe((res => {
        this.minValueInCompanyCurrency = res;
        console.log(" this.comp2", this.minValueInCompanyCurrency);
        var value1 = this.QLineItem.controls['minValueInCompanyCurrency'].setValue(this.minValueInCompanyCurrency.convertedValue);
      }));
    }
  }
  //#endregion
  //#region vendor filter
  onVendorCheckboxChange(event: any) {
    const selectedValue = event.value;
    if (this.selectedLineItemId != null) {
      if (selectedValue == true) {
        this.enablevendor = true;
        this.QLineItem.controls["vendorId"].setValidators([Validators.required]);
        this.QLineItem.controls["sourceFromId"].setValidators([Validators.required]);
        this.QLineItem.get('vendorId')?.updateValueAndValidity();
        this.QLineItem.get('sourceFromId')?.updateValueAndValidity();
      } else {
        this.enablevendor = false;
        this.QLineItem.get('vendorId')?.setValidators([Validators.nullValidator]);
        this.QLineItem.get('vendorId')?.updateValueAndValidity();
        this.QLineItem.get('sourceFromId')?.setValidators([Validators.nullValidator]);
        this.QLineItem.get('sourceFromId')?.updateValueAndValidity();
        this.QLineItem.controls["vendorId"].setValue(null);
        this.SelectedvendorId = null;
        this.selectedvendorName = null;
        this.selectedSourceFromId = null;
        this.selectedSourceFromName = null;
        this.selectedrefNumber = null;
        this.selectedRefNumberId = null;
        this.QLineItem.controls['sourceFromId'].setValue(null);
        this.QLineItem.controls['refNumberId'].setValue(null);
       // this.QLIVendorValueDetails=[];
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select line item description and then use filter",
        showConfirmButton: false,
        timer: 2000,
      });
      this.QLineItem.controls["isVendor"].reset();
      this.QLineItem.controls['isVendor'].setValue(false);
    }


  }

  Filter() {
    if (this.selectedLineItemId != null) {
      const dialogRef = this.dialog.open(VendorfilterComponent, {
        data: {
          lineItemId: this.selectedLineItemId,
        }, disableClose: true, autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {

        if (result != null) {
          this.PQandCdrp = []
          this.selectedSourceFromId = null;
          this.selectedSourceFromName = null;
          this.selectedrefNumber = null;
          this.selectedRefNumberId = null;
          this.calculationTypeId = null;
          this.calculationParameterId = null;
          this.taxId = null;
          this.calculationParameter = null;
          this.calculationType = null;
          this.taxCodeName = null;
          this.QLineItem.controls['sourceFromId'].reset();
          this.QLineItem.controls['refNumberId'].reset();
          this.QLineItem.controls['calculationParameterId'].reset();
          this.QLineItem.controls['calculationTypeId'].reset();
          this.QLineItem.controls['taxId'].reset();
          this.QLineItem.controls['valueInCustomerCurrency'].reset();
          this.QLineItem.controls['customerExchangeRate'].reset();
          this.QLineItem.controls['valueInCompanyCurrency'].reset();
          this.QLineItem.controls['minValueInCustomerCurrency'].reset();
          this.QLineItem.controls['customerExchangeRate'].reset();


          this.isAmendPriceReadonly = true;
          this.selectedvendor = result;
          this.SelectedvendorId = this.selectedvendor.vendorId;
          this.selectedvendorName = this.selectedvendor.vendorName;
          this.selectedRefNumberId = this.selectedvendor.refNumberId;
          this.selectedrefNumber = this.selectedvendor.refNumber;
          this.vendorType = this.selectedvendor.vendorType;
          this.QLineItem.controls["vendorId"].setValue(this.selectedvendor);
          if (this.vendorType == 'V') {
            this.vendorTypeId = 2;
          } else if (this.vendorType == 'PV') {
            this.vendorTypeId = 1;
          }
          if (this.selectedvendor.sourceFrom == "PQ") {
            this.selectedSourceFromId = 1;
            var vendor = this.sourceFromList.find(id => id.sourceFromId == 1);
            this.selectedSourceFromName = vendor?.sourceFrom;
            this.QLineItem.controls["sourceFromId"].setValue(vendor);
            this.getvendor("PQ", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
            this.QLineItem.controls["vendorId"].setValue(this.selectedvendor);
            this.selectedrefNumber = this.selectedvendor.refNumber;
            this.selectedRefNumberId = this.selectedvendor.refNumberId;
            this.QLineItem.controls["refNumberId"].setValue(this.selectedvendor);
            if (this.vendorType == 'V') {
              this.vendorTypeId = 2;
            } else if (this.vendorType == 'PV') {
              this.vendorTypeId = 1;
            }
            const payload = {
              vendorId: this.SelectedvendorId,
              lineitemId: this.selectedLineItemId
            }
            this.Qs.Searchpq(payload).subscribe((res => {
              debugger;
              this.isAmendPriceReadonly = true;
              if (res.length > 0) {
                this.getvendor("PQ", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
                //this.QLineItem.controls['refNumberId'].setValue(this.selectedvendors);
                if (res.length == 1) {
                  this.selectedvendors = res[0];
                  this.selectedRefNumberId = this.selectedvendors.refNumberId;
                  this.selectedrefNumber = this.selectedvendors.refNumber;
                  this.calculationTypeId = this.selectedvendors.calculationTypeId;
                  this.calculationParameterId = this.selectedvendors.calculationParameterId;
                  this.calculationTypeReadonly=true;

                  this.taxId = this.selectedvendors.taxId;
                  this.QLineItem.controls["refNumberId"].setValue(this.selectedvendor);
                  var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == this.selectedvendors.calculationParameterId);
                  this.calculationParameter = carculationparms?.calculationParameter;
                  this.QLineItem.controls['calculationParameterId'].setValue(carculationparms);

                  var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == this.selectedvendors.calculationTypeId);
                  this.calculationType = carculationtype?.calculationType;
                  this.QLineItem.controls['calculationTypeId'].setValue(carculationtype);

                  var tax = this.taxcodelist.find(id => id.taxCodeId == this.selectedvendors.taxId);
                  this.taxCodeName = tax?.taxCodeName;
                  this.QLineItem.controls['taxId'].setValue(tax);
                  this.QLineItem.controls['taxPercentage'].setValue(tax?.taxPer);
                  this.taxper = this.QLineItem.controls['taxPercentage'].value;

                  this.selectedvalueCustomercurrency = this.selectedvendors.value;
                  this.selectedminvalueCustomercurrency = this.selectedvendors.minValue
                }
              }

              this.vendorIdbyCurrencyLoad();

            }));
            if (this.vendorType == 'V') {
              this.vendorService.getVendorbyId(this.SelectedvendorId).subscribe(res => {
                this.vendorDetails = res;
                this.QLineItem.controls['vendorCurrencyId'].setValue(this.vendorDetails.vendors);
                this.currencyId = this.vendorDetails.vendors.vendorCurrencyId;
                this.currencyName = this.vendorDetails.vendors.currencyName;
                if (this.vendorDetails.vendors.billingCurrencyId == 1) {
                  this.currencyReadonly = true;
                } else {
                  this.currencyReadonly = false;
                }

              });
            } else if (this.vendorType == 'PV') {
              this.potentialVendorService.getAllPotentialVendorById(this.SelectedvendorId).subscribe(res => {
                this.potentialVendor = res;
                this.QLineItem.controls['vendorCurrencyId'].setValue(this.potentialVendor.potentialVendor);
                this.currencyId = this.potentialVendor.potentialVendor.vendorCurrencyId;
                this.currencyName = this.potentialVendor.potentialVendor.currencyName;
                if (this.potentialVendor.potentialVendor.billingCurrencyId == 1) {
                  this.currencyReadonly = true;
                } else {
                  this.currencyReadonly = false;
                }
              });



            }
          } else if (this.selectedvendor.sourceFrom == "Contract") {
            this.selectedSourceFromId = 2
            var vendor = this.sourceFromList.find(id => id.sourceFromId == 2);
            this.selectedSourceFromName = vendor?.sourceFrom;
            this.QLineItem.controls["sourceFromId"].setValue(vendor);
            const payload = {
              vendorId: this.SelectedvendorId,
              lineitemId: this.selectedLineItemId
            }
            this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
              debugger;
              this.isAmendPriceReadonly = true;
              if (res.length > 0) {
                //this.getvendor("contract", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
                //this.QLineItem.controls['refNumberId'].setValue(this.selectedvendors);
                if (res.length == 1) {
                  this.selectedvendors = res[0];
                  this.selectedRefNumberId = this.selectedvendors.refNumberId;
                  this.selectedrefNumber = this.selectedvendors.refNumber;
                  this.calculationTypeId = this.selectedvendors.calculationTypeId;
                  this.calculationParameterId = this.selectedvendors.calculationParameterId;
                  this.calculationTypeReadonly=true;

                  this.taxId = this.selectedvendors.taxId;
                  var direct = this.sourceFromList.find(id => id.sourceFromId == 2);
                  this.selectedSourceFromId = 2
                  this.selectedSourceFromName = direct?.sourceFrom;
                  this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
                  this.QLineItem.controls['sourceFromId'].setValue(direct);

                  var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == this.selectedvendors.calculationParameterId);
                  this.calculationParameter = carculationparms?.calculationParameter;
                  this.QLineItem.controls['calculationParameterId'].setValue(carculationparms);

                  var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == this.selectedvendors.calculationTypeId);
                  this.calculationType = carculationtype?.calculationType;
                  this.QLineItem.controls['calculationTypeId'].setValue(carculationtype);

                  var tax = this.taxcodelist.find(id => id.taxCodeId == this.selectedvendors.taxId);
                  this.taxCodeName = tax?.taxCodeName;
                  this.QLineItem.controls['taxId'].setValue(tax);
                  this.QLineItem.controls['taxPercentage'].setValue(tax?.taxPer);
                  this.taxper = this.QLineItem.controls['taxPercentage'].value;

                  this.selectedvalueCustomercurrency = this.selectedvendors.valueInVendorCurrency;
                  this.selectedminvalueCustomercurrency = this.selectedvendors.minValueInVendorCurrency;
                }
              }

              this.vendorIdbyCurrencyLoad();

            }));
          }

        }



      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select line item description and then use filter",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

   async AddToList() {

    let isservice = this.QLineItem.controls['serviceInId'].value
    if (isservice?.countryName === "" || isservice?.countryName === undefined) {
      this.QLineItem.controls['serviceInId'].reset();
    }
    let vendor = this.QLineItem.controls['vendorId'].value
    if (vendor?.vendorId === null || vendor?.vendorId === undefined) {
      this.QLineItem.controls['vendorId'].reset();
    }

    let iscalculationParameterId = this.QLineItem.controls['calculationParameterId'].value
    if (iscalculationParameterId?.calculationParameterId === null || iscalculationParameterId?.calculationParameterId === undefined) {
      this.QLineItem.controls['calculationParameterId'].reset();
    }

    let iscalculationTypeId = this.QLineItem.controls['calculationTypeId'].value
    if (iscalculationTypeId?.calculationTypeId === null || iscalculationTypeId?.calculationTypeId === undefined) {
      this.QLineItem.controls['calculationTypeId'].reset();
    }

    let tax = this.QLineItem.controls['taxId'].value
    if (tax?.taxCodeName === "" || tax?.taxCodeName === undefined) {
      this.QLineItem.controls['taxId'].reset();
    }

    if (this.QLineItem.valid) {

      if (this.selectedvalueCustomercurrency != null) {
        const payload: Exchange = {
          fromCurrencyId:   this.currencyId,
          toCurrencyId: this.FromcurrencyId,
          value: this.selectedvalueCustomercurrency
        };
  
        // Perform first API call and wait for response
        this.Qs.CurrencyExchanges(payload).pipe(
          first(),
          switchMap((res) => {
            this.exchangecurrency = res;
            this.cusexchange = this.exchangecurrency.exchangeRate;
  
            // Set the customer exchange rate and value in customer currency
            this.QLineItem.controls['customerExchangeRate'].setValue(this.exchangecurrency.exchangeRate);
            this.QLineItem.controls['valueInCustomerCurrency'].setValue(this.exchangecurrency.convertedValue);
  
            // If valueInCustomerCurrency is set, make the next API call
            if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
              const payload1: Exchange = {
                fromCurrencyId: this.FromcurrencyId,
                toCurrencyId: this.companycurrency.currencyId,
                value: this.QLineItem.controls['valueInCustomerCurrency'].value
              };
              console.log("payload1", payload1);
  
              return this.Qs.CurrencyExchanges(payload1).pipe(first());
            } else {
              return []; // If no value in customer currency, skip to next step
            }
          })
        ).subscribe((res1) => {
          if (res1) {
            this.valueInCompanyCurrency = res1;
            console.log(" this.comp1", this.valueInCompanyCurrency);
            this.QLineItem.controls['valueInCompanyCurrency'].setValue(this.valueInCompanyCurrency.convertedValue);
          }
  
          // Check for selectedminvalueCustomercurrency and proceed similarly
          if (this.selectedminvalueCustomercurrency != null) {
            const payload2: Exchange = {
              fromCurrencyId:  this.currencyId,
              toCurrencyId: this.FromcurrencyId,
              value: this.selectedminvalueCustomercurrency
            };
  
            this.Qs.CurrencyExchanges(payload2).pipe(
              first(),
              switchMap((res2) => {
                this.minexchangecurrency = res2;
                console.log("this.minexchangecurrency", this.minexchangecurrency);
                this.cusexchange = this.minexchangecurrency.exchangeRate;
                this.QLineItem.controls['customerExchangeRate'].setValue(this.minexchangecurrency.exchangeRate);
                this.QLineItem.controls['minValueInCustomerCurrency'].setValue(this.minexchangecurrency.convertedValue);
  
                // If minValueInCustomerCurrency is set, make the next API call
                if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
                  const payload3: Exchange = {
                    fromCurrencyId: this.FromcurrencyId,
                    toCurrencyId: this.companycurrency.currencyId,
                    value: this.QLineItem.controls['minValueInCustomerCurrency'].value
                  };
                  console.log("payload2", payload3);
  
                  return this.Qs.CurrencyExchanges(payload3).pipe(first());
                } else {
                  return []; // If no value, skip to the next step
                }
              })
            ).subscribe((res3) => {
              if (res3) {
                this.minValueInCompanyCurrency = res3;
                console.log("this.comp2", this.minValueInCompanyCurrency);
                this.QLineItem.controls['minValueInCompanyCurrency'].setValue(this.minValueInCompanyCurrency.convertedValue);
              }
  
              // Perform additional logic for vendor currencies
              if (this.selectedvalueCustomercurrency != null) {
                const payload4: Exchange = {
                  fromCurrencyId: this.currencyId,
                  toCurrencyId: this.companycurrency.currencyId,
                  value: this.selectedvalueCustomercurrency
                };
  
                this.Qs.CurrencyExchanges(payload4).pipe(
                  first(),
                  switchMap((res4) => {
                    this.exchangecurrencyforvendor = res4;
                    this.vendorexchange = this.exchangecurrencyforvendor.exchangeRate;
                    this.valuecompanynew = this.exchangecurrencyforvendor.convertedValue;
  
                    // If selectedminvalueCustomercurrency exists, make another API call
                    if (this.selectedminvalueCustomercurrency != null) {
                      const payload5: Exchange = {
                        fromCurrencyId: this.currencyId,
                        toCurrencyId: this.companycurrency.currencyId,
                        value: this.selectedminvalueCustomercurrency
                      };
  
                      return this.Qs.CurrencyExchanges(payload5).pipe(first());
                    } else {
                      return []; // Skip if no value
                    }
                  })
                ).subscribe((res5) => {
                  if (res5) {
                    this.minexchangecurrencyforvendor = res5;
                    this.minvaluevendor = this.exchangecurrencyforvendor.convertedValue;
                    this.AddingLineItem();
                  }
                });
              }
            });
          }
        });
      } else {
        // Check if valueInCustomerCurrency is set before proceeding with the first API call
        if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
          const payload1: Exchange = {
            fromCurrencyId: this.FromcurrencyId,
            toCurrencyId: this.companycurrency.currencyId,
            value: this.QLineItem.controls['valueInCustomerCurrency'].value
          };
          console.log("payload1", payload1);
  
          // Perform the first API call and wait for the response
          this.Qs.CurrencyExchanges(payload1).pipe(
            first()
          ).subscribe((res1) => {
            this.valueInCompanyCurrency = res1;
            console.log("this.comp1", this.valueInCompanyCurrency);
            this.QLineItem.controls['valueInCompanyCurrency'].setValue(this.valueInCompanyCurrency.convertedValue);
  
            // Now check if minValueInCustomerCurrency is set before proceeding with the second API call
            if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
              const payload2: Exchange = {
                fromCurrencyId: this.FromcurrencyId,
                toCurrencyId: this.companycurrency.currencyId,
                value: this.QLineItem.controls['minValueInCustomerCurrency'].value
              };
              console.log("payload2", payload2);
  
              // Perform the second API call and wait for the response
              this.Qs.CurrencyExchanges(payload2).pipe(
                first()
              ).subscribe((res2) => {
                this.minValueInCompanyCurrency = res2;
                console.log("this.comp2", this.minValueInCompanyCurrency);
                this.QLineItem.controls['minValueInCompanyCurrency'].setValue(this.minValueInCompanyCurrency.convertedValue);
              });
              if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
                const payload4: Exchange = {
                  fromCurrencyId: this.FromcurrencyId,
                  toCurrencyId: this.companycurrency.currencyId,
                  value: this.QLineItem.controls['valueInCustomerCurrency'].value 
                };
        
                this.Qs.CurrencyExchanges(payload4).pipe(
                  first(),
                  switchMap((res4) => {
                    this.exchangecurrencyforvendor = res4;
                    this.vendorexchange = this.exchangecurrencyforvendor.exchangeRate;
                    this.valuecompanynew = this.exchangecurrencyforvendor.convertedValue;
        
                    // If selectedminvalueCustomercurrency exists, make another API call
                    if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
                      const payload5: Exchange = {
                        fromCurrencyId: this.FromcurrencyId,
                        toCurrencyId: this.companycurrency.currencyId,
                        value: this.QLineItem.controls['minValueInCustomerCurrency'].value 
                      };
        
                      return this.Qs.CurrencyExchanges(payload5).pipe(first());
                    } else {
                      return []; // Skip if no value
                    }
                  })
                ).subscribe((res5) => {
                  if (res5) {
                    this.minexchangecurrencyforvendor = res5;
                    this.minvaluevendor = this.exchangecurrencyforvendor.convertedValue;
                    this.AddingLineItem();
                  }
                });
              }
            }
          });
        }
  
  
      }
     
    } else {
      this.QLineItem.markAllAsTouched();
      this.validateall(this.QLineItem);
    }

  }

  AddingLineItem(){
    const LineItem = {
      ...this.QLineItem.value,
      vendorId: this.SelectedvendorId,
      lineItemId: this.selectedLineItemId,
      lineItemCategoryId: this.selectedLineItemcatId,
      lineItemCode: this.SelectedLineCode,
      lineItemCategoryName: this.selectedLineItemcatName,
      lineItemName: this.SelectedlineItemName,
      serviceInId: this.selectedServiceinId,
      countryName: this.selectedServiceInName,
      vendorName: this.selectedvendorName,
      vendorCurrencyId: this.currencyId,
      currencyName: this.currencyName,
      calculationParameterId: this.calculationParameterId,
      calculationParameter: this.calculationParameter,
      calculationTypeId: this.calculationTypeId,
      calculationType: this.calculationType,
      taxId: this.taxId,
      taxCodeName: this.taxCodeName,
      selectedvendor: this.selectedvendor,
      refNumberId: this.selectedRefNumberId,
      refNumber: this.selectedrefNumber,
      sourceFromId: this.selectedSourceFromId,
      sourceFrom: this.selectedSourceFromName,
      valueInVendorCurrency: this.selectedvalueCustomercurrency,
      minValueInVendorCurrency: this.selectedminvalueCustomercurrency,
      customerExchangeRate: this.cusexchange,
      vendorcompany: this.valuecompanynew,
      minvendorcompany: this.minvaluevendor,
      vendorexchange: this.vendorexchange

    }

    const AllLineItems: QlineItem = {
      ...LineItem,
      quotationLineItemVendorValues: this.data.LineData.quotationLineItemVendorValues,
    }

    console.log("AllLineItems--ARAVINDH",AllLineItems)
    this.dialogRef.close(AllLineItems);
  }

  //#region vendor
  getAllvendors() {
    this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
      this.filteredvendors = res;
      this.getallvendorFun();
      if (this.selectedSourceFromId == 1) {
        var vendortype = this.filteredvendors.find(id => id.vendorId == this.SelectedvendorId);
        this.vendorType = vendortype?.vendorType;
        if (this.vendorType == 'V') {
          this.vendorTypeId = 2;
        } else if (this.vendorType == 'PV') {
          this.vendorTypeId = 1;
        }
        this.getvendor("PQ", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
      } else {
        this.getvendor("Contract", 2, this.SelectedvendorId, this.selectedLineItemId);
      }
    });
  }

  getallvendorFun() {
    this.filteredvendorOptions$ = this.QLineItem.controls['vendorId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.vendorName)),
      map((name: any) => (name ? this.filteredvendorOptions(name) : this.filteredvendors?.slice()))
    );
  }
  private filteredvendorOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.filteredvendors.filter((option: any) => option.vendorName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCalculationPar();
  }
  NoDatavendors(): any {
    this.QLineItem.controls['vendorId'].setValue('');
    return this.filteredvendors;
  }
  displayvendorFn(data: any): string {
    return data && data.vendorName ? data.vendorName : '';
  }
  vendorSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.SelectedvendorId = selectedValue.vendorId;
    this.selectedvendorName = selectedValue.vendorName;
    this.vendorType = selectedValue.vendorType;
    this.selectedSourceFromId = null;
    this.selectedSourceFromName = null;
    this.selectedrefNumber = null;
    this.selectedRefNumberId = null;
    this.calculationTypeId = null;
    this.calculationParameterId = null;
    this.taxId = null;
    this.calculationParameter = null;
    this.calculationType = null;
    this.taxCodeName = null;
    this.QLineItem.controls['sourceFromId'].setValue(null);
    this.QLineItem.controls['refNumberId'].setValue(null);
    this.QLineItem.controls['calculationParameterId'].setValue(null);
    this.QLineItem.controls['calculationTypeId'].setValue(null);
    this.QLineItem.controls['taxId'].setValue(null);
    this.QLineItem.controls['valueInCustomerCurrency'].reset();
    this.QLineItem.controls['customerExchangeRate'].reset();
    this.QLineItem.controls['valueInCompanyCurrency'].reset();
    this.QLineItem.controls['minValueInCustomerCurrency'].setValue(0);
    this.QLineItem.controls['customerExchangeRate'].reset();
    if (this.vendorType == 'V') {
      this.vendorTypeId = 2;
    } else if (this.vendorType == 'PV') {
      this.vendorTypeId = 1;
    }

    const payload = {
      vendorId: this.SelectedvendorId,
      lineitemId: this.selectedLineItemId
    }
    this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
      console.log("res----------tu5gjgh--", res);
      debugger;
      if (res.length > 0) {
        this.selectedvendors = res;
        var direct = this.sourceFromList.find(id => id.sourceFromId == 2);
        this.selectedSourceFromId = 2
        this.selectedSourceFromName = direct?.sourceFrom;
        this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
        this.QLineItem.controls['sourceFromId'].setValue(direct);
        this.QLineItem.controls['refNumberId'].setValue(this.selectedvendors);
        if (res.length == 1) {
          this.selectedvendors = res[0];
          this.selectedRefNumberId = this.selectedvendors.refNumberId;
          this.selectedrefNumber = this.selectedvendors.refNumber;
          this.calculationTypeId = this.selectedvendors.calculationTypeId;
          this.calculationParameterId = this.selectedvendors.calculationParameterId;
          this.calculationTypeReadonly=true;

          this.taxId = this.selectedvendors.taxId;
          this.QLineItem.controls['refNumberId'].setValue(this.selectedvendors);

          var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == this.selectedvendors.calculationParameterId);
          this.calculationParameter = carculationparms?.calculationParameter;
          this.QLineItem.controls['calculationParameterId'].setValue(carculationparms);

          var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == this.selectedvendors.calculationTypeId);
          this.calculationType = carculationtype?.calculationType;
          this.QLineItem.controls['calculationTypeId'].setValue(carculationtype);

          var tax = this.taxcodelist.find(id => id.taxCodeId == this.selectedvendors.taxId);
          this.taxCodeName = tax?.taxCodeName;
          this.QLineItem.controls['taxId'].setValue(tax);
          this.QLineItem.controls['taxPercentage'].setValue(tax?.taxPer);
          this.taxper = this.QLineItem.controls['taxPercentage'].value;
          this.selectedvalueCustomercurrency = this.selectedvendors.valueInVendorCurrency;
          this.selectedminvalueCustomercurrency = this.selectedvendors.minValueInVendorCurrency
        }
      } else {
        this.vendorCurrencyGet();
      }
      this.isAmendPriceReadonly = true;
      this.vendorIdbyCurrencyLoad();
    }));
  }

  SEmpty(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.selectedSourceFromName = null;
      this.selectedRefNumberId = null;
      this.selectedrefNumber = null;
      this.calculationTypeId = null;
      this.calculationParameterId = null;
      this.calculationParameter = null;
      this.calculationType = null;
      this.taxCodeName = null;
      this.PQandCdrp = [];
      this.QLineItem.controls['sourceFromId'].setValue(null);
      this.QLineItem.controls['refNumberId'].setValue(null);
      this.QLineItem.controls['calculationParameterId'].setValue(null);
      this.QLineItem.controls['calculationTypeId'].setValue(null);
      this.QLineItem.controls['taxId'].setValue(null);
      this.QLineItem.controls['valueInCustomerCurrency'].reset();
      this.QLineItem.controls['customerExchangeRate'].reset();
      this.QLineItem.controls['valueInCompanyCurrency'].reset();
      this.QLineItem.controls['minValueInCustomerCurrency'].setValue(0);
      this.QLineItem.controls['customerExchangeRate'].reset();
    }

  }

  VEmpty(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.selectedSourceFromName = null;
      this.selectedRefNumberId = null;
      this.selectedrefNumber = null;
      this.calculationTypeId = null;
      this.calculationParameterId = null;
      this.calculationParameter = null;
      this.calculationType = null;
      this.taxCodeName = null;
      this.PQandCdrp = [];
      this.QLineItem.controls['sourceFromId'].setValue(null);
      this.QLineItem.controls['refNumberId'].setValue(null);
      this.QLineItem.controls['calculationParameterId'].setValue(null);
      this.QLineItem.controls['calculationTypeId'].setValue(null);
      this.QLineItem.controls['taxId'].setValue(null);
      this.QLineItem.controls['valueInCustomerCurrency'].reset();
      this.QLineItem.controls['customerExchangeRate'].reset();
      this.QLineItem.controls['valueInCompanyCurrency'].reset();
      this.QLineItem.controls['minValueInCustomerCurrency'].setValue(0);
      this.QLineItem.controls['customerExchangeRate'].reset();
    }

  }

  getvendor(seleted: string, Vtype: any, Vid: number, lineitem: number) {
    this.Qs.GetQVerndorDetails(seleted, Vtype, Vid, lineitem).subscribe(res => {
      this.PQandCdrp = res;
      var refid = this.PQandCdrp.find((id => id.refNumberId == this.selectedRefNumberId))
      this.QLineItem.controls['refNumberId'].setValue(refid);
      this.selectedrefNumber = refid?.refNumber;
      this.refNumberFun();
    });
  }

  //#region sourceFrom
  getSourceFroms() {
    this.Cs.GetAllSourceFrom().subscribe((result) => {
      this.sourceFromList = result;
      this.sourceFromFun();
    });
  }
  sourceFromFun() {
    this.filteredSourceFromOptions$ = this.QLineItem.controls['sourceFromId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.sourceFrom)),
      map((name: any) => (name ? this.filteredSourceFromOptions(name) : this.sourceFromList?.slice()))
    );
  }
  private filteredSourceFromOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.sourceFromList.filter((option: any) => option.sourceFrom.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataSourceFrom();
  }
  NoDataSourceFrom(): any {
    this.QLineItem.controls['sourceFromId'].setValue('');
    return this.sourceFromList;
  }
  displaySourceFromListLabelFn(data: any): string {
    return data && data.sourceFrom ? data.sourceFrom : '';
  }
  sourceFromSelectedOption(data: any) {
    let selectedValue = data.option.value;
    this.selectedSourceFromId = selectedValue.sourceFromId;
    this.selectedSourceFromName = selectedValue.sourceFrom;
   // this.getSourceFrom(this.selectedSourceFromId);
    if (this.selectedSourceFromId ==1) {
      this.getvendor("PQ", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
      this.QLineItem.controls['refNumberId'].reset();
      this.PQandCdrp=[];
      
    }
    if(this.selectedSourceFromId == 2) {
      this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
      this.QLineItem.controls['refNumberId'].reset();
      this.PQandCdrp=[];
    }

    if (this.selectedSourceFromId == 3) {
      this.QLineItem.controls['taxId'].reset();
      this.QLineItem.controls['refNumberId'].reset();
      this.QLineItem.controls['calculationTypeId'].reset();
      this.QLineItem.controls['calculationParameterId'].reset();
      this.QLineItem.controls['valueInCustomerCurrency'].reset();
      this.QLineItem.controls['customerExchangeRate'].reset();
      this.QLineItem.controls['valueInCompanyCurrency'].reset();
      this.QLineItem.controls['minValueInCustomerCurrency'].setValue(0);
      this.QLineItem.controls['customerExchangeRate'].reset();
      this.QLineItem.controls['refNumberId'].disable();

      this.taxId = '';
      this.calculationTypeId = '';
      this.calculationParameterId = '';
      this.taxId = '';
      this.isAmendPriceReadonly = false;
      this.vendorCurrencyGet();
      this.selectedvalueCustomercurrency = null;
      this.selectedminvalueCustomercurrency = null;
      //this.LineItem=[];
    }else{
      this.QLineItem.controls['refNumberId'].enable();
    }
  }

  vendorCurrencyGet() {
    if (this.vendorType == 'V') {
      this.vendorService.getVendorbyId(this.SelectedvendorId).subscribe(res => {
        this.vendorDetails = res;
        this.QLineItem.controls['vendorCurrencyId'].setValue(this.vendorDetails.vendors);
        this.currencyId = this.vendorDetails.vendors.vendorCurrencyId;
        this.currencyName = this.vendorDetails.vendors.currencyName;
        if (this.vendorDetails.vendors.billingCurrencyId == 1) {
          this.currencyReadonly = true;
        } else {
          this.currencyReadonly = false;
        }

      });
    } else if (this.vendorType == 'PV') {
      this.potentialVendorService.getAllPotentialVendorById(this.SelectedvendorId).subscribe(res => {
        this.potentialVendor = res;
        this.QLineItem.controls['vendorCurrencyId'].setValue(this.potentialVendor.potentialVendor);
        this.currencyId = this.potentialVendor.potentialVendor.vendorCurrencyId;
        this.currencyName = this.potentialVendor.potentialVendor.currencyName;
        if (this.potentialVendor.potentialVendor.billingCurrencyId == 1) {
          this.currencyReadonly = true;
        } else {
          this.currencyReadonly = false;
        }
      });
    }
  }
  //#endregion sourceFrom
  getSourceFrom(id: number) {
    const Data = {
      vendorType: id,
      vendorId: this.SelectedvendorId
    }
    this.Cs.GetAllPQandContract(Data).subscribe((res => {
      this.PQandCdrp = res;
      this.refNumberFun();
    }));
  }

  refNumberFun() {
    this.filteredRefNumberOptions$ = this.QLineItem.controls['refNumberId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.refNumber)),
      map((name: any) => (name ? this.filteredRefNumberOptions(name) : this.PQandCdrp?.slice()))
    );
  }
  private filteredRefNumberOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.PQandCdrp.filter((option: any) => option.refNumber.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataRefNumber();
  }
  NoDataRefNumber(): any {
    this.QLineItem.controls['refNumberId'].setValue('');
    return this.PQandCdrp;
  }
  displayRefNumberListLabelFn(data: any): string {
    return data && data.refNumber ? data.refNumber : '';
  }
  refNumberSelectedOption(data: any) {
    let selectedValue = data.option.value;
    this.selectedRefNumberId = selectedValue.refNumberId;
    this.selectedrefNumber = selectedValue.refNumber;

    this.calculationTypeId = null;
    this.calculationParameterId = null;
    this.taxId = null;
    this.calculationParameter = null;
    this.calculationType = null;
    this.taxCodeName = null;

    this.QLineItem.controls['calculationParameterId'].reset();
    this.QLineItem.controls['calculationTypeId'].reset();
    this.QLineItem.controls['taxId'].reset();
    this.QLineItem.controls['valueInCustomerCurrency'].reset();
    this.QLineItem.controls['customerExchangeRate'].reset();
    this.QLineItem.controls['valueInCompanyCurrency'].reset();
    this.QLineItem.controls['minValueInCustomerCurrency'].setValue(0);
    this.QLineItem.controls['customerExchangeRate'].reset();

    this.isAmendPriceReadonly = true;
    if (this.selectedSourceFromName == "PQ") {

      const payload = {
        vendorId: this.SelectedvendorId,
        lineitemId: this.selectedLineItemId
      }
      this.Qs.Searchpq(payload).subscribe((res => {
        debugger;
        this.isAmendPriceReadonly = true;
        if (res.length > 0) {
          if (res.length == 1) {
            this.selectedvendors = res[0];
            this.selectedRefNumberId = this.selectedvendors.refNumberId;
            this.selectedrefNumber = this.selectedvendors.refNumber;
            this.calculationTypeId = this.selectedvendors.calculationTypeId;
            this.calculationParameterId = this.selectedvendors.calculationParameterId;
            this.calculationTypeReadonly=true;

            this.taxId = this.selectedvendors.taxId;
            var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == this.selectedvendors.calculationParameterId);
            this.calculationParameter = carculationparms?.calculationParameter;
            this.QLineItem.controls['calculationParameterId'].setValue(carculationparms);

            var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == this.selectedvendors.calculationTypeId);
            this.calculationType = carculationtype?.calculationType;
            this.QLineItem.controls['calculationTypeId'].setValue(carculationtype);

            var tax = this.taxcodelist.find(id => id.taxCodeId == this.selectedvendors.taxId);
            this.taxCodeName = tax?.taxCodeName;
            this.QLineItem.controls['taxId'].setValue(tax);
            this.QLineItem.controls['taxPercentage'].setValue(tax?.taxPer);
            this.taxper = this.QLineItem.controls['taxPercentage'].value;

            this.selectedvalueCustomercurrency = this.selectedvendors.value;
            this.selectedminvalueCustomercurrency = this.selectedvendors.minValue;
          }
        }

        this.vendorIdbyCurrencyLoad();

      }));
      if (this.vendorType == 'V') {
        this.vendorService.getVendorbyId(this.SelectedvendorId).subscribe(res => {
          this.vendorDetails = res;
          this.QLineItem.controls['vendorCurrencyId'].setValue(this.vendorDetails.vendors);
          this.currencyId = this.vendorDetails.vendors.vendorCurrencyId;
          this.currencyName = this.vendorDetails.vendors.currencyName;
          if (this.vendorDetails.vendors.billingCurrencyId == 1) {
            this.currencyReadonly = true;
          } else {
            this.currencyReadonly = false;
          }

        });
      } else if (this.vendorType == 'PV') {
        this.potentialVendorService.getAllPotentialVendorById(this.SelectedvendorId).subscribe(res => {
          this.potentialVendor = res;
          this.QLineItem.controls['vendorCurrencyId'].setValue(this.potentialVendor.potentialVendor);
          this.currencyId = this.potentialVendor.potentialVendor.vendorCurrencyId;
          this.currencyName = this.potentialVendor.potentialVendor.currencyName;
          if (this.potentialVendor.potentialVendor.billingCurrencyId == 1) {
            this.currencyReadonly = true;
          } else {
            this.currencyReadonly = false;
          }
        });
      }
    } else {
      const payload = {
        vendorId: this.SelectedvendorId,
        lineitemId: this.selectedLineItemId
      }
      this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
        debugger;
        this.isAmendPriceReadonly = true;
        if (res.length > 0) {
          if (res.length == 1) {
            this.selectedvendors = res[0];
            this.selectedRefNumberId = this.selectedvendors.refNumberId;
            this.selectedrefNumber = this.selectedvendors.refNumber;
            this.calculationTypeId = this.selectedvendors.calculationTypeId;
            this.calculationParameterId = this.selectedvendors.calculationParameterId;
            this.calculationTypeReadonly=true;
            this.taxId = this.selectedvendors.taxId;

            var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == this.selectedvendors.calculationParameterId);
            this.calculationParameter = carculationparms?.calculationParameter;
            this.QLineItem.controls['calculationParameterId'].setValue(carculationparms);

            var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == this.selectedvendors.calculationTypeId);
            this.calculationType = carculationtype?.calculationType;
            this.QLineItem.controls['calculationTypeId'].setValue(carculationtype);

            var tax = this.taxcodelist.find(id => id.taxCodeId == this.selectedvendors.taxId);
            this.taxCodeName = tax?.taxCodeName;
            this.QLineItem.controls['taxId'].setValue(tax);
            this.QLineItem.controls['taxPercentage'].setValue(tax?.taxPer);
            this.taxper = this.QLineItem.controls['taxPercentage'].value;

            this.selectedvalueCustomercurrency = this.selectedvendors.valueInVendorCurrency;
            this.selectedminvalueCustomercurrency = this.selectedvendors.minValueInVendorCurrency;
          }
        }

        this.vendorIdbyCurrencyLoad();

      }));
    }


    this.vendorIdbyCurrencyLoad();
  }
  //#region close;
  close() {
    this.dialogRef.close();
  }

  //#region Validate
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

  //#region FilterDialog
  FilterDialog() {
    if (!this.SelectedvendorId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Vendor",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (!this.selectedLineItemId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Line Item",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    debugger;
    const dialogRef = this.dialog.open(JoebVendorfilterDialogComponent, {

      data: {
        refNumber: this.selectedrefNumber, vendorId: this.SelectedvendorId, vendorType: this.vendorType, sourceFrom: this.selectedSourceFromName, lineItem: this.selectedLineItemId,

      },
      disableClose: true,
      autoFocus: false,
      height: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.selectedvalue == "Contract") {
          var direct = this.sourceFromList.find(id => id.sourceFromId == 2);
          this.selectedSourceFromId = 2
          this.selectedSourceFromName = direct?.sourceFrom;
          this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
          this.QLineItem.controls['sourceFromId'].setValue(direct);
          this.selectedRefNumberId = result.seletedItem.refNumberId;
          this.selectedrefNumber = result.selectedrefnumber;
          this.calculationTypeId = result.seletedItem.calculationTypeId;
          this.calculationParameterId = result.seletedItem.calculationParameterId;
          this.calculationTypeReadonly=true;

          this.taxId = result.seletedItem.taxId;
          this.QLineItem.controls['refNumberId'].setValue(result.seletedItem);

          var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == result.seletedItem.calculationParameterId);
          this.calculationParameter = carculationparms?.calculationParameter;
          this.QLineItem.controls['calculationParameterId'].setValue(carculationparms);

          var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == result.seletedItem.calculationTypeId);
          this.calculationType = carculationtype?.calculationType;
          this.QLineItem.controls['calculationTypeId'].setValue(carculationtype);

          var tax = this.taxcodelist.find(id => id.taxCodeId == result.seletedItem.taxId);
          this.taxCodeName = tax?.taxCodeName;
          this.QLineItem.controls['taxId'].setValue(tax);
          this.QLineItem.controls['taxPercentage'].setValue(tax?.taxPer);
          this.taxper = this.QLineItem.controls['taxPercentage'].value;
          this.selectedvalueCustomercurrency = result.seletedItem.valueInVendorCurrency;
          this.selectedminvalueCustomercurrency = result.seletedItem.minValueInVendorCurrency
        } else {
          debugger;
          var direct = this.sourceFromList.find(id => id.sourceFromId == 1);
          this.selectedSourceFromId = 1
          this.selectedSourceFromName = direct?.sourceFrom;
          this.QLineItem.controls['sourceFromId'].setValue(direct);
          this.selectedRefNumberId = result.selectedrefnumId;
          this.calculationTypeId = result.seletedItem.calculationTypeId;
          this.calculationParameterId = result.seletedItem.calculationParameterId;
          this.calculationTypeReadonly=true;

          this.taxId = result.seletedItem.taxId;
          this.getvendor("PQ", this.vendorTypeId, this.SelectedvendorId, this.selectedLineItemId);
          var ref = this.PQandCdrp.find(id => id.refNumberId == result.selectedrefnumId);
          this.QLineItem.controls['refNumberId'].setValue(ref);
          this.selectedrefNumber = result.selectedrefnumber;


          var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == result.seletedItem.calculationParameterId);
          this.calculationParameter = carculationparms?.calculationParameter;
          this.QLineItem.controls['calculationParameterId'].setValue(carculationparms);

          var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == result.seletedItem.calculationTypeId);
          this.calculationType = carculationtype?.calculationType;
          this.QLineItem.controls['calculationTypeId'].setValue(carculationtype);

          var tax = this.taxcodelist.find(id => id.taxCodeId == result.seletedItem.taxId);
          this.taxCodeName = tax?.taxCodeName;
          this.QLineItem.controls['taxId'].setValue(tax);
          this.QLineItem.controls['taxPercentage'].setValue(tax?.taxPer);
          this.taxper = this.QLineItem.controls['taxPercentage'].value;
          this.selectedvalueCustomercurrency = result.seletedItem.value;
          this.selectedminvalueCustomercurrency = result.seletedItem.minValue;
        }

      }
      this.vendorIdbyCurrencyLoad();
    });
  }

  CoinFunction() {

  }

  vendorIdbyCurrencyLoad() {
    debugger;
    this.jobOrderExpenseBookingService.GetVerndorCurrencyDetails(this.selectedSourceFromId, this.vendorTypeId, this.SelectedvendorId, this.selectedrefNumber).subscribe(res => {
      this.vendorcurrencyDetails = res;

      if (this.selectedSourceFromName == 'Contract') {
        let currencyValue = this.vendorcurrencyDetails.find(x => x.refNumber == this.selectedrefNumber);
        this.currencyId = this.vendorcurrencyDetails[0].currencyId;
        this.currencyName = this.vendorcurrencyDetails[0].currencyName;
        this.QLineItem.controls['vendorCurrencyId'].setValue(currencyValue)
        console.log('currencyValue', currencyValue);
      }
      else {
        this.currencyId = this.vendorcurrencyDetails[0].currencyId;
        this.currencyName = this.vendorcurrencyDetails[0].currencyName;
        let currencyValue = this.vendorcurrencyDetails[0];
        this.QLineItem.controls['vendorCurrencyId'].setValue(currencyValue);
        console.log('currencyValue', currencyValue);
      }
      // if (this.selectedvalueCustomercurrency != null) {
      //   const payload: Exchange = {
      //     fromCurrencyId: this.FromcurrencyId,
      //     toCurrencyId: this.currencyId,
      //     value: this.selectedvalueCustomercurrency
      //   }
      //   this.Qs.CurrencyExchanges(payload).subscribe((res => {
      //     this.exchangecurrency = res;
      //     this.cusexchange = this.exchangecurrency.exchangeRate;
      //     this.QLineItem.controls['customerExchangeRate'].setValue(this.exchangecurrency.exchangeRate);
      //     var value1 = this.QLineItem.controls['valueInCustomerCurrency'].setValue(this.exchangecurrency.convertedValue);

      //     if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
      //       const payload: Exchange = {
      //         fromCurrencyId: this.FromcurrencyId,
      //         toCurrencyId: this.companycurrency.currencyId,
      //         value: this.QLineItem.controls['valueInCustomerCurrency'].value
      //       }
      //       console.log("payload1", payload);
      //       this.Qs.CurrencyExchanges(payload).subscribe((res => {
      //         this.valueInCompanyCurrency = res;
      //         console.log(" this.comp1", this.valueInCompanyCurrency);
      //         var value1 = this.QLineItem.controls['valueInCompanyCurrency'].setValue(this.valueInCompanyCurrency.convertedValue);
      //       }));
      //     }


      //     if (this.selectedminvalueCustomercurrency != null) {
      //       const payload: Exchange = {
      //         fromCurrencyId: this.FromcurrencyId,
      //         toCurrencyId: this.currencyId,
      //         value: this.selectedminvalueCustomercurrency
      //       }

      //       this.Qs.CurrencyExchanges(payload).subscribe((res => {
      //         this.minexchangecurrency = res;
      //         console.log(" this.minexchangecurrency", this.minexchangecurrency);
      //         this.cusexchange = this.minexchangecurrency.exchangeRate;
      //         this.QLineItem.controls['customerExchangeRate'].setValue(this.minexchangecurrency.exchangeRate);
      //         var value1 = this.QLineItem.controls['minValueInCustomerCurrency'].setValue(this.minexchangecurrency.convertedValue);
      //         if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
      //           const payload: Exchange = {
      //             fromCurrencyId: this.FromcurrencyId,
      //             toCurrencyId: this.companycurrency.currencyId,
      //             value: this.QLineItem.controls['minValueInCustomerCurrency'].value
      //           }
      //           console.log("payload2", payload);
      //           this.Qs.CurrencyExchanges(payload).subscribe((res => {
      //             this.minValueInCompanyCurrency = res;
      //             console.log(" this.comp2", this.minValueInCompanyCurrency);
      //             var value1 = this.QLineItem.controls['minValueInCompanyCurrency'].setValue(this.minValueInCompanyCurrency.convertedValue);
      //           }));
      //         }
      //       }));
      //     }
      //   }));
      // }


      // if (this.selectedvalueCustomercurrency != null) {
      //   const payload: Exchange = {
      //     fromCurrencyId: this.FromcurrencyId,
      //     toCurrencyId: this.companycurrency.currencyId,
      //     value: this.selectedvalueCustomercurrency
      //   }
      //   this.Qs.CurrencyExchanges(payload).subscribe((res => {
      //     this.exchangecurrencyforvendor = res;
      //     this.vendorexchange = this.exchangecurrencyforvendor.exchangeRate;
      //     this.valuecompanynew = this.exchangecurrencyforvendor.convertedValue;



      //     if (this.selectedminvalueCustomercurrency != null) {
      //       const payload: Exchange = {
      //         fromCurrencyId: this.FromcurrencyId,
      //         toCurrencyId: this.companycurrency.currencyId,
      //         value: this.selectedminvalueCustomercurrency
      //       }

      //       this.Qs.CurrencyExchanges(payload).subscribe((res => {
      //         this.minexchangecurrencyforvendor = res;
      //         this.minvaluevendor = this.exchangecurrencyforvendor.convertedValue;         
      //       }));
      //     }
      //   }));
      // }
      this.makeExchangeCalls();
    });
  }

  //#region Make exchange Calls
  makeExchangeCalls() {
    if (this.selectedvalueCustomercurrency != null) {
      const payload: Exchange = {
        fromCurrencyId:   this.currencyId,
        toCurrencyId: this.FromcurrencyId,
        value: this.selectedvalueCustomercurrency
      };

      // Perform first API call and wait for response
      this.Qs.CurrencyExchanges(payload).pipe(
        first(),
        switchMap((res) => {
          this.exchangecurrency = res;
          this.cusexchange = this.exchangecurrency.exchangeRate;

          // Set the customer exchange rate and value in customer currency
          this.QLineItem.controls['customerExchangeRate'].setValue(this.exchangecurrency.exchangeRate);
          this.QLineItem.controls['valueInCustomerCurrency'].setValue(this.exchangecurrency.convertedValue);

          // If valueInCustomerCurrency is set, make the next API call
          if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
            const payload1: Exchange = {
              fromCurrencyId: this.FromcurrencyId,
              toCurrencyId: this.companycurrency.currencyId,
              value: this.QLineItem.controls['valueInCustomerCurrency'].value
            };
            console.log("payload1", payload1);

            return this.Qs.CurrencyExchanges(payload1).pipe(first());
          } else {
            return []; // If no value in customer currency, skip to next step
          }
        })
      ).subscribe((res1) => {
        if (res1) {
          this.valueInCompanyCurrency = res1;
          console.log(" this.comp1", this.valueInCompanyCurrency);
          this.QLineItem.controls['valueInCompanyCurrency'].setValue(this.valueInCompanyCurrency.convertedValue);
        }

        // Check for selectedminvalueCustomercurrency and proceed similarly
        if (this.selectedminvalueCustomercurrency != null) {
          const payload2: Exchange = {
            fromCurrencyId:  this.currencyId,
            toCurrencyId: this.FromcurrencyId,
            value: this.selectedminvalueCustomercurrency
          };

          this.Qs.CurrencyExchanges(payload2).pipe(
            first(),
            switchMap((res2) => {
              this.minexchangecurrency = res2;
              console.log("this.minexchangecurrency", this.minexchangecurrency);
              this.cusexchange = this.minexchangecurrency.exchangeRate;
              this.QLineItem.controls['customerExchangeRate'].setValue(this.minexchangecurrency.exchangeRate);
              this.QLineItem.controls['minValueInCustomerCurrency'].setValue(this.minexchangecurrency.convertedValue);

              // If minValueInCustomerCurrency is set, make the next API call
              if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
                const payload3: Exchange = {
                  fromCurrencyId: this.FromcurrencyId,
                  toCurrencyId: this.companycurrency.currencyId,
                  value: this.QLineItem.controls['minValueInCustomerCurrency'].value
                };
                console.log("payload2", payload3);

                return this.Qs.CurrencyExchanges(payload3).pipe(first());
              } else {
                return []; // If no value, skip to the next step
              }
            })
          ).subscribe((res3) => {
            if (res3) {
              this.minValueInCompanyCurrency = res3;
              console.log("this.comp2", this.minValueInCompanyCurrency);
              this.QLineItem.controls['minValueInCompanyCurrency'].setValue(this.minValueInCompanyCurrency.convertedValue);
            }

            // Perform additional logic for vendor currencies
            if (this.selectedvalueCustomercurrency != null) {
              const payload4: Exchange = {
                fromCurrencyId: this.currencyId,
                toCurrencyId: this.companycurrency.currencyId,
                value: this.selectedvalueCustomercurrency
              };

              this.Qs.CurrencyExchanges(payload4).pipe(
                first(),
                switchMap((res4) => {
                  this.exchangecurrencyforvendor = res4;
                  this.vendorexchange = this.exchangecurrencyforvendor.exchangeRate;
                  this.valuecompanynew = this.exchangecurrencyforvendor.convertedValue;

                  // If selectedminvalueCustomercurrency exists, make another API call
                  if (this.selectedminvalueCustomercurrency != null) {
                    const payload5: Exchange = {
                      fromCurrencyId: this.currencyId,
                      toCurrencyId: this.companycurrency.currencyId,
                      value: this.selectedminvalueCustomercurrency
                    };

                    return this.Qs.CurrencyExchanges(payload5).pipe(first());
                  } else {
                    return []; // Skip if no value
                  }
                })
              ).subscribe((res5) => {
                if (res5) {
                  this.minexchangecurrencyforvendor = res5;
                  this.minvaluevendor = this.exchangecurrencyforvendor.convertedValue;
                  //this.AddingLineItem();
                }
              });
            }
          });
        }
      });
    } else {
      // Check if valueInCustomerCurrency is set before proceeding with the first API call
      if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
        const payload1: Exchange = {
          fromCurrencyId: this.FromcurrencyId,
          toCurrencyId: this.companycurrency.currencyId,
          value: this.QLineItem.controls['valueInCustomerCurrency'].value
        };
        console.log("payload1", payload1);

        // Perform the first API call and wait for the response
        this.Qs.CurrencyExchanges(payload1).pipe(
          first()
        ).subscribe((res1) => {
          this.valueInCompanyCurrency = res1;
          console.log("this.comp1", this.valueInCompanyCurrency);
          this.QLineItem.controls['valueInCompanyCurrency'].setValue(this.valueInCompanyCurrency.convertedValue);

          // Now check if minValueInCustomerCurrency is set before proceeding with the second API call
          if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
            const payload2: Exchange = {
              fromCurrencyId: this.FromcurrencyId,
              toCurrencyId: this.companycurrency.currencyId,
              value: this.QLineItem.controls['minValueInCustomerCurrency'].value
            };
            console.log("payload2", payload2);

            // Perform the second API call and wait for the response
            this.Qs.CurrencyExchanges(payload2).pipe(
              first()
            ).subscribe((res2) => {
              this.minValueInCompanyCurrency = res2;
              console.log("this.comp2", this.minValueInCompanyCurrency);
              this.QLineItem.controls['minValueInCompanyCurrency'].setValue(this.minValueInCompanyCurrency.convertedValue);
            });
            if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
              const payload4: Exchange = {
                fromCurrencyId: this.FromcurrencyId,
                toCurrencyId: this.companycurrency.currencyId,
                value: this.QLineItem.controls['valueInCustomerCurrency'].value 
              };
      
              this.Qs.CurrencyExchanges(payload4).pipe(
                first(),
                switchMap((res4) => {
                  this.exchangecurrencyforvendor = res4;
                  this.vendorexchange = this.exchangecurrencyforvendor.exchangeRate;
                  this.valuecompanynew = this.exchangecurrencyforvendor.convertedValue;
      
                  // If selectedminvalueCustomercurrency exists, make another API call
                  if (this.QLineItem.controls['minValueInCustomerCurrency'].value != null) {
                    const payload5: Exchange = {
                      fromCurrencyId: this.FromcurrencyId,
                      toCurrencyId: this.companycurrency.currencyId,
                      value: this.QLineItem.controls['minValueInCustomerCurrency'].value 
                    };
      
                    return this.Qs.CurrencyExchanges(payload5).pipe(first());
                  } else {
                    return []; // Skip if no value
                  }
                })
              ).subscribe((res5) => {
                if (res5) {
                  this.minexchangecurrencyforvendor = res5;
                  this.minvaluevendor = this.exchangecurrencyforvendor.convertedValue;
                  //this.AddingLineItem();
                }
              });
            }
          }
        });
      }


    }
  }


  getCompanyCurrency() {
    this.currencyS.GetCurrencyByCompanyCurrency().subscribe((res => {
      this.companycurrency = res[0];
      console.log("this.companycurrency = res;", this.companycurrency)
    }));
  }

  //#region ISAMENMENT

  onAmendCheckboxChange(event: any) {
    debugger
    if (!this.selectedSourceFromId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Source From.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.QLineItem.controls['isAmendPrice'].setValue(false);
      this.isAmendPriceReadonly = false
      return;
    } else if (this.selectedSourceFromId == 3) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Not able to select the Change Value.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.QLineItem.controls['isAmendPrice'].setValue(false);
      this.isAmendPriceReadonly = false
      return;
    }
    if (event.checked == true) {
      this.isAmendPriceReadonly = false;
      return;
    }
    this.isAmendPriceReadonly = true;
  }
}
