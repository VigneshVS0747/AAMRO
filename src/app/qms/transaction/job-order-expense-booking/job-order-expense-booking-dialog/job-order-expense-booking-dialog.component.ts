import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, Observable, startWith } from 'rxjs';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { TaxCode } from 'src/app/crm/master/taxcode/taxcode.model';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Country } from 'src/app/ums/masters/countries/country.model';
import Swal from 'sweetalert2';
import { JoebVendorfilterDialogComponent } from '../joeb-vendorfilter-dialog/joeb-vendorfilter-dialog.component';
import { JobOrderExpenseBookingService } from '../job-order-expense-booking.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { JOCBLineItem, JOCostBookingDetail, JOCostBookingGeneral, VendorFilter, VendorIdbyCurrency, VendorIdbyValue } from '../job-order-expense-booking.model';
import { CalculationParameters, CalculationTypes, DefaultSettings, ExchangeModel, groupCompany, sourceFrom } from 'src/app/Models/crm/master/Dropdowns';
import { QuotationService } from '../../Quotations/quotation.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { VendorModelContainer } from 'src/app/Models/crm/master/Vendor';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor.service';
import { PotentialVendorContainer } from 'src/app/crm/master/potential-vendor/potential-vendor.model';
import { changeExchange, Exchange } from '../../Quotations/quotation-model/quote';
import { JobOrderRevenueBookingService } from '../../Job-Order-Revenue/Job-order-revenue.service';

@Component({
  selector: 'app-job-order-expense-booking-dialog',
  templateUrl: './job-order-expense-booking-dialog.component.html',
  styleUrls: ['./job-order-expense-booking-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class JobOrderExpenseBookingDialogComponent {
  userId$: string;
  jocbdForm: FormGroup;
  date = new Date();
  viewMode: boolean = false;
  LiveStatus = 1;
  lineItemCtgDatalist: lineitem[];
  filteredLineItemCtgOptions$: Observable<any[]>;
  categoryId: any;
  lineItemCategoryName: any;
  LineItemMaster: any[] = [];
  enablevendor: boolean;
  enablevendorRef: boolean;

  taxcodelist: TaxCode[];
  filteredTaxCodeOptions$: Observable<any[]>;
  taxId: any;
  taxCodeName: any;
  filteredCountryOptions$: Observable<any[]>;
  CountryDatalist: Country[];

  serviceInId: any;
  filteredLineItemOptions$: Observable<any[]>;
  lineItemList: LineItemMaster[];
  lineItemCode: any;
  lineItemCategoryId: any;
  lineItemName: any;
  CalculationTyplist: CalculationTypes[];
  CalculationParlist: CalculationParameters[];
  filteredCalculationParOptions$: Observable<any[]>;
  filteredCalculationTypeOptions$: Observable<any[]>;
  calculationParameterId: any;
  calculationParameter: any;
  calculationTypeId: any;
  calculationType: any;
  regionList: any[];
  regionId: any;
  filteredRegionOptions$: Observable<any[]>;
  sourceList: sourceFrom[];
  filteredSourceOptions$: Observable<any[]>;
  sourceFromId: any;
  sourceFrom: any;
  filteredCurrencyListOptions$: any;
  currencyList: Currency[];
  currencyId: any;
  filteredgroupCompanyListOptions$: Observable<any[]>;
  groupCompanyList: groupCompany[];
  groupCompanyId: any;
  vendorList: VendorFilter[];
  filteredvendorListOptions$: Observable<any[]>;
  vendorId: any;
  vendorName: any;
  companyName: any;
  regionName: any;
  currencyName: any;
  joLineitemId: any;
  vendorType: any;
  totalInCompanyCurrency: any;
  filterReferenceNumber: any;
  countryName: any;
  vendorDetails: any;
  potentialVendor: PotentialVendorContainer;
  currencyReadonly: boolean = false;
  exchangeValue: ExchangeModel;
  exchangerate: number;
  taxPer: any;
  PQandCdrp: VendorIdbyValue[];
  filteredRefNumberOptions$: Observable<any[]>;
  refNumberId: any;
  refNumber: any;
  vendorTypeId: number;
  selectedReference: any;
  vendorcurrencyDetails: VendorIdbyCurrency[];
  jobOrderId: any;
  jobOrderNumber: any;
  InvoiceHistory: JOCBLineItem[];
  combinedAPInvoiceRefNumbers: string;
  isAmendPriceReadonly: boolean;
  totalInVendorCurrency: number;
  CIFCurrencyName: any;
  CIFValue: any;
  cifCurrencyId: any;
  exchangecurrency: changeExchange;
  joCostBookingId: any;
  quantity: number;
  minValue: any;
  defaultSettingsValues: DefaultSettings[];
  destCountryId: any;
  calculationTypeReadonly: boolean;
  quantityfromJO: any;
  JOCostBookingDetail: JOCostBookingDetail[] = [];
  edit: boolean = false;
  updatedBy: number;
  updatedDate: Date;
  createdByEmp: any;
  updatedByEmp: any;
  partiallyBooked: any;
  joCostBookingDetailId: any;
  minvaluereadonly: boolean;


  constructor(
    private fb: FormBuilder,
    private lineIetmService: LineitemmasterService,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService,
    private commonService: CommonService,
    private regionService: RegionService,
    public dialogFilter: MatDialog,
    private quotationService: QuotationService,
    private vendorService: VendorService,
    private potentialVendorService: PotentialVendorService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: LineitemmasterService,
    public dialogRef: MatDialogRef<JobOrderExpenseBookingDialogComponent>,
    private jobOrderRevenueBookingService: JobOrderRevenueBookingService,


  ) { dialogRef.disableClose = true; }
  ngOnInit() {
    this.CIFCurrencyName = this.data.CIFCurrencyName;
    this.CIFValue = this.data.CIFValue;
    this.destCountryId = this.data.destCountryId;
    this.JOCostBookingDetail = this.data.JOCostBookingDetail;
    this.jobOrderId = this.data.jobOrderId;

    this.GetUserId();
    this.iniForm();
    this.GetLineItem();
    this.getAllSource();
    this.getCurrencyList();
    this.GetAllGroupCompany();
    this.GetAllCalculationParameter();
    this.GetAllCalculationType();
    this.getAllRegion();
    this.getTaxCode();
    this.getServiceIn();
    this.EditMode();

  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  EditMode() {
    debugger
    if (this.data.mode == 'Edit') {
      this.edit = true;
      this.jocbdForm.patchValue(this.data.joebdata);
      if (this.data.joebdata.isVendor == true) {
        this.enablevendor = true;
        this.jocbdForm.controls["vendorId"].setValidators([Validators.required]);
        this.jocbdForm.get('vendorId')?.updateValueAndValidity();

        this.jocbdForm.controls["sourceFromId"].setValidators([Validators.required]);
        this.jocbdForm.get('sourceFromId')?.updateValueAndValidity();

        this.currencyId = this.data.joebdata.currencyId;
        this.currencyName = this.data.joebdata.currencyName;
        this.joCostBookingDetailId = this.data.joebdata.joCostBookingDetailId;


        this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
          this.vendorList = res;
          this.vendorFun();
          var data = this.vendorList.find(x => x.vendorId == this.data.joebdata.vendorId)
          this.jocbdForm.controls['vendorId'].setValue(data);
          this.vendorType = data?.vendorType;

          if (this.data.joebdata.currencyId == null) {
            const value = this.vendorList.find(x => x.vendorName === this.data.joebdata.vendorName);

            if (value) {
              this.vendorType = value.vendorType;
              this.vendorId = value.vendorId;
              this.vendorCurrencyGet();
            }

            //Data loading...
            this.joLineitemId = this.data.joebdata.joLineitemId;
            this.sourceFromId = this.data.joebdata.sourceFromId;
            if (this.data.quantity == null && this.sourceFrom == "Contract") {
              this.vendorfillter();
            }
          }
          // --------Vendor---------------

          this.vendorId = this.data.joebdata.vendorId;
          this.vendorName = this.data.joebdata.vendorName;

          let value = this.vendorList.find(x => x.vendorId == this.vendorId)
          this.vendorType = value?.vendorType;

          if (this.vendorType == 'V') {
            this.vendorTypeId = 2;
          } else if (this.vendorType == 'PV') {
            this.vendorTypeId = 1;
          }

          this.jobOrderExpenseBookingService.GetVerndorDetails(this.sourceFrom, this.vendorTypeId, this.vendorId, this.joLineitemId).subscribe(res => {
            this.PQandCdrp = res;
            this.refNumberFun();
            this.jocbdForm.controls['refNumberId'].setValue(this.data.joebdata);
          });
          //this.vendorfillter();
        });
      } else {
        this.enablevendor = false;
        this.vendorList = [];
        this.vendorId = null;
      }

      this.jocbdForm.controls['joLineitemId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['serviceInId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['groupCompanyId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['sourceFromId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['currencyId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['calculationParameterId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['calculationTypeId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['taxId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['regionId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['refNumberId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['minValue'].setValue(this.data.joebdata.minValue);
      this.minValue = this.data.minValue;

      this.lineItemCategoryName = this.data.joebdata.lineItemCategoryName;
      this.lineItemCode = this.data.joebdata.lineItemCode;
      this.lineItemName = this.data.joebdata.lineItemName;
      this.joLineitemId = this.data.joebdata.joLineitemId;

      this.createdByEmp = this.data.joebdata.createdByEmp;
      this.updatedByEmp = this.data.joebdata.updatedByEmp;

      this.partiallyBooked = this.data.joebdata.partiallyBooked;

      this.GetJOCostBookingPurchaseInvoiceHistory();

      this.countryName = this.data.joebdata.countryName;
      this.serviceInId = this.data.joebdata.serviceInId;

      this.refNumber = this.data.joebdata.refNumber;
      this.refNumberId = this.data.joebdata.refNumberId;

      this.groupCompanyId = this.data.joebdata.groupCompanyId;
      this.companyName = this.data.joebdata.companyName;

      this.regionId = this.data.joebdata.regionId;
      this.regionName = this.data.joebdata.regionName;

      this.sourceFromId = this.data.joebdata.sourceFromId;
      this.sourceFrom = this.data.joebdata.sourceFrom;

      if (this.sourceFromId == 1 || this.sourceFromId == 2) {
        this.jocbdForm.controls["refNumberId"].setValidators([Validators.required]);
        this.jocbdForm.get('refNumberId')?.updateValueAndValidity();
        this.enablevendorRef = true;
        this.minvaluereadonly=true;

      }
      else {
        this.jocbdForm.controls["refNumberId"].setValidators([Validators.nullValidator]);
        this.jocbdForm.get('refNumberId')?.updateValueAndValidity();
        this.enablevendorRef = false;
        this.minvaluereadonly=false;
        this.refNumberId = null;
      }

      // this.currencyId = this.data.joebdata.currencyId;
      // this.currencyName = this.data.joebdata.currencyName;

      this.calculationParameter = this.data.joebdata.calculationParameter;
      this.calculationParameterId = this.data.joebdata.calculationParameterId;

      this.calculationType = this.data.joebdata.calculationType;
      this.calculationTypeId = this.data.joebdata.calculationTypeId;

      this.taxCodeName = this.data.joebdata.taxCodeName;
      this.taxId = this.data.joebdata.taxId;

      let isAmendPrice = this.jocbdForm.controls['isAmendPrice'].value
      if (this.sourceFromId && isAmendPrice == true) {
        this.isAmendPriceReadonly = false;
      }
      else if (this.sourceFromId == 3 && isAmendPrice == false) {
        this.isAmendPriceReadonly = false;

      } else if (this.sourceFromId == 1 || this.sourceFromId == 2 && isAmendPrice == false) {
        this.isAmendPriceReadonly = true;

      }
      else if (!this.sourceFromId) {
        this.isAmendPriceReadonly = false;

      }
      this.calculationTypeReadonly = true;

      this.commonService.getCurrencies(this.LiveStatus).subscribe(result => {
        this.currencyList = result;
        if (!this.currencyId) {

          this.commonService.GetAllDefaultSettings().subscribe(res => {
            this.defaultSettingsValues = res;
            let defaultValue = this.defaultSettingsValues.find(x => x.settingName == 'Currency');
            this.currencyId = defaultValue?.defaultValueId;

            let iscompanyCurrency = this.currencyList.find(x => x.currencyId == this.currencyId);
            this.jocbdForm.controls['currencyId'].setValue(iscompanyCurrency);
            this.currencyId = iscompanyCurrency?.currencyId;
            this.currencyName = iscompanyCurrency?.currencyName;
            this.getExchange();

          });
          this.getExchange();
        }
        if (this.CIFCurrencyName) {
          let iscompanyCurrency = this.currencyList.find(x => x.currencyName == this.CIFCurrencyName);
          this.cifCurrencyId = iscompanyCurrency?.currencyId;
        }
        this.checkCIF();
      });
    }
    //#region View 
    else if (this.data.mode == 'View') {
      this.viewMode = true;
      this.jocbdForm.disable();

      this.jocbdForm.patchValue(this.data.joebdata);

      if (this.data.joebdata.isVendor == true) {
        this.enablevendor = true;
        this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
          this.vendorList = res;
          this.vendorFun();
          var data = this.vendorList.find(x => x.vendorId == this.data.joebdata.vendorId)
          this.jocbdForm.controls['vendorId'].setValue(data);
          this.vendorType = data?.vendorType;

          if (this.data.joebdata.currencyId == null) {
            const value = this.vendorList.find(x => x.vendorName === this.data.joebdata.vendorName);

            if (value) {
              this.vendorType = value.vendorType;
              this.vendorId = value.vendorId;
              this.vendorCurrencyGet();
            }
          }
          // --------Vendor---------------

          this.vendorId = this.data.joebdata.vendorId;
          this.vendorName = this.data.joebdata.vendorName;

          let value = this.vendorList.find(x => x.vendorId == this.vendorId)
          this.vendorType = value?.vendorType;

          if (this.vendorType == 'V') {
            this.vendorTypeId = 2;
          } else if (this.vendorType == 'PV') {
            this.vendorTypeId = 1;
          }

          this.jobOrderExpenseBookingService.GetVerndorDetails(this.sourceFrom, this.vendorTypeId, this.vendorId, this.joLineitemId).subscribe(res => {
            this.PQandCdrp = res;
            this.refNumberFun();
            this.jocbdForm.controls['refNumberId'].setValue(this.data.joebdata);
          });
        });
      } else {
        this.enablevendor = false;
        this.vendorList = [];
        this.vendorId = null;
      }

      this.jocbdForm.controls['joLineitemId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['serviceInId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['groupCompanyId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['sourceFromId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['currencyId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['calculationParameterId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['calculationTypeId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['taxId'].setValue(this.data.joebdata);
      this.jocbdForm.controls['regionId'].setValue(this.data.joebdata);

      this.jocbdForm.controls['minValue'].setValue(this.data.joebdata.minValue);
      this.minValue = this.data.minValue;

      this.joCostBookingDetailId = this.data.joebdata.joCostBookingDetailId;
      
      this.lineItemCategoryName = this.data.joebdata.lineItemCategoryName;
      this.lineItemCode = this.data.joebdata.lineItemCode;
      this.lineItemName = this.data.joebdata.lineItemName;

      this.createdByEmp = this.data.joebdata.createdByEmp;
      this.updatedByEmp = this.data.joebdata.updatedByEmp;

      this.joLineitemId = this.data.joebdata.joLineitemId;

      this.GetJOCostBookingPurchaseInvoiceHistory();

      this.refNumber = this.data.joebdata.refNumber;
      this.refNumberId = this.data.joebdata.refNumberId;

      this.countryName = this.data.joebdata.countryName;
      this.serviceInId = this.data.joebdata.serviceInId;

      this.groupCompanyId = this.data.joebdata.groupCompanyId;
      this.companyName = this.data.joebdata.companyName;

      this.regionId = this.data.joebdata.regionId;
      this.regionName = this.data.joebdata.regionName;

      this.sourceFromId = this.data.joebdata.sourceFromId;
      this.sourceFrom = this.data.joebdata.sourceFrom;

      this.currencyId = this.data.joebdata.currencyId;
      this.currencyName = this.data.joebdata.currencyName;

      this.calculationParameter = this.data.joebdata.calculationParameter;
      this.calculationParameterId = this.data.joebdata.calculationParameterId;

      this.calculationType = this.data.joebdata.calculationType;
      this.calculationTypeId = this.data.joebdata.calculationTypeId;

      this.taxCodeName = this.data.joebdata.taxCodeName;
      this.taxId = this.data.joebdata.taxId;

      this.partiallyBooked = this.data.joebdata.partiallyBooked;

    }
    else {

      this.commonService.getCurrencies(this.LiveStatus).subscribe(result => {
        this.currencyList = result;

        this.commonService.GetAllDefaultSettings().subscribe(res => {
          this.defaultSettingsValues = res;
          let defaultValue = this.defaultSettingsValues.find(x => x.settingName == 'Currency');
          this.currencyId = defaultValue?.defaultValueId;

          let iscompanyCurrency = this.currencyList.find(x => x.currencyId == this.currencyId);
          this.jocbdForm.controls['currencyId'].setValue(iscompanyCurrency);
          this.currencyId = iscompanyCurrency?.currencyId;
          this.currencyName = iscompanyCurrency?.currencyName;
          this.getExchange();
        });
        this.CurrencyFun();
      });

    }

  }

  // #region Form
  iniForm() {
    this.jocbdForm = this.fb.group({
      joCostBookingDetailId: [0],
      joCostBookingId: [0],
      lineItemCode: [null],
      lineItemCategoryName: [null],
      joLineitemId: [null],
      groupCompanyId: [null, Validators.required],
      regionId: [null],
      serviceInId: [null],
      isVendor: [false],
      isAmendPrice: [false],
      vendorId: [null],
      sourceFromId: [null],
      refNumberId: [null],
      currencyId: [null],
      calculationParameterId: [null],
      calculationTypeId: [null],
      rate: [null],
      quantity: [null],
      value: [null],
      taxId: [null],
      taxPer: [null],
      taxValue: [null],
      minValue: [0.00],
      totalInVendorCurrency: [null],
      exchangeRate: [null],
      totalInCompanyCurrency: [null],
      remarks: [null],
      apInvoiceRefNo: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date],
      partiallyBooked: [false]
    });
  }
  onAmendCheckboxChange(event: any) {
    this.calculationTypeReadonly = true;
    if (!this.sourceFromId) {
      this.jocbdForm.controls['isAmendPrice'].setValue(false);
      this.isAmendPriceReadonly = false;
      this.minvaluereadonly=false;

      return;
    } else if (this.sourceFromId == 3) {
      this.jocbdForm.controls['isAmendPrice'].setValue(false);
      this.isAmendPriceReadonly = false;
      this.minvaluereadonly=false;


      return;
    }
    if (event.checked == true) {
      this.isAmendPriceReadonly = false;
      this.minvaluereadonly=false;
     
      return;
    }
    this.minvaluereadonly=true;
    this.isAmendPriceReadonly = true;

  }

  //#region vendor filter
  onVendorCheckboxChange(event: any) {
    const selectedValue = event.value;
    if (this.joLineitemId) {
      if (selectedValue == true) {
        this.enablevendor = true;
        this.jocbdForm.controls["vendorId"].setValidators([Validators.required]);
        this.jocbdForm.get('vendorId')?.updateValueAndValidity();

        this.jocbdForm.controls["sourceFromId"].setValidators([Validators.required]);
        this.jocbdForm.get('sourceFromId')?.updateValueAndValidity();

        this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
          this.vendorList = res;
          this.vendorFun();
        });
      } else {
        this.jocbdForm.controls["refNumberId"].setValidators([Validators.nullValidator]);
        this.jocbdForm.get('refNumberId')?.updateValueAndValidity();
        this.enablevendorRef = false;
        this.minvaluereadonly=false;
        this.refNumberId = null;

        this.isAmendPriceReadonly = false;
        this.calculationTypeReadonly = true;

        this.jocbdForm.controls['currencyId'].reset();
        this.currencyId = null;

        this.enablevendor = false;
        this.jocbdForm.controls['vendorId'].reset();
        this.jocbdForm.get('vendorId')?.setValidators([Validators.nullValidator]);
        this.jocbdForm.get('vendorId')?.updateValueAndValidity();

        this.jocbdForm.get('sourceFromId')?.setValidators([Validators.nullValidator]);
        this.jocbdForm.get('sourceFromId')?.updateValueAndValidity();

        this.vendorList = [];
        this.vendorId = null;
        this.jocbdForm.controls['sourceFromId'].reset();
        this.sourceFromId = null;
        this.jocbdForm.controls['refNumberId'].reset();
        this.refNumberId = null;
        this.jocbdForm.controls['taxId'].reset();
        this.jocbdForm.controls['taxPer'].reset();
        this.jocbdForm.controls['calculationTypeId'].reset();
        this.jocbdForm.controls['calculationParameterId'].reset();
        this.jocbdForm.controls['quantity'].reset();
        this.jocbdForm.controls['rate'].reset();
        this.jocbdForm.controls['value'].reset();
        this.jocbdForm.controls['taxValue'].reset();
        this.jocbdForm.controls['totalInVendorCurrency'].reset();
        this.jocbdForm.controls['exchangeRate'].reset();
        this.jocbdForm.controls['totalInCompanyCurrency'].reset();
        this.PQandCdrp = [];
        this.taxId = '';
        this.calculationTypeId = '';
        this.calculationParameterId = '';
        this.taxId = '';

        this.commonService.GetAllDefaultSettings().subscribe(res => {
          this.defaultSettingsValues = res;
          let defaultValue = this.defaultSettingsValues.find(x => x.settingName == 'Currency');
          this.currencyId = defaultValue?.defaultValueId;

          let iscompanyCurrency = this.currencyList.find(x => x.currencyId == this.currencyId);
          this.jocbdForm.controls['currencyId'].setValue(iscompanyCurrency);
          this.currencyId = iscompanyCurrency?.currencyId;
          this.currencyName = iscompanyCurrency?.currencyName;
          this.getExchange();
        });
        this.getCurrencyList();
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Line Item",
        showConfirmButton: false,
        timer: 2000,
      });
      this.jocbdForm.controls['isVendor'].reset()
      return;
    }

  }

  vendorFun() {
    this.filteredvendorListOptions$ = this.jocbdForm.controls['vendorId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.vendorName)),
      map((name: any) => (name ? this.filteredvendorListOptions(name) : this.vendorList?.slice()))
    );
  }
  private filteredvendorListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.vendorList.filter((option: any) => option.vendorName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataVendor();
  }
  NoDataVendor(): any {
    this.jocbdForm.controls['vendorId'].setValue('');
    return this.vendorList;
  }
  displayvendorListLabelFn(data: any): string {
    return data && data.vendorName ? data.vendorName : '';
  }
  vendorListSelectedoption(data: any) {

    let selectedValue = data.option.value ? data.option.value : data;
    this.vendorId = selectedValue.vendorId;
    this.vendorName = selectedValue.vendorName;
    this.vendorType = selectedValue.vendorType;
    this.jocbdForm.controls['exchangeRate'].reset();
    if (this.vendorType == 'V') {
      this.vendorTypeId = 2;
    } else if (this.vendorType == 'PV') {
      this.vendorTypeId = 1;
    }
    this.vendorfillter();

  }

  vendorCurrencyGet() {
    debugger
    if (this.vendorType == 'V') {
      this.vendorService.getVendorbyId(this.vendorId).subscribe(res => {
        this.vendorDetails = res;
        this.jocbdForm.controls['currencyId'].setValue(this.vendorDetails.vendors);
        this.currencyId = this.vendorDetails.vendors.vendorCurrencyId;
        this.currencyName = this.vendorDetails.vendors.currencyName;

        if (this.vendorDetails.vendors.billingCurrencyId == 1) {
          this.currencyReadonly = true;
        } else {
          this.currencyReadonly = false;
        }
        this.getExchange();
      });
    } else if (this.vendorType == 'PV') {
      this.potentialVendorService.getAllPotentialVendorById(this.vendorId).subscribe(res => {
        this.potentialVendor = res;
        this.jocbdForm.controls['currencyId'].setValue(this.potentialVendor.potentialVendor);
        this.currencyId = this.potentialVendor.potentialVendor.vendorCurrencyId;
        this.currencyName = this.potentialVendor.potentialVendor.currencyName;

        if (this.potentialVendor.potentialVendor.billingCurrencyId == 1) {
          this.currencyReadonly = true;
        } else {
          this.currencyReadonly = false;
        }
        this.getExchange();
      });
    }
  }
  getExchange() {
    debugger
    this.jocbdForm.controls['exchangeRate'].reset();

    this.commonService.GetExchangeById(this.currencyId).subscribe(res => {
      this.exchangeValue = res;
      this.exchangerate = this.exchangeValue.exchangerate;
      this.jocbdForm.controls['exchangeRate'].setValue(this.exchangerate);
      // this.calculateVCurrency();
      this.calculateValue();
      this.checkCIF();
    })
  }

  getvendor(seleted: string, Vtype: any, Vid: number, lineitem: number) {
    this.jobOrderExpenseBookingService.GetVerndorDetails(seleted, Vtype, Vid, lineitem).subscribe(res => {
      debugger
      console.log(res)
      if (seleted === 'Contract') {
        this.PQandCdrp = res;


        const selectedJobOrderDate = this.data?.costBookingDate;

        if (selectedJobOrderDate) {
          const selectedDate = new Date(selectedJobOrderDate);
          selectedDate.setHours(0, 0, 0, 0);

          this.PQandCdrp = this.PQandCdrp.filter((item: any) => {
            const validFromDate = new Date(item.validFrom);
            const validToDate = new Date(item.validTo);

            validFromDate.setHours(0, 0, 0, 0);
            validToDate.setHours(0, 0, 0, 0);

            return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';

          });

          if (this.PQandCdrp?.length === 0 || this.PQandCdrp === null || this.PQandCdrp === undefined) {
            this.selectedReference = '';
            this.jocbdForm.controls['refNumberId'].reset();
            this.refNumberId = null;
            this.refNumber = null;
          }
        }


        this.refNumberFun();
      } else {
        this.PQandCdrp = res;
        this.refNumberFun();
      }

    });
  }
  refNumberFun() {
    this.filteredRefNumberOptions$ = this.jocbdForm.controls['refNumberId'].valueChanges.pipe(
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
    this.jocbdForm.controls['refNumberId'].setValue('');
    return this.PQandCdrp;
  }
  displayRefNumberListLabelFn(data: any): string {
    return data && data.refNumber ? data.refNumber : '';
  }
  refNumberSelectedOption(data: any) {
    this.jocbdForm.controls['taxId'].reset();
    this.jocbdForm.controls['taxPer'].reset();
    this.jocbdForm.controls['calculationTypeId'].reset();
    this.jocbdForm.controls['calculationParameterId'].reset();
    this.jocbdForm.controls['quantity'].reset();
    this.jocbdForm.controls['rate'].reset();
    this.jocbdForm.controls['value'].reset();
    this.jocbdForm.controls['minValue'].reset();

    this.jocbdForm.controls['taxValue'].reset();
    this.jocbdForm.controls['totalInVendorCurrency'].reset();
    this.jocbdForm.controls['exchangeRate'].reset();
    this.jocbdForm.controls['totalInCompanyCurrency'].reset();
    this.taxId = '';
    this.calculationTypeId = '';
    this.calculationParameterId = '';
    this.taxId = '';
    this.isAmendPriceReadonly = false;
    this.calculationTypeReadonly = true;


    let selectedValue = data.option.value;
    this.refNumberId = selectedValue.id;
    this.refNumber = selectedValue.refNumber;
    this.vendorIdbyCurrencyLoad();
  }


  vendorfillter() {
    debugger
    const payload = {
      vendorId: this.vendorId,
      lineitemId: this.joLineitemId
    }
    let value = this.vendorList.find(x => x.vendorId == this.vendorId)
    this.vendorType = value?.vendorType;

    if (this.vendorType == 'V') {
      this.vendorTypeId = 2;
    } else if (this.vendorType == 'PV') {
      this.vendorTypeId = 1;
    }
    this.jocbdForm.controls['taxId'].reset();
    this.jocbdForm.controls['taxPer'].reset();
    this.jocbdForm.controls['calculationTypeId'].reset();
    this.jocbdForm.controls['calculationParameterId'].reset();
    this.jocbdForm.controls['refNumberId'].reset();

    // this.jocbdForm.controls['serviceInId'].reset();
    // this.serviceInId = '';

    // this.jocbdForm.controls['sourceFromId'].reset();
    // this.sourceFromId='';
    this.jocbdForm.controls['value'].reset();

    // this.jocbdForm.controls['regionId'].reset();
    // this.regionId = '';

    this.jocbdForm.controls['quantity'].reset();
    this.jocbdForm.controls['rate'].reset();




    if (this.sourceFromId == 1) {
      this.getvendor("PQ", this.vendorTypeId, this.vendorId, this.joLineitemId);
      this.sourceFromId = 1
      this.jocbdForm.controls['quantity'].reset();
      this.isAmendPriceReadonly = true;
      this.calculationTypeReadonly = true;

      this.jocbdForm.controls["refNumberId"].setValidators([Validators.required]);
      this.jocbdForm.get('refNumberId')?.updateValueAndValidity();
      this.enablevendorRef = true;
      this.minvaluereadonly=true;
      this.vendorIdbyCurrencyLoad();

    } else if (this.sourceFromId == 3) {
      this.sourceFromId = 3;
      this.jocbdForm.controls['taxId'].reset();
      this.jocbdForm.controls['taxPer'].reset();
      this.jocbdForm.controls['calculationTypeId'].reset();
      this.jocbdForm.controls['calculationParameterId'].reset();
      this.jocbdForm.controls['quantity'].reset();
      this.jocbdForm.controls['rate'].reset();
      this.jocbdForm.controls['value'].reset();
      this.jocbdForm.controls['minValue'].reset();
      this.jocbdForm.controls['taxValue'].reset();
      this.jocbdForm.controls['totalInVendorCurrency'].reset();
      this.jocbdForm.controls['exchangeRate'].reset();
      this.jocbdForm.controls['totalInCompanyCurrency'].reset();
      this.PQandCdrp = [];
      this.taxId = '';
      this.calculationTypeId = '';
      this.calculationParameterId = '';
      this.taxId = '';
      this.isAmendPriceReadonly = false;
      this.calculationTypeReadonly = true;
      this.vendorCurrencyGet();

    } else {
      debugger
      this.quotationService.Searchcontractvendorrs(payload).subscribe((res => {
        ;
        this.isAmendPriceReadonly = true;
        this.calculationTypeReadonly = true;

        if (res.length > 0) {
          this.selectedReference = res;
          console.log('this.selectedReference', this.selectedReference);
          var direct = this.sourceList.find(id => id.sourceFromId == 2);
          this.sourceFromId = 2
          this.sourceFrom = direct?.sourceFrom;

          this.getvendor("Contract", this.vendorTypeId, this.vendorId, this.joLineitemId);

          this.jocbdForm.controls['sourceFromId'].setValue(direct);
          this.jocbdForm.controls['refNumberId'].setValue(this.selectedReference);

          let value = res[0].valueInVendorCurrency;
          this.jocbdForm.controls['rate'].setValue(value);

          this.enablevendorRef = true;
          this.minvaluereadonly=true;
          this.jocbdForm.controls["refNumberId"].setValidators([Validators.required]);
          this.jocbdForm.get('refNumberId')?.updateValueAndValidity();

          let values = this.selectedReference = res[0];
          this.currencyId = values.currencyId




          if (res.length == 1) {
            this.selectedReference = res[0];
            this.refNumberId = this.selectedReference.refNumberId;
            this.refNumber = this.selectedReference.refNumber;
            this.calculationTypeId = this.selectedReference.calculationTypeId;
            this.calculationParameterId = this.selectedReference.calculationParameterId;
            this.taxId = this.selectedReference.taxId;
            this.jocbdForm.controls['refNumberId'].setValue(this.selectedReference);
            this.jocbdForm.controls["refNumberId"].setValidators([Validators.required]);
            this.jocbdForm.get('refNumberId')?.updateValueAndValidity();

            var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == res[0].calculationParameterId);
            this.calculationParameter = carculationparms?.calculationParameter;
            this.calculationParameterId = carculationparms?.calculationParameterId;
            this.jocbdForm.controls['calculationParameterId'].setValue(carculationparms);

            var calculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == res[0].calculationTypeId);
            this.calculationType = calculationtype?.calculationType;
            this.calculationTypeId = calculationtype?.calculationTypeId;
            this.jocbdForm.controls['calculationTypeId'].setValue(calculationtype);

            var tax = this.taxcodelist.find(id => id.taxCodeId == res[0].taxId);
            this.taxCodeName = tax?.taxCodeName;
            this.taxId = tax?.taxCodeId;
            this.jocbdForm.controls['taxId'].setValue(tax);
            this.jocbdForm.controls['taxPer'].setValue(tax?.taxPer);
            this.taxPer = this.jocbdForm.controls['taxPer'].value;

            this.jocbdForm.controls['minValue'].setValue(this.selectedReference.minValueInVendorCurrency);

            this.vendorIdbyCurrencyLoad();
            return
          }
        }
      }));
    }
  }

  vendorEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.vendorId = null;
    }
  }


  //#region FilterDialog
  FilterDialog() {

    if (!this.vendorId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Vendor",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (!this.joLineitemId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Line Item",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    const dialogRef = this.dialogFilter.open(JoebVendorfilterDialogComponent, {
      data: {
        vendorId: this.vendorId, vendorType: this.vendorType, sourceFrom: this.sourceFrom, lineItem: this.joLineitemId,
        refNumber: this.refNumber, viewMode: this.viewMode,
        costBookingDate: this.data?.costBookingDate
      },
      disableClose: true,
      autoFocus: false,
      height: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

        this.jocbdForm.controls['isAmendPrice'].reset();
        this.jocbdForm.controls['isAmendPrice'].setValue(false);
        this.isAmendPriceReadonly = true;
        this.calculationTypeReadonly = true;


        this.jocbdForm.controls['taxId'].reset();
        this.jocbdForm.controls['taxPer'].reset();
        this.jocbdForm.controls['calculationTypeId'].reset();
        this.jocbdForm.controls['calculationParameterId'].reset();
        this.jocbdForm.controls['quantity'].reset();
        this.jocbdForm.controls['value'].reset();
        this.jocbdForm.controls['minValue'].reset();



        if (result.selectedvalue == "Contract") {
          var direct = this.sourceList.find(id => id.sourceFromId == 2);
          this.sourceFromId = 2
          this.sourceFrom = direct?.sourceFrom;
          //this.getvendor("Contract", this.vendorTypeId, this.vendorId, this.joLineitemId);
          this.jobOrderExpenseBookingService.GetVerndorDetails("Contract", this.vendorTypeId, this.vendorId, this.joLineitemId).subscribe(res => {
            this.PQandCdrp = res;
            var ref = this.PQandCdrp.find(id => id.id == result.selectedrefnumId);
            this.jocbdForm.controls['refNumberId'].setValue(ref);
            this.refNumber = ref?.refNumber;
            this.vendorIdbyCurrencyLoad();
          });
          this.jocbdForm.controls['sourceFromId'].setValue(direct);
          this.refNumberId = result.seletedItem.refNumberId;
          this.refNumber = result.seletedItem.refNumber;
          this.calculationTypeId = result.seletedItem.calculationTypeId;
          this.calculationParameterId = result.seletedItem.calculationParameterId;
          this.taxId = result.taxId;
          this.jocbdForm.controls['refNumberId'].setValue(result.seletedItem);

          let value = result.seletedItem.valueInVendorCurrency;
          this.jocbdForm.controls['rate'].setValue(value);

          var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == result.seletedItem.calculationParameterId);
          this.calculationParameter = carculationparms?.calculationParameter;
          this.jocbdForm.controls['calculationParameterId'].setValue(carculationparms);

          var calculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == result.seletedItem.calculationTypeId);
          this.calculationType = calculationtype?.calculationType;
          this.jocbdForm.controls['calculationTypeId'].setValue(calculationtype);

          var tax = this.taxcodelist.find(id => id.taxCodeId == result.seletedItem.taxId);
          this.taxCodeName = tax?.taxCodeName;
          this.taxId = tax?.taxCodeId;

          this.jocbdForm.controls['taxId'].setValue(tax);
          this.jocbdForm.controls['taxPer'].setValue(tax?.taxPer);
          this.taxPer = this.jocbdForm.controls['taxPer'].value;
          this.jocbdForm.controls['minValue'].setValue(this.selectedReference.minValueInVendorCurrency);

          return;

        } else {
          debugger
          var direct = this.sourceList.find(id => id.sourceFromId == 1);
          this.sourceFromId = 1
          this.sourceFrom = direct?.sourceFrom;
          this.jocbdForm.controls['sourceFromId'].setValue(direct);
          this.refNumberId = result.selectedrefnumId;
          this.calculationTypeId = result.seletedItem.calculationTypeId;
          this.calculationParameterId = result.seletedItem.calculationParameterId;
          this.taxId = result.taxId;
          this.jobOrderExpenseBookingService.GetVerndorDetails("PQ", this.vendorTypeId, this.vendorId, this.joLineitemId).subscribe(res => {
            this.PQandCdrp = res;
            var ref = this.PQandCdrp.find(id => id.id == result.selectedrefnumId);
            this.jocbdForm.controls['refNumberId'].setValue(ref);
            this.refNumber = ref?.refNumber;
            this.vendorIdbyCurrencyLoad();
          });
          var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == result.seletedItem.calculationParameterId);
          this.calculationParameter = carculationparms?.calculationParameter;
          this.jocbdForm.controls['calculationParameterId'].setValue(carculationparms);

          var calculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == result.seletedItem.calculationTypeId);
          this.calculationType = calculationtype?.calculationType;
          this.jocbdForm.controls['calculationTypeId'].setValue(calculationtype);

          var tax = this.taxcodelist.find(id => id.taxCodeId == result.seletedItem.taxId);
          this.taxCodeName = tax?.taxCodeName;
          this.taxId = tax?.taxCodeId;

          let value = result.seletedItem.value;
          this.jocbdForm.controls['rate'].setValue(value);

          this.jocbdForm.controls['taxId'].setValue(tax);
          this.jocbdForm.controls['taxPer'].setValue(tax?.taxPer);
          this.taxPer = this.jocbdForm.controls['taxPer'].value;
          this.jocbdForm.controls['minValue'].setValue(result.seletedItem.minValue);
          return;
        }
      }
    });
    this.vendorIdbyCurrencyLoad();

  }


  //#region Add to List
  AddtoList() {
    debugger
    this.minValue = this.jocbdForm.controls['minValue'].value;
    let isservice = this.jocbdForm.controls['serviceInId'].value

    if (isservice?.countryName === "" || isservice?.countryName === undefined || isservice?.countryName === null) {
      this.jocbdForm.controls['serviceInId'].reset();
    }
    let iscalculationParameterId = this.jocbdForm.controls['calculationParameterId'].value
    if (iscalculationParameterId?.calculationParameterId === null || iscalculationParameterId?.calculationParameterId === undefined || iscalculationParameterId?.calculationParameterId === null) {
      this.jocbdForm.controls['calculationParameterId'].reset();
    }
    let iscalculationTypeId = this.jocbdForm.controls['calculationTypeId'].value
    if (iscalculationTypeId?.calculationTypeId === null || iscalculationTypeId?.calculationTypeId === undefined || iscalculationTypeId?.calculationTypeId === null) {
      this.jocbdForm.controls['calculationTypeId'].reset();
    }
    let groupCompanyId = this.jocbdForm.controls['groupCompanyId'].value
    if (groupCompanyId?.groupCompanyId === "" || groupCompanyId?.groupCompanyId === undefined || groupCompanyId?.groupCompanyId === null) {
      this.jocbdForm.controls['groupCompanyId'].reset();
    }
    let tax = this.jocbdForm.controls['taxId'].value
    if (tax?.taxCodeName === "" || tax?.taxCodeName === undefined || tax?.taxCodeName === null) {
      this.jocbdForm.controls['taxId'].reset();
    }

    if (this.jocbdForm.valid) {
      const jocbDetail: JobOrderExpenseBookingDialogComponent = {
        ...this.jocbdForm.getRawValue(),
      }

      this.totalInCompanyCurrency = this.jocbdForm.controls['totalInCompanyCurrency'].value;
      jocbDetail.lineItemCategoryName = this.lineItemCategoryName;

      let quantity = this.jocbdForm.controls['quantity'].value;
      if (quantity == 0) {
        Swal.fire({
          icon: "info",
          title: "Info!",
          text: "The quantity is set to zero. Please verify the quantity value.",
          showConfirmButton: true,
        });
        return;
      }
      jocbDetail.quantity = quantity ? quantity : this.quantity;

      jocbDetail.lineItemCode = this.lineItemCode;
      jocbDetail.lineItemName = this.lineItemName;
      jocbDetail.joLineitemId = this.joLineitemId;

      jocbDetail.refNumber = this.refNumber
      jocbDetail.refNumberId = this.refNumberId

      jocbDetail.countryName = this.countryName;
      jocbDetail.serviceInId = this.serviceInId;

      jocbDetail.vendorId = this.vendorId;
      jocbDetail.vendorName = this.vendorName;

      jocbDetail.groupCompanyId = this.groupCompanyId;
      jocbDetail.companyName = this.companyName;

      jocbDetail.regionId = this.regionId;
      jocbDetail.regionName = this.regionName;

      jocbDetail.sourceFromId = this.sourceFromId;
      jocbDetail.sourceFrom = this.sourceFrom;

      jocbDetail.currencyId = this.currencyId;
      jocbDetail.currencyName = this.currencyName;



      jocbDetail.calculationParameter = this.calculationParameter;
      jocbDetail.calculationParameterId = this.calculationParameterId;

      jocbDetail.calculationType = this.calculationType;
      jocbDetail.calculationTypeId = this.calculationTypeId;

      jocbDetail.updatedByEmp = this.updatedByEmp;
      jocbDetail.createdByEmp = this.createdByEmp;

      jocbDetail.taxCodeName = this.taxCodeName;
      jocbDetail.taxId = this.taxId;
      jocbDetail.updatedBy = parseInt(this.userId$);
      jocbDetail.updatedDate = this.date;
      jocbDetail.minValue = this.minValue ? this.minValue : 0
      jocbDetail.totalInCompanyCurrency = parseFloat(this.totalInCompanyCurrency);

      this.partiallyBooked = this.jocbdForm.controls['partiallyBooked'].value;
      jocbDetail.partiallyBooked = this.partiallyBooked;

      this.dialogRef.close(jocbDetail);
      this.jocbdForm.reset();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.jocbdForm.markAllAsTouched();
      this.validateall(this.jocbdForm);
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



  //#region  currency
  getCurrencyList() {
    this.commonService.getCurrencies(this.LiveStatus).subscribe(result => {
      this.currencyList = result;

      if (this.CIFCurrencyName) {
        let iscompanyCurrency = this.currencyList.find(x => x.currencyName == this.CIFCurrencyName);
        this.cifCurrencyId = iscompanyCurrency?.currencyId;

      }
      this.getExchange();
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.jocbdForm.controls['currencyId'].valueChanges.pipe(
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
    this.jocbdForm.controls['currencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.currencyId = selectedValue.currencyId;
    this.currencyName = selectedValue.currencyName;
    this.getExchange();
  }
  //#endregion

  vendorIdbyCurrencyLoad() {
    debugger
    this.jobOrderExpenseBookingService.GetVerndorCurrencyDetails(this.sourceFromId, this.vendorTypeId, this.vendorId, this.refNumber).subscribe(res => {
      this.vendorcurrencyDetails = res;

      if (this.sourceFrom == 'Contract') {
        let currencyValue = this.vendorcurrencyDetails.find(x => x.refNumber == this.refNumber)
        this.jocbdForm.controls['currencyId'].setValue(currencyValue);
        this.currencyId = this.vendorcurrencyDetails[0].currencyId;
        this.currencyName = this.vendorcurrencyDetails[0].currencyName;
        this.getExchange();
        //this.checkCIF();
        this.getQuantity();
      } else if (this.sourceFrom == 'PQ') {
        let currencyValue = this.vendorcurrencyDetails.find(x => x.refNumber == this.refNumber)
        this.jocbdForm.controls['currencyId'].setValue(currencyValue);
        this.currencyId = this.vendorcurrencyDetails[0].currencyId;
        this.currencyName = this.vendorcurrencyDetails[0].currencyName;
        this.getExchange();
        //this.checkCIF();
        this.getQuantity();
      }
      else {
        this.currencyId = this.vendorcurrencyDetails[0].currencyId;
        this.currencyName = this.vendorcurrencyDetails[0].currencyName;
        let currencyValue = this.vendorcurrencyDetails[0];
        this.jocbdForm.controls['currencyId'].setValue(currencyValue);
        this.getExchange();
        //this.checkCIF();
        this.getQuantity();
      }
    });
  }

  //#region  GroupCompany
  GetAllGroupCompany() {
    this.commonService.GetAllGroupCompany().subscribe(result => {
      this.groupCompanyList = result;
      if (this.data.mode != 'Edit' && this.data.mode != 'View') {
        this.commonService.GetAllDefaultSettings().subscribe(res => {
          this.defaultSettingsValues = res;
          let defaultValue = this.defaultSettingsValues.find(x => x.settingName == 'Group Company')
          this.groupCompanyId = defaultValue?.defaultValueId;

          let groupCompanyvalue = this.groupCompanyList.find(x => x.groupCompanyId == this.groupCompanyId)
          this.jocbdForm.controls['groupCompanyId'].setValue(groupCompanyvalue);
          this.companyName = groupCompanyvalue?.companyName;
        });
      }
      this.groupCompanyFun();
    });
  }
  groupCompanyFun() {
    this.filteredgroupCompanyListOptions$ = this.jocbdForm.controls['groupCompanyId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.companyName)),
      map((name: any) => (name ? this.filteredgroupCompanyListOptions(name) : this.groupCompanyList?.slice()))
    );
  }
  private filteredgroupCompanyListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.groupCompanyList.filter((option: any) => option.companyName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatagroupCompany();
  }
  NoDatagroupCompany(): any {
    this.jocbdForm.controls['groupCompanyId'].setValue('');
    return this.groupCompanyList;
  }
  displaygroupCompanyListLabelFn(data: any): string {
    return data && data.companyName ? data.companyName : '';
  }
  groupCompanyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.groupCompanyId = selectedValue.groupCompanyId;
    this.companyName = selectedValue.companyName;

  }
  //#endregion

  //#region select CalculationParameter
  GetAllCalculationParameter() {
    this.commonService.GetAllCalculationParameter().subscribe(result => {
      this.CalculationParlist = result;
      console.log('this.CalculationParlist', this.CalculationParlist);

      this.CalculationParFun()
    });
  }
  CalculationParFun() {
    this.filteredCalculationParOptions$ = this.jocbdForm.controls['calculationParameterId'].valueChanges.pipe(
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
    this.jocbdForm.controls['calculationParameterId'].setValue('');
    return this.CalculationParlist;
  }
  displayculationParLabelFn(data: any): string {
    return data && data.calculationParameter ? data.calculationParameter : '';
  }
  CalculationParSelectedoption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.calculationParameterId = selectedValue.calculationParameterId;
    this.calculationParameter = selectedValue.calculationParameter;

    this.calculationTypeId = selectedValue.calculationTypeId;
    this.calculationType = selectedValue.calculationType;
    this.jocbdForm.controls['calculationTypeId'].setValue(selectedValue);

    if (this.calculationType) {
      this.calculationTypeReadonly = true;
    } else {
      this.calculationTypeReadonly = false;
    }
    this.getQuantity();
    // this.jobOrderRevenueBookingService.GetQuatityFromJO(this.jobOrderId,this.calculationParameterId).subscribe(res=>{
    // this.quantityfromJO=res;
    // console.log(' this.quantityfromJO', this.quantityfromJO);
    // this.jocbdForm.controls['quantity'].setValue(this.quantityfromJO);
    // this.calculateValue();
    // this.checkCIF();
    // });

    // this.calculateValue();
    // this.checkCIF();

    //this.calculateVCurrency();

  }
  getQuantity() {
    this.jobOrderRevenueBookingService.GetQuatityFromJO(this.jobOrderId, this.calculationParameterId).subscribe(res => {
      this.quantityfromJO = res;
      console.log(' this.quantityfromJO', this.quantityfromJO);
      this.jocbdForm.controls['quantity'].setValue(this.quantityfromJO);
      this.calculateValue();
      this.checkCIF();
    });
  }
  //#endregion
  //#region select culationType
  GetAllCalculationType() {
    this.commonService.GetAllCalculationType().subscribe(result => {
      this.CalculationTyplist = result;
      this.CalculationTypeFun()
    });
  }
  CalculationTypeFun() {
    this.filteredCalculationTypeOptions$ = this.jocbdForm.controls['calculationTypeId'].valueChanges.pipe(
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
    this.jocbdForm.controls['calculationTypeId'].setValue('');
    return this.CalculationTyplist;
  }
  displayculationTypeLabelFn(data: any): string {
    return data && data.calculationType ? data.calculationType : '';
  }
  CalculationTypeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.calculationTypeId = selectedValue.calculationTypeId;
    this.calculationType = selectedValue.calculationType;
    this.calculateValue();
    this.checkCIF();
    //this.calculateVCurrency();
  }

  //#region select taxcode
  getTaxCode() {
    this.commonService.GetAllActiveTaxCodes().subscribe(result => {
      this.taxcodelist = result;
      this.TaxCodeFun()
    });
  }
  TaxCodeFun() {
    this.filteredTaxCodeOptions$ = this.jocbdForm.controls['taxId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.taxCodeName)),
      map((name: any) => (name ? this.filteredTaxCodeOptions(name) : this.taxcodelist?.slice()))
    );
  }
  private filteredTaxCodeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.taxcodelist.filter((option: any) => option.taxCodeName.toLowerCase().includes(filterValue));
    this.jocbdForm.controls['taxPer'].setValue(null);
    this.taxPer = null;
    return results.length ? results : this.NoDataTaxCode();
  }
  NoDataTaxCode(): any {
    this.jocbdForm.controls['taxId'].setValue(null);
    return this.taxcodelist;
  }
  displayTaxCodeLabelFn(data: any): string {
    return data && data.taxCodeName ? data.taxCodeName : '';
  }

  TaxCodeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.taxId = selectedValue.taxCodeId;
    this.taxCodeName = selectedValue.taxCodeName;
    this.taxPer = selectedValue.taxPer;
    this.jocbdForm.controls['taxPer'].setValue(this.taxPer);
    this.calculateVCurrency()
  }

  emptytaxper(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.jocbdForm.controls['taxPer'].setValue(null);
      this.taxPer = null;
      this.taxCodeName = '';
      this.taxId = null;
    }
  }

  //#endregion

  //#region GetLineItem
  GetLineItem() {
    this.lineIetmService.GetAllLineItemMaster(this.LiveStatus).subscribe((res => {
      this.lineItemList = res;
      this.lineItemFun();
      // this.EditMode();
    }));
  }
  lineItemFun() {
    this.filteredLineItemOptions$ = this.jocbdForm.controls['joLineitemId'].valueChanges.pipe(
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
    this.jocbdForm.controls['joLineitemId'].setValue('');
    return this.lineItemList;
  }
  displayLineItemListLabelFn(data: any): string {
    return data && data.lineItemName ? data.lineItemName : '';
  }
  lineItemSelectedOption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.joLineitemId = selectedValue.lineItemId;
    this.lineItemCode = selectedValue.lineItemCode;
    this.lineItemName = selectedValue.lineItemName;
    this.lineItemCategoryId = selectedValue.lineItemCategoryId;
    this.lineItemCategoryName = selectedValue.lineItemCategoryName;
    let value = this.JOCostBookingDetail.find(x => x.lineItemName == this.lineItemName)
    if (value) {

      if (!this.edit) {
        this.jocbdForm.controls["joLineitemId"].reset();
        this.joLineitemId = null;
        this.lineItemCode = null;
        //this.lineItemName = null;
        this.lineItemCategoryName = null;
      }
      else {
        this.joLineitemId = this.data.joebdata.joLineitemId;
        this.lineItemCode = this.data.joebdata.lineItemCode;
        this.lineItemName = this.data.joebdata.lineItemName;
        this.lineItemCategoryId = this.data.joebdata.lineItemCategoryId;
        this.lineItemCategoryName = this.data.joebdata.lineItemCategoryName;
        this.jocbdForm.controls["joLineitemId"].patchValue(this.data.joebdata);
      }
      Swal.fire({
        icon: "info",
        title: "Exist!",
        text: "The " + this.lineItemName + " Line Item already exists...!",
        showConfirmButton: true,
      });
      return;
    }
    this.jocbdForm.controls["lineItemCategoryName"].setValue(this.lineItemCategoryName);
    this.jocbdForm.controls["lineItemCode"].setValue(this.lineItemCode);
  }


  GetJOCostBookingPurchaseInvoiceHistory() {
    this.jobOrderExpenseBookingService.GetJOCostBookingPurchaseInvoiceHistory(this.joLineitemId, this.jobOrderId).subscribe(result => {
      this.InvoiceHistory = result;
      this.combinedAPInvoiceRefNumbers = this.InvoiceHistory
        .map(item => item.apInvoiceRefNumber)
        .filter(refNumber => !!refNumber)
        .join(', ');
      this.jocbdForm.controls["apInvoiceRefNo"].setValue(this.combinedAPInvoiceRefNumbers);
    })
  }


  //#region ServiceIn 
  getServiceIn() {
    this.commonService.getCountries(1).subscribe((result) => {
      this.CountryDatalist = result;
      if (this.data.mode != 'Edit' && this.data.mode != 'View') {
        var value = this.CountryDatalist.find(x => x.countryId == this.destCountryId)
        this.jocbdForm.controls['serviceInId'].setValue(value);
        this.serviceInId = value?.countryId;
        this.countryName = value?.countryName;
      }
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.jocbdForm.controls['serviceInId'].valueChanges.pipe(
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
    this.jocbdForm.controls['serviceInId'].setValue('');
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.serviceInId = selectedCountry.countryId;
    this.countryName = selectedCountry.countryName
  }

  //#region Region 
  getAllRegion() {
    this.regionService.getRegions().subscribe(data => {
      this.regionList = data;
      if (this.data.mode != 'Edit' && this.data.mode != 'View') {
        this.commonService.GetAllDefaultSettings().subscribe(res => {
          this.defaultSettingsValues = res;
          let defaultValue = this.defaultSettingsValues.find(x => x.settingName == 'Region')
          this.regionId = defaultValue?.defaultValueId;

          let value = this.regionList.find(x => x.regionId == this.regionId);
          this.jocbdForm.controls['regionId'].setValue(value);
          this.regionName = value.regionName;
        });
      }

      this.RegionFun();
    });
  }
  RegionFun() {
    this.filteredRegionOptions$ = this.jocbdForm.controls['regionId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.regionName)),
      map((name: any) => (name ? this.filterRegionFunType(name) : this.regionList?.slice()))
    );
  }
  private filterRegionFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.regionList.filter((option: any) => option.regionName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoRegionData();
  }
  NoRegionData(): any {
    this.jocbdForm.controls['regionId'].setValue('');
    return this.regionList;
  }
  displayRegionLabelFn(data: any): string {
    return data && data.regionName ? data.regionName : '';
  }
  RegionSelectedoption(Data: any) {
    let selectedValue = Data.option.value;
    this.regionId = selectedValue.regionId;
    this.regionName = selectedValue.regionName
  }

  //#region Source 
  getAllSource() {
    this.commonService.GetAllSourceFrom().subscribe(data => {
      this.sourceList = data;
      this.sourceFun();
    });
  }
  sourceFun() {
    this.filteredSourceOptions$ = this.jocbdForm.controls['sourceFromId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.sourceFrom)),
      map((name: any) => (name ? this.filtersourceFunFunType(name) : this.sourceList?.slice()))
    );
  }
  private filtersourceFunFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.sourceList.filter((option: any) => option.sourceFrom.toLowerCase().includes(filterValue));
    return results.length ? results : this.NosourceData();
  }
  NosourceData(): any {
    this.jocbdForm.controls['sourceFromId'].setValue('');
    return this.sourceList;
  }
  displaysourceLabelFn(countrydata: any): string {
    return countrydata && countrydata.sourceFrom ? countrydata.sourceFrom : '';
  }
  sourceSelectedoption(Data: any) {
    this.refNumberId = null;
    this.jocbdForm.controls['isAmendPrice'].setValue(false);
    let selectedValue = Data.option.value;
    this.sourceFromId = selectedValue.sourceFromId;
    this.sourceFrom = selectedValue.sourceFrom;
    if (this.sourceFromId == 1 || this.sourceFromId == 2) {
      this.jocbdForm.controls["refNumberId"].setValidators([Validators.required]);
      this.jocbdForm.get('refNumberId')?.updateValueAndValidity();
      this.enablevendorRef = true;
      this.minvaluereadonly=true;

    }
    else {
      this.PQandCdrp = [];
      this.jocbdForm.controls["refNumberId"].setValidators([Validators.nullValidator]);
      this.jocbdForm.get('refNumberId')?.updateValueAndValidity();
      this.enablevendorRef = false;
      this.minvaluereadonly=false;
      this.refNumberId = null;
    }
    this.vendorfillter();
  }
  sourceEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.sourceFromId = null;
    }
  }
  //#region close Dialog window
  Close() {
    this.dialogRef.close();
  }

  //#region Calculation
  rate(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,14}(\.\d{0,4})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 14) {
      parts[0] = parts[0].slice(0, 14);
    }
    input.value = parts.join('.');
    this.jocbdForm.controls['rate'].setValue(input.value);

    let calculationParam = this.jocbdForm.controls['calculationParameterId'].value;
    let calculationType = this.jocbdForm.controls['calculationTypeId'].value;
    if (calculationParam?.calculationParameter === 'CI Value') {
      if (calculationType?.calculationType === 'Percentage') {
        this.calculateValue();
        this.checkCIF();
        // this.calculateVCurrency();
      } else {
        this.calculateValue()
        this.calculateVCurrency();
        this.jocbdForm.controls['quantity'].enable();
      }
    } else {
      this.calculateValue()
      this.calculateVCurrency();
      this.jocbdForm.controls['quantity'].enable();
    }
  }

  quantityEvent(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,6}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 6) {
      parts[0] = parts[0].slice(0, 6);
    }
    input.value = parts.join('.');
    this.jocbdForm.controls['quantity'].setValue(input.value);
    this.calculateValue();
    this.calculateVCurrency();
  }

  calculateValue() {
    const rate = this.jocbdForm.controls['rate'].value || 0.00
    const quantity = this.jocbdForm.controls['quantity'].value || 0.00
    const values = rate * quantity;

    const minvalue = this.jocbdForm.controls['minValue'].value;
    if (minvalue) {
      if (minvalue < values) {
        this.jocbdForm.controls['value'].setValue(values.toFixed(4));
      } else if(minvalue >= values) {
        this.jocbdForm.controls['value'].setValue(minvalue);
      }
    }
    else {
      this.jocbdForm.controls['value'].setValue(values.toFixed(4));
    }
  }

  taxValue(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,14}(\.\d{0,4})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 14) {
      parts[0] = parts[0].slice(0, 14);
    }
    input.value = parts.join('.');
    //const numericValue = parseFloat(input.value);
    this.jocbdForm.controls['taxValue'].setValue(input.value);
    this.calculateVCurrency();
  }

  rateValue(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,3}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 3) {
      parts[0] = parts[0].slice(0, 3);
    }
    input.value = parts.join('.');
    this.jocbdForm.controls['exchangeRate'].setValue(input.value);
    this.calculateVCurrency();
  }

  calculateVCurrency() {
    this.taxValueCalculate();
    const value = this.jocbdForm.controls['value'].value || 0.00
    const taxValue = this.jocbdForm.controls['taxValue'].value || 0.00
    const values = parseFloat(value) + parseFloat(taxValue);
    this.jocbdForm.controls['totalInVendorCurrency'].setValue(values.toFixed(2));
    this.calculateCCurrency();
  }
  calculateCCurrency() {
    const totalInVendorCurrency = this.jocbdForm.controls['totalInVendorCurrency'].value || 0.00
    const exchangeRate = this.jocbdForm.controls['exchangeRate'].value || 0.00
    const values = parseFloat(totalInVendorCurrency) / parseFloat(exchangeRate);
    this.jocbdForm.controls['totalInCompanyCurrency'].setValue(values.toFixed(2));
  }
  taxValueCalculate() {
    const value = parseFloat(this.jocbdForm.controls['value'].value) ? parseFloat(this.jocbdForm.controls['value'].value) : 0;
    this.taxPer = this.jocbdForm.controls['taxPer'].value;
    let taxvalue = (value / 100) * this.taxPer
    if (this.taxPer) {
      this.jocbdForm.controls['taxValue'].setValue(taxvalue.toFixed(4));
    } else {
      this.jocbdForm.controls['taxValue'].setValue(0);
    }
  }


  //#region check CIF
  checkCIF() {
    debugger;
    let calculationParam = this.jocbdForm.controls['calculationParameterId'].value;
    let calculationType = this.jocbdForm.controls['calculationTypeId'].value;

    if (calculationParam?.calculationParameter === 'CI Value') {
      if (calculationType?.calculationType === 'Percentage') {
        this.jocbdForm.controls['quantity']?.patchValue(1);
        this.quantity = 1;
        let rate = parseFloat(this.jocbdForm.controls['rate']?.value);
        rate = isNaN(rate) ? 0 : rate;

        if (this.cifCurrencyId == this.currencyId) {
          let CIFvalue = this.data.CIFValue;
          CIFvalue = typeof CIFvalue === 'number' ? CIFvalue : 0;

          let cifPer = CIFvalue / 100;
          let multipliedValue = cifPer * rate;

          const minvalue = this.jocbdForm.controls['minValue'].value;
          if (minvalue) {
            if (minvalue <= multipliedValue) {
              this.jocbdForm.patchValue({ value: isNaN(multipliedValue) ? 0 : multipliedValue });

            } else {
              this.jocbdForm.controls['value'].setValue(minvalue);
            }
          }
          else {
            this.jocbdForm.patchValue({ value: isNaN(multipliedValue) ? 0 : multipliedValue });
          }
          this.jocbdForm.controls['quantity'].disable();
          this.calculateVCurrency();
        } else {
          const payload: Exchange = {
            fromCurrencyId: this.cifCurrencyId,
            toCurrencyId: this.currencyId,
            value: this.CIFValue
          };

          this.quotationService.CurrencyExchanges(payload).subscribe((res => {
            this.exchangecurrency = res;
            let CIFvalue = this.exchangecurrency.convertedValue;
            CIFvalue = typeof CIFvalue === 'number' ? CIFvalue : 0;

            let cifPer = CIFvalue / 100;
            let multipliedValue = cifPer * rate;

            const minvalue = this.jocbdForm.controls['minValue'].value;
            if (minvalue) {
              if (minvalue < multipliedValue) {
                this.jocbdForm.patchValue({ value: isNaN(multipliedValue) ? 0 : multipliedValue.toFixed(4) });

              } else {
                this.jocbdForm.controls['value'].setValue(minvalue);
              }
            }
            else {
              this.jocbdForm.patchValue({ value: isNaN(multipliedValue) ? 0 : multipliedValue.toFixed(4) });
            }
            this.jocbdForm.controls['quantity'].disable();
            this.calculateVCurrency();

          }));
        }
      }
      else {
        this.jocbdForm.controls['quantity'].enable();
      }
    } else {
      this.jocbdForm.controls['quantity'].enable();
    }

  }
  minvalueEvent(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
      if (value === '') {
        value = '0';
      }
    }
    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (!regex.test(value)) {
      value = input.value.slice(0, -1);
    }
    const splitValue = value.split('.');
    if (splitValue[0].length > 14) {
      splitValue[0] = splitValue[0].slice(0, 14);
      value = splitValue.join('.');
    }

    input.value = value;
    this.jocbdForm.controls['minValue'].setValue(input.value);
    this.calculateValue();
    this.checkCIF();
    this.calculateValue();
    this.calculateVCurrency();
  }
  onpartiallyBookedChange(event: any) {
    debugger
    const value = event.checked;
    if (this.partiallyBooked == true || this.partiallyBooked == false && this.joCostBookingDetailId==0) {
      this.jocbdForm.controls['partiallyBooked'].setValue(value)
    }
    else if(this.partiallyBooked == true && this.joCostBookingDetailId!=0){
      this.jocbdForm.controls['partiallyBooked'].setValue(value)
    }
    else if(this.partiallyBooked == false && this.joCostBookingDetailId!=0){
      this.jocbdForm.controls['partiallyBooked'].setValue(false)
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Can't select an already revenue booked Line Item.",
        showConfirmButton: true,
      });
    }
  }


}
