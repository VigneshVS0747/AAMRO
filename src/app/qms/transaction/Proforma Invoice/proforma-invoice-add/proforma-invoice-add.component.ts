import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { map, Observable, startWith } from 'rxjs';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { DateValidatorService } from 'src/app/qms/date-validator';
import { CommonService } from 'src/app/services/common.service';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { ProformaInvoiceFilterComponent } from '../proforma-invoice-filter/proforma-invoice-filter.component';
import { ProformaInvoiceEditComponent } from '../proforma-invoice-edit/proforma-invoice-edit.component';
import Swal from 'sweetalert2';
import { ProformaInvDetail, ProformaInvoiceGeneral } from '../proforma-modals';
import { ProformaInvoiceService } from 'src/app/services/qms/proforma-invoice.service';
import { JobOrderRevenueBookingService } from '../../Job-Order-Revenue/Job-order-revenue.service';
import { aggregateBy, AggregateResult } from '@progress/kendo-data-query';
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
  selector: 'app-proforma-invoice-add',
  templateUrl: './proforma-invoice-add.component.html',
  styleUrls: ['./proforma-invoice-add.component.css', '../../../qms.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ProformaInvoiceAddComponent implements OnInit {
  //Autocomplete observables
  filteredCustomer: Observable<any[]>;
  filteredBillingCurrencyControl: Observable<any[]>;
  filteredCustomerAddress: Observable<any[]>;
  filteredContactPersonControl: Observable<any[]>;
  filteredStatus: Observable<any[]>;
  filteredApprovalStatus: Observable<any[]>;
  filteredoriginCountryControl: Observable<any[]>;
  filtereddestinationCountryControl: Observable<any[]>;
  filteredcancelReasonControl: Observable<any[]>;

  hasViewRoute: any;
  disableStatus: boolean = true;
  liveStatus = 1;

  //Array variables
  CustomerList: any[] = [];
  CustomerAddressList: any[] = [];
  ContactPersonList: any[] = [];
  CustomerBillingCurrencyList: any[] = [];
  statusList: any[] = [];
  approvalStatusList: any[] = [];
  OriginCountryList: any[] = [];
  DestinationCountryList: any[] = [];
  CommodityList: any[] = [];
  CancelReasonList: any[] = [];

  //Modal Varaibles
  PIGeneralList: ProformaInvoiceGeneral = new ProformaInvoiceGeneral();
  PIDetailList: ProformaInvDetail = new ProformaInvDetail();

  //Line Item Grid
  PILineItemList: any[] = [];
  pageSize = 10;
  skip = 0;
  ProformaInvoiceId: number;
  pagePrivilege: Array<string>;
  userId$: any;
  revenueBookingList: any;
  isDraft: boolean;

  //Kendo grid
  public aggregates: any[] = [
    { field: "totalinCompanyCurrency", aggregate: "sum" }
  ];

  public aggregates1: any[] = [
    { field: "totalinCustomerCurrency", aggregate: "sum" }
  ];

  public aggregates2: any[] = [
    { field: "invoicedAmount", aggregate: "sum" }
  ];

  public total: any;
  totalInCompanyCurrency: number;
  totalInCustomerCurrency: number;
  invoicedAmountCus: number;
  selectedCustomerId: any;
  show: boolean;
  total2: any;
  total3: any;
  selectedIndex = 0;

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>, 
    private regionService: RegionService, private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    private docmentsService: DocmentsService,
    private vendorSvc: VendorService, public dateValidator: DateValidatorService,
    private customerService: CustomerService, private commonService: CommonService,
    private jobtypeService: JobtypeserviceService, private commodityService: CommodityService,
    private incoTermService: IncoTermService, private reasonmstSvc: ReasonService,
    private PIService: ProformaInvoiceService, private jobOrderRevenueBookingService: JobOrderRevenueBookingService,
    private errorHandler: ApiErrorHandlerService,) {
  }

  ngOnInit(): void {
    this.GetUserId();
    this.CustomerGetAll();
    this.getbillingCurrencyList();
    this.GetPIStatusList();
    this.getAllApprovalStatus();
    this.getCountryMaster();
    this.getCommodityList();
    this.getReasons();
    this.matFilters();

    this.route.paramMap.subscribe((params:any) => {
      const currentUrl = this.router.url;
      this.hasViewRoute = currentUrl.includes('/view');
      if (this.hasViewRoute) {
        this.disableForms();
      }
      this.ProformaInvoiceId = params.get('id');
      if (this.ProformaInvoiceId != 0 && this.ProformaInvoiceId != null) {
        this.getPerFormaInvoice();
      } else {
        const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.PIGeneralForm.patchValue({
          InvoiceDateControl: formattedDate
        });
        this.PIGeneralForm.patchValue({
          status: 'Draft',
          approvalStatus: 'NA'
        });
        this.isDraft = true;
      }
    });
    this.store.select("privileges").subscribe({
      next: (res) => {
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    this.matFilters();
    this.checkJobOrderIds();
  }

  PIGeneralForm = new FormGroup({
    proformaInvoiceControl: new FormControl({ value: '', disabled: true }),
    InvoiceDateControl: new FormControl('', [Validators.required]),
    DueDateControl: new FormControl('', [Validators.required]),
    SAPInvoiceControl: new FormControl({ value: '', disabled: true }, Validators.maxLength(25)),
    customerNameControl: new FormControl('', [Validators.required, this.CustomerNameValidator.bind(this)]),
    billingCurrencyControl: new FormControl('', [Validators.required, this.BillingCurrencyValidator.bind(this)]),
    exchangeRateControl: new FormControl({ disabled: true, value: '' }),
    customerAddressControl: new FormControl('', [Validators.required, this.CustomerAddressValidator.bind(this)]),
    contactPersonControl: new FormControl('', [Validators.required, this.ContactPersonValidator.bind(this)]),
    status: new FormControl('', [Validators.required, this.StatusValidator.bind(this)]),
    approvalStatus: new FormControl({ value: '', disabled: true }),
    remarksControl: new FormControl('', [Validators.maxLength(500)]),
    cancelReasonControl: new FormControl({ disabled: true, value: '' }, [this.CancelReasonValidator.bind(this)]),
    cancelRemarkControl: new FormControl({ disabled: true, value: '' }, [Validators.maxLength(50)])
  })
  get f1() {
    return this.PIGeneralForm.controls;
  }

  JobNumberForm = new FormGroup({
    originCountryControl: new FormControl({ value: '', disabled: true }),
    destinationCountryControl: new FormControl({ value: '', disabled: true }),
    commodityControl: new FormControl({ value: '', disabled: true }, []),
    VesselFlightNumberControl: new FormControl({ value: '', disabled: true }),
    HAWBNoHBLNoControl: new FormControl({ value: '', disabled: true }),
    MAWBNoMBLNoControl: new FormControl({ value: '', disabled: true }),
    NoofPackagesControl: new FormControl({ value: '', disabled: true }),
    GrossWeightControl: new FormControl({ value: '', disabled: true }),
    CIFValueControl: new FormControl({ value: '', disabled: true }),
    CIFCurrencyControl: new FormControl({ value: '', disabled: true }),
    CBMincmControl: new FormControl({ value: '', disabled: true }),
  })
  get f2() {
    return this.JobNumberForm.controls;
  }


  get dateFilter() {
    return this.dateValidator.dateFilter;
  }
  get futuredateFilter() {
    return this.dateValidator.futuredateFilter;
  }

  disableForms() {
    this.PIGeneralForm.disable();
    this.JobNumberForm.disable();
  }

  statusDisableOption(option: any) {
    if (!this.ProformaInvoiceId) {
      return option?.piStatus !== 'Draft';
    } else if (this.PIGeneralList?.piStatus === 'Draft') {
      return option?.piStatus !== 'Draft';
    } else {
      return option?.piStatus !== 'Cancel' && option?.piStatus !== this.PIGeneralList?.piStatus;
    }

  }


  private calculateAggregates(): void {
    debugger;
    const value = aggregateBy(this.PILineItemList, this.aggregates);
    this.total = value['totalinCompanyCurrency']?.sum?.toFixed(4);
  }

  private calculateAggregates1(): void {
    const value = aggregateBy(this.PILineItemList, this.aggregates1);
    this.total2 = value['totalinCustomerCurrency']?.sum?.toFixed(4);
    //this.total2.toFixed(2);
  }

  private calculateAggregates2(): void {
    const value = aggregateBy(this.PILineItemList, this.aggregates2);
    this.total3 = value['invoiceAmount']?.sum?.toFixed(4);
    //this.total2.toFixed(2);
  }


  getPerFormaInvoice() {
    this.PIService.GetPIById(this.ProformaInvoiceId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.PIGeneralList = res?.proformaInvoiceGeneral;
        this.PILineItemList = res?.proformaInvoiceDetail;
        this.PILineItemList = this.PILineItemList.map(item => {
          return {
            ...item,
            jobOrderDate: new Date(item.jobOrderDate),
          };
        });

        setTimeout(()=>{
          if (this.PIGeneralList?.customerName) {
            this.OnCustomerChangeEvent(this.PIGeneralList?.customerName)
          }
        },500)

        this.checkJobOrderIds();
        if (this.PIGeneralList != null) {
          this.PIGeneralForm.patchValue({
            proformaInvoiceControl: this.PIGeneralList.proInvoiceNumber,
            InvoiceDateControl: this.PIGeneralList.proInvoiceDate === '1900-01-01T00:00:00' ? null : this.PIGeneralList.proInvoiceDate,
            DueDateControl: this.PIGeneralList.dueDate === '1900-01-01T00:00:00' ? null : this.PIGeneralList.dueDate,
            SAPInvoiceControl: this.PIGeneralList.sapInvoiceNo,
            customerNameControl: this.PIGeneralList.customerName,
            billingCurrencyControl: this.PIGeneralList.currencyName,
            exchangeRateControl: this.PIGeneralList.exchangeRate,
            customerAddressControl: this.PIGeneralList.addressName,
            contactPersonControl: this.PIGeneralList.contactPerson,
            status: this.PIGeneralList.piStatus,
            approvalStatus: this.PIGeneralList.approvalStatus ? this.PIGeneralList.approvalStatus : 'NA',
            cancelReasonControl: this.PIGeneralList.reasonName,
            cancelRemarkControl: this.PIGeneralList.closeRemark,
            remarksControl: this.PIGeneralList.remarks,

          })

          if (this.PIGeneralList.piStatus === "Draft") {
            this.isDraft = true;
          } else {
            this.isDraft = false;
          }

          if (this.PIGeneralList.piStatus === 'Cancel') {
            this.showCancelFields = (this.PIGeneralList.piStatus === 'Cancel');
            this.PIGeneralForm.controls.cancelReasonControl.enable();
            this.PIGeneralForm.controls.cancelRemarkControl.enable();
          }

          if (this.hasViewRoute) {
            this.PIGeneralForm.controls.cancelReasonControl.disable();
            this.PIGeneralForm.controls.cancelRemarkControl.disable();
          }


          // if (this.PIGeneralList.piStatus !== 'Pending for Approval' &&
          //   this.PIGeneralList.piStatus !== 'Pending for SAP Integration' &&
          //   this.PIGeneralList.piStatus !== 'Integrated with SAP') {
          //     this.PIGeneralForm.enable()
          //     this.PIGeneralForm.controls.approvalStatus.disable();
          // } else {
          //   this.PIGeneralForm.disable()
          // }
          this.checkLineItem();
          setTimeout(() => {
            this.checkLineItem();
            this.calculateAggregates();
            this.calculateAggregates1();
            this.calculateAggregates2();
            this.matFilters();
          }, 800)

        }
      }
    })
  }

  //Mat filters
  matFilters() {
    this.filteredCustomer = this.PIGeneralForm.controls.customerNameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || '')),
    );
    this.filteredBillingCurrencyControl = this.PIGeneralForm.controls.billingCurrencyControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomerBillingCurrency(value || '')),
    );
    this.filteredCustomerAddress = this.PIGeneralForm.controls.customerNameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomerAddress(value || '')),
    );
    this.filteredContactPersonControl = this.PIGeneralForm.controls.contactPersonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterContactPerson(value || '')),
    );
    this.filteredStatus = this.PIGeneralForm.controls.status.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStatus(value || '')),
    );
    this.filteredApprovalStatus = this.PIGeneralForm.controls.approvalStatus.valueChanges.pipe(
      startWith(''),
      map(value => this._filterApprovalStatus(value || '')),
    );
    this.filteredcancelReasonControl = this.PIGeneralForm.controls.cancelReasonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcancelReasonControl(value || '')),
    );


    //Second Form
    this.filteredoriginCountryControl = this.JobNumberForm.controls.originCountryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredoriginCountryControl(value || '')),
    );
    this.filtereddestinationCountryControl = this.JobNumberForm.controls.destinationCountryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtereddestinationCountryControl(value || '')),
    );
  }

  private _filterCustomer(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter((option: any) => option?.customerName.toLowerCase().includes(filterValue));
  }
  private _filterCustomerBillingCurrency(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerBillingCurrencyList.filter((option: any) => option?.currencyName.toLowerCase().includes(filterValue));
  }
  private _filterCustomerAddress(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerAddressList.filter((option: any) => option?.addressName.toLowerCase().includes(filterValue));
  }
  private _filterContactPerson(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ContactPersonList.filter((option: any) => option?.contactPerson.toLowerCase().includes(filterValue));
  }
  private _filterStatus(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.statusList.filter(option => option?.piStatus.toLowerCase().includes(filterValue));
  }
  private _filterApprovalStatus(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.approvalStatusList.filter(option => option?.approvalStatus.toLowerCase().includes(filterValue));
  }
  private _filteredcancelReasonControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CancelReasonList.filter((option: any) => option?.reasonName.toLowerCase().includes(filterValue));
  }

  //Second Form
  private _filteredoriginCountryControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.OriginCountryList.filter((option: any) => option?.countryName.toLowerCase().includes(filterValue));
  }
  private _filtereddestinationCountryControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.DestinationCountryList.filter((option: any) => option?.countryName.toLowerCase().includes(filterValue));
  }

  CustomerNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CustomerList?.some((option: any) => option?.customerName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  BillingCurrencyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CustomerBillingCurrencyList?.some((option: any) => option?.currencyName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CustomerAddressValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CustomerAddressList?.some((option: any) => option?.addressName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  ContactPersonValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.ContactPersonList?.some((option: any) => option?.contactPerson === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  StatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.statusList?.some((option: any) => option?.piStatus === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  CancelReasonValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CancelReasonList?.some((option: any) => option?.reasonName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  //Second Form
  OriginCountryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.OriginCountryList?.some((option: any) => option?.countryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  DestinationCountryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.DestinationCountryList?.some((option: any) => option?.countryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }



  //API's 
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  CustomerGetAll() {
    this.customerService.getAllActiveCustomer().subscribe((res: any) => {
      this.CustomerList = res;
      this.matFilters();
    })
  }
  getbillingCurrencyList() {
    this.regionService.GetAllCurrency(this.liveStatus).subscribe((result: any) => {
      this.CustomerBillingCurrencyList = result;
      this.matFilters();
    });
  }
  GetPIStatusList() {
    this.PIService.GetPIStatusList().subscribe((res: any) => {
      this.statusList = res;
      this.matFilters();
    });
  }
  getAllApprovalStatus() {
    this.regionService.GetAllContractCustomerApprovalStatus().subscribe((res: any) => {
      this.approvalStatusList = res?.result;
      this.matFilters();
    });
  }

  getCountryMaster() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.OriginCountryList = result;
      this.DestinationCountryList = result;
      this.matFilters();
    });
  }

  getCommodityList() {
    this.commodityService.getAllActiveCommodity().subscribe(result => {
      this.CommodityList = result;
    });
  }

  getReasons() {
    this.reasonmstSvc.getAllReason(1).subscribe((result) => {
      this.CancelReasonList = result;
      this.matFilters();
    });
  }

  getAllRevenueBookingList() {
    this.jobOrderRevenueBookingService.GetAllJORevenueBooking().subscribe((res: any) => {
      this.revenueBookingList = res;
    })
  }

  //Change events
  OnchangeEvent(event: any) {
    let value = event?.option?.value;
    this.matFilters();
  }


  public showCancelFields = false;
  OnStatusChangeEvent(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;

    this.showCancelFields = (value === 'Cancel');

    this.PIGeneralForm.controls.cancelReasonControl.disable();
    this.PIGeneralForm.controls.cancelRemarkControl.disable();
    this.PIGeneralForm.controls.cancelReasonControl.reset();
    this.PIGeneralForm.controls.cancelRemarkControl.reset();
    this.PIGeneralForm.controls.cancelReasonControl.clearValidators();
    if (value === 'Cancel') {
      this.PIGeneralForm.controls.cancelReasonControl.enable();
      this.PIGeneralForm.controls.cancelRemarkControl.enable();
      this.PIGeneralForm.controls.cancelReasonControl.setValidators([Validators.required, this.CancelReasonValidator.bind(this)]);
      this.PIGeneralForm.controls.cancelRemarkControl.setValidators([Validators.required, Validators.maxLength(500)]);
    }
    this.PIGeneralForm.controls.cancelReasonControl.updateValueAndValidity();
    this.PIGeneralForm.controls.cancelRemarkControl.updateValueAndValidity();
    this.PIGeneralForm.controls.cancelRemarkControl.updateValueAndValidity();

    this.matFilters();
  }
  OnBillingchangeEvent(event: any) {
    let value = event?.option?.value;
    this.getExchange();
    this.matFilters();
  }

  OnCustomerChangeEvent(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;
    let id = this.CustomerList.find(option => option.customerName === value);
    this.selectedCustomerId=id?.customerId;
    if (id) {
      this.customerService.CustomerIdByAddress(id?.customerId).subscribe({
        next: (res: any) => {
          if (res) {
            this.CustomerAddressList = res;
            let primaryAddress = this.CustomerAddressList.find(option => option?.primaryAddress === true)
            this.PIGeneralForm.get('customerAddressControl')?.patchValue(primaryAddress?.addressName);
            this.matFilters();
          }
        }
      })

      this.customerService.CustomerIdByContact(id?.customerId).subscribe({
        next: (res: any) => {
          if (res) {
            this.ContactPersonList = res;
            let primaryContact = this.ContactPersonList.find(option => option?.primaryContact === true)
            this.PIGeneralForm.get('contactPersonControl')?.patchValue(primaryContact?.contactPerson);
            this.matFilters();
          }
        }
      })


      this.customerService.getAllCustomerById(id?.customerId).subscribe((res: any) => {
        console.log(res);
        this.PIGeneralForm.get('billingCurrencyControl')?.patchValue(res?.customer?.currencyName);
        this.PIGeneralForm.get('exchangeRateControl')?.reset();
        this.getExchange();
        if (res?.customer?.billingCurrency === "All Currency") {
          this.PIGeneralForm.get('billingCurrencyControl')?.enable();
        } else if (res?.customer?.billingCurrency === "Party Currency") {
          this.PIGeneralForm.get('billingCurrencyControl')?.disable();
        }
        if(this.hasViewRoute){
          this.PIGeneralForm.get('billingCurrencyControl')?.disable();
        }
      })
    }
    this.matFilters();
  }


  checkLineItem() {
    if (this.PILineItemList?.length >0) {
      let Id = this.PILineItemList[0]?.jobOrderId;
      this.regionService.GetJobOrderById(Id).subscribe((res: any) => {
        console.log("res",res),
        this.JobNumberForm.patchValue({
          originCountryControl: res?.joGeneral?.originCountry,
          destinationCountryControl: res?.joGeneral?.destinationCountry,
          VesselFlightNumberControl: res?.joGeneral?.flightNumber,
          HAWBNoHBLNoControl: res?.joGeneral?.mawbNumber,
          MAWBNoMBLNoControl: res?.joGeneral?.mawbNumber,
          NoofPackagesControl: res?.joGeneral?.packageNos,

          CIFValueControl: res?.joGeneral?.overallCIFValue,
          CIFCurrencyControl: res?.joGeneral?.cifCurrencyName,
        })

        if (res?.joCommodity) {
          const selectedModes = res?.joCommodity?.map((mode: any) => mode.commodityId);
          this.JobNumberForm.patchValue({
            commodityControl: selectedModes
          });;
        }


        if (res?.joPackage?.length > 0) {
          let totalPackWeightKg = 0;
          let cbm = res?.joPackage?.[0]?.cbm;

          res?.joPackage?.forEach((item: any) => {
            if (item.packWeightKg) {
              totalPackWeightKg += item.packWeightKg;
            }
          });

          this.JobNumberForm.patchValue({
            GrossWeightControl: totalPackWeightKg.toString(),
            CBMincmControl: cbm
          });
        }
      })
    } else {
      this.JobNumberForm.reset();
    }
  }

  currencyId: any;
  exchangeValue: any;
  exchangerate: any;
  getExchange() {
    //if(this.currencyId){
    this.currencyId = this.getCustomerBillId(this.PIGeneralForm.controls.billingCurrencyControl.value) || 0
    //}
    this.commonService.GetExchangeById(this.currencyId).subscribe(res => {
      this.exchangeValue = res;
      this.exchangerate = this.exchangeValue.exchangerate;
      this.PIGeneralForm.get('exchangeRateControl')?.patchValue(this.exchangeValue.exchangerate);
    })
  }


  //Line Item Tab

  filterDailog: any;
  editDailog: any;
  filter() {

    if(this.selectedCustomerId){
      if (this.PIGeneralList.piStatus !== 'Pending for Approval' &&
        this.PIGeneralList.piStatus !== 'Pending for SAP Integration' &&
        this.PIGeneralList.piStatus !== 'Integrated with SAP') {
        let exchangeRate = this.PIGeneralForm.controls.exchangeRateControl.value;
        this.filterDailog = this.dialog.open(ProformaInvoiceFilterComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            ProformaInvoiceId: this.ProformaInvoiceId ? this.ProformaInvoiceId : 0,
            exchangeRate: exchangeRate,
            customerId:this.selectedCustomerId,
            createdBy: parseInt(this.userId$),
          }
        })
        this.filterDailog.afterClosed().subscribe((result: any) => {
          if (result) {
            const flattenedResult = this.flattenArray(result);
            this.PILineItemList = [...this.PILineItemList, ...flattenedResult];
            this.PILineItemList = this.PILineItemList.map(item => {
              return {
                ...item,
                jobOrderDate: new Date(item.jobOrderDate),
              };
            });
            console.log("this.PILineItemList",this.PILineItemList);
            this.checkLineItem();
            this.calculateAggregates();
    this.calculateAggregates1();
    this.calculateAggregates2();
            this.checkJobOrderIds();
          }
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: `Can't filter the proforma invoice line item when the status is "${this.PIGeneralList.piStatus}".`,
          showConfirmButton: true,
        });
      }
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select customer and then filter",
        showConfirmButton: false,
        timer: 2000,
      });
    }


  }

   flattenArray(data: any[]): any[] {
    return data.reduce((acc, item) => {
        if (Array.isArray(item)) {
            // Recursively flatten the nested array
            acc.push(...this.flattenArray(item));
        } else {
            acc.push(item);
        }
        return acc;
    }, []);
}


  Edit(dataItem: any, index: any) {
    if (this.PIGeneralList.piStatus !== 'Pending for Approval' &&
      this.PIGeneralList.piStatus !== 'Pending for SAP Integration' &&
      this.PIGeneralList.piStatus !== 'Integrated with SAP') {
      let selectedLineItem: any[] = this.PILineItemList[index];
      this.editDailog = this.dialog.open(ProformaInvoiceEditComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          proformaInvDetailId: dataItem?.proformaInvDetailId,
          list: selectedLineItem,
          customerId:this.selectedCustomerId,
          createdBy: parseInt(this.userId$),
          rowNumber: this.generateRandomId(5),
          view: false
        }
      })
      this.editDailog.afterClosed().subscribe((result: any) => {
        if(result){
          const index = this.PILineItemList.findIndex(item => item.rowNumber === result.rowNumber);
          if (index !== -1) {
            this.PILineItemList[index] = result;
            this.PILineItemList = this.PILineItemList.map(item => {
              return {
                ...item,
                jobOrderDate: new Date(item.jobOrderDate),
              };
            });
            this.calculateAggregates();
            this.calculateAggregates1();
            this.calculateAggregates2();
            this.checkJobOrderIds();
          } else {
            this.PILineItemList.push(result);
            this.PILineItemList = this.PILineItemList.map(item => {
              return {
                ...item,
                jobOrderDate: new Date(item.jobOrderDate),
              };
            });
          }
        }

      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't edit the proforma invoice line item when the status is "${this.PIGeneralList.piStatus}".`,
        showConfirmButton: true,
      });
    }

  }

  View(dataItem: any, index: any) {
    let selectedLineItem: any[] = this.PILineItemList[index];
    this.editDailog = this.dialog.open(ProformaInvoiceEditComponent, {
      disableClose: true,
      autoFocus: false,
      data:{
        proformaInvDetailId: dataItem?.proformaInvDetailId,
        list: selectedLineItem,
        createdBy: parseInt(this.userId$),
        rowNumber: this.generateRandomId(5),
        view: true
      }
    })
  }
  Delete(dataItem: any, index: any) {
    if (this.PIGeneralList.piStatus !== 'Pending for Approval' &&
      this.PIGeneralList.piStatus !== 'Pending for SAP Integration' &&
      this.PIGeneralList.piStatus !== 'Integrated with SAP') {
      this.PILineItemList = this.PILineItemList.filter((_, i) => i !== index);
      this.cdr.detectChanges();
      this.checkLineItem();
      this.checkJobOrderIds();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't delete the proforma invoice line item when the status is "${this.PIGeneralList.piStatus}".`,
        showConfirmButton: true,
      });
    }

  }

  //Overall Action

  generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  triggerValidation() {
    Object.keys(this.PIGeneralForm.controls).forEach(field => {
      const control = this.PIGeneralForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  validateAllForms() {
    if (this.PIGeneralForm.invalid) {
      this.PIGeneralForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Please fill the mandatory fields in general tab`,
        showConfirmButton: true,
      });
      this.changeTab(0);
      return false;
    }


    const status = this.PIGeneralForm.controls.status.value;
    if(status != 'Cancel'){
      if (this.PILineItemList?.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Warning!',
          text: 'The line item is empty. Please add some items.',
          showConfirmButton: true,
        });
        this.changeTab(1);
        return false;
      }
    }
    return true;
  }

  statusId: any;
  saveAll(event: any) {
    if (event === 'Save') {
      this.triggerValidation();
      if (!this.validateAllForms()) {
        return;
      } else {
        this.save(event);
      }
    } else {
      this.save(event);
    }
  }

  save(event: any){
    const statusID = this.getStatusId(this.PIGeneralForm.controls.status.value);

    if (event === 'Save') {
      if (statusID == 1) {
        this.statusId = 2;
      }
      else if (statusID == 6) {
        this.statusId = 6;
      } else if (statusID == 5) {
        this.statusId = 5;
      } else if (statusID == 3) {
        this.statusId = 3;
      } else if (statusID == 2) {
        this.statusId = 2;
      } else if (statusID == 4) {
        this.statusId = 4;
      }
    }
    else if (event === 'Draft') {
      if (statusID == 1) {
        this.statusId = 1;
      }
      this.statusId = 1;
    }

    if(this.CustomerAddressList?.length === 0 || this.ContactPersonList?.length === 0){

      this.OnCustomerChangeEventOnSave(this.PIGeneralForm.controls.customerNameControl.value)
    }

    const defaultDate = new Date('1900-01-01');

    this.PIGeneralList.proformaInvoiceId = +this.ProformaInvoiceId || 0,
      this.PIGeneralList.proInvoiceNumber = this.PIGeneralForm.controls.proformaInvoiceControl.value || '',
      this.PIGeneralList.proInvoiceDate = this.normalizeDateToUTC(this.PIGeneralForm.controls.InvoiceDateControl.value || defaultDate),
      this.PIGeneralList.dueDate = this.normalizeDateToUTC(this.PIGeneralForm.controls.DueDateControl.value || defaultDate) || null,
      this.PIGeneralList.sapInvoiceNo = this.PIGeneralForm.controls.SAPInvoiceControl.value || '',
      this.PIGeneralList.customerId = this.getCustomerId(this.PIGeneralForm.controls.customerNameControl.value) || 0,
      this.PIGeneralList.custBillingCurrencyId = this.getCustomerBillId(this.PIGeneralForm.controls.billingCurrencyControl.value) || 0,
      this.PIGeneralList.exchangeRate = this.PIGeneralForm.controls.exchangeRateControl.value || 0,
      this.PIGeneralList.addressId = this.getCustomerAddressId(this.PIGeneralForm.controls.customerAddressControl.value) || 0,
      this.PIGeneralList.contactId = this.getCustomerContactId(this.PIGeneralForm.controls.contactPersonControl.value) || 0,
      this.PIGeneralList.statusId = this.statusId || 0,
      this.PIGeneralList.approvalStatusId = this.getApprovalStatusId(this.PIGeneralForm.controls.approvalStatus.value) || 0,
      this.PIGeneralList.invoicedAmtTotinComCurr =  +this.totalInCompanyCurrency || 0,
      this.PIGeneralList.invoicedAmtTotinCusCurr = +this.totalInCustomerCurrency || 0,
      this.PIGeneralList.closeReasonId = this.getReasonId(this.PIGeneralForm.controls.cancelReasonControl.value) || 0,
      this.PIGeneralList.closeRemark = this.PIGeneralForm.controls.cancelRemarkControl.value || '',
      this.PIGeneralList.remarks = this.PIGeneralForm.controls.remarksControl.value || null,
      this.PIGeneralList.createdBy = parseInt(this.userId$),
      this.PIGeneralList.updatedBy = parseInt(this.userId$)

    let payload = {
      proformaInvoiceGeneral: this.PIGeneralList,
      proformaInvoiceDetail: this.PILineItemList
    }
    console.log(payload)

    this.PIService.AddProformaInvoice(payload).subscribe((res: any) => {
      if (res) {
        if (this.ProformaInvoiceId) {
          Swal.fire({
            icon: "success",
            title: "Updated successfully",
            text: `Proforma Invoice Number: ${res?.proformaInvoiceGeneral?.proInvoiceNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              this.router.navigate(['/qms/transaction/proforma-invoice-list']);
            }
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Added successfully",
            text: `Proforma Invoice Number: ${res?.proformaInvoiceGeneral?.proInvoiceNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              this.router.navigate(['/qms/transaction/proforma-invoice-list']);
            }
          });
        }

      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    },
    (err: HttpErrorResponse) => {
      let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
      if(stausCode === 500){
        this.errorHandler.handleError(err);
      } else if(stausCode === 400){
        this.errorHandler.FourHundredErrorHandler(err);
      } else {
        this.errorHandler.commonMsg();
      }
    })
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }
  //Get Mat Id's
  getCustomerId(value: any) {
    let option = this.CustomerList.find(option => option?.customerName == value)
    return option?.customerId;
  }
  getCustomerBillId(value: any) {
    let option = this.CustomerBillingCurrencyList.find(option => option?.currencyName == value)
    return option?.currencyId;
  }
  getCustomerAddressId(value: any) {
    let option = this.CustomerAddressList.find(option => option?.addressName == value)
    return option?.cAddressId;
  }
  getCustomerContactId(value: any) {
    let option = this.ContactPersonList.find(option => option?.contactPerson == value)
    return option?.cContactId;
  }
  getStatusId(value: any) {
    let option = this.statusList.find(option => option?.piStatus == value)
    return option?.piStatusId;
  }
  getApprovalStatusId(value: any) {
    let option = this.approvalStatusList.find(option => option?.approvalStatus == value)
    return option?.approvalStatusId;
  }
  getReasonId(value: any) {
    let option = this.CancelReasonList.find(option => option?.reasonName == value)
    return option?.reasonId;
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  draft() {

  }

  reset() {
    location.reload();
  }

  Return() {
    this.router.navigate(["/qms/transaction/proforma-invoice-list"]);
  }

  OnCustomerChangeEventOnSave(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;
    let id = this.CustomerList.find(option => option.customerName === value);
    this.selectedCustomerId=id?.customerId;
    if (id) {
      this.customerService.CustomerIdByAddress(id?.customerId).subscribe((res: any) => {
        this.CustomerAddressList = res;
        this.matFilters();
      });

      this.customerService.CustomerIdByContact(id?.customerId).subscribe((res: any) => {
        this.ContactPersonList = res;
        this.matFilters();
      })

      this.customerService.getAllCustomerById(id?.customerId).subscribe((res: any) => {
        console.log(res);
        // this.PIGeneralForm.get('billingCurrencyControl')?.patchValue(res?.customer?.currencyName);
        // this.PIGeneralForm.get('exchangeRateControl')?.reset();
        // this.getExchange();
        // if (res?.customer?.billingCurrency === "All Currency") {
        //   this.PIGeneralForm.get('billingCurrencyControl')?.enable();
        // } else if (res?.customer?.billingCurrency === "Party Currency") {
        //   this.PIGeneralForm.get('billingCurrencyControl')?.disable();
        // }
        // if(this.hasViewRoute){
        //   this.PIGeneralForm.get('billingCurrencyControl')?.disable();
        // }
      })
    }
    this.matFilters();
  }

  checkJobOrderIds() {
    debugger;
    if (this.PILineItemList && this.PILineItemList.length > 0) {
      const firstJobOrderId = this.PILineItemList[0].jobOrderId;
      const allSame = this.PILineItemList.every(item => item.jobOrderId === firstJobOrderId);
  
      if (allSame) {
        this.show = true;
      }else{
        this.show = false;
      } 
    }
  }
}
