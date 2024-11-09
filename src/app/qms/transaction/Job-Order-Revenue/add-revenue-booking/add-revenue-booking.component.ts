import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, startWith } from 'rxjs';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { DateValidatorService } from 'src/app/qms/date-validator';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { JORBModelContainer, JORevenueBookingDetail, JORevenueBookingGeneral } from '../Job-order-revenue-modals';
import { JorbDetailDialogComponent } from '../jorb-detail-dialog/jorb-detail-dialog.component';
import { JorbLineitemDialogComponent } from '../jorb-lineitem-dialog/jorb-lineitem-dialog.component';
import { JobOrderRevenueBookingService } from '../Job-order-revenue.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { JOLineItemModal } from '../../Job-Order/job-order.modals';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { CustomerContainer } from 'src/app/crm/master/customer/customer.model';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { aggregateBy, AggregateResult } from '@progress/kendo-data-query';
import { changeExchange, Exchange } from '../../Quotations/quotation-model/quote';
import { QuotationService } from '../../Quotations/quotation.service';
import { GridComponent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';


export const MY_FORMATS = {
  parse: {
    dateInput: ['DD/MM/YYYY', 'DD/MMM/YYYY'] as any,
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-add-revenue-booking',
  templateUrl: './add-revenue-booking.component.html',
  styleUrls: ['./add-revenue-booking.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddRevenueBookingComponent {
  viewMode: boolean = false;
  userId$: string;
  revenueForm: FormGroup

  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  disablefields: boolean = false;
  date = new Date();
  hidebutton: boolean;
  joList: any[] = [];
  filteredJobOrderOptions$: Observable<any[]>;
  jobOrderId: any;
  jorbGeneral: JORevenueBookingGeneral;
  jorbValuebyId: JORBModelContainer;
  JORevenueBookingDetail: JORevenueBookingDetail[] = [];
  jodetails: any;

  Edit: boolean = false;
  joRevenueBookingId: number;
  gereralEdit: boolean;
  fromJO: boolean = false;
  joLineItemvalue: JOLineItemModal[];
  customerId: any;
  customerDetails: CustomerContainer;

  currencyList: Currency[];
  filteredCurrencyListOptions$: Observable<any[]>;
  custBillingCurrencyId: any;
  customerdisable: boolean = false;
  datereadonly: boolean = false;

  //Kendo grid
  public aggregates: any[] = [
    { field: "totalInCompanyCurrency", aggregate: "sum" },
    { field: "totalInCustomerCurrency", aggregate: "sum" },
  ];
  public total: AggregateResult;
  CIFValue: any;
  CIFCurrencyName: any;
  exchangecurrency: changeExchange;
  cifCurrencyId: any;
  invalidDetails: any[] = [];
  revenueBookingList: JORevenueBookingGeneral[];
  JOmatchvalue: JORevenueBookingGeneral | undefined;
  destCountryId: any;
  jobOrderAgainstId: any;
  joAgainst: any;
  selectedLineItems: any[];

  selectedKeys: any[] = [];
  JORevenueBookingDetailfomJO: JORevenueBookingDetail[];
  joSelect: boolean = false;
  isDraft: boolean;
  JORevenueBookingDetailPartiallyBooked: JORevenueBookingDetail[];
  alreadyBooked: boolean;
  UnknownValueList: any[]=[];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<{ privileges: { privileges: any } }>,
    private jobOrderRevenueBookingService: JobOrderRevenueBookingService,
    private ErrorHandling: ErrorhandlingService,
    private regionService: RegionService,
    private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog,
    public dialogline: MatDialog,
    private commonService: CommonService,
    private quotationService: QuotationService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private vendorSvc: VendorService,
    private customerService: CustomerService,
    public dateValidator: DateValidatorService,
    private errorHandler: ApiErrorHandlerService
  ) {
  }
  ngOnInit() {
    debugger
    this.GetUserId();
    this.iniForm();
    this.getCurrencyList()
    this.getUnknownValues();

    // #region from JO
    this.jobOrderId = this.jobOrderRevenueBookingService.joId;

    this.jobOrderRevenueBookingService.GetAllJORevenueBooking().subscribe((res: any) => {
      this.revenueBookingList = res;
      this.JOmatchvalue = this.revenueBookingList.find(x => x.jobOrderId == this.jobOrderId);

      if (this.revenueBookingList.length != 0 && this.JOmatchvalue) {

        this.joRevenueBookingId = this.JOmatchvalue.joRevenueBookingId;
        this.gereralEdit = true;
        this.Edit = true;
        this.fromJO = true;
        this.getJORBbyId();
        this.GetAllJobOrderInEdit();

      } else {

        if (this.jobOrderId && this.jobOrderId != 0) {
          this.Edit = true;
          this.fromJO = true;
          this.gereralEdit = false;
          this.regionService.GetAllJobOrder().subscribe((res: any) => {
            this.joList = res;
            this.JobOrderFun();
            let joValue = this.joList.find(item => item.jobOrderId === this.jobOrderId);
            this.revenueForm.controls['jobOrderId'].setValue(joValue);
            this.GetJobOrderById(this.jobOrderId);
            // this.patchLineItemNew();
            this.patchLineItemFromJO();
          });
          return;
        }
      }
    });

    if (this.jobOrderRevenueBookingService.isEdit == true && this.jobOrderRevenueBookingService.isView == false) {
      this.joRevenueBookingId = this.jobOrderRevenueBookingService.itemId;
      this.gereralEdit = true;
      this.Edit = true;
      this.getJORBbyId();
      this.GetAllJobOrderInEdit();

    } else if (this.jobOrderRevenueBookingService.isEdit == false && this.jobOrderRevenueBookingService.isView == true) {
      this.joRevenueBookingId = this.jobOrderRevenueBookingService.itemId;
      this.gereralEdit = false;
      this.Edit = true;
      this.viewMode = true;
      this.disablefields = true;
      this.revenueForm.controls['isDraft'].disable();
      this.getJORBbyId();
      this.GetAllJobOrderInEdit();
    }
    else {
      this.GetAllJobOrder();
    }
  }
  getJORBbyId() {
    debugger
    this.jobOrderRevenueBookingService.GetAllByIdJORevenueBookingId(this.joRevenueBookingId).subscribe(res => {
      this.jorbValuebyId = res;
      this.jobOrderId = this.jorbValuebyId.jorbGeneral.jobOrderId
      this.JORevenueBookingDetail = this.jorbValuebyId.jorbDetail;
      this.custBillingCurrencyId = res.jorbGeneral.custBillingCurrencyId;
      this.JORevenueBookingDetail = [...this.JORevenueBookingDetail]
      this.JORevenueBookingDetailPartiallyBooked = this.JORevenueBookingDetail.filter(x => x.partiallyBooked == true);

     
      this.GetJobOrderById(this.jobOrderId);
      this.patchLineItemNew();
      this.calculateAggregates();
      this.revenueForm.patchValue(this.jorbValuebyId.jorbGeneral);
      this.revenueForm.controls['jobOrderId'].setValue(this.jorbValuebyId.jorbGeneral);
      const isChecked = this.revenueForm.controls['isDraft'].value
      if (isChecked) {
        this.hidebutton = false;
      } else {
        this.hidebutton = true;
        this.datereadonly = true;
        this.revenueForm.controls['isDraft'].disable();
      }
      if(this.joRevenueBookingId)
        {
          this.customerdisable = true;
        }
      //this.calculateAggregates();
    });
  }
  dateFilter1 = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return !date || date <= currentDate;
  };
  //#region Form
  iniForm() {
    this.revenueForm = this.fb.group({
      joRevenueBookingId: [0],
      revenueBookingDate: ['', Validators.required],
      jobOrderId: ['', Validators.required],
      referenceNumber: [''],
      customerName: [''],
      custBillingCurrencyId: [],
      jobTypeName: [''],
      salesOwner: [''],
      jobOwnerName: [''],
      jobStage: [''],
      jobStageStatus: [''],
      isDraft: [true],
      remarks: [''],
      overallCIFValue: [''],
      cifCurrencyName: [''],
      totalinCompanyCurrency: [0.00],
      totalInCustomerCurrency: [0.00],

      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });
    this.revenueForm.controls['revenueBookingDate'].setValue(this.date);
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  onDraftChange(event: any) {
    debugger
    const isChecked = event.checked;
    if (isChecked) {
      this.hidebutton = false;
    } else {
      this.hidebutton = true;
    }
  }
  emptytjo(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.revenueForm.reset();
      this.jobOrderId = null;
      this.customerId = null;
      this.custBillingCurrencyId = null
    }
  }
  // #region General save
  onSaveGeneral(value: any) {
    debugger
    if (value === 'Save') {
      this.revenueForm.controls['isDraft'].setValue(false);
      this.isDraft = false;
    }
    else if (value === 'Draft') {
      this.isDraft = true;
      this.revenueForm.controls['isDraft'].setValue(true);
    }
    let totalInCustomerCurrency = this.total?.['totalInCustomerCurrency']?.sum ? this.total?.['totalInCustomerCurrency']?.sum : 0.0000
    this.revenueForm.controls['totalInCustomerCurrency']?.setValue(totalInCustomerCurrency);

    let totalCompanyCurrency = this.total?.['totalInCompanyCurrency']?.sum ? this.total?.['totalInCompanyCurrency']?.sum : 0.0000
    this.revenueForm.controls['totalinCompanyCurrency']?.setValue(totalCompanyCurrency);

    const validDateValue1 = this.revenueForm?.get('revenueBookingDate')?.value;
    if (validDateValue1) {
      let adjustedDate = new Date(validDateValue1);
      // Adjust timezone to match your local timezone
      const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
      adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
      this.revenueForm.get('revenueBookingDate')?.setValue(adjustedDate);
    }

    this.revenueForm.controls['revenueBookingDate'].setErrors(null);
    //if (this.revenueForm.valid ||this.isDraft==true)
    if (this.revenueForm.valid || this.isDraft == true) {

      let JORId = this.revenueForm.controls['joRevenueBookingId'].value;
      if(!JORId){
        this.revenueForm.controls['joRevenueBookingId'].setValue(0);
      }

      this.jorbGeneral = this.revenueForm.value;
      this.jorbGeneral.jobOrderId = this.jobOrderId
      this.jorbGeneral.custBillingCurrencyId = this.custBillingCurrencyId

      this.jorbGeneral.custBillingCurrencyId = this.custBillingCurrencyId ? this.custBillingCurrencyId : this.getUnknownId("Currency")
      this.jorbGeneral.updatedBy = parseInt(this.userId$);
      this.jorbGeneral.updatedDate = this.date;

      if (this.selectedLineItems == undefined) {
        this.selectedLineItems = [];
      }
      let updatedJORevenueBookingDetail = this.selectedLineItems.map(option => {
        return {
          ...option,
          taxPer: String(option.taxPercentage)
        };
      });

      let i = 0;
      this.invalidDetails = [];

      this.selectedLineItems.forEach(jorbDetail => {
        if (
          jorbDetail.serviceInId == null || jorbDetail.serviceInId === 0 ||
          jorbDetail.regionId == null || jorbDetail.regionId === 0 ||
          jorbDetail.calculationParameterId == null || jorbDetail.calculationParameterId === 0 ||
          jorbDetail.calculationTypeId == null || jorbDetail.calculationTypeId === 0 ||
          jorbDetail.taxId == null || jorbDetail.taxId === 0 ||
          jorbDetail.unitPrice == null || jorbDetail.unitPrice === 0 ||
          jorbDetail.quantity == null || jorbDetail.quantity === 0 ||
          jorbDetail.taxValue == null ||
          jorbDetail.exchangeRate == null || jorbDetail.exchangeRate === 0
        ) {
          i++;
          this.invalidDetails.push(jorbDetail.lineItemName);
        }
      });

      if (i > 0) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Please fill the details for the selected following line items: " + this.invalidDetails.join(", ") + ".",
          showConfirmButton: true,
        });
        this.invalidDetails = [];
        return;
      }

      this.JORevenueBookingDetail.forEach(item => {

        if (item.joRevenueBookingDetailId != 0) {
          let value = updatedJORevenueBookingDetail.find(x => x.joRevenueBookingDetailId == item.joRevenueBookingDetailId)
          if (!value) {
            item.selected = false;
            updatedJORevenueBookingDetail.push(item);
          }
        }
      });
      if (this.joSelect) {
        updatedJORevenueBookingDetail.map(x => {
          x.createdBy = parseInt(this.userId$);
          x.createdDate = this.date;
          x.updatedBy = parseInt(this.userId$);
          x.updatedDate = this.date;
          return x;
        });
      } else {
        updatedJORevenueBookingDetail.map(x => {
          if (x.joCostBookingDetailId === 0) {
            x.createdBy = parseInt(this.userId$);
            x.createdDate = this.date;
            x.updatedBy = parseInt(this.userId$);
            x.updatedDate = this.date;
          }
          return x;
        });
      }
      const ModelContainer: JORBModelContainer = {
        jorbGeneral: this.jorbGeneral,
        jorbDetail: updatedJORevenueBookingDetail
      }
      console.log(ModelContainer);

      if (ModelContainer.jorbGeneral.joRevenueBookingId == 0) {
        this.jobOrderRevenueBookingService.JORevenueBookingSave(ModelContainer).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
              "Added Sucessfully"
            );
            this.jobOrderRevenueBookingService.setJOId(0);
            this.returnToList();
          },
          error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if(stausCode === 500){
              this.errorHandler.handleError(err);
            } else if(stausCode === 400){
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          }
          // error: (error) => {
          //   console.log(error)
          //   var ErrorHandle = this.ErrorHandling.handleApiError(error)
          //   this.commonService.displayToaster(
          //     "error",
          //     "Error",
          //     ErrorHandle
          //   );
          // },
        });
      }
      else {
        this.jobOrderRevenueBookingService.JORevenueBookingSave(ModelContainer).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
              "Updated Sucessfully"
            );
            this.returnToList();
          },
          error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if(stausCode === 500){
              this.errorHandler.handleError(err);
            } else if(stausCode === 400){
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          }
          // error: (error) => {
          //   console.log(error)
          //   var ErrorHandle = this.ErrorHandling.handleApiError(error)
          //   this.commonService.displayToaster(
          //     "error",
          //     "Error",
          //     ErrorHandle
          //   );
          // },
        });
      }
    }
    else {
      const invalidControls = this.findInvalidControls();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
      this.revenueForm.markAllAsTouched();
      this.validateall(this.revenueForm);

    }
  }
  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.revenueForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(this.capitalizeWords(this.toUpperCaseAndTrimId(name)));
      }
    }
    return invalidControls;
  }
  private calculateAggregates(): void {
    debugger
    this.total = aggregateBy(this.JORevenueBookingDetail, this.aggregates);
  }

  toUpperCaseAndTrimId(name: string): string {
    if (name.endsWith('Id')) {
      name = name.slice(0, -2);
    }
    return name;
  }
  capitalizeWords(name: string): string {
    const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
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

  // #region GetAllJobOrder
  GetAllJobOrderInEdit() {
    this.regionService.GetAllJobOrder().subscribe((res: any) => {
      this.joList = res;
      this.JobOrderFun();
    });
  }
  GetAllJobOrder() {
    this.regionService.GetJOIsJORevenueBooking().subscribe((res: any) => {
      this.joList = res;
      this.JobOrderFun();
    });
  }
  JobOrderFun() {
    debugger
    this.filteredJobOrderOptions$ = this.revenueForm.controls['jobOrderId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobOrderNumber)),
      map((name: any) => (name ? this.filteredJobOrderOptions(name) : this.joList?.slice()))
    );
  }
  private filteredJobOrderOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.joList.filter((option: any) => option.jobOrderNumber.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataJobOrder();
  }
  NoDataJobOrder(): any {
    this.revenueForm.controls['jobOrderId'].setValue('');
    return this.joList;
  }
  displayJobOrderListLabelFn(data: any): string {
    return data && data.jobOrderNumber ? data.jobOrderNumber : '';
  }
  JobOrderSelectedoption(data: any) {
    this.joSelect = true;
    let selectedValue = data.option.value;
    this.jobOrderId = selectedValue.jobOrderId;
    this.JORevenueBookingDetail = [];
    this.GetJobOrderById(this.jobOrderId);
    //this.patchLineItem();
    this.patchLineItemFromJO();
  }

  //#region Load Line Item from JO

  patchLineItemFromJO() {
    this.jobOrderRevenueBookingService.GetJORevenueBookingLineItemDetails(this.jobOrderId).subscribe(res => {
      this.JORevenueBookingDetail = res;
      // this.JORevenueBookingDetail.forEach(item => {
      //   item.selected = true;
      // });
      // this.selectedKeys = this.JORevenueBookingDetail.map(item => item.lineItemName);
      // this.selectedLineItems = this.JORevenueBookingDetail;
      // console.log('JORevenueBookingDetail', this.JORevenueBookingDetail);

      // const event = {
      //   selectedRows: this.JORevenueBookingDetail.map(item => ({ dataItem: item })),
      //   deselectedRows: []
      // };
      // this.onSelectionChange(event);
      this.calculateAggregates();
    });
  }

  patchLineItemNew() {
    debugger
    this.jobOrderRevenueBookingService.GetJORevenueBookingLineItemDetails(this.jobOrderId).subscribe(res => {
      this.JORevenueBookingDetailfomJO = res;
      console.log('JORevenueBookingDetailfomJO:', this.JORevenueBookingDetailfomJO);


      this.selectedKeys = this.JORevenueBookingDetail.map(item => item.lineItemName);
      this.selectedLineItems = this.JORevenueBookingDetail;
      console.log('JORevenueBookingDetail', this.JORevenueBookingDetail);

      const event = {
        selectedRows: this.JORevenueBookingDetail.map(item => ({ dataItem: item })),
        deselectedRows: []
      };
      this.onSelectionChangeEdit(event);

      if (this.JORevenueBookingDetailfomJO) {
        const existingLineItemNames = new Set(this.JORevenueBookingDetail.map(item => item.lineItemName));

        this.JORevenueBookingDetailfomJO.forEach(itemFromJO => {
          if (!existingLineItemNames.has(itemFromJO.lineItemName)) {
            this.JORevenueBookingDetail.push(itemFromJO);
          }
        });
        this.JORevenueBookingDetail = [...this.JORevenueBookingDetail];

        this.selectedLineItems = this.selectedLineItems?.filter(option => option?.joRevenueBookingDetailId != 0)
        console.log('Updated JORevenueBookingDetail:', this.JORevenueBookingDetail);
        console.log(' this.selectedLineItems', this.selectedLineItems);
      }

      this.calculateAggregates();
    });
  }
  patchLineItemOnFirst() {
    debugger
    this.jobOrderRevenueBookingService.GetJORevenueBookingLineItemDetails(this.jobOrderId).subscribe(res => {
      this.JORevenueBookingDetailfomJO = res;
      console.log('JORevenueBookingDetailfomJO:', this.JORevenueBookingDetailfomJO);

      if (this.JORevenueBookingDetailfomJO) {
        const existingLineItemNames = new Set(this.JORevenueBookingDetail.map(item => item.lineItemName));

        this.JORevenueBookingDetailfomJO.forEach(itemFromJO => {
          if (!existingLineItemNames.has(itemFromJO.lineItemName)) {
            this.JORevenueBookingDetail.push(itemFromJO);
          }
        });
        //this.JORevenueBookingDetail = [...this.JORevenueBookingDetail];
        this.selectedLineItems = this.selectedLineItems?.filter(option => option?.selected == true)
        console.log('Updated JORevenueBookingDetail:', this.JORevenueBookingDetail);
      }

      this.calculateAggregates();
    });
  }


  // patchLineItem() {
  //   debugger
  //   this.regionService.GetJobOrderById(this.jobOrderId).subscribe((res: any) => {
  //     this.jodetails = res;
  //     if (this.jodetails.joLineItem) {
  //       this.joLineItemvalue = this.jodetails.joLineItem;

  //       this.joLineItemvalue.forEach(dataModel => {
  //         let joRevenueBookingDetail: JORevenueBookingDetail = {
  //           joRevenueBookingDetailId: 0,
  //           joRevenueBookingId: 0,
  //           revenueLineitemId: dataModel.lineItemId,
  //           joLineitemId: dataModel.joLineItemId,
  //           aliasName: dataModel.lineItemName || "",
  //           regionId: dataModel.regionId,
  //           serviceInId: dataModel.serviceInId,
  //           sourceFromId: null,
  //           refNumberId: null,
  //           isAmendPrice: false,
  //           minValue: 0,
  //           calculationParameterId: null,
  //           calculationTypeId: null,
  //           unitPrice: 0,
  //           quantity: 0,
  //           taxableValue: 0,
  //           taxId: null,
  //           taxPercentage: 0,
  //           taxValue: 0,
  //           totalInCustomerCurrency: 0,
  //           exchangeRate: 0,
  //           totalInCompanyCurrency: 0,
  //           multiInvoice: false,
  //           proformaInvoiceRefNo: "",
  //           proformaInvoiceRefNoId: "",
  //           invoicedAmount: 0,
  //           remarks: "",
  //           createdBy: parseInt(this.userId$),
  //           createdDate: this.date,
  //           updatedBy: parseInt(this.userId$),
  //           updatedDate: this.date,
  //           refNumber: "",
  //           regionName: dataModel.regionName || "",
  //           calculationType: "",
  //           calculationParameter: "",
  //           taxCodeName: "",
  //           clientSourceFrom: "",
  //           lineItemName: dataModel.lineItemName || "",
  //           lineItemCode: dataModel.lineItemCode || "",
  //           lineItemCategoryName: dataModel.lineItemCategoryName || "",
  //           countryName: dataModel.countryName || "",
  //           isFullyInvoiced: false,
  //           selected: false,
  //           actualExpense: 0.00
  //         };

  //         const exists = this.JORevenueBookingDetail.some(x => x.lineItemName === joRevenueBookingDetail.lineItemName);
  //         if (!exists) {
  //           this.JORevenueBookingDetail.push(joRevenueBookingDetail);
  //         }
  //       });
  //       this.JORevenueBookingDetail = [...this.JORevenueBookingDetail];

  //       this.calculateAggregates();
  //     }
  //   });
  // }

  // #region GetJobOrder by id
  GetJobOrderById(id: number) {
    debugger
    this.regionService.GetJobOrderById(id).subscribe((res: any) => {
      this.jodetails = res;
      this.revenueForm.controls['customerName'].setValue(this.jodetails.joGeneral.customerName);
      this.revenueForm.controls['jobTypeName'].setValue(this.jodetails.joGeneral.jobTypeName);
      this.revenueForm.controls['salesOwner'].setValue(this.jodetails.joGeneral.salesOwner);
      this.revenueForm.controls['jobOwnerName'].setValue(this.jodetails.joGeneral.jobOwnerName);
      this.revenueForm.controls['jobStage'].setValue(this.jodetails.joGeneral.jobStage);
      this.revenueForm.controls['jobStageStatus'].setValue(this.jodetails.joGeneral.jobStageStatus);
      this.revenueForm.controls['overallCIFValue'].setValue(this.jodetails.joGeneral.overallCIFValue);
      this.revenueForm.controls['cifCurrencyName'].setValue(this.jodetails.joGeneral.cifCurrencyName);
      this.CIFValue = this.jodetails.joGeneral.overallCIFValue;
      this.CIFCurrencyName = this.jodetails.joGeneral.cifCurrencyName;
      this.destCountryId = this.jodetails.joGeneral.destCountryId;
      this.customerId = this.jodetails.joGeneral.customerId;

      this.jobOrderAgainstId = this.jodetails.joGeneral.jobOrderAgainstId;
      this.joAgainst = this.jodetails.joGeneral.joAgainst;

      this.customerService.getAllCustomerById(this.customerId).subscribe(res => {
        this.customerDetails = res;
        if(!this.custBillingCurrencyId){
          this.custBillingCurrencyId = this.customerDetails.customer.customerCurrencyId;
        }
        if (this.Edit) {
          let currency = this.currencyList.find(x => x.currencyId == this.custBillingCurrencyId)
          this.revenueForm.controls['custBillingCurrencyId'].setValue(currency);

        } else {
          let currency = this.currencyList.find(x => x.currencyId == this.customerDetails.customer.customerCurrencyId)
          this.revenueForm.controls['custBillingCurrencyId'].setValue(currency);
        }

        if (this.customerDetails.customer.billingCurrencyId == 1) {
          this.customerdisable = true;
        } else {
          this.customerdisable = false;
        }
        if(this.joRevenueBookingId)
          {
            this.customerdisable = true;
            this.revenueForm.controls['custBillingCurrencyId'].disable();
          }else{
            this.customerdisable = false;
            this.revenueForm.controls['custBillingCurrencyId'].enable();
          }

        //CIF Currency 
        this.CIFValueGet();
      });
    });
  }
  CIFValueGet() {
    if (this.CIFCurrencyName) {
      let CIFcurrency = this.currencyList.find(x => x.currencyName == this.CIFCurrencyName)
      this.cifCurrencyId = CIFcurrency?.currencyId
      if (this.custBillingCurrencyId == CIFcurrency?.currencyId) {
        this.CIFValue = this.jodetails.joGeneral.overallCIFValue;
      } else {
        const payload: Exchange = {
          fromCurrencyId: this.cifCurrencyId,
          toCurrencyId: this.custBillingCurrencyId,
          value: this.CIFValue
        };
        this.quotationService.CurrencyExchanges(payload).subscribe((res => {
          this.exchangecurrency = res;
          let CIFvalue = this.exchangecurrency.convertedValue;
          this.CIFValue = typeof CIFvalue === 'number' ? CIFvalue : 0;
        }));
      }
    }
  }

  getUnknownValues() {
    this.commonService.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
  }

  //#region  currency
  getCurrencyList() {
    this.commonService.getCurrencies(1).subscribe(result => {
      this.currencyList = result;
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.revenueForm.controls['custBillingCurrencyId'].valueChanges.pipe(
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
    this.revenueForm.controls['custBillingCurrencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.custBillingCurrencyId = selectedValue.currencyId;
    this.CIFValueGet();
  }
  CCEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.custBillingCurrencyId = null;
      this.revenueForm.controls['custBillingCurrencyId'].setValue('');
    }
  }
  //#endregion
  // #region reset General
  resetGeneral() {
    this.selectedLineItems = [];
    this.selectedKeys = [];
    if (this.gereralEdit) {
      this.getJORBbyId();
      this.jobOrderRevenueBookingService.setJOId(0);
      return;
    } else {
      this.revenueForm.reset();
      this.JORevenueBookingDetail = []
      this.fromJO = false;
      this.Edit = false;
      this.jobOrderId = null;
      this.jobOrderRevenueBookingService.setJOId(0);
      this.ngOnInit();
    }
  }

  returnToList() {
    if (this.fromJO) {
      this.router.navigate(["qms/transaction/job-order-list"]);
      this.jobOrderRevenueBookingService.setJOId(0);
      return;
    }

    this.fromJO = false;
    this.jobOrderRevenueBookingService.setJOId(0);
    this.router.navigate(["qms/transaction/job-order-revenue-booking-list"]);
  }


  // #region Details dialog window
  openDialog() {
    debugger
    if (!this.jobOrderId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Job Order",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    let revenueBookingDate = this.revenueForm.controls['revenueBookingDate'].value
    const dialogRef = this.dialog.open(JorbDetailDialogComponent, {
      data: {
        currencyId: this.custBillingCurrencyId,
        customerId: this.customerId,
        CIFValue: this.CIFValue,
        jobOrderId: this.jobOrderId,
        revenueBookingDate: revenueBookingDate,
        destCountryId: this.destCountryId,
        JORevenueBookingDetail: this.JORevenueBookingDetail
      },
      height: '700px',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result != null) {
        //this.JORevenueBookingDetail.push(result);
        result.selected = false;
        this.JORevenueBookingDetail = [...this.JORevenueBookingDetail, result];
        this.calculateAggregates();
      }
    });
  }

  // #region View 
  onviewDetails(data: any, event: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(JorbDetailDialogComponent, {
      data: {
        jorbdata: data, mode: 'View',
        currencyId: this.custBillingCurrencyId,
        customerId: this.customerId,
        CIFValue: this.CIFValue,
        jobOrderId: this.jobOrderId,
        destCountryId: this.destCountryId
      }, height: '700px', disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

      }
    });

  }
  // #region Edit
  onEditDetails(data: any, event: any) {
    event.stopPropagation();
    console.log('this.JORevenueBookingDetail',this.JORevenueBookingDetail);

    let revenueBookingDate = this.revenueForm.controls['revenueBookingDate'].value
    const dialogRef = this.dialog.open(JorbDetailDialogComponent, {
      data: {
        jorbdata: data, mode: 'Edit',
        currencyId: this.custBillingCurrencyId,
        customerId: this.customerId,
        CIFValue: this.CIFValue,
        jobOrderId: this.jobOrderId,
        revenueBookingDate: revenueBookingDate,
        destCountryId: this.destCountryId,
        JORevenueBookingDetail: this.JORevenueBookingDetail

      }, height: '700px', disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      console.log('this.JORevenueBookingDetail',this.JORevenueBookingDetail);
      
      if (result != null) {
        const rowIndex = this.JORevenueBookingDetail.findIndex(item => item.revenueLineitemId === data.revenueLineitemId);
        if (rowIndex !== -1) {
          this.JORevenueBookingDetail.splice(rowIndex, 1);
          this.JORevenueBookingDetail.splice(rowIndex, 0, result);
          this.JORevenueBookingDetail = [...this.JORevenueBookingDetail];
        }
       // const rowIndex = this.JORevenueBookingDetail.indexOf(data);
        if (this.selectedLineItems) {
          let changedvalue = this.selectedLineItems.find(x => x.lineItemName == result.lineItemName)

          if (changedvalue) {
            let index = this.selectedLineItems.indexOf(data);
            this.selectedLineItems.splice(index, 1);
            result.selected = true;
            this.selectedLineItems.splice(index, 0, result)
          }
        }
        this.calculateAggregates();
      }
      //this.calculateAggregates();
    });
  }

  // #region delete
  onDeleteDetails(data: any, event: any) {
    event.stopPropagation();

    const rowIndex = this.JORevenueBookingDetail.indexOf(data);
    this.JORevenueBookingDetail.splice(rowIndex, 1);
    this.JORevenueBookingDetail = [...this.JORevenueBookingDetail];
    if (this.selectedLineItems) {
      const rowIndex1 = this.selectedLineItems.indexOf(data);
      this.selectedLineItems.splice(rowIndex1, 1);
    }
    this.calculateAggregates();
  }

  // #region line Item
  lineItem(data: any, event: any) {
    event.stopPropagation();

    let lineItemId = data.revenueLineitemId
    let lineItemName = data.lineItemName
    const dialogRef = this.dialogline.open(JorbLineitemDialogComponent, {
      data: {
        lineItemId: lineItemId, lineItemName: lineItemName, jobOrderId: this.jobOrderId
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

      }
    });
  }

  // public onSelectionChange(event: any): void {
  //   debugger
  //   if (!this.selectedLineItems) {
  //     this.selectedLineItems = [];
  //   }

  //   if (event.selectedRows.length > 0) {
  //     event.selectedRows?.forEach((row: any) => {
  //       const selectedLineItem = row.dataItem;
  //       if (this.selectedLineItems.indexOf(selectedLineItem) === -1) {
  //         selectedLineItem.selected = true;
  //         this.selectedLineItems.push(selectedLineItem);
  //       }
  //     });
  //     console.log('Selected Line Items:', this.selectedLineItems);
  //   }

  //   if (event.deselectedRows.length > 0) {
  //     event.deselectedRows?.forEach((row: any) => {
  //       const deselectedLineItem = row.dataItem;
  //       const index = this.selectedLineItems.indexOf(deselectedLineItem);
  //       if (index !== -1) {
  //         this.selectedLineItems.splice(index, 1);
  //       }
  //     });
  //     console.log('Selected Line Items:', this.selectedLineItems);
  //   }

  //   const selectedItem = event.selectedRows.map((row: any) => row.dataItem.lineItemName);

  //   // Check if the item is already selected
  //   selectedItem.forEach((item: any) => {
  //     if (!this.selectedLineItems.includes(item)) {
  //       this.selectedKeys.push(item);
  //     } else {
  //       this.selectedKeys = this.selectedKeys.filter(key => key !== item);
  //     }
  //   });
  // }


  //#region onSelectionChange
  public onSelectionChange(event: any): void {
    if (!this.selectedLineItems) {
      this.selectedLineItems = [];
    }

    if (event.selectedRows.length > 0) {
      event.selectedRows.forEach((row: any) => {
        const selectedLineItem = row.dataItem;
        if (selectedLineItem.joRevenueBookingDetailId === 0 || selectedLineItem.joRevenueBookingDetailId === null) {
          if (this.selectedLineItems.indexOf(selectedLineItem) === -1) {
            selectedLineItem.selected = true;
            this.selectedLineItems.push(selectedLineItem);
          }
        }
      });
    }

    if (event.deselectedRows.length > 0) {
      event.deselectedRows.forEach((row: any) => {
        const deselectedLineItem = row.dataItem;

        if (deselectedLineItem.joRevenueBookingDetailId !== 0 && deselectedLineItem.joRevenueBookingDetailId !== null) {
          Swal.fire({
            icon: "info",
            title: "Info!",
            text: "Can't deselect an already revenue booked Line Item.",
            showConfirmButton: false,
            timer: 2000,
          });
          event.selectedRows.push(row);
        } else {
          const index = this.selectedLineItems.indexOf(deselectedLineItem);
          if (index !== -1) {
            this.selectedLineItems.splice(index, 1);
            deselectedLineItem.selected = false;
            if (this.joSelect) {
              this.patchLineItemOnFirst();
            }
          }
        }
      });
    }
    this.selectedKeys = this.selectedLineItems.map(item => item.lineItemName);
  }
  //#region onSelectionChangeEdit
  public onSelectionChangeEdit(event: any): void {
    if (!this.selectedLineItems) {
      this.selectedLineItems = [];
    }

    if (event.selectedRows.length > 0) {
      event.selectedRows?.forEach((row: any) => {
        const selectedLineItem = row.dataItem;
        if (this.selectedLineItems.indexOf(selectedLineItem) === -1) {
          if (selectedLineItem.selected == true) {
            this.selectedLineItems.push(selectedLineItem);
          }

        }
      });
    }
    console.log(' this.selectedLineItems', this.selectedLineItems);
  }
// #region Partially Booked
  onPartiallyBookedChange(dataItem: any) {
    debugger
    let partiallyBookedvalue = null
    if (dataItem.joRevenueBookingDetailId != 0) {
      partiallyBookedvalue = this.JORevenueBookingDetailPartiallyBooked.find(x => x.joRevenueBookingDetailId == dataItem.joRevenueBookingDetailId)
    }
    if (partiallyBookedvalue == null || partiallyBookedvalue == undefined) {
      this.alreadyBooked = false;
    } else {
      this.alreadyBooked = true;
    }

    if (dataItem.joRevenueBookingDetailId != 0 && dataItem.partiallyBooked == true && this.alreadyBooked == false) {
      dataItem.partiallyBooked = null;
      setTimeout(() => {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "Can't select an already revenue booked Line Item.",
          showConfirmButton: true,
        });
        dataItem.partiallyBooked = false;
        this.JORevenueBookingDetail = [...dataItem];
        this.cdr.detectChanges();
      }, 0);
    } else if (dataItem.joRevenueBookingDetailId != 0 && dataItem.partiallyBooked == false && this.alreadyBooked == true) {
      dataItem.partiallyBooked = false;
      // this.JORevenueBookingDetail = [...dataItem];

      const index = this.JORevenueBookingDetail.findIndex(item => item.joRevenueBookingDetailId === dataItem.joRevenueBookingDetailId);
      if (index !== -1) {
          this.JORevenueBookingDetail[index] = { ...dataItem };
      }

      this.cdr.detectChanges();
    } else if (dataItem.joRevenueBookingDetailId == 0 && dataItem.partiallyBooked == false && this.alreadyBooked == false) {
      dataItem.partiallyBooked = false;
      //this.JORevenueBookingDetail = [...dataItem];

      const index = this.JORevenueBookingDetail.findIndex(item => item.joRevenueBookingDetailId === dataItem.joRevenueBookingDetailId);
      if (index !== -1) {
          this.JORevenueBookingDetail[index] = { ...dataItem };
      }
      
      this.cdr.detectChanges();
    } else {
      dataItem.partiallyBooked = true;
      //this.JORevenueBookingDetail = [...dataItem];

      const index = this.JORevenueBookingDetail.findIndex(item => item.joRevenueBookingDetailId === dataItem.joRevenueBookingDetailId);
      if (index !== -1) {
          this.JORevenueBookingDetail[index] = { ...dataItem };
      }
      
      this.cdr.detectChanges();
    }
    console.log(this.JORevenueBookingDetail);
    

  }

  getUnknownId(value: any) {
    let option = this.UnknownValueList.find(option => option?.name == value)
    return option?.id;
  }

}
