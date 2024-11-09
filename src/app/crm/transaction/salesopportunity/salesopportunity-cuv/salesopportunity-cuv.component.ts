import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { Observable, concat, map, startWith } from 'rxjs';
import { BillingCurrencys, CVTypeModel, ModeofFollowUp, ModeofTransports, ReportingStageModel, ServiceSector, StatusTypeInC, StatusTypeInPC } from 'src/app/Models/crm/master/Dropdowns';
import { Industry } from 'src/app/Models/crm/master/Industry';
import { ServiceTypeServiceService } from 'src/app/crm/master/servicetype/service-type-service.service';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { SOCommodity, SOTransportModeModel, SalesOpportunity, SalesOpportunityContainer } from '../salesopportunity.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { SalesOpportunityService } from '../salesopportunity.service';
import { SODestination, SOIncoTerms, SOOrigin, SOService } from '../salesopportunity.model';
import { Country } from 'src/app/ums/masters/countries/country.model';
import Swal from 'sweetalert2';
import { PotentialCustomerService } from 'src/app/crm/master/potential-customer/potential-customer.service';
import { PotentialCustomer } from 'src/app/crm/master/potential-customer/potential-customer.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';

@Component({
  selector: 'app-salesopportunity-cuv',
  templateUrl: './salesopportunity-cuv.component.html',
  styleUrls: ['./salesopportunity-cuv.component.css', '../../../../ums/ums.styles.css']
})
export class SalesopportunityCuvComponent {
  isSubmitted: boolean = false;
  title: string = "Add";
  salesOppourtinityForm!: FormGroup;
  serviceForm: FormGroup;
  transPortForm: FormGroup;
  inCoTermForm: FormGroup;
  commodityForm: FormGroup;
  countryForm: FormGroup;
  destinationForm: FormGroup;
  viewMode: boolean = false;
  date = new Date;
  disablefields: boolean = false;
  gereralEdit: boolean;
  liveStatus = 1;
  currencyList: Currency[];
  filteredCurrencyListOptions$: Observable<any[]>;
  airFright: number;
  billingCurrencyList: BillingCurrencys[];
  filteredbillingCurrencyListOptions$: Observable<any[]>;
  inCoTerms: number;
  filteredsalesOwnerOptions$: any;
  customClearance: number;
  filteredsalesExecutiveOptions$: Observable<any[]>;
  transportation: any;
  filteredindustryOptions$: Observable<any[]>;
  industryList: Industry[];
  ioreor: any;
  CVtypeList: CVTypeModel[];
  filteredcustypeOptions$: Observable<any>;
  cvTypeId: any;
  ReportingStageList: ReportingStageModel[];
  filteredReportingStageOptions$: Observable<any[]>;
  jobNotificationStageId: any;
  serviceTypeList: ServiceSector[];
  countryTypeList: Country[];
  modeOfTransportList: ModeofTransports[];// Initialize the array
  incoTermsList: Incoterm[];
  commodityTypeList: Commodity[];
  filteredServiceTypeListOptions$: Observable<any[]>;
  filteredCountryTypeListOptions$: Observable<any[]>;
  filteredDestinationTypeListOptions$: Observable<any[]>;
  filteredCommodityListOptions$: Observable<any[]>;
  filteredIncoTermsListOptions$: Observable<any[]>;
  filteredModeOfTransportListOptions$: Observable<any[]>;
  filteredcustomerName: Observable<any[]> | undefined;

  Commodities: Commodity[] = [];
  customerId: number;

  serviceSectorId: any[] = [];
  commodityId: any[] = [];
  countryId: any[] = [];
  incoTermId: any[] = [];
  // transportModeId:any[]=[];
  modeofTransportId: number;

  keywordDoc = 'documentName'

  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  showAddRowDoc: boolean;
  onSelectDoc: boolean;
  remarks: any;
  documentId: any;
  fileType: boolean;
  filePath: any;
  existDoc: boolean;
  documentName: any;
  salesOpportunity: SalesOpportunity;
  sODestination: SODestination[] = [];
  sOOrigin: SOOrigin[] = [];
  sOService: SOService[] = [];
  soIncoterms: SOIncoTerms[] = [];
  sOCommodity: SOCommodity[] = [];
  soTransport: SOTransportModeModel[] = [];
  salesOppourtinity: SalesOpportunity = new SalesOpportunity();
  editedSalesOpportunity: SalesOpportunity | null = null;
  rowIndexforDoc: number;
  salesOppourtinityContainer: SalesOpportunityContainer;
  editDocumet: any;
  rowIndexContact: number;
  editedContact: any;
  rowIndexAddress: any;
  editedAddress: any;
  SalesOppId: number;
  salesOppourtinityRankingId: any;
  filteredsalesOppourtinityRankingOptions$: Observable<any[]>;
  filteredsalesOppourtinityRankingOptions1$: Observable<any[]>;
  fileInput: any;
  file: any;
  fileName: any;
  updatevalues: any[] = [];
  selected: number[] = [];
  buttonDraft: boolean;
  filteredinfosourceOptions$: any;
  infosourceList: Infosource[] = [];
  informationSourceId: any;
  CommunicationList: ModeofFollowUp[];
  filteredcommunicationOptions$: any;
  modeofFollowUpId: any;
  statusList: StatusTypeInC[];
  filteredStatusOptions$: any;
  cStatusId: number;
  buttonSave: boolean;
  SalesOpportunity: SalesOpportunity;
  salesOppourtinityTranports: any;
  salesOppourtinityInCoTerms: any;
  warehouseing: any;
  salesOpportunityRemarks: any;
  tags: any;
  incoTerm: any;
  SOCommodityId: any;
  SOServiceId: any;
  soOriginId: any;
  NewCustomer: any[] = [];
  SODestinationId: any;
  SalesOpportunityService: any[];
  salesOppourtinityService: any;
  customers: Observable<any[]>;
  selectedCustomerId: number;
  potentialCustomerForm: any;
  customerName: any;
  customer: any;
  potentialCustomer: PotentialCustomer;
  customerForm: any;
  route: any;
  userId$: string;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private commonService: CommonService,
    private commodityService: CommodityService,
    private incoTermsService: IncoTermService,
    private ErrorHandling: ErrorhandlingService,
    private potentialCustomerService: PotentialCustomerService,
    private serviceTypeService: ServiceTypeServiceService,
    private salesOpportunityService: SalesOpportunityService,
    private UserIdstore: Store<{ app: AppState }>,
    private _route: ActivatedRoute) {
    this.iniForm();
  }

  ngOnInit() {
    this.GetUserId();
    this.buttonDraft = true;
    this.buttonSave = false;
    this.getAllIncoTerms();
    this.getCommodity();
    this.GetAllServiceType();
    this.GetModeOfTransport();
    this.GetAllCountry();
    this.customerId = this.potentialCustomerService.itemId;
    if (this.customerId != 0) {
      debugger
      this.salesOpportunityService.getSalesOpportunityByCustomerId(this.customerId).subscribe(res => {
        if (res != null) {
          if (this.potentialCustomerService.isEdit) {
            this.viewMode = false;
          } else {
            this.viewMode = true;
            this.disablefields = true;

          }
          this.title = "Edit";
          const id = res.salesOppId
          this.getAllbyId(id)
          this.salesOppourtinityForm.controls['salesOppId'].setValue(id);
          return
        }
      })
    }
    if (this.potentialCustomerService.itemId) {
      this.title = 'Add';
      if (this.potentialCustomerService.isAdd) {
        this.viewMode = false;
      } else {
        this.viewMode = true;
        this.disablefields = true;

      }
      this.gereralEdit = true;
      this.disablefields = false;
      this.getPCbyId(this.customerId);
    }

  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getPCbyId(id: number) {
    debugger
    this.potentialCustomerService.getAllPotentialCustomerById(id).subscribe(result => {
      this.potentialCustomer = result.potentialCustomer;
      // General value patch
      this.salesOppourtinityForm.patchValue(result.potentialCustomer);
      //this.customerId = 0;
      this.selectedCustomerId = result.potentialCustomer.potentialCustomerId
      this.salesOppourtinityForm.controls['customerId'].setValue(this.selectedCustomerId);    // Assign selected customer ID
      //this.salesOppourtinityForm.controls['customerId'].setValue(0);   

      // console.log(this.selectedCustomerId)
      // const selectedServicetypes = [this.potentialCustomer.serviceId];
      // this.salesOppourtinityForm.controls['serviceType'].setValue(selectedServicetypes);
      // const test = this.salesOppourtinityForm.controls['serviceType'].value;
    });
  }



  getAllbyId(id: any) {
    debugger
    this.salesOpportunityService.getAllSalesOpportunityById(id).subscribe((result: any) => {
      const firstItem = result;
      this.salesOppourtinityContainer = firstItem;
      this.salesOpportunity = firstItem.salesOpportunity;
      this.soIncoterms = firstItem.soIncoterms;
      this.soTransport = firstItem.sOTransportMode;
      this.sOCommodity = firstItem.sOCommodity;
      this.sOService = firstItem.sOService;
      this.sODestination = firstItem.sODestination
      this.sOOrigin = firstItem.sOOrigin;
      this.salesOppourtinityForm.patchValue(this.salesOppourtinity);
      this.salesOppourtinityForm.controls['customerRemarks'].setValue(firstItem.salesOpportunity.customerRemarks)
      this.salesOppourtinityForm.controls['tags'].setValue(firstItem.salesOpportunity.tags)
      this.salesOppourtinityForm.controls['jobsPerMonth'].setValue(firstItem.salesOpportunity.jobsPerMonth)
      this.salesOppourtinityForm.controls['seaFreight'].setValue(firstItem.salesOpportunity.seaFreight)
      this.salesOppourtinityForm.controls['airFreight'].setValue(firstItem.salesOpportunity.airFreight)
      this.salesOppourtinityForm.controls['transportation'].setValue(firstItem.salesOpportunity.transportation)
      this.salesOppourtinityForm.controls['ioreor'].setValue(firstItem.salesOpportunity.ioreor)
      this.salesOppourtinityForm.controls['warehousing'].setValue(firstItem.salesOpportunity.warehousing)
      this.salesOppourtinityForm.controls['customClearance'].setValue(firstItem.salesOpportunity.customClearance)
      this.setValues();
    });
  }

  setValues() {
    debugger
    const selectedCommodits = this.sOCommodity.map(val => val.commodityId);
    this.salesOppourtinityForm.controls['commodity'].setValue(selectedCommodits);
    const selectedincoTerms = this.soIncoterms.map(val => val.incoTermId);
    this.salesOppourtinityForm.controls['incoTerm'].setValue(selectedincoTerms);
    const selectedCountries = this.sOOrigin.map(val => val.countryId);
    this.salesOppourtinityForm.controls['country'].setValue(selectedCountries);
    const selectedServicetypes = this.sOService.map(val => val.serviceSectorId);
    this.salesOppourtinityForm.controls['serviceType'].setValue(selectedServicetypes);
    const selectedDestinations = this.sODestination.map(val => val.countryId);
    this.salesOppourtinityForm.controls['destination'].setValue(selectedDestinations);
    const selectedTransports = this.soTransport.map(val => val.modeofTransportId);
    this.salesOppourtinityForm.controls['transport'].setValue(selectedTransports);

  }

  //--------get all dropdown--------------------------------

  GetAllServiceType() {
    this.commonService.GetAllServiceSector().subscribe((res: ServiceSector[]) => {
      this.serviceTypeList = res;
      this.ServiceTypeFun();
    })
  }
  ServiceTypeFun() {
    this.filteredServiceTypeListOptions$ = this.salesOppourtinityForm.controls['serviceType'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.serviceSector)),
      map((name: any) => (name ? this.filteredServiceTypeListOptions(name) : this.serviceTypeList?.slice()))
    );
  }
  private filteredServiceTypeListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.serviceTypeList.filter((option: any) => option.serviceSector.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataServiceType();
  }
  NoDataServiceType(): any {
    this.salesOppourtinityForm.controls['serviceType'].setValue('');
    return this.serviceTypeList;
  }
  displayServiceTypeListLabelFn(data: any): string {
    return data && data.serviceSector ? data.serviceSector : '';
  }
  ServiceTypeListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.serviceSectorId = selectedValue.serviceSectorId;
  }
  //#endregion


  //#region commodity
  getCommodity() {
    this.commodityService.getAllActiveCommodity().subscribe((res: Commodity[]) => {
      this.commodityTypeList = res;
      this.CommodityFun();
    })
  }

  CommodityFun() {
    this.filteredCommodityListOptions$ = this.salesOppourtinityForm.controls['commodity'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.commodityName)),
      map((name: any) => (name ? this.filteredCommodityListOptions(name) : this.commodityTypeList?.slice()))
    );
  }

  private filteredCommodityListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.commodityTypeList.filter((option: any) => option.commodityName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCommodity();
  }

  NoDataCommodity(): any {
    this.salesOppourtinityForm.controls['commodity'].setValue('');
    return this.commodityTypeList;
  }
  displayCommodityListLabelFn(data: any): string {
    return data && data.commodityName ? data.commodityName : '';
  }
  CommodityListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.commodityId = selectedValue.commodityId;
  }
  //#endregion

  //#region incoterms
  getAllIncoTerms() {
    this.incoTermsService.getIncoterms(this.liveStatus).subscribe((res: Incoterm[]) => {
      this.incoTermsList = res;
      this.IncoTermsFun();
      console.log(this.incoTermsList)
    })
  }
  IncoTermsFun() {
    this.filteredIncoTermsListOptions$ = this.salesOppourtinityForm.controls['incoTerm'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.incoTermCode)),
      map((name: any) => (name ? this.filteredIncoTermsListOptions(name) : this.incoTermsList?.slice()))
    );
  }
  private filteredIncoTermsListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.incoTermsList.filter((option: any) => option.incoTermCode.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataIncoTerms();
  }
  NoDataIncoTerms(): any {
    this.salesOppourtinityForm.controls['incoTerm'].setValue('');
    return this.incoTermsList;
  }
  displayIncoTermsListLabelFn(data: any): string {
    return data && data.incoTermCode ? data.incoTermCode : '';
  }
  IncoTermsListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.incoTermId = selectedValue.incoTermId;
  }

  //#endregion

  //#region ModeofTransport
  GetModeOfTransport() {
    debugger
    // this.jobtypeService.GetAllModeofTransport().subscribe((res:any) => {
    this.commonService.getAllModeofTransport().subscribe((res: ModeofTransports[]) => {
      this.modeOfTransportList = res;
      this.ModeOfTransportFun();
      console.log(this.modeOfTransportList)
    })
  }
  ModeOfTransportFun() {
    this.filteredModeOfTransportListOptions$ = this.salesOppourtinityForm.controls['transport'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofTransport)),
      map((name: any) => (name ? this.filteredModeOfTransportListOptions(name) : this.modeOfTransportList?.slice()))
    );
  }
  private filteredModeOfTransportListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.modeOfTransportList.filter((option: any) => option.modeofTransport.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataModeOfTransport();
  }
  NoDataModeOfTransport(): any {
    this.salesOppourtinityForm.controls['transport'].setValue('');
    return this.modeOfTransportList;
  }
  displayModeOfTransportListLabelFn(data: any): string {
    return data && data.modeofTransport ? data.modeofTransport : '';
  }
  ModeOfTransportListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.modeofTransportId = selectedValue.modeofTransportId;
    //this.modeofTransportId = selectedValue.modeofTransportId;
  }
  //#endregion 

  GetAllCountry() {
    this.commonService.getCountries(this.liveStatus).subscribe((res: any) => {
      this.countryTypeList = res;
      this.CountryFun();
    })
  }
  CountryFun() {
    this.filteredCountryTypeListOptions$ = this.salesOppourtinityForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this.filteredCountryListOptions(name) : this.countryTypeList?.slice()))
    );
  }
  private filteredCountryListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.countryTypeList.filter((option: any) => option.countryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataServiceType();
  }
  NoDataCountry(): any {
    this.salesOppourtinityForm.controls['country'].setValue('');
    return this.countryTypeList;
  }
  displayCountryListLabelFn(data: any): string {
    return data && data.countryName ? data.countryName : '';
  }
  CountryListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.countryId = selectedValue.countryId;
  }
  //-------Keydown------------------------
  handleChangeC(event: any) {
    this.salesOppourtinityForm.controls['salesOppourtinityRevenue'].setValue('');
    this.salesOppourtinityRankingId = '';
  }
  handleChangeR(event: any) {
    this.salesOppourtinityForm.controls['salesOppourtinityRevenue'].setValue('');
    this.salesOppourtinityForm.controls['salesOppourtinityRankingId'].setValue('');
    this.salesOppourtinityRankingId = '';
  }

  //---------------------SalesOpportunity---------------------------

  iniForm() {
    this.salesOppourtinityForm = this.fb.group({
      salesOppId: [0],
      customerName: ['', Validators.required],
      customerId: [null],
      commodity: [],
      serviceType: [],
      jobsPerMonth: [null],
      country: [],
      destination: [],
      tags: [''],
      customerRemarks: [''],
      seaFreight: [''],
      airFreight: [''],
      incoTerm: [],
      customClearance: [''],
      transportation: [''],
      ioreor: [''],
      warehousing: [''],
      transport: [],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date],
    });
  }
  setName() {
    const name = this.salesOppourtinityForm.controls['salesOppourtinityName'].value
    this.salesOppourtinityForm.controls['aliasName'].setValue(name);
  }

  onselectService() {
    debugger
    const selectedServices = this.salesOppourtinityForm.controls['serviceType'].value;
    const uniqueSelectedServices = selectedServices.filter(
      (selectedService: any) =>
        !this.sOService.some(
          (existingService: any) => existingService.serviceSectorId === selectedService
        )
    );
    // Add new services to the array
    uniqueSelectedServices.forEach((selectedService: any) => {
      this.serviceForm = this.fb.group({
        cServiceId: [0],
        SalesOppId: [0],
        serviceSectorId: [selectedService],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date],
      });
      this.sOService.push(this.serviceForm.value);
    });
    const uncheckedServices = this.sOService.filter(
      (existingService: any) =>
        !selectedServices.includes(existingService.serviceSectorId)
    );
    uncheckedServices.forEach((uncheckedService: any) => {
      const index = this.sOService.findIndex(
        (existingService: any) =>
          existingService.serviceSectorId === uncheckedService.serviceSectorId
      );
      if (index !== -1) {
        this.sOService.splice(index, 1);
      }
    });
  }
  onselectCommodity(event: any) {
    debugger;
    const selectedCommodities = this.salesOppourtinityForm.controls['commodity'].value;
    const uniqueSelectedCommodities = selectedCommodities.filter(
      (selectedCommodity: any) =>
        !this.sOCommodity.some(
          (existingCommodity: any) => existingCommodity.commodityId === selectedCommodity
        )
    );

    uniqueSelectedCommodities.forEach((selectedCommodity: any) => {
      this.commodityForm = this.fb.group({
        sOcommodityId: [0],
        SalesOppId: [0],
        commodityId: [selectedCommodity],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date],
      });
      this.sOCommodity.push(this.commodityForm.value);
    });

    const uncheckedCommodities = this.sOCommodity.filter(
      (existingCommodity: any) =>
        !selectedCommodities.includes(existingCommodity.commodityId)
    );

    uncheckedCommodities.forEach((uncheckedCommodity: any) => {
      const index = this.sOCommodity.findIndex(
        (existingCommodity: any) =>
          existingCommodity.commodityId === uncheckedCommodity.commodityId
      );
      if (index !== -1) {
        this.sOCommodity.splice(index, 1);
      }
    });
    console.log('com', this.sOCommodity);
  }
  onselectTransport(event: any) {
    debugger
    if (!this.soTransport) {
      this.soTransport = [];
    }

    const selectedTransports = this.salesOppourtinityForm.controls['transport'].value;
    const uniqueSelectedTransports = selectedTransports.filter(
      (selectedTransport: any) =>
        !this.soTransport.some(
          (existingTransport: any) => existingTransport.modeofTransportId === selectedTransport
        )
    );
    // Add new services to the array
    uniqueSelectedTransports.forEach((selectedTransport: any) => {
      this.transPortForm = this.fb.group({
        sOTransportModeId: [0],
        SalesOppId: [0],
        modeofTransportId: [selectedTransport],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date],

      });
      this.soTransport.push(this.transPortForm.value);
    });
    const uncheckedTranports = this.soTransport.filter(
      (existingTransport: any) =>
        !selectedTransports.includes(existingTransport.modeofTransportId)
    );
    uncheckedTranports.forEach((uncheckedTranports: any) => {
      const index = this.soTransport.findIndex(
        (existingTransport: any) =>
          existingTransport.modeofTransportId === uncheckedTranports.modeofTransportId
      );
      if (index !== -1) {
        this.soTransport.splice(index, 1);
      }
    });
  }
  onselectIncoTerms(event: any) {
    debugger
    const selectedInCoTerms = this.salesOppourtinityForm.controls['incoTerm'].value;
    const uniqueSelectedInCoTerms = selectedInCoTerms.filter(
      (selectedInCoTerms: any) =>
        !this.soIncoterms.some(
          (existingInCoTerms: any) => existingInCoTerms.incoTermId === selectedInCoTerms
        )
    );
    // Add new services to the array
    uniqueSelectedInCoTerms.forEach((selectedInCoTerms: any) => {
      this.inCoTermForm = this.fb.group({
        sOIncoId: [0],
        SalesOppId: [0],
        incoTermId: [selectedInCoTerms],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date],
      });
      this.soIncoterms.push(this.inCoTermForm.value);
    });
    const uncheckedInCoTerms = this.soIncoterms.filter(
      (existingInCoTerms: any) =>
        !selectedInCoTerms.includes(existingInCoTerms.incoTermId)
    );
    uncheckedInCoTerms.forEach((uncheckedInCoTerms: any) => {
      const index = this.soIncoterms.findIndex(
        (existingInCoTerms: any) =>
          existingInCoTerms.incoTermId === uncheckedInCoTerms.incoTermId
      );
      if (index !== -1) {
        this.soIncoterms.splice(index, 1);
      }
    });
  }
  onselectCountries(event: any) {
    debugger
    const selectedCountries = this.salesOppourtinityForm.controls['country'].value;
    const uniqueSelectedCountries = selectedCountries.filter(
      (selectedCountries: any) =>
        !this.sOOrigin.some(
          (existingCountries: any) => existingCountries.countryId === selectedCountries
        )
    );
    // Add new services to the array
    uniqueSelectedCountries.forEach((selectedCountries: any) => {
      this.countryForm = this.fb.group({
        soOriginId: [0],
        SalesOppId: [0],
        countryId: [selectedCountries],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date],
      });
      this.sOOrigin.push(this.countryForm.value);
    });
    const uncheckedCountries = this.sOOrigin.filter(
      (existingCountries: any) =>
        !selectedCountries.includes(existingCountries.countryId)
    );
    uncheckedCountries.forEach((uncheckedCountries: any) => {
      const index = this.sOOrigin.findIndex(
        (existingCountries: any) =>
          existingCountries.countryId === uncheckedCountries.countryId
      );
      if (index !== -1) {
        this.sOOrigin.splice(index, 1);
      }
    });
  }
  onselectDestinations(event: any) {
    const selectedDestinations = this.salesOppourtinityForm.controls['destination'].value;
    const uniqueSelectedDestinations = selectedDestinations.filter(
      (selectedDestinations: any) =>
        !this.sODestination.some(
          (existingDestinations: any) => existingDestinations.countryId === selectedDestinations
        )
    );
    // Add new services to the array
    uniqueSelectedDestinations.forEach((selectedDestinations: any) => {
      this.destinationForm = this.fb.group({
        sODestinationId: [0],
        SalesOppId: [0],
        countryId: [selectedDestinations],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date],
      });
      this.sODestination.push(this.destinationForm.value);
    });
    const uncheckedDestinations = this.sODestination.filter(
      (existingDestinations: any) =>
        !selectedDestinations.includes(existingDestinations.countryId)
    );
    uncheckedDestinations.forEach((uncheckedDestinations: any) => {
      const index = this.sODestination.findIndex(
        (existingDestinations: any) =>
          existingDestinations.countryId === uncheckedDestinations.countryId
      );
      if (index !== -1) {
        this.sODestination.splice(index, 1);
      }
    });
  }



  onSaveGeneral() {
    debugger
    if (this.salesOppourtinityForm.valid) {
      this.salesOppourtinity = this.salesOppourtinityForm.value;
      this.salesOppourtinity.jobsPerMonth = this.salesOppourtinityForm.controls['jobsPerMonth'].value,
        this.salesOppourtinity.seaFreight = this.salesOppourtinityForm.controls['seaFreight'].value,
        this.salesOppourtinity.airFreight = this.salesOppourtinityForm.controls['airFreight'].value,
        this.salesOppourtinity.customClearance = this.salesOppourtinityForm.controls['customClearance'].value,
        this.salesOppourtinity.transportation = this.salesOppourtinityForm.controls['transportation'].value,
        this.salesOppourtinity.ioreor = this.salesOppourtinityForm.controls['ioreor'].value,
        this.salesOppourtinity.warehousing = this.salesOppourtinityForm.controls['warehousing'].value,
        this.salesOppourtinity.customerRemarks = this.salesOppourtinityForm.controls['customerRemarks'].value,
        this.salesOppourtinity.tags = this.salesOppourtinityForm.controls['tags'].value,
        this.salesOppourtinityForm.controls['customerId'].setValue(this.selectedCustomerId);
      this.salesOppourtinity.customerId = this.selectedCustomerId;
      this.salesOppourtinity.updatedBy = parseInt(this.userId$);
      const ModelContainer: SalesOpportunityContainer = {
        salesOpportunity: this.salesOppourtinity,
        soIncoterms: this.soIncoterms,
        sOCommodity: this.sOCommodity,
        sOTransportMode: this.soTransport,
        sOOrigin: this.sOOrigin,
        sODestination: this.sODestination,
        sOService: this.sOService
      };
      if (this.salesOppourtinityForm.value.salesOppId == 0 || this.salesOppourtinityForm.value.salesOppId == undefined) {
        this.salesOpportunityService.SaveSalesOpportunity(ModelContainer).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
              "Added Successfully"
            );
            this.returnToList();
          },
          error: (error) => {
            console.log(error)
            var ErrorHandle = this.ErrorHandling.handleApiError(error)
            this.commonService.displayToaster(
              "error",
              "Error",
              ErrorHandle
            );
          },
        });
      } else {
        this.salesOpportunityService.SaveSalesOpportunity(ModelContainer).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
              "Updated Successfully"
            );
            this.returnToList();
          },
          error: (error) => {
            console.log(error);
            const ErrorHandle = this.ErrorHandling.handleApiError(error);
            this.commonService.displayToaster(
              "error",
              "Error",
              ErrorHandle
            );
          },
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  returnToList() {
    this.router.navigate(["/crm/master/potentialcustomerlist"]);
    this.salesOpportunityService.itemId = 0;

  }
  resetGeneral() {
    if (this.gereralEdit) {
      this.salesOppourtinityForm.reset();
      this.salesOppourtinityContainer = new SalesOpportunityContainer()
      this.salesOpportunity = new SalesOpportunity();
      this.soIncoterms = []
      this.soTransport = [];
      this.sOCommodity = [];
      this.sOService = [];
      this.sODestination = [];
      this.sOOrigin = [];
      this.getPCbyId(this.customerId);
      this.title = "Add Sales Opportunity";
    }
    this.salesOpportunityService.getSalesOpportunityByCustomerId(this.customerId).subscribe(res => {
      if (res != null) {
        this.title = "Edit Sales Opportunity";
        const id = res.salesOppId
        this.getAllbyId(id)
        this.salesOppourtinityForm.controls['salesOppId'].setValue(id);
      }
    })
  }
  value(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.startsWith('0') && value.length > 1) {
      value = value.slice(1);
    }
    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    input.value = value;
    this.salesOppourtinityForm.controls['jobsPerMonth'].setValue(value);
  }
}
