import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { Airport } from 'src/app/Models/crm/master/Airport';
import { ApprovalStatusModel, BillingCurrencys, CargoTypes, ExchangeModel, ModeofTransports, ShipmentTypes, Transport, quotationAgainst, quotationCRStatus, quotationStatus } from 'src/app/Models/crm/master/Dropdowns';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { Reason } from 'src/app/Models/crm/master/Reason';
import { Seaport } from 'src/app/Models/crm/master/Seaport';
import { TrailerType } from 'src/app/Models/crm/master/trailerType';
import { CustomerCategory } from 'src/app/Models/crm/master/transactions/CustomerCategory';
import { Enquiry } from 'src/app/Models/crm/master/transactions/Enquiry';
import { City } from 'src/app/Models/ums/city.model';
import { AirportService } from 'src/app/crm/master/airport/airport.service';
import { ContainerType } from 'src/app/crm/master/containertype/containertype.model';
import { ContainerTypeService } from 'src/app/crm/master/containertype/containertype.service';
import { Customer, CustomerAddress } from 'src/app/crm/master/customer/customer.model';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { InfosourceService } from 'src/app/crm/master/infosource/infosource.service';
import { PotentialCustomer, PotentialCustomerAddress, PotentialCustomerContact } from 'src/app/crm/master/potential-customer/potential-customer.model';
import { PotentialCustomerService } from 'src/app/crm/master/potential-customer/potential-customer.service';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor.service';
import { SeaportService } from 'src/app/crm/master/seaport/seaport.service';
import { TrailerTypeService } from 'src/app/crm/master/trailer-type/trailer-type.service';
import { UOM } from 'src/app/crm/master/unitofmeasure/unitofmeasure.model';
import { UOMsService } from 'src/app/crm/master/unitofmeasure/unitofmeasure.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { EnquiryService } from 'src/app/crm/transaction/Enquiry/enquiry.service';
import { PortofDestination, PortofLoading } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation.model';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { CommonService } from 'src/app/services/common.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { Employee } from 'src/app/ums/masters/employee/employee.model';
import Swal from 'sweetalert2';
import { QLIVendorValue, QLIVendorValueDetail, QPackage, QlineItem, QuotationContainer, qCommodity, qIncoTerm, qTransportMode, quotationDocument } from '../quotation-model/quote';
import { MatDialog } from '@angular/material/dialog';
import { QuotationpackagedialogComponent } from '../quotationpackagedialog/quotationpackagedialog.component';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { JobCategory, JobTypeGeneral, JTModeofTransport } from 'src/app/crm/master/jobtype/jobtypemodel.model';
import { Documents } from 'src/app/Models/crm/master/documents';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment.development';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { QuotationlineitemComponent } from '../quotationlineitem/quotationlineitem.component';
import { VendorvalueComponent } from '../vendorvalue/vendorvalue.component';
import { QuotationService } from '../quotation.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
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
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class QuotationComponent implements OnInit {
  Quotation: FormGroup;
  content = new FormControl();
  QDoc: FormGroup;
  filteredOptions: Observable<any[]>;
  filteredRefNumberOptions: Observable<any[]>;
  filteredCustomerCategoryOptions: Observable<any[]>;
  filteredCustomerOptions: Observable<any[]>;
  filteredCustomerAddressOptions: Observable<any[]>;
  filteredCustomerContactOptions: Observable<any[]>;
  filteredSalesOwnerOptions: Observable<any[]>;
  filteredSalesExecutiveOptions: Observable<any[]>;
  filteredbillingCurrencyListOptions$: Observable<any[]>;
  filteredCountryOptions$: Observable<any[]>;
  filteredinfosourceOptions$: any;
  filteredreasonOptions$: Observable<any[]>;
  filteredoriginCityOptions$: Observable<any[]>;
  filteredCountryOptionsDest$: Observable<any[]>;
  filteredloadingportOptions$: Observable<any[]>;
  filtereddestportOptions$: Observable<any[]>;
  filteredDestCityOptions$: Observable<any[]>;
  filteredTrailerOptions$: Observable<any[]>;
  filteredContainerOptions$: Observable<any[]>;
  filteredUOMOptions$: Observable<any[]>;
  filteredjobTypeOptions$: Observable<any[]>;
  filteredCargoOptions$: any;
  cargoList: CargoTypes[];
  EnquiryList: Enquiry[];
  selectedrefnumberid: any;
  customercategoryList: CustomerCategory[] = [];
  customerList: Customer[] = [];
  potentailList: PotentialCustomer[] = [];
  filtereddocumentId: Observable<Documents[]> | undefined;
  CustDropDown: any[] = [];
  selectedcustometid: any;
  selectedcuscategoryid: any;
  SelectedSalesOwnerId: any;
  SelectedSalesExecutiveId: any;
  customerContact: any[] = [];
  ContactDropDown: any[] = [];
  date = new Date();
  TrailerType: TrailerType[] = [];
  potentialCustomerAddress: PotentialCustomerAddress[] = [];
  filteredTransportOptions$: Observable<any[]>;
  filteredshipmentOptions$: Observable<any[]>;
  CAdressDropDown: any[] = [];
  SelectedAddressId: number;
  customerAddress: CustomerAddress[] = [];
  selectedcuscontact: any;
  EmployeeList: Employee[] = [];
  transportList: Transport[];
  userId$: string;
  selectedemployeeid: any;
  selectedSalesExecutiveId: any;
  Edits:boolean;

  selectedbillCurrencyId: any;
  reasonList: Reason[] = [];
  uomList: UOM[];
  selectedreasonId: any;
  infosourceList: Infosource[] = [];
  shipmentList: ShipmentTypes[];
  selectedinformationSourceId: any;
  informationSourceName: any;
  reference: boolean;
  selectedcargoTypeId: number;
  CountryDatalist: Country[];
  selectedoriginCountryId: any;
  countryName: any;
  DestCityList: City[];
  originCityList: City[];
  selectedoriginLocationId: any;
  destinationPortId: any;
  destCountryId: any;
  loadingPortId: any;
  destcountryName: any;
  originCountryId: any;
  airportListOrigin: Airport[];
  airportListDest: Airport[];
  seaportListOrigin: Seaport[];
  portofLoadingList: PortofLoading[] = [];
  portofDestinationList: PortofDestination[] = [];
  seaportList: any[];
  destLocationId: any;
  trailerTypeId: any;
  transportTypeId: any;
  shipmentTypeId: any;
  containerList: ContainerType[];
  containerTypeId: any;
  storageUomId: any;
  QPackage: any[] = [];
  qCommodity: any[] = [];
  IncoForm: FormGroup;
  TransportForm: FormGroup;
  CommodityForm: FormGroup;
  CommodityId: any;
  CommodityList: any[]=[];
  incotermList: any[]=[];
  incoTermId: any;
  qIncoTerm: any[] = [];
  jobCategoryList: JobCategory[];
  qTransportMode: any[] = [];
  seaportSelected: boolean;
  modeofTransportList: ModeofTransports[];
  filteredjobCategoryOptions$: any;
  jobCategoryId: any;
  jobTypeList: JobTypeGeneral[];
  jobTypeId: any;
  document: Documents[] = [];
  showAddRowDoc: any;
  DocRemarks: any;
  RFQDoc: any;
  SelectedDocumentId: any;
  qdocument: any[] = [];
  ImageDataArray: any[] = [];
  skip = 0;
  pageSize = 10;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  Filepath = environment.Fileretrive;
  ImageDetailsArray: any[] = [];
  QAgainst: quotationAgainst[] = [];
  selectedQagainstId: any;
  quoteStatusList: quotationStatus[] = [];
  selectedQuoteStatusId: any;
  filteredQuoteStatusOptions$: Observable<any[]>;
  filteredApprovalStatusOptions$: Observable<any>;
  approvalStatusList: ApprovalStatusModel[] = [];
  selectedApprovalStatusId: any;
  filteredClientResponseOptions$: Observable<any>;
  clientResponseList: quotationCRStatus[] = [];
  selectedClientResponseId: any;
  LineItems: QlineItem[] = [];
  billingCurrencyList: Currency[];
  ShowOnlyroad: boolean;
  ShowOnlysea: boolean;
  chargablepackage: boolean;
  airportflag: boolean;
  seapoartflag: boolean;
  city: City[] = [];
  Destcity: City[] = [];
  airport: any[] = [];
  seapoart: any[] = [];
  QLIVendorValue: any[]=[];
  ContactForm: FormGroup;
  Contactperson: any[]=[];
  hidden: boolean;
  enableforwarehouse: boolean;
  displaytype: any[]=[];
  filteredQuoteDisplayOptions$: Observable<any[]>;
  storageQuoteId: any;
  storageQuoteDisplayId: any;
  revision: boolean;
  edit: any;
  JobtypeModeoftans:JTModeofTransport[]=[];
  jobtypeIncoTerms: number;
  ispackage: boolean;
  invalidLineItem: any[]=[];
  Editing: boolean =false;
  exchangeValue:ExchangeModel;
  exchangerate: number;
  vendorcurrency: any;
  mincurrency: any;
  QLIVendorValueDetails: any[]=[];
  quotationID: any;
  selectedOption: any;
  LineItemsnew: QlineItem[];
  UnknownValueList: any[]=[];
;
  revis: boolean=false;
  view: boolean=false;
  disablefields: boolean = false;
  Mode="Edit";
  minQuoteValidToDate: Date | null = null;
  isEditDocument: boolean;
  selectedIndex = 0;

  constructor(private fb: FormBuilder,
    private Es: EnquiryService,
    private Cservice: CommonService,
    private PCs: PotentialCustomerService,
    private Cus: CustomerService,
    private reasonmstSvc: ReasonService,
    private infosourceService: InfosourceService,
    private trailerTypeService: TrailerTypeService,
    private containerTypeService: ContainerTypeService,
    private uomService: UOMsService,
    private airportService: AirportService,
    private seaportService: SeaportService,
    private vendorService: VendorService,
    private potentialVendorService: PotentialVendorService,
    private ErrorHandling: ErrorhandlingService,
    private UserIdstore: Store<{ app: AppState }>,
    private Fs: FileuploadService,
    public dialog: MatDialog,
    private commodityService: CommodityService,
    private incoTermService: IncoTermService,
    private jobtypeService: JobtypeserviceService,
    private docs: DocmentsService,
    private Qs: QuotationService,
    private router: Router,
    private route: ActivatedRoute,
    private Jtype: JobtypeserviceService,
    private datePipe: DatePipe,
    private errorHandler: ApiErrorHandlerService
  ) {

  }
  ngOnInit(): void {
    this.initializeForm();
    this.InitializeDoc();
    this.GetUserId();
    this.QAgainstdrp();
    this.Cuscategory();
    this.Employee();
    this.getbillingCurrencyList();
    this.getReasons();
    this.getAllInfosource();
    this.getCargoList();
    this.GetTrailerType();
    this.GetTransport();
    this.getAllShipmentTypes();
    this.getAllContainer();
    this.getAllUOMList();
    this.getCommodityList();
    this.getIncotermList();
    this.getTransportList();
    this.getjobCategoryList();
    this.Document();
    this.getCountryMaster();
    this.getQuoteStatuses();
    this.getApprovalStatus();
    this.getClientResponses();
    this.QuoteDisplay();
    this.EditQuotation();
    this.ViewQuotation();
    this.Revision();
    this.selectedQuoteStatusId = 1;

    // Check if quotationDate has a value on page load
    this.Quotedatevalidation();
    
    if(this.Edits==false&& this.view==false && this.revis==false){
      this.getDocuments();
    } 
    this.getUnknownValues();
  }

  Quotedatevalidation(){
     // Check if quotationDate has a value on page load
  const enquiryDateValue = this.Quotation.controls['quotationDate'].value;

  if (enquiryDateValue) {
    const enquiryDate = new Date(enquiryDateValue);
    enquiryDate.setHours(0, 0, 0, 0);

    // Set the minimum date for quoteValidTo (same as enquiryDate)
    this.minQuoteValidToDate = enquiryDate;

    // Add 30 days to enquiryDate for the default quoteValidTo value
    const validToDate = new Date(enquiryDate);
    validToDate.setDate(validToDate.getDate() + 30);

    // Set the quoteValidTo form control on page load
    this.Quotation.controls['quoteValidTo'].setValue(validToDate, { emitEvent: false });
  }

  // Subscribe to quotationDate changes to update quoteValidTo dynamically
  this.Quotation.controls['quotationDate'].valueChanges.subscribe((newEnquiryDateValue) => {
    if (newEnquiryDateValue) {
      const newEnquiryDate = new Date(newEnquiryDateValue);
      newEnquiryDate.setHours(0, 0, 0, 0);

      // Set the minimum date for quoteValidTo
      this.minQuoteValidToDate = newEnquiryDate;

      // Add 30 days to the newEnquiryDate for the quoteValidTo field
      const newValidToDate = new Date(newEnquiryDate);
      newValidToDate.setDate(newValidToDate.getDate() + 30);

      // Update the quoteValidTo form control
      this.Quotation.controls['quoteValidTo'].setValue(newValidToDate, { emitEvent: false });
    }
  });
  }
  //#region initializeForm
  initializeForm() {
    const currentDate = new Date();
    this.Quotation = this.fb.group({
      quotationId: [0],
      quotationNumber: [{ value: '', disabled: true }],
      quotationFullNumber: [{ value: '', disabled: true }],
      quotationDate: [currentDate, Validators.required],
      quotationAgainstId: ['', Validators.required],
      refNumberId: [''],
      revisionNo:[0],
      customerCategoryId: ['', Validators.required],
      customerId: ['', Validators.required],
      customerAddressId: [null, Validators.required],
      customerContactId: [null, Validators.required],
      salesOwnerId: ['', Validators.required],
      salesExecutiveId: ['', Validators.required],
      billCurrencyId: ['', Validators.required],
      exchangeRate: ['', Validators.required],
      quoteValidTo: [null],
      quoteStatusId: ['', Validators.required],
      closedReasonId: [null],
      closedRemarks: [null],
      quoteDisplayTypeId:[null,Validators.required],
      approvalStatusId: [{ value: '', disabled: true }, Validators.required],
      clientResponseId: [null, Validators.required],
      jobCategoryId: ['', Validators.required],
      jobTypeId: ['', Validators.required],
      modeofTransportId: [null],
      informationSourceId: ['', Validators.required],
      referenceDetails: [null],
      expectedClosingDate: [null],
      commodityId: [null],
      incoTermId: [null],
      validityPeriod: [null],
      remarks: [null],
      tags: [null],
      originCountryId: ['', Validators.required],
      destCountryId: ['', Validators.required],
      loadingPortId: [null],
      destinationPortId: [null],
      originLocationId: [null],
      destLocationId: [null],
      trailerTypeId: [null],
      transportTypeId: [null],
      pickUpLocation: [null],
      deliveryPlace: [null],
      shipmentTypeId: [null],
      containerTypeId: [null],
      cargoTypeId: [null],
      temperatureReq: [null],
      storageUomId: [null],
      storageValue: [null],
      packageNos: [null],
      termsandConditions: [''],
      createdBy:  this.userId$,
      createdDate: [currentDate],
      updatedBy:  this.userId$,
      updatedDate: [currentDate],
      transitTime:[null],
       routing:[null],
      isrevision: [false],
    });
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  getDocuments(){
    this.Qs.GetAllDocumentMappingByScreenId(2).subscribe(res => {
      if (res) {
        this.qdocument = res.map(ele => {
          return {
            qDocumentId: 0,
            quotationId: 0,
            documentId: ele.documentId,
            remarks: '',
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            documentName: '',
            documentIdName: ele.documentName,
            IseditDoc: false,
            newDoc: true,
            files: ''
          };
        });
        this.qdocument = [...this.qdocument];
      }
      console.log(this.qdocument)
    });
  }

  EditDoc(data: any, index: any) {
    debugger
    const updatedDocuments = this.qdocument.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, Isedit: true };
      }
      return doc;
    });
    this.QDoc.controls['documentId'].patchValue(this.getSelectedDoc(data.documentId));
    this.showAddRowDoc = true;
    this.isEditDocument = true;
    this.SelectedDocumentId = data.documentId;
    this.qdocument = updatedDocuments;
  }
  oncancelDoc(data: any, index: any){
    debugger
    if(data?.documentId){
      data.Isedit = false;
      this.qdocument = [...this.qdocument];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.isEditDocument = false;
      return;
    } else {
      this.qdocument = this.qdocument.filter((_, idx) => idx !== index);
      this.showAddRowDoc = false;
      this.isEditDocument = false;
    }

  }

  //#region Filter region

  QAgainstdrp() {
    this.Cservice.GetAllQAgainst().subscribe((res => {
      this.QAgainst = res;
      console.log("res---->", res)
      this.QuoteAgainst();
    }));
  }
  QuoteAgainst() {
    this.filteredOptions = this.Quotation.controls['quotationAgainstId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.qAgainst)),
      map((name: any) => (name ? this._filter(name) : this.QAgainst?.slice()))
    );
  }
  displayFn(option: any): string {
    return option && option.qAgainst ? option.qAgainst : '';
  }
  onOptionSelected(event: any) {
    const selectedOption: any = event.option.value;
    this.selectedQagainstId = selectedOption.qAgainstId;
    if (this.selectedQagainstId == 1) {
      this.Quotation.controls["refNumberId"].setValidators([Validators.required]);
      this.Quotation.get('refNumberId')?.updateValueAndValidity();
      this.Quotation.controls["refNumberId"].enable();
      this.Enquirynumber();
          }
    else{
      this.Quotation.controls["refNumberId"].reset();
      this.Quotation.controls["refNumberId"].setValue(null);
      this.Quotation.controls["refNumberId"].disable();
      this.Quotation.get('refNumberId')?.setValidators([Validators.nullValidator]);
      this.Loadcontactandaddress(this.selectedcuscategoryid, this.selectedOption);
    }
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.QAgainst.filter((option: any) => option.qAgainst.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatas();
  }
  NoDatas(): any {
    this.Quotation.controls['quotationAgainstId'].setValue('');
    return this.QAgainst;
  }



  Enquirynumber() {
    this.Es.GetEnquiryByCustomer(this.selectedcustometid,this.selectedcuscategoryid).subscribe((res) => {
      this.EnquiryList = res;
      this.RefNumber();
    })
  }

  RefNumber() {
    this.filteredRefNumberOptions = this.Quotation.controls['refNumberId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.enquiryNumber)),
      map((number: any) => (number ? this._filterRefNumber(number) : this.EnquiryList?.slice()))
    );
  }

  displayRefNumberFn(option: any): string {
    return option && option.enquiryNumber ? option.enquiryNumber : '';
  }

  onRefNumberSelected(event: any) {
    this.LineItems=[];
    this.qdocument=[];
    const selectedOption: any = event.option.value;
    this.selectedrefnumberid = selectedOption.enquiryId
    this.FromEnquiry( this.selectedrefnumberid);
  }

  private _filterRefNumber(number: string): any[] {
    const filterValue = number.toLowerCase();
    const results = this.EnquiryList.filter((option: any) => option.enquiryNumber.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoRefNumberData();
  }

  NoRefNumberData(): any {
    this.Quotation.controls['refNumberId'].setValue('');
    return this.EnquiryList;
  }


  Cuscategory() {
    this.Cservice.getAllCustomerCategory().subscribe((res) => {
      this.customercategoryList = res;
      this.CustomerCategory();
    })
  }

  CustomerCategory() {
    this.filteredCustomerCategoryOptions = this.Quotation.controls['customerCategoryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.customerCategory)),
      map((name: any) => (name ? this._filterCustomerCategory(name) : this.customercategoryList?.slice()))
    );
  }

  displayCustomerCategoryFn(option: any): string {
    return option && option.customerCategory ? option.customerCategory : '';
  }

  onCustomerCategorySelected(event: any) {
    debugger;
    const excludeFields = ['customerCategoryId', 'quotationDate'];

    Object.keys(this.Quotation.controls).forEach(control => {
      if (!excludeFields.includes(control)) {
        // Reset all controls except the ones in excludeFields
        this.Quotation.controls[control].reset();
      }
    });
    //this.initializeForm();
    this.Quotedatevalidation();
    this.Employee();
    this.getQuoteStatuses();
    this.getApprovalStatus();
    this.getClientResponses();
    this.QuoteDisplay();
      this.LineItems=[];
      this.QPackage=[];
      this.qCommodity=[];
      this.qIncoTerm =[];
      this.qdocument=[];
      this.qTransportMode=[];
      this.content.reset();
      //this.initializeForm();
    const selectedOption: any = event.option.value;
    this.selectedcuscategoryid = selectedOption.customerCategoryId;
    this.Quotation.controls['quotationId'].setValue(0);
    this.Quotation.controls['revisionNo'].setValue(0);
    this.LoadCustomerName(this.selectedcuscategoryid);
  }

  private _filterCustomerCategory(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.customercategoryList.filter((option: any) => option.customerCategory.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoCustomerCategoryData();
  }

  NoCustomerCategoryData(): any {
    this.Quotation.controls['customerCategoryId'].setValue('');
    return this.customercategoryList;
  }


  getPCdrop() {
    this.CustDropDown = [];
    this.PCs.getAllActivePotentialCustomer().subscribe((res) => {
      this.potentailList = res
      const LivePotentialCustomer = this.potentailList.filter(contact => contact.pcStatusId != 2);
      const newPotentialcustomer = LivePotentialCustomer.map(res => {
        return {
          ...res,
          id: res.potentialCustomerId,
          name: res.customerName
        };
      });
      this.CustDropDown = [...newPotentialcustomer];
      this.CustomerFilter();
    })
  }

  getCusdrop() {
    this.CustDropDown = [];
    this.Cus.getAllActiveCustomer().subscribe((res) => {
      this.customerList = res
      const LiveCustomer = this.customerList.filter(contact => contact.cStatusId != 2);
      const customer = LiveCustomer.map(res => {
        return {
          ...res,
          id: res.customerId,
          name: res.customerName
        };
      });
      this.CustDropDown = [...customer];
      this.CustomerFilter();
    })

  }


  CustomerFilter() {
    this.filteredCustomerOptions = this.Quotation.controls['customerId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.name)),
      map((name: any) => (name ? this._filterCustomer(name) : this.CustDropDown?.slice()))
    );
  }

  displayCustomerFn(option: any): string {
    return option && option.customerName ? option.customerName : '';
  }

  onCustomerSelected(event: any) {
    this.selectedOption = event.option.value;
    this.selectedcustometid = this.selectedOption.id;
    this.Loadcontactandaddress(this.selectedcuscategoryid, this.selectedOption);
  }

  private _filterCustomer(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CustDropDown.filter((option: any) => option.name.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoCustomerData();
  }

  NoCustomerData(): any {
    this.Quotation.controls['customerId'].setValue('');
    return this.CustDropDown;
  }

  CustomerAddress() {
    this.filteredCustomerAddressOptions = this.Quotation.controls['customerAddressId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.name)),
      map((address: any) => (address ? this._filterCustomerAddress(address) : this.CAdressDropDown?.slice()))
    );
  }

  displayCustomerAddressFn(option: any): string {
    return option && option.name ? option.name : '';
  }

  onCustomerAddressSelected(event: any) {
    const selectedOption: any = event.option.value;
    console.log('Selected ID:', selectedOption.id);
    this.SelectedAddressId = selectedOption.id;
  }

  private _filterCustomerAddress(address: string): any[] {
    const filterValue = address.toLowerCase();
    const results = this.CAdressDropDown.filter((option: any) => option.address.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoCustomerAddressData();
  }

  NoCustomerAddressData(): any {
    this.Quotation.controls['customerAddressId'].setValue('');
    return this.CAdressDropDown;
  }



  CustomerContact() {
    this.filteredCustomerContactOptions = this.Quotation.controls['customerContactId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.name)),
      map((name: any) => (name ? this._filterCustomerContact(name) : this.ContactDropDown?.slice()))
    );
  }

  displayCustomerContactFn(option: any): string {
    return option && option.name ? option.name : '';
  }

  onCustomerContactSelected(event: any) {
    const selectedOption: any = event.option.value;
    console.log('Selected ID:', selectedOption.id);
    this.selectedcuscontact = selectedOption.id;
  }

  private _filterCustomerContact(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.ContactDropDown.filter((option: any) => option.name.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoCustomerContactData();
  }

  NoCustomerContactData(): any {
    this.Quotation.controls['customerContactId'].setValue('');
    return this.ContactDropDown;
  }

  Employee() {
    this.Cservice.getEmployees(1).subscribe((res) => {
      this.EmployeeList = res;
      this.SalesOwner();
      this.SalesExecutive();
      this.LoggedInUser();
    })
  }
  LoggedInUser(){
    var Logeduser = this.EmployeeList.find(id=>id.employeeId == parseInt(this.userId$));
    this.Quotation.controls["salesOwnerId"].setValue(Logeduser);
    this.Quotation.controls["salesExecutiveId"].setValue(Logeduser);
    this.selectedSalesExecutiveId = parseInt(this.userId$);
    this.SelectedSalesOwnerId = parseInt(this.userId$);
  }
  SalesOwner() {
    this.filteredSalesOwnerOptions = this.Quotation.controls['salesOwnerId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this._filterSalesOwner(name) : this.EmployeeList?.slice()))
    );
  }

  displaySalesOwnerFn(option: any): string {
    return option && option.employeeName ? option.employeeName : '';
  }

  onSalesOwnerSelected(event: any) {
    const selectedOption: any = event.option.value;
    this.SelectedSalesOwnerId = selectedOption.employeeId
  }

  private _filterSalesOwner(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.EmployeeList.filter((option: any) => option.employeeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoSalesOwnerData();
  }

  NoSalesOwnerData(): any {
    this.Quotation.controls['salesOwnerId'].setValue('');
    return this.EmployeeList;
  }


  SalesExecutive() {
    this.filteredSalesExecutiveOptions = this.Quotation.controls['salesExecutiveId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this._filterSalesExecutive(name) : this.EmployeeList?.slice()))
    );
  }

  displaySalesExecutiveFn(option: any): string {
    return option && option.employeeName ? option.employeeName : '';
  }

  onSalesExecutiveSelected(event: any) {
    const selectedOption: any = event.option.value;
    console.log('Selected ID:', selectedOption.employeeId);
    this.SelectedSalesExecutiveId = selectedOption.employeeId;
  }

  private _filterSalesExecutive(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.EmployeeList.filter((option: any) => option.employeeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoSalesExecutiveData();
  }

  NoSalesExecutiveData(): any {
    this.Quotation.controls['salesExecutiveId'].setValue('');
    return this.EmployeeList;
  }


  //#region billing currency
  getbillingCurrencyList() {
    this.Cservice.getCurrencies(1).subscribe(result => {
      this.billingCurrencyList = result;
      this.billingCurrencyFun();
    });
  }
  billingCurrencyFun() {
    this.filteredbillingCurrencyListOptions$ = this.Quotation.controls['billCurrencyId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.currencyName)),
      map((name: any) => (name ? this.filteredbillingCurrencyListOptions(name) : this.billingCurrencyList?.slice()))
    );
  }
  private filteredbillingCurrencyListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.billingCurrencyList.filter((option: any) => option.billingCurrency.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataBillCurrency1();
  }
  NoDataBillCurrency1(): any {
    this.Quotation.controls['billCurrencyId'].setValue('');
    return this.billingCurrencyList;
  }
  displayBillCurrencyListLabelFn(data: any): string {
    return data && data.currencyName ? data.currencyName : '';
  }
  billCurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.selectedbillCurrencyId = selectedValue.currencyId;
    this.getExchange();
  }
  //#region Joborder Date
  dateFilter1 = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return !date || date <= currentDate;
  };
  dateFilter = (date: Date | null): boolean => {
    // Get the current date and set the time to the start of the day
    // Get the enquiry date from the form control
  const enquiryDateValue = this.Quotation.controls['quotationDate'].value;

  // Ensure enquiryDateValue is a valid Date object
  const enquiryDate = enquiryDateValue ? new Date(enquiryDateValue) : null;

  // If there is no enquiryDate, allow all dates
  if (!enquiryDate) {
    return true;
  }

  // Set the time of enquiryDate to the start of the day for comparison
  enquiryDate.setHours(0, 0, 0, 0);

  // Return true if the date is null or date is greater than or equal to enquiryDate
  return !date || date >= enquiryDate;
};
  //#region JobCategory  autocomplete
  getjobCategoryList() {
    this.jobtypeService.GetAllJobCategory().subscribe(res => {
      this.jobCategoryList = res;
      this.jobCategoryListFun()
    });
  }
  jobCategoryListFun() {
    this.filteredjobCategoryOptions$ = this.Quotation.controls['jobCategoryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobCategory)),
      map((name: any) => (name ? this.filteredjobCategoryOptions(name) : this.jobCategoryList?.slice()))
    );

  }
  private filteredjobCategoryOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.jobCategoryList.filter((option: any) => option.jobCategory.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatajobcategory();
  }
  NoDatajobcategory(): any {
    this.Quotation.controls['jobCategoryId'].setValue('');
    return this.jobCategoryList;
  }
  displayjobCategoryLabelFn(data: any): string {
    return data && data.jobCategory ? data.jobCategory : '';
  }
  jobCategorySelectedoption(data: any) {
    this.Quotation.controls['jobTypeId'].reset();
    this.ispackage=false;
    let selectedIncoterm = data.option.value;
    this.jobCategoryId = selectedIncoterm.jobCategoryId;
    if(this.jobCategoryId == 2){
      this.enableforwarehouse = true;
    }else{
      this.enableforwarehouse = false;
    }

    this.getjobTypeList(this.jobCategoryId);

  }
  //#endregion

  //#region Job Type  autocomplete
  getjobTypeList(id: number) {
    this.jobtypeService.getJobTypesByJobCatId(id).subscribe(res => {
      this.jobTypeList = res;
      console.log(this.jobTypeList)
      this.jobTypeListFun()
    });
  }
  jobTypeListFun() {
    this.filteredjobTypeOptions$ = this.Quotation.controls['jobTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobTypeName)),
      map((name: any) => (name ? this.filteredjobTypeOptions(name) : this.jobTypeList?.slice()))
    );
  }
  private filteredjobTypeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.jobTypeList.filter((option: any) => option.jobTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatajobType();
  }
  NoDatajobType(): any {
    this.Quotation.controls['jobTypeId'].setValue('');
    return this.jobTypeList;
  }
  displayjobTypeLabelFn(data: any): string {
    return data && data.jobTypeName ? data.jobTypeName : '';
  }
  jobTypeSelectedoption(data: any) {
    debugger;

    let selectedIncoterm = data.option.value;
    this.jobTypeId = selectedIncoterm.jobTypeId;
    this.jobtypeselection();
  }
  jobtypeselection(){
    debugger;
    this.LineItems=[];
    this.LineItemsnew=[];
    this.Jtype.getAllJopTypeById(this.jobTypeId).subscribe((res)=>{
      this.ispackage = res.jobTypeGeneral.packageDetails
     this.content.setValue(res.jobTypeGeneral.termsandConditions);
      this.JobtypeModeoftans = res.jtModeofTransport;
      var trns = this.JobtypeModeoftans.map(id=>id.modeofTransportId);
      this.Quotation.controls['modeofTransportId'].setValue(trns);
      if(this.JobtypeModeoftans.length>0){
       this.onSelectTransport();
      }
      this.jobtypeIncoTerms = res.jobTypeGeneral.incoTermId;
      this.Quotation.controls["incoTermId"].setValue([this.jobtypeIncoTerms]);
      if(this.jobtypeIncoTerms!=null){
       this.onSelectInco();
      }
      var countryname = this.CountryDatalist.find(id=>id.countryId == this.destCountryId);

      if(res.jobTypeLineItems.length>0){
        res.jobTypeLineItems.map(QlineItem => {
          let Lineitem:QlineItem = {
            qLineItemId: 0,
            quotationId: 0,
            lineItemId: QlineItem.lineItemId,
            lineItemCode: QlineItem.lineItemCode,
            lineItemCategoryId: QlineItem.lineItemCategoryId,
            lineItemCategoryName: QlineItem.lineItemCategoryName,
            lineItemDescription: '',
            lineItemName: QlineItem.lineItemName,
            serviceInId: this.destCountryId,
            countryName: countryname?.countryName,
            isVendor: false,
            vendorId: null,
            vendorName: '',
            sourceFromId: null,
            sourceFrom: '',
            refNumberId: 0,
            refNumber: '',
            calculationParameterId: null,
            calculationParameter: '',
            calculationTypeId: null,
            calculationType: '',
            valueInCustomerCurrency: null,
            minValueInCustomerCurrency: null,
            taxId: null,
            taxCodeName: '',
            taxPercentage: null,
            remarks: '',
            createdBy: 0,
            createdDate: this.date,
            updatedBy: 0,
            updatedDate: this.date,
            quotationLineItemVendorValues: undefined,
            vendorCurrencyId: null,
            currencyName: '',
            valueInCompanyCurrency: null,
            minValueInCompanyCurrency: null,
            customerExchangeRate: null,
            isAmendPrice: false
          }
          this.LineItems.push(Lineitem);
          this.LineItems=[...this.LineItems];
        });
      }
     });
  }

  jobtypeselectionServiceInUpdate(){
    debugger;
    this.LineItemsnew =this.LineItems
    this.LineItems=[];
    this.Jtype.getAllJopTypeById(this.jobTypeId).subscribe((res)=>{
      this.ispackage = res.jobTypeGeneral.packageDetails;
      var countryname = this.CountryDatalist.find(id=>id.countryId == this.destCountryId);

      if(this.LineItemsnew.length>0){
        this.LineItemsnew.map(QlineItem => {
          let Lineitem:QlineItem = {
            qLineItemId: QlineItem.qLineItemId ? QlineItem.qLineItemId : 0,
            quotationId: QlineItem.quotationId ? QlineItem.quotationId : 0,
            lineItemId: QlineItem.lineItemId,
            lineItemCode: QlineItem.lineItemCode,
            lineItemCategoryId: QlineItem.lineItemCategoryId,
            lineItemCategoryName: QlineItem.lineItemCategoryName,
            lineItemDescription: '',
            lineItemName: QlineItem.lineItemName,
            serviceInId: this.destCountryId,
            countryName: countryname?.countryName,
            isVendor: QlineItem.isVendor ? QlineItem.isVendor :false,
            vendorId: QlineItem.vendorId ? QlineItem.vendorId :null,
            vendorName: QlineItem.vendorName ? QlineItem.vendorName :'',
            sourceFromId: QlineItem.sourceFromId ? QlineItem.sourceFromId :null,
            sourceFrom: QlineItem.sourceFrom ? QlineItem.sourceFrom :'',
            refNumberId:QlineItem.refNumberId ? QlineItem.refNumberId :null,
            refNumber: QlineItem.refNumber ? QlineItem.refNumber :'',
            calculationParameterId: QlineItem.calculationParameterId ? QlineItem.calculationParameterId :null,
            calculationParameter: QlineItem.calculationParameter ? QlineItem.calculationParameter :'',
            calculationTypeId: QlineItem.calculationTypeId ? QlineItem.calculationTypeId :null,
            calculationType: QlineItem.calculationType ? QlineItem.calculationType :'',
            valueInCustomerCurrency: QlineItem.valueInCustomerCurrency ? QlineItem.valueInCustomerCurrency :0,
            minValueInCustomerCurrency: QlineItem.minValueInCustomerCurrency ? QlineItem.minValueInCustomerCurrency :0,
            taxId:  QlineItem.taxId ? QlineItem.taxId :null,
            taxCodeName:  QlineItem.taxCodeName ? QlineItem.taxCodeName :'',
            taxPercentage: QlineItem.taxPercentage ? QlineItem.taxPercentage :0,
            remarks:QlineItem.remarks ? QlineItem.remarks :'',
            createdBy: 0,
            createdDate: this.date,
            updatedBy: 0,
            updatedDate: this.date,
            quotationLineItemVendorValues:QlineItem.quotationLineItemVendorValues ? QlineItem.quotationLineItemVendorValues :undefined ,
            vendorCurrencyId: QlineItem.vendorCurrencyId ? QlineItem.vendorCurrencyId :null,
            currencyName: QlineItem.currencyName ? QlineItem.currencyName :'',
            valueInCompanyCurrency: QlineItem.valueInCompanyCurrency ? QlineItem.valueInCompanyCurrency :0,
            minValueInCompanyCurrency: QlineItem.minValueInCompanyCurrency ? QlineItem.minValueInCompanyCurrency :0,
            customerExchangeRate: QlineItem.customerExchangeRate ? QlineItem.customerExchangeRate :null,
            isAmendPrice:  QlineItem.isAmendPrice ? QlineItem.isAmendPrice :false
          }
          this.LineItems.push(Lineitem);
          this.LineItems=[...this.LineItems];
        });
      }
     });
  }

  //#endregion

  //#region clientResponse
  getClientResponses() {
    this.Cservice.GetAllQCRStatus().subscribe((result) => {
      this.clientResponseList = result;
      this.clientResponseFun();
      var CR =this.clientResponseList.find(id=>id.qcrStatusId==1);
      this.selectedClientResponseId = CR?.qcrStatusId;
      this.Quotation.controls['clientResponseId'].setValue(CR);
    });
  }
  clientResponseFun() {
    this.filteredClientResponseOptions$ = this.Quotation.controls['clientResponseId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.qcrStatus)),
      map((name: any) => (name ? this.filteredClientResponseOptions(name) : this.clientResponseList?.slice()))
    );
  }
  private filteredClientResponseOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.clientResponseList.filter((option: any) => option.qcrStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataClientResponse();
  }
  NoDataClientResponse(): any {
    this.Quotation.controls['clientResponseId'].setValue('');
    return this.clientResponseList;
  }
  displayClientResponseListLabelFn(data: any): string {
    return data && data.qcrStatus ? data.qcrStatus : '';
  }
  clientResponseSelectedOption(data: any) {
    let selectedValue = data.option.value;
    this.selectedClientResponseId = selectedValue.qcrStatusId;
    if(this.selectedClientResponseId==4){
      this.Quotation.controls["closedReasonId"].setValidators([Validators.required]);
      this.Quotation.controls["closedRemarks"].setValidators([Validators.required]);
      this.Quotation.get('closedReasonId')?.updateValueAndValidity();
      this.Quotation.get('closedRemarks')?.updateValueAndValidity();
      this.hidden=true;
    }else if(this.selectedClientResponseId==5){
      
      this.Quotation.controls["closedReasonId"].setValidators([Validators.required]);
      this.Quotation.controls["closedRemarks"].setValidators([Validators.required]);
      this.Quotation.get('closedReasonId')?.updateValueAndValidity();
      this.Quotation.get('closedRemarks')?.updateValueAndValidity();
      this.hidden=true;
    }else{
      this.Quotation.controls["closedReasonId"].setValidators([Validators.nullValidator]);
      this.Quotation.controls["closedRemarks"].setValidators([Validators.nullValidator]);
      this.Quotation.get('closedReasonId')?.updateValueAndValidity();
      this.Quotation.get('closedRemarks')?.updateValueAndValidity();
      this.hidden=false;
    }

  }
  //#endregion clientResponse

  //#region quoteStatus
  getQuoteStatuses() {
    this.Cservice.GetAllQStatus().subscribe((result) => {
      this.quoteStatusList = result;
      this.quoteStatusFun(); 
        var Qstatus = this.quoteStatusList.find(id=>id.qStatusId == this.selectedQuoteStatusId);
        this.Quotation.controls["quoteStatusId"].setValue(Qstatus);
    });
  }
  quoteStatusFun() {
    this.filteredQuoteStatusOptions$ = this.Quotation.controls['quoteStatusId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.qStatus)),
      map((name: any) => (name ? this.filteredQuoteStatusOptions(name) : this.quoteStatusList?.slice()))
    );
  }
  private filteredQuoteStatusOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.quoteStatusList.filter((option: any) => option.qStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataQuoteStatus();
  }
  NoDataQuoteStatus(): any {
    this.Quotation.controls['quoteStatusId'].setValue('');
    return this.quoteStatusList;
  }
  displayQuoteStatusListLabelFn(data: any): string {
    return data && data.qStatus ? data.qStatus : '';
  }
  quoteStatusSelectedOption(data: any) {
    let selectedValue = data.option.value;
    this.selectedQuoteStatusId = selectedValue.qStatusId;

   
    if(this.selectedQuoteStatusId==4){
      this.Quotation.controls["closedReasonId"].setValidators([Validators.required]);
      this.Quotation.controls["closedRemarks"].setValidators([Validators.required]);
      this.Quotation.get('closedReasonId')?.updateValueAndValidity();
      this.Quotation.get('closedRemarks')?.updateValueAndValidity();
      this.hidden=true;
    }else{
      this.Quotation.controls['closedReasonId']?.setValidators([Validators.nullValidator]);
      this.Quotation.controls['closedRemarks']?.setValidators([Validators.nullValidator]);
      this.Quotation.get('closedReasonId')?.updateValueAndValidity();
      this.Quotation.get('closedRemarks')?.updateValueAndValidity();
      this.hidden=false;
    }
  }
  //#endregion quoteStatus

  //#region reason
  getReasons() {
    this.reasonmstSvc.getAllReason(1).subscribe((result) => {
      this.reasonList = result;
      this.reasonFun();
    });
  }
  reasonFun() {
    this.filteredreasonOptions$ = this.Quotation.controls['closedReasonId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.reasonName)),
      map((name: any) => (name ? this.filteredreasonOptions(name) : this.reasonList?.slice()))
    );
  }
  private filteredreasonOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.reasonList.filter((option: any) => option.reasonName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatareason();
  }
  NoDatareason(): any {
    this.Quotation.controls['closedReasonId'].setValue('');
    return this.reasonList;
  }
  displayreasonListLabelFn(data: any): string {
    return data && data.reasonName ? data.reasonName : '';
  }
  reasonSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.selectedreasonId = selectedValue.reasonId;
  }

  //#region infosourceService
  getAllInfosource() {
    this.infosourceService.getInfosource(1).subscribe(result => {
      this.infosourceList = result;
      this.infosourceFun();
    });
  }
  infosourceFun() {
    this.filteredinfosourceOptions$ = this.Quotation.controls['informationSourceId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.informationSourceName)),
      map((name: any) => (name ? this.filteredinfosourceOptions(name) : this.infosourceList?.slice()))
    );
  }
  private filteredinfosourceOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.infosourceList.filter((option: any) => option.informationSourceName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatainfosource();
  }
  NoDatainfosource(): any {
    this.Quotation.controls['informationSourceId'].setValue('');
    return this.infosourceList;
  }
  displayinfosourceListLabelFn(data: any): string {
    return data && data.informationSourceName ? data.informationSourceName : '';
  }
  infosourceSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.selectedinformationSourceId = selectedValue.informationSourceId;
    this.informationSourceName = selectedValue.informationSourceName.toLowerCase();
    if (this.informationSourceName.includes("reference")) {
      this.reference = true;
      this.UpdateValidityRef();
    } else {
      this.reference = false;
      this.Quotation.controls['referenceDetails'].setValue(null);
      this.UpdateValidityRef();
    }
  }

  //#region approvalStatus
  getApprovalStatus() {
    this.Cservice.GetAllApprovalStatus().subscribe((result) => {
      this.approvalStatusList = result;
      this.approvalStatusFun();
      var approv = this.approvalStatusList.find(id=>id.approvalStatusId == 1);
      this.selectedApprovalStatusId=approv?.approvalStatusId;
      this.Quotation.controls['approvalStatusId'].setValue(approv);
    });
  }
  approvalStatusFun() {
    this.filteredApprovalStatusOptions$ = this.Quotation.controls['approvalStatusId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.approvalStatus)),
      map((name: any) => (name ? this.filteredApprovalStatusOptions(name) : this.approvalStatusList?.slice()))
    );
  }
  private filteredApprovalStatusOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.approvalStatusList.filter((option: any) => option.approvalStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataApprovalStatus();
  }
  NoDataApprovalStatus(): any {
    this.Quotation.controls['approvalStatusId'].setValue('');
    return this.approvalStatusList;
  }
  displayApprovalStatusListLabelFn(data: any): string {
    return data && data.approvalStatus ? data.approvalStatus : '';
  }
  approvalStatusSelectedOption(data: any) {
    let selectedValue = data.option.value;
    this.selectedApprovalStatusId = selectedValue.approvalStatusId;
  }
  //#endregion approvalStatus
  //#region cargo type
  getCargoList() {
    this.Cservice.getAllCargo().subscribe(res => {
      this.cargoList = res;
      this.corgoFun();
    });
  }
  corgoFun() {
    this.filteredCargoOptions$ = this.Quotation.controls['cargoTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cargoType)),
      map((name: any) => (name ? this.filteredCargoOptions(name) : this.cargoList?.slice()))
    );
  }
  private filteredCargoOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.cargoList.filter((option: any) => option.cargoType.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCargo();
  }
  NoDataCargo(): any {
    this.Quotation.controls['cargoTypeId'].setValue('');
    return this.cargoList;
  }
  displayCargoLabelFn(data: any): string {
    return data && data.cargoType ? data.cargoType : '';
  }
  CargoSelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.selectedcargoTypeId = selectedValue.cargoTypeId;

  }


  //#endregion

  //#region country autocomplete
  getCountryMaster() {
    this.Cservice.getCountries(1).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
      this.CountryTypeFun1();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.Quotation.controls['originCountryId'].valueChanges.pipe(
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
    this.Quotation.controls['originCountryId'].setValue('');
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.originCountryId = selectedCountry.countryId;
    this.countryName = selectedCountry.countryName;
    this.getcityList(this.originCountryId);
    const selectedModes = this.Quotation.controls['modeofTransportId'].value;

    if (selectedModes.includes(1)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      //this.qTransportMode = [];
      this.Quotation.controls['loadingPortId'].reset()
      this.Quotation.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllAirportList();
      }
    }
    else if (selectedModes.includes(2)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      //this.qTransportMode = [];
      this.Quotation.controls['loadingPortId'].reset()
      this.Quotation.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllSeaportList();
      }
    }
  }
  //#endregion

  //#region get All originCity
  getcityList(Id: any) {

    this.Cservice.getAllCitiesbyCountry(Id).subscribe(res => {
      this.originCityList = res;
      this.originCityFun();
    });
  }
  originCityFun() {
    this.filteredoriginCityOptions$ = this.Quotation.controls['originLocationId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this.filteredoriginCityOptions(name) : this.originCityList?.slice()))
    );
  }
  private filteredoriginCityOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.originCityList.filter((option: any) => option.cityName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataoriginCity();
  }
  NoDataoriginCity(): any {
    this.Quotation.controls['originLocationId'].setValue('');
    return this.originCityList;
  }
  displayoriginCityLabelFn(data: any): string {
    return data && data.cityName ? data.cityName : '';
  }
  originCitySelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.selectedoriginLocationId = selectedValue.cityId;
  }

  //#region country dest autocomplete
  CountryTypeFun1() {
    this.filteredCountryOptionsDest$ = this.Quotation.controls['destCountryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this.filteredCountryOptionsDest(name) : this.CountryDatalist?.slice()))
    );
  }
  private filteredCountryOptionsDest(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CountryDatalist.filter((option: any) => option.countryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataDest();
  }
  NoDataDest(): any {
    this.Quotation.controls['destCountryId'].setValue('');
    return this.CountryDatalist;
  }
  displayDestCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  DestCountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.destCountryId = selectedCountry.countryId;
    this.destcountryName = selectedCountry.countryName;
    this.getDestcityList(this.destCountryId)
    const selectedModes = this.Quotation.controls['modeofTransportId'].value;

    if (selectedModes.includes(1)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      this.Quotation.controls['loadingPortId'].reset()
      this.Quotation.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllAirportList();
      }
    }
    else if (selectedModes.includes(2)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      this.Quotation.controls['loadingPortId'].reset()
      this.Quotation.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllSeaportList();
      }
    }
    this.jobtypeselectionServiceInUpdate();
  }

  //#endregion

  //#region airport List
  getAllAirportList() {

    if (this.originCountryId != null) {
      this.Cservice.GetAllAirportByCountryId(this.originCountryId).subscribe(res => {
        this.airportListOrigin = res;
        this.airportListOrigin.forEach((ele: any) => {
          let portofLoadingItem = {
            loadingPortId: ele.airportId,
            loadingPortName: ele.airportName
          };
          this.portofLoadingList.push(portofLoadingItem)
        })
        this.lodingportFun()
      });
    }
    if (this.destCountryId != null) {
      this.Cservice.GetAllAirportByCountryId(this.destCountryId).subscribe(res => {
        this.airportListDest = res;

        this.airportListDest.forEach((ele: any) => {
          let portofDestItem = {
            destinationPortId: ele.airportId,
            destinationPortIdName: ele.airportName
          };
          this.portofDestinationList.push(portofDestItem)
        })
        this.destportFun()
      });
    }
  }

  lodingportFun() {
    this.filteredloadingportOptions$ = this.Quotation.controls['loadingPortId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.loadingPortName)),
      map((name: any) => (name ? this.filteredloadingportOptions(name) : this.portofLoadingList?.slice()))
    );
  }
  private filteredloadingportOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.portofLoadingList.filter((option: any) => option.loadingPortName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataLoadingnport();
  }
  NoDataLoadingnport(): any {
    this.Quotation.controls['loadingPortId'].setValue('');
    return this.portofLoadingList;
  }
  displayLoadingportLabelFn(data: any): string {

    return data && data.loadingPortName ? data.loadingPortName : '';
  }
  loadingportSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.loadingPortId = selectedValue.loadingPortId;

  }


  //#region seaport List
  getAllSeaportList() {
    this.Cservice.GetAllSeaportByCountryId(this.originCountryId).subscribe(res => {
      this.seaportListOrigin = res;
      this.seaportListOrigin.forEach((ele: any) => {
        let portofLoadingItem = {
          loadingPortId: ele.seaportId,
          loadingPortName: ele.seaportName
        };
        this.portofLoadingList.push(portofLoadingItem)
      })
      this.lodingportFun();
    });
    this.Cservice.GetAllSeaportByCountryId(this.destCountryId).subscribe(res => {
      this.seaportList = res;
      this.seaportList.forEach((ele: any) => {
        let portofDestItem = {
          destinationPortId: ele.seaportId,
          destinationPortIdName: ele.seaportName
        };
        this.portofDestinationList.push(portofDestItem)
      })
      this.destportFun();
    });
  }
  destportFun() {
    this.filtereddestportOptions$ = this.Quotation.controls['destinationPortId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.destinationPortIdName)),
      map((name: any) => (name ? this.filtereddestportOptions(name) : this.portofDestinationList?.slice()))
    );
  }
  private filtereddestportOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.portofDestinationList.filter((option: any) => option.destinationPortIdName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataDestport();
  }
  NoDataDestport(): any {
    this.Quotation.controls['destinationPortId'].setValue('');
    return this.portofDestinationList;
  }
  displaydestportLabelFn(data: any): string {

    return data && data.destinationPortIdName ? data.destinationPortIdName : '';
  }
  destportSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.destinationPortId = selectedValue.destinationPortId;
  }

  //#region get All destcity
  getDestcityList(Id: any) {

    this.Cservice.getAllCitiesbyCountry(Id).subscribe(res => {
      this.DestCityList = res;
      this.DestCityFun();
    });
  }
  DestCityFun() {
    this.filteredDestCityOptions$ = this.Quotation.controls['destLocationId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this.filteredDestCityOptions(name) : this.DestCityList?.slice()))
    );
  }
  private filteredDestCityOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.DestCityList.filter((option: any) => option.cityName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataDestCity();
  }
  NoDataDestCity(): any {
    this.Quotation.controls['destLocationId'].setValue('');
    return this.DestCityList;
  }
  displayDestCityLabelFn(data: any): string {
    return data && data.cityName ? data.cityName : '';
  }
  destCitySelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.destLocationId = selectedValue.cityId;
  }

  //#endregion
  //#region Trailer Type
  GetTrailerType() {
    this.trailerTypeService.GetAllTrailerType(1).subscribe(res => {
      this.TrailerType = res;
      this.TrailerFun()
    });
  }
  TrailerFun() {
    this.filteredTrailerOptions$ = this.Quotation.controls['trailerTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.trailerTypeName)),
      map((name: any) => (name ? this.filteredTrailerOptions(name) : this.TrailerType?.slice()))
    );
  }
  private filteredTrailerOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.TrailerType.filter((option: any) => option.trailerTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataTrailer();
  }
  NoDataTrailer(): any {
    this.Quotation.controls['trailerTypeId'].setValue('');
    return this.TrailerType;
  }
  displayTrailerLabelFn(data: any): string {
    return data && data.trailerTypeName ? data.trailerTypeName : '';
  }
  TrailerSelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.trailerTypeId = selectedValue.trailerTypeId;
  }
  //#region Transport List
  GetTransport() {
    this.Cservice.getAllTransportType().subscribe(res => {
      this.transportList = res;
      this.TransportFun()
    });
  }
  TransportFun() {
    this.filteredTransportOptions$ = this.Quotation.controls['transportTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.transportType)),
      map((name: any) => (name ? this.filteredTransportOptions(name) : this.transportList?.slice()))
    );
  }
  private filteredTransportOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.transportList.filter((option: any) => option.transportType.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataTransport();
  }
  NoDataTransport(): any {
    this.Quotation.controls['transportTypeId'].setValue('');
    return this.transportList;
  }
  displayTransportLabelFn(data: any): string {
    return data && data.transportType ? data.transportType : '';
  }
  TransportSelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.transportTypeId = selectedValue.transportTypeId;
  }
  //#region Shipment Types
  getAllShipmentTypes() {
    this.Cservice.GetAllShipmentTypes().subscribe(res => {
      this.shipmentList = res;
      this.shipmentFun()
    });
  }
  shipmentFun() {
    this.filteredshipmentOptions$ = this.Quotation.controls['shipmentTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.shipmentType)),
      map((name: any) => (name ? this.filteredshipmentOptions(name) : this.shipmentList?.slice()))
    );
  }
  private filteredshipmentOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.shipmentList.filter((option: any) => option.shipmentType.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatashipment();
  }
  NoDatashipment(): any {
    this.Quotation.controls['shipmentTypeId'].setValue('');
    return this.shipmentList;
  }
  displayshipmentLabelFn(data: any): string {
    return data && data.shipmentType ? data.shipmentType : '';
  }
  shipmentSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.shipmentTypeId = selectedValue.shipmentTypeId;
    if (this.shipmentTypeId === 2) {
      // Set validators for mandatory fields when statusId is 1
      this.Quotation.get('containerTypeId')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.Quotation.get('containerTypeId')?.clearValidators();

      this.Quotation.get('containerTypeId')?.setValue(null);
    }

    this.Quotation.get('containerTypeId')?.updateValueAndValidity();
  }
  //#region Container
  getAllContainer() {
    this.containerTypeService.getAllActiveContainerType().subscribe(res => {
      this.containerList = res;
      this.ContainerFun()
    });
  }
  ContainerFun() {
    this.filteredContainerOptions$ = this.Quotation.controls['containerTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.containerTypeName)),
      map((name: any) => (name ? this.filteredContainerOptions(name) : this.containerList?.slice()))
    );
  }
  private filteredContainerOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.containerList.filter((option: any) => option.containerTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataContainer();
  }
  NoDataContainer(): any {
    this.Quotation.controls['containerTypeId'].setValue('');
    return this.containerList;
  }
  displayContainerLabelFn(data: any): string {
    return data && data.containerTypeName ? data.containerTypeName : '';
  }
  containerSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.containerTypeId = selectedValue.containerTypeId;
  }
  //#region UOM List
  getAllUOMList() {
    this.uomService.getAllActiveUOM().subscribe(res => {
      this.uomList = res;
      this.uomFun()
    });
  }
  uomFun() {
    this.filteredUOMOptions$ = this.Quotation.controls['storageUomId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.uomName)),
      map((name: any) => (name ? this.filteredUOMOptions(name) : this.uomList?.slice()))
    );
  }
  private filteredUOMOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.uomList.filter((option: any) => option.uomName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataUOM();
  }
  NoDataUOM(): any {
    this.Quotation.controls['storageUomId'].setValue('');
    return this.uomList;
  }
  displayUOMLabelFn(data: any): string {
    return data && data.uomName ? data.uomName : '';
  }
  uomSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.storageUomId = selectedValue.uomId;
  }

  //region Quote Display Type 

  QuoteDisplay(){
    this.Cservice.GetAllDisplayTypes().subscribe((res)=>{
       this.displaytype=res;
       console.log("res=======>",res);
      var display = this.displaytype.find(id=>id.lineItemDisplayId==2);
      this.storageQuoteDisplayId = display.lineItemDisplayId;
      this.Quotation.controls['quoteDisplayTypeId'].setValue(display)
       this.QuoteDisplayfn();
    });
  }
  QuoteDisplayfn() {
    this.filteredQuoteDisplayOptions$ = this.Quotation.controls['quoteDisplayTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.lineItemDisplay)),
      map((name: any) => (name ? this.filteredQuotedisOptions(name) : this.displaytype?.slice()))
    );
  }
  private filteredQuotedisOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.uomList.filter((option: any) => option.lineItemDisplay.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataUOM();
  }
  NoDataQuote(): any {
    this.Quotation.controls['quoteDisplayTypeId'].setValue('');
    return this.displaytype;
  }
  displayQuoteLabelFn(data: any): string {
    return data && data.lineItemDisplay ? data.lineItemDisplay : '';
  }
  QuoteSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.storageQuoteDisplayId = selectedValue.lineItemDisplayId;
  }


  //#region Document

  Document() {
    this.docs.getDocuments(1).subscribe((res) => {
      this.document = res;
      this.Documentfn();
    });
  }

  Documentfn() {
    this.filtereddocumentId = this.QDoc.get(
      "documentId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.documentName)),
      map((name: any) => (name ? this._filternextFollowUpdocId(name) : this.document?.slice()))
    );
  }
  private _filternextFollowUpdocId(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.document.filter((invflg) =>
      invflg.documentName.toLowerCase().includes(filterValue)
    );
  }

  optionSelecteddocumentId(event: MatAutocompleteSelectedEvent): void {
    const selectedDocID = this.document.find(
      (Stype) => Stype.documentName === event.option.viewValue
    );
    if (selectedDocID) {
      const selectedDocId = selectedDocID.documentId;
      this.SelectedDocumentId = selectedDocId;
      this.DocRemarks = selectedDocID.remarks;

      this.QDoc.patchValue({
        remarks: this.DocRemarks,
      });

      const exists = this.qdocument.some(item => item.documentId === this.SelectedDocumentId);
      if (exists) {
        Swal.fire({
          icon: "error",
          title: "Duplicate",
          text: "Document already exist..!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        });
        this.QDoc.get("documentId")?.setValue("");
      }


    }

  }
  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.isEditDocument = false;
    this.QDoc.controls['documentId'].reset();
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRowDoc) {
      const Value = {
        ...this.QDoc.value,
        documentName: "",
        remarks: this.DocRemarks,
        documentId: this.SelectedDocumentId,
        createdBy: 1,
        createdDate: this.date,
        Isedit: true
      }
      //this.ImageDataArray.push(Value);
      this.qdocument = [Value, ...this.qdocument];
      this.showAddRowDoc = true;
    }

    //this.showtable = false;
  }
  Downloads() {

  }
  Download(file: any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }
  DeleteImage(item: any, i: number) {
    if (this.showAddRowDoc != true) {
      if (i !== -1) {
        this.ImageDataArray = [...this.qdocument];
        this.ImageDataArray.splice(i, 1);
        this.qdocument = [...this.ImageDataArray]
        this.showAddRowDoc = false;
      }
    }
  }
  show(event: any): void {
    var filePath = this.Filepath + event
    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg') {
      this.dialog.open(this.imagePreview, { data: filePath });
    } else {
      window.open(filePath, '_blank');
    }
  }

  addDocumentRow() {
    debugger
    if (this.QDoc.valid) {
      if (this.ImageDetailsArray.length > 0) {
        for (let imageDetail of this.ImageDetailsArray) {
          // Rename the 'name' property to 'imagePath'
          const documentName = imageDetail.name;

          // Check if the object with the same 'imagePath' already exists in ImageDataArray
          const existingImageDataIndex = this.ImageDataArray.findIndex(data => data.documentId === this.SelectedDocumentId);
          //const existarray =  this.ImageDataArray.find(data => data.documentId === documentName);

          // If the object doesn't exist, add it to ImageDataArray
          if (existingImageDataIndex == -1) {
            // Create a new object with the modified property name
            const modifiedImageDetail = { ...imageDetail, documentName };
            this.DocRemarks =  this.QDoc.controls['remarks'].value.trim();
            const Value = {
              ...this.QDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              Isedit: false,
              createdBy: 1,
              documentId: this.SelectedDocumentId
            }
            // Push the modified object into ImageDataArray
            this.ImageDataArray.push(Value);
            this.qdocument = [...this.ImageDataArray]
            this.QDoc.reset();
            this.showAddRowDoc = false;
            //this.InitializeDoc();
          } else {
            // Update the existing image data
            const modifiedImageDetail = { ...imageDetail, documentName };
            this.ImageDataArray[existingImageDataIndex] = {
              ...this.QDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              documentId: this.SelectedDocumentId,
              createdBy: 1,
              createdDate: this.date,
            };
            this.QDoc.reset();
            this.qdocument = [...this.ImageDataArray];
            this.showAddRowDoc = false;
            //this.InitializeDoc();
          }

        }
      } else {
        this.Cservice.displayToaster(
          "error",
          "error",
          "Please choose files."
        );
      }
    } else {
      this.QDoc.markAllAsTouched();
      this.validateall(this.QDoc);
    }
  }

  InitializeDoc() {
    this.QDoc = this.fb.group({
      qDocumentId: [0],
      quotationId: [0],
      documentId: ["", [Validators.required]],
      documentName: [""],
      remarks: [""],
      createdBy: [parseInt(this.userId$)],
      createdDate: this.date
    });

  }
  getSelectedDoc(selectedId: number): string {
    const selectedDoc = this.document.find(
      (item) => item.documentId === selectedId
    );
    return selectedDoc ? selectedDoc.documentName : "";
  }

  selectFile(evt: any) {
    if (evt?.target?.files && evt.target.files.length > 0) {
      const files = evt.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

        // Check if the file type is allowed (jpg or png)
        if (['jpg', 'png','pdf', 'jpeg', 'docx', 'doc', 'xls', 'xlsx'].includes(fileType)) {
          // Check if the image already exists, then update it
          const existingIndex = this.ImageDetailsArray.findIndex(img => img.name.toLowerCase() === fileName);
          if (existingIndex !== -1) {
            // If the image already exists, update it
            this.ImageDetailsArray[existingIndex] = file;

          } else {
            // If the image doesn't exist, add it to the array
            this.ImageDetailsArray.push(file);
          }
        } else {
          // Handle unsupported file types
          this.Cservice.displayToaster(
            "error",
            "error",
            "Please Choose JPG, PNG, DOCX, DOC, XLS, or XLSX Files."
          );
          this.QDoc.controls["documentName"].setValue("");
        }

      }
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  //#region Commodity
  getCommodityList() {
    this.commodityService.getAllActiveCommodity().subscribe(result => {
      this.CommodityList = result;
    });
  }

  CommodityListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.CommodityId = selectedValue.CommodityId;
  }
  //#endregion

  //#region inco terms autocomplete
  getIncotermList() {
    this.incoTermService.getIncoterms(1).subscribe(res => {
      this.incotermList = res;
    });
  }

  incotermSelectedoption(incodata: any) {
    let selectedIncoterm = incodata.option.value;
    this.incoTermId = selectedIncoterm.incoTermId;
  }
  //#endregion

  //#region custom validity
  UpdateValidityRef() {
    if (this.reference) {
      this.Quotation.get('referenceDetails')?.setValidators([Validators.required]);
    }
    else {
      this.Quotation.controls['referenceDetails']?.setValidators([Validators.nullValidator]);
    }
    this.Quotation.controls['referenceDetails']?.updateValueAndValidity();
  }

  //#regoin multiselct form declaration
  // onSelectCommodity() {
  //   const selectedCommodities = this.Quotation.controls['commodityId'].value;
  //   const uniqueSelectedcommodity = selectedCommodities.filter(
  //     (selectedCommodity: any) =>
  //       !this.pqCommodity.some(
  //         (existingcommodity: any) => existingcommodity.commodityId === selectedCommodity
  //       )
  //   );
  //   uniqueSelectedcommodity.forEach((selectedCommodityId: any) => {
  //     this.CommodityForm = this.fb.group({
  //       pqCommodityId: [0],
  //       purchaseQuoteId: [0],
  //       commodityId: [selectedCommodityId],
  //       createdBy: [parseInt(this.userId$)],
  //       createdDate: [this.date],
  //       updatedBy: [parseInt(this.userId$)],
  //       updatedDate: [this.date]
  //     });
  //     this.pqCommodity.push(this.CommodityForm.value);
  //   });
  //   const uncheckedCommoditys = this.pqCommodity.filter(
  //     (existingcommodity: any) =>
  //       !selectedCommodities.includes(existingcommodity.commodityId)
  //   );
  //   uncheckedCommoditys.forEach((uncheckedCommodity: any) => {
  //     const index = this.pqCommodity.findIndex(
  //       (existingcommodity: any) =>
  //         existingcommodity.commodityId === uncheckedCommodity.commodityId
  //     );
  //     if (index !== -1) {
  //       this.pqCommodity.splice(index, 1);
  //     }
  //   });
  // }

  onSelectcontact() {
    const selectedIncos = this.Quotation.controls['customerContactId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedCont: any) =>
        !this.Contactperson.some(
          (existingInco: any) => existingInco.contactId === selectedCont
        )
    );
    uniqueSelectedInco.forEach((selectedCon: any) => {
      this.ContactForm = this.fb.group({
        customerContactId: [0],
        quotationId: [0],
        contactId: [selectedCon],
        createdBy: [1],
        createdDate: [this.date],
        updatedBy: [1],
        updatedDate: [this.date]
      });
      this.Contactperson.push(this.ContactForm.value);
    });
    const uncheckedIncos = this.Contactperson.filter(
      (existingcont: any) =>
        !selectedIncos.includes(existingcont.contactId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.Contactperson.findIndex(
        (existingcont: any) =>
          existingcont.contactId === uncheckedInco.contactId
      );
      if (index !== -1) {
        this.Contactperson.splice(index, 1);
      }
    });

    console.log("contact person",this.Contactperson);
  }


  //#region  conecting load dropdown

  LoadCustomerName(id: number) {
    switch (id) {
      case 1:
        this.getPCdrop();
        break;
      case 2:
        this.getCusdrop();
        break;
    }
  }

  BillingCurrencyLoad(id: number){
    switch (id) {
      case 1:  
        this.PCs.getAllPotentialCustomerById(this.selectedcustometid).subscribe(result => {    
            if(result.potentialCustomer.billingCurrencyId!=null){
              if(result.potentialCustomer.billingCurrencyId==1){
                this.Quotation.controls["billCurrencyId"].disable();
                this.selectedbillCurrencyId = result.potentialCustomer.customerCurrencyId;
                this.Quotation.controls["billCurrencyId"].setValue(result.potentialCustomer);
                this.getExchange();
              }else{
                this.Quotation.controls["billCurrencyId"].enable();
                this.selectedbillCurrencyId = result.potentialCustomer.customerCurrencyId;
                this.Quotation.controls["billCurrencyId"].setValue(result.potentialCustomer);
                this.getExchange();
              }
            }       
        });
        break;
      case 2:
        this.Cus.getAllCustomerById(this.selectedcustometid).subscribe(res => { 
            if(res.customer.billingCurrencyId!=null){
              if(res.customer.billingCurrencyId==1){
                this.Quotation.controls["billCurrencyId"].disable();
                this.selectedbillCurrencyId = res.customer.customerCurrencyId;
                this.Quotation.controls["billCurrencyId"].setValue(res.customer);
                this.getExchange();


              }else{
                this.Quotation.controls["billCurrencyId"].enable();
                this.selectedbillCurrencyId = res.customer.customerCurrencyId;
         
                this.Quotation.controls["billCurrencyId"].setValue(res.customer);
                this.getExchange();
              }
            }
        });
        break;
      default:
        console.log("Default case");
    }
  }

  Loadcontactandaddress(id: number, customer: any) {
    if (id) {
      switch (id) {
        case 1:
          this.SelectedSalesOwnerId = customer.salesOwnerId;
          this.SelectedSalesExecutiveId = customer.salesExecutiveId
          this.Quotation.patchValue({
            salesOwnerId: this.EmployeeList.find(obj => obj.employeeId == customer.salesOwnerId),
            salesExecutiveId: this.EmployeeList.find(obj => obj.employeeId == customer.salesExecutiveId),
          });

          this.PCs.getAllPotentialCustomerById(this.selectedcustometid).subscribe(result => {
            if(!this.Edits){
              if(result.potentialCustomer.billingCurrencyId!=null){
                if(result.potentialCustomer.billingCurrencyId==1){
                  this.Quotation.controls["billCurrencyId"].disable();
                  this.selectedbillCurrencyId = result.potentialCustomer.customerCurrencyId;
                  this.Quotation.controls["billCurrencyId"].setValue(result.potentialCustomer);
                  this.getExchange();
  
  
                }else{
                  this.Quotation.controls["billCurrencyId"].enable();
                  this.selectedbillCurrencyId = result.potentialCustomer.customerCurrencyId;
                  this.Quotation.controls["billCurrencyId"].setValue(result.potentialCustomer);
                  this.getExchange();
                }
              }
             
            }  
            this.customerContact = result.potentialCustomerContacts;
            const liveCustomerContacts = this.customerContact.filter(contact => contact.liveStatus === true);

            const cuscontact = liveCustomerContacts.map(res => {
              return {
                ...res,
                Id: res.pcContactId,
                name: res.contactPerson
              };
            });
            this.ContactDropDown = [...cuscontact];
            this.CustomerContact();
            if(!this.Edits){
              debugger;
              this.customerContact.forEach((item) => {
                switch (item.primaryContact) {
                  case true:
                    this.selectedcuscontact = item.pcContactId;
                    var contact = this.Quotation.controls["customerContactId"].setValue([item.pcContactId]);
                    this.onSelectcontact();
                    break;
                  default:
                    // Do something else if primaryAddress is not 1
                    break;
                }
              });
            }
           

            this.potentialCustomerAddress = result.potentialCustomerAddresses;
            const liveCustomerAddress = this.potentialCustomerAddress.filter(Address => Address.liveStatus == true);
            const cusAdress = liveCustomerAddress.map(res => {
              return {
                ...res,
                id: res.pcAddressId,
                name: res.addressName
              };
            });
            this.CAdressDropDown = [...cusAdress];
            this.CustomerAddress();
            this.CAdressDropDown.forEach((item) => {
              switch (item.primaryAddress) {
                case true:
                  this.SelectedAddressId = item.pcAddressId
                  this.Quotation.controls["customerAddressId"].setValue(item);
                  break;
                default:
                  // Do something else if primaryAddress is not 1
                  break;
              }
            });

          });
          break;
        case 2:
          this.SelectedSalesOwnerId = customer.salesOwnerId;
          this.SelectedSalesExecutiveId = customer.salesExecutiveId
          this.Quotation.patchValue({
            salesOwnerId: this.EmployeeList.find(obj => obj.employeeId == customer.salesOwnerId),
            salesExecutiveId: this.EmployeeList.find(obj => obj.employeeId == customer.salesExecutiveId),
          });
          this.Cus.getAllCustomerById(this.selectedcustometid).subscribe(res => {
            if(!this.Edits){
              if(res.customer.billingCurrencyId!=null){
                if(res.customer.billingCurrencyId==1){
                  this.Quotation.controls["billCurrencyId"].disable();
                  this.selectedbillCurrencyId = res.customer.customerCurrencyId;
                  this.Quotation.controls["billCurrencyId"].setValue(res.customer);
                  this.getExchange();
  
  
                }else{
                  this.Quotation.controls["billCurrencyId"].enable();
                  this.selectedbillCurrencyId = res.customer.customerCurrencyId;
           
                  this.Quotation.controls["billCurrencyId"].setValue(res.customer);
                  this.getExchange();
                }
              }
             
            }  
            this.customerContact = res.customerContact;
            const liveCustomerContacts = this.customerContact.filter(contact => contact.liveStatus === true);
            const cuscontact = this.customerContact.map(res => {
              return {
                ...res,
                Id: res.cContactId,
                name: res.contactPerson
              };
            });
            this.ContactDropDown = [...cuscontact];
            if(!this.Edits){
              this.ContactDropDown.forEach((item) => {
                switch (item.primaryContact) {
                  case true:
                    this.selectedcuscontact = item.cContactId;
                    //this.displayCustomerContactFn(liveCustomerContacts);
                    this.Quotation.controls["customerContactId"].setValue([item.cContactId]);
                    this.onSelectcontact();
                    break;
                  default:
                    // Do something else if primaryAddress is not 1
                    break;
                }
              });
            }
           
            this.CustomerContact();
            this.customerAddress = res.customerAddress;
            const liveCustomerAddress = this.customerAddress.filter(Address => Address.liveStatus === true);
            const cusAdress = liveCustomerAddress.map(res => {
              return {
                ...res,
                id: res.cAddressId,
                name: res.addressName
              };
            });
            this.CAdressDropDown = [...cusAdress];

            this.CustomerAddress();

            this.CAdressDropDown.forEach((item) => {
              switch (item.primaryAddress) {
                case true:
                  this.SelectedAddressId = item.id
                  this.Quotation.controls["customerAddressId"].setValue(item);
                  break;
                default:
                  // Do something else if primaryAddress is not 1
                  break;
              }
            });

          });
          break;
        default:
          console.log("Default case");
      }
    }

  }


  //# region multi select
  onSelectCommodity() {
    const selectedCommodities = this.Quotation.controls['commodityId'].value;
    const uniqueSelectedcommodity = selectedCommodities.filter(
      (selectedCommodity: any) =>
        !this.qCommodity.some(
          (existingcommodity: any) => existingcommodity.commodityId === selectedCommodity
        )
    );
    uniqueSelectedcommodity.forEach((selectedCommodityId: any) => {
      this.CommodityForm = this.fb.group({
        qCommodityId: [0],
        quotationId: [0],
        commodityId: [selectedCommodityId],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.qCommodity.push(this.CommodityForm.value);
    });
    const uncheckedCommoditys = this.qCommodity.filter(
      (existingcommodity: any) =>
        !selectedCommodities.includes(existingcommodity.commodityId)
    );
    uncheckedCommoditys.forEach((uncheckedCommodity: any) => {
      const index = this.qCommodity.findIndex(
        (existingcommodity: any) =>
          existingcommodity.commodityId === uncheckedCommodity.commodityId
      );
      if (index !== -1) {
        this.qCommodity.splice(index, 1);
      }
    });
    console.log(" this.qCommodity", this.qCommodity);
  }


  onSelectInco() {

    const selectedIncos = this.Quotation.controls['incoTermId'].value;
    if(selectedIncos.length<=1){
      const uniqueSelectedInco = selectedIncos.filter(
        (selectedInco: any) =>
          !this.qIncoTerm.some(
            (existingInco: any) => existingInco.incoTermId === selectedInco
          )
      );
      uniqueSelectedInco.forEach((selectedInco: any) => {
        this.IncoForm = this.fb.group({
          qIncoId: [0],
          quotationId: [0],
          incoTermId: [selectedInco],
          createdBy: [parseInt(this.userId$)],
          createdDate: [this.date],
          updatedBy: [parseInt(this.userId$)],
          updatedDate: [this.date]
        });
        this.qIncoTerm.push(this.IncoForm.value);
      });
      const uncheckedIncos = this.qIncoTerm.filter(
        (existingInco: any) =>
          !selectedIncos.includes(existingInco.incoTermId)
      );
      uncheckedIncos.forEach((uncheckedInco: any) => {
        const index = this.qIncoTerm.findIndex(
          (existingInco: any) =>
            existingInco.incoTermId === uncheckedInco.incoTermId
        );
        if (index !== -1) {
          this.qIncoTerm.splice(index, 1);
        }
      });
      console.log(" this.qIncoTerm", this.qIncoTerm);
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "At the time you have select only one incoterms",
        showConfirmButton: false,
        timer: 2000,
      });
      this.Quotation.controls['incoTermId'].reset();
    }
  }

  onSelectTransport() {
    this.transportSelectedoption();
    const selectedTransports = this.Quotation.controls['modeofTransportId'].value;
    // Filter out transports that are already in pqTransportMode
    const uniqueSelectedTransport = selectedTransports.filter(
      (selectedTransport: any) =>
        !this.qTransportMode.some(
          (existingTransport: any) => existingTransport.transportModeId === selectedTransport
        )
    );
    // Add newly selected transports to pqTransportMode
    uniqueSelectedTransport.forEach((selectedTransportId: any) => {
      this.TransportForm = this.fb.group({
        qTransportModeId: [0],
        quotationId: [0],
        transportModeId: [selectedTransportId],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.qTransportMode.push(this.TransportForm.value);
    });
    // Remove deselected transports from pqTransportMode
    const uncheckedTransports = this.qTransportMode.filter(
      (existingTransport: any) =>
        !selectedTransports.includes(existingTransport.transportModeId)
    );
    uncheckedTransports.forEach((uncheckedTransport: any) => {
      const index = this.qTransportMode.findIndex(
        (existingTransport: any) =>
          existingTransport.transportModeId === uncheckedTransport.transportModeId
      );
      if (index !== -1) {
        this.qTransportMode.splice(index, 1);
      }
    });

    console.log("this.qTransportMode", this.qTransportMode);

  }
  //#region modeofTransport autocomplete
  getTransportList() {
    this.Cservice.getAllModeofTransport().subscribe(res => {
      this.modeofTransportList = res;
    });
  }

  transportSelectedoption() {
    debugger;
    const selectedModes = this.Quotation.controls['modeofTransportId'].value;
    if(selectedModes.length<=0){
      this.ShowOnlyroad = false;
      this.ShowOnlysea = false
    }
    selectedModes.forEach((mode: number) => {
      if (mode === 1 && selectedModes.includes(2)) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Cannot select both Air and Sea simultaneously",
          showConfirmButton: false,
          timer: 2000,
        });
        this.Quotation.controls['modeofTransportId'].reset();
        this.Quotation.controls['loadingPortId'].reset();
        this.Quotation.controls['destinationPortId'].reset();
      }
    });
    selectedModes.forEach((mode: number) => {
      if (mode === 4 && (selectedModes.includes(1) || selectedModes.includes(2) || selectedModes.includes(3))) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Can't select Courier simultaneously with sea,air and road",
          showConfirmButton: false,
          timer: 2000,
        });
        this.Quotation.controls['modeofTransportId'].reset()
        this.Quotation.controls['loadingPortId'].reset()
        this.Quotation.controls['destinationPortId'].reset()

      }
    });

    if (selectedModes.includes(1) && selectedModes.includes(3)) {
      this.seaportSelected = false;
      this.portofLoadingList = []
      this.portofDestinationList = []
      const calcairandroad = 10000
      this.Calculation(calcairandroad);
      this.getAllAirportList();
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.Quotation.controls['loadingPortId'].reset();
      this.Quotation.controls['destinationPortId'].reset();
      this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();

    } else if (selectedModes.includes(2) && selectedModes.includes(3)) {
      this.seaportSelected = false;
      this.portofLoadingList = []
      this.portofDestinationList = []
      const calcseaandroad = 10000
      this.Calculation(calcseaandroad);
      this.getAllSeaportList();
      this.ShowOnlyroad = true;
      this.ShowOnlysea = true
      this.chargablepackage = false;
      this.Quotation.controls['loadingPortId'].reset();
      this.Quotation.controls['destinationPortId'].reset();

      if (selectedModes.includes(2) && selectedModes.includes(3)) {
        // Set validators for mandatory fields when statusId is 1
        this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
      } else {
        // Remove validators if statusId is not 2
        this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

        this.Quotation.get('shipmentTypeId')?.setValue(null);
      }

      this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(1)) {
      this.seaportSelected = false;
      this.portofLoadingList = []
      this.portofDestinationList = []
      const calcair = 6000
      this.Calculation(calcair);
      this.getAllAirportList();
      this.ShowOnlyroad = false;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.Quotation.controls['loadingPortId'].reset();
      this.Quotation.controls['destinationPortId'].reset();
      this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(2)) {
      this.seaportSelected = true;
      this.portofLoadingList = []
      this.portofDestinationList = []
      this.getAllSeaportList();
      if (selectedModes.includes(2)) {
        // Set validators for mandatory fields when statusId is 1
        this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
      } else {
        // Remove validators if statusId is not 2
        this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

        this.Quotation.get('shipmentTypeId')?.setValue(null);
      }

      this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
      this.ShowOnlyroad = false;
      this.ShowOnlysea = true
      this.chargablepackage = true;
      this.Quotation.controls['loadingPortId'].reset();
      this.Quotation.controls['destinationPortId'].reset();
    }
    else if (selectedModes.includes(3)) {
      this.seaportSelected = false;
      this.portofLoadingList = []
      this.portofDestinationList = []
      this.loadingPortId = null;
      this.destinationPortId = null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calroad = 10000
      this.Calculation(calroad);
      this.portofLoadingList = [];
      this.portofDestinationList = [];
      this.Quotation.controls['loadingPortId'].reset();
      this.Quotation.controls['destinationPortId'].reset();
      this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
    }
    else if (selectedModes.includes(4)) {
      this.seaportSelected = false;
      this.loadingPortId = null;
      this.destinationPortId = null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calccurior = 5000
      this.Calculation(calccurior);
      this.portofLoadingList = [];
      this.portofDestinationList = [];
      this.Quotation.controls['loadingPortId'].reset();
      this.Quotation.controls['destinationPortId'].reset();
      this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
    }
  }


  Calculation(value: number) {
    debugger
    if (this.seaportSelected) {
      this.QPackage = this.QPackage.map(pkg => {
        return {
          ...pkg,
          cbm: parseFloat((pkg.length * pkg.breadth * pkg.height).toFixed(2)),
          chargePackWtKg: 0.00
        };
      });
    } else {
      this.QPackage = this.QPackage.map(pkg => {
        return {
          ...pkg,
          cbm: parseFloat((pkg.length * pkg.breadth * pkg.height).toFixed(2)),
          chargePackWtKg: parseFloat((pkg.length * pkg.breadth * pkg.height / value).toFixed(2))
        };
      });
    }

  }
  ///////----------------------------------------Package details----------------------------------------
  addPackage() {

    //this.modeofTransport = this.pqTransportMode;
    const noOfpkg = this.Quotation.controls['packageNos'].value
    const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
    const count = this.QPackage.length;
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
      const dialogRef = this.dialog.open(QuotationpackagedialogComponent, {
        data: {
          list: this.QPackage,
          modeofTransport: this.qTransportMode,
          seaportSelected: this.seaportSelected
        }, disableClose: true, autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        debugger
        if (result != null) {
          this.QPackage.push(result);
          this.QPackage = [...this.QPackage];
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
  Clear() {
    const pkgvalue = this.Quotation.controls['packageNos'].value;
    if (pkgvalue < this.QPackage.length) {
      // this.pqPackage.splice(pkgvalue,1);
    }
  }
  Edit(Data: any, i: number) {
    debugger
    //this.modeofTransport = this.pqTransportMode;
    const dialogRef = this.dialog.open(QuotationpackagedialogComponent, {
      data: {
        pqData: Data,
        modeofTransport: this.qTransportMode,
        seaportSelected: this.seaportSelected,
        mode: 'Edit',
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.QPackage.splice(i, 1);
        this.QPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }
  View(Data: any, i: number) {
    //this.modeofTransport = this.pqTransportMode;
    const dialogRef = this.dialog.open(QuotationpackagedialogComponent, {
      data: {
        pqData: Data,
        modeofTransport: this.qTransportMode,
        seaportSelected: this.seaportSelected,
        mode: 'View',
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.QPackage.splice(i, 1);
        this.QPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }
  DeletepacKage(item: any, i: number) {
    if (i !== -1) {
      this.QPackage.splice(i, 1);
    }
  }

  valuePerUom(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,8}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 8) {
      parts[0] = parts[0].slice(0, 8);
    }
    input.value = parts.join('.');
    this.Quotation.controls['valuePerUom'].setValue(input.value);
  }

  packageNos(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.startsWith('0') && value.length > 1) {
      value = value.slice(1);
    }
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    input.value = value;
    this.Quotation.controls['packageNos'].setValue(value);
  }

  getTotalCrossWeight(): string {
    const totalCrossWeight = this.QPackage.reduce((total, item) => total + (+item.packWeightKg || 0), 0);
    return totalCrossWeight.toFixed(2);
  }

  getTotalChargeableWeight(): string {
    const totalChargeableWeight = this.QPackage.reduce((total, item) => total + (+item.chargePackWtKg || 0), 0);
    return totalChargeableWeight.toFixed(2);
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
  //region LineItem tab

  AddLineItem() {

    const dialogRef = this.dialog.open(QuotationlineitemComponent, {
      data: {
        LineData: this.LineItems,
        selectedDestcountry: this.destCountryId,
        quotation: this.Quotation.value,
        currencyId:this.selectedbillCurrencyId
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("redhsdfhsgfidhjgdh",result);
      if(result!=null){
        debugger;
        if(result.sourceFromId!=3 && result.isVendor==true){
          const QLineItemVD:QLIVendorValueDetail ={
            qLIVendorValueDetailId: 0,
            qLIVendorValueId: 0,
            aamroLineItemCatId:result.lineItemCategoryId,
            vendorLineItem: result.lineItemName,
            calculationParameterId: result.calculationParameterId,
            calculationTypeId: result.calculationTypeId,
            valueInVendorCurrency: result.valueInVendorCurrency,
            valueInCompanyCurrency: result.vendorcompany,
            minValueInVendorCurrency: result.minValueInVendorCurrency,
            minValueInCompanyCurrency: result.minvendorcompany,
            exchangeRate: result.vendorexchange,
            taxId: result.taxId,
            remarks:result.remarks,
            taxPercentage: result.taxPercentage,
            createdBy:parseInt(this.userId$),
            createdDate: this.date,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.date,

      
            lineItemCategoryName:result.lineItemCategoryName,
            calculationParameter: result.calculationParameter,
            taxCodeName: result.taxCodeName,
            calculationType: result.calculationType
          }
          this.QLIVendorValueDetails.push(QLineItemVD);

          const Qlivenddorvalue:QLIVendorValue={
            qLIVendorValueId: 0,
            qLineItemId: 0,
            sourceFromId: result.sourceFromId,
            currencyId: result.vendorCurrencyId,
            refNumberId: result.refNumberId,
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.date,
            sourceFrom:result.sourceFrom,
            refNumber:result.refNumber,
            currencyName:result.currencyName,
            quotationLineItemVendorValueDetails: this.QLIVendorValueDetails
          }

          const QlineItem:QlineItem={
            ...result,      
            quotationLineItemVendorValues:Qlivenddorvalue
          }
        this.LineItems.push(QlineItem);
       this.LineItems = [...this.LineItems];
       this.QLIVendorValueDetails=[];
        }else if(result.sourceFromId!=3 || result.isVendor==true){

          this.LineItems.push(result);
          this.LineItems = [...this.LineItems];

        } else{
          this.LineItems.push(result);
          this.LineItems = [...this.LineItems];
        }  
      }
    });
  }

  onEdit(Data: any, i: number) {
    debugger
    const dialogRef = this.dialog.open(QuotationlineitemComponent, {
      data: {
        LineData: Data,
        LineList :this.LineItems,
        mode: 'Edit',
        currencyId:this.selectedbillCurrencyId
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result != null) {
        if(result.sourceFromId!=3 && result.isVendor==true){

          this.LineItems.splice(i, 1);
          this.LineItems.splice(
            i,
            0,
            result
          );
          this.LineItems = [...this.LineItems];
      //     const QLineItemVD:QLIVendorValueDetail ={
      //       qLIVendorValueDetailId: 0,
      //       qLIVendorValueId: 0,
      //       aamroLineItemCatId:result.lineItemCategoryId,
      //       vendorLineItem: result.lineItemName,
      //       calculationParameterId: result.calculationParameterId,
      //       calculationTypeId: result.calculationTypeId,
      //       valueInVendorCurrency: result.valueInVendorCurrency,
      //       valueInCompanyCurrency: result.vendorcompany,
      //       minValueInVendorCurrency: result.minValueInVendorCurrency,
      //       minValueInCompanyCurrency: result.minvendorcompany,
      //       exchangeRate: result.vendorexchange,
      //       taxId: result.taxId,
      //       remarks:result.remarks,
      //       taxPercentage: result.taxPercentage,
      //       createdBy:parseInt(this.userId$),
      //       createdDate: this.date,
      //       updatedBy: parseInt(this.userId$),
      //       updatedDate: this.date,

      
      //       lineItemCategoryName:result.lineItemCategoryName,
      //       calculationParameter: result.calculationParameter,
      //       taxCodeName: result.taxCodeName,
      //       calculationType: result.calculationType
      //     }
      //     this.QLIVendorValueDetails.push(QLineItemVD);

      //     const Qlivenddorvalue:QLIVendorValue={
      //       qLIVendorValueId: 0,
      //       qLineItemId: 0,
      //       sourceFromId: result.sourceFromId,
      //       currencyId: result.vendorCurrencyId,
      //       refNumberId: result.refNumberId,
      //       createdBy: parseInt(this.userId$),
      //       createdDate: this.date,
      //       updatedBy: parseInt(this.userId$),
      //       updatedDate: this.date,
      //       sourceFrom:result.sourceFrom,
      //       refNumber:result.refNumber,
      //       currencyName:result.currencyName,
      //       quotationLineItemVendorValueDetails: this.QLIVendorValueDetails
      //     }

      //     const QlineItem:QlineItem={
      //       ...result,      
      //       quotationLineItemVendorValues:Qlivenddorvalue
      //     }
      //   this.LineItems.splice(i, 1);
      //   this.LineItems.splice(
      //     i,
      //     0,
      //     QlineItem
      //   );
      //  this.LineItems = [...this.LineItems];
       //this.QLIVendorValueDetails=[];
        }else if(result.sourceFromId!=3 || result.isVendor==true){
          this.LineItems.splice(i, 1);
          this.LineItems.splice(
            i,
            0,
            result
          );
          this.LineItems = [...this.LineItems];

        }else{
          this.LineItems.splice(i, 1);
          this.LineItems.splice(
            i,
            0,
            result
          );
          this.LineItems = [...this.LineItems];
         
        }
      }
    });
  }


  onview(Data: any, i: number) {
    const dialogRef = this.dialog.open(QuotationlineitemComponent, {
      data: {
        LineData: Data,
        LineList :this.LineItems,
        mode: 'view',
        currencyId:this.selectedbillCurrencyId
      }, disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.LineItems.splice(i, 1);
        this.LineItems.splice(
          i,
          0,
          result
        );
        this.LineItems = [...this.LineItems];
      }
    });
  }

  onDelete(item: any, i: number) {
    if (i !== -1) {
      this.LineItems.splice(i, 1);
      this.LineItems = [...this.LineItems];
      this.QLIVendorValueDetails=[];
    }
  }

  //#region Vendor value

  Onvendorvalue(Data: any, i: number) {
    const dialogRef = this.dialog.open(VendorvalueComponent, {
      data: {
        cuslineitem: this.LineItems[i],
        lineItemList:this.LineItems[i],
        Mode: this.Mode,
        

      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if(result!=null){
        const QlineItem:QlineItem={
          ...Data,      
          quotationLineItemVendorValues:result
        }

        this.LineItems.splice(i, 1);
        this.LineItems.splice(
        i,
        0,
        QlineItem
      );
      this.LineItems = [...this.LineItems];
      }
    });
    console.log("this.LineItems",this.LineItems);
  }
  statusDisableOption(option: any) {
    return option?.qStatus !== 'Closed';
  }
  getUnknownValues() {
    this.Cservice.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
  }

  //#region Save Quotation
  SaveQuotation(id:number) {
    const currentDate = new Date();
    if(id==1){
      this.selectedQuoteStatusId=1;
      let j = 0
      this.LineItems.forEach(ele => {
        if (ele.serviceInId == null || ele.calculationParameterId==null || ele.calculationTypeId==null || ele.taxId==null || ele.taxPercentage ==null) {
          j++;
          this.invalidLineItem.push(ele.lineItemName);
        }
      });
  
      if (j > 0) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Please fill the LineItem details in LineItem tab: " + this.invalidLineItem.join(", ") + ".",
          showConfirmButton: false,
          timer: 2000,
        });
        this.invalidLineItem = [];
        this.changeTab(2);
        return;
      }
        const QuotationPayload = {
          ...this.Quotation.value,
          quotationNumber:this.Quotation.controls["quotationNumber"].value,
          quotationFullNumber:this.Quotation.controls["quotationFullNumber"].value,
          quotationDate: this.formatDate(this.Quotation.controls['quotationDate'].value),
          quoteValidTo: this.formatDate(this.Quotation.controls['quoteValidTo'].value),
          quotationAgainstId: this.selectedQagainstId ||this.getUnknownId("QAgainst") ,
          refNumberId: this.selectedrefnumberid,
          customerCategoryId: this.selectedcuscategoryid,
          customerId: this.selectedcustometid,
          customerAddressId: this.SelectedAddressId,
          salesOwnerId: this.SelectedSalesOwnerId,
          salesExecutiveId: this.SelectedSalesExecutiveId,
          billCurrencyId: this.selectedbillCurrencyId,
          quoteStatusId: this.selectedQuoteStatusId,
          closedReasonId: this.selectedreasonId,
          approvalStatusId: this.selectedApprovalStatusId,
          clientResponseId: this.selectedClientResponseId,
          quoteDisplayTypeId:this.storageQuoteDisplayId,
          jobCategoryId: this.jobCategoryId ||this.getUnknownId("JobCat"),
          jobTypeId: this.jobTypeId || this.getUnknownId("JobType"),
         
          informationSourceId: this.selectedinformationSourceId ||this.getUnknownId("info"),
          originCountryId: this.originCountryId || this.getUnknownId("Country"),
          destCountryId: this.destCountryId || this.getUnknownId("Country"),
          loadingPortId: this.loadingPortId,
          destinationPortId: this.destinationPortId,
          originLocationId: this.selectedoriginLocationId,
          destLocationId: this.destLocationId,
          trailerTypeId: this.trailerTypeId,
          transportTypeId: this.transportTypeId,
          shipmentTypeId: this.shipmentTypeId,
          containerTypeId: this.containerTypeId,
          cargoTypeId: this.selectedcargoTypeId,
          storageUomId: this.storageUomId,
          termsandConditions: this.content.value,
          createdBy: this.userId$,
          updatedBy: this.userId$,
          createdDate: currentDate,
          updatedDate: currentDate,
        }
  
        const QuotePayload: QuotationContainer = {
          quotation: QuotationPayload,
          quotationIncoTerms: this.qIncoTerm,
          quotationCommodities: this.qCommodity,
          quotationTransportMode: this.qTransportMode,
          quotationPackages: this.QPackage,
          quotationDocuments: this.qdocument,
          quotationLineItems: this.LineItems,
          quotationContact:this.Contactperson
        }
        console.log("QuotePayload",QuotePayload)
        this.Qs
          .QuotationSave(QuotePayload).subscribe({
            next: (res) => {
              const formData = new FormData();
              this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
              this.Fs.FileUpload(formData).subscribe({
                next: (res) => {
                  
                },
                error: (error) => {
                }
              });
  
              if (!this.Editing) {
                this.Cservice.displayToaster(
                  "success",
                  "Success",
                  "Quotation Added Sucessfully.."
                );
                this.router.navigate(["/qms/transaction/Quotelist"]);
              }  
              if(this.Editing){
                
                this.Cservice.displayToaster(
                  "success",
                  "Success",
                  "Quotation Updated Sucessfully.."
                );
                this.router.navigate(["/qms/transaction/Quotelist"]);
              }
              if(this.revis){
                
                this.Cservice.displayToaster(
                  "success",
                  "Success",
                  "Quotation Revision Added Sucessfully.."
                );
                this.router.navigate(["/qms/transaction/Quotelist"]);
              }
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
            },
          });
      
    }else if(id==2){
      if(this.selectedQuoteStatusId==1){
        this.selectedQuoteStatusId=3;
        this.selectedClientResponseId=2;  
      }
      if(this.selectedClientResponseId==3){
        this.selectedQuoteStatusId=5;
      }
      if(this.selectedClientResponseId==4){
        this.selectedQuoteStatusId=4;
      }
      if(this.selectedClientResponseId==5){
        this.selectedQuoteStatusId=4;
      }

      let j = 0
      this.LineItems.forEach(ele => {
        if (ele.serviceInId == null || ele.calculationParameterId==null || ele.calculationTypeId==null || ele.taxId==null || ele.taxPercentage ==null) {
          j++;
          this.invalidLineItem.push(ele.lineItemName);
        }
      });
  
      if (j > 0) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Please fill the LineItem details in LineItem tab: " + this.invalidLineItem.join(", ") + ".",
          showConfirmButton: false,
          timer: 2000,
        });
        this.invalidLineItem = [];
        this.changeTab(2);
        return;
      }
  
      // let i = 0
      // this.LineItems.forEach(ele => {
      //   ele.quotationLineItemVendorValues?.quotationLineItemVendorValueDetails.forEach(item=>{
      //     if (item.calculationParameterId==null || item.calculationTypeId==null || item.taxId==null || item.taxPercentage ==null
      //       || item.valueInVendorCurrency ==null || item.minValueInVendorCurrency== null
      //     ) {
      //       i++;
      //       this.invalidLineItem.push(ele.lineItemCategoryName);
      //     }
      //   })
      // });
  
      // if (i > 0) {
      //   Swal.fire({
      //     icon: "info",
      //     title: "Info",
      //     text: "Please fill the Vendor value in Vendor line Item: " + this.invalidLineItem.join(", ") + ".",
      //     showConfirmButton: false,
      //     timer: 2000,
      //   });
      //   this.invalidLineItem = [];
      //   return;
      // }
  debugger;
       var noOfpkgcount=0;
       var count =0;
       this.Quotation.controls['quotationDate'].setErrors(null);
      
        const noOfpkg = this.Quotation.controls['packageNos'].value
        noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
        count = this.QPackage.length;
        if(noOfpkg==""){
          this.Quotation.controls['packageNos'].setValue(null);
        }
        let informationSourceId = this.Quotation.controls['informationSourceId'].value
    if (informationSourceId?.informationSourceName === null || informationSourceId?.informationSourceName === undefined) {
      this.Quotation.controls['informationSourceId'].reset();
    }
    let jobCategoryId = this.Quotation.controls['jobCategoryId'].value
    if (jobCategoryId.jobCategory === null) {
      this.Quotation.controls['jobCategoryId'].reset();
    }
    let jobTypeId = this.Quotation.controls['jobTypeId'].value
    if (jobTypeId.jobTypeName === null) {
      this.Quotation.controls['jobTypeId'].reset();
    }
    let originCountryId = this.Quotation.controls['originCountryId'].value
    if (originCountryId === undefined) {
      this.Quotation.controls['originCountryId'].reset();
    }
    let destCountryId = this.Quotation.controls['destCountryId'].value
    if (destCountryId === undefined) {
      this.Quotation.controls['destCountryId'].reset();
    }
      
      if (this.Quotation.valid && noOfpkgcount ==count) {
        const QuotationPayload = {
          ...this.Quotation.value,
          quotationNumber:this.Quotation.controls["quotationNumber"].value,
          quotationFullNumber:this.Quotation.controls["quotationFullNumber"].value,
          quotationDate: this.formatDate(this.Quotation.controls['quotationDate'].value),
          quoteValidTo: this.formatDate(this.Quotation.controls['quoteValidTo'].value),
          quotationAgainstId: this.selectedQagainstId,
          refNumberId: this.selectedrefnumberid,
          customerCategoryId: this.selectedcuscategoryid,
          customerId: this.selectedcustometid,
          customerAddressId: this.SelectedAddressId,
          salesOwnerId: this.SelectedSalesOwnerId,
          salesExecutiveId: this.SelectedSalesExecutiveId,
          billCurrencyId: this.selectedbillCurrencyId,
          quoteStatusId: this.selectedQuoteStatusId,
          closedReasonId: this.selectedreasonId,
          approvalStatusId: this.selectedApprovalStatusId,
          clientResponseId: this.selectedClientResponseId,
          quoteDisplayTypeId:this.storageQuoteDisplayId,
          jobCategoryId: this.jobCategoryId,
          jobTypeId: this.jobTypeId,
         
          informationSourceId: this.selectedinformationSourceId,
          originCountryId: this.originCountryId,
          destCountryId: this.destCountryId,
          loadingPortId: this.loadingPortId,
          destinationPortId: this.destinationPortId,
          originLocationId: this.selectedoriginLocationId,
          destLocationId: this.destLocationId,
          trailerTypeId: this.trailerTypeId,
          transportTypeId: this.transportTypeId,
          shipmentTypeId: this.shipmentTypeId,
          containerTypeId: this.containerTypeId,
          cargoTypeId: this.selectedcargoTypeId,
          storageUomId: this.storageUomId,
          termsandConditions: this.content.value,
          createdBy: this.userId$,
          updatedBy: this.userId$,
          createdDate: currentDate,
          updatedDate: currentDate,
        }
  
        const QuotePayload: QuotationContainer = {
          quotation: QuotationPayload,
          quotationIncoTerms: this.qIncoTerm,
          quotationCommodities: this.qCommodity,
          quotationTransportMode: this.qTransportMode,
          quotationPackages: this.QPackage,
          quotationDocuments: this.qdocument,
          quotationLineItems: this.LineItems,
          quotationContact:this.Contactperson
        }
        console.log("QuotePayload",QuotePayload)
        this.Qs
          .QuotationSave(QuotePayload).subscribe({
            next: (res) => {
              const formData = new FormData();
              this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
              this.Fs.FileUpload(formData).subscribe({
                next: (res) => {
                  
                },
                error: (error) => {
                }
              });
  
              if (!this.Editing) {
                this.Cservice.displayToaster(
                  "success",
                  "Success",
                  "Quotation Added Sucessfully.."
                );
                this.router.navigate(["/qms/transaction/Quotelist"]);
              }  
              if(this.Editing){
                
                this.Cservice.displayToaster(
                  "success",
                  "Success",
                  "Quotation Updated Sucessfully.."
                );
                this.router.navigate(["/qms/transaction/Quotelist"]);
              }
              if(this.revis){
                
                this.Cservice.displayToaster(
                  "success",
                  "Success",
                  "Quotation Revision Added Sucessfully.."
                );
                this.router.navigate(["/qms/transaction/Quotelist"]);
              }
              // if(this.ImageDetailsArray.length>0){
              //   const partId = res.message
              //   const formData = new FormData();
              //   const id = 1;
              //   formData.append('id', partId); // Append the id here
              //   this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
              //   this.service.UploadImage(formData).subscribe({
              //     next: (res) => {
              //       this.commonService.displayToaster(
              //         "success",
              //         "Success",
              //         "Part Added Sucessfully.."
              //       );
              //       this.router.navigate(["/crm/master/partlist"]);
              //     },
              //     error: (error) => {
              //       var ErrorHandle = this.ErrorHandling.handleApiError(error)
              //       this.commonService.displayToaster(
              //         "error",
              //         "Error",
              //         ErrorHandle
              //       );
              //     }
              //   });
              // }else{
              //   this.commonService.displayToaster(
              //     "success",
              //     "Success",
              //     "Part Added Sucessfully.."
              //   );
              //   this.router.navigate(["/crm/master/partlist"]);
              // }   
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
            },
          });
  
  
      } else {
        
          const invalidControls = this.findInvalidControls();
          const noOfpkg = this.Quotation.controls['packageNos'].value
          const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
          const count = this.QPackage.length;
          if(noOfpkgcount!=count){
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Package details is less when compared to No of packages.",
              showConfirmButton: true,
            });
            this.changeTab(1);
            return;
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
              showConfirmButton: true,
            });
            this.Quotation.markAllAsTouched();
            this.validateall(this.Quotation);
            if(invalidControls?.includes("Job Category") || invalidControls?.includes("Job Type")
            || invalidControls?.includes("Origin Country") || invalidControls?.includes("Dest Country")){
              this.changeTab(1);
            } else {
              this.changeTab(0);
            }
           }
        // }else{
        //   const invalidControls = this.findInvalidControls();
        //     Swal.fire({
        //       icon: "error",
        //       title: "Oops!",
        //       text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        //       showConfirmButton: true,
        //     });
        //     this.Quotation.markAllAsTouched();
        //     this.validateall(this.Quotation);
           
        // }
        
      
       
      }
  
     }
    //  if( this.ispackage==true){
    //   if(this.QPackage.length==0){
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Warning!",
    //       text: "Please fill package details",
    //       showConfirmButton: false,
    //       timer: 2000,
    //     });
    //     return;
    //   }
    //  }
    
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }
  
  formatDate(date: Date): string {
    // Get the current time
    if (date != null) {
      const currentTime = new Date();
      // Format the date and concatenate with the current time
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      const formattedTime = this.datePipe.transform(currentTime, 'HH:mm:ss');
      return formattedDate + 'T' + formattedTime;
    } else {
      return date;
    }
  }

  //#region getExchange
  getExchange() {
    this.Cservice.GetExchangeById(this.selectedbillCurrencyId).subscribe(res => {
      this.exchangeValue = res;

      console.log("this.exchangeValue",this.exchangeValue)
      this.exchangerate = this.exchangeValue.exchangerate;
      this.Quotation.controls['exchangeRate'].setValue(this.exchangerate);
    })
  }
  getUnknownId(value: any) {
    let option = this.UnknownValueList.find(option => option?.name == value)
    return option?.id;
  }

//// finding In valid field
findInvalidControls(): string[] {
  const invalidControls: string[] = [];
  const controls = this.Quotation.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalidControls.push(this.capitalizeWords(this.toUpperCaseAndTrimId(name)));
    }
  }
  return invalidControls;
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
  EditQuotation() {
    debugger;
    var Path = this.router.url;
    var QuteId = this.route.snapshot.params["id"]
    this.quotationID = QuteId;
    this.Edits = Path.includes("/edit");
    if (this.Edits) {
      this.Mode="Edit"
      this.Editing=true;
      this.disablefields=false;
      this.Qs.GetAllQuotationById(QuteId).subscribe((result: QuotationContainer) => {

        console.log("result", result);
        this.selectedQagainstId = result.quotation.quotationAgainstId;
        if (this.selectedQagainstId == 1) {
          this.Enquirynumber();
        }
        if (this.selectedQagainstId == 2) {
          this.Quotation.controls["refNumberId"].disable();
        }
        this.selectedrefnumberid = result.quotation.refNumberId;
        this.selectedcuscategoryid = result.quotation.customerCategoryId;
        this.LoadCustomerName(this.selectedcuscategoryid);
        this.selectedcustometid = result.quotation.customerId;
        this.Loadcontactandaddress(this.selectedcuscategoryid, 1);
        this.BillingCurrencyLoad(this.selectedcuscategoryid);
        this.SelectedAddressId = result.quotation.customerAddressId;
        this.SelectedSalesOwnerId = result.quotation.salesOwnerId;
        this.SelectedSalesExecutiveId = result.quotation.salesExecutiveId;
        this.selectedbillCurrencyId = result.quotation.billCurrencyId;
        this.selectedQuoteStatusId = result.quotation.quoteStatusId;
        if(this.selectedQuoteStatusId==4){
          this.Quotation.controls["closedReasonId"].setValidators([Validators.required]);
          this.Quotation.controls["closedRemarks"].setValidators([Validators.required]);
          this.Quotation.get('closedReasonId')?.updateValueAndValidity();
          this.Quotation.get('closedRemarks')?.updateValueAndValidity();
          this.hidden=true;
        }else{
          this.Quotation.controls['closedReasonId']?.setValidators([Validators.nullValidator]);
          this.Quotation.controls['closedRemarks']?.setValidators([Validators.nullValidator]);
          this.Quotation.get('closedReasonId')?.updateValueAndValidity();
          this.Quotation.get('closedRemarks')?.updateValueAndValidity();
          this.hidden=false;
        }
        this.selectedreasonId = result.quotation.closedReasonId;
        this.selectedApprovalStatusId = result.quotation.approvalStatusId;
        this.selectedClientResponseId = result.quotation.clientResponseId;
        this.selectedinformationSourceId = result.quotation.informationSourceId;
        this.storageQuoteDisplayId = result.quotation.quoteDisplayTypeId;
        this.jobCategoryId = result.quotation.jobCategoryId;
        if (this.jobCategoryId != null) {
          this.getjobTypeList(this.jobCategoryId);
        }
        this.jobTypeId = result.quotation.jobTypeId;
        if(this.jobTypeId!=null){
          this.Jtype.getAllJopTypeById(this.jobTypeId).subscribe((res)=>{
            this.ispackage = res.jobTypeGeneral.packageDetails;
           });
        }
        if(this.jobCategoryId == 2){
          this.enableforwarehouse = true;
        }else{
          this.enableforwarehouse = false;
        }
        this.SelectedSalesOwnerId = result.quotation.salesOwnerId;
        this.selectedcargoTypeId = result.quotation.cargoTypeId;
        this.trailerTypeId = result.quotation.trailerTypeId;
        this.transportTypeId = result.quotation.transportTypeId;
        this.shipmentTypeId = result.quotation.shipmentTypeId;
        this.containerTypeId = result.quotation.containerTypeId;
        this.storageUomId = result.quotation.storageUomId;
        this.originCountryId = result.quotation.originCountryId;
        this.destCountryId = result.quotation.destCountryId;
        this.loadingPortId = result.quotation.loadingPortId;
        this.destinationPortId = result.quotation.destinationPortId;
        this.selectedoriginLocationId = result.quotation.originLocationId;
        this.destLocationId = result.quotation.destLocationId


        this.Quotation.patchValue(result.quotation);
       
        this.Quotation.controls["quotationAgainstId"].setValue(result.quotation);
        this.Quotation.controls["refNumberId"].setValue(result.quotation);
        this.Quotation.controls["customerCategoryId"].setValue(result.quotation);
        this.Quotation.controls["customerId"].setValue(result.quotation);
       // this.Quotation.controls["customerId"].setValue(result.quotation);
        this.Quotation.controls["salesOwnerId"].setValue(result.quotation);
        this.Quotation.controls["salesExecutiveId"].setValue(result.quotation);
        this.Quotation.controls["customerAddressId"].setValue(result.quotation);
        this.Quotation.controls["billCurrencyId"].setValue(result.quotation);
        this.Quotation.controls["quoteStatusId"].setValue(result.quotation);
        if(this.selectedreasonId !=4){
          this.Quotation.controls["closedReasonId"].setValue(result.quotation);
        }
        this.Quotation.controls["approvalStatusId"].setValue(result.quotation);
        this.Quotation.controls["clientResponseId"].setValue(result.quotation);
        this.Quotation.controls["informationSourceId"].setValue(result.quotation);
        this.Quotation.controls["quoteDisplayTypeId"].setValue(result.quotation);
        this.Quotation.controls["jobCategoryId"].setValue(result.quotation);
        this.Quotation.controls["jobTypeId"].setValue(result.quotation);
        this.Quotation.controls["cargoTypeId"].setValue(result.quotation);
        this.Quotation.controls["trailerTypeId"].setValue(result.quotation);
        this.Quotation.controls["transportTypeId"].setValue(result.quotation);
        this.Quotation.controls["shipmentTypeId"].setValue(result.quotation);
        this.Quotation.controls["containerTypeId"].setValue(result.quotation);
        this.Quotation.controls["storageUomId"].setValue(result.quotation);
        this.Cservice.getCountries(1).subscribe((result) => {
          this.CountryDatalist = result;
          const orgincountry = this.CountryDatalist.find(obj => obj.countryId == this.originCountryId)
        this.Quotation.controls['originCountryId'].setValue(orgincountry);
        const destcountry = this.CountryDatalist.find(obj => obj.countryId == this.destCountryId)
        this.Quotation.controls['destCountryId'].setValue(destcountry);
        });
        this.Cservice.getEmployees(1).subscribe((res) => {
          this.EmployeeList = res;
          const SalesExecutive = this.EmployeeList.find(obj => obj.employeeId == this.SelectedSalesExecutiveId)
          this.Quotation.controls['salesExecutiveId'].setValue(SalesExecutive);
        });
        this.Quotation.controls['isrevision'].setValue(false);
        this.qCommodity = result.quotationCommodities;
        this.qIncoTerm = result.quotationIncoTerms;
        this.qTransportMode = result.quotationTransportMode;
        this.QPackage = result.quotationPackages;
        this.LineItems = result.quotationLineItems;
        this.Contactperson = result.quotationContact;
        this.ImageDataArray = result.quotationDocuments;
        this.qdocument=[...this.ImageDataArray];
        var Commodity = this.qCommodity.map(id => id.commodityId);
        var inco = this.qIncoTerm.map(id => id.incoTermId);
        var modeTrns = this.qTransportMode.map(id => id.transportModeId)
        var contact = this.Contactperson.map(id => id.contactId);
        this.Quotation.controls["commodityId"].setValue(Commodity);
        this.Quotation.controls["incoTermId"].setValue(inco);
        this.Quotation.controls["modeofTransportId"].setValue(modeTrns);
        this.onSelectTransport();
        this.Quotation.controls["customerContactId"].setValue(contact);
        this.onSelectcontact();
        this.content.setValue(result.quotation.termsandConditions);


        const selectedtransportMode = this.qTransportMode.map(val => val.transportModeId);
        this.Quotation.controls['modeofTransportId'].setValue(selectedtransportMode);
        if (selectedtransportMode.includes(1) && selectedtransportMode.includes(3)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();


        } else if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          this.airportflag = false;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = true
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();

          if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
            // Set validators for mandatory fields when statusId is 1
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
          } else {
            // Remove validators if statusId is not 2
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

            this.Quotation.get('shipmentTypeId')?.setValue(null);
          }

          this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
        } else if (selectedtransportMode.includes(1)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          // this.RfqgeneralForm.controls['loadingPortId'].reset();
          // this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(2)) {
          this.airportflag = false;
          this.fetch();
          if (selectedtransportMode.includes(2)) {
            // Set validators for mandatory fields when statusId is 1
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
          } else {
            // Remove validators if statusId is not 2
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

            this.Quotation.get('shipmentTypeId')?.setValue(null);
          }

          this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true
          this.chargablepackage = true;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(4)) {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }
        else {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }
      });
    }
  }
  ViewQuotation() {
    var Path = this.router.url;
    var QuteId = this.route.snapshot.params["id"];
    this.view = Path.includes("/view");
    if (this.view) {
      this.disablefields=true;
      this.Mode=
      'view'
      this.Qs.GetAllQuotationById(QuteId).subscribe((result: QuotationContainer) => {

        console.log("result", result);
        this.selectedQagainstId = result.quotation.quotationAgainstId;
        if (this.selectedQagainstId == 1) {
          this.Enquirynumber();
        }
        this.selectedrefnumberid = result.quotation.refNumberId;
        this.selectedcuscategoryid = result.quotation.customerCategoryId;
        this.LoadCustomerName(this.selectedcuscategoryid);
        this.selectedcustometid = result.quotation.customerId;
        this.Loadcontactandaddress(this.selectedcuscategoryid, 1);
        this.BillingCurrencyLoad(this.selectedcuscategoryid);
        this.SelectedAddressId = result.quotation.customerAddressId;
        this.SelectedSalesOwnerId = result.quotation.salesOwnerId;
        this.SelectedSalesExecutiveId = result.quotation.salesExecutiveId;
        this.selectedbillCurrencyId = result.quotation.billCurrencyId;
        this.selectedQuoteStatusId = result.quotation.quoteStatusId;
        if(this.selectedQuoteStatusId==4){
          this.Quotation.controls["closedReasonId"].setValidators([Validators.required]);
          this.Quotation.controls["closedRemarks"].setValidators([Validators.required]);
          this.Quotation.get('closedReasonId')?.updateValueAndValidity();
          this.Quotation.get('closedRemarks')?.updateValueAndValidity();
          this.hidden=true;
        }else{
          this.Quotation.controls['closedReasonId']?.setValidators([Validators.nullValidator]);
          this.Quotation.controls['closedRemarks']?.setValidators([Validators.nullValidator]);
          this.Quotation.get('closedReasonId')?.updateValueAndValidity();
          this.Quotation.get('closedRemarks')?.updateValueAndValidity();
          this.hidden=false;
        }
        this.selectedreasonId = result.quotation.closedReasonId;
        this.selectedApprovalStatusId = result.quotation.approvalStatusId;
        this.selectedClientResponseId = result.quotation.clientResponseId;
        this.selectedinformationSourceId = result.quotation.informationSourceId;
        this.storageQuoteDisplayId = result.quotation.quoteDisplayTypeId;
        this.jobCategoryId = result.quotation.jobCategoryId;
        if (this.jobCategoryId != null) {
          this.getjobTypeList(this.jobCategoryId);
        }
        this.jobTypeId = result.quotation.jobTypeId;
        if(this.jobTypeId!=null){
          this.Jtype.getAllJopTypeById(this.jobTypeId).subscribe((res)=>{
            this.ispackage = res.jobTypeGeneral.packageDetails;
           });
        }
        if(this.jobCategoryId == 2){
          this.enableforwarehouse = true;
        }else{
          this.enableforwarehouse = false;
        }
        this.SelectedSalesOwnerId = result.quotation.salesOwnerId;
        this.selectedcargoTypeId = result.quotation.cargoTypeId;
        this.trailerTypeId = result.quotation.trailerTypeId;
        this.transportTypeId = result.quotation.transportTypeId;
        this.shipmentTypeId = result.quotation.shipmentTypeId;
        this.containerTypeId = result.quotation.containerTypeId;
        this.storageUomId = result.quotation.storageUomId;
        this.originCountryId = result.quotation.originCountryId;
        this.destCountryId = result.quotation.destCountryId;
        this.loadingPortId = result.quotation.loadingPortId;
        this.destinationPortId = result.quotation.destinationPortId;
        this.selectedoriginLocationId = result.quotation.originLocationId;
        this.destLocationId = result.quotation.destLocationId


        this.Quotation.patchValue(result.quotation);
       
        this.Quotation.controls["quotationAgainstId"].setValue(result.quotation);
        this.Quotation.controls["refNumberId"].setValue(result.quotation);
        this.Quotation.controls["customerCategoryId"].setValue(result.quotation);
        this.Quotation.controls["customerId"].setValue(result.quotation);
        //this.Quotation.controls["customerId"].setValue(result.quotation);
        this.Quotation.controls["salesOwnerId"].setValue(result.quotation);
        this.Quotation.controls["salesExecutiveId"].setValue(result.quotation);
        this.Quotation.controls["customerAddressId"].setValue(result.quotation);
        this.Quotation.controls["billCurrencyId"].setValue(result.quotation);
        this.Quotation.controls["quoteStatusId"].setValue(result.quotation);
        this.Quotation.controls["closedReasonId"].setValue(result.quotation);
        this.Quotation.controls["approvalStatusId"].setValue(result.quotation);
        this.Quotation.controls["clientResponseId"].setValue(result.quotation);
        this.Quotation.controls["informationSourceId"].setValue(result.quotation);
        this.Quotation.controls["quoteDisplayTypeId"].setValue(result.quotation);
        this.Quotation.controls["jobCategoryId"].setValue(result.quotation);
        this.Quotation.controls["jobTypeId"].setValue(result.quotation);
        this.Quotation.controls["cargoTypeId"].setValue(result.quotation);
        this.Quotation.controls["trailerTypeId"].setValue(result.quotation);
        this.Quotation.controls["transportTypeId"].setValue(result.quotation);
        this.Quotation.controls["shipmentTypeId"].setValue(result.quotation);
        this.Quotation.controls["containerTypeId"].setValue(result.quotation);
        this.Quotation.controls["storageUomId"].setValue(result.quotation);
        this.Cservice.getCountries(1).subscribe((result) => {
          this.CountryDatalist = result;
          const orgincountry = this.CountryDatalist.find(obj => obj.countryId == this.originCountryId)
        this.Quotation.controls['originCountryId'].setValue(orgincountry);
        const destcountry = this.CountryDatalist.find(obj => obj.countryId == this.destCountryId)
        this.Quotation.controls['destCountryId'].setValue(destcountry);
        });
        this.Cservice.getEmployees(1).subscribe((res) => {
          this.EmployeeList = res;
          const SalesExecutive = this.EmployeeList.find(obj => obj.employeeId == this.SelectedSalesExecutiveId)
          this.Quotation.controls['salesExecutiveId'].setValue(SalesExecutive);
        });
        this.Quotation.controls['isrevision'].setValue(false);
        this.qCommodity = result.quotationCommodities;
        this.qIncoTerm = result.quotationIncoTerms;
        this.qTransportMode = result.quotationTransportMode;
        this.QPackage = result.quotationPackages;
        this.LineItems = result.quotationLineItems;
        this.Contactperson = result.quotationContact;
        this.ImageDataArray = result.quotationDocuments;
        this.qdocument=[...this.ImageDataArray];
        var Commodity = this.qCommodity.map(id => id.commodityId);
        var inco = this.qIncoTerm.map(id => id.incoTermId);
        var modeTrns = this.qTransportMode.map(id => id.transportModeId)
        var contact = this.Contactperson.map(id => id.contactId);
        this.Quotation.controls["commodityId"].setValue(Commodity);
        this.Quotation.controls["incoTermId"].setValue(inco);
        this.Quotation.controls["modeofTransportId"].setValue(modeTrns);
        this.onSelectTransport();
        this.Quotation.controls["customerContactId"].setValue(contact);
        this.onSelectcontact();
        this.content.setValue(result.quotation.termsandConditions);


        const selectedtransportMode = this.qTransportMode.map(val => val.transportModeId);
        this.Quotation.controls['modeofTransportId'].setValue(selectedtransportMode);
        if (selectedtransportMode.includes(1) && selectedtransportMode.includes(3)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();


        } else if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          this.airportflag = false;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = true
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();

          if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
            // Set validators for mandatory fields when statusId is 1
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
          } else {
            // Remove validators if statusId is not 2
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

            this.Quotation.get('shipmentTypeId')?.setValue(null);
          }

          this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
        } else if (selectedtransportMode.includes(1)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          // this.RfqgeneralForm.controls['loadingPortId'].reset();
          // this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(2)) {
          this.airportflag = false;
          this.fetch();
          if (selectedtransportMode.includes(2)) {
            // Set validators for mandatory fields when statusId is 1
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
          } else {
            // Remove validators if statusId is not 2
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

            this.Quotation.get('shipmentTypeId')?.setValue(null);
          }

          this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true
          this.chargablepackage = true;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(4)) {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }
        else {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }
      });
    }
  }


  Revision() {
    var Path = this.router.url;
    var QuteId = this.route.snapshot.params["id"]
    this.revision = Path.includes("/revision");
    if (this.revision) {
      this.revis=true;
      this.Qs.GetAllQuotationById(QuteId).subscribe((result: QuotationContainer) => {

        console.log("resultrevision", result);
        this.selectedQagainstId = result.quotation.quotationAgainstId;
        if (this.selectedQagainstId == 1) {
          this.Enquirynumber();
        }
        this.selectedrefnumberid = result.quotation.refNumberId;
        this.selectedcuscategoryid = result.quotation.customerCategoryId;
        this.LoadCustomerName(this.selectedcuscategoryid);
        this.selectedcustometid = result.quotation.customerId;
        this.Loadcontactandaddress(this.selectedcuscategoryid, 1);
        this.BillingCurrencyLoad(this.selectedcuscategoryid);
        this.SelectedAddressId = result.quotation.customerAddressId;
        this.SelectedSalesOwnerId = result.quotation.salesOwnerId;
        this.SelectedSalesExecutiveId = result.quotation.salesExecutiveId;
        this.selectedbillCurrencyId = result.quotation.billCurrencyId;
        this.selectedQuoteStatusId = result.quotation.quoteStatusId;
        this.selectedreasonId = result.quotation.closedReasonId;
        this.selectedApprovalStatusId = result.quotation.approvalStatusId;
        this.selectedClientResponseId = result.quotation.clientResponseId;
        this.selectedinformationSourceId = result.quotation.informationSourceId;
        this.storageQuoteDisplayId = result.quotation.quoteDisplayTypeId;
        this.jobCategoryId = result.quotation.jobCategoryId;
        if (this.jobCategoryId != null) {
          this.getjobTypeList(this.jobCategoryId);
        }
        this.jobTypeId = result.quotation.jobTypeId;
        if(this.jobTypeId!=null){
          this.Jtype.getAllJopTypeById(this.jobTypeId).subscribe((res)=>{
            this.ispackage = res.jobTypeGeneral.packageDetails;
           });
        }
        this.SelectedSalesOwnerId = result.quotation.salesOwnerId;
        this.selectedcargoTypeId = result.quotation.cargoTypeId;
        this.trailerTypeId = result.quotation.trailerTypeId;
        this.transportTypeId = result.quotation.transportTypeId;
        this.shipmentTypeId = result.quotation.shipmentTypeId;
        this.containerTypeId = result.quotation.containerTypeId;
        this.storageUomId = result.quotation.storageUomId;
        this.originCountryId = result.quotation.originCountryId;
        this.destCountryId = result.quotation.destCountryId;
        this.loadingPortId = result.quotation.loadingPortId;
        this.destinationPortId = result.quotation.destinationPortId;
        this.selectedoriginLocationId = result.quotation.originLocationId;
        this.destLocationId = result.quotation.destLocationId


        this.Quotation.patchValue(result.quotation);
       
        this.Quotation.controls["quotationAgainstId"].setValue(result.quotation);
        this.Quotation.controls["refNumberId"].setValue(result.quotation);
        this.Quotation.controls["customerCategoryId"].setValue(result.quotation);
        this.Quotation.controls["customerId"].setValue(result.quotation);
        this.Quotation.controls["customerId"].setValue(result.quotation);
        this.Quotation.controls["salesOwnerId"].setValue(result.quotation);
        this.Quotation.controls["salesExecutiveId"].setValue(result.quotation);
        this.Quotation.controls["customerAddressId"].setValue(result.quotation);
        this.Quotation.controls["billCurrencyId"].setValue(result.quotation);
        this.Quotation.controls["quoteStatusId"].setValue(result.quotation);
        this.Quotation.controls["closedReasonId"].setValue(result.quotation);
        this.Quotation.controls["approvalStatusId"].setValue(result.quotation);
        this.Quotation.controls["clientResponseId"].setValue(result.quotation);
        this.Quotation.controls["informationSourceId"].setValue(result.quotation);
        this.Quotation.controls["quoteDisplayTypeId"].setValue(result.quotation);
        this.Quotation.controls["jobCategoryId"].setValue(result.quotation);
        this.Quotation.controls["jobTypeId"].setValue(result.quotation);
        this.Quotation.controls["cargoTypeId"].setValue(result.quotation);
        this.Quotation.controls["trailerTypeId"].setValue(result.quotation);
        this.Quotation.controls["transportTypeId"].setValue(result.quotation);
        this.Quotation.controls["shipmentTypeId"].setValue(result.quotation);
        this.Quotation.controls["containerTypeId"].setValue(result.quotation);
        this.Quotation.controls["storageUomId"].setValue(result.quotation);
        this.Cservice.getCountries(1).subscribe((result) => {
          this.CountryDatalist = result;
          const orgincountry = this.CountryDatalist.find(obj => obj.countryId == this.originCountryId)
        this.Quotation.controls['originCountryId'].setValue(orgincountry);
        const destcountry = this.CountryDatalist.find(obj => obj.countryId == this.destCountryId)
        this.Quotation.controls['destCountryId'].setValue(destcountry);
        });
        this.Cservice.getEmployees(1).subscribe((res) => {
          this.EmployeeList = res;
          const SalesExecutive = this.EmployeeList.find(obj => obj.employeeId == this.SelectedSalesExecutiveId)
          this.Quotation.controls['salesExecutiveId'].setValue(SalesExecutive);
        });
        this.Quotation.controls['isrevision'].setValue(true);
        this.qCommodity = result.quotationCommodities;
        this.qIncoTerm = result.quotationIncoTerms;
        this.qTransportMode = result.quotationTransportMode;
        this.QPackage = result.quotationPackages;
        this.LineItems = result.quotationLineItems;
        this.Contactperson = result.quotationContact;
        this.ImageDataArray = result.quotationDocuments;
        this.qdocument=[...this.ImageDataArray];
        var Commodity = this.qCommodity.map(id => id.commodityId);
        var inco = this.qIncoTerm.map(id => id.incoTermId);
        var modeTrns = this.qTransportMode.map(id => id.transportModeId)
        var contact = this.Contactperson.map(id => id.contactId);
        this.Quotation.controls["commodityId"].setValue(Commodity);
        this.Quotation.controls["incoTermId"].setValue(inco);
        this.Quotation.controls["modeofTransportId"].setValue(modeTrns);
        this.onSelectTransport();
        this.Quotation.controls["customerContactId"].setValue(contact);
        this.onSelectcontact();
        this.content.setValue(result.quotation.termsandConditions);


        const selectedtransportMode = this.qTransportMode.map(val => val.transportModeId);
        this.Quotation.controls['modeofTransportId'].setValue(selectedtransportMode);
        if (selectedtransportMode.includes(1) && selectedtransportMode.includes(3)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();


        } else if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          this.airportflag = false;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = true
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();

          if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
            // Set validators for mandatory fields when statusId is 1
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
          } else {
            // Remove validators if statusId is not 2
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

            this.Quotation.get('shipmentTypeId')?.setValue(null);
          }

          this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
        } else if (selectedtransportMode.includes(1)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          // this.RfqgeneralForm.controls['loadingPortId'].reset();
          // this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(2)) {
          this.airportflag = false;
          this.fetch();
          if (selectedtransportMode.includes(2)) {
            // Set validators for mandatory fields when statusId is 1
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
          } else {
            // Remove validators if statusId is not 2
            this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

            this.Quotation.get('shipmentTypeId')?.setValue(null);
          }

          this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true
          this.chargablepackage = true;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(4)) {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }
        else {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }
      });
    }
  }


  //#region  Fetch Loading port
  fetch() {
    const Cities$ = this.Cservice.getAllCitiesbyCountry(this.originCountryId);
    const CityDest$ = this.Cservice.getAllCitiesbyCountry(this.destCountryId);
    const orginair$ = this.Cservice.GetAllAirportByCountryId(this.originCountryId);
    const destair$ = this.Cservice.GetAllAirportByCountryId(this.destCountryId);
    const orginsea$ = this.Cservice.GetAllSeaportByCountryId(this.originCountryId);
    const destsea$ = this.Cservice.GetAllSeaportByCountryId(this.destCountryId);



    forkJoin([Cities$, CityDest$, orginair$, destair$, orginsea$, destsea$]).subscribe({
      next: ([Cities, CityDest, orginairs, destair, orginsea, destsea]) => {

        this.originCityList = Cities;
        this.originCityFun();
        this.DestCityList = CityDest;
        this.DestCityFun();

        if (this.airportflag) {
          this.airport = orginairs
          const air = this.airport.map(res => {
            return {
              ...res,
              loadingPortId: res.airportId,
              loadingPortName: res.airportName
            };
          });
          this.portofLoadingList = [...air];
          this.lodingportFun();

          this.airport = destair

          const airs = this.airport.map(res => {
            return {
              ...res,
              destinationPortId: res.airportId,
              destinationPortIdName: res.airportName
            };
          });
          this.portofDestinationList = [...airs];
          this.destportFun();
          const loadingPort = this.portofLoadingList.find(obj => obj.loadingPortId == this.loadingPortId)
          this.Quotation.controls['loadingPortId'].setValue(loadingPort)
          const destinationPort = this.portofDestinationList.find(obj => obj.destinationPortId == this.destinationPortId)
          this.Quotation.controls['destinationPortId'].setValue(destinationPort)
        } else if (this.seapoartflag) {
          this.seapoart = orginsea
          const sea = this.seapoart.map(res => {
            return {
              ...res,
              loadingPortId: res.seaportId,
              loadingPortName: res.seaportName
            };
          });
          this.portofLoadingList = [...sea];
          this.lodingportFun();
          this.seapoart = destsea
          const seas = this.seapoart.map(res => {
            return {
              ...res,
              destinationPortId: res.seaportId,
              destinationPortIdName: res.seaportName
            };
          });
          this.portofDestinationList = [...seas];
          this.destportFun();
        }
        const loadingPort = this.portofLoadingList.find(obj => obj.loadingPortId == this.loadingPortId)
        this.Quotation.controls['loadingPortId'].setValue(loadingPort)
        const destinationPort = this.portofDestinationList.find(obj => obj.destinationPortId == this.destinationPortId)
        this.Quotation.controls['destinationPortId'].setValue(destinationPort);

        const orginlocation = this.originCityList.find(obj => obj.cityId == this.selectedoriginLocationId)
        this.Quotation.controls['originLocationId'].setValue(orginlocation);
        const destlocation = this.DestCityList.find(obj => obj.cityId == this.destLocationId)
        this.Quotation.controls['destLocationId'].setValue(destlocation);
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  FromEnquiry(id:number){
    debugger;
    this.Es.GetAllEnquiryById(id).subscribe((result=>{
     
      //this.selectedcuscategoryid = result.enquiryGeneral.customerCategoryId;
      //this.LoadCustomerName(this.selectedcuscategoryid);

      //this.selectedcustometid = result.enquiryGeneral.customerId;
      //this.selectedcuscontact = result.enquiryGeneral.contactId;
      this.Loadcontactandaddress(this.selectedcuscategoryid, 1);
      this.SelectedAddressId = result.enquiryGeneral.addressId;
      //this.selectedbillCurrencyId = result.enquiryGeneral.billCurrencyId;
      //this.selectedQuoteStatusId = result.quotation.quoteStatusId;
      this.selectedreasonId = result.enquiryGeneral.reasonId;
      //this.selectedApprovalStatusId = result.quotation.approvalStatusId;
      //this.selectedClientResponseId = result.quotation.clientResponseId;
      this.selectedinformationSourceId = result.enquiryGeneral.informationSourceId;
      this.jobCategoryId = result.enquiryGeneral.jobCategoryId;
      if (this.jobCategoryId != null) {
        this.getjobTypeList(this.jobCategoryId);
      }

      var countryname = this.CountryDatalist.find(id=>id.countryId == result.enquiryGeneral.destCountryId);

      this.jobTypeId = result.enquiryGeneral.jobTypeId;
      if(this.jobTypeId!=null){
        this.Jtype.getAllJopTypeById(this.jobTypeId).subscribe((res)=>{
          this.ispackage = res.jobTypeGeneral.packageDetails;
          this.content.setValue(res.jobTypeGeneral.termsandConditions);
          if(res.jobTypeLineItems.length>0){
            res.jobTypeLineItems.map(QlineItem => {
              let Lineitem:QlineItem = {
                qLineItemId: 0,
                quotationId: 0,
                lineItemId: QlineItem.lineItemId,
                lineItemCode: QlineItem.lineItemCode,
                lineItemCategoryId: QlineItem.lineItemCategoryId,
                lineItemCategoryName: QlineItem.lineItemCategoryName,
                lineItemDescription: '',
                lineItemName: QlineItem.lineItemName,
                serviceInId:this.destCountryId,
                countryName: countryname?.countryName,
                isVendor: false,
                vendorId: null,
                vendorName: '',
                sourceFromId: null,
                sourceFrom: '',
                refNumberId: 0,
                refNumber: '',
                calculationParameterId: null,
                calculationParameter: '',
                calculationTypeId: null,
                calculationType: '',
                valueInCustomerCurrency: null,
                minValueInCustomerCurrency: null,
                taxId: null,
                taxCodeName: '',
                taxPercentage: null,
                remarks: '',
                createdBy: 0,
                createdDate: this.date,
                updatedBy: 0,
                updatedDate: this.date,
                quotationLineItemVendorValues: undefined,
                vendorCurrencyId: null,
                currencyName: '',
                valueInCompanyCurrency: null,
                minValueInCompanyCurrency: null,
                customerExchangeRate: null,
                isAmendPrice: false
              }
              this.LineItems.push(Lineitem);
              this.LineItems=[...this.LineItems];
            });
            console.log(" this.LineItems", this.LineItems)
          }
         });
      }
      this.SelectedSalesOwnerId = result.enquiryGeneral.salesOwnerId;
      this.SelectedSalesExecutiveId = result.enquiryGeneral.salesExecutiveId;
      this.selectedcargoTypeId = result.enquiryGeneral.cargoTypeid;
      this.trailerTypeId = result.enquiryGeneral.trailerTypeId;
      this.transportTypeId = result.enquiryGeneral.transportTypeId;
      this.shipmentTypeId = result.enquiryGeneral.shipmentTypeId;
      this.containerTypeId = result.enquiryGeneral.containerTypeId;
      this.storageUomId = result.enquiryGeneral.storageUomId;
      this.originCountryId = result.enquiryGeneral.originCountryId;
      this.destCountryId = result.enquiryGeneral.destCountryId;
      this.loadingPortId = result.enquiryGeneral.loadingPortId;
      this.destinationPortId = result.enquiryGeneral.destinationPortId;
      this.selectedoriginLocationId = result.enquiryGeneral.originLocationId;
      this.destLocationId = result.enquiryGeneral.destLocationId


      this.Quotation.patchValue(result.enquiryGeneral);
      debugger;
      var Cuscategory = this.customercategoryList.find(obj => obj.customerCategoryId == this.selectedcuscategoryid);
      this.Quotation.controls["customerCategoryId"].setValue(Cuscategory);
      this.Quotation.controls["customerId"].setValue(result.enquiryGeneral);
      var salesowner = this.EmployeeList.find(obj => obj.employeeId == this.SelectedSalesOwnerId);
      this.Quotation.controls["salesOwnerId"].setValue(salesowner);
      var salesExecutive = this.EmployeeList.find(obj => obj.employeeId == this.SelectedSalesExecutiveId)
      this.Quotation.controls["salesExecutiveId"].setValue(salesExecutive);
      this.Quotation.controls["customerAddressId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["billCurrencyId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["quoteStatusId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["approvalStatusId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["clientResponseId"].setValue(result.enquiryGeneral);
      if(this.selectedinformationSourceId!=null){
        this.Quotation.controls["informationSourceId"].setValue(result.enquiryGeneral);
        this.informationSourceName = result.enquiryGeneral.informationSourceName?.toLowerCase();
        if (this.informationSourceName.includes("reference")) {
          this.reference = true;
          this.Quotation.controls['referenceDetails'].setValue(result.enquiryGeneral.referenceDetail);
          this.UpdateValidityRef();
        } else {
          this.reference = false;
          this.Quotation.controls['referenceDetails'].setValue(null);
          this.UpdateValidityRef();
        }
      }
      this.Quotation.controls["jobCategoryId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["jobTypeId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["cargoTypeId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["trailerTypeId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["transportTypeId"].setValue(result.enquiryGeneral);
      var Qstatus = this.quoteStatusList.find(id=>id.qStatusId == this.selectedQuoteStatusId);
      this.Quotation.controls["quoteStatusId"].setValue(Qstatus);
      if(result.enquiryGeneral.shipmentTypeId!=null){
        this.Quotation.controls["shipmentTypeId"].setValue(result.enquiryGeneral);
      } 
      this.Quotation.controls["containerTypeId"].setValue(result.enquiryGeneral);
      this.Quotation.controls["storageUomId"].setValue(result.enquiryGeneral);
      const orgincountry = this.CountryDatalist.find(obj => obj.countryId == this.originCountryId)
      this.Quotation.controls['originCountryId'].setValue(orgincountry);
      const destcountry = this.CountryDatalist.find(obj => obj.countryId == this.destCountryId)
      this.Quotation.controls['destCountryId'].setValue(destcountry);
      var approv = this.approvalStatusList.find(id=>id.approvalStatusId == 1);
      this.selectedApprovalStatusId=approv?.approvalStatusId;
      this.Quotation.controls['approvalStatusId'].setValue(approv);
      var CR =this.clientResponseList.find(id=>id.qcrStatusId==1);
      this.selectedClientResponseId = CR?.qcrStatusId;
      this.Quotation.controls['clientResponseId'].setValue(CR);
      this.qCommodity = result.commodity;
      this.qIncoTerm = result.incoTerms;
      this.qTransportMode = result.enqTransportModes;
      //this.QPackage = result.package;
      this.Contactperson = result.contacts;

      var Commodity = this.qCommodity.map(id => id.commodityId);
      var inco = this.qIncoTerm.map(id => id.incoTermId);
      var modeTrns = this.qTransportMode.map(id => id.transportModeId);
      var Contact = this.Contactperson.map(id => id.contactId);
      this.Quotation.controls["commodityId"].setValue(Commodity);
      this.Quotation.controls["incoTermId"].setValue(inco);
      this.Quotation.controls["modeofTransportId"].setValue(modeTrns);
      this.onSelectTransport();
      this.Quotation.controls["customerContactId"].setValue(Contact);
      this.onSelectcontact();


      result.package.map(enqPackage => {
        let Package: QPackage = {
          quotationPackageId: 0,
          quotationId: 0,
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
          commodityName:enqPackage.commodityName
        }
        this.QPackage.push(Package);

        console.log("QPackage",this.QPackage)
      });

      result.documents.map(enqdoc => {
        let Qdoc: quotationDocument = {
          qDocumentId: 0,
          quotationId: 0,
          documentId: enqdoc.documentId,
          documentName: enqdoc.documentName,
          docname: '',
          remarks: enqdoc.remarks,
          createdBy: enqdoc.createdBy,
          createdDate: enqdoc.createdDate
        }
        this.qdocument.push(Qdoc);
        this.ImageDataArray.push(Qdoc);
        this.qdocument = [...this.qdocument];
      })
      const selectedtransportMode = this.qTransportMode.map(val => val.transportModeId);
      this.Quotation.controls['modeofTransportId'].setValue(selectedtransportMode);
      if (selectedtransportMode.includes(1) && selectedtransportMode.includes(3)) {
        this.airportflag = true;
        this.fetch();
        this.ShowOnlyroad = true;
        this.ShowOnlysea = false
        this.chargablepackage = false;
        //this.RfqgeneralForm.controls['loadingPortId'].reset();
        //this.RfqgeneralForm.controls['destinationPortId'].reset();


      } else if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
        this.airportflag = false;
        this.fetch();
        this.ShowOnlyroad = true;
        this.ShowOnlysea = true
        this.chargablepackage = false;
        //this.RfqgeneralForm.controls['loadingPortId'].reset();
        //this.RfqgeneralForm.controls['destinationPortId'].reset();

        if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          // Set validators for mandatory fields when statusId is 1
          this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
        } else {
          // Remove validators if statusId is not 2
          this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          this.Quotation.get('shipmentTypeId')?.setValue(null);
        }

        this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
      } else if (selectedtransportMode.includes(1)) {
        this.airportflag = true;
        this.fetch();
        this.ShowOnlyroad = false;
        this.ShowOnlysea = false
        this.chargablepackage = false;
        // this.RfqgeneralForm.controls['loadingPortId'].reset();
        // this.RfqgeneralForm.controls['destinationPortId'].reset();
      } else if (selectedtransportMode.includes(2)) {
        this.airportflag = false;
        this.fetch();
        if (selectedtransportMode.includes(2)) {
          // Set validators for mandatory fields when statusId is 1
          this.Quotation.get('shipmentTypeId')?.setValidators([Validators.required]);
        } else {
          // Remove validators if statusId is not 2
          this.Quotation.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          this.Quotation.get('shipmentTypeId')?.setValue(null);
        }

        this.Quotation.get('shipmentTypeId')?.updateValueAndValidity();
        this.ShowOnlyroad = false;
        this.ShowOnlysea = true
        this.chargablepackage = true;
        //this.RfqgeneralForm.controls['loadingPortId'].reset();
        //this.RfqgeneralForm.controls['destinationPortId'].reset();
      } else if (selectedtransportMode.includes(4)) {
        this.ShowOnlyroad = true;
        this.ShowOnlysea = false
        this.chargablepackage = false
      }
      else {
        this.ShowOnlyroad = true;
        this.ShowOnlysea = false
        this.chargablepackage = false
      }




    }));
  }

  //#region  Reset
  Reset(){
    var Path = this.router.url;
    this.Edits = Path.includes("/edit");
    if(this.Edits){
      debugger
      this.EditQuotation();
    }else{
      this.Quotation.reset();
      this.LineItems=[];
      this.QPackage=[];
      this.qCommodity=[];
      this.qIncoTerm =[];
      this.qdocument=[];
      this.qTransportMode=[];
      this.content.reset();
    }
  }

}
