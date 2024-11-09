import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { forkJoin, map, Observable, of, startWith } from 'rxjs';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { DateValidatorService, trimLeadingZeros } from 'src/app/qms/date-validator';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { ImagePreviewComponent } from '../../customer-contract/image-preview/image-preview.component';
import * as saveAs from 'file-saver';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { AirTransportComponent } from '../grids-dailog-Component/air-transport/air-transport.component';
import { SeaTransportComponent } from '../grids-dailog-Component/sea-transport/sea-transport.component';
import { RoadTransportComponent } from '../grids-dailog-Component/road-transport/road-transport.component';
import { JobTypeComponent } from '../grids-dailog-Component/job-type/job-type.component';
import { aggregateBy, AggregateResult } from '@progress/kendo-data-query';
import { PackageDetailsComponent } from '../grids-dailog-Component/package-details/package-details.component';
import { LineItemDetailsComponent } from '../grids-dailog-Component/line-item-details/line-item-details.component';
import { AirStatusComponent } from '../grids-dailog-Component/air-transport/air-status/air-status.component';
import { JOAirModeModal, JobOrderDetails, JOCommodityModal, JOLineItemModal, JORoadModeModal, JOSeaModeModal, JOTransportModeModal } from '../job-order.modals';
import { SeaStatusComponent } from '../grids-dailog-Component/sea-transport/sea-status/sea-status.component';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { RoadStatusComponent } from '../grids-dailog-Component/road-transport/road-status/road-status.component';
import { PackageDialogComponent } from 'src/app/crm/transaction/purchese-quotation/package-dialog/package-dialog.component';
import { AttachmentComponent } from '../grids-dailog-Component/attachment/attachment.component';
import { formatDate } from '@angular/common';
import { HscodeService } from 'src/app/crm/master/hscode/hscode.service';
import { QuotationService } from '../../Quotations/quotation.service';
import { DefaultSettings } from 'src/app/Models/crm/master/Dropdowns';
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
  selector: 'app-add-job-order',
  templateUrl: './add-job-order.component.html',
  styleUrls: ['./add-job-order.component.css', '../../../qms.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddJobOrderComponent implements OnInit {

  //Autocomplete observables
  filteredjobOrderAgainst: Observable<any[]>;
  filteredBaseReferenceNo: Observable<any[]>;
  filteredCustomer: Observable<any[]>;
  filteredCustomerAddress: Observable<any[]>;
  filteredContactPersonControl: Observable<any[]>;
  filteredcustomerBillingCurrencyControl: Observable<any[]>;
  filteredCIFCurrencyContrl: Observable<any[]>;
  filteredJobCategoryControl: Observable<any[]>;
  filteredjobTypeControl: Observable<any[]>;
  filteredsalesOwnerControl: Observable<any[]>;
  filteredsalesExecutiveControl: Observable<any[]>;
  filteredjobOwnerControl: Observable<any[]>;
  filteredjobOrderStageControl: Observable<any[]>;
  filteredjobOrderStatusControl: Observable<any[]>;
  filteredcancelReasonControl: Observable<any[]>;

  //Service Autocomplete
  filteredoriginCountryControl: Observable<any[]>;
  filtereddestinationCountryControl: Observable<any[]>;
  filteredportofLoadingControl: Observable<any[]>;
  filteredportofDestinationControl: Observable<any[]>;
  filteredoriginLocationControl: Observable<any[]>;
  filtereddestinationLocationControl: Observable<any[]>;
  filteredcargoTypeControl: Observable<any[]>;
  filteredincoTermControl: Observable<any[]>;


  //Array Variables
  JobOrderAgainstList: any[] = [];
  BaseReferenceNoList: any[] = [];
  CustomerList: any[] = [];
  CustomerAddressList: any[] = [];
  ContactPersonList: any[] = [];
  CustomerBillingCurrencyList: any[] = [];
  JobCategoryList: any[] = [];
  JobTypeList: any[] = [];
  ModeOfTransportList: any[] = [];
  SalesOwnerList: any[] = [];
  SalesExecutiveList: any[] = [];
  JobOwnerList: any[] = [];
  JobOrderStageList: any[] = [];
  JobOrderStatusList: any[] = [];
  CancelReasonList: any[] = [];
  CommodityList: any[] = [];

  //Service Tab
  OriginCountryList: any[] = [];
  DestinationCountryList: any[] = [];
  PortofLoadingList: any[] = [];
  PortofDestinationList: any[] = [];
  OriginLocationList: any[] = [];
  DestinationLocationList: any[] = [];
  CargoTypeList: any[] = [];
  IncoTermList: any[] = [];

  //Service tab grids
  //Air
  flightNumberControl = new FormControl('', [Validators.required]);
  flightNameControl = new FormControl('', [Validators.required]);
  mAWBNumberControl = new FormControl('', [Validators.required]);
  AirTransportGrid: any[] = [];
  AirTransport: JOAirModeModal = new JOAirModeModal();
  airTransportDailog: any;
  //Sea Transport
  MBLNumberControl = new FormControl('', [Validators.required]);
  SeaTransportGrid: any[] = [];
  seaTransportDailog: any;
  //Road Transport
  RoadTransportGrid: any[] = [];
  RoadTransportDailog: any;
  //warehousing
  WMSOrderNoControl = new FormControl('', [Validators.required]);
  RMANumberControl = new FormControl('');
  WMSOrderStatusControl = new FormControl('', [Validators.required]);
  //Job Type
  JobTypeGrid: any[] = [];
  JobTypeDailog: any;
  CIFCurrencyContrl = new FormControl('');
  //Package details
  PackageDetailsGrid: any[] = [];
  PackageDetailsDailog: any;
  numberOfPackegesControl = new FormControl('');
  overallCIFValueControl = new FormControl('');
  CIFCurrencyControl = new FormControl('');
  seaportSelected: boolean;
  //Line Item
  LineItemDetailsGrid: any[] = [];
  LineItemDetailsDailog: any;

  //Attchments
  DocControl = new FormControl('', [Validators.maxLength(250), this.DocumentNameValidator.bind(this)]);
  filteredDocName: Observable<any[]>;
  attchmentList: any[] = [];
  fileToUpload: File | null = null;
  selectedItem: any = null;
  SelectedDocName: any;
  documentList: any[] = [];
  documentName: any
  remark: any;
  mandatory: boolean;
  @ViewChild('fileInput') fileInput: any;

  //Other Variabes
  pageSize = 10;
  skip = 0;
  showAddRow: boolean | undefined;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  userId$: any;
  editRow: boolean = false;
  pagePrivilege: Array<string>;
  selectedDocId: any;
  Filepath = environment.Fileretrive;
  hasViewRoute: any;
  disableStatus: boolean = true;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  liveStatus = 1;


  //Kendo grid
  public aggregates: any[] = [
    { field: "partCIFValue", aggregate: "sum" },
    { field: "netWeight", aggregate: "sum" },
  ];
  public total: any;

  JobOrderGeneral: JobOrderDetails = new JobOrderDetails();
  selectedTransportModes: any[] = [];
  originCountryID: any;
  destinationCountryID: any;
  JobOrderId: any;
  JOTMModes: JOTransportModeModal[] = [];
  JOCommodity: JOCommodityModal[] = [];
  selectedCommodity: any[] = [];
  selectedJobType: boolean = false;
  selectedPackageType: boolean = false;
  AirStatusList: any;
  SeaStatusList: any;
  RoadStatusList: any;
  ImageDetailsArray: any[] = [];
  rowIndexDocument: any;
  editedDocument: any;
  LoadingPortId: any;
  DestinationPortId: any;
  overallCIFvalue: any;
  CIFCurrency: any;
  joStageandStatus: any[] = [];
  package: any;
  partdetails: any;
  selectedjobcatname: any;
  jobstage: any;
  jobstatus: any;
  orderstatus: any;
  QuotationLineItems: any[] = [];
  defaultSettingsValues: DefaultSettings[];
  regionList: any[] = [];
  regionId: number | undefined;
  regionName: any;
  joStageandStatusnew: any[] = [];

  //
  multipleContractControl = new FormControl('');
  selectedIndex = 0;
  

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>,
    private regionService: RegionService, private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    private docmentsService: DocmentsService, private Fs: FileuploadService,
    private vendorSvc: VendorService, public dateValidator: DateValidatorService,
    private customerService: CustomerService, private commonService: CommonService,
    private jobtypeService: JobtypeserviceService, private commodityService: CommodityService,
    private incoTermService: IncoTermService, private reasonmstSvc: ReasonService,
    private hsCodeService: HscodeService, private Qs: QuotationService,
    private errorHandler: ApiErrorHandlerService) {
  }

  ngOnInit(): void {
    this.GetUserId();
    this.getDocumentList();
    this.CustomerGetAll();
    this.getjobCategoryList();
    this.getTransportList();
    this.getbillingCurrencyList();
    this.getEmployeeList();
    this.GetAllJOAgainst();
    this.getCountryMaster();
    //this.GetAllJobStage();
    this.getAllStatusType();
    this.getReasons();
    this.getAllCargos();
    this.getCommodityList();
    this.getIncotermList();
    this.getAllRegion();
    this.route.paramMap.subscribe(params => {
      const currentUrl = this.router.url;
      this.hasViewRoute = currentUrl.includes('/view');
      if (this.hasViewRoute) {
        this.disableForms();
      }
      this.JobOrderId = params.get('id');
      if (this.JobOrderId != '' && this.JobOrderId != null) {
        this.getJObyId(this.JobOrderId)
      } else {
        const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.JobOrderGeneralForm.patchValue({
          jobOrderDateControl: formattedDate
        });
      }
    });
    this.store.select("privileges").subscribe({
      next: (res) => {
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
      },
    });
    this.JobOrderGeneralForm.get('modeofTransportControl')?.valueChanges.subscribe((selectedValues: any) => {
      //this.selectedTransportModes = selectedValues;
      this.selectedTransportModes = [];
      this.selectedTransportModes.push(selectedValues);
      this.updateTransportModes();
      this.modeOfChange('');
    });

    this.ServiceDetailForm.get('commodityControl')?.valueChanges.subscribe((selectedValues: any) => {
      this.selectedCommodity = selectedValues;
      this.updateCommodity();
    })

    if (this.JobOrderId === '' || this.JobOrderId === null) {
      this.getDefaultSetting();
    }

    this.calculateAggregates();
    this.matFilters();
  }

  disableForms() {
    this.JobOrderGeneralForm.disable();
    this.ServiceDetailForm.disable();
    this.flightNumberControl.disable();
    this.flightNameControl.disable();
    this.mAWBNumberControl.disable();
    this.MBLNumberControl.disable();
    this.WMSOrderNoControl.disable();
    this.RMANumberControl.disable();
    this.WMSOrderStatusControl.disable();
    this.numberOfPackegesControl.disable();
    this.overallCIFValueControl.disable();
    this.CIFCurrencyControl.disable();
  }
  private calculateAggregates(): void {
    this.total = aggregateBy(this.JobTypeGrid, this.aggregates);
    this.overallCIFvalue = this.total;
    let val: any = +this.overallCIFvalue?.partCIFValue?.sum;
    this.overallCIFValueControl.patchValue(val)
  }

  getJObyId(id: any) {
    this.regionService.GetJobOrderById(id).subscribe((res: any) => {
      console.log(res)
      this.JobOrderGeneral = res?.joGeneral;
      this.JOTMModes = res?.joTransportMode;
      this.JOCommodity = res?.joCommodity;
      this.AirTransportGrid = res?.joAirTransport;
      this.SeaTransportGrid = res?.joSeaTransport;
      this.RoadTransportGrid = res?.joRoadTransport;
      this.JobTypeGrid = res?.joPartDetail;
      this.PackageDetailsGrid = res?.joPackage;
      this.LineItemDetailsGrid = res?.joLineItem;
      this.attchmentList = res?.joDocument;
      this.jobstage = this.JobOrderGeneral.jobStage,
        this.jobstatus = this.JobOrderGeneral.jobStageStatus,
        this.calculateAggregates();

      if (res?.joTransportMode) {
        setTimeout(() => {
          // const selectedModes = res?.joTransportMode?.map((mode: any) => mode.transportModeId);
          // this.JobOrderGeneralForm.patchValue({
          //   modeofTransportControl: selectedModes
          // });
          const selectedMode = res?.joTransportMode?.[0]?.transportModeId;
          this.JobOrderGeneralForm.patchValue({
            modeofTransportControl: selectedMode
          });

        }, 1300)

      }
      if (res?.joCommodity) {
        const selectedModes = res?.joCommodity?.map((mode: any) => mode.commodityId);
        this.ServiceDetailForm.patchValue({
          commodityControl: selectedModes
        });;
      }

      //Trigger dropdown API's
      if (this.JobOrderGeneral.joAgainst) {
        this.OnJOAgainstEvent(this.JobOrderGeneral.joAgainst);
      }
      if (this.JobOrderGeneral.contractNumber) {
        this.OnBaseRefEvent(this.JobOrderGeneral.contractNumber);
      }
      if (this.JobOrderGeneral.customerName) {
        this.OnCustomerChangeEvent(this.JobOrderGeneral)
      }
      if (this.JobOrderGeneral.jobCategory) {
        this.OnJobCategoryChangeEvent(this.JobOrderGeneral.jobCategory);
      }

      setTimeout(() => {
        if (this.JobOrderGeneral.jobTypeName) {
          this.OnJobTypeEventEdit(this.JobOrderGeneral.jobTypeName);
        }
      }, 1000);

      if (this.JobOrderGeneral.originCountry) {
        this.OnOriginCountryEvent(this.JobOrderGeneral.originCountry)
      }
      if (this.JobOrderGeneral.destinationCountry) {
        this.OnDestinationCountryEvent(this.JobOrderGeneral.destinationCountry)
      }

      if (this.JobOrderGeneral.jobStageStatus) {
        this.OnStatusChangeEvent(this.JobOrderGeneral.jobStageStatus);
      }


      setTimeout(() => {
        if (this.JobOrderGeneral != null) {
          this.JobOrderGeneralForm.patchValue({
            jobOrderNumberControl: this.JobOrderGeneral.jobOrderNumber,
            jobOrderDateControl: this.JobOrderGeneral.jobOrderDate,
            jobOrderAgainstControl: this.JobOrderGeneral.joAgainst,
            baseReferenceNoControl: this.JobOrderGeneral.contractNumber,
            referenceNumber1Control: this.JobOrderGeneral.referenceNumber1,
            referenceNumber2Control: this.JobOrderGeneral.referenceNumber2,
            customerNameControl: this.JobOrderGeneral.customerName,
            customerAddressControl: this.JobOrderGeneral.addressName,
            contactPersonControl: this.JobOrderGeneral.contactPerson,
            customerBillingCurrencyControl: this.JobOrderGeneral.currencyName,
            exchangeRateControl: this.JobOrderGeneral.exchangeRate || 0,
            jobCategoryControl: this.JobOrderGeneral.jobCategory,
            jobTypeControl: this.JobOrderGeneral.jobTypeName,
            salesOwnerControl: this.JobOrderGeneral.salesOwner,
            salesExecutiveControl: this.JobOrderGeneral.salesExecutive,
            jobOwnerControl: this.JobOrderGeneral.jobOwnerName,
            jobOrderStageControl: this.JobOrderGeneral.jobStage,
            jobOrderStatusControl: this.JobOrderGeneral.jobStageStatus,
            jobClosingDateControl: this.JobOrderGeneral.jobClosingDate,
            cancelReasonControl: this.JobOrderGeneral.reasonName,
            cancelRemarkControl: this.JobOrderGeneral.cancelRemarks,
            billofEntryNumberControl: this.JobOrderGeneral.billOfEntry,
            remarksControl: this.JobOrderGeneral.remarks,
            tagsControl: this.JobOrderGeneral.tags
          })
          this.ServiceDetailForm.patchValue({
            originCountryControl: this.JobOrderGeneral.originCountry,
            destinationCountryControl: this.JobOrderGeneral.destinationCountry,
            // portofLoadingControl: this.JobOrderGeneral.portofLoading,
            // portofDestinationControl: this.JobOrderGeneral.portofDestination,
            originLocationControl: this.JobOrderGeneral.originLocation,
            destinationLocationControl: this.JobOrderGeneral.destinationLocation,
            pickUpLocationControl: this.JobOrderGeneral.pickUpLocation,
            finalPlaceofDeliveryControl: this.JobOrderGeneral.deliveryPlace,
            transitTimeControl: this.JobOrderGeneral.transitTime,
            routingControl: this.JobOrderGeneral.routing,
            tempratureRequiredControl: this.JobOrderGeneral.temperatureReq,
            cargoTypeControl: this.JobOrderGeneral.cargoType,
            incoTermControl: this.JobOrderGeneral.incoTermCode
          });
          this.flightNumberControl.patchValue(this.JobOrderGeneral.flightNumber)
          this.flightNameControl.patchValue(this.JobOrderGeneral.flightName)
          this.mAWBNumberControl.patchValue(this.JobOrderGeneral.mawbNumber)
          this.MBLNumberControl.patchValue(this.JobOrderGeneral.mblNumber)
          this.WMSOrderNoControl.patchValue(this.JobOrderGeneral.wmsOrderNumber)
          this.RMANumberControl.patchValue(this.JobOrderGeneral.rmaNumber)
          this.WMSOrderStatusControl.patchValue(this.JobOrderGeneral.wmsOrderStatus)
          this.numberOfPackegesControl.patchValue(this.JobOrderGeneral.packageNos)
          this.overallCIFValueControl.patchValue(this.JobOrderGeneral.overallCIFValue)
          this.CIFCurrencyControl.patchValue(this.JobOrderGeneral.cifCurrencyName)
          this.CIFCurrencyContrl.patchValue(this.JobOrderGeneral.cifCurrencyName)
        }
      }, 1500)

      if (this.JobOrderId) {
        this.JobOrderGeneralForm.controls.jobOrderDateControl.disable();
        this.JobOrderGeneralForm.controls.jobOrderAgainstControl.disable();
        this.JobOrderGeneralForm.controls.baseReferenceNoControl.disable();
        this.multipleContractControl.disable();
        this.JobOrderGeneralForm.controls.customerNameControl.disable();
      }
      this.matFilters();
    })
  }

  hasTransportMode(transportModeId: number): boolean {
    return this.JOTMModes.some(mode => mode.transportModeId === transportModeId);
  }

  JobOrderGeneralForm = new FormGroup({
    jobOrderNumberControl: new FormControl({ disabled: true, value: '' }),
    jobOrderDateControl: new FormControl('', Validators.required),
    jobOrderAgainstControl: new FormControl('', [Validators.required, this.jobOrderAgainstControlValidator.bind(this)]),
    baseReferenceNoControl: new FormControl('', [this.BaseRefenceValidatorValidator.bind(this)]),
    referenceNumber1Control: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    referenceNumber2Control: new FormControl('', Validators.maxLength(20)),
    customerNameControl: new FormControl('', [Validators.required, this.CustomerNameValidator.bind(this)]),
    customerAddressControl: new FormControl('', [Validators.required, this.CustomerAddressValidator.bind(this)]),
    contactPersonControl: new FormControl('', [Validators.required, this.ContactPersonValidator.bind(this)]),
    customerBillingCurrencyControl: new FormControl('', [Validators.required, this.CustomerBillingCurrencyValidator.bind(this)]),
    exchangeRateControl: new FormControl({ disabled: true, value: '' }),
    jobCategoryControl: new FormControl('', [Validators.required, this.JobCategoryValidator.bind(this)]),
    jobTypeControl: new FormControl('', [Validators.required, this.JobTypeValidator.bind(this)]),
    modeofTransportControl: new FormControl([]),
    salesOwnerControl: new FormControl('', [Validators.required, this.SalesOwnerValidator.bind(this)]),
    salesExecutiveControl: new FormControl('', [Validators.required, this.SalesExecutiveValidator.bind(this)]),
    jobOwnerControl: new FormControl('', [Validators.required, this.JobOwnerValidator.bind(this)]),
    jobOrderStageControl: new FormControl({ disabled: true, value: '' }, [Validators.required, this.JobOrderStageValidator.bind(this)]),
    jobOrderStatusControl: new FormControl('', [Validators.required, this.JobOrderStatusValidator.bind(this)]),
    jobClosingDateControl: new FormControl({ disabled: true, value: '' }),
    cancelReasonControl: new FormControl({ disabled: true, value: '' }, [this.CancelReasonValidator.bind(this)]),
    cancelRemarkControl: new FormControl({ disabled: true, value: '' }),
    billofEntryNumberControl: new FormControl('', [Validators.maxLength(100)]),
    remarksControl: new FormControl('', [Validators.maxLength(500)]),
    tagsControl: new FormControl('', [Validators.maxLength(100)]),
  })

  get f1() {
    return this.JobOrderGeneralForm.controls;
  }

  ServiceDetailForm = new FormGroup({
    originCountryControl: new FormControl('', [Validators.required, this.OriginCountryValidator.bind(this)]),
    destinationCountryControl: new FormControl('', [Validators.required, this.DestinationCountryValidator.bind(this)]),
    portofLoadingControl: new FormControl(''),
    portofDestinationControl: new FormControl(''),
    originLocationControl: new FormControl('', [this.OriginLocationValidator.bind(this)]),
    destinationLocationControl: new FormControl('', [this.DestinationLocationValidator.bind(this)]),
    pickUpLocationControl: new FormControl('',[Validators.maxLength(100)]),
    finalPlaceofDeliveryControl: new FormControl('',[Validators.maxLength(100)]),
    transitTimeControl: new FormControl('',[Validators.maxLength(20)]),
    routingControl: new FormControl('',[Validators.maxLength(50)]),
    tempratureRequiredControl: new FormControl('',[Validators.maxLength(20)]),
    cargoTypeControl: new FormControl('', [this.CargoTypeControlValidator.bind(this)]),
    commodityControl: new FormControl([]),
    incoTermControl: new FormControl('', [Validators.required, this.IncoTermValidator.bind(this)]),
  })

  get f2() {
    return this.ServiceDetailForm.controls;
  }

  get dateFilter() {
    return this.dateValidator.dateFilter;
  }

  onTransitTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    const numericValue = parseFloat(inputValue);
   
    if (numericValue < 0) {
      inputElement.value = '0'; 
      const defaultValue:any = 0
      this.ServiceDetailForm.controls['transitTimeControl'].setValue(defaultValue);
    }
  }
  CIFValue(event: any) {
    const input:any = event.target as HTMLInputElement;
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
  
    input.value = +value;
    this.overallCIFValueControl.setValue(input.value);
  }

  matFilters() {
    this.filteredjobOrderAgainst = this.JobOrderGeneralForm.controls.jobOrderAgainstControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterjobOrderAgainst(value || '')),
    );
    this.filteredBaseReferenceNo = this.JobOrderGeneralForm.controls.baseReferenceNoControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredBaseReferenceNo(value || '')),
    );
    this.filteredCustomer = this.JobOrderGeneralForm.controls.customerNameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || '')),
    );
    this.filteredCustomerAddress = this.JobOrderGeneralForm.controls.customerNameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomerAddress(value || '')),
    );
    this.filteredContactPersonControl = this.JobOrderGeneralForm.controls.contactPersonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterContactPerson(value || '')),
    );
    this.filteredcustomerBillingCurrencyControl = this.JobOrderGeneralForm.controls.customerBillingCurrencyControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomerBillingCurrency(value || '')),
    );
    this.filteredCIFCurrencyContrl = this.CIFCurrencyContrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterfilteredCIFCurrencyContrl(value || '')),
    );
    this.filteredJobCategoryControl = this.JobOrderGeneralForm.controls.jobCategoryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterJobCategoryControlControl(value || '')),
    );
    this.filteredjobTypeControl = this.JobOrderGeneralForm.controls.jobTypeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterJobTypeControlControl(value || '')),
    );
    this.filteredsalesOwnerControl = this.JobOrderGeneralForm.controls.salesOwnerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredsalesOwnerControl(value || '')),
    );
    this.filteredsalesExecutiveControl = this.JobOrderGeneralForm.controls.salesExecutiveControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredsalesExecutiveControl(value || '')),
    );
    this.filteredjobOwnerControl = this.JobOrderGeneralForm.controls.jobOwnerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredjobOwnerControl(value || '')),
    );
    this.filteredjobOrderStageControl = this.JobOrderGeneralForm.controls.jobOrderStageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredjobOrderStageControl(value || '')),
    );
    this.filteredjobOrderStatusControl = this.JobOrderGeneralForm.controls.jobOrderStatusControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredjobOrderStatusControl(value || '')),
    );
    this.filteredcancelReasonControl = this.JobOrderGeneralForm.controls.cancelReasonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcancelReasonControl(value || '')),
    );

    //Service Tab
    this.filteredoriginCountryControl = this.ServiceDetailForm.controls.originCountryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredoriginCountryControl(value || '')),
    );
    this.filtereddestinationCountryControl = this.ServiceDetailForm.controls.destinationCountryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtereddestinationCountryControl(value || '')),
    );
    this.filteredportofLoadingControl = this.ServiceDetailForm.controls.portofLoadingControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredportofLoadingControl(value || '')),
    );
    this.filteredportofDestinationControl = this.ServiceDetailForm.controls.portofDestinationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredportofDestinationControl(value || '')),
    );
    this.filteredoriginLocationControl = this.ServiceDetailForm.controls.originLocationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredoriginLocationControl(value || '')),
    );
    this.filtereddestinationLocationControl = this.ServiceDetailForm.controls.destinationLocationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtereddestinationLocationControl(value || '')),
    );
    this.filteredcargoTypeControl = this.ServiceDetailForm.controls.cargoTypeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcargoTypeControl(value || '')),
    );
    this.filteredincoTermControl = this.ServiceDetailForm.controls.incoTermControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredincoTermControl(value || '')),
    );


    //Attachment
    this.filteredDocName = this.DocControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoc(value || '')),
    );
  }

  private _filterjobOrderAgainst(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderAgainstList.filter((option: any) => option?.joAgainst.toLowerCase().includes(filterValue));
  }
  private _filteredBaseReferenceNo(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.BaseReferenceNoList.filter((option: any) => option?.contractNumber.toLowerCase().includes(filterValue));
  }
  private _filterCustomer(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter((option: any) => option?.customerName.toLowerCase().includes(filterValue));
  }
  private _filterCustomerAddress(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerAddressList.filter((option: any) => option?.addressName.toLowerCase().includes(filterValue));
  }
  private _filterContactPerson(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ContactPersonList.filter((option: any) => option?.contactPerson.toLowerCase().includes(filterValue));
  }
  private _filterCustomerBillingCurrency(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerBillingCurrencyList.filter((option: any) => option?.currencyName.toLowerCase().includes(filterValue));
  }
  private _filterfilteredCIFCurrencyContrl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerBillingCurrencyList.filter((option: any) => option?.currencyName.toLowerCase().includes(filterValue));
  }
  private _filterJobCategoryControlControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobCategoryList.filter((option: any) => option?.jobCategory.toLowerCase().includes(filterValue));
  }
  private _filterJobTypeControlControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobTypeList.filter((option: any) => option?.jobTypeName.toLowerCase().includes(filterValue));
  }
  private _filteredsalesOwnerControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.SalesOwnerList.filter((option: any) => option?.employeeName.toLowerCase().includes(filterValue));
  }
  private _filteredsalesExecutiveControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.SalesExecutiveList.filter((option: any) => option?.employeeName.toLowerCase().includes(filterValue));
  }
  private _filteredjobOwnerControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOwnerList.filter((option: any) => option?.employeeName.toLowerCase().includes(filterValue));
  }
  private _filteredjobOrderStageControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.joStageandStatus.filter((option: any) => option?.jobStage.toLowerCase().includes(filterValue));
  }
  private _filteredjobOrderStatusControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStatusList.filter((option: any) => option?.jobStageStatus.toLowerCase().includes(filterValue));
  }
  private _filteredcancelReasonControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CancelReasonList.filter((option: any) => option?.reasonName.toLowerCase().includes(filterValue));
  }

  OnchangeEventjobstage(event: any) {
    let jobStage = event?.option?.value;
    this.jobstage = jobStage;
    this.JobOrderGeneralForm.get('jobOrderStatusControl')?.reset();

    var jobstatus = this.joStageandStatus.find(id => id.jobStage == jobStage);
    var status = this.JobOrderStatusList.find(id => id.jobStageStatusId == jobstatus.statusId);
    console.log("568045754", status);
    this.jobstatus = status?.jobStageStatus;
    this.JobOrderGeneralForm.get('jobOrderStatusControl')?.patchValue(status?.jobStageStatus);


    this.OnStatusChangeEvent(status?.jobStageStatus);
    this.matFilters();


  }

  BaseRefenceValidatorValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '' && value !== null && value !== null) {
      var isValid = this.BaseReferenceNoList?.some((option: any) => option?.contractNumber === value);
      return isValid ? null : { invalidOption: true };
      // const [contractNumber] = value.split(' - ');  
      // const isValid = this.BaseReferenceNoList?.some((option: any) => option?.contractNumber === contractNumber.trim());
      
      // return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  //Service Tab
  private _filteredoriginCountryControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.OriginCountryList.filter((option: any) => option?.countryName.toLowerCase().includes(filterValue));
  }
  private _filtereddestinationCountryControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.DestinationCountryList.filter((option: any) => option?.countryName.toLowerCase().includes(filterValue));
  }
  private _filteredportofLoadingControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.PortofLoadingList.filter((option: any) => option?.loadingPortName.toLowerCase().includes(filterValue));
  }
  private _filteredportofDestinationControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.PortofDestinationList.filter((option: any) => option?.destinationPortIdName.toLowerCase().includes(filterValue));
  }
  private _filteredoriginLocationControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.OriginLocationList.filter((option: any) => option?.cityName.toLowerCase().includes(filterValue));
  }
  private _filtereddestinationLocationControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.DestinationLocationList.filter((option: any) => option?.cityName.toLowerCase().includes(filterValue));
  }
  private _filteredcargoTypeControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CargoTypeList.filter((option: any) => option?.cargoType.toLowerCase().includes(filterValue));
  }
  private _filteredincoTermControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.IncoTermList.filter((option: any) => option?.incoTermCode.toLowerCase().includes(filterValue));
  }

  //Attachment
  private _filterDoc(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.documentList.filter(option => option?.documentName.toLowerCase().includes(filterValue));
  }

  jobOrderAgainstControlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.JobOrderAgainstList?.some((option: any) => option?.joAgainst === value);
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
  CustomerNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CustomerList?.some((option: any) => option?.customerName === value);
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
  CustomerBillingCurrencyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CustomerBillingCurrencyList?.some((option: any) => option?.currencyName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  JobCategoryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.JobCategoryList?.some((option: any) => option?.jobCategory === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  JobTypeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.JobTypeList?.some((option: any) => option?.jobTypeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  SalesOwnerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.SalesOwnerList?.some((option: any) => option?.employeeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  SalesExecutiveValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.SalesExecutiveList?.some((option: any) => option?.employeeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  JobOwnerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.JobOwnerList?.some((option: any) => option?.employeeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  JobOrderStageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.joStageandStatus?.some((option: any) => option?.jobStage === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  JobOrderStatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.JobOrderStatusList?.some((option: any) => option?.jobStageStatus === value);
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

  DocumentNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.documentList?.some((option: any) => option?.documentName === value);
    return isValid ? null : { invalidOption: true };
  }
  //Service Tab
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
  PortofLoadingValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.PortofLoadingList?.some((option: any) => option?.loadingPortName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  PortofDestinationValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.PortofDestinationList?.some((option: any) => option?.destinationPortIdName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  OriginLocationValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.OriginLocationList?.some((option: any) => option?.cityName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  validateOriginLocation() {
    this.ServiceDetailForm.controls.originLocationControl.setValidators([this.OriginLocationValidator.bind(this)]);
    this.ServiceDetailForm.controls.originLocationControl.updateValueAndValidity();
  }
  DestinationLocationValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.DestinationLocationList?.some((option: any) => option?.cityName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  validateDesLocation() {
    this.ServiceDetailForm.controls.destinationLocationControl.setValidators([this.DestinationLocationValidator.bind(this)]);
    this.ServiceDetailForm.controls.destinationLocationControl.updateValueAndValidity();
  }
  CargoTypeControlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CargoTypeList?.some((option: any) => option?.cargoType === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  IncoTermValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.IncoTermList?.some((option: any) => option?.incoTermCode === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  //DefaultSetting
  getDefaultSetting() {
    this.commonService.GetAllDefaultSettings().subscribe(res => {

      if (res) {
        this.defaultSettingsValues = res;
        console.log(this.defaultSettingsValues)
        let defaultValue = this.defaultSettingsValues.find(x => x.settingName == 'Currency')
        let currencyId = defaultValue?.defaultValueId;
        let currency = this.CustomerBillingCurrencyList?.find(x => x.currencyId === currencyId)

        this.JobOrderGeneralForm.controls.customerBillingCurrencyControl.patchValue(currency?.currencyName)


        //Region
        let defaultRegionValue = this.defaultSettingsValues.find(x => x.settingName == 'Region')
        this.regionId = defaultRegionValue?.defaultValueId;

        if (this.regionList?.length === 0) {
          this.regionService.getRegions().subscribe(data => {
            this.regionList = data;

            let value = this.regionList?.find(x => x.regionId == this.regionId);
            //this.jocbdForm.controls['regionId'].setValue(value);
            this.regionName = value?.regionName;
            console.log("this.regionName", this.regionName)
            this.matFilters();
          });
        } else {
          let value = this.regionList?.find(x => x.regionId == this.regionId);
          //this.jocbdForm.controls['regionId'].setValue(value);
          this.regionName = value?.regionName;
          console.log("this.regionName", this.regionName)
        }
      }

    });
  }

  OnJOAgainstEvent(event: any) {
    debugger
    let value = event?.option?.value ? event?.option?.value : event;
    let selectedJOAgainst = this.JobOrderAgainstList.find(option => option?.joAgainst === value)
    if (!this.hasViewRoute) {
      this.JobOrderGeneralForm.controls.baseReferenceNoControl.enable();
    }

    let customer = this.getJOCustomerId(this.JobOrderGeneralForm.controls.customerNameControl.value) || 0;

      this.BaseReferenceNoList = [];
      if (selectedJOAgainst?.joAgainstId == 1) {
        this.JobOrderGeneralForm.controls.baseReferenceNoControl.reset();
        this.JobOrderGeneralForm.controls.referenceNumber1Control.reset();
        this.JobOrderGeneralForm.controls.referenceNumber2Control.reset();
        //this.JobOrderGeneralForm.get('customerNameControl')?.reset();
        //this.JobOrderGeneralForm.get('contactPersonControl')?.reset();
        //this.JobOrderGeneralForm.get('customerAddressControl')?.reset();
        //this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.reset();
        //this.JobOrderGeneralForm.get('salesOwnerControl')?.reset();
        //this.JobOrderGeneralForm.get('salesExecutiveControl')?.reset();
        //this.JobOrderGeneralForm.controls.customerNameControl.enable();
        this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.enable();


        this.regionService.GetJOReferenceByCustomer(customer, selectedJOAgainst?.joAgainstId,parseInt(this.userId$)).subscribe((res: any) => {
          if (res?.quotationResults?.length > 0) {
            this.BaseReferenceNoList = res?.quotationResults?.map((item: any) => {
              if (item.hasOwnProperty('quotationNumber')) {
                item['contractNumber'] = item['quotationNumber'];
                delete item['quotationNumber'];
              }
              return item;
            });
          }
          console.log(this.BaseReferenceNoList)
          this.matFilters();
        });
        //this.JobOrderGeneralForm.controls.customerNameControl.disable();

      } else if (selectedJOAgainst?.joAgainstId == 2) {
        this.JobOrderGeneralForm.controls.baseReferenceNoControl.reset();
        this.JobOrderGeneralForm.controls.referenceNumber1Control.reset();
        this.JobOrderGeneralForm.controls.referenceNumber2Control.reset();
        //this.JobOrderGeneralForm.get('customerNameControl')?.reset();
        //this.JobOrderGeneralForm.get('contactPersonControl')?.reset();
        //this.JobOrderGeneralForm.get('customerAddressControl')?.reset();
        //this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.reset();
        this.JobOrderGeneralForm.get('jobCategoryControl')?.reset();
        this.JobOrderGeneralForm.get('jobTypeControl')?.reset();
        this.JobOrderGeneralForm.get('modeofTransportControl')?.reset();
        this.JobOrderGeneralForm.get('salesOwnerControl')?.reset();
        this.JobOrderGeneralForm.get('salesExecutiveControl')?.reset();
        this.JobOrderGeneralForm.controls.customerNameControl.enable();
        //this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.enable();

        this.JobOrderGeneralForm.get('customerNameControl')?.enable();
        this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.enable();
        this.JobOrderGeneralForm.get('salesOwnerControl')?.enable();
        this.JobOrderGeneralForm.get('salesExecutiveControl')?.enable();

        this.regionService.GetJOReferenceByCustomer(customer, selectedJOAgainst?.joAgainstId,parseInt(this.userId$)).subscribe((res: any) => {
          if (res?.customerContractResults?.length > 0) {
            this.BaseReferenceNoList = res?.customerContractResults;

            const selectedJobOrderDate = this.JobOrderGeneralForm.get('jobOrderDateControl')?.value;

            if (selectedJobOrderDate) {
              const selectedDate = new Date(selectedJobOrderDate);
              selectedDate.setHours(0, 0, 0, 0);

              this.BaseReferenceNoList = this.BaseReferenceNoList.filter((item: any) => {
                const validFromDate = new Date(item.validFrom);
                const validToDate = new Date(item.validTo);

                validFromDate.setHours(0, 0, 0, 0);
                validToDate.setHours(0, 0, 0, 0);

                return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';
              });
            }
          }



          //this.JobOrderGeneralForm.controls.customerNameControl.disable();
          this.matFilters();
        })
      } else {
        this.JobOrderGeneralForm.get('baseReferenceNoControl')?.reset();
        //this.JobOrderGeneralForm.get('customerNameControl')?.reset();
        //this.JobOrderGeneralForm.get('contactPersonControl')?.reset();
        //this.JobOrderGeneralForm.get('customerAddressControl')?.reset();
        //this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.reset();
        this.JobOrderGeneralForm.get('salesOwnerControl')?.reset();
        this.JobOrderGeneralForm.get('salesExecutiveControl')?.reset();
        this.JobOrderGeneralForm.controls.customerNameControl.enable();
        this.JobOrderGeneralForm.controls.baseReferenceNoControl.disable();
        this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.enable();

        let loggedInUser = this.SalesExecutiveList.find(option => option.employeeId === parseInt(this.userId$))
        if (loggedInUser) {
          this.JobOrderGeneralForm.get('salesOwnerControl')?.patchValue(loggedInUser?.employeeName);
          this.JobOrderGeneralForm.get('salesExecutiveControl')?.patchValue(loggedInUser?.employeeName);
        }
      }
    

    let loggedInUser = this.SalesExecutiveList.find(option => option.employeeId === parseInt(this.userId$))
    this.JobOrderGeneralForm.get('jobOwnerControl')?.patchValue(loggedInUser?.employeeName);
    this.matFilters();
  }


  OnBaseRefEvent(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;

    const prefix = value?.substring(0, 2);
    if (prefix === 'QO') {

      this.ServiceDetailForm.get('portofDestinationControl')?.reset();
      this.ServiceDetailForm.get('portofLoadingControl')?.reset();

      let selectedRef = this.BaseReferenceNoList.find(option => option?.contractNumber === value)
      if (selectedRef) {
        //this.JobOrderGeneralForm.get('customerNameControl')?.patchValue(selectedRef?.customerName);
        //this.JobOrderGeneralForm.controls.customerNameControl.disable();
        this.OnQuatationChangeEvent(selectedRef);
      }

      console.log(selectedRef)
    } else if (prefix === 'CC') {
      let selectedRef = this.BaseReferenceNoList.find(option => option?.contractNumber === value)
      if (selectedRef) {
        // const valueToPatch = selectedRef?.contractNumber?.includes('CC')
        //   ? `${selectedRef.contractNumber} - ${selectedRef.countryName}` 
        //   : selectedRef.contractNumber;  

        // // Patch the value to the form control
        // this.JobOrderGeneralForm.patchValue({
        //   baseReferenceNoControl: valueToPatch
        // });
        this.JobOrderGeneralForm.get('customerNameControl')?.patchValue(selectedRef?.customerName);
        //this.JobOrderGeneralForm.controls.customerNameControl.disable();
        this.OnCustomerEvent(selectedRef);
      }
    } else {

    }


    this.matFilters();
  }


  OnCustomerEvent(event:any){
    let value = event?.customerName;
    let id = this.CustomerList.find(option => option.customerName === value);
    if (id) {
      this.customerService.CustomerIdByAddress(id?.customerId).subscribe((res: any) => {
        this.CustomerAddressList = res;
        let primaryAddress = this.CustomerAddressList.find(option => option?.primaryAddress === true)
        this.JobOrderGeneralForm.get('customerAddressControl')?.patchValue(primaryAddress?.addressName);
        this.matFilters();
      });

      this.customerService.CustomerIdByContact(id?.customerId).subscribe((res: any) => {
        this.ContactPersonList = res;
        let primaryContact = this.ContactPersonList.find(option => option?.primaryContact === true)
        this.JobOrderGeneralForm.get('contactPersonControl')?.patchValue(primaryContact?.contactPerson);
        this.matFilters();
      })

      this.customerService.getAllCustomerById(id?.customerId).subscribe((res: any) => {
        console.log(res);
        this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.patchValue(res?.customer?.currencyName);
        this.JobOrderGeneralForm.get('exchangeRateControl')?.reset();
        this.getExchange();
        this.JobOrderGeneralForm.get('salesOwnerControl')?.patchValue(res?.customer?.salesOwnerName);
        this.JobOrderGeneralForm.get('salesExecutiveControl')?.patchValue(res?.customer?.salesExecutiveName);

        if (res?.customer?.billingCurrency === "All Currency") {
          this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.enable();
        } else if (res?.customer?.billingCurrency === "Party Currency") {
          this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.disable();
        }
      })
    }

  }


  OnJobCategoryChangeEvent(event: any) {
    this.JobOrderGeneralForm.controls.jobTypeControl.reset();
    this.OnJobTypeEvent('');

    this.selectedJobType = false;
    let value = event?.option?.value ? event?.option?.value : event;
    this.selectedjobcatname = value;

    let job = this.JobCategoryList.find(option => option.jobCategory === value);
    this.getJobTypeList(job?.jobCategoryId);
    this.matFilters();
    if (value == "Warehouse") {
      this.JobOrderGeneralForm.controls.modeofTransportControl.reset();
      this.JobOrderGeneralForm.controls.modeofTransportControl.disable();
    } else {
      this.JobOrderGeneralForm.controls.modeofTransportControl.enable();
    }
  }

  previousLineItems: any[] = [];
  previousDoc: any[] = [];
  OnJobTypeEvent(event: any) {
    debugger;
    this.selectedJobType = false;
    this.selectedPackageType = false;
    let value = event?.option?.value ? event?.option?.value : event;
    let selectedValue = this.JobTypeList.find(option => option?.jobTypeName === value);
    this.selectedJobType = selectedValue?.partDetails;
    this.selectedPackageType = selectedValue?.packageDetails;
    this.joStageandStatus = [];
    this.JobOrderGeneralForm.controls["jobOrderStageControl"].reset();
    this.JobOrderGeneralForm.controls["jobOrderStatusControl"].reset();
    if (this.selectedJobType == true) {
      this.overallCIFValueControl.reset();
      //this.overallCIFValueControl.disable();

      this.CIFCurrencyControl.reset();
      //this.CIFCurrencyControl.disable();

      let val: any = +this.overallCIFvalue?.partCIFValue?.sum;
      this.overallCIFValueControl.patchValue(val)
    } else {
      this.overallCIFValueControl.reset();
      this.overallCIFValueControl.enable();
      this.CIFCurrencyControl.reset();
      this.CIFCurrencyControl.enable();
    }
    this.matFilters();

    if (selectedValue?.jobTypeId) {
      this.jobtypeService.getAllJopTypeById(selectedValue?.jobTypeId).subscribe((res: any) => {

        console.log("resjobtype", res);
        this.selectedJobType = res.jobTypeGeneral.partDetails;
        this.selectedPackageType = res.jobTypeGeneral.packageDetails;

        if (res?.jobTypeStatuses?.length != 0) {
          this.joStageandStatus = res?.jobTypeStatuses;
          this.joStageandStatusnew = res?.jobTypeStatuses.sort((a: any, b: any) => {
            return a.preferenceOrder - b.preferenceOrder;
          });
          var jobstatus = this.joStageandStatus.find(id => id.jobStage == this.joStageandStatusnew[0].jobStage);
          this.JobOrderGeneralForm.get('jobOrderStageControl')?.patchValue(jobstatus?.jobStage);
          this.jobstage = jobstatus?.jobStage
          var status = this.JobOrderStatusList.find(id => id.jobStageStatusId == jobstatus.statusId);
          console.log("568045754", status);
          this.jobstatus = status?.jobStageStatus;
          this.JobOrderGeneralForm.get('jobOrderStatusControl')?.patchValue(status?.jobStageStatus);
          this.matFilters();

          this.OnStatusChangeEvent(status?.jobStageStatus);
        }
        //Patch TM Mode
        if (res?.jobTypeGeneral?.modeofTransport != '') {

          const modeofTransportString = res?.jobTypeGeneral?.modeofTransport;
          const modeofTransportArray = modeofTransportString?.split(',').map((mode: string) => mode.trim());

          // Find the IDs for the transport modes
          const modeofTransportIds: any = this.ModeOfTransportList
            .filter(m => modeofTransportArray?.includes(m.modeofTransport))
            .map(m => m.modeofTransportId);

          // Patch the form control with the IDs
          this.JobOrderGeneralForm.get('modeofTransportControl')?.patchValue(modeofTransportIds);
        }
        //patch Inco Term
        if (res?.jobTypeGeneral?.incoTermCode) {
          this.ServiceDetailForm.controls.incoTermControl.patchValue(res?.jobTypeGeneral?.incoTermCode);
        }

        //Line Item tab
        const newLineItems = res?.jobTypeLineItems?.map((item: any) => ({
          lineItemCategoryId: item?.lineItemCategoryId,
          lineItemId: item.lineItemId,
          lineItemCode: item.lineItemCode,
          lineItemName: item.lineItemName,
          lineItemCategoryName: item.lineItemCategoryName,
          regionId: this.regionId,
          regionName: this.regionName,
          countryName: this.ServiceDetailForm.controls.destinationCountryControl.value,
          serviceInId: this.getService(this.ServiceDetailForm.controls.destinationCountryControl.value),
          createdBy: parseInt(this.userId$),
          updatedBy: parseInt(this.userId$),
          rowNumber: this.generateRandomId(5),
        }));

        if (this.previousLineItems.length > 0) {
          for (const index of this.previousLineItems.reverse()) {
            this.LineItemDetailsGrid.splice(index, 1);
          }
        }

        this.previousLineItems = [];
        const startIndex = this.LineItemDetailsGrid.length;
        for (let i = 0; i < newLineItems.length; i++) {
          this.previousLineItems.push(startIndex + i);
        }
        this.LineItemDetailsGrid = [...this.LineItemDetailsGrid, ...newLineItems];


        //Document Tab
        const newDocItems = res?.jobTypeDocuments?.map((item: any) => ({
          documentId: item.documentId,
          documentTypeName: item.documentName,
          mandatory: item.mandatory,
          remarks: item.remarks,
          rowNumber: this.generateRandomId(5),
        }));

        const uniqueNewDocItems = newDocItems.filter((newDocItem: { documentTypeName: any; }) => {
          return !this.attchmentList.some(existingItem => existingItem.documentTypeName === newDocItem.documentTypeName);
        });

        if (this.previousDoc.length > 0) {
          for (const index of this.previousDoc.reverse()) {
            this.attchmentList.splice(index, 1);
          }
        }
        this.previousDoc = [];
        const startDocIndex = this.attchmentList.length;
        for (let i = 0; i < uniqueNewDocItems.length; i++) {
          this.previousDoc.push(startDocIndex + i);
        }
        this.attchmentList = [...this.attchmentList, ...uniqueNewDocItems];
      });
    }

  }


  OnchangeSalesOwnerEvent(event: any) {
    let salesOwnerEvent = event?.option?.value;
    this.JobOrderGeneralForm.get('salesExecutiveControl')?.patchValue(salesOwnerEvent);

    this.matFilters();
  }

  OnchangeEvent(event: any) {
    this.matFilters();
  }

  OnchangeCIFCurrencyEvent(event: any) {
    this.CIFCurrency = event?.option?.value ? event?.option?.value : event;
    this.CIFCurrencyControl.patchValue(this.CIFCurrency);
    this.CIFCurrencyContrl.patchValue(this.CIFCurrency);
    this.matFilters();
  }

  OnLoadingPortEvent(event: any) {
    this.LoadingPortId = event?.option?.value ? event?.option?.value : event;
    this.matFilters();
  }

  OnDestinationPortEvent(event: any) {
    this.DestinationPortId = event?.option?.value ? event?.option?.value : event;
    this.matFilters();
  }


  modeOfChange(event: any) {
    let value = event?.source?.value;
    this.selectedTransportModes?.forEach((item: any) => {
      if (item === 1 && (this.selectedTransportModes?.includes(2))) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Cannot select both Air and Sea simultaneously",
          showConfirmButton: false,
          timer: 2000,
        });
        this.JobOrderGeneralForm.get('modeofTransportControl')?.reset([]);
      }
    });

    this.selectedTransportModes?.forEach((item: any) => {
      if (item === 4 && (this.selectedTransportModes?.includes(1) || this.selectedTransportModes?.includes(2) || this.selectedTransportModes?.includes(3))) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Can't select Courier simultaneously with sea,air and road",
          showConfirmButton: false,
          timer: 2000,
        });
        this.JobOrderGeneralForm.get('modeofTransportControl')?.reset([]);
      }
    })

    //Dropdown data binding
    if (this.selectedTransportModes?.includes(1) && this.selectedTransportModes?.includes(3)) {
      this.seaportSelected = false;
      // this.PortofLoadingList = []
      // this.PortofDestinationList = []

      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllAirportList();
      }
    } else if (this.selectedTransportModes?.includes(2) && this.selectedTransportModes?.includes(3)) {
      this.seaportSelected = false;
      // this.PortofLoadingList = []
      // this.PortofDestinationList = []
      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllSeaportList();
      }
    } else if (this.selectedTransportModes?.includes(1)) {
      this.seaportSelected = false;
      // this.PortofLoadingList = []
      // this.PortofDestinationList = []

      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllAirportList();
      }
    }
    else if (this.selectedTransportModes?.includes(2)) {
      this.seaportSelected = true;
      // this.PortofLoadingList = []
      // this.PortofDestinationList = []
      //this.selectedPackageType = true;
      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllSeaportList();
      }
    }

    if(this.selectedTransportModes?.length == 0){
      this.seaportSelected = true;
    }
  }



  OnOriginCountryEvent(event: any) {
    this.ServiceDetailForm.controls.originLocationControl.reset()

    let value = event?.option?.value ? event?.option?.value : event;
    if (this.OriginCountryList?.length == 0) {
      this.commonService.getCountries(this.liveStatus).subscribe((result) => {
        this.OriginCountryList = result;
        this.DestinationCountryList = result;
      });
    }

    let option = this.OriginCountryList.find(option => option?.countryName == value)
    this.originCountryID = option?.countryId;
    this.getcityList(this.originCountryID)
    this.matFilters();

    if (this.selectedTransportModes?.includes(1)) {
      this.PortofLoadingList = []
      this.PortofDestinationList = []
      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllAirportList();
      }
    }
    else if (this.selectedTransportModes?.includes(2)) {
      this.PortofLoadingList = []
      this.PortofDestinationList = []
      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllSeaportList();
      }
    }
    this.matFilters();
  }

  OnDestinationCountryEvent(event: any) {
    this.ServiceDetailForm.controls.destinationLocationControl.reset()

    let value = event?.option?.value ? event?.option?.value : event;
    let option = this.OriginCountryList.find(option => option?.countryName == value)
    this.destinationCountryID = option?.countryId;
    this.getDestcityList(this.destinationCountryID);
    this.matFilters();

    if (this.selectedTransportModes?.includes(1)) {
      this.PortofLoadingList = []
      this.PortofDestinationList = []
      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllAirportList();
      }
    }
    else if (this.selectedTransportModes?.includes(2)) {
      this.PortofLoadingList = []
      this.PortofDestinationList = []
      this.ServiceDetailForm.controls.portofLoadingControl.reset()
      this.ServiceDetailForm.controls.portofDestinationControl.reset()
      if (this.originCountryID != null || this.destinationCountryID != null) {
        this.getAllSeaportList();
      }
    }
    this.matFilters();

    //Update Line Item
    if (this.LineItemDetailsGrid?.length > 0 && option) {
      console.log("option", option)
      console.log("this.LineItemDetailsGrid", this.LineItemDetailsGrid)
      this.LineItemDetailsGrid = this.LineItemDetailsGrid.map((item: any) => {
        if (!('joLineItemId' in item) || item?.joLineItemId === 0) {
          return {
            ...item,
            serviceInId: option?.countryId,
            countryName: option?.countryName
          };
        }
        return item;
      });
      console.log("Updated LineItemDetailsGrid", this.LineItemDetailsGrid);
    }

  }

  updateTransportModes() {
    const newModes = this.selectedTransportModes?.map(item => {
      return {
        joTransportModeId: 0,
        jobOrderId: this.JobOrderId || 0,
        transportModeId: item,
        createdBy: parseInt(this.userId$),
        createdDate: new Date(),
        updatedBy: parseInt(this.userId$),
        updatedDate: new Date(),
      };
    });

    // Add new modes to JOTMModes or update existing ones
    this.JOTMModes = this.JOTMModes?.filter(mode =>
      this.selectedTransportModes?.includes(mode.transportModeId)
    );

    this.JOTMModes?.push(...newModes?.filter(newMode =>
      !this.JOTMModes?.some(mode => mode?.transportModeId === newMode?.transportModeId)
    ));
  }

  updateCommodity() {
    const newModes = this.selectedCommodity.map(item => {
      return {
        joCommodityId: 0,
        jobOrderId: this.JobOrderId || 0,
        commodityId: item,
        createdBy: parseInt(this.userId$),
        createdDate: new Date(),
        updatedBy: parseInt(this.userId$),
        updatedDate: new Date(),
      };
    });

    // Add new modes to JOTMModes or update existing ones
    this.JOCommodity = this.JOCommodity?.filter(mode =>
      this.selectedCommodity?.includes(mode.commodityId)
    );

    this.JOCommodity?.push(...newModes.filter(newMode =>
      !this.JOCommodity?.some(mode => mode.commodityId === newMode.commodityId)
    ));
  }

  getcityList(Id: any) {
    this.commonService.getAllCitiesbyCountry(Id).subscribe(res => {
      this.OriginLocationList = res;
      this.matFilters();
    });
  }

  getDestcityList(Id: any) {
    this.commonService.getAllCitiesbyCountry(Id).subscribe(res => {
      this.DestinationLocationList = res;
      this.matFilters();
    });
  }




  getAllSeaportList() {
    this.commonService.GetAllSeaportByCountryId(this.originCountryID).subscribe(res => {
      this.PortofLoadingList = [];
      let seaportListOrigin = res;
      seaportListOrigin?.forEach((ele: any) => {
        let portofLoadingItem = {
          loadingPortId: ele.seaportId,
          loadingPortName: ele.seaportName
        };
        this.PortofLoadingList.push(portofLoadingItem);
      })

      let selectedLoadingValue = this.PortofLoadingList.find(option => option?.loadingPortId == this.JobOrderGeneral?.loadingPortId)
      if (selectedLoadingValue?.loadingPortName != null && selectedLoadingValue?.loadingPortName != '' && selectedLoadingValue?.loadingPortName != undefined) {
        this.ServiceDetailForm.get('portofLoadingControl')?.patchValue(selectedLoadingValue?.loadingPortName)
      }
      this.matFilters();
    });
    this.commonService.GetAllSeaportByCountryId(this.destinationCountryID).subscribe(res => {
      this.PortofDestinationList = [];
      let seaportList = res;
      seaportList?.forEach((ele: any) => {
        let portofDestItem = {
          destinationPortId: ele.seaportId,
          destinationPortIdName: ele.seaportName
        };
        this.PortofDestinationList.push(portofDestItem);
      })
      let selectedDestValue = this.PortofDestinationList.find(option => option?.destinationPortId == this.JobOrderGeneral?.destinationPortId)
      if (selectedDestValue?.destinationPortIdName != null && selectedDestValue?.destinationPortIdName != '' && selectedDestValue?.destinationPortIdName != undefined) {
        this.ServiceDetailForm.get('portofDestinationControl')?.patchValue(selectedDestValue?.destinationPortIdName)
      }
      this.matFilters();
    });
  }

  getAllAirportList() {
    if (this.originCountryID != null) {
      this.commonService.GetAllAirportByCountryId(this.originCountryID).subscribe(res => {
        this.PortofLoadingList = [];
        let airportListOrigin = res;
        airportListOrigin?.forEach((ele: any) => {
          let portofLoadingItem = {
            loadingPortId: ele.airportId,
            loadingPortName: ele.airportName
          };
          this.PortofLoadingList.push(portofLoadingItem);
          this.matFilters();
        })
        debugger
        let selectedLoadingValue = this.PortofLoadingList.find(option => option?.loadingPortId == this.JobOrderGeneral?.loadingPortId)
        this.ServiceDetailForm.get('portofLoadingControl')?.patchValue(selectedLoadingValue?.loadingPortName)
        this.matFilters();
      });
    }
    if (this.destinationCountryID != null) {
      this.commonService.GetAllAirportByCountryId(this.destinationCountryID).subscribe(res => {
        this.PortofDestinationList = [];
        let airportListDest = res;
        airportListDest?.forEach((ele: any) => {
          let portofDestItem = {
            destinationPortId: ele.airportId,
            destinationPortIdName: ele.airportName
          };
          this.PortofDestinationList.push(portofDestItem);
          this.matFilters();
        })
        let selectedDestValue = this.PortofDestinationList.find(option => option?.destinationPortId == this.JobOrderGeneral?.destinationPortId)
        this.ServiceDetailForm.get('portofDestinationControl')?.patchValue(selectedDestValue?.destinationPortIdName)
        this.matFilters();
      });
    }
  }

  OnBillingchangeEvent(event: any) {
    let value = event?.option?.value;
    this.getExchange();
    this.matFilters();
  }


  OnCustomerChangeEvent(event: any) {

    //Reset fields
    this.JobOrderGeneralForm.controls.jobOrderAgainstControl.reset();
    this.JobOrderGeneralForm.controls.baseReferenceNoControl.reset();
    this.JobOrderGeneralForm.controls.referenceNumber1Control.reset();
    this.JobOrderGeneralForm.controls.referenceNumber2Control.reset();
    this.JobOrderGeneralForm.controls.customerAddressControl.reset();
    this.JobOrderGeneralForm.controls.contactPersonControl.reset();
    this.JobOrderGeneralForm.controls.customerBillingCurrencyControl.reset();
    this.JobOrderGeneralForm.controls.exchangeRateControl.reset();
    this.JobOrderGeneralForm.controls.jobCategoryControl.reset();
    this.JobOrderGeneralForm.controls.jobTypeControl.reset();
    this.JobOrderGeneralForm.controls.modeofTransportControl.reset();
    //this.JobOrderGeneralForm.controls.jobCategoryControl.reset();
    this.BaseReferenceNoList = [];


    let value = event?.option?.value ? event?.option?.value : event?.customerName;
    let id = this.CustomerList.find(option => option.customerName === value);
    if (id) {
      this.customerService.CustomerIdByAddress(id?.customerId).subscribe((res: any) => {
        this.CustomerAddressList = res;
        let primaryAddress = this.CustomerAddressList.find(option => option?.primaryAddress === true)
        this.JobOrderGeneralForm.get('customerAddressControl')?.patchValue(primaryAddress?.addressName);
        this.matFilters();
      });

      this.customerService.CustomerIdByContact(id?.customerId).subscribe((res: any) => {
        this.ContactPersonList = res;
        let primaryContact = this.ContactPersonList.find(option => option?.primaryContact === true)
        this.JobOrderGeneralForm.get('contactPersonControl')?.patchValue(primaryContact?.contactPerson);
        this.matFilters();
      })

      this.customerService.getAllCustomerById(id?.customerId).subscribe((res: any) => {
        console.log(res);
        this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.patchValue(res?.customer?.currencyName);
        this.JobOrderGeneralForm.get('exchangeRateControl')?.reset();
        this.getExchange();
        this.JobOrderGeneralForm.get('salesOwnerControl')?.patchValue(res?.customer?.salesOwnerName);
        this.JobOrderGeneralForm.get('salesExecutiveControl')?.patchValue(res?.customer?.salesExecutiveName);

        if (res?.customer?.billingCurrency === "All Currency") {
          this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.enable();
        } else if (res?.customer?.billingCurrency === "Party Currency") {
          this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.disable();
        }
      })
    }


    this.matFilters();
  }

  //
  currencyId: any;
  exchangeValue: any;
  exchangerate: any;
  getExchange() {
    //if(this.currencyId){
    this.currencyId = this.getJOCustomerBillId(this.JobOrderGeneralForm.controls.customerBillingCurrencyControl.value) || 0
    //}
    this.commonService.GetExchangeById(this.currencyId).subscribe(res => {
      this.exchangeValue = res;
      this.exchangerate = this.exchangeValue.exchangerate;
      this.JobOrderGeneralForm.get('exchangeRateControl')?.patchValue(this.exchangeValue.exchangerate);
    })
  }

  OnQuatationChangeEvent(event: any) {
    let value = event?.option?.value ? event?.option?.value : event?.customerName;
    let id = this.CustomerList.find(option => option.customerName === value);
    if (id) {
      this.customerService.CustomerIdByAddress(id?.customerId).subscribe((res: any) => {
        this.CustomerAddressList = res;
        let primaryAddress = this.CustomerAddressList.find(option => option?.primaryAddress === true)
        this.JobOrderGeneralForm.get('customerAddressControl')?.patchValue(primaryAddress?.addressName);
        this.matFilters();
      });

      this.customerService.CustomerIdByContact(id?.customerId).subscribe((res: any) => {
        this.ContactPersonList = res;
        let primaryContact = this.ContactPersonList.find(option => option?.primaryContact === true)
        this.JobOrderGeneralForm.get('contactPersonControl')?.patchValue(primaryContact?.contactPerson);
        this.matFilters();
      })

      this.customerService.getAllCustomerById(id?.customerId).subscribe((res: any) => {
        console.log(res);

      })
    }

    this.Qs.GetAllQuotationById(event?.quotationId).subscribe((res: any) => {
      console.log("resuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", res)
      if (res) {
        //this.JobOrderGeneralForm.get('customerNameControl')?.patchValue(res?.quotation?.customerName);
        this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.patchValue(res?.quotation?.currencyName);
        this.JobOrderGeneralForm.get('exchangeRateControl')?.reset();
        this.getExchange();
        if (res?.quotation?.salesOwnerId) {
          let salesOwner = this.SalesOwnerList.find(option => option?.employeeId === res?.quotation?.salesOwnerId)
          this.JobOrderGeneralForm.get('salesOwnerControl')?.patchValue(salesOwner?.employeeName);

        }
        this.JobOrderGeneralForm.get('salesExecutiveControl')?.patchValue(res?.quotation?.salesExecutiveName);
        this.JobOrderGeneralForm.get('jobCategoryControl')?.patchValue(res?.quotation?.jobCategory);
        this.OnJobTypeEvent(''); (res?.quotation?.jobCategoryId);
        this.JobOrderGeneralForm.get('jobTypeControl')?.patchValue(res?.quotation?.jobTypeName);
        this.ServiceDetailForm.get('cargoTypeControl')?.patchValue(res?.quotation?.cargoType);

        //this.JobOrderGeneralForm.get('customerNameControl')?.disable();
        this.JobOrderGeneralForm.get('customerBillingCurrencyControl')?.disable();
        this.JobOrderGeneralForm.get('jobCategoryControl')?.patchValue(res?.quotation?.jobCategory);
        this.JobOrderGeneralForm.get('jobTypeControl')?.patchValue(res?.quotation?.jobTypeName);
        this.selectedjobcatname = res?.quotation?.jobTypeName;
        this.getJobTypeList(res?.quotation?.jobCategoryId);
        debugger;

        this.ServiceDetailForm.get('cargoTypeControl')?.patchValue(res?.quotation?.cargoType);
        //this.ServiceDetailForm.get('incoTermControl')?.patchValue(res?.quotation?.incoTermCode);
        this.numberOfPackegesControl.patchValue(res?.quotation?.packageNos);
        debugger
        if (res?.quotationIncoTerms?.length != 0) {
          let incoId = res?.quotationIncoTerms?.[0].incoTermId;
          let Inco = this.IncoTermList.find(option => option?.incoTermId === incoId)
          if (Inco) {
            this.ServiceDetailForm.controls.incoTermControl.patchValue(Inco?.incoTermCode)
          }
        }


        //service tab


        this.ServiceDetailForm.controls.pickUpLocationControl.patchValue(res?.quotation?.pickUpLocation);
        this.ServiceDetailForm.controls.finalPlaceofDeliveryControl.patchValue(res?.quotation?.deliveryPlace);
        this.ServiceDetailForm.controls.transitTimeControl.patchValue(res?.quotation?.transitTime);
        this.ServiceDetailForm.controls.tempratureRequiredControl.patchValue(res?.quotation?.temperatureReq);
        this.ServiceDetailForm.controls.routingControl.patchValue(res?.quotation?.routing);
        
        //TM Mode
        if (res?.quotationTransportMode != '') {
          const modeofTransportString = res?.quotationTransportMode;
          const transportModeIds = modeofTransportString?.map((data: any) => data.transportModeId);
          this.JobOrderGeneralForm.get('modeofTransportControl')?.patchValue(transportModeIds);
        }

        //Commodity
        if (res?.quotationCommodities != '') {
          const quotationCommodities = res?.quotationCommodities;
          const commodityIds = quotationCommodities?.map((data: any) => data.commodityId);
          this.ServiceDetailForm.get('commodityControl')?.patchValue(commodityIds);
        }
        //Origin
        if (res?.quotation?.originCountryId) {
          let originCountry = this.OriginCountryList.find(option => option?.countryId === res?.quotation?.originCountryId);
          if (originCountry) {
            this.ServiceDetailForm.get('originCountryControl')?.patchValue(originCountry?.countryName);
            this.OnOriginCountryEvent(originCountry?.countryName);
          }
        }
        //Destination
        if (res?.quotation?.destCountryId) {
          let desCountry = this.OriginCountryList.find(option => option?.countryId === res?.quotation?.destCountryId);
          if (desCountry) {
            this.ServiceDetailForm.get('destinationCountryControl')?.patchValue(desCountry?.countryName);
            this.OnDestinationCountryEvent(desCountry?.countryName);
          }
        }


        setTimeout(() => {
          if (res?.quotation?.loadingPortId) {
            let loadinPort = this.PortofLoadingList.find(option => option?.loadingPortId === res?.quotation?.loadingPortId);
            if (loadinPort) {
              this.ServiceDetailForm.get('portofLoadingControl')?.patchValue(loadinPort?.loadingPortName);
              this.OnLoadingPortEvent(loadinPort?.loadingPortName);
            }
          }

          if (res?.quotation?.destinationPortId) {
            let destPort = this.PortofDestinationList.find(option => option?.destinationPortId === res?.quotation?.destinationPortId);
            if (destPort) {
              this.ServiceDetailForm.get('portofDestinationControl')?.patchValue(destPort?.destinationPortIdName);
              this.OnDestinationPortEvent(destPort?.destinationPortIdName);
            }
          }

          if(res?.quotation?.originLocationId){
            let selectedOrigin = this.OriginLocationList?.find(option => option?.cityId == res?.quotation?.originLocationId)
            if(selectedOrigin){
              this.ServiceDetailForm.controls.originLocationControl.patchValue(selectedOrigin?.cityName);
            }
          }
  
          if(res?.quotation?.destLocationId){
            let selecteddest = this.DestinationLocationList?.find(option => option?.cityId == res?.quotation?.destLocationId)
            if(selecteddest){
              this.ServiceDetailForm.controls.destinationLocationControl.patchValue(selecteddest?.cityName);
            }
          }
        }, 1000)


        this.PackageDetailsGrid = [];
        res?.quotationPackages.map((enqPackage: { packageTypeId: any; commodityId: any; height: any; length: any; breadth: any; cbm: any; packWeightKg: any; chargePackWtKg: any; createdBy: any; createdDate: any; updatedBy: any; updatedDate: any; packageTypeName: any; commodityName: any; }) => {
          let Package = {
            joPackageId: 0,
            jobOrderId: 0,
            packageTypeId: enqPackage.packageTypeId,
            commodityId: enqPackage.commodityId,
            height: enqPackage.height,
            length: enqPackage.length,
            breadth: enqPackage.breadth,
            cbm: enqPackage.cbm,
            packWeightKg: enqPackage.packWeightKg,
            chargePackWtKg: enqPackage.chargePackWtKg,
            createdBy: enqPackage.createdBy,
            createdDate: enqPackage.createdDate,
            updatedBy: enqPackage.updatedBy,
            updatedDate: enqPackage.updatedDate,
            packageTypeName: enqPackage.packageTypeName,
            commodityName: enqPackage.commodityName
          }
          this.PackageDetailsGrid.push(Package);

          console.log("QPackage", this.PackageDetailsGrid)
        });

        //Line Item tab
        this.QuotationLineItems = res?.quotationLineItems;
        if (res?.quotationLineItems.length > 0) {
          debugger;
          const newLineItems = res?.quotationLineItems?.map((item: any) => ({
            lineItemCategoryId: item?.lineItemCategoryId,
            lineItemId: item.lineItemId,
            lineItemCode: item.lineItemCode,
            lineItemName: item.lineItemName,
            serviceInId: item?.serviceInId,
            lineItemCategoryName: item.lineItemCategoryName,
            sourceFrom: item.sourceFrom,
            countryName: item.countryName,
            refNumber: item.refNumber,
            vendorName: item.vendorName,
            vendorId: item.vendorId,
            sourceFromId: item.sourceFromId,
            refNumberId: item.refNumberId,
            isVendor: item.isVendor,
            regionId: this.regionId,
            regionName: this.regionName,
            createdBy: parseInt(this.userId$),
            updatedBy: parseInt(this.userId$),
            rowNumber: this.generateRandomId(5),
          }));

          //this.LineItemDetailsGrid.push(newLineItems);


          if (this.previousLineItems.length > 0) {
            for (const index of this.previousLineItems.reverse()) {
              this.LineItemDetailsGrid.splice(index, 1);
            }
          }

          this.previousLineItems = [];
          const startIndex = this.LineItemDetailsGrid.length;
          for (let i = 0; i < newLineItems.length; i++) {
            this.previousLineItems.push(startIndex + i);
          }
          this.LineItemDetailsGrid = [...this.LineItemDetailsGrid, ...newLineItems];
        }


        if (res?.quotation.jobTypeId) {
          this.jobtypeService.getAllJopTypeById(res?.quotation.jobTypeId).subscribe((res: any) => {
            debugger;
            console.log("resjobtype", res);
            this.selectedJobType = res.jobTypeGeneral.partDetails;
            this.selectedPackageType = res.jobTypeGeneral.packageDetails;

            if (res?.jobTypeStatuses?.length != 0) {
              this.joStageandStatus = res?.jobTypeStatuses;
              this.joStageandStatusnew = res?.jobTypeStatuses.sort((a: any, b: any) => {
                return a.preferenceOrder - b.preferenceOrder;
              });
              var jobstatus = this.joStageandStatus.find(id => id.jobStage == this.joStageandStatusnew[0].jobStage);
              this.JobOrderGeneralForm.get('jobOrderStageControl')?.patchValue(jobstatus?.jobStage);
              this.jobstage = jobstatus?.jobStage
              var status = this.JobOrderStatusList.find(id => id.jobStageStatusId == jobstatus.statusId);
              console.log("568045754", status);
              this.jobstatus = status?.jobStageStatus;
              this.JobOrderGeneralForm.get('jobOrderStatusControl')?.patchValue(status?.jobStageStatus);
              this.matFilters();
            }
            //Patch TM Mode
            if (res?.jobTypeGeneral?.modeofTransport != '') {

              const modeofTransportString = res?.jobTypeGeneral?.modeofTransport;
              const modeofTransportArray = modeofTransportString?.split(',').map((mode: string) => mode.trim());

              // Find the IDs for the transport modes
              const modeofTransportIds: any = this.ModeOfTransportList
                .filter(m => modeofTransportArray.includes(m.modeofTransport))
                .map(m => m.modeofTransportId);

              // Patch the form control with the IDs
              this.JobOrderGeneralForm.get('modeofTransportControl')?.patchValue(modeofTransportIds);
            }

            //patch Inco Term
            if (res?.jobTypeGeneral?.incoTermCode) {
              this.ServiceDetailForm.controls.incoTermControl.patchValue(res?.jobTypeGeneral?.incoTermCode);
            }

            //Line Item tab
            if (this.QuotationLineItems.length < 0) {
              const newLineItems = res?.jobTypeLineItems?.map((item: any) => ({
                lineItemCode: item.lineItemCode,
                lineItemName: item.lineItemName,
                lineItemCategoryName: item.lineItemCategoryName,
                rowNumber: this.generateRandomId(5),
              }));

              if (this.previousLineItems.length > 0) {
                for (const index of this.previousLineItems.reverse()) {
                  this.LineItemDetailsGrid.splice(index, 1);
                }
              }

              this.previousLineItems = [];
              const startIndex = this.LineItemDetailsGrid.length;
              for (let i = 0; i < newLineItems.length; i++) {
                this.previousLineItems.push(startIndex + i);
              }
              this.LineItemDetailsGrid = [...this.LineItemDetailsGrid, ...newLineItems];

            }



            //Document Tab
            const newDocItems = res?.jobTypeDocuments?.map((item: any) => ({
              documentId: item.documentId,
              documentTypeName: item.documentName,
              mandatory: item.mandatory,
              remarks: item.remarks,
              rowNumber: this.generateRandomId(5),
            }));

            const uniqueNewDocItems = newDocItems.filter((newDocItem: { documentTypeName: any; }) => {
              return !this.attchmentList.some(existingItem => existingItem.documentTypeName === newDocItem.documentTypeName);
            });

            if (this.previousDoc.length > 0) {
              for (const index of this.previousDoc.reverse()) {
                this.attchmentList.splice(index, 1);
              }
            }
            this.previousDoc = [];
            const startDocIndex = this.attchmentList.length;
            for (let i = 0; i < uniqueNewDocItems.length; i++) {
              this.previousDoc.push(startDocIndex + i);
            }
            this.attchmentList = [...this.attchmentList, ...uniqueNewDocItems];
          });
        }

        //Document Tab
        if (res?.quotationDocuments) {
          const newDocItems = res?.quotationDocuments?.map((item: any) => ({
            documentId: item.documentId,
            documentTypeName: item.documentName,
            mandatory: item.mandatory,
            remarks: item.remarks,
            rowNumber: this.generateRandomId(5),
          }));

          const uniqueNewDocItems = newDocItems.filter((newDocItem: { documentTypeName: any; }) => {
            return !this.attchmentList.some(existingItem => existingItem.documentTypeName === newDocItem.documentTypeName);
          });

          if (this.previousDoc.length > 0) {
            for (const index of this.previousDoc.reverse()) {
              this.attchmentList.splice(index, 1);
            }
          }
          this.previousDoc = [];
          const startDocIndex = this.attchmentList.length;
          for (let i = 0; i < uniqueNewDocItems.length; i++) {
            this.previousDoc.push(startDocIndex + i);
          }
          this.attchmentList = [...this.attchmentList, ...uniqueNewDocItems];
        }

      }
    })
    this.matFilters();
  }



  OnStatusChangeEvent(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;
    this.orderstatus = value;
    this.JobOrderGeneralForm.controls.jobClosingDateControl.disable();
    this.JobOrderGeneralForm.controls.cancelReasonControl.disable();
    this.JobOrderGeneralForm.controls.cancelRemarkControl.disable();
    this.JobOrderGeneralForm.controls.jobClosingDateControl.reset();
    this.JobOrderGeneralForm.controls.cancelReasonControl.reset();
    this.JobOrderGeneralForm.controls.cancelRemarkControl.reset();
    this.JobOrderGeneralForm.controls.jobClosingDateControl.clearValidators();
    this.JobOrderGeneralForm.controls.cancelReasonControl.clearValidators();
    if (value === 'Close') {
      this.JobOrderGeneralForm.controls.jobClosingDateControl.enable();
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      this.JobOrderGeneralForm.patchValue({
        jobClosingDateControl: formattedDate
      });
      this.JobOrderGeneralForm.controls.jobClosingDateControl.setValidators([Validators.required]);
    } else if (value === 'Cancel') {
      this.JobOrderGeneralForm.controls.cancelReasonControl.enable();
      this.JobOrderGeneralForm.controls.cancelRemarkControl.enable();
      this.JobOrderGeneralForm.controls.cancelReasonControl.setValidators([Validators.required, this.CancelReasonValidator.bind(this)]);
      this.JobOrderGeneralForm.controls.cancelRemarkControl.setValidators([Validators.required]);
    }
    this.JobOrderGeneralForm.controls.jobClosingDateControl.updateValueAndValidity();
    this.JobOrderGeneralForm.controls.cancelReasonControl.updateValueAndValidity();
    this.JobOrderGeneralForm.controls.cancelRemarkControl.updateValueAndValidity();
    this.JobOrderGeneralForm.controls.cancelRemarkControl.updateValueAndValidity();

    this.matFilters();
  }

  statusDisableOption(option: any) {
    return option.jobStageStatus !== 'Cancel' && option.jobStageStatus !== 'Close';
  }


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

  getjobCategoryList() {
    this.jobtypeService.GetAllJobCategory().subscribe(res => {
      this.JobCategoryList = res;
      this.matFilters();
    });
  }

  getJobTypeList(id: number) {
    this.JobTypeList = [];
    this.jobtypeService.getJobTypesByJobCatId(id).subscribe(res => {
      if (res) {
        debugger;
        this.JobTypeList = res;
        if (this.selectedjobcatname != undefined || null) {
          let selectedValue = this.JobTypeList.find(option => option?.jobTypeName === this.selectedjobcatname);

          this.jobtypeService.getAllJopTypeById(selectedValue?.jobTypeId).subscribe((res: any) => {

            console.log("resjobtype", res);
            this.selectedJobType = res.jobTypeGeneral.partDetails;
            this.selectedPackageType = res.jobTypeGeneral.packageDetails;

            if (res?.jobTypeStatuses?.length != 0) {
              this.joStageandStatus = res?.jobTypeStatuses;
              this.matFilters();
            }
          });
        }

        this.matFilters();
      } else {
        this.JobTypeList = [];
      }
    });
  }

  getbillingCurrencyList() {
    this.regionService.GetAllCurrency(this.liveStatus).subscribe((result: any) => {
      this.CustomerBillingCurrencyList = result;
      this.matFilters();
    });
  }

  getTransportList() {
    this.commonService.getAllModeofTransport().subscribe(res => {
      this.ModeOfTransportList = res;
      this.matFilters();
    });
  }

  getEmployeeList() {
    this.commonService.getEmployees(this.liveStatus).subscribe(result => {
      this.SalesOwnerList = result;
      this.SalesExecutiveList = result;
      this.JobOwnerList = result;
      this.matFilters();
    })
  }
  GetAllJOAgainst() {
    this.regionService.GetAllJOAgainst().subscribe((result: any) => {
      this.JobOrderAgainstList = result;
      this.matFilters();
    })
  }

  getCountryMaster() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.OriginCountryList = result;
      this.DestinationCountryList = result;
      this.matFilters();
    });
  }

  getAllStatusType() {
    this.jobtypeService.getAllStatusType().subscribe(result => {
      this.JobOrderStatusList = result;
      console.log(' this.JobOrderStatusList', this.JobOrderStatusList);

      this.matFilters();
    });
  }
  GetAllJobStage() {
    this.jobtypeService.GetAllJobStage().subscribe((result: any) => {
      this.JobOrderStageList = result;
      console.log('JobOrderStageList', this.JobOrderStageList);
      this.matFilters();
    });
  }

  getReasons() {
    this.reasonmstSvc.getAllReason(1).subscribe((result) => {
      this.CancelReasonList = result;
      this.matFilters();
    });
  }
  getAllCargos() {
    this.commonService.getAllCargo().subscribe((result) => {
      this.CargoTypeList = result;
      this.matFilters();
    });
  }

  getCommodityList() {
    this.commodityService.getAllActiveCommodity().subscribe(result => {
      this.CommodityList = result;
    });
  }
  getIncotermList() {
    this.incoTermService.getIncoterms(this.liveStatus).subscribe((res: any) => {
      this.IncoTermList = res;
      this.matFilters();
    });
  }

  getAllRegion() {
    this.regionService.getRegions().subscribe(data => {
      this.regionList = data;
      this.matFilters();
    });
  }

  //Service tab grids
  //Air
  AddAirTransport() {
    this.airTransportDailog = this.dialog.open(AirTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        jobOrderId: this.JobOrderId,
        selectedCategory: 0,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        rowNumber: this.generateRandomId(5),
        overAllList: this.AirTransportGrid,
        stage: this.jobstage,
        status: this.jobstatus
      },
    });
    this.airTransportDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.AirTransportGrid = [...this.AirTransportGrid, result];
      }
    });
  }
  EditAirTransport(dataItem: any, index: any) {
    let selectedCategory = this.AirTransportGrid[index];
    this.airTransportDailog = this.dialog.open(AirTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        jobOrderId: this.JobOrderId,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        rowNumber: this.generateRandomId(5),
        overAllList: this.AirTransportGrid,
        view: false,
        stage: this.jobstage,
        status: this.jobstatus
      },
    });
    this.airTransportDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.AirTransportGrid.findIndex(item => item.rowNumber === result.rowNumber);
        if (index !== -1) {
          this.AirTransportGrid[index] = result;
          this.AirTransportGrid = [...this.AirTransportGrid]
        } else {
          this.AirTransportGrid = [...this.AirTransportGrid, result];
        }
      }
    });
  }
  viewAirTransport(dataItem: any, index: any) {
    let selectedCategory = this.AirTransportGrid[index];
    this.airTransportDailog = this.dialog.open(AirTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        jobOrderId: this.JobOrderId,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        view: true
      },
    });
  }
  DeleteAirTransport(id: any, index: any) {
    this.AirTransportGrid = this.AirTransportGrid.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }
  AirStatusDailog: any;
  viewAirHistoryStatus(dataItem: JOAirModeModal) {
    debugger
    if (dataItem?.joAirModeId != 0) {
      this.regionService.GetAirStatusById(dataItem?.joAirModeId).subscribe((res: any) => {
        this.AirStatusList = res;
        if (this.AirStatusList?.length != 0) {
          if (dataItem.joAirStatusHistoryModal == null) {
            this.AirStatusDailog = this.dialog.open(AirStatusComponent, {
              autoFocus: false,
              disableClose: true,
              data: {
                list: this.AirStatusList,
                jobOrderId: dataItem?.jobOrderId,
                createdBy: parseInt(this.userId$),
                joStageandStatus: this.joStageandStatus
              }
            });
            this.AirStatusDailog.afterClosed().subscribe((result: any) => {
              if (result) {
                this.AirStatusList = result;

                const airStatusWithHighestPreference = this.AirStatusList.reduce((prev: any, current: any) => {
                  return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
                });

                console.log(airStatusWithHighestPreference);
                dataItem.stageId = airStatusWithHighestPreference?.stageId;
                dataItem.statusId = airStatusWithHighestPreference?.statusId;
                dataItem.jobStage = airStatusWithHighestPreference?.jobStage;
                dataItem.jobStageStatus = airStatusWithHighestPreference?.jobStageStatus;
                dataItem.preferenceOrder = airStatusWithHighestPreference?.preferenceOrder;

                dataItem.joAirStatusHistoryModal = this.AirStatusList;
                this.AirTransportGrid = [...this.AirTransportGrid]
              }
            });
          } else {
            this.AirStatusDailog = this.dialog.open(AirStatusComponent, {
              autoFocus: false,
              disableClose: true,
              data: {
                list: dataItem.joAirStatusHistoryModal,
                jobOrderId: dataItem?.jobOrderId,
                createdBy: parseInt(this.userId$),
                joStageandStatus: this.joStageandStatus,
              }
            });
            this.AirStatusDailog.afterClosed().subscribe((result: any) => {
              if (result) {
                this.AirStatusList = result;

                const airStatusWithHighestPreference = this.AirStatusList.reduce((prev: any, current: any) => {
                  return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
                });

                console.log(airStatusWithHighestPreference);
                dataItem.stageId = airStatusWithHighestPreference?.stageId;
                dataItem.statusId = airStatusWithHighestPreference?.statusId;
                dataItem.jobStage = airStatusWithHighestPreference?.jobStage;
                dataItem.jobStageStatus = airStatusWithHighestPreference?.jobStageStatus;
                dataItem.preferenceOrder = airStatusWithHighestPreference?.preferenceOrder;

                dataItem.joAirStatusHistoryModal = this.AirStatusList;
                this.AirTransportGrid = [...this.AirTransportGrid]


              }
            });
          }
        } else {
          this.AirStatusDailog = this.dialog.open(AirStatusComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
              list: dataItem.joAirStatusHistoryModal,
              jobOrderId: dataItem?.jobOrderId,
              createdBy: parseInt(this.userId$),
              joStageandStatus: this.joStageandStatus,
            }
          });
          this.AirStatusDailog.afterClosed().subscribe((result: any) => {
            if (result) {
              this.AirStatusList = result;

              const airStatusWithHighestPreference = this.AirStatusList.reduce((prev: any, current: any) => {
                return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
              });

              console.log(airStatusWithHighestPreference);
              dataItem.stageId = airStatusWithHighestPreference?.stageId;
              dataItem.statusId = airStatusWithHighestPreference?.statusId;
              dataItem.jobStage = airStatusWithHighestPreference?.jobStage;
              dataItem.jobStageStatus = airStatusWithHighestPreference?.jobStageStatus;
              dataItem.preferenceOrder = airStatusWithHighestPreference?.preferenceOrder;

              dataItem.joAirStatusHistoryModal = this.AirStatusList;
              this.AirTransportGrid = [...this.AirTransportGrid]

            }
          });
        }
      })
    } else {
      this.AirStatusDailog = this.dialog.open(AirStatusComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          list: dataItem.joAirStatusHistoryModal,
          jobOrderId: dataItem?.jobOrderId,
          createdBy: parseInt(this.userId$),
          joStageandStatus: this.joStageandStatus,
        }
      });
      this.AirStatusDailog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.AirStatusList = result;

          const airStatusWithHighestPreference = this.AirStatusList.reduce((prev: any, current: any) => {
            return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
          });

          console.log(airStatusWithHighestPreference);
          dataItem.stageId = airStatusWithHighestPreference?.stageId;
          dataItem.statusId = airStatusWithHighestPreference?.statusId;
          dataItem.jobStage = airStatusWithHighestPreference?.jobStage;
          dataItem.jobStageStatus = airStatusWithHighestPreference?.jobStageStatus;
          dataItem.preferenceOrder = airStatusWithHighestPreference?.preferenceOrder;
          dataItem.joAirStatusHistoryModal = this.AirStatusList;
          this.AirTransportGrid = [...this.AirTransportGrid]


        }
      });
    }
  }






  //Sea Transport
  AddSeaTransport() {
    this.seaTransportDailog = this.dialog.open(SeaTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        vendorId: 0,
        selectedCategory: 0,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        rowNumber: this.generateRandomId(5),
        overAllList: this.SeaTransportGrid,
        stage: this.jobstage,
        status: this.jobstatus
      },
    });
    this.seaTransportDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.SeaTransportGrid = [...this.SeaTransportGrid, result];
      }
    });
  }
  EditSeaTransport(dataItem: any, index: any) {
    let selectedCategory: any[] = this.SeaTransportGrid[index];
    this.seaTransportDailog = this.dialog.open(SeaTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        vendorId: 0,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        view: false,
        rowNumber: this.generateRandomId(5),
        overAllList: this.SeaTransportGrid,
        stage: this.jobstage,
        status: this.jobstatus
      },
    });
    this.seaTransportDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.SeaTransportGrid.findIndex(item => item.rowNumber === result.rowNumber);
        if (index !== -1) {
          this.SeaTransportGrid[index] = result;
          this.SeaTransportGrid = [...this.SeaTransportGrid]
        } else {
          this.SeaTransportGrid = [...this.SeaTransportGrid, result];
        }
      }
    });
  }

  viewSeaTransport(dataItem: any, index: any) {
    let selectedCategory: any[] = this.SeaTransportGrid[index];
    this.seaTransportDailog = this.dialog.open(SeaTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        vendorId: 0,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        view: true
      },
    });
  }
  DeleteSeaTransport(id: any, index: any) {
    this.SeaTransportGrid = this.SeaTransportGrid.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }
  SeaStatusDailog: any;
  viewSeaHistoryStatus(dataItem: JOSeaModeModal) {
    if (dataItem?.joSeaModeId != 0) {
      this.regionService.GetSeaStatusById(dataItem?.joSeaModeId).subscribe((res: any) => {
        this.SeaStatusList = res;
        if (this.SeaStatusList?.length != 0) {
          if (dataItem.joSeaStatusHistoryModal == null) {
            this.SeaStatusDailog = this.dialog.open(SeaStatusComponent, {
              autoFocus: false,
              disableClose: true,
              data: {
                list: this.SeaStatusList,
                jobOrderId: dataItem?.jobOrderId,
                createdBy: parseInt(this.userId$),
                joStageandStatus: this.joStageandStatus
              }
            });
            this.SeaStatusDailog.afterClosed().subscribe((result: any) => {
              if (result) {
                this.SeaStatusList = result;

                const seaStatusWithHighestPreference = this.SeaStatusList.reduce((prev: any, current: any) => {
                  return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
                });

                console.log(seaStatusWithHighestPreference);
                dataItem.stageId = seaStatusWithHighestPreference?.stageId;
                dataItem.statusId = seaStatusWithHighestPreference?.statusId;
                dataItem.jobStage = seaStatusWithHighestPreference?.jobStage;
                dataItem.jobStageStatus = seaStatusWithHighestPreference?.jobStageStatus;
                dataItem.preferenceOrder = seaStatusWithHighestPreference?.preferenceOrder;



                dataItem.joSeaStatusHistoryModal = this.SeaStatusList;
                this.SeaTransportGrid = [...this.SeaTransportGrid]
              }
            });
          } else {
            this.SeaStatusDailog = this.dialog.open(SeaStatusComponent, {
              autoFocus: false,
              disableClose: true,
              data: {
                list: dataItem.joSeaStatusHistoryModal,
                jobOrderId: dataItem?.jobOrderId,
                createdBy: parseInt(this.userId$),
                joStageandStatus: this.joStageandStatus
              }
            });
            this.SeaStatusDailog.afterClosed().subscribe((result: any) => {
              if (result) {
                this.SeaStatusList = result;

                const seaStatusWithHighestPreference = this.SeaStatusList.reduce((prev: any, current: any) => {
                  return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
                });

                console.log(seaStatusWithHighestPreference);
                dataItem.stageId = seaStatusWithHighestPreference?.stageId;
                dataItem.statusId = seaStatusWithHighestPreference?.statusId;
                dataItem.jobStage = seaStatusWithHighestPreference?.jobStage;
                dataItem.jobStageStatus = seaStatusWithHighestPreference?.jobStageStatus;
                dataItem.preferenceOrder = seaStatusWithHighestPreference?.preferenceOrder;

                dataItem.joSeaStatusHistoryModal = this.SeaStatusList;
                this.SeaTransportGrid = [...this.SeaTransportGrid]
              }
            });
          }

        } else {
          this.SeaStatusDailog = this.dialog.open(SeaStatusComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
              list: dataItem.joSeaStatusHistoryModal,
              jobOrderId: dataItem?.jobOrderId,
              createdBy: parseInt(this.userId$),
              joStageandStatus: this.joStageandStatus
            }
          });
          this.SeaStatusDailog.afterClosed().subscribe((result: any) => {
            if (result) {
              this.SeaStatusList = result;

              const seaStatusWithHighestPreference = this.SeaStatusList.reduce((prev: any, current: any) => {
                return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
              });

              console.log(seaStatusWithHighestPreference);
              dataItem.stageId = seaStatusWithHighestPreference?.stageId;
              dataItem.statusId = seaStatusWithHighestPreference?.statusId;
              dataItem.jobStage = seaStatusWithHighestPreference?.jobStage;
              dataItem.jobStageStatus = seaStatusWithHighestPreference?.jobStageStatus;
              dataItem.preferenceOrder = seaStatusWithHighestPreference?.preferenceOrder;

              dataItem.joSeaStatusHistoryModal = this.SeaStatusList;
              this.SeaTransportGrid = [...this.SeaTransportGrid]
            }
          });
        }
      })
    } else {
      this.SeaStatusDailog = this.dialog.open(SeaStatusComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          list: dataItem.joSeaStatusHistoryModal,
          jobOrderId: dataItem?.jobOrderId,
          createdBy: parseInt(this.userId$),
          joStageandStatus: this.joStageandStatus
        }
      });
      this.SeaStatusDailog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.SeaStatusList = result;

          const seaStatusWithHighestPreference = this.SeaStatusList.reduce((prev: any, current: any) => {
            return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
          });

          console.log(seaStatusWithHighestPreference);
          dataItem.stageId = seaStatusWithHighestPreference?.stageId;
          dataItem.statusId = seaStatusWithHighestPreference?.statusId;
          dataItem.jobStage = seaStatusWithHighestPreference?.jobStage;
          dataItem.jobStageStatus = seaStatusWithHighestPreference?.jobStageStatus;
          dataItem.preferenceOrder = seaStatusWithHighestPreference?.preferenceOrder;

          dataItem.joSeaStatusHistoryModal = this.SeaStatusList;
          this.SeaTransportGrid = [...this.SeaTransportGrid]
        }
      });
    }
  }




  //Road Transport
  AddRoadTransport() {
    this.RoadTransportDailog = this.dialog.open(RoadTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        jobOrderId: this.JobOrderId,
        selectedCategory: 0,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        rowNumber: this.generateRandomId(5),
        overAllList: this.RoadTransportGrid,
        stage: this.jobstage,
        status: this.jobstatus
      },
    });
    this.RoadTransportDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.RoadTransportGrid = [...this.RoadTransportGrid, result];
      }
    });
  }
  EditRoadTransport(dataItem: any, index: any) {
    let selectedCategory: any[] = this.RoadTransportGrid[index];
    this.RoadTransportDailog = this.dialog.open(RoadTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        jobOrderId: this.JobOrderId,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        rowNumber: this.generateRandomId(5),
        overAllList: this.RoadTransportGrid,
        view: false,
        stage: this.jobstage,
        status: this.jobstatus
      },
    });
    this.RoadTransportDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.RoadTransportGrid.findIndex(item => item?.rowNumber === result?.rowNumber);
        if (index !== -1) {
          this.RoadTransportGrid[index] = result;
          this.RoadTransportGrid = [...this.RoadTransportGrid]
        } else {
          this.RoadTransportGrid = [...this.RoadTransportGrid, result];
        }
      }
    });
  }

  viewRoadTransport(dataItem: any, index: any) {
    let selectedCategory: any[] = this.RoadTransportGrid[index];
    this.RoadTransportDailog = this.dialog.open(RoadTransportComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        vendorId: 0,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        view: true
      },
    });

  }

  RoadTransportStatusDailog: any;
  viewRoadHistoryStatus(dataItem: JORoadModeModal) {
    if (dataItem?.joRoadModeId != 0) {
      this.regionService.GetRoadStatusById(dataItem?.joRoadModeId).subscribe((res: any) => {
        this.RoadStatusList = res;
        if (this.RoadStatusList?.length != 0) {
          if (dataItem.joRoadStatusHistoryModal == null) {
            this.RoadTransportStatusDailog = this.dialog.open(RoadStatusComponent, {
              autoFocus: false,
              disableClose: true,
              data: {
                list: this.RoadStatusList,
                jobOrderId: dataItem?.jobOrderId,
                createdBy: parseInt(this.userId$),
                joStageandStatus: this.joStageandStatus
              }
            });
            this.RoadTransportStatusDailog.afterClosed().subscribe((result: any) => {
              if (result) {
                this.RoadStatusList = result;


                const roadStatusWithHighestPreference = this.RoadStatusList.reduce((prev: any, current: any) => {
                  return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
                });

                console.log(roadStatusWithHighestPreference);
                dataItem.stageId = roadStatusWithHighestPreference?.stageId;
                dataItem.statusId = roadStatusWithHighestPreference?.statusId;
                dataItem.jobStage = roadStatusWithHighestPreference?.jobStage;
                dataItem.jobStageStatus = roadStatusWithHighestPreference?.jobStageStatus;
                dataItem.preferenceOrder = roadStatusWithHighestPreference?.preferenceOrder;

                dataItem.joRoadStatusHistoryModal = this.RoadStatusList;
                this.RoadTransportGrid = [...this.RoadTransportGrid]
              }
            });
          } else {
            this.RoadTransportStatusDailog = this.dialog.open(RoadStatusComponent, {
              autoFocus: false,
              disableClose: true,
              data: {
                list: dataItem.joRoadStatusHistoryModal,
                jobOrderId: dataItem?.jobOrderId,
                createdBy: parseInt(this.userId$),
                joStageandStatus: this.joStageandStatus
              }
            });
            this.RoadTransportStatusDailog.afterClosed().subscribe((result: any) => {
              if (result) {
                this.RoadStatusList = result;

                const roadStatusWithHighestPreference = this.RoadStatusList.reduce((prev: any, current: any) => {
                  return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
                });

                console.log(roadStatusWithHighestPreference);
                dataItem.stageId = roadStatusWithHighestPreference?.stageId;
                dataItem.statusId = roadStatusWithHighestPreference?.statusId;
                dataItem.jobStage = roadStatusWithHighestPreference?.jobStage;
                dataItem.jobStageStatus = roadStatusWithHighestPreference?.jobStageStatus;
                dataItem.preferenceOrder = roadStatusWithHighestPreference?.preferenceOrder;
                dataItem.joRoadStatusHistoryModal = this.RoadStatusList;
                this.RoadTransportGrid = [...this.RoadTransportGrid]
              }
            });
          }
        } else {
          this.RoadTransportStatusDailog = this.dialog.open(RoadStatusComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
              list: dataItem.joRoadStatusHistoryModal,
              jobOrderId: dataItem?.jobOrderId,
              createdBy: parseInt(this.userId$),
              joStageandStatus: this.joStageandStatus
            }
          });
          this.RoadTransportStatusDailog.afterClosed().subscribe((result: any) => {
            if (result) {
              this.RoadStatusList = result;

              const roadStatusWithHighestPreference = this.RoadStatusList.reduce((prev: any, current: any) => {
                return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
              });

              console.log(roadStatusWithHighestPreference);
              dataItem.stageId = roadStatusWithHighestPreference?.stageId;
              dataItem.statusId = roadStatusWithHighestPreference?.statusId;
              dataItem.jobStage = roadStatusWithHighestPreference?.jobStage;
              dataItem.jobStageStatus = roadStatusWithHighestPreference?.jobStageStatus;
              dataItem.preferenceOrder = roadStatusWithHighestPreference?.preferenceOrder;

              dataItem.joRoadStatusHistoryModal = this.RoadStatusList;
              this.RoadTransportGrid = [...this.RoadTransportGrid]
            }
          });
        }
      })
    } else {
      this.RoadTransportStatusDailog = this.dialog.open(RoadStatusComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          list: dataItem.joRoadStatusHistoryModal,
          jobOrderId: dataItem?.jobOrderId,
          createdBy: parseInt(this.userId$),
          joStageandStatus: this.joStageandStatus
        }
      });
      this.RoadTransportStatusDailog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.RoadStatusList = result;

          const roadStatusWithHighestPreference = this.RoadStatusList.reduce((prev: any, current: any) => {
            return (prev.preferenceOrder > current.preferenceOrder) ? prev : current;
          });

          console.log(roadStatusWithHighestPreference);
          dataItem.stageId = roadStatusWithHighestPreference?.stageId;
          dataItem.statusId = roadStatusWithHighestPreference?.statusId;
          dataItem.jobStage = roadStatusWithHighestPreference?.jobStage;
          dataItem.jobStageStatus = roadStatusWithHighestPreference?.jobStageStatus;
          dataItem.preferenceOrder = roadStatusWithHighestPreference?.preferenceOrder;

          dataItem.joRoadStatusHistoryModal = this.RoadStatusList;
          this.RoadTransportGrid = [...this.RoadTransportGrid]
        }
      });
    }
  }

  DeleteRoadTransport(id: any, index: any) {
    this.RoadTransportGrid = this.RoadTransportGrid.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }



  //JobType
  AddJobType() {
    if (!this.originCountryID || !this.destinationCountryID) {
      let missingFields = [];

      if (!this.originCountryID) {
        missingFields.push('Origin Country');
      }

      if (!this.destinationCountryID) {
        missingFields.push('Destination Country');
      }

      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: `Please provide the following fields: ${missingFields.join(', ')}`,
        confirmButtonText: 'OK'
      });
    } else {
      this.JobTypeDailog = this.dialog.open(JobTypeComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          jobOrderId: this.JobOrderId,
          selectedCategory: 0,
          createdBy: parseInt(this.userId$),
          createdDate: 0,
          rowNumber: this.generateRandomId(5),
          overAllList: this.JobTypeGrid,
          originCountryID: this.originCountryID,
          destinationCountryID: this.destinationCountryID
        },
      });
      this.JobTypeDailog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.JobTypeGrid = [...this.JobTypeGrid, result];
          this.calculateAggregates();
          debugger;
          if (this.total.partCIFValue.sum != null) {
            this.CIFCurrencyContrl.setValidators(Validators.required);
            this.CIFCurrencyContrl.markAsTouched();
            this.CIFCurrencyContrl?.updateValueAndValidity();
            //this.CIFCurrencyControl.disable();
            //this.overallCIFValueControl.disable();
          } else {
            this.CIFCurrencyContrl.setValidators(Validators.nullValidator);
            this.CIFCurrencyContrl.updateValueAndValidity();
            this.CIFCurrencyControl.enable();
            this.overallCIFValueControl.enable();

          }
        }
      });
    }

  }
  EditJobType(dataItem: any, index: any) {
    if (!this.originCountryID || !this.destinationCountryID) {
      let missingFields = [];

      if (!this.originCountryID) {
        missingFields.push('Origin Country');
      }

      if (!this.destinationCountryID) {
        missingFields.push('Destination Country');
      }

      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: `Please provide the following fields: ${missingFields.join(', ')}`,
        confirmButtonText: 'OK'
      });
    } else {
      let selectedCategory: any[] = this.JobTypeGrid[index];
      this.JobTypeDailog = this.dialog.open(JobTypeComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          vendorId: 0,
          selectedCategory: 0,
          list: selectedCategory,
          createdBy: parseInt(this.userId$),
          createdDate: 0,
          rowNumber: this.generateRandomId(5),
          overAllList: this.JobTypeGrid,
          view: false,
          originCountryID: this.originCountryID,
          destinationCountryID: this.destinationCountryID
        },
      });
      this.JobTypeDailog.afterClosed().subscribe((result: any) => {
        if (result) {
          let index = this.JobTypeGrid.findIndex(item => item.rowNumber === result.rowNumber);
          if (index !== -1) {
            this.JobTypeGrid[index] = result;
            this.JobTypeGrid = [...this.JobTypeGrid]
            this.calculateAggregates();
            if (this.total.partCIFValue.sum != null) {
              this.CIFCurrencyContrl.setValidators(Validators.required);
              this.CIFCurrencyContrl?.updateValueAndValidity
              //this.CIFCurrencyControl.disable();
              //this.overallCIFValueControl.disable();
            } else {
              this.CIFCurrencyContrl.setValidators(Validators.nullValidator);
              this.CIFCurrencyContrl.updateValueAndValidity;
              this.CIFCurrencyControl.enable();
              this.overallCIFValueControl.enable();

            }
          } else {
            this.JobTypeGrid = [...this.JobTypeGrid, result];
            this.calculateAggregates();
            if (this.total.partCIFValue.sum != null) {
              this.CIFCurrencyContrl.setValidators(Validators.required);
              this.CIFCurrencyContrl?.updateValueAndValidity
              //this.CIFCurrencyControl.disable();
              //this.overallCIFValueControl.disable();
            } else {
              this.CIFCurrencyContrl.setValidators(Validators.nullValidator);
              this.CIFCurrencyContrl.updateValueAndValidity;
              this.CIFCurrencyControl.enable();
              this.overallCIFValueControl.enable();

            }
          }
        }
      });
    }

  }

  viewJobType(dataItem: any, index: any) {
    let selectedCategory: any[] = this.JobTypeGrid[index];
    this.JobTypeDailog = this.dialog.open(JobTypeComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        vendorId: 0,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        view: true
      },
    });
  }
  DeleteJobType(id: any, index: any) {
    this.JobTypeGrid = this.JobTypeGrid.filter((_, i) => i !== index);
    this.calculateAggregates();
    this.cdr.detectChanges();
  }


  //PackageDetails
  preventNegativeValuesInNOP(event: any) {
    const value = event.target.value;
    if (value < 0) {
      event.target.value = 0;  
      let val:any = 0;
      this.numberOfPackegesControl.setValue(val);  
    }
  }
  AddPackageDetails() {
    const noOfpkg: any = this.numberOfPackegesControl.value
    const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
    const count = this.PackageDetailsGrid.length;
    if (noOfpkgcount == 0) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Number of Packages count is zero",
        showConfirmButton: false,
        timer: 2000,
      });
      return
    }
    if (noOfpkgcount > count) {
      const dialogRef = this.dialog.open(PackageDetailsComponent, {
        data: {
          modeofTransport: this.JOTMModes,
          list: this.PackageDetailsGrid,
          seaportSelected: this.seaportSelected
        },
        disableClose: true,
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        debugger
        if (result != null) {
          this.PackageDetailsGrid = [...this.PackageDetailsGrid, result];
        }
      });
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Maximum package count exceeded.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  EditPackageDetails(dataItem: any, index: any) {
    let selectedCategory: any[] = this.PackageDetailsGrid[index];
    this.PackageDetailsDailog = this.dialog.open(PackageDetailsComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        joData: dataItem,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        modeofTransport: this.JOTMModes,
        seaportSelected: this.seaportSelected,
        mode: 'Edit',
        view: false
      },
    });
    this.PackageDetailsDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.PackageDetailsGrid.findIndex(item => item.rowNumber === result.rowNumber);
        if (index !== -1) {
          this.PackageDetailsGrid[index] = result;
          this.PackageDetailsGrid = [...this.PackageDetailsGrid]
        } else {
          this.PackageDetailsGrid = [...this.PackageDetailsGrid, result];
        }
      }
    });

  }


  viewPackageDetails(dataItem: any, index: any) {
    let selectedCategory: any[] = this.PackageDetailsGrid[index];
    this.PackageDetailsDailog = this.dialog.open(PackageDetailsComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        joData: dataItem,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        modeofTransport: this.JOTMModes,
        seaportSelected: this.seaportSelected,
        createdDate: 0,
        mode: 'View',
        view: true
      },
    });
  }
  DeletePackageDetails(id: any, index: any) {
    this.PackageDetailsGrid = this.PackageDetailsGrid.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }

  getTotalCrossWeight(): string {
    const totalCrossWeight = this.PackageDetailsGrid.reduce((total, item) => total + (+item.packWeightKg || 0), 0);
    return totalCrossWeight.toFixed(2);
  }

  getTotalChargeableWeight(): string {
    const totalChargeableWeight = this.PackageDetailsGrid.reduce((total, item) => total + (+item.chargePackWtKg || 0), 0);
    return totalChargeableWeight.toFixed(2);
  }


  //LineItemDetails
  AddLineItemDetails() {
    this.LineItemDetailsDailog = this.dialog.open(LineItemDetailsComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        jobOrderId: this.JobOrderId,
        selectedCategory: 0,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        rowNumber: this.generateRandomId(5),
        overAllList: this.LineItemDetailsGrid,
        defaultService: this.ServiceDetailForm.controls.destinationCountryControl.value,
        selectedJobOrderDate: this.JobOrderGeneralForm.get('jobOrderDateControl')?.value,
      },
    });
    this.LineItemDetailsDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        this.LineItemDetailsGrid = [...this.LineItemDetailsGrid, result];
      }
    });
  }
  EditLineItemDetails(dataItem: any, index: any) {
    let selectedCategory: any[] = this.LineItemDetailsGrid[index];
    console.log(selectedCategory)
    console.log('this.LineItemDetailsGrid', this.LineItemDetailsGrid)
    this.LineItemDetailsDailog = this.dialog.open(LineItemDetailsComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        jobOrderId: this.JobOrderId,
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        rowNumber: this.generateRandomId(5),
        overAllList: this.LineItemDetailsGrid,
        vendorId: dataItem?.vendorId,
        refNumberId: dataItem?.refNumberId,
        sourceFromId: dataItem?.sourceFromId,
        selectedJobOrderDate: this.JobOrderGeneralForm.get('jobOrderDateControl')?.value,
        defaultService: this.ServiceDetailForm.controls.destinationCountryControl.value,
        view: false,
      },
    });
    this.LineItemDetailsDailog.afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.LineItemDetailsGrid.findIndex(item => item?.rowNumber === result?.rowNumber);
        if (index !== -1) {
          this.LineItemDetailsGrid[index] = result;
          this.LineItemDetailsGrid = [...this.LineItemDetailsGrid]
        } else {
          this.LineItemDetailsGrid = [...this.LineItemDetailsGrid, result];
        }
      }
    });
  }

  viewLineItemDetails(dataItem: any, index: any) {
    let selectedCategory: any[] = this.LineItemDetailsGrid[index];
    this.LineItemDetailsDailog = this.dialog.open(LineItemDetailsComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        selectedCategory: 0,
        list: selectedCategory,
        createdBy: parseInt(this.userId$),
        createdDate: 0,
        vendorId: dataItem?.vendorId,
        view: true
      },
    });
  }
  DeleteLineItemDetails(id: any, index: any) {
    this.LineItemDetailsGrid = this.LineItemDetailsGrid.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }



  //Attachments
  getDocumentList() {
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      this.documentList = res;
      this.matFilters();
    });
  }
  addAttached() {
    const dialogRefDoc = this.dialog.open(AttachmentComponent, {
      data: {
        list: this.attchmentList,
        createdBy: parseInt(this.userId$),
      },
      disableClose: true,
      autoFocus: false
    });
    dialogRefDoc.afterClosed().subscribe(result => {
      if (result != null) {
        this.attchmentList.splice(0, 0, result);
        this.ImageDetailsArray = result.Document;
        this.attchmentList = [...this.attchmentList];
      }
    });
  }


  selectedItemUrl: string | ArrayBuffer | null = null;
  AttchedView(dataItem: any, index: any) {
    this.selectedItem = this.attchmentList[index];
    const file = this.selectedItem.file;
    if (file != undefined) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const dialogRef = this.dialog.open(ImagePreviewComponent, {
            data: { imageUrl: e.target.result }
          });
        };
        reader.readAsDataURL(file);
      } else {
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } else {
      let dialogRef = this.dialog.open(this.imagePreview,
        { data: this.Filepath + dataItem?.documentName });
    }
  }

  onEditDocument(Data: any, index: any) {
    this.rowIndexDocument = this.attchmentList.indexOf(Data);
    this.editedDocument = { ...Data };
    this.attchmentList.splice(this.rowIndexDocument, 1);

    const dialogRefDoc = this.dialog.open(AttachmentComponent, {
      data: {
        documentData: Data,
        list: this.attchmentList,
        createdBy: parseInt(this.userId$),
        rowNumber: this.generateRandomId(5),
        mode: 'Edit',
      },
      autoFocus: false,
      disableClose: true,
    });

    dialogRefDoc.afterClosed().subscribe(result => {
      if (result != null) {
        this.attchmentList.splice(this.rowIndexDocument, 0, result);
        this.attchmentList = [...this.attchmentList];
        this.ImageDetailsArray = result.Document;
      } else {
        this.attchmentList.splice(this.rowIndexDocument, 0, this.editedDocument);
        this.attchmentList = [...this.attchmentList];
        this.ImageDetailsArray = result.Document;
      }
    });
  }
  AttchedDelete(dataItem: any, index: any) {
    if (dataItem.mandatory) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "It's a mandatory document. Not able to delete!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    this.attchmentList = this.attchmentList.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }


  Downloads(file: any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }



  Save(obj: any) {

  }

  Update(obj: any) {

  }


  triggerValidation() {
    Object.keys(this.JobOrderGeneralForm.controls).forEach(field => {
      const control = this.JobOrderGeneralForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
    Object.keys(this.ServiceDetailForm.controls).forEach(field => {
      const control = this.ServiceDetailForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }



  //Validation
  validateAllForms(): boolean {
    const formTabs = [
      { form: this.JobOrderGeneralForm, tab: "General" },
      { form: this.ServiceDetailForm, tab: "Service" },
    ];

    for (const formTab of formTabs) {
      if (formTab.form.invalid) {
        formTab.form.markAllAsTouched();
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: `Please fill the mandatory fields in ${formTab.tab} tab`,
          showConfirmButton: true,
        });
        if(formTab.tab === "General"){
          this.changeTab(0);
        } else {
          this.changeTab(1);
        }
        return false;
      }
    }

    if (this.hasTransportMode(1)) {
      // if (this.AirTransportGrid?.length === 0) {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops!',
      //     text: 'The Air transport mode is empty. Please add some items.',
      //     showConfirmButton: true,
      //   });
      //   return false;
      // }

      if(this.AirTransportGrid?.length > 0){
        if (this.flightNumberControl.invalid || this.flightNameControl.invalid || this.mAWBNumberControl.invalid) {
          this.flightNumberControl.markAsTouched();
          this.flightNameControl.markAsTouched();
          this.mAWBNumberControl.markAsTouched();
  
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Please fill the mandatory fields in Air Transport',
            showConfirmButton: true,
          });
          this.changeTab(1);
          return false;
        }
      }

    }

    if (this.hasTransportMode(2)) {

      if(this.SeaTransportGrid?.length > 0){
        if (this.MBLNumberControl.invalid) {
          this.MBLNumberControl.markAsTouched();
  
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Please fill the mandatory fields in sea transport',
            showConfirmButton: true,
          });
          this.changeTab(1);
          return false;
        }
      }


      // if (this.SeaTransportGrid?.length === 0) {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops!',
      //     text: 'The Sea Transport mode is empty. Please add some items.',
      //     showConfirmButton: true,
      //   });
      //   return false;
      // }
    }

    if (this.hasTransportMode(3)) {
      // if (this.RoadTransportGrid?.length === 0) {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops!',
      //     text: 'The Road transport mode is empty. Please add some items.',
      //     showConfirmButton: true,
      //   });
      //   return false;
      // }
    }

    if (this.orderstatus == "Close") {
      if (this.JobOrderGeneralForm.controls.jobCategoryControl.value === 'Warehouse' || this.JobOrderGeneralForm.controls.jobCategoryControl.value === 'Custom') {
        if (this.WMSOrderNoControl.invalid || this.WMSOrderStatusControl.invalid) {
          this.WMSOrderNoControl.markAsTouched();
          this.WMSOrderStatusControl.markAsTouched();

          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Please fill the mandatory fields in Job category - Wharehouse',
            showConfirmButton: true,
          });
          this.changeTab(1);
          return false;
        }
      }
    }

    if (this.selectedPackageType == true && this.selectedJobType == true) {
      let CIFC = this.CIFCurrencyContrl.value;
      // let PCIF = this.CIFCurrencyControl.value;
      if (CIFC === "" || CIFC === null || CIFC === undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'The CIF Currency is empty. ',
          showConfirmButton: true,
        });
        this.changeTab(1);
        return false;
      }
    }

    const NoOfPackage: any = this.numberOfPackegesControl.value;
    if (this.PackageDetailsGrid?.length !== +NoOfPackage) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: `The number of packages entered (${NoOfPackage}) does not match the number of items in the package details list (${this.PackageDetailsGrid.length}).`,
        showConfirmButton: true,
      });
      this.changeTab(2);
      return false;
    }

    // if (this.selectedJobType==true) {
    //   if (this.JobTypeGrid?.length === 0) {
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'warning!',
    //       text: 'Please fill part details.',
    //       showConfirmButton: true,
    //     });
    //   }
    // }
    if (this.selectedJobType == true) {
      if (!this.CIFCurrencyContrl.valid) {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'The CIF Currency is empty.',
          showConfirmButton: true,
        });
        this.changeTab(1);
        return false;
      }
    }
    // if (this.selectedPackageType==true) {
    //   if (this.PackageDetailsGrid?.length === 0) {
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'warning!',
    //       text: 'Please fill Package details',
    //       timer: 10000,
    //       showConfirmButton: true,
    //     });

    //   }
    // }

    if (this.selectedPackageType == true) {
      let pCurrency = this.CIFCurrencyContrl.value;
      if (pCurrency !== "") {
        this.CIFCurrencyControl.setValue(pCurrency);
      }
      let CIFC = this.CIFCurrencyControl.value;
      if (CIFC === "" || CIFC === null || CIFC === undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'The CIF Currency is empty. ',
          showConfirmButton: true,
        });
        this.CIFCurrencyControl.setValidators([Validators.required]);
        this.overallCIFValueControl.setValidators([Validators.required]);
        this.overallCIFValueControl.updateValueAndValidity();
        this.CIFCurrencyControl.updateValueAndValidity();
        this.CIFCurrencyControl.markAsTouched();
        this.overallCIFValueControl.markAsTouched();
        return false;
      } else {
        this.CIFCurrencyControl.clearValidators();
        this.overallCIFValueControl.clearValidators();
        this.CIFCurrencyControl.updateValueAndValidity();
        this.overallCIFValueControl.updateValueAndValidity();
      }
    }

    if (this.LineItemDetailsGrid?.length !== 0) {
      const requiredFields = ['lineItemCode', 'lineItemName', 'lineItemCategoryName', 'regionName', 'countryName'];
      for (const item of this.LineItemDetailsGrid) {
        for (const field of requiredFields) {
          if (!item[field] || item[field] === null || item[field] === '') {
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: `Please fill the mandatory field of ${item.lineItemName} in the line item tab.`,
              showConfirmButton: true
            });
            this.changeTab(3);
            return false;
          }
        }
      }
    }


    if (this.orderstatus == "Close") {
      const requiredFields = ['documentName'];
      for (const item of this.attchmentList) {
        // Check if the item has mandatory set to true
        if (item.mandatory === true) {
          for (const field of requiredFields) {
            if (!item[field] || item[field] === null || item[field] === '') {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: `Please fill mandatory fields of ${field}  in documents tab.`,
                showConfirmButton: true
              });
              this.changeTab(4);
              return false;
            }
          }
        }
      }

    }

    if (this.overallCIFValueControl.value && this.overallCIFvalue?.partCIFValue?.sum) {
      let ServiceCIF: any = +this.overallCIFValueControl.value;  
      let PartCIF:any = +this.overallCIFvalue?.partCIFValue?.sum;  

      if (ServiceCIF !== PartCIF) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Service CIF and Part CIF values must be equal!',
          confirmButtonText: 'OK'
        });
        this.changeTab(1);
        return false;
      }
    } else if(this.overallCIFvalue?.partCIFValue?.sum){
      let PartCIF:any = +this.overallCIFvalue?.partCIFValue?.sum; 
      this.overallCIFValueControl.patchValue(PartCIF)
    }
  

    if (this.selectedPackageType == false && this.selectedJobType == false) {
      let pCurrency = this.CIFCurrencyContrl.value;
      if (pCurrency !== "") {
        this.CIFCurrencyControl.setValue(pCurrency);
      }

      let CIFC = this.CIFCurrencyControl.value;
      // let PCIF = this.CIFCurrencyControl.value;
      if (CIFC === "" || CIFC === null || CIFC === undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'The CIF Currency is empty. ',
          showConfirmButton: true,
        });
        this.changeTab(1);
        return false;
      }
    }




    return true;
  }

  //Overall Actions
  saveAll() {
    this.triggerValidation();
    if (!this.validateAllForms()) {
      if (this.CustomerList?.length === 0 || this.CustomerBillingCurrencyList?.length === 0 ||
        this.CustomerAddressList?.length === 0 || this.ContactPersonList?.length === 0) {
        this.OnCustomerChangeEvent(this.JobOrderGeneral)
      }
      return;
    } else {
      let confirmationPromise;
      let checkPartAndPackage = this.selectedPackageType && this.selectedJobType;
      if ((this.selectedPackageType && this.PackageDetailsGrid?.length === 0) ||
        (this.selectedJobType && this.JobTypeGrid?.length === 0)) {

        // const missingDetailsText = (this.selectedPackageType && this.PackageDetailsGrid?.length === 0 ? 'package details' : '') +
        //   (this.selectedJobType && this.JobTypeGrid?.length === 0 ? (this.selectedPackageType ? ' and ' : '') + 'part details' : '');
        const missingDetailsText = [
          this.selectedPackageType && this.PackageDetailsGrid?.length === 0 ? 'package details' : '',
          this.selectedJobType && this.JobTypeGrid?.length === 0 ? 'part details' : ''
        ].filter(text => text).join(' and ');

        
        confirmationPromise = Swal.fire({
          title: 'Are you sure?',
          text: `Do you want to save the Job Order without ${missingDetailsText}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Save',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          checkPartAndPackage = result.isConfirmed;
        });
      } else {
        this.save();
      }

      confirmationPromise?.then(() => {
        if (!this.selectedPackageType && !this.selectedJobType) {
          this.save();
        } else {
          if (checkPartAndPackage) {
            this.save();
          }
        }
      });
    }
  }

  save() {
    if (this.CustomerList?.length === 0 || this.CustomerBillingCurrencyList?.length === 0 ||
      this.CustomerAddressList?.length === 0 || this.ContactPersonList?.length === 0) {
      this.OnCustomerChangeEvent(this.JobOrderGeneral)
    }


    this.JobOrderGeneral.jobOrderId = this.JobOrderId || 0,
      this.JobOrderGeneral.jobOrderNumber = this.JobOrderGeneralForm.controls.jobOrderNumberControl.value || '',
      this.JobOrderGeneral.jobOrderDate = this.normalizeDateToUTC(this.JobOrderGeneralForm.controls.jobOrderDateControl.value) ? new Date(this.normalizeDateToUTC(this.JobOrderGeneralForm.controls.jobOrderDateControl.value)) : new Date(),
      this.JobOrderGeneral.jobOrderAgainstId = this.getJOAgainstId(this.JobOrderGeneralForm.controls.jobOrderAgainstControl.value) || 0,
      
      // if(this.JobOrderGeneral.jobOrderAgainstId == 1){
      //   this.JobOrderGeneral.refNumberId = this.getJORefId(this.JobOrderGeneralForm.controls.baseReferenceNoControl.value) || this.JobOrderGeneral?.refNumberId
      // } else if(this.JobOrderGeneral.jobOrderAgainstId == 2){
      //   this.JobOrderGeneral.refNumberId = this.selectedContractIds
      // }      
      
      this.JobOrderGeneral.refNumberId = this.getJORefId(this.JobOrderGeneralForm.controls.baseReferenceNoControl.value) || this.JobOrderGeneral?.refNumberId,


      this.JobOrderGeneral.referenceNumber1 = this.JobOrderGeneralForm.controls.referenceNumber1Control.value || '',
      this.JobOrderGeneral.referenceNumber2 = this.JobOrderGeneralForm.controls.referenceNumber2Control.value || '',
      this.JobOrderGeneral.customerId = this.getJOCustomerId(this.JobOrderGeneralForm.controls.customerNameControl.value) || 0,
      this.JobOrderGeneral.customerAddressId = this.getJOCustomerAddressId(this.JobOrderGeneralForm.controls.customerAddressControl.value) || 0,
      this.JobOrderGeneral.customerContactId = this.getJOCustomerContactId(this.JobOrderGeneralForm.controls.contactPersonControl.value) || 0,
      this.JobOrderGeneral.billCurrencyId = this.getJOCustomerBillId(this.JobOrderGeneralForm.controls.customerBillingCurrencyControl.value) || 0,
      this.JobOrderGeneral.exchangeRate = this.JobOrderGeneralForm.controls.exchangeRateControl.value ? parseFloat(this.JobOrderGeneralForm.controls.exchangeRateControl.value) : 0;
      this.JobOrderGeneral.jobCategoryId = this.getJOJobCatId(this.JobOrderGeneralForm.controls.jobCategoryControl.value) || 0,
      this.JobOrderGeneral.jobTypeId = this.getJOJobTypeId(this.JobOrderGeneralForm.controls.jobTypeControl.value) || 0,
      this.JobOrderGeneral.salesOwnerId = this.getJOSalesOwnerId(this.JobOrderGeneralForm.controls.salesOwnerControl.value) || 0,
      this.JobOrderGeneral.salesExecutiveId = this.getJOSalesExecId(this.JobOrderGeneralForm.controls.salesExecutiveControl.value) || 0,
      this.JobOrderGeneral.jobOwnerId = this.getJOJobOwnerId(this.JobOrderGeneralForm.controls.jobOwnerControl.value) || 0,
      this.JobOrderGeneral.jobOrderStageId = this.getJOStageId(this.JobOrderGeneralForm.controls.jobOrderStageControl.value) || 0,
      this.JobOrderGeneral.jobOrderStatusId = this.getJOStatusId(this.JobOrderGeneralForm.controls.jobOrderStatusControl.value) || 0,
      this.JobOrderGeneral.jobClosingDate = this.normalizeDateToUTC(this.JobOrderGeneralForm.controls.jobClosingDateControl.value) ? new Date(this.normalizeDateToUTC(this.JobOrderGeneralForm.controls.jobClosingDateControl.value)) : null;
    this.JobOrderGeneral.cancelReasonId = this.getJOCancelReasonId(this.JobOrderGeneralForm.controls.cancelReasonControl.value) || null,
      this.JobOrderGeneral.cancelRemarks = this.JobOrderGeneralForm.controls.cancelRemarkControl.value || '',
      this.JobOrderGeneral.billOfEntry = this.JobOrderGeneralForm.controls.billofEntryNumberControl.value || '',
      this.JobOrderGeneral.remarks = this.JobOrderGeneralForm.controls.remarksControl.value || '',
      this.JobOrderGeneral.tags = this.JobOrderGeneralForm.controls.tagsControl.value || '',
      //Service details
      this.JobOrderGeneral.originCountryId = this.getJOCountryId(this.ServiceDetailForm.controls.originCountryControl.value) || 0,
      this.JobOrderGeneral.destCountryId = this.getJODesCountryId(this.ServiceDetailForm.controls.destinationCountryControl.value) || 0,

      this.JobOrderGeneral.loadingPortId = this.LoadingPortId
        ? this.getJOLoadingPortId(this.LoadingPortId)
        : this.JobOrderGeneral?.loadingPortId || null;

    this.JobOrderGeneral.destinationPortId = this.DestinationPortId
      ? this.getJOPortDestId(this.DestinationPortId)
      : this.JobOrderGeneral?.destinationPortId || null;

    this.JobOrderGeneral.originLocationId = this.getJOOriginLocationId(this.ServiceDetailForm.controls.originLocationControl.value) || null,
      this.JobOrderGeneral.destLocationId = this.getJODestLocationId(this.ServiceDetailForm.controls.destinationLocationControl.value) || null,
      this.JobOrderGeneral.pickUpLocation = this.ServiceDetailForm.controls.pickUpLocationControl.value || '',
      this.JobOrderGeneral.deliveryPlace = this.ServiceDetailForm.controls.finalPlaceofDeliveryControl.value || '',
      this.JobOrderGeneral.transitTime = this.ServiceDetailForm.controls.transitTimeControl.value || '',
      this.JobOrderGeneral.routing = this.ServiceDetailForm.controls.routingControl.value || '',
      this.JobOrderGeneral.temperatureReq = this.ServiceDetailForm.controls.tempratureRequiredControl.value || '',
      this.JobOrderGeneral.cargoTypeId = this.getJOCargoId(this.ServiceDetailForm.controls.cargoTypeControl.value) || null,
      this.JobOrderGeneral.incoTermId = this.getJOIncoTermId(this.ServiceDetailForm.controls.incoTermControl.value) || null,
      //Air
      this.JobOrderGeneral.flightNumber = this.flightNumberControl.value || '',
      this.JobOrderGeneral.flightName = this.flightNameControl.value || '',
      this.JobOrderGeneral.mawbNumber = this.mAWBNumberControl.value || '',
      // Sea
      this.JobOrderGeneral.mblNumber = this.MBLNumberControl.value || '',
      // Job category - warehouse
      this.JobOrderGeneral.wmsOrderNumber = this.WMSOrderNoControl.value || '',
      this.JobOrderGeneral.rmaNumber = this.RMANumberControl.value || '',
      this.JobOrderGeneral.wmsOrderStatus = this.WMSOrderStatusControl.value || '',
      this.JobOrderGeneral.packageNos = this.numberOfPackegesControl.value || 0,
      this.JobOrderGeneral.overallCIFValue = this.overallCIFValueControl.value || 0,
      this.JobOrderGeneral.cifCurrencyId = this.getCIFCurrency(this.CIFCurrencyControl.value ? this.CIFCurrencyControl.value : this.CIFCurrencyContrl.value) || 0,
      //Air Grid
      this.JobOrderGeneral.createdBy = parseInt(this.userId$),
      // this.JobOrderGeneral.createdDate= this.ContractInfo?.createdDate,
      this.JobOrderGeneral.updatedBy = parseInt(this.userId$),
      this.JobOrderGeneral.updatedDate = this.normalizeDateToUTC(new Date())
      this.JobOrderGeneral.isJOExpenseBooking = this.JobOrderGeneral?.isJOExpenseBooking || false,
      this.JobOrderGeneral.isJORevenueBooking = this.JobOrderGeneral?.isJORevenueBooking || false

    let payload = {
      joGeneral: this.JobOrderGeneral,
      joTransportMode: this.JOTMModes,
      joCommodity: this.JOCommodity,
      joAirTransport: this.AirTransportGrid,
      joSeaTransport: this.SeaTransportGrid,
      joRoadTransport: this.RoadTransportGrid,
      joPartDetail: this.JobTypeGrid,
      joPackage: this.PackageDetailsGrid,
      joLineItem: this.LineItemDetailsGrid,
      joDocument: this.attchmentList,
    }
    console.log(payload)

    this.regionService.AddJobOrder(payload).subscribe((res: any) => {
      const formData = new FormData();
      this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
      this.Fs.FileUpload(formData).subscribe({
        next: (res) => {

        },
        error: (error) => {
        }
      });
      if (res) {
        if (this.JobOrderId) {
          Swal.fire({
            icon: "success",
            title: "Updated successfully",
            text: `Job Order Number: ${res?.joGeneral?.jobOrderNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (this.JobOrderId) {
                // location.reload();
                this.router.navigate(['/qms/transaction/job-order-list']);
              } else {
                // let id = res?.vendorCustomerGeneralModal?.JobOrderId
                // this.router.navigate(['/qms/transaction/add-vendor-contract', id]);
                this.router.navigate(['/qms/transaction/job-order-list']);
              }

            }
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Added successfully",
            text: `Job Order Number: ${res?.joGeneral?.jobOrderNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (this.JobOrderId) {
                // location.reload();
                this.router.navigate(['/qms/transaction/job-order-list']);
              } else {
                this.router.navigate(['/qms/transaction/job-order-list']);
              }

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
        if (stausCode === 500) {
          this.errorHandler.handleError(err);
        } else if (stausCode === 400) {
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

  generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


  getJOAgainstId(value: any) {
    let joAgainst = this.JobOrderAgainstList.find(option => option?.joAgainst == value)
    return joAgainst?.joAgainstId;
  }
  getJORefId(value: any) {
    const prefix = value?.substring(0, 2);
    if (prefix === 'QO') {
      let option = this.BaseReferenceNoList.find(option => option?.contractNumber == value)
      return option?.quotationId || null;
    } else if (prefix === 'CC') {
      let option = this.BaseReferenceNoList.find(option => option?.contractNumber == value)
      return option?.customerContractFFSId || null;
    }
  }
  getJOCustomerId(value: any) {
    let name = value ? value : this.JobOrderGeneral.customerName;
    let option = this.CustomerList.find(option => option?.customerName == name)
    return option?.customerId;
  }
  getJOCustomerAddressId(value: any) {
    let option = this.CustomerAddressList.find(option => option?.addressName == value)
    return option?.cAddressId;
  }
  getJOCustomerContactId(value: any) {
    let option = this.ContactPersonList.find(option => option?.contactPerson == value)
    return option?.cContactId;
  }
  getJOCustomerBillId(value: any) {
    let option = this.CustomerBillingCurrencyList.find(option => option?.currencyName == value)
    return option?.currencyId;
  }
  getJOJobCatId(value: any) {
    let option = this.JobCategoryList.find(option => option?.jobCategory == value)
    return option?.jobCategoryId;
  }
  getJOJobTypeId(value: any) {
    let option = this.JobTypeList.find(option => option?.jobTypeName == value)
    return option?.jobTypeId;
  }
  getJOSalesOwnerId(value: any) {
    let option = this.SalesExecutiveList.find(option => option?.employeeName == value)
    return option?.employeeId;
  }
  getJOSalesExecId(value: any) {
    let option = this.SalesOwnerList.find(option => option?.employeeName == value)
    return option?.employeeId;
  }
  getJOJobOwnerId(value: any) {
    let option = this.JobOwnerList.find(option => option?.employeeName == value)
    return option?.employeeId;
  }
  getJOStageId(value: any) {
    let option = this.joStageandStatus
      .find(option => option?.jobStage == value)
    return option?.jtypeStageId;
  }
  getJOStatusId(value: any) {
    let option = this.JobOrderStatusList.find(option => option?.jobStageStatus == value)
    return option?.jobStageStatusId;
  }
  getJOCancelReasonId(value: any) {
    let option = this.CancelReasonList.find(option => option?.reasonName == value)
    return option?.reasonId;
  }

  //Service Tab
  getJOCountryId(value: any) {
    let option = this.OriginCountryList.find(option => option?.countryName == value)
    return option?.countryId;
  }
  getJODesCountryId(value: any) {
    let option = this.OriginCountryList.find(option => option?.countryName == value)
    return option?.countryId;
  }
  getJOLoadingPortId(value: any) {
    let option = this.PortofLoadingList.find(option => option?.loadingPortName == value)
    return option?.loadingPortId;
  }
  getJOPortDestId(value: any) {
    let option = this.PortofDestinationList.find(option => option?.destinationPortIdName == value)
    return option?.destinationPortId;
  }
  getJOOriginLocationId(value: any) {
    let option = this.OriginLocationList.find(option => option?.cityName == value)
    return option?.cityId;
  }
  getJODestLocationId(value: any) {
    let option = this.DestinationLocationList.find(option => option?.cityName == value)
    return option?.cityId;
  }
  getJOCargoId(value: any) {
    let option = this.CargoTypeList.find(option => option?.cargoType == value)
    return option?.cargoTypeId;
  }
  getJOIncoTermId(value: any) {
    let option = this.IncoTermList.find(option => option?.incoTermCode == value)
    return option?.incoTermId;
  }
  getCIFCurrency(value: any) {
    let option = this.CustomerBillingCurrencyList.find(option => option?.currencyName == value)
    return option?.currencyId;
  }

  getService(value: any) {
    let option = this.OriginCountryList.find(option => option?.countryName == value)
    return option?.countryId;
  }

  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  reset() {
    location.reload();
  }

  Return() {
    this.router.navigate(["/qms/transaction/job-order-list"]);
  }

  //#region Keyboard tab operation

  /// to provoke csave or update method
  hndlKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
      this.editRow = false;
    }
  }
  /// to reach submit button
  handleChange(event: any, dataItem: any) {
    if (event.key === "Tab" || event.key === "Enter") {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChange(event: any) {
    if (event.key === "Tab") {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      // this.oncancel(dataItem);
    }
  }

  //#endregion




  //Edit
  OnJobTypeEventEdit(event: any) {
    this.selectedJobType = false;
    this.selectedPackageType = false;
    let value = event?.option?.value ? event?.option?.value : event;
    let selectedValue = this.JobTypeList.find(option => option?.jobTypeName === value);
    this.selectedJobType = selectedValue?.partDetails;
    this.selectedPackageType = selectedValue?.packageDetails;
    if (this.selectedJobType == true) {
      this.overallCIFValueControl.reset();
      //this.overallCIFValueControl.disable();

      this.CIFCurrencyControl.reset();
      //this.CIFCurrencyControl.disable();

      let val: any = +this.overallCIFvalue?.partCIFValue?.sum;
      this.overallCIFValueControl.patchValue(val)
    } else {
      this.overallCIFValueControl.reset();
      this.overallCIFValueControl.enable();
      this.CIFCurrencyControl.reset();
      this.CIFCurrencyControl.enable();
    }
    this.matFilters();

    if (selectedValue?.jobTypeId) {
      this.jobtypeService.getAllJopTypeById(selectedValue?.jobTypeId).subscribe((res: any) => {

        if (res?.jobTypeStatuses?.length != 0) {
          this.joStageandStatus = res?.jobTypeStatuses;
        }
      });
    }

  }

  //Multi Contract
  // previousContractLineItems:any[]=[];
  // selectedContractIds:any;

  // multiContract(event: any) {
  //   const selectedContracts = event.source.value;
  //   this.selectedContractIds = this.BaseReferenceNoList
  //     .filter(item => selectedContracts.includes(item.contractNumber))
  //     .map(item => item.customerContractFFSId);

  //   console.log('Selected contract IDs:', this.selectedContractIds);
  //   if (this.selectedContractIds && this.selectedContractIds.length > 0) {
  //     this.getContractLineItem(this.selectedContractIds);
  //   }
  // }

  
  // getContractLineItem(ids: number[]){
  //   let payload = {
  //     customerContractIds: ids
  //   }
  //   this.regionService.GetAllContractCustomerByIds(payload).subscribe((res: any) => {
  //     console.log(res);
  //     this.QuotationLineItems = res?.result;
  //     if (res?.result.length > 0) {
  //       debugger;
  //       const newLineItems = res?.result?.map((item: any) => ({
  //         lineItemCategoryId: item?.aamroLineItemCatId,
  //         lineItemId: item.aamroLineItemId,
  //         lineItemCode: item.lineItemCode,
  //         lineItemName: item.lineItemName,
  //         serviceInId: item?.serviceInId,
  //         lineItemCategoryName: item.lineItemCategoryName,
  //         countryName: item.countryName,
  //         regionId: this.regionId,
  //         regionName: this.regionName,
  //         createdBy: parseInt(this.userId$),
  //         updatedBy: parseInt(this.userId$),
  //         rowNumber: this.generateRandomId(5),
  //       }));

  //       //this.LineItemDetailsGrid.push(newLineItems);


  //       if (this.previousContractLineItems.length > 0) {
  //         for (const index of this.previousContractLineItems.reverse()) {
  //           this.LineItemDetailsGrid.splice(index, 1);
  //         }
  //       }

  //       this.previousContractLineItems = [];
  //       const startIndex = this.LineItemDetailsGrid.length;
  //       for (let i = 0; i < newLineItems.length; i++) {
  //         this.previousContractLineItems.push(startIndex + i);
  //       }
  //       this.LineItemDetailsGrid = [...this.LineItemDetailsGrid, ...newLineItems];
  //     }

  //   })
  
  // }

  // hasQOContracts(): boolean {
  //   return this.BaseReferenceNoList?.some(item => item?.contractNumber?.startsWith('QO'));
  // }

  // hasCCContracts(): boolean {
  //   return this.BaseReferenceNoList?.some(item => item?.contractNumber?.startsWith('CC'));
  // }

  
}
