import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { QuotationService } from '../../Quotations/quotation.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { map, Observable, startWith } from 'rxjs';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { CalculationParameters, CalculationTypes, DefaultSettings, ExchangeModel } from 'src/app/Models/crm/master/Dropdowns';
import { TaxCode } from 'src/app/crm/master/taxcode/taxcode.model';
import Swal from 'sweetalert2';
import { changeExchange, Exchange, QuotationGeneral } from '../../Quotations/quotation-model/quote';
import { JobOrderRevenueBookingService } from '../Job-order-revenue.service';
import { ContractOrQuotation, JORBLineItem, JORevenueBookingDetail } from '../Job-order-revenue-modals';
import { JobOrderExpenseBookingService } from '../../job-order-expense-booking/job-order-expense-booking.service';
import { JOCostBookingDetail } from '../../job-order-expense-booking/job-order-expense-booking.model';

@Component({
  selector: 'app-jorb-detail-dialog',
  templateUrl: './jorb-detail-dialog.component.html',
  styleUrls: ['./jorb-detail-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class JorbDetailDialogComponent {
  userId$: string;
  date = new Date();
  jorbdForm: FormGroup;
  LiveStatus = 1;
  filteredLineItemOptions$: Observable<any[]>;
  lineItemList: LineItemMaster[];
  lineItemCode: any;
  lineItemCategoryId: any;
  lineItemName: any;
  lineItemCategoryName: any;
  joLineitemId: any;

  filteredCountryOptions$: Observable<any[]>;
  CountryDatalist: Country[];
  serviceInId: any;
  countryName: any;

  regionList: any[];
  regionId: any;
  filteredRegionOptions$: Observable<any[]>;
  regionName: any;

  filteredSourceOptions$: Observable<any[]>;
  sourceFromId: any;
  clientSourceFrom: any;

  CalculationTyplist: CalculationTypes[];
  CalculationParlist: CalculationParameters[];
  filteredCalculationParOptions$: Observable<any[]>;
  filteredCalculationTypeOptions$: Observable<any[]>;
  calculationParameterId: any;
  calculationParameter: any;
  calculationTypeId: any;
  calculationType: any;

  taxcodelist: TaxCode[];
  filteredTaxCodeOptions$: Observable<any[]>;
  taxId: any;
  taxCodeName: any;
  taxPercentage: any;
  refNumberId: any;
  refNumber: any;
  totalInCompanyCurrency: any;

  viewMode: boolean = false;
  isAmendPriceReadonly: boolean;
  sourceList: any;
  filteredRefNumberOptions$: Observable<any>;
  exchangeValue: ExchangeModel;
  exchangerate: number;
  currencyId: number;
  revenueLineitemId: any;
  customerId: any;
  ContractOrQuotationList: ContractOrQuotation[];
  selectedVale: ContractOrQuotation;
  totalInCustomerCurrency: any;
  enablevendor: boolean;
  CIFValue: any;
  jobOrderId: any;
  expenseDetails: JOCostBookingDetail;
  InvoiceHistory: JORBLineItem[];
  combinedAPInvoiceRefNumbers: string;
  hiddenRefNumber: boolean = true;
  cifCurrencyId: number;
  exchangecurrency: changeExchange;
  quantity: number;
  minValue: any;
  destCountryId: any;
  defaultSettingsValues: DefaultSettings[];
  calculationTypeReadonly: boolean;
  quantityfromJO: any
  JORevenueBookingDetail: JORevenueBookingDetail[] = [];
  edit: boolean = false;
  updatedBy: number;
  updatedDate: Date;
  createdByEmp: any;
  updatedByEmp: any;
  partiallyBooked: any;
  joRevenueBookingDetailId: any;
  minvaluereadonly: boolean;

  constructor(
    private fb: FormBuilder,
    private lineIetmService: LineitemmasterService,
    private commonService: CommonService,
    private regionService: RegionService,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService,
    private jobOrderRevenueBookingService: JobOrderRevenueBookingService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JorbDetailDialogComponent>,


  ) { dialogRef.disableClose = true; }

  ngOnInit() {
    this.currencyId = this.data.currencyId;
    this.customerId = this.data.customerId;
    this.CIFValue = this.data.CIFValue;

    this.jobOrderId = this.data.jobOrderId;
    this.destCountryId = this.data.destCountryId;
    this.JORevenueBookingDetail = this.data.JORevenueBookingDetail;

    this.GetUserId();
    this.iniForm();
    this.GetLineItem();
    this.GetSourceStatus();
    this.getExchange();
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
      this.jorbdForm.patchValue(this.data.jorbdata);
      this.edit = true;
      this.jorbdForm.controls['joLineitemId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['serviceInId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['sourceFromId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['calculationParameterId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['calculationTypeId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['taxId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['regionId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['refNumberId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['minValue'].setValue(this.data.jorbdata.minValue);
      this.minValue = this.data.minValue;

      this.joRevenueBookingDetailId = this.data.jorbdata.joRevenueBookingDetailId;
      this.lineItemCategoryName = this.data.jorbdata.lineItemCategoryName;
      this.lineItemCode = this.data.jorbdata.lineItemCode;
      this.lineItemName = this.data.jorbdata.lineItemName;
      this.joLineitemId = this.data.jorbdata.joLineitemId;

      this.partiallyBooked= this.data.jorbdata.partiallyBooked;

      this.createdByEmp=this.data.jorbdata.createdByEmp;
      this.updatedByEmp=this.data.jorbdata.updatedByEmp;

      this.revenueLineitemId = this.data.jorbdata.revenueLineitemId;

      //this.GetJORevenueBookingProformaInvoiceHistory();

      this.countryName = this.data.jorbdata.countryName;
      this.serviceInId = this.data.jorbdata.serviceInId;

      this.refNumber = this.data.jorbdata.refNumber;
      this.refNumberId = this.data.jorbdata.refNumberId;

      this.regionId = this.data.jorbdata.regionId;
      this.regionName = this.data.jorbdata.regionName;

      this.sourceFromId = this.data.jorbdata.sourceFromId;
      this.clientSourceFrom = this.data.jorbdata.clientSourceFrom;

      if (this.sourceFromId == 1 || this.sourceFromId == 2) {
        this.jorbdForm.controls["refNumberId"].setValidators([Validators.required]);
        this.jorbdForm.get('refNumberId')?.updateValueAndValidity();
        this.hiddenRefNumber = true;
      }
      else {
        this.jorbdForm.controls["refNumberId"].setValidators([Validators.nullValidator]);
        this.jorbdForm.get('refNumberId')?.updateValueAndValidity();
        this.refNumberId = null;
        this.hiddenRefNumber = false;

      }

      this.calculationParameter = this.data.jorbdata.calculationParameter;
      this.calculationParameterId = this.data.jorbdata.calculationParameterId;

      this.calculationType = this.data.jorbdata.calculationType;
      this.calculationTypeId = this.data.jorbdata.calculationTypeId;

      this.taxCodeName = this.data.jorbdata.taxCodeName;
      this.taxId = this.data.jorbdata.taxId;
      this.GetJOCBInvoiceDetailsId();

      this.jobOrderRevenueBookingService.GetContractOrQuotationDetailsForRevenueBookingRefNumberId(this.customerId, this.revenueLineitemId, this.sourceFromId, this.refNumberId).subscribe(res => {
        this.ContractOrQuotationList = res;

        if (this.sourceFromId === 2) {
          if (this.ContractOrQuotationList) {
            const selectedJobOrderDate = this.data?.revenueBookingDate;

            if (selectedJobOrderDate) {
              const selectedDate = new Date(selectedJobOrderDate);
              selectedDate.setHours(0, 0, 0, 0);

              this.ContractOrQuotationList = this.ContractOrQuotationList.filter((item: any) => {
                const validFromDate = new Date(item.validFrom);
                const validToDate = new Date(item.validTo);

                validFromDate.setHours(0, 0, 0, 0);
                validToDate.setHours(0, 0, 0, 0);

                return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';

              });
            }
          }
        }

        this.refNumberFun();

      })

      let isAmendPrice = this.jorbdForm.controls['isAmendPrice'].value
      if (this.sourceFromId && isAmendPrice == true) {
        this.isAmendPriceReadonly = false;
        this.minvaluereadonly=false;
      }
      else if (this.sourceFromId == 3 && isAmendPrice == false) {
        this.isAmendPriceReadonly = false;
        this.minvaluereadonly=false;
      }
      else if (this.sourceFromId == 1 || this.sourceFromId == 2 && isAmendPrice == false) {
        this.isAmendPriceReadonly = true;
        this.minvaluereadonly=true;
      }
      else if (!this.sourceFromId) {
        this.isAmendPriceReadonly = false;
        this.minvaluereadonly=false;

      }
      this.calculationTypeReadonly = true;
      this.checkCIF();

    }
    else if (this.data.mode == 'View') {
      this.viewMode = true;
      this.jorbdForm.disable();

      this.jorbdForm.patchValue(this.data.jorbdata);
      this.jorbdForm.controls['joLineitemId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['serviceInId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['sourceFromId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['calculationParameterId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['calculationTypeId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['taxId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['regionId'].setValue(this.data.jorbdata);
      this.jorbdForm.controls['refNumberId'].setValue(this.data.jorbdata);

      this.jorbdForm.controls['minValue'].setValue(this.data.jorbdata.minValue);
      this.minValue = this.data.minValue;

      this.lineItemCategoryName = this.data.jorbdata.lineItemCategoryName;
      this.lineItemCode = this.data.jorbdata.lineItemCode;
      this.lineItemName = this.data.jorbdata.lineItemName;
      this.joLineitemId = this.data.jorbdata.joLineitemId;

      this.createdByEmp=this.data.jorbdata.createdByEmp;
      this.updatedByEmp=this.data.jorbdata.updatedByEmp;

      this.revenueLineitemId = this.data.jorbdata.revenueLineitemId;
      this.GetJOCBInvoiceDetailsId();

      //this.GetJORevenueBookingProformaInvoiceHistory();

      this.countryName = this.data.jorbdata.countryName;
      this.serviceInId = this.data.jorbdata.serviceInId;

      this.refNumber = this.data.jorbdata.refNumber;
      this.refNumberId = this.data.jorbdata.refNumberId;

      this.regionId = this.data.jorbdata.regionId;
      this.regionName = this.data.jorbdata.regionName;

      this.sourceFromId = this.data.jorbdata.sourceFromId;
      this.clientSourceFrom = this.data.jorbdata.clientSourceFrom;

      this.calculationParameter = this.data.jorbdata.calculationParameter;
      this.calculationParameterId = this.data.jorbdata.calculationParameterId;

      this.calculationType = this.data.jorbdata.calculationType;
      this.calculationTypeId = this.data.jorbdata.calculationTypeId;

      this.taxCodeName = this.data.jorbdata.taxCodeName;
      this.taxId = this.data.jorbdata.taxId;

      this.partiallyBooked= this.data.jorbdata.partiallyBooked;



    }
  }


  iniForm() {
    this.jorbdForm = this.fb.group({
      joRevenueBookingDetailId: [0],
      joRevenueBookingId: [0],
      lineItemCode: [null],
      lineItemCategoryName: [null],
      joLineitemId: [null],
      aliasName: [null],
      regionId: [null],
      serviceInId: [null],
      isVendor: [false],
      isAmendPrice: [false],
      isFullyInvoiced: [false],
      minValue: [0.00],
      sourceFromId: [null],
      refNumberId: [null],
      calculationParameterId: [null],
      calculationTypeId: [null],
      unitPrice: [null],
      quantity: [null],
      taxableValue: [null],
      taxId: [null],
      taxPercentage: [null],
      taxValue: [null],
      totalInCustomerCurrency: [null],
      exchangeRate: [null],
      totalInCompanyCurrency: [null],
      vendorBillNumber: [null],
      vendorBillDate: [null],
      remarks: [null],
      proformaInvoiceRefNo: [null],
      invoicedAmount: [null],
      multiInvoice: [false],
      proformaInvoiceRefNoId: [null],
      actualExpense: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date],
      partiallyBooked:[false]
    });
  }


  onAmendCheckboxChange(event: any) {
    this.calculationTypeReadonly = true;

    if (!this.sourceFromId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Source From.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.jorbdForm.controls['isAmendPrice'].setValue(false);
      this.isAmendPriceReadonly = false;
      this.minvaluereadonly=false;

      return;
    } else if (this.sourceFromId == 3) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Not able to select the Change Value.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.jorbdForm.controls['isAmendPrice'].setValue(false);
      this.isAmendPriceReadonly = false;
      this.minvaluereadonly=false;
      return;
    }
    if (event.checked == true) {
      this.isAmendPriceReadonly = false;
      this.minvaluereadonly=false;

      return;
    }
    this.isAmendPriceReadonly = true;
    this.minvaluereadonly=true;

  }

  GetJORevenueBookingProformaInvoiceHistory() {
    this.jobOrderRevenueBookingService.GetJORevenueBookingProformaInvoiceHistory(this.revenueLineitemId, this.jobOrderId).subscribe(result => {
      this.InvoiceHistory = result;
      if (this.InvoiceHistory) {
        if (this.InvoiceHistory.length == 0 || this.InvoiceHistory.length == 0) {
          this.jorbdForm.controls["multiInvoice"].setValue(false);
        } else if (this.InvoiceHistory.length > 1) {
          this.jorbdForm.controls["multiInvoice"].setValue(true);
        }

        this.combinedAPInvoiceRefNumbers = this.InvoiceHistory
          .map(item => item.proInvoiceRefNumber)
          .filter(refNumber => !!refNumber)
          .join(', ');

        this.jorbdForm.controls["proformaInvoiceRefNo"].setValue(this.combinedAPInvoiceRefNumbers);

        const combinedProformaInvoiceIds = this.InvoiceHistory
          .map(item => item.proformaInvoiceId)
          .filter(proformaInvoiceId => !!proformaInvoiceId)
          .join(', ');
        this.jorbdForm.controls["proformaInvoiceRefNoId"].setValue(combinedProformaInvoiceIds);

        const totalInvoicedAmount = this.InvoiceHistory
          .reduce((sum, item) => sum + (item.invoicedAmount || 0), 0);
        this.jorbdForm.controls["invoicedAmount"].setValue(totalInvoicedAmount);
      }
    });
  }

  //region  getAllReference

  refNumberFun() {
    this.filteredRefNumberOptions$ = this.jorbdForm.controls['refNumberId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.refNumber)),
      map((name: any) => (name ? this.filteredRefNumberOptions(name) : this.ContractOrQuotationList?.slice()))
    );
  }
  private filteredRefNumberOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.ContractOrQuotationList.filter((option: any) => option.refNumber.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataRefNumber();
  }
  NoDataRefNumber(): any {
    this.jorbdForm.controls['refNumberId'].setValue('');
    return this.ContractOrQuotationList;
  }
  displayRefNumberListLabelFn(data: any): string {
    return data && data.refNumber ? data.refNumber : '';
  }
  refNumberSelectedOption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.refNumberId = selectedValue.refNumberId;
    this.refNumber = selectedValue.refNumber;

    this.jorbdForm.controls["calculationParameterId"].reset();
    this.jorbdForm.controls["calculationTypeId"].reset();
    this.jorbdForm.controls["taxId"].reset();
    this.jorbdForm.controls["taxPercentage"].reset();
    this.jorbdForm.controls["quantity"].reset();
    this.jorbdForm.controls["unitPrice"].reset();


    this.jobOrderRevenueBookingService.GetContractOrQuotationDetailsForRevenueBookingRefNumberId(this.customerId, this.revenueLineitemId, this.sourceFromId, this.refNumberId).subscribe(res => {
      this.ContractOrQuotationList = res;

      if (this.sourceFromId === 2) {
        if (this.ContractOrQuotationList) {
          const selectedJobOrderDate = this.data?.revenueBookingDate;

          if (selectedJobOrderDate) {
            const selectedDate = new Date(selectedJobOrderDate);
            selectedDate.setHours(0, 0, 0, 0);

            this.ContractOrQuotationList = this.ContractOrQuotationList.filter((item: any) => {
              const validFromDate = new Date(item.validFrom);
              const validToDate = new Date(item.validTo);

              validFromDate.setHours(0, 0, 0, 0);
              validToDate.setHours(0, 0, 0, 0);

              return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';

            });
          }
        }
      }

      if (this.ContractOrQuotationList) {

        this.selectedVale = this.ContractOrQuotationList[0];
        this.jorbdForm.patchValue(this.selectedVale);

        this.jorbdForm.controls["refNumberId"].setValue(this.selectedVale);
        this.refNumberId = this.selectedVale.refNumberId;
        this.refNumber = this.selectedVale.refNumber;

        this.jorbdForm.controls["calculationParameterId"].setValue(this.selectedVale);
        this.calculationParameterId = this.selectedVale.calculationParameterId;
        this.calculationParameter = this.selectedVale.calculationParameter;

        this.jorbdForm.controls["calculationTypeId"].setValue(this.selectedVale);
        this.calculationTypeId = this.selectedVale.calculationTypeId;
        this.calculationType = this.selectedVale.calculationType;

        this.jorbdForm.controls["taxId"].setValue(this.selectedVale);
        this.taxId = this.selectedVale.taxId;
        this.taxCodeName = this.selectedVale.taxCodeName;

        this.jorbdForm.controls["taxPercentage"].setValue(this.selectedVale.taxPercentage);

        this.jorbdForm.controls["minValue"].setValue(this.selectedVale.minValue ? this.selectedVale.minValue : 0);
        //this.checkCIF();
        this.getQuantity();
      }
    })
  }




  //#region GetLineItem
  GetLineItem() {
    this.lineIetmService.GetAllLineItemMaster(this.LiveStatus).subscribe((res => {
      this.lineItemList = res;
      this.lineItemFun();
      // this.EditMode();
    }));
  }
  lineItemFun() {
    this.filteredLineItemOptions$ = this.jorbdForm.controls['joLineitemId'].valueChanges.pipe(
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
    this.jorbdForm.controls['joLineitemId'].setValue('');
    return this.lineItemList;
  }
  displayLineItemListLabelFn(data: any): string {
    return data && data.lineItemName ? data.lineItemName : '';
  }
  lineItemSelectedOption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.revenueLineitemId = selectedValue.lineItemId;
    this.lineItemCode = selectedValue.lineItemCode;
    this.lineItemName = selectedValue.lineItemName
    this.lineItemCategoryId = selectedValue.lineItemCategoryId;
    this.lineItemCategoryName = selectedValue.lineItemCategoryName;

    let value = this.JORevenueBookingDetail.find(x => x.lineItemName == this.lineItemName)
    if (value) {

      if (!this.edit) {
        this.jorbdForm.controls["joLineitemId"].reset();
        this.joLineitemId = null;
        this.lineItemCode = null;
        //this.lineItemName = null;
        this.lineItemCategoryId = null;
        this.lineItemCategoryName = null;
      }
      else {
        this.joLineitemId = this.data.jorbdata.joLineitemId;
        this.lineItemCode = this.data.jorbdata.lineItemCode;
        this.lineItemName = this.data.jorbdata.lineItemName;
        this.lineItemCategoryId = this.data.jorbdata.lineItemCategoryId;
        this.lineItemCategoryName = this.data.jorbdata.lineItemCategoryName;
        this.jorbdForm.controls["joLineitemId"].patchValue(this.data.jorbdata);
      }
      Swal.fire({
        icon: "info",
        title: "Exist!",
        text: "The " + this.lineItemName + " Line Item already exists...!",
        showConfirmButton: true,
      });
      return;
    }
    this.ContractOrQuotationList = [];
    this.jorbdForm.controls["refNumberId"].reset();
    this.refNumberId = null;
    
    this.jorbdForm.controls["lineItemCategoryName"].setValue(this.lineItemCategoryName);
    this.jorbdForm.controls["lineItemCode"].setValue(this.lineItemCode);

    this.jorbdForm.controls["sourceFromId"].reset();
    this.jorbdForm.controls["calculationParameterId"].reset();
    this.jorbdForm.controls["calculationTypeId"].reset();
    this.jorbdForm.controls["taxId"].reset();
    this.jorbdForm.controls["taxPercentage"].reset();
    this.jorbdForm.controls["quantity"].reset();
    this.jorbdForm.controls["unitPrice"].reset();

    this.GetJOCBInvoiceDetailsId();
    this.jobOrderRevenueBookingService.GetContractOrQuotationDetails(this.customerId, this.revenueLineitemId).subscribe(res => {
      this.ContractOrQuotationList = res;

      if (this.sourceFromId === 2) {
        if (this.ContractOrQuotationList) {
          const selectedJobOrderDate = this.data?.revenueBookingDate;

          if (selectedJobOrderDate) {
            const selectedDate = new Date(selectedJobOrderDate);
            selectedDate.setHours(0, 0, 0, 0);

            this.ContractOrQuotationList = this.ContractOrQuotationList.filter((item: any) => {
              const validFromDate = new Date(item.validFrom);
              const validToDate = new Date(item.validTo);

              validFromDate.setHours(0, 0, 0, 0);
              validToDate.setHours(0, 0, 0, 0);

              return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';

            });
          }
        }
      }

      this.refNumberFun();

      if (this.ContractOrQuotationList) {
        this.isAmendPriceReadonly = true;
        this.minvaluereadonly=true;

        this.clientSourceFrom = this.ContractOrQuotationList[0].clientSourceFrom;
        if (this.clientSourceFrom == "Contract") {
          this.sourceFromId = 2;
        } else if (this.clientSourceFrom == "Quotation") {
          this.sourceFromId = 1;
        }
        this.jorbdForm.controls["sourceFromId"].setValue(this.ContractOrQuotationList[0]);

        if (this.ContractOrQuotationList.length == 1) {
          this.selectedVale = this.ContractOrQuotationList[0];
          this.jorbdForm.patchValue(this.selectedVale);

          this.jorbdForm.controls["refNumberId"].setValue(this.selectedVale);
          this.refNumberId = this.selectedVale.refNumberId;
          this.refNumber = this.selectedVale.refNumber;

          this.jorbdForm.controls["calculationParameterId"].setValue(this.selectedVale);
          this.calculationParameterId = this.selectedVale.calculationParameterId;
          this.calculationParameter = this.selectedVale.calculationParameter;

          this.jorbdForm.controls["calculationTypeId"].setValue(this.selectedVale);
          this.calculationTypeId = this.selectedVale.calculationTypeId;
          this.calculationType = this.selectedVale.calculationType;

          this.jorbdForm.controls["taxId"].setValue(this.selectedVale);
          this.taxId = this.selectedVale.taxId;
          this.taxCodeName = this.selectedVale.taxCodeName;

          this.jorbdForm.controls["taxPercentage"].setValue(this.selectedVale.taxPercentage);

          this.jorbdForm.controls["minValue"].setValue(this.selectedVale.minValue ? this.selectedVale.minValue : 0);
          //this.checkCIF();
          this.getQuantity();
        }
      }
    });

  }
  //#endregion 
  GetJOCBInvoiceDetailsId() {
    debugger
    this.jobOrderExpenseBookingService.GetJOCBInvoiceDetailsId(this.jobOrderId, this.revenueLineitemId).subscribe(res => {
      this.expenseDetails = res;
      this.jorbdForm.controls["actualExpense"].setValue(this.expenseDetails.totalInCompanyCurrency);
    });
  }

  //#region ServiceIn 
  getServiceIn() {
    this.commonService.getCountries(1).subscribe((result) => {
      this.CountryDatalist = result;
      if (this.data.mode != 'Edit' && this.data.mode != 'View') {
        var value = this.CountryDatalist.find(x => x.countryId == this.destCountryId)
        this.jorbdForm.controls['serviceInId'].setValue(value);
        this.serviceInId = value?.countryId;
        this.countryName = value?.countryName;
      }
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.jorbdForm.controls['serviceInId'].valueChanges.pipe(
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
    this.jorbdForm.controls['serviceInId'].setValue('');
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
          this.jorbdForm.controls['regionId'].setValue(value);
          this.regionName = value.regionName;
        });
      }
      this.RegionFun();
    });
  }
  RegionFun() {
    this.filteredRegionOptions$ = this.jorbdForm.controls['regionId'].valueChanges.pipe(
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
    this.jorbdForm.controls['regionId'].setValue('');
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
  GetSourceStatus() {
    this.commonService.GetSourceStatus().subscribe((res: any) => {
      this.sourceList = res;
      this.sourceFun();
    })
  }
  sourceFun() {
    this.filteredSourceOptions$ = this.jorbdForm.controls['sourceFromId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.clientSourceFrom)),
      map((name: any) => (name ? this.filtersourceFunFunType(name) : this.sourceList?.slice()))
    );
  }
  private filtersourceFunFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.sourceList.filter((option: any) => option.clientSourceFrom.toLowerCase().includes(filterValue));
    return results.length ? results : this.NosourceData();
  }
  NosourceData(): any {
    this.jorbdForm.controls['sourceFromId'].setValue('');
    return this.sourceList;
  }
  displaysourceLabelFn(data: any): string {
    return data && data.clientSourceFrom ? data.clientSourceFrom : '';
  }
  sourceSelectedoption(Data: any) {
    debugger
    this.ContractOrQuotationList = [];
    this.refNumberId = null
    this.jorbdForm.controls["refNumberId"].reset();

    this.jorbdForm.controls['isAmendPrice'].setValue(false);
    this.jorbdForm.controls['quantity'].reset();
    let selectedValue = Data.option.value;
    this.sourceFromId = selectedValue.clientSourceFromId;
    this.clientSourceFrom = selectedValue.clientSourceFrom;

    this.jorbdForm.controls["calculationParameterId"].reset();
    this.jorbdForm.controls["calculationTypeId"].reset();
    this.jorbdForm.controls["taxId"].reset();
    this.jorbdForm.controls["taxPercentage"].reset();
    this.jorbdForm.controls["quantity"].reset();
    this.jorbdForm.controls["unitPrice"].reset();

    this.jorbdForm.controls["minValue"].setValue(0);
    this.jorbdForm.controls["taxableValue"].reset();
    this.jorbdForm.controls["totalInCustomerCurrency"].reset();
    this.jorbdForm.controls["totalInCompanyCurrency"].reset();


    if (this.sourceFromId == 1 || this.sourceFromId == 2) {
      this.jorbdForm.controls["refNumberId"].setValidators([Validators.required]);
      this.jorbdForm.get('refNumberId')?.updateValueAndValidity();
      this.hiddenRefNumber = true;
      this.isAmendPriceReadonly = true;
      this.minvaluereadonly=true;

    }
    else {
      this.jorbdForm.controls["refNumberId"].setValidators([Validators.nullValidator]);
      this.jorbdForm.get('refNumberId')?.updateValueAndValidity();
      this.refNumberId = null;
      this.hiddenRefNumber = false;
      this.minvaluereadonly=false;
      this.isAmendPriceReadonly = false;

    }


    this.jobOrderRevenueBookingService.GetContractOrQuotationDetailsForRevenueBookingSourceId(this.customerId, this.revenueLineitemId, this.sourceFromId).subscribe(res => {
      debugger
      this.ContractOrQuotationList = res;

      if (this.sourceFromId === 2) {
        if (this.ContractOrQuotationList) {
          const selectedJobOrderDate = this.data?.revenueBookingDate;

          if (selectedJobOrderDate) {
            const selectedDate = new Date(selectedJobOrderDate);
            selectedDate.setHours(0, 0, 0, 0);

            this.ContractOrQuotationList = this.ContractOrQuotationList.filter((item: any) => {
              const validFromDate = new Date(item.validFrom);
              const validToDate = new Date(item.validTo);

              validFromDate.setHours(0, 0, 0, 0);
              validToDate.setHours(0, 0, 0, 0);

              return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';

            });
          }
        }
      }


      if (this.ContractOrQuotationList) {
        if (this.ContractOrQuotationList.length == 1) {
          this.selectedVale = this.ContractOrQuotationList[0];
          this.jorbdForm.patchValue(this.selectedVale);

          this.jorbdForm.controls["refNumberId"].setValue(this.selectedVale);
          this.refNumberId = this.selectedVale.refNumberId;
          this.refNumber = this.selectedVale.refNumber;

          this.jorbdForm.controls["calculationParameterId"].setValue(this.selectedVale);
          this.calculationParameterId = this.selectedVale.calculationParameterId;
          this.calculationParameter = this.selectedVale.calculationParameter;


          this.jorbdForm.controls["calculationTypeId"].setValue(this.selectedVale);
          this.calculationTypeId = this.selectedVale.calculationTypeId;
          this.calculationType = this.selectedVale.calculationType;

          this.jorbdForm.controls["taxId"].setValue(this.selectedVale);
          this.taxId = this.selectedVale.taxId;
          this.taxCodeName = this.selectedVale.taxCodeName;

          this.jorbdForm.controls["taxPercentage"].setValue(this.selectedVale.taxPercentage);

          this.jorbdForm.controls["minValue"].setValue(this.selectedVale.minValue ? this.selectedVale.minValue : 0);
          //this.checkCIF();
          this.getQuantity();
        }
      }
      this.GetJOCBInvoiceDetailsId();
    })
  }
  sourceEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.sourceFromId = null;
    }
  }

  //#region select CalculationParameter
  GetAllCalculationParameter() {
    this.commonService.GetAllCalculationParameter().subscribe(result => {
      this.CalculationParlist = result;
      this.CalculationParFun()
    });
  }
  CalculationParFun() {
    this.filteredCalculationParOptions$ = this.jorbdForm.controls['calculationParameterId'].valueChanges.pipe(
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
    this.jorbdForm.controls['calculationParameterId'].setValue('');
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
    this.jorbdForm.controls['calculationTypeId'].setValue(selectedValue);

    if (this.calculationType) {
      this.calculationTypeReadonly = true;
    } else {
      this.calculationTypeReadonly = false;
    }
    this.getQuantity();
    // this.jobOrderRevenueBookingService.GetQuatityFromJO(this.jobOrderId,this.calculationParameterId).subscribe(res=>{
    // this.quantityfromJO=res;
    // console.log(' this.quantityfromJO', this.quantityfromJO);
    // this.jorbdForm.controls['quantity'].setValue(this.quantityfromJO);
    // this.calculateValue();
    // this.checkCIF();
    // });

    // this.calculateValue();
    // this.checkCIF();
  }
  getQuantity(){
    this.jobOrderRevenueBookingService.GetQuatityFromJO(this.jobOrderId,this.calculationParameterId).subscribe(res=>{
      this.quantityfromJO=res;
      console.log(' this.quantityfromJO', this.quantityfromJO);
      this.jorbdForm.controls['quantity'].setValue(this.quantityfromJO);
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
    this.filteredCalculationTypeOptions$ = this.jorbdForm.controls['calculationTypeId'].valueChanges.pipe(
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
    this.jorbdForm.controls['calculationTypeId'].setValue('');
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
  }

  //#region select taxcode
  getTaxCode() {
    this.commonService.GetAllActiveTaxCodes().subscribe(result => {
      this.taxcodelist = result;
      this.TaxCodeFun()
    });
  }
  TaxCodeFun() {
    this.filteredTaxCodeOptions$ = this.jorbdForm.controls['taxId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.taxCodeName)),
      map((name: any) => (name ? this.filteredTaxCodeOptions(name) : this.taxcodelist?.slice()))
    );
  }
  private filteredTaxCodeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.taxcodelist.filter((option: any) => option.taxCodeName.toLowerCase().includes(filterValue));
    this.jorbdForm.controls['taxPercentage'].setValue(null);
    this.taxPercentage = null;
    return results.length ? results : this.NoDataTaxCode();
  }
  NoDataTaxCode(): any {
    this.jorbdForm.controls['taxId'].setValue(null);
    return this.taxcodelist;
  }
  displayTaxCodeLabelFn(data: any): string {
    return data && data.taxCodeName ? data.taxCodeName : '';
  }

  TaxCodeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.taxId = selectedValue.taxCodeId;
    this.taxCodeName = selectedValue.taxCodeName;
    this.taxPercentage = selectedValue.taxPer;
    this.jorbdForm.controls['taxPercentage'].setValue(this.taxPercentage);
    this.calculateVCurrency()
  }

  emptytaxper(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.jorbdForm.controls['taxPercentage'].setValue(null);
      this.taxPercentage = null;
      this.taxCodeName = '';
      this.taxId = null;
    }
  }

  //#region Add to List
  AddtoList() {
    debugger
    this.minValue = this.jorbdForm.controls['minValue'].value;
    let isservice = this.jorbdForm.controls['serviceInId'].value;
    if (isservice?.countryName === "" || isservice?.countryName === undefined || isservice?.countryName === null) {
      this.jorbdForm.controls['serviceInId'].reset();
    }
    if (this.sourceFromId === null || this.sourceFromId === undefined) {
      this.jorbdForm.controls['sourceFromId'].reset();
    }
    let iscalculationParameterId = this.jorbdForm.controls['calculationParameterId'].value
    if (iscalculationParameterId?.calculationParameterId === null || iscalculationParameterId?.calculationParameterId === undefined || iscalculationParameterId?.calculationParameterId === null) {
      this.jorbdForm.controls['calculationParameterId'].reset();
    }
    let iscalculationTypeId = this.jorbdForm.controls['calculationTypeId'].value
    if (iscalculationTypeId?.calculationTypeId === null || iscalculationTypeId?.calculationTypeId === undefined || iscalculationTypeId?.calculationTypeId === null) {
      this.jorbdForm.controls['calculationTypeId'].reset();
    }

    let tax = this.jorbdForm.controls['taxId'].value
    if (tax?.taxCodeName === "" || tax?.taxCodeName === undefined || tax?.taxCodeName === null) {
      this.jorbdForm.controls['taxId'].reset();
    }

    if (this.jorbdForm.valid) {
      const jorbDetail: JorbDetailDialogComponent = {
        ...this.jorbdForm.value,
      }

      this.totalInCompanyCurrency = this.jorbdForm.controls['totalInCompanyCurrency'].value;
      this.totalInCustomerCurrency = this.jorbdForm.controls['totalInCustomerCurrency'].value;
      let quantity = this.jorbdForm.controls['quantity'].value;
      if (quantity == 0) {
        Swal.fire({
          icon: "info",
          title: "Information",
          text: "The quantity is set to zero. Please verify the quantity value.",
          showConfirmButton: true,
        });
        return;
      }
      jorbDetail.quantity = quantity ? quantity : this.quantity;


      jorbDetail.lineItemCategoryName = this.lineItemCategoryName;
      jorbDetail.lineItemCode = this.lineItemCode;
      jorbDetail.lineItemName = this.lineItemName;
      jorbDetail.joLineitemId = this.joLineitemId;

      jorbDetail.revenueLineitemId = this.revenueLineitemId;

      jorbDetail.refNumber = this.refNumber
      jorbDetail.refNumberId = this.refNumberId

      jorbDetail.countryName = this.countryName;
      jorbDetail.serviceInId = this.serviceInId;

      jorbDetail.regionId = this.regionId;
      jorbDetail.regionName = this.regionName;

      jorbDetail.sourceFromId = this.sourceFromId;
      jorbDetail.clientSourceFrom = this.clientSourceFrom;

      jorbDetail.calculationParameter = this.calculationParameter;
      jorbDetail.calculationParameterId = this.calculationParameterId;

      jorbDetail.calculationType = this.calculationType;
      jorbDetail.calculationTypeId = this.calculationTypeId;

      jorbDetail.taxCodeName = this.taxCodeName;
      jorbDetail.taxId = this.taxId;

      jorbDetail.updatedByEmp = this.updatedByEmp;
      jorbDetail.createdByEmp = this.createdByEmp;

      jorbDetail.minValue = this.minValue ? this.minValue : 0
      jorbDetail.updatedBy=parseInt(this.userId$);
      jorbDetail.updatedDate=  this.date;

      jorbDetail.totalInCompanyCurrency = parseFloat(this.totalInCompanyCurrency);
      jorbDetail.totalInCustomerCurrency = parseFloat(this.totalInCustomerCurrency);

      this.partiallyBooked = this.jorbdForm.controls['partiallyBooked'].value;
      jorbDetail.partiallyBooked=this.partiallyBooked;

      this.dialogRef.close(jorbDetail);
      this.jorbdForm.reset();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.jorbdForm.markAllAsTouched();
      this.validateall(this.jorbdForm);
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

  //#region close Dialog window
  Close() {
    this.dialogRef.close();
  }
  getExchange() {
    this.jorbdForm.controls['exchangeRate'].reset();

    this.commonService.GetExchangeById(this.currencyId).subscribe(res => {
      this.exchangeValue = res;
      this.exchangerate = this.exchangeValue.exchangerate;
      this.jorbdForm.controls['exchangeRate'].setValue(this.exchangerate);
      this.calculateVCurrency()
    })
  }

  //#region Calculation
  unit(event: any) {
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
    this.jorbdForm.controls['unitPrice'].setValue(input.value);
    let calculationParam = this.jorbdForm.controls['calculationParameterId'].value;
    let calculationType = this.jorbdForm.controls['calculationTypeId'].value;
    if (calculationParam?.calculationParameter === 'CI Value') {
      if (calculationType?.calculationType === 'Percentage') {
        this.calculateValue()
        this.checkCIF();
      } else {
        this.calculateValue()
        this.calculateVCurrency();
        this.jorbdForm.controls['quantity'].enable();
      }
    } else {
      this.calculateValue()
      this.calculateVCurrency();
      this.jorbdForm.controls['quantity'].enable();
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
    this.jorbdForm.controls['quantity'].setValue(input.value);
    this.calculateValue();
    this.calculateVCurrency();
  }

  calculateValue() {
    debugger
    const rate = this.jorbdForm.controls['unitPrice'].value || 0.00
    const quantity = this.jorbdForm.controls['quantity'].value || 0.00
    const values = rate * quantity;
    //   this.jorbdForm.controls['taxableValue'].setValue(values.toFixed(4));

    const minvalue = this.jorbdForm.controls['minValue'].value;
    if (minvalue) {
      if (minvalue < values) {
        this.jorbdForm.controls['taxableValue'].setValue(values.toFixed(4));
      } else if(minvalue >= values) {
        this.jorbdForm.controls['taxableValue'].setValue(minvalue);
      }
    }
    else {
      this.jorbdForm.controls['taxableValue'].setValue(values.toFixed(4));
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
    this.jorbdForm.controls['taxValue'].setValue(input.value);
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
    this.jorbdForm.controls['exchangeRate'].setValue(input.value);
    this.calculateVCurrency();
  }

  calculateVCurrency() {
    this.taxValueCalculate();
    const value = this.jorbdForm.controls['taxableValue'].value || 0.00
    const taxValue = this.jorbdForm.controls['taxValue'].value || 0.00
    const values = parseFloat(value) + parseFloat(taxValue);
    this.jorbdForm.controls['totalInCustomerCurrency'].setValue(values.toFixed(2));
    this.calculateCCurrency();
  }
  calculateCCurrency() {
    const totalInCustomerCurrency = this.jorbdForm.controls['totalInCustomerCurrency'].value || 0.00
    const exchangeRate = this.jorbdForm.controls['exchangeRate'].value || 0.00
    const values = parseFloat(totalInCustomerCurrency) / parseFloat(exchangeRate);
    this.jorbdForm.controls['totalInCompanyCurrency'].setValue(values.toFixed(2));
  }
  taxValueCalculate() {
    const value = parseFloat(this.jorbdForm.controls['taxableValue'].value) ? parseFloat(this.jorbdForm.controls['taxableValue'].value) : 0;
    this.taxPercentage = this.jorbdForm.controls['taxPercentage'].value;
    let taxvalue = (value / 100) * this.taxPercentage
    if (this.taxPercentage) {
      this.jorbdForm.controls['taxValue'].setValue(taxvalue.toFixed(4));
    }
    //this.calculateVCurrency();
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
    this.jorbdForm.controls['minValue'].setValue(input.value);
    this.calculateValue();
    this.checkCIF();

    this.calculateValue();
    this.calculateVCurrency();
  }

  //#region check CIF


  checkCIF() {
    debugger;
    let calculationParam = this.jorbdForm.controls['calculationParameterId'].value;
    let calculationType = this.jorbdForm.controls['calculationTypeId'].value;

    if (calculationParam?.calculationParameter === 'CI Value') {
      if (calculationType?.calculationType === 'Percentage') {
        this.jorbdForm.controls['quantity']?.patchValue(1);
        this.quantity = 1;
        let rate = parseFloat(this.jorbdForm.controls['unitPrice']?.value);
        rate = isNaN(rate) ? 0 : rate;
        let CIFvalue = this.data.CIFValue;
        CIFvalue = typeof CIFvalue === 'number' ? CIFvalue : 0;

        let cifPer = CIFvalue / 100;
        let multipliedValue = cifPer * rate;

        const minvalue = this.jorbdForm.controls['minValue'].value;
        if (minvalue) {
          if (minvalue <= multipliedValue) {
            this.jorbdForm.patchValue({ taxableValue: isNaN(multipliedValue) ? 0 : multipliedValue.toFixed(4) });

          } else {
            this.jorbdForm.controls['taxableValue'].setValue(minvalue);
          }
        }
        else {
          this.jorbdForm.patchValue({ taxableValue: isNaN(multipliedValue) ? 0 : multipliedValue.toFixed(4) });
        }
        this.jorbdForm.controls['quantity'].disable();
      } else {
        this.jorbdForm.controls['quantity'].enable();
      }
    }
    else {
      this.jorbdForm.controls['quantity'].enable();
    }
    this.calculateVCurrency();
  }

  isTotalLessThanActual(): boolean {
    const totalInCompanyCurrency = parseFloat(this.jorbdForm.controls['totalInCompanyCurrency'].value) || 0;
    const actualExpense = parseFloat(this.jorbdForm.controls['actualExpense'].value) || 0;
    return totalInCompanyCurrency < actualExpense;
  }
  onpartiallyBookedChange(event: any) {
    debugger
    const value = event.checked;
    if (this.partiallyBooked == true || this.partiallyBooked == false && this.joRevenueBookingDetailId==0) {
      this.jorbdForm.controls['partiallyBooked'].setValue(value)
    }
    else if(this.partiallyBooked == true && this.joRevenueBookingDetailId!=0){
      this.jorbdForm.controls['partiallyBooked'].setValue(value)
    }
    else if(this.partiallyBooked == false && this.joRevenueBookingDetailId!=0){
      this.jorbdForm.controls['partiallyBooked'].setValue(false)
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Can't select an already revenue booked Line Item.",
        showConfirmButton: true,
      });
    }
  }

}
