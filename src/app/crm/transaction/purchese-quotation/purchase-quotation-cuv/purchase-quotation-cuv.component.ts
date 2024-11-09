import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlDirective, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Documents } from 'src/app/Models/crm/master/documents';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { PQModelContainer, PortofDestination, PortofLoading, PqCommodity, PqDocument, PqIncoTerm, PqPackage, PqPrice, PqTransportMode, PurchaseQuotation } from '../purchase-quotation.model';
import Swal from 'sweetalert2';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { Observable, elementAt, forkJoin, map, of, startWith, switchMap } from 'rxjs';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { JTModeofTransport, JobCategory, JobTypeGeneral, JobTypeLineItem, } from 'src/app/crm/master/jobtype/jobtypemodel.model';
import { CommonService } from 'src/app/services/common.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { PurchaseQuotationCuvService } from '../purchase-quotation-cuv.service';
import { MatDialog } from '@angular/material/dialog';
import { PackageDialogComponent } from '../package-dialog/package-dialog.component';
import { ApprovalStatusModel, CargoTypes, ModeofTransports, PQAgainst, PQStatus, ShipmentTypes, Transport } from 'src/app/Models/crm/master/Dropdowns';
import { City } from 'src/app/Models/ums/city.model';
import { TrailerTypeService } from 'src/app/crm/master/trailer-type/trailer-type.service';
import { TrailerType } from 'src/app/Models/crm/master/trailerType';
import { ContainerTypeService } from 'src/app/crm/master/containertype/containertype.service';
import { ContainerType } from 'src/app/crm/master/containertype/containertype.model';
import { UOMsService } from 'src/app/crm/master/unitofmeasure/unitofmeasure.service';
import { UOM } from 'src/app/crm/master/unitofmeasure/unitofmeasure.model';
import { AirportService } from 'src/app/crm/master/airport/airport.service';
import { Airport } from 'src/app/Models/crm/master/Airport';
import { SeaportService } from 'src/app/crm/master/seaport/seaport.service';
import { Seaport } from 'src/app/Models/crm/master/Seaport';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { PriceDialogComponent } from '../price-dialog/price-dialog.component';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { VendorModelContainer } from 'src/app/Models/crm/master/Vendor';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor-service';
import { PotentialVendorContainer } from 'src/app/crm/master/potential-vendor/potential-vendor.model';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Store } from '@ngrx/store';
import { MappingDialogComponent } from '../mapping-dialog/mapping-dialog.component';
import { RfqService } from '../../RFQ/rfq.service';
import { RfqPackage, RfqDocument } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { th } from 'date-fns/locale';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment.development';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { EnquiryService } from '../../Enquiry/enquiry.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { JOCommodityModal, JOPackageModal, JOTransportModeModal } from 'src/app/qms/transaction/Job-Order/job-order.modals';
import { EnqPackage } from 'src/app/Models/crm/master/transactions/EnquiryPackage';
import { EnqDocument } from 'src/app/Models/crm/master/transactions/Enquiry';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { ApprovalHistoryService } from 'src/app/crm/master/approval/approval-history.service';
import { ApprovalDashboard } from 'src/app/crm/master/approval/approval-history.model';
import { ApprovalDialogComponent } from 'src/app/crm/master/approval/approval-dialog/approval-dialog.component';

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
  selector: 'app-purchase-quotation-cuv',
  templateUrl: './purchase-quotation-cuv.component.html',
  styleUrls: ['./purchase-quotation-cuv.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PurchaseQuotationCuvComponent {
  content = new FormControl();
  viewMode: boolean = false;
  documents: Documents[];
  showAddRowDoc: any;
  onSelectDoc: boolean;
  remarks: any;
  documentId: any;
  documentName: any;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;

  file: any;
  fileName: any = '';
  pqDocumentArray: PqDocument[] = [];
  existDoc: boolean;
  rowIndexforDoc: number;
  editDocumet: PqDocument;
  removeDoc: PqDocument[];
  fileInput: any;
  date = new Date();
  filePath: string;
  keywordDoc = 'documentName'

  disablefields: boolean = false;
  purchaseQuoteForm: FormGroup;
  packageForm: FormGroup;
  CommodityList: Commodity[];
  incotermList: Incoterm[];
  modeofTransportList: ModeofTransports[];
  liveStatus = 1;
  CountryDatalist: Country[];
  countryName: any;
  originCountryId: any;
  filteredCountryOptions$: Observable<any[]>;
  CommodityId: any;
  incoTermId: any;
  modeofTransportId: any;
  filteredCountryOptionsDest$: Observable<any[]>;
  destCountryId: any;
  destcountryName: any;
  CityDatalist: any;
  pqAgainstId: number;
  filteredCargoOptions$: any;
  cargoList: CargoTypes[];
  cargoTypeId: any;
  originCityList: City[];
  destCityList: City[];
  filteredoriginCityOptions$: Observable<any[]>;
  originLocationId: any;
  DestCityList: City[];
  filteredDestCityOptions$: Observable<any[]>;
  destLocationId: any;
  Livestatus = 1;
  TrailerType: TrailerType[] = [];
  filteredTrailerOptions$: Observable<any[]>;
  trailerTypeId: any;
  filteredTransportOptions$: Observable<any[]>;
  transportList: Transport[];
  transportTypeId: any;
  shipmentList: ShipmentTypes[];
  filteredshipmentOptions$: Observable<any[]>;
  shipmentTypeId: any;
  filteredContainerOptions$: Observable<any[]>;
  containerTypeId: any;
  containerList: ContainerType[];
  pqStatusList: PQStatus[];
  filteredrfqOptions$: Observable<any[]>;
  statusId: any;
  filteredUOMOptions$: Observable<any[]>;
  uomList: UOM[];
  filteredAirportOptions$: Observable<any[]>;
  airportList: any[];
  loadingPortId: any;
  seaportList: any[];
  filteredseaportOptions$: Observable<any[]>;
  currencyList: Currency[];
  filteredCurrencyListOptions$: any;
  vendorCurrencyId: any;
  jobCategoryList: JobCategory[];
  filteredjobCategoryOptions$: any;
  jobCategoryId: any;
  jobTypeList: JobTypeGeneral[];
  filteredjobTypeOptions$: Observable<any[]>;
  jobTypeId: any;

  purchaseQuotation: PurchaseQuotation;
  pqIncoTerm: PqIncoTerm[] = [];
  pqCommodity: PqCommodity[] = [];
  pqTransportMode: PqTransportMode[] = []
  pqPrice: PqPrice[] = [];
  pqPackage: PqPackage[] = [];
  pqDocuments: PqDocument[] = [];

  portofLoadingList: PortofLoading[] = [];
  portofDestinationList: PortofDestination[] = [];

  filteredloadingportOptions$: Observable<any[]>;
  filtereddestportOptions$: Observable<any[]>;
  destinationPortId: any;

  IncoForm: FormGroup;
  TransportForm: FormGroup;
  CommodityForm: FormGroup;
  storageUomId: any;

  pqAgainstList: PQAgainst[];
  filteredpqAgainstOptions$: Observable<any[]>;
  SelectedVendorId: number = 0;
  vendorbyIdData: any;
  purchaseQuotationId: number;
  purchaseQuotationDateById: PQModelContainer;
  vendorTypeId: any;
  lineItemList: JobTypeLineItem[];
  rowIndexPrice: number;
  editedPrice: any;
  gereralEdit: boolean;
  airport: boolean;
  type: any;
  potentialVendorbyIdData: PotentialVendorContainer;
  refNumberId: any;
  userId$: string;
  mappedLineItem: any;
  refCode: number;
  airportListOrigin: Airport[];
  airportListDest: Airport[];
  seaportListOrigin: Seaport[];
  seaport: boolean;
  documentTypeName: any;
  modeofTransport: PqTransportMode[];
  rfqPackages: RfqPackage[];
  rfqDocuments: RfqDocument[];
  seaportSelected: boolean;
  singlePK: PqPackage;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  ImageDetailsArray: any[] = [];
  Filepath = environment.Fileretrive;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  JobtypeModeoftans: JTModeofTransport[];
  jobtypeIncoTerms: number;
  addDate = new Date();

  approvalStatusList: ApprovalStatusModel[];
  approvalStatusId: any;
  filteredApprovalStatusOptions$: Observable<any[]>;
  joDocuments: any;
  joPackages: JOPackageModal[];
  enqPackages: EnqPackage[];
  enqDocuments: EnqDocument[];
  joTransportMode: JOTransportModeModal[];
  joCommodity: JOCommodityModal[];
  isEditDocument: boolean;
  UnknownValueList: any[]=[];

  filteredcancelReasonControl: Observable<any[]>;
  CancelReasonList: any[] = [];
  public showCancelFields = false;
  approvalDashboard: ApprovalDashboard[];
  approvevalue: ApprovalDashboard | undefined;
  hideApprovebutton: boolean=true;
  selectedIndex = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    public dialogmap: MatDialog,
    private docmentsService: DocmentsService,
    private incoTermService: IncoTermService,
    private jobtypeService: JobtypeserviceService,
    private commodityService: CommodityService,
    private commonService: CommonService,
    private pqServices: PurchaseQuotationCuvService,
    private trailerTypeService: TrailerTypeService,
    private containerTypeService: ContainerTypeService,
    private uomService: UOMsService,
    private airportService: AirportService,
    private seaportService: SeaportService,
    private vendorService: VendorService,
    private potentialVendorService: PotentialVendorService,
    private ErrorHandling: ErrorhandlingService,
    private rfqService: RfqService,
    private UserIdstore: Store<{ app: AppState }>,
    private Fs: FileuploadService,
    private Ns: NofificationconfigurationService,
    private cdr: ChangeDetectorRef,
    private enquiryService: EnquiryService,
    private regionService: RegionService,
    private errorHandler: ApiErrorHandlerService,
    private reasonmstSvc: ReasonService,
    private approvalHistoryService: ApprovalHistoryService,
    
  ) { }

  ngOnInit() {
    this.GetUserId();
    this.add30Days();
    this.serviceForm();
    this.getReasons();
    this.getCurrencyList();
    this.getjobCategoryList()
    //this.getjobTypeList();
    this.getCommodityList();
    this.getIncotermList();
    this.getTransportList();
    this.getCountryMaster();
    this.getCargoList();
    this.GetTrailerType();
    this.GetTransport();
    this.getAllShipmentTypes();
    this.getAllContainer();
    this.GetAllPQStatus();
    this.getAllUOMList();
    this.getAllPQAgainst();
    this.getDocumentList();
    this.GetAllApprovalStatus();
    this.getUnknownValues();
    if (this.pqServices.isApprove) {
      this.hideApprovebutton = false;
    }

    this.pqAgainstId = this.pqServices.pqAgainstId
    this.SelectedVendorId = this.pqServices.vendorId
    this.purchaseQuotationId = this.pqServices.itemId != null ? this.pqServices.itemId : 0;
    this.type = this.pqServices.type;
    this.refNumberId = this.pqServices.refNumberId?this.pqServices.refNumberId:null;
    this.refCode = this.pqServices.refNumber
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      if (this.pqAgainstId == 1 && this.rfqService.rfq) {
        this.rfqService.GetAllRFQById(this.refNumberId).subscribe(res => {

          if (res != null) {
            //package
            this.rfqPackages = res.rfqPackages;
            //document
            this.rfqDocuments = res.rfqDocuments;
            this.packagePatchrfq();
            this.documentPatchrfq();

            this.pqDocuments = [...this.pqDocuments];

            this.originLocationId = res.rFQs.originLocationId;
            this.destLocationId = res.rFQs.destLocationId;
            this.loadingPortId = res.rFQs.loadingPortId;
            this.destinationPortId = res.rFQs.destinationPortId;
            this.originCountryId = res.rFQs.originCountryId;
            this.destCountryId = res.rFQs.destCountryId;

            this.purchaseQuoteForm.controls['valuePerUom'].setValue(res.rFQs.valuePerUom);
            this.purchaseQuoteForm.controls['pickUpLocation'].setValue(res.rFQs.pickUpLocation);
            this.purchaseQuoteForm.controls['deliveryPlace'].setValue(res.rFQs.deliveryPlace);

            this.purchaseQuoteForm.controls['temperatureReq'].setValue(res.rFQs.temperatureReq);
            this.purchaseQuoteForm.controls['remarks'].setValue(res.rFQs.remarks);
            this.purchaseQuoteForm.controls['tags'].setValue(res.rFQs.tags);
            this.purchaseQuoteForm.controls['packageNos'].setValue(res.rFQs.packageNos);

            const selectedtransportMode = res.rfqTransportModes.map(val => val.transportModeId);
            this.purchaseQuoteForm.controls['modeofTransportId'].setValue(selectedtransportMode);
            const transportMode = res.rfqTransportModes.find(obj => obj.transportModeId == 1 || obj.transportModeId == 2)
            if (transportMode?.transportModeId == 1) {
              this.airport = true;
              this.portsget();
            } else if (transportMode?.transportModeId == 2) {
              this.seaport = true;
              this.portsget();
            }
            if (res.rfqTransportModes.length == 1 && this.seaport == true) {
              this.seaportSelected = true;
            }
            else {
              this.seaportSelected = false;
            }
            const selectedCommodity = res.rfqCommoditys.map(val => val.commodityId);
            this.purchaseQuoteForm.controls['commodityId'].setValue(selectedCommodity);

            const selectedIncoTerm = res.rfqIncoTerms.map(val => val.incoTermId);
            this.purchaseQuoteForm.controls['incoTermId'].setValue(selectedIncoTerm);

            this.onSelectCommodity();
            this.onSelectInco();
            this.onSelectTransport();

            this.jobCategoryId = res.rFQs.jobCategoryId;
            this.jobTypeId = res.rFQs.jobTypeId;
            if (this.jobCategoryId != null) {
              const jobCategory = this.jobCategoryList.find(obj => obj.jobCategoryId == this.jobCategoryId)
              this.purchaseQuoteForm.controls['jobCategoryId'].setValue(jobCategory)

              this.jobtypeService.getJobTypesByJobCatId(this.jobCategoryId).subscribe(res => {
                this.jobTypeList = res;
                this.jobTypeListFun();
                if (this.jobTypeId != null) {
                  const jobType = this.jobTypeList.find(obj => obj.jobTypeId == this.jobTypeId)
                  this.purchaseQuoteForm.controls['jobTypeId'].setValue(jobType)
                }
              });
            }


            this.cargoTypeId = res.rFQs.cargoTypeid;
            if (this.cargoTypeId != null) {
              const cargoType = this.cargoList.find(obj => obj.cargoTypeId == this.cargoTypeId)
              this.purchaseQuoteForm.controls['cargoTypeId'].setValue(cargoType)
            }


            if (this.originCountryId != null) {
              const originCountry = this.CountryDatalist.find(obj => obj.countryId == this.originCountryId)
              this.purchaseQuoteForm.controls['originCountryId'].setValue(originCountry)
              this.commonService.getAllCitiesbyCountry(this.originCountryId).subscribe(res => {
                this.originCityList = res;
                this.originCityFun();
                if (this.originLocationId != null) {
                  const originLocation = this.originCityList.find(obj => obj.cityId == this.originLocationId)
                  this.purchaseQuoteForm.controls['originLocationId'].setValue(originLocation)
                }
              });
            }

            if (this.destCountryId != null) {
              const destCountry = this.CountryDatalist.find(obj => obj.countryId == this.destCountryId)
              this.purchaseQuoteForm.controls['destCountryId'].setValue(destCountry)
              this.commonService.getAllCitiesbyCountry(this.destCountryId).subscribe(res => {
                this.DestCityList = res;
                this.DestCityFun();
                if (this.destLocationId != null) {
                  const destLocation = this.DestCityList.find(obj => obj.cityId == this.destLocationId)
                  this.purchaseQuoteForm.controls['destLocationId'].setValue(destLocation)
                }
              });
            }


            this.trailerTypeId = res.rFQs.trailerTypeId;
            if (this.trailerTypeId != null) {
              const trailerType = this.TrailerType.find(obj => obj.trailerTypeId == this.trailerTypeId)
              this.purchaseQuoteForm.controls['trailerTypeId'].setValue(trailerType)
            }

            this.transportTypeId = res.rFQs.transportTypeId;
            if (this.transportTypeId != null) {
              const transportType = this.transportList.find(obj => obj.transportTypeId == this.transportTypeId)
              this.purchaseQuoteForm.controls['transportTypeId'].setValue(transportType)
            }

            this.shipmentTypeId = res.rFQs.shipmentTypeId;
            if (this.shipmentTypeId != null) {
              const shipmentType = this.shipmentList.find(obj => obj.shipmentTypeId == this.shipmentTypeId)
              this.purchaseQuoteForm.controls['shipmentTypeId'].setValue(shipmentType)
            }

            this.containerTypeId = res.rFQs.containerTypeId;
            if (this.containerTypeId != null) {
              const containerType = this.containerList.find(obj => obj.containerTypeId == this.containerTypeId)
              this.purchaseQuoteForm.controls['containerTypeId'].setValue(containerType)
            }

            this.statusId = res.rFQs.statusId;
            if (this.statusId != null) {
              const statusI = this.pqStatusList.find(obj => obj.pqStatusId == this.statusId)
              this.purchaseQuoteForm.controls['statusId'].setValue(statusI)
            }

            this.storageUomId = res.rFQs.storageUomId;
            if (this.storageUomId != null) {
              const storageUom = this.uomList.find(obj => obj.uomId == this.storageUomId)
              this.purchaseQuoteForm.controls['storageUomId'].setValue(storageUom)
            }
          }
        })
        // #region  JO
      } else if (this.pqAgainstId == 2 && this.rfqService.job) {

        this.regionService.GetJobOrderById(this.refNumberId).subscribe((res: any) => {
          console.log('JOB', res);
          if (res != null) {
            //package
            this.joPackages = res.joPackage;
            //document
            this.joDocuments = res.joDocument;
            this.packagePatchjo();
            // this.documentPatchjo();

            this.pqDocuments = [...this.pqDocuments];
            debugger
            this.originLocationId = res.joGeneral.originLocationId;
            this.destLocationId = res.joGeneral.destLocationId;
            this.loadingPortId = res.joGeneral.loadingPortId;
            this.destinationPortId = res.joGeneral.destinationPortId;
            this.originCountryId = res.joGeneral.originCountryId;
            this.destCountryId = res.joGeneral.destCountryId;



            //this.purchaseQuoteForm.controls['valuePerUom'].setValue(res.rFQs.valuePerUom);
            this.purchaseQuoteForm.controls['pickUpLocation'].setValue(res.joGeneral.pickUpLocation);
            this.purchaseQuoteForm.controls['deliveryPlace'].setValue(res.joGeneral.deliveryPlace);

            this.purchaseQuoteForm.controls['temperatureReq'].setValue(res.joGeneral.temperatureReq);
            this.purchaseQuoteForm.controls['remarks'].setValue(res.joGeneral.remarks);
            this.purchaseQuoteForm.controls['tags'].setValue(res.joGeneral.tags);

            this.purchaseQuoteForm.controls['packageNos'].setValue(res.joGeneral.packageNos);

            this.joTransportMode= res.joTransportMode;
            if(this.joTransportMode){
              const selectedtransportMode =  this.joTransportMode.map(val => val.transportModeId);
              this.purchaseQuoteForm.controls['modeofTransportId'].setValue(selectedtransportMode);
              const transportMode = this.joTransportMode.find(obj => obj.transportModeId == 1 || obj.transportModeId == 2)
              if (transportMode?.transportModeId == 1) {
                this.airport = true;
                this.portsget();
              } else if (transportMode?.transportModeId == 2) {
                this.seaport = true;
                this.portsget();
              }
              if (this.joTransportMode.length == 1 && this.seaport == true) {
                this.seaportSelected = true;
              }
              else {
                this.seaportSelected = false;
              }
            }
           

            this.joCommodity = res.joCommodity
            if (this.joCommodity) {
              const selectedCommodity = this.joCommodity.map(val => val.commodityId);
              this.purchaseQuoteForm.controls['commodityId'].setValue(selectedCommodity);
            }

            const selectedIncoTerm = Array.isArray(res.joGeneral.incoTermId)
              ? res.joGeneral.incoTermId.map((val: { incoTermId: any }) => val.incoTermId)
              : [res.joGeneral.incoTermId];
            this.purchaseQuoteForm.controls['incoTermId'].setValue(selectedIncoTerm);

            this.onSelectCommodity();
            this.onSelectInco();
            this.onSelectTransport();

            this.jobCategoryId = res.joGeneral.jobCategoryId;
            this.jobTypeId = res.joGeneral.jobTypeId;
            if (this.jobCategoryId != null) {
              const jobCategory = this.jobCategoryList.find(obj => obj.jobCategoryId == this.jobCategoryId)
              this.purchaseQuoteForm.controls['jobCategoryId'].setValue(jobCategory)

              this.jobtypeService.getJobTypesByJobCatId(this.jobCategoryId).subscribe(res => {
                this.jobTypeList = res;
                this.jobTypeListFun();
                if (this.jobTypeId != null) {
                  const jobType = this.jobTypeList.find(obj => obj.jobTypeId == this.jobTypeId)
                  this.purchaseQuoteForm.controls['jobTypeId'].setValue(jobType)
                }
              });
            }

            this.cargoTypeId = res.joGeneral.cargoTypeId;
            if (this.cargoTypeId != null) {
              const cargoType = this.cargoList.find(obj => obj.cargoTypeId == this.cargoTypeId)
              this.purchaseQuoteForm.controls['cargoTypeId'].setValue(cargoType)
            }


            if (this.originCountryId != null) {
              const originCountry = this.CountryDatalist.find(obj => obj.countryId == this.originCountryId)
              this.purchaseQuoteForm.controls['originCountryId'].setValue(originCountry)
              this.commonService.getAllCitiesbyCountry(this.originCountryId).subscribe(res => {
                this.originCityList = res;
                this.originCityFun();
                if (this.originLocationId != null) {
                  const originLocation = this.originCityList.find(obj => obj.cityId == this.originLocationId)
                  this.purchaseQuoteForm.controls['originLocationId'].setValue(originLocation)
                }
              });
            }

            if (this.destCountryId != null) {
              const destCountry = this.CountryDatalist.find(obj => obj.countryId == this.destCountryId)
              this.purchaseQuoteForm.controls['destCountryId'].setValue(destCountry)
              this.commonService.getAllCitiesbyCountry(this.destCountryId).subscribe(res => {
                this.DestCityList = res;
                this.DestCityFun();
                if (this.destLocationId != null) {
                  const destLocation = this.DestCityList.find(obj => obj.cityId == this.destLocationId)
                  this.purchaseQuoteForm.controls['destLocationId'].setValue(destLocation)
                }
              });
            }


            // this.trailerTypeId = res.joGeneral.trailerTypeId;
            // if (this.trailerTypeId != null) {
            //   const trailerType = this.TrailerType.find(obj => obj.trailerTypeId == this.trailerTypeId)
            //   this.purchaseQuoteForm.controls['trailerTypeId'].setValue(trailerType)
            // }

            // this.transportTypeId = res.joGeneral.transportTypeId;
            // if (this.transportTypeId != null) {
            //   const transportType = this.transportList.find(obj => obj.transportTypeId == this.transportTypeId)
            //   this.purchaseQuoteForm.controls['transportTypeId'].setValue(transportType)
            // }

            // this.shipmentTypeId = res.joGeneral.shipmentTypeId;
            // if (this.shipmentTypeId != null) {
            //   const shipmentType = this.shipmentList.find(obj => obj.shipmentTypeId == this.shipmentTypeId)
            //   this.purchaseQuoteForm.controls['shipmentTypeId'].setValue(shipmentType)
            // }

            // this.containerTypeId = res.joGeneral.containerTypeId;
            // if (this.containerTypeId != null) {
            //   const containerType = this.containerList.find(obj => obj.containerTypeId == this.containerTypeId)
            //   this.purchaseQuoteForm.controls['containerTypeId'].setValue(containerType)
            // }

            // this.statusId = res.joGeneral.statusId;
            // if (this.statusId != null) {
            //   const statusI = this.pqStatusList.find(obj => obj.pqStatusId == this.statusId)
            //   this.purchaseQuoteForm.controls['statusId'].setValue(statusI)
            // }

            // this.storageUomId = res.joGeneral.storageUomId;
            // if (this.storageUomId != null) {
            //   const storageUom = this.uomList.find(obj => obj.uomId == this.storageUomId)
            //   this.purchaseQuoteForm.controls['storageUomId'].setValue(storageUom)
            // }


          }

        });
        // #region  ENQ
      } else if (this.pqAgainstId == 4 && this.rfqService.enq) {
        this.enquiryService.GetAllEnquiryById(this.refNumberId).subscribe(res => {
          console.log('ENQ', res);
          if (res != null) {
            //package
            this.enqPackages = res.package;
            //document
            this.enqDocuments = res.documents;
            this.packagePatchenq();
            this.documentPatchenq();

            this.pqDocuments = [...this.pqDocuments];

            this.originLocationId = res.enquiryGeneral.originLocationId;
            this.destLocationId = res.enquiryGeneral.destLocationId;
            this.loadingPortId = res.enquiryGeneral.loadingPortId;
            this.destinationPortId = res.enquiryGeneral.destinationPortId;
            this.originCountryId = res.enquiryGeneral.originCountryId;
            this.destCountryId = res.enquiryGeneral.destCountryId;


            this.purchaseQuoteForm.controls['valuePerUom'].setValue(res.enquiryGeneral.valuePerUom);
            this.purchaseQuoteForm.controls['pickUpLocation'].setValue(res.enquiryGeneral.pickUpLocation);
            this.purchaseQuoteForm.controls['deliveryPlace'].setValue(res.enquiryGeneral.deliveryPlace);

            this.purchaseQuoteForm.controls['temperatureReq'].setValue(res.enquiryGeneral.temperatureReq);
            this.purchaseQuoteForm.controls['remarks'].setValue(res.enquiryGeneral.remarks);
            this.purchaseQuoteForm.controls['tags'].setValue(res.enquiryGeneral.tags);
            this.purchaseQuoteForm.controls['packageNos'].setValue(res.enquiryGeneral.packageNos);

            const selectedtransportMode = res.enqTransportModes.map(val => val.transportModeId);
            this.purchaseQuoteForm.controls['modeofTransportId'].setValue(selectedtransportMode);
            const transportMode = res.enqTransportModes.find(obj => obj.transportModeId == 1 || obj.transportModeId == 2)
            if (transportMode?.transportModeId == 1) {
              this.airport = true;
              this.portsget();
            } else if (transportMode?.transportModeId == 2) {
              this.seaport = true;
              this.portsget();
            }
            if (res.enqTransportModes.length == 1 && this.seaport == true) {
              this.seaportSelected = true;
            }
            else {
              this.seaportSelected = false;
            }
            const selectedCommodity = res.commodity.map(val => val.commodityId);
            this.purchaseQuoteForm.controls['commodityId'].setValue(selectedCommodity);

            const selectedIncoTerm = res.incoTerms.map(val => val.incoTermId);
            this.purchaseQuoteForm.controls['incoTermId'].setValue(selectedIncoTerm);

            this.onSelectCommodity();
            this.onSelectInco();
            this.onSelectTransport();

            this.jobCategoryId = res.enquiryGeneral.jobCategoryId;
            this.jobTypeId = res.enquiryGeneral.jobTypeId;
            if (this.jobCategoryId != null) {
              const jobCategory = this.jobCategoryList.find(obj => obj.jobCategoryId == this.jobCategoryId)
              this.purchaseQuoteForm.controls['jobCategoryId'].setValue(jobCategory)

              this.jobtypeService.getJobTypesByJobCatId(this.jobCategoryId).subscribe(res => {
                this.jobTypeList = res;
                this.jobTypeListFun();
                if (this.jobTypeId != null) {
                  const jobType = this.jobTypeList.find(obj => obj.jobTypeId == this.jobTypeId)
                  this.purchaseQuoteForm.controls['jobTypeId'].setValue(jobType)
                }
              });
            }
            this.cargoTypeId = res.enquiryGeneral.cargoTypeid;
            if (this.cargoTypeId != null) {
              const cargoType = this.cargoList.find(obj => obj.cargoTypeId == this.cargoTypeId)
              this.purchaseQuoteForm.controls['cargoTypeId'].setValue(cargoType)
            }


            if (this.originCountryId != null) {
              const originCountry = this.CountryDatalist.find(obj => obj.countryId == this.originCountryId)
              this.purchaseQuoteForm.controls['originCountryId'].setValue(originCountry)
              this.commonService.getAllCitiesbyCountry(this.originCountryId).subscribe(res => {
                this.originCityList = res;
                this.originCityFun();
                if (this.originLocationId != null) {
                  const originLocation = this.originCityList.find(obj => obj.cityId == this.originLocationId)
                  this.purchaseQuoteForm.controls['originLocationId'].setValue(originLocation)
                }
              });
            }

            if (this.destCountryId != null) {
              const destCountry = this.CountryDatalist.find(obj => obj.countryId == this.destCountryId)
              this.purchaseQuoteForm.controls['destCountryId'].setValue(destCountry)
              this.commonService.getAllCitiesbyCountry(this.destCountryId).subscribe(res => {
                this.DestCityList = res;
                this.DestCityFun();
                if (this.destLocationId != null) {
                  const destLocation = this.DestCityList.find(obj => obj.cityId == this.destLocationId)
                  this.purchaseQuoteForm.controls['destLocationId'].setValue(destLocation)
                }
              });
            }


            this.trailerTypeId = res.enquiryGeneral.trailerTypeId;
            if (this.trailerTypeId != null) {
              const trailerType = this.TrailerType.find(obj => obj.trailerTypeId == this.trailerTypeId)
              this.purchaseQuoteForm.controls['trailerTypeId'].setValue(trailerType)
            }

            this.transportTypeId = res.enquiryGeneral.transportTypeId;
            if (this.transportTypeId != null) {
              const transportType = this.transportList.find(obj => obj.transportTypeId == this.transportTypeId)
              this.purchaseQuoteForm.controls['transportTypeId'].setValue(transportType)
            }

            this.shipmentTypeId = res.enquiryGeneral.shipmentTypeId;
            if (this.shipmentTypeId != null) {
              const shipmentType = this.shipmentList.find(obj => obj.shipmentTypeId == this.shipmentTypeId)
              this.purchaseQuoteForm.controls['shipmentTypeId'].setValue(shipmentType)
            }

            this.containerTypeId = res.enquiryGeneral.containerTypeId;
            if (this.containerTypeId != null) {
              const containerType = this.containerList.find(obj => obj.containerTypeId == this.containerTypeId)
              this.purchaseQuoteForm.controls['containerTypeId'].setValue(containerType)
            }

            this.statusId = res.enquiryGeneral.statusId;
            if (this.statusId != null) {
              const statusId = this.pqStatusList.find(obj => obj.pqStatusId == this.statusId)
              this.purchaseQuoteForm.controls['statusId'].setValue(statusId)
              
            }

            this.storageUomId = res.enquiryGeneral.storageUomId;
            if (this.storageUomId != null) {
              const storageUom = this.uomList.find(obj => obj.uomId == this.storageUomId)
              this.purchaseQuoteForm.controls['storageUomId'].setValue(storageUom)
            }

          }
        });
      }
    });


    if (this.pqServices.isEdit == false && this.SelectedVendorId != 0 && this.type == 'PV') {
      this.getPotentialvendorbyId();
    }
    else if (this.pqServices.isEdit == false && this.SelectedVendorId != 0 && this.type == 'V') {
      this.getvendorbyId();
    }
    if (this.pqServices.isEdit == true && this.pqServices.isView == false) {
      this.purchaseQuotationId = this.pqServices.itemId;
      this.gereralEdit = true;
      this.getPQbyId();
    }
    if (this.pqServices.isEdit == false && this.pqServices.isView == true) {
      this.purchaseQuotationId = this.pqServices.itemId;
      this.gereralEdit = false;
      this.viewMode = true;
      this.disablefields = true;
      this.content.disable();
      this.getPQbyId();
    }

    if(this.pqServices.isEdit == false && this.pqServices.isView == false){
      this.jobtypeService.GetAllDocumentMappingByScreenId(13).subscribe(res => {
        if (res) {
          this.pqDocuments = res.map(ele => {
            return {
              pqDocumentId: 0,
              purchaseQuoteId: 0,
              documentId: ele.documentId,
              remarks: '',
              createdBy: parseInt(this.userId$),
              createdDate: this.date,
              documentName: '',
              documentTypeName: ele.documentName,
              IseditDoc: false,
              newDoc: true,
              files: '',
            };
          });
          this.pqDocuments = [...this.pqDocuments];
          this.pqDocumentArray = [...this.pqDocuments];
        }
        console.log(this.pqDocuments)
      });
    }

    this.filteredcancelReasonControl = this.purchaseQuoteForm.controls['cancelReasonControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcancelReasonControl(value || '')),
    );

  }

  private _filteredcancelReasonControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CancelReasonList.filter((option: any) => option?.reasonName.toLowerCase().includes(filterValue));
  }

  getReasons() {
    this.reasonmstSvc.getAllReason(1).subscribe((result) => {
      this.CancelReasonList = result;
    });
  }

  packagePatchrfq() {
    this.rfqPackages.forEach(rfqPackage => {
      let pqPackage: PqPackage = {
        pqPackageId: 0,
        purchaseQuoteId: 0,
        packageTypeId: rfqPackage.packageTypeId,
        commodityId: rfqPackage.commodityId,
        height: rfqPackage.height,
        length: rfqPackage.length,
        breadth: rfqPackage.breadth,
        cbm: rfqPackage.cbm,
        packWeightKg: rfqPackage.packWeightKg,
        chargePackWtKg: rfqPackage.chargePackWtKg,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,
        packageTypeName: rfqPackage.packageTypeName,
        commodityName: rfqPackage.commodityName
      };
      this.pqPackage.push(pqPackage);
    });

  }
  documentPatchrfq() {
    this.rfqDocuments.forEach(rfqDocument => {
      let pqDocument: PqDocument = {
        pqDocumentId: 0,
        purchaseQuoteId: 0,
        documentId: rfqDocument.documentId,
        documentName: rfqDocument.documentName,
        remarks: rfqDocument.remarks,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        documentTypeName: '',
        IseditDoc: false,
        newDoc: false,
        files: ''
      };
      this.documents.forEach(ele => {
        if (pqDocument.documentId == ele.documentId) {
          pqDocument.documentTypeName = ele.documentName
        }
      })
      this.pqDocuments.push(pqDocument);
    });

  }
  packagePatchenq() {
    this.enqPackages.forEach(enqPackage => {
      let pqPackage: PqPackage = {
        pqPackageId: 0,
        purchaseQuoteId: 0,
        packageTypeId: enqPackage.packageTypeId,
        commodityId: enqPackage.commodityId,
        height: enqPackage.height,
        length: enqPackage.length,
        breadth: enqPackage.breadth,
        cbm: enqPackage.cbm,
        packWeightKg: enqPackage.packWeightKg,
        chargePackWtKg: enqPackage.chargePackWtKg,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,
        packageTypeName: enqPackage.packageTypeName,
        commodityName: enqPackage.commodityName
      };
      this.pqPackage.push(pqPackage);
    });

  }
  documentPatchenq() {
    this.enqDocuments.forEach(enqDocument => {
      let pqDocument: PqDocument = {
        pqDocumentId: 0,
        purchaseQuoteId: 0,
        documentId: enqDocument.documentId,
        documentName: enqDocument.documentName,
        remarks: enqDocument.remarks,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        documentTypeName: '',
        IseditDoc: false,
        newDoc: false,
        files: ''
      };
      this.documents.forEach(ele => {
        if (pqDocument.documentId == ele.documentId) {
          pqDocument.documentTypeName = ele.documentName
        }
      })
      this.pqDocuments.push(pqDocument);
    });

  }
  packagePatchjo() {
    this.joPackages.forEach(joPackages => {
      let joPackage: PqPackage = {
        pqPackageId: 0,
        purchaseQuoteId: 0,
        packageTypeId: joPackages.packageTypeId,
        commodityId: joPackages.commodityId || null,
        height: joPackages.height || 0,
        length: joPackages.length || 0,
        breadth: joPackages.breadth || 0,
        cbm: joPackages.cbm || 0,
        packWeightKg: joPackages.packWeightKg || 0,
        chargePackWtKg: joPackages.chargePackWtKg || 0,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,
        packageTypeName: joPackages.packageTypeName,
        commodityName: joPackages.commodityName
      };
      this.pqPackage.push(joPackage);
    });

  }
  documentPatchjo() {
    this.rfqDocuments.forEach(rfqDocument => {
      let pqDocument: PqDocument = {
        pqDocumentId: 0,
        purchaseQuoteId: 0,
        documentId: rfqDocument.documentId,
        documentName: rfqDocument.documentName,
        remarks: rfqDocument.remarks,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        documentTypeName: '',
        IseditDoc: false,
        newDoc: false,
        files: ''
      };
      this.documents.forEach(ele => {
        if (pqDocument.documentId == ele.documentId) {
          pqDocument.documentTypeName = ele.documentName
        }
      })
      this.pqDocuments.push(pqDocument);
    });

  }
  portsget() {
    forkJoin([
      this.commonService.GetAllAirportByCountryId(this.originCountryId),
      this.commonService.GetAllAirportByCountryId(this.destCountryId),
      this.commonService.GetAllSeaportByCountryId(this.originCountryId),
      this.commonService.GetAllSeaportByCountryId(this.destCountryId),

    ]).subscribe(([airportListOrigin, airportListdest, seaportListOrigin, seaportListdest]) => {

      if (this.airport) {
        this.airportList = airportListOrigin;
        this.airportList.forEach((ele: any) => {
          let portofLoadingItem = {
            loadingPortId: ele.airportId,
            loadingPortName: ele.airportName
          };
          this.portofLoadingList.push(portofLoadingItem)
        })
        this.airportList = airportListdest;
        this.airportList.forEach((ele: any) => {
          let portofDestItem = {
            destinationPortId: ele.airportId,
            destinationPortIdName: ele.airportName
          };
          this.portofDestinationList.push(portofDestItem)
        })
        this.lodingportFun()
        this.destportFun()
      } else if (this.seaport) {
        this.seaportList = seaportListOrigin;
        this.seaportList.forEach((ele: any) => {
          let portofLoadingItem = {
            loadingPortId: ele.seaportId,
            loadingPortName: ele.seaportName
          };
          this.portofLoadingList.push(portofLoadingItem)
        })
        this.seaportList = seaportListdest;
        this.seaportList.forEach((ele: any) => {
          let portofDestItem = {
            destinationPortId: ele.seaportId,
            destinationPortIdName: ele.seaportName
          };
          this.portofDestinationList.push(portofDestItem)
        })
        this.lodingportFun()
        this.destportFun()
      }

      if (this.loadingPortId != null) {
        const loadingPort = this.portofLoadingList.find(obj => obj.loadingPortId == this.loadingPortId)
        this.purchaseQuoteForm.controls['loadingPortId'].setValue(loadingPort)
      }

      if (this.destinationPortId != null) {
        const destinationPort = this.portofDestinationList.find(obj => obj.destinationPortId == this.destinationPortId)
        this.purchaseQuoteForm.controls['destinationPortId'].setValue(destinationPort)
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
  getPotentialvendorbyId() {
    this.potentialVendorService.getAllPotentialVendorById(this.SelectedVendorId).subscribe(res => {
      this.potentialVendorbyIdData = res;
      this.vendorCurrencyId = this.potentialVendorbyIdData.potentialVendor.vendorCurrencyId;

      this.purchaseQuoteForm.controls['vendorName'].setValue(this.potentialVendorbyIdData.potentialVendor.vendorName);
      if (this.pqServices.isEdit == false && this.pqServices.isView == false) {
        this.purchaseQuoteForm.controls['vendorName'].setValue(this.potentialVendorbyIdData.potentialVendor.vendorName);
        this.purchaseQuoteForm.controls['vendorRemarks'].setValue(this.potentialVendorbyIdData.potentialVendor.vendorRemarks);
      }

      this.currencyList.forEach(element => {
        if (this.potentialVendorbyIdData.potentialVendor.vendorCurrencyId == element.currencyId) {
          this.purchaseQuoteForm.controls['vendorCurrencyId'].setValue(element)
        }
      });

      const billingCurrency = this.potentialVendorbyIdData.potentialVendor.billingCurrencyId
      if (billingCurrency == 1) {
        this.purchaseQuoteForm.controls['vendorCurrencyId'].disable()
      }
    });
    this.purchaseQuoteForm.controls['vendorTypeId'].setValue('Potential');
    this.vendorTypeId = 1;
  }

  getvendorbyId() {
    this.vendorService.getVendorbyId(this.SelectedVendorId).subscribe(res => {
      this.vendorbyIdData = res;
      this.vendorCurrencyId = this.vendorbyIdData.vendors.vendorCurrencyId;
      this.purchaseQuoteForm.controls['vendorName'].setValue(this.vendorbyIdData.vendors.vendorName);
      this.purchaseQuoteForm.controls['vendorRanking'].setValue(this.vendorbyIdData.vendors.vendorRanking);

      if (this.pqServices.isEdit == false && this.pqServices.isView == false) {
        this.purchaseQuoteForm.controls['vendorName'].setValue(this.vendorbyIdData.vendors.vendorName);
        this.purchaseQuoteForm.controls['vendorRemarks'].setValue(this.vendorbyIdData.vendors.vendorRemarks);
        this.purchaseQuoteForm.controls['vendorRanking'].setValue(this.vendorbyIdData.vendors.vendorRanking);
      }

      this.currencyList.forEach(element => {
        if (this.vendorbyIdData.vendors.vendorCurrencyId == element.currencyId) {
          this.purchaseQuoteForm.controls['vendorCurrencyId'].setValue(element)
        }
      });
      const billingCurrency = this.vendorbyIdData.vendors.billingCurrencyId
      if (billingCurrency == 1) {
        this.purchaseQuoteForm.controls['vendorCurrencyId'].disable()
      }
    });
    this.purchaseQuoteForm.controls['vendorTypeId'].setValue('Existing');
    this.vendorTypeId = 2;

  }
  setpq() {
    this.pqAgainstList.forEach(element => {
      if (this.pqAgainstId == element.pqAgainstId) {
        this.purchaseQuoteForm.controls['pqAgainstId'].setValue(element);
      }
    });
    this.purchaseQuoteForm.controls['refNumber'].setValue(this.refCode);
  }

  getPQbyId() {
    this.pqServices.getAllPurchaseQuotationById(this.purchaseQuotationId).subscribe(res => {
      this.purchaseQuotationDateById = res;
      this.purchaseQuotation = this.purchaseQuotationDateById.purchaseQuotation;
      this.getjobTypeList(this.purchaseQuotation.jobCategoryId);
      this.pqPackage = this.purchaseQuotationDateById.pqPackage;
      this.pqPrice = this.purchaseQuotationDateById.pqPrice;
      this.pqDocuments = this.purchaseQuotationDateById.pqDocument;
      this.pqDocumentArray = this.purchaseQuotationDateById.pqDocument;
      this.pqCommodity = this.purchaseQuotationDateById.pqCommodity
      this.pqIncoTerm = this.purchaseQuotationDateById.pqIncoTerm;
      this.pqTransportMode = this.purchaseQuotationDateById.pqTransportMode;
      this.SelectedVendorId = this.purchaseQuotation.vendorId;
      if (this.purchaseQuotation.vendorTypeId == 1) {
        this.getPotentialvendorbyId();
      }
      else {
        this.getvendorbyId();
      }
      this.getcityList(this.purchaseQuotation.originCountryId);
      this.getDestcityList(this.purchaseQuotation.destCountryId);
      const idToFind = 1;
      const foundElement = this.pqTransportMode.find(item => item.transportModeId === idToFind);
      if (foundElement?.transportModeId == 1) {
        this.airport = true;
        //this.getAllAirportList();
      }
      else {
        this.seaport = true;
        //this.getAllSeaportList()
      }
      //this.setValues();
      if (this.seaport && this.pqTransportMode.length == 1) {
        this.seaportSelected = true;
      } else {
        this.seaportSelected = false;
      }
      this.getvalues();
      this.portsget();
    });
  }
  getvalues() {

    this.originCountryId = this.purchaseQuotation.originCountryId;
    this.destCountryId = this.purchaseQuotation.destCountryId;
    forkJoin([
      this.commonService.getAllCitiesbyCountry(this.purchaseQuotation.originCountryId),
      this.commonService.getAllCitiesbyCountry(this.purchaseQuotation.destCountryId),
      this.commonService.GetAllAirportByCountryId(this.originCountryId),
      this.commonService.GetAllAirportByCountryId(this.destCountryId),
      this.commonService.GetAllSeaportByCountryId(this.originCountryId),
      this.commonService.GetAllSeaportByCountryId(this.destCountryId),

    ]).subscribe(([originCityList, destCityList, airportListOrigin, airportListdest, seaportListOrigin, seaportListdest]) => {
      this.originCityList = originCityList;
      this.destCityList = destCityList;
      if (this.airport) {
        this.airportList = airportListOrigin;
        this.airportList.forEach((ele: any) => {
          let portofLoadingItem = {
            loadingPortId: ele.airportId,
            loadingPortName: ele.airportName
          };
          this.portofLoadingList.push(portofLoadingItem)
        })
        this.airportList = airportListdest;
        this.airportList.forEach((ele: any) => {
          let portofDestItem = {
            destinationPortId: ele.airportId,
            destinationPortIdName: ele.airportName
          };
          this.portofDestinationList.push(portofDestItem)
        })
        this.lodingportFun()
        this.destportFun()
      } else if (this.seaport) {
        this.seaportList = seaportListOrigin;
        this.seaportList.forEach((ele: any) => {
          let portofLoadingItem = {
            loadingPortId: ele.seaportId,
            loadingPortName: ele.seaportName
          };
          this.portofLoadingList.push(portofLoadingItem)
        })
        this.seaportList = seaportListdest;
        this.seaportList.forEach((ele: any) => {
          let portofDestItem = {
            destinationPortId: ele.seaportId,
            destinationPortIdName: ele.seaportName
          };
          this.portofDestinationList.push(portofDestItem)
        })
        this.lodingportFun()
        this.destportFun()
      }
      this.setValues();
    });
  }
  setValues() {
    this.pqAgainstId = this.purchaseQuotation.pqAgainstId;
    this.SelectedVendorId = this.purchaseQuotation.vendorId;
    this.vendorTypeId = this.purchaseQuotation.vendorTypeId
    this.refNumberId = this.purchaseQuotation.refNumberId
    this.vendorCurrencyId = this.purchaseQuotation.vendorCurrencyId;
    this.jobCategoryId = this.purchaseQuotation.jobCategoryId;
    this.jobTypeId = this.purchaseQuotation.jobTypeId;
    this.cargoTypeId = this.purchaseQuotation.cargoTypeId;
    this.originCountryId = this.purchaseQuotation.originCountryId;
    this.destCountryId = this.purchaseQuotation.destCountryId;
    this.loadingPortId = this.purchaseQuotation.loadingPortId;
    this.destinationPortId = this.purchaseQuotation.destinationPortId;
    this.destLocationId = this.purchaseQuotation.destLocationId;
    this.originLocationId = this.purchaseQuotation.originLocationId;
    this.trailerTypeId = this.purchaseQuotation.trailerTypeId;
    this.transportTypeId = this.purchaseQuotation.transportTypeId;
    this.shipmentTypeId = this.purchaseQuotation.shipmentTypeId;
    this.containerTypeId = this.purchaseQuotation.containerTypeId;
    this.statusId = this.purchaseQuotation.statusId;
    this.approvalStatusId = this.purchaseQuotation.approvalStatusId;
    this.storageUomId = this.purchaseQuotation.storageUomId;

    this.purchaseQuoteForm.patchValue(this.purchaseQuotation);
    if (this.vendorTypeId == 1) {
      this.purchaseQuoteForm.controls['vendorTypeId'].setValue('Potential');
    }
    else {
      this.purchaseQuoteForm.controls['vendorTypeId'].setValue('Existing');
    }
    
    this.purchaseQuoteForm.controls['pqDate'].setValue(this.purchaseQuotation.pqDate === '1900-01-01T00:00:00' ? null : this.purchaseQuotation.pqDate);
    this.purchaseQuoteForm.controls['validDate'].setValue(this.purchaseQuotation.validDate === '1900-01-01T00:00:00' ? null : this.purchaseQuotation.validDate);

    this.purchaseQuoteForm.controls['pqAgainstId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['vendorRemarks'].setValue(this.purchaseQuotation.vendorRemarks)
    this.purchaseQuoteForm.controls['vendorCurrencyId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['jobCategoryId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['jobTypeId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['approvalStatusId'].setValue(this.purchaseQuotation);


    const selectedtransportMode = this.pqTransportMode.map(val => val.transportModeId);
    this.purchaseQuoteForm.controls['modeofTransportId'].setValue(selectedtransportMode);

    const selectedCommodity = this.pqCommodity.map(val => val.commodityId);
    this.purchaseQuoteForm.controls['commodityId'].setValue(selectedCommodity);

    const selectedIncoTerm = this.pqIncoTerm.map(val => val.incoTermId);
    this.purchaseQuoteForm.controls['incoTermId'].setValue(selectedIncoTerm);

    this.purchaseQuoteForm.controls['cargoTypeId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['statusId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['trailerTypeId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['transportTypeId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['shipmentTypeId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['containerTypeId'].setValue(this.purchaseQuotation);
    this.purchaseQuoteForm.controls['storageUomId'].setValue(this.purchaseQuotation);


    this.purchaseQuoteForm.controls['cancelReasonControl'].setValue(this.purchaseQuotation?.reasonName);
    this.purchaseQuoteForm.controls['cancelRemarkControl'].setValue(this.purchaseQuotation?.closedRemarks);
    this.content.setValue(this.purchaseQuotation.termsandConditions);
    this.transportSelectedoption();

    //country
    this.CountryDatalist.forEach(element => {
      const countryId = this.purchaseQuotation.originCountryId
      if (element.countryId == countryId) {
        this.purchaseQuoteForm.controls['originCountryId'].setValue(element);
      }
    });
    this.CountryDatalist.forEach(element => {
      const countryId = this.purchaseQuotation.destCountryId
      if (element.countryId == countryId) {
        this.purchaseQuoteForm.controls['destCountryId'].setValue(element);
      }
    });

    if (this.airport) {
      this.portofLoadingList.forEach(element => {
        const loadingPortId = this.purchaseQuotation.loadingPortId
        if (element.loadingPortId == loadingPortId) {
          this.purchaseQuoteForm.controls['loadingPortId'].setValue(element);
        }
      });
      this.portofDestinationList.forEach(element => {
        const destinationPortId = this.purchaseQuotation.destinationPortId
        if (element.destinationPortId == destinationPortId) {
          this.purchaseQuoteForm.controls['destinationPortId'].setValue(element);
        }
      });
    } else {
      this.portofLoadingList.forEach(element => {
        const loadingPortId = this.purchaseQuotation.loadingPortId
        if (element.loadingPortId == loadingPortId) {
          this.purchaseQuoteForm.controls['loadingPortId'].setValue(element);
          console.log(this.purchaseQuoteForm.controls['loadingPortId'].value)
        }
      });
      this.portofDestinationList.forEach(element => {
        const destinationPortId = this.purchaseQuotation.destinationPortId
        if (element.destinationPortId == destinationPortId) {
          this.purchaseQuoteForm.controls['destinationPortId'].setValue(element);
          console.log(this.purchaseQuoteForm.controls['destinationPortId'].value)

        }
      });
    }

    //location 
    this.originCityList.forEach(element => {
      const locationId = this.purchaseQuotation.originLocationId
      if (element.cityId == locationId) {
        this.purchaseQuoteForm.controls['originLocationId'].setValue(element);
      }
    });

    this.DestCityList.forEach(element => {
      const locationId = this.purchaseQuotation.destLocationId
      if (element.cityId == locationId) {
        this.purchaseQuoteForm.controls['destLocationId'].setValue(element);
      }
    });


  }

  returnToList() {
    if (this.pqServices.editFromApprove) {
      this.router.navigate(["/crm/master/approvalhistorylist"]);
      this.pqServices.editFromApprove = false;
      return;
    }
    if (this.pqServices.isApprove) {
      this.router.navigate(["/crm/master/approvalhistorylist"]);
      this.pqServices.isApprove = false;
      return;
    }
    if (this.rfqService.Fromrfq) {
      this.rfqService.Fromrfq = false;
      this.rfqService.rfq = false;
      this.rfqService.enq = false;
      this.rfqService.job = false;

      this.router.navigate(["/crm/transaction/rfqlist"]);
      return;
    }
    this.rfqService.rfq = false;
    this.rfqService.enq = false;
    this.rfqService.job = false;
    this.rfqService.Fromrfq = false;
    this.router.navigate(["/crm/transaction/purchasequotationlist"]);
  }
  

  ////////-------------------------------------------------General-------------------------

  //#region 
  // getTotalCrossWeight(): number {
  //   return this.pqPackage.reduce((total, item) => total + (+item.packWeightKg), 0);
  // }
  // getTotalChargeableWeight(): number {
  //   return this.pqPackage.reduce((total, item) => total + (+item.chargePackWtKg), 0);
  // }


  getTotalCrossWeight(): string {
    const totalCrossWeight = this.pqPackage.reduce((total, item) => total + (+item.packWeightKg || 0), 0);
    return totalCrossWeight.toFixed(2);
  }

  getTotalChargeableWeight(): string {
    const totalChargeableWeight = this.pqPackage.reduce((total, item) => total + (+item.chargePackWtKg || 0), 0);
    return totalChargeableWeight.toFixed(2);
  }


  onSelectInco() {

    const selectedIncos = this.purchaseQuoteForm.controls['incoTermId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedInco: any) =>
        !this.pqIncoTerm.some(
          (existingInco: any) => existingInco.incoTermId === selectedInco
        )
    );
    uniqueSelectedInco.forEach((selectedInco: any) => {
      this.IncoForm = this.fb.group({
        pqIncoId: [0],
        purchaseQuoteId: [0],
        incoTermId: [selectedInco],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.pqIncoTerm.push(this.IncoForm.value);
    });
    const uncheckedIncos = this.pqIncoTerm.filter(
      (existingInco: any) =>
        !selectedIncos.includes(existingInco.incoTermId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.pqIncoTerm.findIndex(
        (existingInco: any) =>
          existingInco.incoTermId === uncheckedInco.incoTermId
      );
      if (index !== -1) {
        this.pqIncoTerm.splice(index, 1);
      }
    });
  }
  onSelectCommodity() {
    const selectedCommodities = this.purchaseQuoteForm.controls['commodityId'].value;
    const uniqueSelectedcommodity = selectedCommodities.filter(
      (selectedCommodity: any) =>
        !this.pqCommodity.some(
          (existingcommodity: any) => existingcommodity.commodityId === selectedCommodity
        )
    );
    uniqueSelectedcommodity.forEach((selectedCommodityId: any) => {
      this.CommodityForm = this.fb.group({
        pqCommodityId: [0],
        purchaseQuoteId: [0],
        commodityId: [selectedCommodityId],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.pqCommodity.push(this.CommodityForm.value);
    });
    const uncheckedCommoditys = this.pqCommodity.filter(
      (existingcommodity: any) =>
        !selectedCommodities.includes(existingcommodity.commodityId)
    );
    uncheckedCommoditys.forEach((uncheckedCommodity: any) => {
      const index = this.pqCommodity.findIndex(
        (existingcommodity: any) =>
          existingcommodity.commodityId === uncheckedCommodity.commodityId
      );
      if (index !== -1) {
        this.pqCommodity.splice(index, 1);
      }
    });
  }
  onSelectTransport() {
    this.transportSelectedoption();
    const selectedTransports = this.purchaseQuoteForm.controls['modeofTransportId'].value;
    // Filter out transports that are already in pqTransportMode
    const uniqueSelectedTransport = selectedTransports.filter(
      (selectedTransport: any) =>
        !this.pqTransportMode.some(
          (existingTransport: any) => existingTransport.transportModeId === selectedTransport
        )
    );
    // Add newly selected transports to pqTransportMode
    uniqueSelectedTransport.forEach((selectedTransportId: any) => {
      this.TransportForm = this.fb.group({
        pqTransportModeId: [0],
        purchaseQuoteId: [0],
        transportModeId: [selectedTransportId],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.pqTransportMode.push(this.TransportForm.value);
    });
    // Remove deselected transports from pqTransportMode
    const uncheckedTransports = this.pqTransportMode.filter(
      (existingTransport: any) =>
        !selectedTransports.includes(existingTransport.transportModeId)
    );
    uncheckedTransports.forEach((uncheckedTransport: any) => {
      const index = this.pqTransportMode.findIndex(
        (existingTransport: any) =>
          existingTransport.transportModeId === uncheckedTransport.transportModeId
      );
      if (index !== -1) {
        this.pqTransportMode.splice(index, 1);
      }
    });

  }
  SelectedVendor(event: any) {

    let selectedValue = event.option.value;
    if (selectedValue == "Potential") {
      this.vendorTypeId = 1;
    }
    else {
      this.vendorTypeId = 2;
    }
    console.log(this.vendorTypeId)
  }

  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.purchaseQuoteForm.controls;
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

  // onSaveGeneral() {
  //   debugger
  //   if (this.showAddRowDoc) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Info",
  //       text: "Add or remove details in Document Detail tab",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     return;
  //   }

  //   const validDateValue = this.purchaseQuoteForm?.get('pqDate')?.value;
  //   if (validDateValue) {
  //     let adjustedDate = new Date(validDateValue);
  //     // Adjust timezone to match your local timezone
  //     const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
  //     adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
  //     this.purchaseQuoteForm.get('pqDate')?.setValue(adjustedDate);
  //   }

  //   const validDateValue1 = this.purchaseQuoteForm?.get('validDate')?.value;
  //   if (validDateValue1) {
  //     let adjustedDate = new Date(validDateValue1);
  //     // Adjust timezone to match your local timezone
  //     const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
  //     adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
  //     this.purchaseQuoteForm.get('validDate')?.setValue(adjustedDate);
  //   }

  //   this.purchaseQuoteForm.controls['pqDate'].setErrors(null);
  //   if (this.purchaseQuoteForm.valid) {
  //     this.purchaseQuotation = this.purchaseQuoteForm.value;
  //     this.purchaseQuotation.pqNumber = this.purchaseQuoteForm.controls['pqNumber'].value;
  //     this.purchaseQuotation.pqAgainstId = this.pqAgainstId;
  //     this.purchaseQuotation.vendorId = this.SelectedVendorId;
  //     this.purchaseQuotation.vendorTypeId = this.vendorTypeId;
  //     this.purchaseQuotation.refNumberId = this.refNumberId
  //     this.purchaseQuotation.vendorCurrencyId = this.vendorCurrencyId;
  //     const jcvalue = this.purchaseQuoteForm.controls['jobCategoryId'].value;
  //     this.purchaseQuotation.jobCategoryId = jcvalue != "" ? this.jobCategoryId : null;
  //     const jtvalue = this.purchaseQuoteForm.controls['jobTypeId'].value;
  //     this.purchaseQuotation.jobTypeId = jtvalue != "" ? this.jobTypeId : null;
  //     this.purchaseQuotation.cargoTypeId = this.cargoTypeId;
  //     this.purchaseQuotation.originCountryId = this.originCountryId;
  //     this.purchaseQuotation.destCountryId = this.destCountryId;
  //     this.purchaseQuotation.loadingPortId = this.loadingPortId;
  //     this.purchaseQuotation.destinationPortId = this.destinationPortId;
  //     this.purchaseQuotation.destLocationId = this.destLocationId;
  //     this.purchaseQuotation.originLocationId = this.originLocationId;
  //     this.purchaseQuotation.trailerTypeId = this.trailerTypeId;
  //     this.purchaseQuotation.transportTypeId = this.transportTypeId;
  //     this.purchaseQuotation.shipmentTypeId = this.shipmentTypeId;
  //     this.purchaseQuotation.containerTypeId = this.containerTypeId;
  //     this.purchaseQuotation.statusId = this.statusId;
  //     this.purchaseQuotation.approvalStatusId = this.approvalStatusId;
  //     this.purchaseQuotation.storageUomId = this.storageUomId;
  //     this.purchaseQuotation.updatedBy = parseInt(this.userId$);
  //     this.purchaseQuotation.updatedDate = this.date;

  //     this.purchaseQuotation.termsandConditions = this.content.value;

  //     const ModelContainer: PQModelContainer = {
  //       purchaseQuotation: this.purchaseQuotation,
  //       pqIncoTerm: this.pqIncoTerm,
  //       pqCommodity: this.pqCommodity,
  //       pqTransportMode: this.pqTransportMode,
  //       pqPackage: this.pqPackage,
  //       pqPrice: this.pqPrice,
  //       pqDocument: this.pqDocuments,
  //     }
  //     console.log(ModelContainer)
  //     const noOfpkg = this.purchaseQuoteForm.controls['packageNos'].value
  //     const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
  //     const count = this.pqPackage.length;
  //     if (noOfpkgcount != count) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops!",
  //         text: "Package details is less when compared to No of packages.",
  //         showConfirmButton: true,
  //       });
  //       return;
  //     }
  //     // return
  //     if (ModelContainer.purchaseQuotation.purchaseQuoteId == 0) {
  //       this.pqServices.purchaseQuotationSave(ModelContainer).subscribe({
  //         next: (res) => {
  //           console.log(this.ImageDetailsArray)
  //           const formData = new FormData();
  //           this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
  //           this.Fs.FileUpload(formData).subscribe({
  //             next: (res) => {

  //             },
  //             error: (error) => {
  //             }
  //           });
  //           this.commonService.displayToaster(
  //             "success",
  //             "Success",
  //             "Added Sucessfully"
  //           );
  //           const parms = {
  //             MenuId: 59,
  //             currentUser: this.userId$,
  //             activityName: "Creation",
  //             id: res.purchaseQuotation.purchaseQuoteId,
  //             code: res.purchaseQuotation.pqNumber
  //           }
  //           this.Ns.TriggerNotification(parms).subscribe((res => {

  //           }));
  //           this.returnToList();
  //         },
  //         error: (err: HttpErrorResponse) => {
  //           let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
  //           if (stausCode === 500) {
  //             this.errorHandler.handleError(err);
  //           } else if (stausCode === 400) {
  //             this.errorHandler.FourHundredErrorHandler(err);
  //           } else {
  //             this.errorHandler.commonMsg();
  //           }
  //         },
  //       });
  //     }
  //     else {
  //       this.pqServices.purchaseQuotationSave(ModelContainer).subscribe({
  //         next: (res) => {
  //           console.log(this.ImageDetailsArray)
  //           const formData = new FormData();
  //           this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
  //           this.Fs.FileUpload(formData).subscribe({
  //             next: (res) => {

  //             },
  //             error: (error) => {
  //             }
  //           });
  //           this.commonService.displayToaster(
  //             "success",
  //             "Success",
  //             "Updated Sucessfully"
  //           );
  //           const parms = {
  //             MenuId: 59,
  //             currentUser: this.userId$,
  //             activityName: "Updation",
  //             id: res.purchaseQuotation.purchaseQuoteId,
  //             code: res.purchaseQuotation.pqNumber
  //           }
  //           this.Ns.TriggerNotification(parms).subscribe((res => {
  //             console.log(res);
  //           }));
  //           this.returnToList();
  //         },
  //         error: (error) => {
  //           console.log(error)
  //           var ErrorHandle = this.ErrorHandling.handleApiError(error)
  //           this.commonService.displayToaster(
  //             "error",
  //             "Error",
  //             ErrorHandle
  //           );
  //         },
  //       });
  //     }
  //   }
  //   else {
  //     const invalidControls = this.findInvalidControls();
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops!",
  //       text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
  //       showConfirmButton: true,
  //     });
  //     this.purchaseQuoteForm.markAllAsTouched();
  //     this.validateall(this.purchaseQuoteForm);

  //   }

  // }


  onSaveGeneral(event: any) {
    debugger
    if (this.showAddRowDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Add or remove details in Document Detail tab",
        showConfirmButton: false,
        timer: 2000,
      });
      this.changeTab(4);
      return;
    }

    let closedReason = this.purchaseQuoteForm.controls['statusId'].value;

    if (closedReason?.pqStatus === 'Rejected') {
      this.purchaseQuoteForm.controls['cancelReasonControl'].setValidators([Validators.required]);
      this.purchaseQuoteForm.controls['cancelReasonControl'].updateValueAndValidity();
    } else {
      this.purchaseQuoteForm.controls['cancelReasonControl'].clearValidators();
      this.purchaseQuoteForm.controls['cancelReasonControl'].updateValueAndValidity();
    }

    if (event === 'Save') {
      const validDateValue = this.purchaseQuoteForm?.get('pqDate')?.value;
      if (validDateValue) {
        let adjustedDate = new Date(validDateValue);
        // Adjust timezone to match your local timezone
        const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
        adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
        this.purchaseQuoteForm.get('pqDate')?.setValue(adjustedDate);
      }

      const validDateValue1 = this.purchaseQuoteForm?.get('validDate')?.value;
      if (validDateValue1) {
        let adjustedDate = new Date(validDateValue1);
        // Adjust timezone to match your local timezone
        const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
        adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
        this.purchaseQuoteForm.get('validDate')?.setValue(adjustedDate);
      }

      this.purchaseQuoteForm.controls['pqDate'].setErrors(null);
      if (this.purchaseQuoteForm.valid) {
        this.save(event);
      }
      else {
        const invalidControls = this.findInvalidControls();
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
          showConfirmButton: true,
        });
        this.changeTab(0);
        this.purchaseQuoteForm.markAllAsTouched();
        this.validateall(this.purchaseQuoteForm);

      }
    } else {
      this.save(event);
    }
  }

  save(event:any){

    const defaultDate = new Date('1900-01-01');
    let pqDate = this.purchaseQuoteForm.get('pqDate')?.value;
    let validDate = this.purchaseQuoteForm.get('validDate')?.value;
    if (!pqDate) {
      this.purchaseQuoteForm.get('pqDate')?.setValue(defaultDate);
    }
    if (!validDate) {
      this.purchaseQuoteForm.get('validDate')?.setValue(defaultDate);
    }

    debugger
    const Status = this.purchaseQuoteForm.controls['statusId'].value;
    
    if (event === 'Save') {
      if (Status.statusId == 1) {
        this.statusId = 9;
      }
      else if (Status.statusId == 6) {
        this.statusId = 6;
      } else if (Status.statusId == 4) {
        this.statusId = 4;
      }
    }
    else if (event === 'Draft') {
      this.statusId = 1;
    }

    //Send back Status change
    if(this.approvalStatusId==5){
      this.statusId = 5;
    }
    
    this.purchaseQuotation = this.purchaseQuoteForm.value;
    this.purchaseQuotation.reasonId = this.getReasonId(this.purchaseQuoteForm.controls['cancelReasonControl'].value) || null;
    this.purchaseQuotation.closedRemarks = this.purchaseQuoteForm.controls['cancelRemarkControl'].value || null;
    this.purchaseQuotation.pqNumber = this.purchaseQuoteForm.controls['pqNumber'].value;
    this.purchaseQuotation.pqAgainstId = this.pqAgainstId;
    this.purchaseQuotation.vendorId = this.SelectedVendorId;
    this.purchaseQuotation.vendorTypeId = this.vendorTypeId;
    this.purchaseQuotation.refNumberId = this.refNumberId
    this.purchaseQuotation.vendorCurrencyId = this.vendorCurrencyId || this.getUnknownId("Currency");
    const jcvalue = this.purchaseQuoteForm.controls['jobCategoryId'].value;
    this.purchaseQuotation.jobCategoryId = jcvalue != "" ? this.jobCategoryId : null;
    const jtvalue = this.purchaseQuoteForm.controls['jobTypeId'].value;
    this.purchaseQuotation.jobTypeId = jtvalue != "" ? this.jobTypeId : null;
    this.purchaseQuotation.cargoTypeId = this.cargoTypeId;
    this.purchaseQuotation.originCountryId = this.originCountryId || this.getUnknownId("Country");
    this.purchaseQuotation.destCountryId = this.destCountryId || this.getUnknownId("Country");
    this.purchaseQuotation.loadingPortId = this.loadingPortId;
    this.purchaseQuotation.destinationPortId = this.destinationPortId;
    this.purchaseQuotation.destLocationId = this.destLocationId;
    this.purchaseQuotation.originLocationId = this.originLocationId;
    this.purchaseQuotation.trailerTypeId = this.trailerTypeId;
    this.purchaseQuotation.transportTypeId = this.transportTypeId;
    this.purchaseQuotation.shipmentTypeId = this.shipmentTypeId;
    this.purchaseQuotation.containerTypeId = this.containerTypeId;
    this.purchaseQuotation.statusId = this.statusId;
    this.purchaseQuotation.approvalStatusId = this.approvalStatusId;
    this.purchaseQuotation.storageUomId = this.storageUomId;
    this.purchaseQuotation.updatedBy = parseInt(this.userId$);
    this.purchaseQuotation.updatedDate = this.date;

    this.purchaseQuotation.termsandConditions = this.content.value;

    const ModelContainer: PQModelContainer = {
      purchaseQuotation: this.purchaseQuotation,
      pqIncoTerm: this.pqIncoTerm,
      pqCommodity: this.pqCommodity,
      pqTransportMode: this.pqTransportMode,
      pqPackage: this.pqPackage,
      pqPrice: this.pqPrice,
      pqDocument: this.pqDocuments,
    }
    console.log(ModelContainer)
    const noOfpkg = this.purchaseQuoteForm.controls['packageNos'].value
    const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
    const count = this.pqPackage.length;
    if (noOfpkgcount != count) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Package details is less when compared to No of packages.",
        showConfirmButton: true,
      });
      this.purchaseQuoteForm.controls['packageNos'].markAllAsTouched();
      this.changeTab(1);
      return;
    }
    // return
    if (ModelContainer.purchaseQuotation.purchaseQuoteId == 0) {
      this.pqServices.purchaseQuotationSave(ModelContainer).subscribe({
        next: (res) => {
          console.log(this.ImageDetailsArray)
          const formData = new FormData();
          this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
          this.Fs.FileUpload(formData).subscribe({
            next: (res) => {

            },
            error: (error) => {
            }
          });
          this.commonService.displayToaster(
            "success",
            "Success",
            "Added Sucessfully"
          );
          const parms = {
            MenuId: 59,
            currentUser: this.userId$,
            activityName: "Creation",
            id: res.purchaseQuotation.purchaseQuoteId,
            code: res.purchaseQuotation.pqNumber
          }
          this.Ns.TriggerNotification(parms).subscribe((res => {

          }));
          this.returnToList();
        },
        error: (err: HttpErrorResponse) => {
          let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
          if (stausCode === 500) {
            this.errorHandler.handleError(err);
          } else if (stausCode === 400) {
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        },
      });
    }
    else {
      this.pqServices.purchaseQuotationSave(ModelContainer).subscribe({
        next: (res) => {
          console.log(this.ImageDetailsArray)
          const formData = new FormData();
          this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
          this.Fs.FileUpload(formData).subscribe({
            next: (res) => {

            },
            error: (error) => {
            }
          });
          this.commonService.displayToaster(
            "success",
            "Success",
            "Updated Sucessfully"
          );
          const parms = {
            MenuId: 59,
            currentUser: this.userId$,
            activityName: "Updation",
            id: res.purchaseQuotation.purchaseQuoteId,
            code: res.purchaseQuotation.pqNumber
          }
          this.Ns.TriggerNotification(parms).subscribe((res => {
            console.log(res);
          }));
          if (this.pqServices.editFromApprove) {
            this.router.navigate(["/crm/master/approvalhistorylist"]);
            this.pqServices.editFromApprove = false;
            return;
          } else {
            this.returnToList();
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
    }
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  getReasonId(value: any) {
    let option = this.CancelReasonList.find(option => option?.reasonName == value)
    return option?.reasonId;
  }

  getUnknownId(value: any) {
    let option = this.UnknownValueList.find(option => option?.name == value)
    return option?.id;
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

  resetGeneral() {
    this.showAddRowDoc = false;
    if (this.gereralEdit) {
      this.getPQbyId();
      return;
    }
    if (this.rfqService.rfq) {
      this.ngOnInit();
      this.pqPackage = []
      this.pqPrice = []
      this.pqDocuments = []
      this.pqCommodity = []
      this.pqIncoTerm = []
      this.pqTransportMode = []
    }
    if (this.rfqService.enq) {
      this.ngOnInit();
      this.pqPackage = []
      this.pqPrice = []
      this.pqDocuments = []
      this.pqCommodity = []
      this.pqIncoTerm = []
      this.pqTransportMode = []
    }
    if (this.rfqService.job) {
      this.ngOnInit();
      this.pqPackage = []
      this.pqPrice = []
      this.pqDocuments = []
      this.pqCommodity = []
      this.pqIncoTerm = []
      this.pqTransportMode = []
    }
    // this.purchaseQuoteForm.reset();
    // this.purchaseQuotation = new PurchaseQuotation()

    // this.pqAgainstId = this.pqServices.pqAgainstId
    // this.SelectedVendorId = this.pqServices.vendorId
    // this.purchaseQuotationId = this.pqServices.itemId
    // this.type = this.pqServices.type;
    // this.refNumberId = this.pqServices.refNumberId;
    // this.refCode = this.pqServices.refNumber;
    // if (this.pqServices.isEdit == false && this.SelectedVendorId != 0 && this.type == 'PV') {
    //   this.getPotentialvendorbyId();
    // }
    // else if (this.pqServices.isEdit == false && this.SelectedVendorId != 0 && this.type == 'V') {
    //   this.getvendorbyId();
    // }
    // this.setpq();
  }
  // dateFilter = (date: Date | null): boolean => {
  //   const currentDate = new Date();
  //   currentDate.setHours(0, 0, 0, 0);
  //   return !date || date >= currentDate;
  // };

  dateFilter = (date: Date | null): boolean => {
    // Get the current date and set the time to the start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get the enquiry date from the form control
    const enquiryDateValue = this.purchaseQuoteForm.controls['pqDate'].value;

    // Ensure enquiryDateValue is a valid Date object
    const enquiryDate = enquiryDateValue ? new Date(enquiryDateValue) : null;

    // If enquiryDate is not valid, allow all dates
    if (!enquiryDate) {
      return true;
    }

    // Set the time of enquiryDate to the start of the day for a fair comparison
    enquiryDate.setHours(0, 0, 0, 0);

    // Return true if date is null or date is greater than or equal to enquiryDate
    return !date || date > enquiryDate;
  };
  dateFilter1 = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return !date || date <= currentDate;
  };
  //#endregion

  ///////---------------------------------------------Service Details--------------------

  //#region 
  serviceForm() {
    this.purchaseQuoteForm = this.fb.group({
      purchaseQuoteId: [0],
      pqNumber: [{ value: '', disabled: true }],
      pqSeqNo: [0],
      pqDate: [this.date, Validators.required],
      pqAgainstId: [{ value: '', disabled: true }],
      refNumber: [{ value: '', disabled: true }],
      vendorTypeId: [{ value: '', disabled: true }],
      vendorId: [''],
      vendorName: [{ value: '', disabled: true }],
      vendorRanking: [{ value: null, disabled: true }],
      validDate: [this.addDate, Validators.required],
      vendorCurrencyId: ['', Validators.required],
      jobCategoryId: [null],
      jobTypeId: [null],
      statusId: [null, Validators.required],
      approvalStatusId: [null],
      remarks: [''],
      tags: [''],

      commodityId: [[]],
      incoTermId: [[]],
      modeofTransportId: [[]],

      originCountryId: ['', Validators.required],
      destCountryId: ['', Validators.required],
      loadingPortId: [null],
      destinationPortId: [null],
      originLocationId: [null],
      destLocationId: [null],
      trailerTypeId: [null],
      transportTypeId: [null],
      pickUpLocation: [''],
      deliveryPlace: [''],
      shipmentTypeId: [null],
      containerTypeId: [null],
      cargoTypeId: [null],
      temperatureReq: [''],
      vendorRemarks: [''],
      storageUomId: [null],
      valuePerUom: [],
      packageNos: [],
      termsAndConditions: [''],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [''],
      updatedDate: [this.date],

      cancelReasonControl: [''],
      cancelRemarkControl: [''],
    });
    {
      this.packageForm = this.fb.group({
      });
    }
  }

  // #region Date validation
  add30Days() {
    if (this.date) {
      const newDate = new Date(this.date);
      newDate.setDate(newDate.getDate() + 30);
      this.addDate = newDate;
    }
  }
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const newDate = new Date(event.value);
      newDate.setDate(newDate.getDate() + 30);
      this.purchaseQuoteForm.controls['validDate'].setValue(newDate)
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
    this.purchaseQuoteForm.controls['valuePerUom'].setValue(input.value);
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
    this.purchaseQuoteForm.controls['packageNos'].setValue(value);
  }


  JTEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.jobTypeId = null;
      this.purchaseQuoteForm.controls['jobTypeId'].setValue('');
    }
  }

  //#region country autocomplete
  getAllPQAgainst() {

    this.commonService.getAllPQAgainst().subscribe(res => {
      this.pqAgainstList = res;
      this.PQAgainstFun();
      this.setpq()
    });
  }
  PQAgainstFun() {
    this.filteredpqAgainstOptions$ = this.purchaseQuoteForm.controls['pqAgainstId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.pqAgainst)),
      map((name: any) => (name ? this.filteredpqAgainstOptions(name) : this.pqAgainstList?.slice()))
    );
  }
  private filteredpqAgainstOptions(name: string): any[] {

    const filterValue = name.toLowerCase();
    const results = this.pqAgainstList.filter((option: any) => option.pqAgainst.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatapq();
  }
  NoDatapq(): any {
    this.purchaseQuoteForm.controls['pqAgainstId'].setValue('');
    return this.pqAgainstList;
  }
  displayPQAgainstLabelFn(data: any): string {
    return data && data.pqAgainst ? data.pqAgainst : '';
  }
  PQAgainstSelectedoption(Data: any) {
    let selectedvalue = Data.option.value;
    this.pqAgainstId = selectedvalue.pqAgainstId;
  }
  //#endregion

  //#region  currency
  getCurrencyList() {
    this.commonService.getCurrencies(this.liveStatus).subscribe(result => {
      this.currencyList = result;
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.purchaseQuoteForm.controls['vendorCurrencyId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['vendorCurrencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.vendorCurrencyId = selectedValue.currencyId;
  }
  //#endregion

  //#region JobCategory  autocomplete
  getjobCategoryList() {
    this.jobtypeService.GetAllJobCategory().subscribe(res => {
      this.jobCategoryList = res;
      this.jobCategoryListFun()
    });
  }
  jobCategoryListFun() {
    this.filteredjobCategoryOptions$ = this.purchaseQuoteForm.controls['jobCategoryId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['jobCategoryId'].setValue('');
    return this.jobCategoryList;
  }
  displayjobCategoryLabelFn(data: any): string {
    return data && data.jobCategory ? data.jobCategory : '';
  }
  jobCategorySelectedoption(data: any) {

    let selectedIncoterm = data.option.value;
    this.jobCategoryId = selectedIncoterm.jobCategoryId;
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
    this.filteredjobTypeOptions$ = this.purchaseQuoteForm.controls['jobTypeId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['jobTypeId'].setValue('');
    return this.jobTypeList;
  }
  displayjobTypeLabelFn(data: any): string {
    return data && data.jobTypeName ? data.jobTypeName : '';
  }
  jobTypeSelectedoption(data: any) {
    debugger
    let selectedIncoterm = data.option.value;
    this.jobTypeId = selectedIncoterm.jobTypeId;

    this.jobtypeService.getAllJopTypeById(this.jobTypeId).subscribe((res) => {
      this.JobtypeModeoftans = res.jtModeofTransport;
      var trns = this.JobtypeModeoftans.map(id => id.modeofTransportId);
      this.purchaseQuoteForm.controls['modeofTransportId'].setValue(trns);
      console.log('modeofTransportId', this.purchaseQuoteForm.controls['modeofTransportId'].value);

      this.onSelectTransport();
      this.jobtypeIncoTerms = res.jobTypeGeneral.incoTermId;
      this.purchaseQuoteForm.controls["incoTermId"].setValue([this.jobtypeIncoTerms]);
      this.onSelectInco();
    });
    // this.jobtypeService.getAllJopTypeById(this.jobTypeId).subscribe(res => {
    //   this.lineItemList = res.jobTypeLineItems
    //   const pqPrices: any[] = this.lineItemList.map((lineItem: JobTypeLineItem) => {
    //     const pqPrice = new PqPrice();
    //     pqPrice.lineItemId = lineItem.lineItemId;
    //     pqPrice.lineItemName = lineItem.lineItemName;
    //     pqPrice.lineItemCategoryName = lineItem.lineItemCategoryName;
    //     pqPrice.categoryId = lineItem.lineItemCategoryId;
    //     pqPrice.createdBy = 1;
    //     pqPrice.createdDate = this.date;
    //     pqPrice.updatedBy = 1;
    //     pqPrice.updatedDate = this.date;
    //     return pqPrice;
    //   });
    //   this.pqPrice = pqPrices
    //   Swal.fire({
    //     icon: "info",
    //     title: "Info!",
    //     text: "Please fill the mandatory fields in Price Details",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    // });
  }
  //#endregion

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
    this.incoTermService.getIncoterms(this.Livestatus).subscribe(res => {
      this.incotermList = res;
    });
  }

  incotermSelectedoption(incodata: any) {
    let selectedIncoterm = incodata.option.value;
    this.incoTermId = selectedIncoterm.incoTermId;
  }
  //#endregion

  //#region modeofTransport autocomplete
  getTransportList() {
    this.commonService.getAllModeofTransport().subscribe(res => {
      this.modeofTransportList = res;
    });
  }
  transportSelectedoption() {
    debugger
    const selectedModes = this.purchaseQuoteForm.controls['modeofTransportId'].value;
    selectedModes.forEach((mode: number) => {
      if (mode === 1 && selectedModes.includes(2)) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Can't select both Air and Sea simultaneously.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.portofLoadingList = []
        this.portofDestinationList = []
        this.pqTransportMode = [];
        this.destinationPortId = null;
        this.loadingPortId = null;
        this.purchaseQuoteForm.controls['modeofTransportId'].reset()
        this.purchaseQuoteForm.controls['loadingPortId'].reset()
        this.purchaseQuoteForm.controls['destinationPortId'].reset()

      }
    });
    selectedModes.forEach((mode: number) => {
      if (mode === 4 && (selectedModes.includes(1) || selectedModes.includes(2) || selectedModes.includes(3))) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Courier can't be combined with any other mode.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.portofLoadingList = []
        this.portofDestinationList = []
        this.pqTransportMode = [];
        this.destinationPortId = null;
        this.loadingPortId = null;
        this.purchaseQuoteForm.controls['modeofTransportId'].reset()
        this.purchaseQuoteForm.controls['loadingPortId'].reset()
        this.purchaseQuoteForm.controls['destinationPortId'].reset()

      }
    });
    //-------------------Calculation-------------------------

    if (selectedModes.includes(1) && selectedModes.includes(3)) {
      this.seaportSelected = false;
      const calcairandroad = 10000
      this.Calculation(calcairandroad);
      this.portofLoadingList = []
      this.portofDestinationList = []

      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllAirportList();
      }
    }
    else if (selectedModes.includes(2) && selectedModes.includes(3)) {
      this.seaportSelected = false;
      const calcairandroad = 10000
      this.Calculation(calcairandroad);

      this.portofLoadingList = []
      this.portofDestinationList = []
      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllSeaportList();
      }
    } else if (selectedModes.includes(1)) {
      this.seaportSelected = false;
      const calcairandroad = 6000
      this.Calculation(calcairandroad);
      this.portofLoadingList = []
      this.portofDestinationList = []

      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllAirportList();
      }
    }
    else if (selectedModes.includes(2)) {
      this.seaportSelected = true;
      const calcairandroad = 6000
      this.Calculation(calcairandroad);
      this.portofLoadingList = []
      this.portofDestinationList = []

      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllSeaportList();
      }
    } else if (selectedModes.includes(3)) {
      this.seaportSelected = false;
      const calcairandroad = 10000
      this.Calculation(calcairandroad);
      this.portofLoadingList = []
      this.portofDestinationList = []
      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      this.loadingPortId = null;
      this.destinationPortId = null;
    } else if (selectedModes.includes(4)) {
      this.seaportSelected = false;
      const calcairandroad = 5000
      this.Calculation(calcairandroad);
      this.portofLoadingList = []
      this.portofDestinationList = []
      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      this.loadingPortId = null;
      this.destinationPortId = null;
    }

  }


  Calculation(value: number) {
    debugger
    if (this.seaportSelected) {
      this.pqPackage = this.pqPackage.map(pkg => {
        return {
          ...pkg,
          cbm: parseFloat((pkg.length * pkg.breadth * pkg.height).toFixed(2)),
          chargePackWtKg: 0.00
        };
      });
    } else {
      this.pqPackage = this.pqPackage.map(pkg => {
        return {
          ...pkg,
          cbm: parseFloat((pkg.length * pkg.breadth * pkg.height).toFixed(2)),
          chargePackWtKg: parseFloat((pkg.length * pkg.breadth * pkg.height / value).toFixed(2))
        };
      });
    }

  }


  //#endregion

  //#region country autocomplete
  getCountryMaster() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
      this.CountryTypeFun1();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.purchaseQuoteForm.controls['originCountryId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['originCountryId'].setValue('');
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
    const selectedModes = this.purchaseQuoteForm.controls['modeofTransportId'].value;

    if (selectedModes.includes(1)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      //this.pqTransportMode = [];
      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllAirportList();
      }
    }
    else if (selectedModes.includes(2)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      //this.pqTransportMode = [];
      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllSeaportList();
      }
    }
  }
  //#endregion

  //#region country dest autocomplete
  CountryTypeFun1() {
    this.filteredCountryOptionsDest$ = this.purchaseQuoteForm.controls['destCountryId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['destCountryId'].setValue('');
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
    const selectedModes = this.purchaseQuoteForm.controls['modeofTransportId'].value;

    if (selectedModes.includes(1)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      //this.pqTransportMode = [];
      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllAirportList();
      }
    }
    else if (selectedModes.includes(2)) {
      this.portofLoadingList = []
      this.portofDestinationList = []
      //this.pqTransportMode = [];
      this.purchaseQuoteForm.controls['loadingPortId'].reset()
      this.purchaseQuoteForm.controls['destinationPortId'].reset()
      if (this.originCountryId != null || this.destCountryId != null) {
        this.getAllSeaportList();
      }
    }
  }
  //#endregion

  //#region cargo type
  getCargoList() {
    this.commonService.getAllCargo().subscribe(res => {
      this.cargoList = res;
      this.corgoFun();
    });
  }
  corgoFun() {
    this.filteredCargoOptions$ = this.purchaseQuoteForm.controls['cargoTypeId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['cargoTypeId'].setValue('');
    return this.cargoList;
  }
  displayCargoLabelFn(data: any): string {
    return data && data.cargoType ? data.cargoType : '';
  }
  CargoSelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.cargoTypeId = selectedValue.cargoTypeId;
  }

  CargoEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.cargoTypeId = null;
    }
  }

  //#endregion

  //#region get All originCity
  getcityList(Id: any) {

    this.commonService.getAllCitiesbyCountry(Id).subscribe(res => {
      this.originCityList = res;
      this.originCityFun();
    });
  }
  originCityFun() {
    this.filteredoriginCityOptions$ = this.purchaseQuoteForm.controls['originLocationId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['originLocationId'].setValue('');
    return this.originCityList;
  }
  displayoriginCityLabelFn(data: any): string {
    return data && data.cityName ? data.cityName : '';
  }
  originCitySelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.originLocationId = selectedValue.cityId;
  }

  OriginEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.originLocationId = null;
    }
  }

  //#endregion

  //#region get All destcity
  getDestcityList(Id: any) {

    this.commonService.getAllCitiesbyCountry(Id).subscribe(res => {
      this.DestCityList = res;
      this.DestCityFun();
    });
  }
  DestCityFun() {
    this.filteredDestCityOptions$ = this.purchaseQuoteForm.controls['destLocationId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['destLocationId'].setValue('');
    return this.DestCityList;
  }
  displayDestCityLabelFn(data: any): string {
    return data && data.cityName ? data.cityName : '';
  }
  destCitySelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.destLocationId = selectedValue.cityId;
  }

  DestinationEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.destLocationId = null;
    }
  }

  //#endregion

  //#region Trailer Type
  GetTrailerType() {
    this.trailerTypeService.GetAllTrailerType(this.Livestatus).subscribe(res => {
      this.TrailerType = res;
      this.TrailerFun()
    });
  }
  TrailerFun() {
    this.filteredTrailerOptions$ = this.purchaseQuoteForm.controls['trailerTypeId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['trailerTypeId'].setValue('');
    return this.TrailerType;
  }
  displayTrailerLabelFn(data: any): string {
    return data && data.trailerTypeName ? data.trailerTypeName : '';
  }
  TrailerSelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.trailerTypeId = selectedValue.trailerTypeId;
  }

  TrailerEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.trailerTypeId = null;
    }
  }

  //#endregion

  //#region Transport List
  GetTransport() {
    this.commonService.getAllTransportType().subscribe(res => {
      this.transportList = res;
      this.TransportFun()
    });
  }
  TransportFun() {
    this.filteredTransportOptions$ = this.purchaseQuoteForm.controls['transportTypeId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['transportTypeId'].setValue('');
    return this.transportList;
  }
  displayTransportLabelFn(data: any): string {
    return data && data.transportType ? data.transportType : '';
  }
  TransportSelectedoption(data: any) {

    let selectedValue = data.option.value;
    this.transportTypeId = selectedValue.transportTypeId;
  }

  TransportEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.transportTypeId = null;

    }
  }

  //#endregion

  //#region Shipment Types
  getAllShipmentTypes() {
    this.commonService.GetAllShipmentTypes().subscribe(res => {
      this.shipmentList = res;
      this.shipmentFun()
    });
  }
  shipmentFun() {
    this.filteredshipmentOptions$ = this.purchaseQuoteForm.controls['shipmentTypeId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['shipmentTypeId'].setValue('');
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
      this.purchaseQuoteForm.get('containerTypeId')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.purchaseQuoteForm.get('containerTypeId')?.clearValidators();

      this.purchaseQuoteForm.get('containerTypeId')?.setValue(null);
    }

    this.purchaseQuoteForm.get('containerTypeId')?.updateValueAndValidity();
  }

  ShipmentEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.shipmentTypeId = null;
    }
  }

  //#endregion

  //#region Container
  getAllContainer() {
    this.containerTypeService.getAllActiveContainerType().subscribe(res => {
      this.containerList = res;
      this.ContainerFun()
    });
  }
  ContainerFun() {
    this.filteredContainerOptions$ = this.purchaseQuoteForm.controls['containerTypeId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['containerTypeId'].setValue('');
    return this.containerList;
  }
  displayContainerLabelFn(data: any): string {
    return data && data.containerTypeName ? data.containerTypeName : '';
  }
  containerSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.containerTypeId = selectedValue.containerTypeId;
  }

  ContainerEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.containerTypeId = null;
    }
  }
  //#endregion

  //#region rfq Status List
  GetAllPQStatus() {
    this.commonService.GetAllPQStatus().subscribe(res => {
      this.pqStatusList = res;
      const value = this.pqStatusList.find(obj => obj.pqStatusId == 1)
      this.purchaseQuoteForm.controls['statusId'].setValue(value);
      this.statusId = 1;
      this.rfqFun()
    });
  }
  rfqFun() {
    this.filteredrfqOptions$ = this.purchaseQuoteForm.controls['statusId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.pqStatus)),
      map((name: any) => (name ? this.filteredrfqOptions(name) : this.pqStatusList?.slice()))
    );
  }
  private filteredrfqOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.pqStatusList.filter((option: any) => option.pqStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatarfq();
  }
  NoDatarfq(): any {
    this.purchaseQuoteForm.controls['statusId'].setValue('');
    return this.pqStatusList;
  }
  displayrfqLabelFn(data: any): string {
    return data && data.pqStatus ? data.pqStatus : '';
  }
  rfqSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.statusId = selectedValue.pqStatusId;

    this.showCancelFields = (selectedValue.pqStatus === 'Rejected' || selectedValue.pqStatus === 'Close');

  }

  isOptionDisabled(option: any): any {
    this.showCancelFields = (this.statusId === 7 || this.statusId === 2);
    if(this.statusId == 8){
      return option.pqStatusId !== 8;
    } else if(this.statusId == 1){
      return option.pqStatusId !== 1;
    } else if(this.statusId == 9){
      return option.pqStatusId !== 9 && option.pqStatusId !== 5;
    } else if(this.statusId == 6){
      return option.pqStatusId !== 6 && option.pqStatusId !== 2 && option.pqStatusId !== 3;
    } else {
      return option.pqStatusId !== this.statusId;
    }
    
  }
  //#endregion

  //#region approval status
  GetAllApprovalStatus() {
    this.commonService.GetAllApprovalStatus().subscribe(result => {
      this.approvalStatusList = result;
      const value = this.approvalStatusList.find(obj => obj.approvalStatusId == 1)
      this.purchaseQuoteForm.controls['approvalStatusId'].setValue(value);
      this.approvalStatusId = 1;
      this.ApprovalStatusFun();
    })
  }
  ApprovalStatusFun() {
    this.filteredApprovalStatusOptions$ = this.purchaseQuoteForm.controls['approvalStatusId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['approvalStatusId'].setValue('');
    return this.approvalStatusList;
  }
  displayApprovalStatusLabelFn(data: any): string {
    return data && data.approvalStatus ? data.approvalStatus : '';
  }
  selectApprovalStatus(data: any) {
    let selectedValue = data.option.value;
    this.approvalStatusId = selectedValue.approvalStatusId;
  }
  //#region UOM List
  getAllUOMList() {
    this.uomService.getAllActiveUOM().subscribe(res => {
      this.uomList = res;
      this.uomFun()
    });
  }
  uomFun() {
    this.filteredUOMOptions$ = this.purchaseQuoteForm.controls['storageUomId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['storageUomId'].setValue('');
    return this.uomList;
  }
  displayUOMLabelFn(data: any): string {
    return data && data.uomName ? data.uomName : '';
  }
  uomSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.storageUomId = selectedValue.uomId;
  }

  UOMEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.storageUomId = null;
    }
  }
  //#endregion

  getUnknownValues() {
    this.commonService.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
  }

  //#region airport List
  getAllAirportList() {

    if (this.originCountryId != null) {
      this.commonService.GetAllAirportByCountryId(this.originCountryId).subscribe(res => {
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
      this.commonService.GetAllAirportByCountryId(this.destCountryId).subscribe(res => {
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
    this.filteredloadingportOptions$ = this.purchaseQuoteForm.controls['loadingPortId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['loadingPortId'].setValue('');
    return this.portofLoadingList;
  }
  displayLoadingportLabelFn(data: any): string {

    return data && data.loadingPortName ? data.loadingPortName : '';
  }
  loadingportSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.loadingPortId = selectedValue.loadingPortId;
  }
  //#endregion

  //#region seaport List
  getAllSeaportList() {
    this.commonService.GetAllSeaportByCountryId(this.originCountryId).subscribe(res => {
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
    this.commonService.GetAllSeaportByCountryId(this.destCountryId).subscribe(res => {
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
    this.filtereddestportOptions$ = this.purchaseQuoteForm.controls['destinationPortId'].valueChanges.pipe(
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
    this.purchaseQuoteForm.controls['destinationPortId'].setValue('');
    return this.portofDestinationList;
  }
  displaydestportLabelFn(data: any): string {

    return data && data.destinationPortIdName ? data.destinationPortIdName : '';
  }
  destportSelectoption(data: any) {

    let selectedValue = data.option.value;
    this.destinationPortId = selectedValue.destinationPortId;
  }

  //#endregion

  //#endregion

  ///////----------------------------------------Package details----------------------------------------
  addPackage() {

    this.modeofTransport = this.pqTransportMode;
    const noOfpkg = this.purchaseQuoteForm.controls['packageNos'].value
    const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
    const count = this.pqPackage.length;
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
      const dialogRef = this.dialog.open(PackageDialogComponent, {
        data: {
          list: this.pqPackage,
          modeofTransport: this.modeofTransport,
          seaportSelected: this.seaportSelected
        }, disableClose: true, autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        debugger
        if (result != null) {
          this.pqPackage.push(result);
          this.pqPackage = [...this.pqPackage];
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
    const pkgvalue = this.purchaseQuoteForm.controls['packageNos'].value;
    if (pkgvalue < this.pqPackage.length) {
      // this.pqPackage.splice(pkgvalue,1);
    }
  }
  Edit(Data: any, i: number) {
    debugger
    this.modeofTransport = this.pqTransportMode;
    const dialogRef = this.dialog.open(PackageDialogComponent, {
      data: {
        pqData: Data,
        modeofTransport: this.modeofTransport,
        seaportSelected: this.seaportSelected,
        mode: 'Edit',
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.pqPackage.splice(i, 1);
        this.pqPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }
  View(Data: any, i: number) {
    this.modeofTransport = this.pqTransportMode;
    const dialogRef = this.dialog.open(PackageDialogComponent, {
      data: {
        pqData: Data,
        modeofTransport: this.modeofTransport,
        seaportSelected: this.seaportSelected,
        mode: 'View',
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.pqPackage.splice(i, 1);
        this.pqPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }
  DeletepacKage(item: any, i: number) {
    if (i !== -1) {
      this.pqPackage.splice(i, 1);
    }
  }

  ///////----------------------------------------Prie details--------------------

  openDialog() {
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: {
        list: this.pqPrice
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.pqPrice.splice(0, 0, result);
        this.pqPrice = [...this.pqPrice];
      }
    });
  }

  onEditPrice(Data: any) {

    this.rowIndexPrice = this.pqPrice.indexOf(Data);
    this.editedPrice = { ...Data }
    this.pqPrice.splice(this.rowIndexPrice, 1);
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: {
        priceDate: Data,
        list: this.pqPrice, mode: 'Edit',
        index: this.rowIndexPrice
      }, disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.pqPrice.splice(this.rowIndexPrice, 0, result);
        this.pqPrice = [...this.pqPrice];
      }
      else {
        this.pqPrice.splice(this.rowIndexPrice, 0, this.editedPrice);
        this.pqPrice = [...this.pqPrice];
      }
    });
  }
  onDeletePrice(Data: any) {

    const rowIndex = this.pqPrice.indexOf(Data);
    this.pqPrice.splice(rowIndex, 1);
    this.pqPrice = [...this.pqPrice];
  }
  onviewPrice(Data: any) {

    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: {
        priceDate: Data,
        mode: 'View',
      }
    });
  }
  //-------------------------PQ Mapping-----------------------------------------

  mapPrice(Data: PqPrice) {
    debugger
    if (Data.pqPriceId != 0) {
      this.pqServices.PurchaseQuotationGetPriceMappingById(Data.pqPriceId).subscribe(res => {
        this.mappedLineItem = res;
        if (this.mappedLineItem.length != 0) {
          if (Data.pqMapping == null) {
            const dialogRefmap = this.dialogmap.open(MappingDialogComponent, {
              data: {
                list: this.mappedLineItem,
                value: Data.value,
                viewMode: this.viewMode
              }, disableClose: true, autoFocus: false
            });
            dialogRefmap.afterClosed().subscribe(result => {
              if (result != null) {
                this.mappedLineItem = result;
                Data.pqMapping = this.mappedLineItem;
                this.pqPrice = [...this.pqPrice];
              }
            });
          }
          else {
            const dialogRefmap = this.dialogmap.open(MappingDialogComponent, {
              data: {
                list: Data.pqMapping,
                value: Data.value,
                viewMode: this.viewMode
              }, disableClose: true, autoFocus: false
            });
            dialogRefmap.afterClosed().subscribe(result => {
              if (result != null) {
                this.mappedLineItem = result;
                Data.pqMapping = this.mappedLineItem;
                this.pqPrice = [...this.pqPrice];
              }
            });
          }

        }
        else {
          const dialogRefmap = this.dialogmap.open(MappingDialogComponent, {
            data: {
              list: Data.pqMapping,
              value: Data.value,
              viewMode: this.viewMode
            }, disableClose: true, autoFocus: false
          });
          dialogRefmap.afterClosed().subscribe(result => {
            if (result != null) {
              this.mappedLineItem = result;
              Data.pqMapping = this.mappedLineItem;
              this.pqPrice = [...this.pqPrice];
            }
          });
        }
      });
    } else {
      const dialogRefmap = this.dialogmap.open(MappingDialogComponent, {
        data: {
          list: Data.pqMapping,
          value: Data.value,
          viewMode: this.viewMode
        }, disableClose: true, autoFocus: false
      });
      dialogRefmap.afterClosed().subscribe(result => {
        if (result != null) {
          this.mappedLineItem = result;
          Data.pqMapping = this.mappedLineItem;
          this.pqPrice = [...this.pqPrice];
        }
      });
    }
  }

  ///////------------------Attachments-------------------------

  getDocumentList() {
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      this.documents = res;
    });
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({ skip: skip, take: take });
    this.isEditDocument = false;
    if (!this.showAddRowDoc) {
      const newRow: PqDocument = {
        pqDocumentId: 0,
        purchaseQuoteId: 0,
        documentId: 0,
        remarks: '',
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        documentName: '',
        documentTypeName: '',
        IseditDoc: true,
        newDoc: true,
        files: '',
      };
      this.remarks = '';
      this.pqDocuments = [newRow, ...this.pqDocuments];
      this.showAddRowDoc = true;
    }
  }
  onInputChange(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.documents.some(x => x.documentName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.documentTypeName = '';

    }
  }
  SaveDoc(data: PqDocument) {

    if (data.documentTypeName == "" || this.fileName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.files = this.file;
    data.documentTypeName = this.documentTypeName;
    data.documentName = this.fileName;
    data.documentId = this.documentId;
    data.remarks = this.remarks;
    this.pqDocumentArray.forEach(element => {
      if (element.documentTypeName === data.documentTypeName) {
        this.existDoc = true
      }
    });
    if (this.existDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowDoc = true;
      data.IseditDoc = true;
      this.existDoc = false;
      return;
    }
    else {
      this.pqDocumentArray.splice(0, 0, data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
    this.onSelectDoc = false;
    this.fileName = '';
  }

  UpdateDoc(data: PqDocument) {

    if (data.documentTypeName == "" || this.fileName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.files = this.file;
    data.documentTypeName = this.documentTypeName;
    data.documentId = this.documentId;
    data.documentName = this.fileName;
    data.remarks = this.remarks;
    if (this.onSelectDoc) {
      data.documentName = this.fileName;
      data.documentTypeName = this.documentTypeName;
      data.remarks = this.remarks;
      data.documentId = this.documentId;
    }
    this.pqDocumentArray.forEach(element => {
      if (element.documentTypeName === data.documentTypeName) {
        this.existDoc = true;
      }
    });
    if (this.existDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowDoc = true;
      data.IseditDoc = true;
      this.existDoc = false;
      return;
    }
    else {
      this.pqDocumentArray.splice(this.rowIndexforDoc, 0, data);
      //this.pqDocumentArray.push(data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
  }
  EditDoc(data: PqDocument) {
    console.log("EDoc",this.pqDocuments)
    this.isEditDocument = true;
    data.IseditDoc = true;
    this.documentTypeName = data.documentTypeName;
    this.documentId = data.documentId;
    this.remarks = data.remarks;
    this.fileName = data.documentName;
    const rowIndex = this.pqDocumentArray.indexOf(data);
    this.rowIndexforDoc = rowIndex;
    this.editDocumet = { ...data };
    this.removeDoc = this.pqDocumentArray.splice(rowIndex, 1)
    this.onSelectDoc = false;
  }
  Deletedoc(data: PqDocument, index: any) {

    // const rowIndex = this.pqDocumentArray.indexOf(data);
    // this.pqDocumentArray.splice(rowIndex, 1);
    // this.pqDocuments.splice(rowIndex, 1);
    this.pqDocumentArray = this.pqDocumentArray.filter((_, i) => i !== index);
    this.pqDocuments = this.pqDocuments.filter((_, i) => i !== index);
    this.cdr.detectChanges();
    this.pqDocuments = [...this.pqDocuments];
    data.IseditDoc = false;
    this.showAddRowDoc = false;
  }
  oncancelDoc(data: any) {
    debugger
    //console.log("CDoc",this.pqDocuments)
    const rowIndex = this.pqDocuments.indexOf(data);
    if(data?.documentTypeName !== ""){
      data.IseditDoc = false;
      this.pqDocuments = [...this.pqDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.fileName = '';
      return;
    }


    if (data.newDoc) {
      this.pqDocuments.splice(rowIndex, 1);
      //this.pqDocumentArray.splice(rowIndex,1);
      this.pqDocuments = [...this.pqDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.fileName = '';
      return;
    }
    if (data.IseditDoc) {
      this.pqDocuments.splice(rowIndex, 1);
      this.pqDocuments.splice(rowIndex, 0, this.editDocumet);
      this.pqDocumentArray.splice(rowIndex, 0, this.editDocumet);
      this.pqDocuments = [...this.pqDocuments];
      this.showAddRowDoc = false;
      this.editDocumet.IseditDoc = false;
      data.newDoc = false;
      this.fileName = '';
    }

  }


  File(event: any): void {
    if (event?.target?.files && event.target.files.length > 0) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.fileName = file.name;
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
        const supportedFileTypes = [
          'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'pdf',
          'doc', 'docx', 'xls', 'xlsx'
        ];

        // Check if the file type is allowed (jpg or png)
        if (supportedFileTypes.includes(fileType)) {
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
          this.commonService.displayToaster(
            "error",
            "error",
            "Please Choose a JPG, JPEG, PNG, GIF, BMP, TIFF, SVG, PDF, DOC, DOCX, XLS, or XLSX File."
          );

          this.documentName = ''
        }

      }
    }

  }


  selectDocevent(item: any) {

    this.onSelectDoc = true;
    this.documentId = item.documentId;
    this.documentTypeName = item.documentName;
    //this.remarks = item.remarks
  }

  ValidateFieldDoc(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }
  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressDoc(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRowDoc ? this.SaveDoc(dataItem) : this.UpdateDoc(dataItem);
    }
  }
  /// to reach submit button
  handleChangeDoc(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeDoc(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressDoc(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelDoc(dataItem)
    }
  }
  //#endregion
  Downloads(file: any) {

    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }

  show(event: any): void {
    debugger
    var filePath = this.Filepath + event
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg') {
      this.dialog.open(this.imagePreview, { data: filePath });
    } else {
      window.open(filePath, '_blank');
    }
  }
  //------------------Terms & Condition--------------------


  //#region Blur Events

  currencyBlurEvent(){
    const pastedValue = this.purchaseQuoteForm.get('vendorCurrencyId')?.value;
    if(!pastedValue){
      this.vendorCurrencyId = null;
    }
  }
  OriginCountryBlurEvent(){
    const pastedValue = this.purchaseQuoteForm.get('originCountryId')?.value;
    if(!pastedValue){
      this.originCountryId = null;
      this.countryName = null;
    }
  }
  DestCountryBlurEvent(){
    const pastedValue = this.purchaseQuoteForm.get('destCountryId')?.value;
    if(!pastedValue){
      this.destCountryId = null;
      this.destcountryName = null;
    }
  }
  //#endregion
  //#region Approve get and open dialog window

  onApprovel() {
    this.approvalHistoryService.getAllApprovalDashboard(parseInt(this.userId$)).subscribe(result => {
      this.approvalDashboard = result;
      this.approvevalue = this.approvalDashboard.find(x => x.referenceId == this.purchaseQuotationId)
      const dialogRef = this.dialog.open(ApprovalDialogComponent, {
        data: {
          Data: this.approvevalue,
        },
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
  
        }
        else {
  
        }
        this.returnToList();
      });
    });
  }
//#endregion

}
