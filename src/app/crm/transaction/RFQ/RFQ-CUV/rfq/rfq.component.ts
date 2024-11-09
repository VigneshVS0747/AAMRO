import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { ApprovalStatusModel, CargoTypes, ModeofTransports, RfqAgainst, ShipmentTypes, Transport } from 'src/app/Models/crm/master/Dropdowns';
import { CommonService } from 'src/app/services/common.service';
import { EnquiryService } from '../../../Enquiry/enquiry.service';
import { EnqCommodity, EnqIncoTerm, Enquiry, EnquiryCombine } from 'src/app/Models/crm/master/transactions/Enquiry';
import { RfqService } from '../../rfq.service';
import { rfqagainstLineItem } from 'src/app/Models/crm/master/transactions/RFQ/RfqLineitem';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { JobCategory, JobTypeGeneral, JTModeofTransport } from 'src/app/crm/master/jobtype/jobtypemodel.model';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { City } from 'src/app/Models/ums/city.model';
import { TrailerType } from 'src/app/Models/crm/master/trailerType';
import { ContainerType } from 'src/app/crm/master/containertype/containertype.model';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { Reason } from 'src/app/Models/crm/master/Reason';
import { UOM } from 'src/app/crm/master/unitofmeasure/unitofmeasure.model';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { TrailerTypeService } from 'src/app/crm/master/trailer-type/trailer-type.service';
import { ContainerTypeService } from 'src/app/crm/master/containertype/containertype.service';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { InfosourceService } from 'src/app/crm/master/infosource/infosource.service';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { UOMsService } from 'src/app/crm/master/unitofmeasure/unitofmeasure.service';
import { MatDialog } from '@angular/material/dialog';
import { packagetypeService } from 'src/app/crm/master/packagetype/packagetype.service';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { EnqPackage } from 'src/app/Models/crm/master/transactions/EnquiryPackage';
import { Documents } from 'src/app/Models/crm/master/documents';
import { PackageType } from 'src/app/crm/master/packagetype/packagetype.model';
import { RFQcombine, RfqCommodity, RfqDocument, RfqIncoTerm, RfqPackage, Rfqtransportmode, VendorAddressList, VendorContactList, vendorfilterList } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { RfqpackageComponent } from '../../RFQPackage-dialog/rfqpackage/rfqpackage.component';
import Swal from 'sweetalert2';
import { VendorfilterdialogComponent } from '../../vendorfilterdialog/vendorfilterdialog.component';
import { RfqaddressdialogComponent } from '../../rfqaddressdialog/rfqaddressdialog.component';
import { RfqvendorcontactdialogComponent } from '../../rfqvendorcontactdialog/rfqvendorcontactdialog.component';
import { EnquiryStatus } from 'src/app/Models/crm/master/transactions/Enquirystatus';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { environment } from 'src/environments/environment.development';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { saveAs } from 'file-saver';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { RegionService } from 'src/app/services/qms/region.service';
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
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css', '../../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RfqComponent implements OnInit {
  RfqForm: FormGroup;
  RfqgeneralForm: FormGroup;
  IncoForm: FormGroup;
  TransportForm: FormGroup;
  CommodityForm: FormGroup;
  ContactForm: FormGroup;
  showAddRow: boolean;
  RFQDoc: FormGroup;
  filteredRfqAgainst: Observable<RfqAgainst[]> | undefined;
  filteredRefNumberIds: Observable<any[]> | undefined;
  filteredLineItems: Observable<LineItemMaster[]> | undefined;
  filteredJobCategories: Observable<JobCategory[]> | undefined;
  filteredJobTypes: Observable<JobTypeGeneral[]> | undefined;
  potentialvendor: string = 'Potential Vendor';

  //
  filteredOriginCountries: Observable<Country[]> | undefined;

  filteredDestCountries: Observable<Country[]> | undefined;

  filteredOriginLocations: Observable<City[]> | undefined;

  filteredDestLocations: Observable<City[]> | undefined;

  filteredTrailerTypes: Observable<TrailerType[]> | undefined;

  filteredTransportTypes: Observable<Transport[]> | undefined;

  filteredLoadingPorts: Observable<any[]> | undefined;

  filteredDestinationPorts: Observable<any[]> | undefined;

  filteredShipmentTypes: Observable<ShipmentTypes[]> | undefined;

  filteredContainerTypes: Observable<ContainerType[]> | undefined;
  filteredStatuses: Observable<any[]> | undefined;

  filteredCargoTypes: Observable<CargoTypes[]> | undefined;

  filteredInformationSources: Observable<Infosource[]> | undefined;
  filtereddocumentId: Observable<Documents[]> | undefined;

  filteredReasons: Observable<Reason[]> | undefined;
  filteredStorageUoms: Observable<UOM[]> | undefined;
  RfqAgainstList: RfqAgainst[];
  SelectedRfqAgainstId: number = 0;
  enquiry: Enquiry[] = [];
  NewRefnumID: any[] = [];
  SelectedRefNumberId: number;
  rfqlineitem: any[] = [];
  showforstandalone: boolean;
  livestatus = 1;
  lineitemmaster: LineItemMaster[] = [];
  SelectedLineItemId: number;
  showEnqjob: boolean;
  standalonearray: any[] = [];
  jobCategory: JobCategory[] = [];
  jobtype: JobTypeGeneral[] = [];
  ShowgenerateRFQ: boolean;
  ShowRFQAgainst: boolean;
  SelectedJobCategoryId: number;
  Showpakageheader: boolean;
  SelectedJobTypeId: number;
  lineItemId: any;
  editingIndex: number;
  skip = 0;
  pageSize = 10;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  Filepath = environment.Fileretrive;
  allowedExtensions: string[] = ['jpg', 'png'];
  Lineform = {
    lineItemId: 0,
  }
  standaloneId: any[] = [];
  selectrfqagainsttxt: any;
  selectedrefnumbertxt: any;
  ActiveLineitems: any[] = [];


  country: Country[] = [];
  SelectedOriginCountryId: any;
  SelectedDestCountryId: any;
  city: City[] = [];
  Destcity: City[] = [];
  SelectedOriginLocationId: number | null;
  SelectedDestLocationId: number | null;
  trailer: TrailerType[] = [];
  SelectedTrailerTypeId: number;
  transType: Transport[] = [];
  SelectedTransportTypeId: number;
  airport: any[] = [];
  seapoart: any[] = [];
  PortDropDown: any[] = [];
  SelectedLoadingPortId: any;
  SelectedDestinationPortId: any;
  ShowOnlyroad: boolean;
  shipmenttype: ShipmentTypes[] = [];
  SelectedShipmentTypeId: number;
  containertype: ContainerType[] = [];
  SelectedContainerTypeId: number;
  ShowOnlysea: boolean;
  cargo: CargoTypes[] = [];
  SelectedCargoTypeId: number;
  incoterms: Incoterm[] = [];
  Comodity: Commodity[] = [];
  Infosource: Infosource[] = [];
  SelectedInformationSourceId: number;
  reason: Reason[] = [];
  SelectedReasonId: number;
  UomStorage: UOM[] = [];
  SelectedStorageUomId: number;
  RFQPackage: RfqPackage[] = [];
  EnqCommodity: EnqCommodity[] = [];
  date = new Date()
  EnqIncoTerm: EnqIncoTerm[] = [];
  document: Documents[] = [];
  package: PackageType[] = [];
  Modeoftrasport: ModeofTransports[] = [];
  disablefields: boolean;
  RfqModeoftransport: Rfqtransportmode[] = [];
  chargablepackage: boolean;
  DocRemarks: string;
  SelectedDocumentId: number;
  ImageDataArray: any[] = [];
  ImageDetailsArray: any[] = [];
  selectedDocname: string;
  RfqIncoTerm: any[] = [];
  RfqCommodity: any[] = [];
  vendorList: vendorfilterList[] = [];
  indexofAddress: number;
  vendorAddressFilterByIndex: any[] = [];
  indexofcontact: number;
  vendorcontactFilterByIndex: any[] = [];
  vendorcontact: VendorContactList[] = [];
  vendoraddress: VendorAddressList[] = [];
  vendorlist1: vendorfilterList[] = [];
  vendorcontactlist: VendorContactList[] = [];
  vendorAddresslist: VendorAddressList[] = [];
  SelectedStatusId: number;
  EnquiryStatus: any[] = [];
  selectedLineItemname: string;
  Editedvalues: any[] = [];
  selectedLineItemCategoryname: string;
  selectedLineItemCategoryId: number;
  userId$: string;
  enable: boolean = true;
  orginPortDropDown: any[];
  DestPortDropDown: any[];
  airportflag: boolean;
  seaportflag: boolean;
  showAddRowDoc: boolean;
  rfqdocument: any[] = [];
  showAddRowLineItem: any;
  standalonearraynew: any[] = [];
  oncancel: boolean;
  existLineItem: boolean;
  updatecheckstandalonearray: any[] = [];
  Editedarray: void;
  disableview: boolean = true;
  edit: boolean = false;
  navigate: string;
  disablefromnextform: boolean;
  checked: boolean;
  selectall: boolean = false;
  showbuttons: boolean;
  JobtypeModeoftans: JTModeofTransport[] = [];
  jobtypeIncoTerms: number;

  approvalStatusList: ApprovalStatusModel[];
  approvalStatusId: any;
  filteredApprovalStatusOptions$: Observable<any[]>;
  joborder: any;
  isEditDocument: boolean;
  isDraft: boolean = true;
  selectedIndex = 0;
  UnknownValueList: any[]=[];

  constructor(private lineitem: LineitemmasterService,
    private router: Router,
    private SRFQ: RfqService,
    private Cservice: CommonService,
    private Fb: FormBuilder,
    private Eservice: EnquiryService,
    private Jtype: JobtypeserviceService,
    private Country: CountriesService,
    private Strailer: TrailerTypeService,
    private ConType: ContainerTypeService,
    private Sinco: IncoTermService,
    private SCamodity: CommodityService,
    private Sinfosource: InfosourceService,
    private Sreason: ReasonService,
    private uomService: UOMsService,
    public dialog: MatDialog,
    private packagetypeServices: packagetypeService,
    private docs: DocmentsService,
    private EnqS: EnquiryService,
    private UserIdstore: Store<{ app: AppState }>,
    private RFQS: RfqService, private datePipe: DatePipe,
    private Fs: FileuploadService, private Ns: NofificationconfigurationService, private regionService: RegionService,
    private errorHandler: ApiErrorHandlerService) {
    this.fetchDropDownData();

  }

  titile: string;
  ngOnInit(): void {
    this.titile = "New RFQ";
    this.RFQform();
    this.GetUserId();
    this.RFQgenralForm();
    this.InitializeDoc();
    this.ShowRFQAgainst = true;
    this.Decider();
    //this.GetAllApprovalStatus();
    this.getAlljobOrder();
    this.getUnknownValues();

  }
  fromanotherList() {
    if (this.Eservice.Fromenq == true) {
      this.SelectedRefNumberId = this.Eservice.itemId;
      this.disablefromnextform = true;
      this.SelectedRfqAgainstId = 1;
      if (this.SelectedRfqAgainstId) {
        switch (this.SelectedRfqAgainstId) {
          case 1:
            this.getEnquirydrop();
            this.showforstandalone = false;
            this.showEnqjob = true;
            break;
          case 2:
            this.getJobOredr();
            this.showEnqjob = true;
            this.showforstandalone = false;
            break;
          case 3:
            this.showforstandalone = true;
            this.showEnqjob = false;
            this.NewRefnumID = [];
            break;
          case 4:
            alert(4);
            break;
          default:
            console.log("Default case");
        }
      }
      var fromenq = this.optionSelectedRfqAgainstId(1);
      var fromenqbase = this.optionSelectedRefNumberId(this.SelectedRefNumberId);
    }
  }
  getUnknownValues() {
    this.Cservice.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
  }
  Decider() {
    if (this.RFQS.isEdit == true && this.RFQS.isView == false) {
      this.EditMode();
      this.RFQS.isEdit = false;
      this.RFQS.isView = false
    } else if (this.RFQS.isEdit == false && this.RFQS.isView == true) {
      this.ViewMode();
      this.RFQS.isEdit = false;
      this.RFQS.isView = false;
    } else {
      this.AddMode();
      this.DefaultDoc();
    }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  AddMode() {
    this.ShowRFQAgainst = true;
    this.ShowgenerateRFQ = false;
  }

  DefaultDoc() {
    this.SRFQ.GetAllDocumentMappingByScreenId(14).subscribe(res => {
      if (res) {
        this.rfqdocument = res.map((ele: any) => {
          return {
            rfqDocumentId: 0,
            rfqId: 0,
            documentId: ele.documentId,
            documentName: '',
            remarks: '',
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            Isedit: false
          };
        });
        this.rfqdocument = [...this.rfqdocument];
        this.ImageDataArray = [...this.rfqdocument];
      }
      console.log(this.rfqdocument)
    });
  }

  EditMode() {
    if (this.RFQS.isEdit == true && this.RFQS.isView == false) {
      this.ShowgenerateRFQ = true;
      this.ShowRFQAgainst = false;
      this.disablefields = false;
      this.disableview = true;
      this.edit = true;
      this.titile = "Edit RFQ";
      var RfqID = this.RFQS.itemId;
      this.RFQS.GetAllRFQById(RfqID).subscribe(async (result: RFQcombine) => {
        this.SelectedRfqAgainstId = result.rFQs.rfqAgainst;
        this.SelectedRefNumberId = result.rFQs.refNumberId;
        this.SelectedJobCategoryId = result.rFQs.jobCategoryId;
        this.SelectedJobTypeId = result.rFQs.jobTypeId;
        this.SelectedOriginCountryId = result.rFQs.originCountryId;
        this.SelectedDestCountryId = result.rFQs.destCountryId;
        this.SelectedLoadingPortId = result.rFQs.loadingPortId;
        this.SelectedDestinationPortId = result.rFQs.destinationPortId;
        this.SelectedOriginLocationId = result.rFQs.originLocationId;
        this.SelectedDestLocationId = result.rFQs.destLocationId;
        this.SelectedTrailerTypeId = result.rFQs.trailerTypeId;
        this.SelectedTransportTypeId = result.rFQs.transportTypeId;
        this.SelectedShipmentTypeId = result.rFQs.shipmentTypeId;
        this.SelectedContainerTypeId = result.rFQs.containerTypeId;
        this.SelectedCargoTypeId = result.rFQs.cargoTypeid;
        this.SelectedStorageUomId = result.rFQs.storageUomId;
        this.SelectedStatusId = result.rFQs.statusId;
        // this.approvalStatusId = result.rFQs.approvalStatusId;

        console.log('RFQ', result.rFQs)



        this.ImageDataArray = result.rfqDocuments
        this.rfqdocument = result.rfqDocuments
        this.RFQPackage = result.rfqPackages
        this.vendorcontactlist = result.rfqVendorContacts
        //this.vendorAddresslist = result.rfqVendorAddresses
        this.RfqIncoTerm = result.rfqIncoTerms
        this.RfqCommodity = result.rfqCommoditys
        this.ActiveLineitems = result.rfqLineItems
        this.vendorList = result.rfqVendors
        this.vendorlist1 = result.rfqVendors
        this.RfqModeoftransport = result.rfqTransportModes


        this.Cservice.getAllCitiesbyCountry(result.rFQs.originCountryId).subscribe(res => {
          this.city = res
          console.log("this.city", this.city);
          this.filter();

        });





        this.Cservice.getAllCitiesbyCountry(result.rFQs.destCountryId).subscribe(res => {
          this.Destcity = res
          console.log("this.city", this.city);
          this.filter();

        });
        this.Jtype.getJobTypesByJobCatId(result.rFQs.jobCategoryId).subscribe((res => {
          this.jobtype = res;
          this.filter();

        }));


        const selectedtransportMode = this.RfqModeoftransport.map(val => val.transportModeId);
        this.RfqgeneralForm.controls['transportModeId'].setValue(selectedtransportMode);
        if (selectedtransportMode.includes(1) && selectedtransportMode.includes(3)) {
          this.airportflag = true;
          this.seaportflag = false;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();


        } else if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          this.airportflag = false;
          this.seaportflag = true;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = true
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();

          // if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          //   // Set validators for mandatory fields when statusId is 1
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
          // } else {
          //   // Remove validators if statusId is not 2
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
          // }

          // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
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
          this.seaportflag = true;
          this.fetch();
          // if (selectedtransportMode.includes(2)) {
          //   // Set validators for mandatory fields when statusId is 1
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
          // } else {
          //   // Remove validators if statusId is not 2
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
          // }

          // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true
          this.chargablepackage = true;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(4)) {
          this.airportflag = false;
          this.seaportflag = true;
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }
        else {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }




        this.RfqgeneralForm.patchValue(result.rFQs);

        this.RfqgeneralForm.controls['rfqAgainst'].setValue(result.rFQs.rfqAgainstName);
        this.RfqgeneralForm.controls['refNumberId'].setValue(result.rFQs.refNumber);
        this.RfqgeneralForm.controls['jobCategoryId'].setValue(result.rFQs.jobCategoryName);
        this.RfqgeneralForm.controls['jobTypeId'].setValue(result.rFQs.jobTypeName);

        this.RfqgeneralForm.controls['originCountryId'].setValue(result.rFQs.orgincountryName);
        this.RfqgeneralForm.controls['destCountryId'].setValue(result.rFQs.destCountryname);
        this.RfqgeneralForm.controls['originLocationId'].setValue(result.rFQs.originLocationname);
        this.RfqgeneralForm.controls['destLocationId'].setValue(result.rFQs.destLocationName);
        this.RfqgeneralForm.controls['shipmentTypeId'].setValue(result.rFQs.shipmentType);
        this.RfqgeneralForm.controls['containerTypeId'].setValue(result.rFQs.containerTypeName);
        this.RfqgeneralForm.controls['trailerTypeId'].setValue(result.rFQs.trailerTypeName);
        this.RfqgeneralForm.controls['transportTypeId'].setValue(result.rFQs.transportType);

        this.RfqgeneralForm.controls['rfqDate'].setErrors(null);
        this.RfqgeneralForm.controls['expectedQuoteDate'].setErrors(null);
        this.RfqgeneralForm.controls['cargoTypeid'].setValue(result.rFQs.cargoType);
        this.RfqgeneralForm.controls['statusId'].setValue(result.rFQs.statusname);
        //this.RfqgeneralForm.controls['approvalStatusId'].setValue(result.rFQs);

        this.RfqgeneralForm.controls['temperatureReq'].setValue(result.rFQs.temperatureReq);
        this.RfqgeneralForm.controls['storageUomId'].setValue(result.rFQs.storageUomName);
        this.RfqgeneralForm.controls['updatedBy'].setValue(1);

        const selectedCommodity = this.RfqCommodity.map(val => val.commodityId);
        this.RfqgeneralForm.controls['commodityId'].setValue(selectedCommodity);

        const selectedIncoTerm = this.RfqIncoTerm.map(val => val.incoTermId);
        this.RfqgeneralForm.controls['incoTermId'].setValue(selectedIncoTerm);





        var setheader = this.optionSelectedJobCategoryId(result.rFQs.jobCategoryId);

      });


    }

  }
  fetch() {

    const orginair$ = this.Cservice.GetAllAirportByCountryId(this.SelectedOriginCountryId);
    const destair$ = this.Cservice.GetAllAirportByCountryId(this.SelectedDestCountryId);
    const orginsea$ = this.Cservice.GetAllSeaportByCountryId(this.SelectedOriginCountryId);
    const destsea$ = this.Cservice.GetAllSeaportByCountryId(this.SelectedDestCountryId);



    forkJoin([orginair$, destair$, orginsea$, destsea$]).subscribe({
      next: ([orginairs, destair, orginsea, destsea]) => {
        if (this.airportflag) {
          this.airport = orginairs
          const air = this.airport.map(res => {
            return {
              ...res,
              Id: res.airportId,
              name: res.airportName
            };
          });
          this.orginPortDropDown = [...air];

          this.filteredLoadingPorts = this.RfqgeneralForm.get('loadingPortId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterLoadingPorts(name) : this.orginPortDropDown?.slice()))
          );

          this.airport = destair

          const airs = this.airport.map(res => {
            return {
              ...res,
              Id: res.airportId,
              name: res.airportName
            };
          });
          this.DestPortDropDown = [...airs];

          this.filteredDestinationPorts = this.RfqgeneralForm.get('destinationPortId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterDestinationPorts(name) : this.DestPortDropDown?.slice()))
          );
          var setloadingPortId = this.optionSelectedLoadingPortId(this.SelectedLoadingPortId);
          this.RfqgeneralForm.controls['loadingPortId'].setValue(setloadingPortId);
          var setdestinationPortId = this.optionSelectedDestinationPortId(this.SelectedDestinationPortId);
          this.RfqgeneralForm.controls['destinationPortId'].setValue(setdestinationPortId);
        } else {
          this.seapoart = orginsea
          const sea = this.seapoart.map(res => {
            return {
              ...res,
              Id: res.seaportId,
              name: res.seaportName
            };
          });
          this.orginPortDropDown = [...sea];
          this.filteredLoadingPorts = this.RfqgeneralForm.get('loadingPortId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterLoadingPorts(name) : this.orginPortDropDown?.slice()))
          );
          this.seapoart = destsea
          const seas = this.seapoart.map(res => {
            return {
              ...res,
              Id: res.seaportId,
              name: res.seaportName
            };
          });
          this.DestPortDropDown = [...seas];
          this.filteredDestinationPorts = this.RfqgeneralForm.get('destinationPortId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterDestinationPorts(name) : this.DestPortDropDown?.slice()))
          );
        }
        var setloadingPortId = this.optionSelectedLoadingPortId(this.SelectedLoadingPortId);
        this.RfqgeneralForm.controls['loadingPortId'].setValue(setloadingPortId);
        var setdestinationPortId = this.optionSelectedDestinationPortId(this.SelectedDestinationPortId);
        this.RfqgeneralForm.controls['destinationPortId'].setValue(setdestinationPortId);
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }
  ViewMode() {
    if (this.RFQS.isEdit == false && this.RFQS.isView == true) {
      this.ShowgenerateRFQ = true;
      this.ShowRFQAgainst = false;
      this.disablefields = true;
      this.disableview = false;
      this.titile = "View RFQ";
      var RfqID = this.RFQS.itemId;
      this.RFQS.GetAllRFQById(RfqID).subscribe(async (result: RFQcombine) => {

        console.log("result------>", result);

        this.Jtype.getJobTypesByJobCatId(result.rFQs.jobCategoryId).subscribe((res => {
          this.jobtype = res;
          this.filter();
        }));



        this.SelectedRfqAgainstId = result.rFQs.rfqAgainst;
        this.SelectedRefNumberId = result.rFQs.refNumberId;
        this.SelectedJobCategoryId = result.rFQs.jobCategoryId;
        this.SelectedJobTypeId = result.rFQs.jobTypeId;
        this.SelectedOriginCountryId = result.rFQs.originCountryId;
        this.SelectedDestCountryId = result.rFQs.destCountryId;
        this.SelectedLoadingPortId = result.rFQs.loadingPortId;
        this.SelectedDestinationPortId = result.rFQs.destinationPortId;
        this.SelectedOriginLocationId = result.rFQs.originLocationId;
        this.SelectedDestLocationId = result.rFQs.destLocationId;
        this.SelectedTrailerTypeId = result.rFQs.trailerTypeId;
        this.SelectedTransportTypeId = result.rFQs.transportTypeId;
        this.SelectedShipmentTypeId = result.rFQs.shipmentTypeId;
        this.SelectedContainerTypeId = result.rFQs.containerTypeId;
        this.SelectedCargoTypeId = result.rFQs.cargoTypeid;
        this.SelectedStorageUomId = result.rFQs.storageUomId;
        this.SelectedStatusId = result.rFQs.statusId;
        //this.approvalStatusId=result.rFQs.approvalStatusId;

        this.ImageDataArray = result.rfqDocuments
        this.rfqdocument = result.rfqDocuments
        this.RFQPackage = result.rfqPackages
        this.vendorcontactlist = result.rfqVendorContacts
        //this.vendorAddresslist = result.rfqVendorAddresses
        this.RfqIncoTerm = result.rfqIncoTerms
        this.RfqCommodity = result.rfqCommoditys
        this.ActiveLineitems = result.rfqLineItems
        this.vendorList = result.rfqVendors
        this.vendorlist1 = result.rfqVendors
        this.RfqModeoftransport = result.rfqTransportModes

        const selectedtransportMode = this.RfqModeoftransport.map(val => val.transportModeId);
        this.RfqgeneralForm.controls['transportModeId'].setValue(selectedtransportMode);
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

          // if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          //   // Set validators for mandatory fields when statusId is 1
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
          // } else {
          //   // Remove validators if statusId is not 2
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
          // }

          // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
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
          // if (selectedtransportMode.includes(2)) {
          //   // Set validators for mandatory fields when statusId is 1
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
          // } else {
          //   // Remove validators if statusId is not 2
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
          // }

          // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true
          this.chargablepackage = true;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();
        }
        else {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
        }


        this.RfqgeneralForm.patchValue(result.rFQs);
        this.Cservice.getAllCitiesbyCountry(result.rFQs.originCountryId).subscribe(res => {
          this.city = res
          console.log("this.city", this.city);
          this.filter();
        });
        this.Cservice.getAllCitiesbyCountry(result.rFQs.destCountryId).subscribe(res => {
          this.Destcity = res
          console.log("this.city", this.city);
          this.filter();
        });

        this.RfqgeneralForm.controls['rfqAgainst'].setValue(result.rFQs.rfqAgainstName);
        this.RfqgeneralForm.controls['refNumberId'].setValue(result.rFQs.refNumber);
        this.RfqgeneralForm.controls['jobCategoryId'].setValue(result.rFQs.jobCategoryName);
        this.RfqgeneralForm.controls['jobTypeId'].setValue(result.rFQs.jobTypeName);
        this.RfqgeneralForm.controls['rfqDate'].setErrors(null);
        this.RfqgeneralForm.controls['expectedQuoteDate'].setErrors(null);
        this.RfqgeneralForm.controls['originCountryId'].setValue(result.rFQs.orgincountryName);
        this.RfqgeneralForm.controls['destCountryId'].setValue(result.rFQs.destCountryname);
        this.RfqgeneralForm.controls['originLocationId'].setValue(result.rFQs.originLocationname);
        this.RfqgeneralForm.controls['destLocationId'].setValue(result.rFQs.destLocationName);
        this.RfqgeneralForm.controls['shipmentTypeId'].setValue(result.rFQs.shipmentType);
        this.RfqgeneralForm.controls['containerTypeId'].setValue(result.rFQs.containerTypeName);
        this.RfqgeneralForm.controls['trailerTypeId'].setValue(result.rFQs.trailerTypeName);
        this.RfqgeneralForm.controls['transportTypeId'].setValue(result.rFQs.transportType);


        this.RfqgeneralForm.controls['cargoTypeid'].setValue(result.rFQs.cargoType);
        this.RfqgeneralForm.controls['statusId'].setValue(result.rFQs.statusname);
        //this.RfqgeneralForm.controls['approvalStatusId'].setValue(result.rFQs);
        this.RfqgeneralForm.controls['temperatureReq'].setValue(result.rFQs.temperatureReq);
        this.RfqgeneralForm.controls['updatedBy'].setValue(1);

        const selectedCommodity = this.RfqCommodity.map(val => val.commodityId);
        this.RfqgeneralForm.controls['commodityId'].setValue(selectedCommodity);

        const selectedIncoTerm = this.RfqIncoTerm.map(val => val.incoTermId);
        this.RfqgeneralForm.controls['incoTermId'].setValue(selectedIncoTerm);

        var setloadingPortId = this.optionSelectedLoadingPortId(result.rFQs.loadingPortId);
        this.RfqgeneralForm.controls['loadingPortId'].setValue(setloadingPortId);
        var setdestinationPortId = this.optionSelectedDestinationPortId(result.rFQs.destinationPortId);
        this.RfqgeneralForm.controls['destinationPortId'].setValue(setdestinationPortId);
        var setheader = this.optionSelectedJobCategoryId(result.rFQs.jobCategoryId)
      });

    }

  }

  optionSelectedJobCategoryId(id: number): string {
    const SelectedJobCategoryId = id;
    this.SelectedJobCategoryId = id;
    const selectedPort = this.jobCategory.find(
      (port) => port.jobCategoryId === id
    );
    if (SelectedJobCategoryId) {
      switch (SelectedJobCategoryId) {
        case 1:
          this.Showpakageheader = false;
          break;
        case 2:
          this.Showpakageheader = true;
          break;
        case 3:
          this.Showpakageheader = false;
          break;
        default:
          console.log("Default case");
      }
    }
    return selectedPort ? selectedPort.jobCategory : '';

  }
  editCell(index: number) {
    this.Editedvalues = this.standalonearray[index];
    this.editingIndex = index;
    this.showAddRow = false;
  }

  optionSelectedLoadingPortId(id: number): string {
    this.SelectedLoadingPortId = id;
    const selectedPort = this.orginPortDropDown.find(
      (port) => port.Id === id
    );
    return selectedPort ? selectedPort.name : '';
  }

  optionSelectedDestinationPortId(id: number): string {
    this.SelectedDestinationPortId = id;
    const selectedPort = this.DestPortDropDown.find(
      (port) => port.Id === id
    );
    return selectedPort ? selectedPort.name : '';
  }
  Downloads() {

  }
  Download(file: any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }
  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({ skip: skip, take: take });
    this.isEditDocument = false;
    this.RFQDoc.controls['documentId'].reset();
    if (!this.showAddRowDoc) {
      const Value = {
        ...this.RFQDoc.value,
        documentName: "",
        remarks: this.DocRemarks,
        documentId: this.SelectedDocumentId,
        createdBy: 1,
        createdDate: this.date,
        Isedit: true
      }
      //this.ImageDataArray.push(Value);
      this.rfqdocument = [Value, ...this.rfqdocument];
      this.showAddRowDoc = true;
    }

    //this.showtable = false;
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  fetchDropDownData() {
    const RFQagainst$ = this.Cservice.GetAllRfqAgainst();
    const Enquiry$ = this.Eservice.GetOpenEnquiry();
    const lineiten$ = this.lineitem.GetAllLineItemMaster(this.livestatus);
    const Modeoftrns$ = this.Cservice.getAllModeofTransport();
    const Jobtypecat$ = this.Jtype.GetAllJobCategory();
    const Jobtype$ = this.Jtype.getAllActiveJobTypes();
    const Country$ = this.Country.getAllCountries(this.livestatus);
    //const City$ = this.Cservice.getAllCity(this.livestatus);
    const trailer$ = this.Strailer.GetAllTrailerType(this.livestatus);
    const trnstype$ = this.Cservice.getAllTransportType();
    const Shipmenttype$ = this.Cservice.GetAllShipmentTypes();
    const Containertype$ = this.ConType.getAllActiveContainerType();
    const cargo$ = this.Cservice.getAllCargo();
    const Incoterms$ = this.Sinco.getIncoterms(this.livestatus);
    const Comodity$ = this.SCamodity.getAllActiveCommodity();
    const Infosource$ = this.Sinfosource.getInfosource(this.livestatus);
    const Reason$ = this.Sreason.getAllReason(this.livestatus);
    const UomStorage$ = this.uomService.getAllActiveUOM();
    const Package$ = this.packagetypeServices.getAllActivePackagetype()
    const Doc$ = this.docs.getDocuments(this.livestatus);
    const Airport$ = this.Cservice.getAllAirport(this.livestatus);
    const Allsea$ = this.Cservice.getAllSeaport(this.livestatus);
    const Enquirystat$ = this.Cservice.GetAllRfqstatus();




    forkJoin([Modeoftrns$, Allsea$, Airport$, Package$, Doc$, Reason$, UomStorage$, Infosource$, Comodity$, Incoterms$, cargo$, Containertype$, Shipmenttype$, trnstype$, trailer$, Country$, Enquiry$, RFQagainst$, lineiten$, Jobtypecat$, Jobtype$, Enquirystat$]).subscribe({
      next: ([Modeoftrns, Allsea, Airport, Package, Doc, Reason, UomStorage, Infosource, Comodity, Incoterms, cargo, Containertype, Shipmenttype, trnstype, trailer, Country, Enquiry, RFQagainst, lineiten, Jobtypecat, Jobtype, Enquirystat]) => {
        this.Modeoftrasport = Modeoftrns
        this.enquiry = Enquiry;
        this.RfqAgainstList = RFQagainst;
        this.lineitemmaster = lineiten;
        this.jobCategory = Jobtypecat;
        this.jobtype = Jobtype;
        this.country = Country
        //this.city = City
        this.trailer = trailer

        this.transType = trnstype

        this.shipmenttype = Shipmenttype

        this.containertype = Containertype

        this.cargo = cargo

        this.incoterms = Incoterms

        this.Comodity = Comodity

        this.Infosource = Infosource
        this.package = Package
        this.document = Doc
        this.airport = Airport;
        this.seapoart = Allsea;
        this.reason = Reason;
        this.UomStorage = UomStorage
        this.EnquiryStatus = Enquirystat;

        if (this.EnquiryStatus) {
          const value = this.EnquiryStatus.find(obj => obj.rfqStatus == 'Draft')
          this.RfqgeneralForm.controls['statusId'].setValue(value.rfqStatus);
          this.SelectedStatusId = value?.rfqStatusId;
        }
      

        this.EditMode();
        this.ViewMode();
        this.filter();
        this.fromanotherList();
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  RFQform() {
    this.RfqForm = this.Fb.group({
      rfqAgainstId: ["", Validators.required],
      refNumberId: [""],
      jobTypeId: [""],
      lineItemId: [""],
    });

  }

  RFQgenralForm() {
    const currentDate = new Date();
    this.RfqgeneralForm = this.Fb.group({
      rfqId: [0],
      rfqNumber: [{ value: '', disabled: true }],
      rfqDate: [currentDate, [Validators.required]],
      rfqAgainst: [{ value: '', disabled: true }, Validators.required],
      refNumberId: [{ value: null, disabled: true }],
      expectedQuoteDate: [null],
      remarks: [null],
      tags: [null],
      jobCategoryId: [{ value: null, disabled: true }],
      jobTypeId: [{ value: null, disabled: true }],
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
      cargoTypeid: [null],
      statusId: [null],
      //approvalStatusId:[null],
      commodityId: [null],
      incoTermId: [null],
      transportModeId: [null],
      vendorRemarks: [null],
      temperatureReq: [null],
      storageUomId: [null],
      valuePerUom: [null],
      packageNos: [null],
      createdBy: parseInt(this.userId$),
      createdDate: this.date,
      updatedBy: parseInt(this.userId$),
      updatedDate: this.date
    });
  }

  //#region approval status
  // GetAllApprovalStatus() {
  //   this.Cservice.GetAllApprovalStatus().subscribe(result => {
  //     this.approvalStatusList = result;
  //     const value = this.approvalStatusList.find(obj => obj.approvalStatusId == 1)
  //     this.RfqgeneralForm.controls['approvalStatusId'].setValue(value);
  //     this.approvalStatusId = 1;
  //     this.ApprovalStatusFun();
  //   })
  // }
  // ApprovalStatusFun() {
  //   this.filteredApprovalStatusOptions$ = this.RfqgeneralForm.controls['approvalStatusId'].valueChanges.pipe(
  //     startWith(''),
  //     map((value: any) => (typeof value === 'string' ? value : value?.approvalStatus)),
  //     map((name: any) => (name ? this.filteredApprovalStatusOptions(name) : this.approvalStatusList?.slice()))
  //   );
  // }
  // private filteredApprovalStatusOptions(name: string): any[] {
  //   const filterValue = name.toLowerCase();
  //   const results = this.approvalStatusList.filter((option: any) => option.approvalStatus.toLowerCase().includes(filterValue));
  //   return results.length ? results : this.NoDataApprovalStatus();
  // }
  // NoDataApprovalStatus(): any {
  //   this.RfqgeneralForm.controls['approvalStatusId'].setValue('');
  //   return this.approvalStatusList;
  // }
  // displayApprovalStatusLabelFn(data: any): string {
  //   return data && data.approvalStatus ? data.approvalStatus : '';
  // }
  // selectApprovalStatus(data: any) {
  //   let selectedValue = data.option.value;
  //   this.approvalStatusId = selectedValue.approvalStatusId;
  // }

  optionSelectedRfqAgainst(event: MatAutocompleteSelectedEvent): void {

    const selectedRfq = this.RfqAgainstList.find(
      (rfq) => rfq.rfqAgainst === event.option.viewValue
    );
    if (selectedRfq) {
      const selectedRfqId = selectedRfq.rfqAgainstId;
      this.SelectedRfqAgainstId = selectedRfqId;
      this.selectrfqagainsttxt = selectedRfq.rfqAgainst
    }
    if (this.SelectedRfqAgainstId) {
      switch (this.SelectedRfqAgainstId) {
        case 1:
          this.getEnquirydrop();
          this.showforstandalone = false;
          this.showEnqjob = true;
          break;
        case 2:
          this.getJobOredr();
          this.showEnqjob = true;
          this.showforstandalone = false;
          break;
        case 3:
          this.showforstandalone = true;
          this.showEnqjob = false;
          this.NewRefnumID = [];
          break;
        case 4:
          alert(4);
          break;
        default:
          console.log("Default case");
      }
    }
  }
  optionSelectedRefNumber(event: MatAutocompleteSelectedEvent): void {
    const selectedRefNumber = this.NewRefnumID.find(
      (ref) => ref.code === event.option.viewValue
    );
    if (selectedRefNumber) {
      const selectedRefNumberId = selectedRefNumber.Id;
      this.SelectedRefNumberId = selectedRefNumberId;
      this.selectedrefnumbertxt = selectedRefNumber.code;
    }
    if (this.SelectedRfqAgainstId == 1) {
      const RFQagainst = {
        ...this.RfqForm.value,
        rfqAgainstId: this.SelectedRfqAgainstId,
        refNumberId: this.SelectedRefNumberId

      }
      this.SRFQ.GetRfqAgainst(RFQagainst).subscribe((res) => {
        this.rfqlineitem = res;
      });
    }
    if (this.SelectedRfqAgainstId == 2) {
      const RFQagainst = {
        ...this.RfqForm.value,
        rfqAgainstId: this.SelectedRfqAgainstId,
        refNumberId: this.SelectedRefNumberId

      }
      this.regionService.GetJobOrderById(this.SelectedRefNumberId).subscribe((res: any) => {
        this.rfqlineitem = res.joLineItem;
        console.log("this.rfqlineitem", this.rfqlineitem);
      });
    }



  }

  FromEnquiry(id: number) {
    this.EnqS.GetAllEnquiryById(id)
      .subscribe(async (result: EnquiryCombine) => {
        console.log("result------->", result);
        this.Cservice.getAllCitiesbyCountry(result.enquiryGeneral.originCountryId).subscribe(res => {
          this.city = res
          console.log("this.city", this.city);
          const selectedLocation = this.city.find(
            (location) => location.cityId === this.SelectedOriginLocationId
          );
          this.RfqgeneralForm.controls["originLocationId"].setValue(selectedLocation?.cityName)
          console.log("this.city", this.city);
          this.filter();

        });

        this.Cservice.getAllCitiesbyCountry(result.enquiryGeneral.destCountryId).subscribe(res => {
          this.Destcity = res
          console.log("this.city", this.city);
          const selectedLocation = this.Destcity.find(
            (location) => location.cityId === this.SelectedDestLocationId
          );
          this.RfqgeneralForm.controls["destLocationId"].setValue(selectedLocation?.cityName)
          this.filter();

        });
        this.Jtype.getJobTypesByJobCatId(result.enquiryGeneral.jobCategoryId).subscribe((res => {
          this.jobtype = res;
          this.SelectedJobTypeId = result.enquiryGeneral.jobTypeId;
          const selectedPort = this.jobtype.find(
            (port) => port.jobTypeId === this.SelectedJobTypeId
          );
          this.RfqgeneralForm.controls["jobTypeId"].setValue(selectedPort?.jobTypeName);
          // this.Jtype.getAllJopTypeById(this.SelectedJobTypeId).subscribe((res)=>{
          //   this.JobtypeModeoftans = res.jtModeofTransport;
          //   var modeoftrns = this.JobtypeModeoftans.map(id=>id.modeofTransportId);
          //   this.RfqgeneralForm.controls["transportModeId"].setValue(modeoftrns);
          //   this.onSelectModeoftrns();
          //   this.jobtypeIncoTerms = res.jobTypeGeneral.incoTermId;
          //   this.RfqgeneralForm.controls["incoTermId"].setValue([this.jobtypeIncoTerms]);
          //   this.onSelectInco();
          //  });
          this.filter();

        }));
        this.RfqgeneralForm.controls['transportModeId'].setValue([result.enquiryGeneral.modeofTransportId]);
        this.RfqgeneralForm.patchValue({

          jobCategoryId: this.optionSelectedJobCategoryId(result.enquiryGeneral.jobCategoryId),
          informationSourceId: this.optionSelectedInformationSourceId(result.enquiryGeneral.informationSourceId),
          //salesFunnelId: this.optionSelectedSalesFunnelId(result.enquiryGeneral.salesFunnelId),
          //expectedClosingDate: result.enquiryGeneral.expectedClosingDate,
          statusId: this.optionSelectedStatusId(result.enquiryGeneral.statusId),
          originCountryId: this.optionSelectedOriginCountryId(result.enquiryGeneral.originCountryId),
          destCountryId: this.optionSelectedDestCountryId(result.enquiryGeneral.destCountryId),
          //originLocationId: this.optionSelectedOriginLocationId(result.enquiryGeneral.originLocationId),
          //destLocationId: this.optionSelectedDestLocationId(result.enquiryGeneral.destLocationId),
          trailerTypeId: this.optionSelectedTrailerTypeId(result.enquiryGeneral.trailerTypeId),
          transportTypeId: this.optionSelectedTransportTypeId(result.enquiryGeneral.transportTypeId),
          pickUpLocation: result.enquiryGeneral.pickUpLocation,
          deliveryPlace: result.enquiryGeneral.deliveryPlace,
          shipmentTypeId: this.optionSelectedShipmentTypeId(result.enquiryGeneral.shipmentTypeId),
          containerTypeId: this.optionSelectedContainerTypeId(result.enquiryGeneral.containerTypeId),
          cargoTypeid: this.optionSelectedCargoTypeId(result.enquiryGeneral.cargoTypeid),
          incoTermId: result.incoTerms.map(id => id.incoTermId),
          temperatureReq: result.enquiryGeneral.temperatureReq,
          remarks: result.enquiryGeneral.remarks,
          commodityId: result.commodity.map(id => id.commodityId),
          //modeofTransport: result.enqTransportModes.map(id=>id.transportModeId),
          //ModeId: this.optionSelectedModeofTransportId(result.enquiryGeneral.modeofTransportId),
          storageUomId: this.optionSelectedStorageUomId(result.enquiryGeneral.storageUomId),
          valuePerUom: result.enquiryGeneral.valuePerUom,
          packageNos: result.enquiryGeneral.packageNos
        });
        var trans = result.enqTransportModes.map(id => id.transportModeId);
        this.RfqgeneralForm.controls["transportModeId"].setValue(trans);
        this.onSelectModeoftrns();
        this.SelectedLoadingPortId = result.enquiryGeneral.loadingPortId
        this.SelectedDestinationPortId = result.enquiryGeneral.destinationPortId
        this.SelectedOriginLocationId = result.enquiryGeneral.originLocationId
        this.SelectedDestLocationId = result.enquiryGeneral.destLocationId
        //this.fetch();
        this.RfqIncoTerm = result.incoTerms
        this.RfqCommodity = result.commodity
        result.documents.map(enqdoc => {
          let rfqdoc: RfqDocument = {
            rfqDocumentId: 0,
            rfqId: 0,
            documentId: enqdoc.documentId,
            documentName: enqdoc.documentName,
            docname: '',
            remarks: enqdoc.remarks,
            createdBy: enqdoc.createdBy,
            createdDate: enqdoc.createdDate
          }
          this.rfqdocument.push(rfqdoc);
          this.ImageDataArray.push(rfqdoc);
          this.rfqdocument = [...this.rfqdocument];
        })

        result.package.map(enqPackage => {
          let RfqPackage: RfqPackage = {
            RfqPackageId: 0,
            RfqId: 0,
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
            packageTypeName: '',
            commodityName: ''
          }
          this.Comodity.forEach(ele => {
            if (RfqPackage.commodityId == ele.commodityId) {
              RfqPackage.commodityName = ele.commodityName
            }
          })
          this.package.forEach(ele => {
            if (RfqPackage.packageTypeId == ele.packageTypeId) {
              RfqPackage.packageTypeName = ele.packageTypeName
            }
          })
          this.RFQPackage.push(RfqPackage);
        });
      });


  }




  FromJOB(id: number) {
    this.regionService.GetJobOrderById(id)
      .subscribe(async (result: any) => {
        console.log("result------->", result);
        this.Cservice.getAllCitiesbyCountry(result.joGeneral.originCountryId).subscribe(res => {
          this.city = res
          console.log("this.city", this.city);
          const selectedLocation = this.city.find(
            (location) => location.cityId === this.SelectedOriginLocationId
          );
          this.RfqgeneralForm.controls["originLocationId"].setValue(selectedLocation?.cityName)
          console.log("this.city", this.city);
          this.filter();

        });

        this.Cservice.getAllCitiesbyCountry(result.joGeneral.destCountryId).subscribe(res => {
          this.Destcity = res
          console.log("this.city", this.city);
          const selectedLocation = this.Destcity.find(
            (location) => location.cityId === this.SelectedDestLocationId
          );
          this.RfqgeneralForm.controls["destLocationId"].setValue(selectedLocation?.cityName)
          this.filter();

        });
        this.Jtype.getJobTypesByJobCatId(result.joGeneral.jobCategoryId).subscribe((res => {
          this.jobtype = res;
          this.SelectedJobTypeId = result.joGeneral.jobTypeId;
          const selectedPort = this.jobtype.find(
            (port) => port.jobTypeId === this.SelectedJobTypeId
          );
          this.RfqgeneralForm.controls["jobTypeId"].setValue(selectedPort?.jobTypeName);
          // this.Jtype.getAllJopTypeById(this.SelectedJobTypeId).subscribe((res)=>{
          //   this.JobtypeModeoftans = res.jtModeofTransport;
          //   var modeoftrns = this.JobtypeModeoftans.map(id=>id.modeofTransportId);
          //   this.RfqgeneralForm.controls["transportModeId"].setValue(modeoftrns);
          //   this.onSelectModeoftrns();
          //   this.jobtypeIncoTerms = res.jobTypeGeneral.incoTermId;
          //   this.RfqgeneralForm.controls["incoTermId"].setValue([this.jobtypeIncoTerms]);
          //   this.onSelectInco();
          //  });
          this.filter();

        }));
        this.RfqgeneralForm.controls['transportModeId'].setValue([result.joGeneral.modeofTransportId]);
        this.RfqgeneralForm.patchValue({

          jobCategoryId: this.optionSelectedJobCategoryId(result.joGeneral.jobCategoryId),
          //informationSourceId: this.optionSelectedInformationSourceId(result.enquiryGeneral.informationSourceId),
          //salesFunnelId: this.optionSelectedSalesFunnelId(result.enquiryGeneral.salesFunnelId),
          //expectedClosingDate: result.enquiryGeneral.expectedClosingDate,
          //statusId: this.optionSelectedStatusId(result.enquiryGeneral.statusId),
          originCountryId: this.optionSelectedOriginCountryId(result.joGeneral.originCountryId),
          destCountryId: this.optionSelectedDestCountryId(result.joGeneral.destCountryId),
          //originLocationId: this.optionSelectedOriginLocationId(result.enquiryGeneral.originLocationId),
          //destLocationId: this.optionSelectedDestLocationId(result.enquiryGeneral.destLocationId),
          trailerTypeId: this.optionSelectedTrailerTypeId(result.joGeneral.trailerTypeId),
          transportTypeId: this.optionSelectedTransportTypeId(result.joGeneral.transportTypeId),
          pickUpLocation: result.joGeneral.pickUpLocation,
          deliveryPlace: result.joGeneral.deliveryPlace,
          shipmentTypeId: this.optionSelectedShipmentTypeId(result.joGeneral.shipmentTypeId),
          containerTypeId: this.optionSelectedContainerTypeId(result.joGeneral.containerTypeId),
          cargoTypeid: this.optionSelectedCargoTypeId(result.joGeneral.cargoTypeid),
          incoTermId: this.RfqgeneralForm.controls['incoTermId'].setValue([result.joGeneral.incoTermId]),
          temperatureReq: result.joGeneral.temperatureReq,
          remarks: result.joGeneral.remarks,
          commodityId: result.joCommodity.map((id: { commodityId: any; }) => id.commodityId),
          //modeofTransport: result.enqTransportModes.map(id=>id.transportModeId),
          //ModeId: this.optionSelectedModeofTransportId(result.enquiryGeneral.modeofTransportId),
          //storageUomId: this.optionSelectedStorageUomId(result.enquiryGeneral.storageUomId),
          // valuePerUom: result.enquiryGeneral.valuePerUom,
          packageNos: result.joGeneral.packageNos
        });
        var trans = result.joTransportMode.map((id: { transportModeId: any; }) => id.transportModeId);
        this.RfqgeneralForm.controls["transportModeId"].setValue(trans);
        this.onSelectModeoftrns();
        this.SelectedLoadingPortId = result.joGeneral.loadingPortId
        this.SelectedDestinationPortId = result.joGeneral.destinationPortId
        this.SelectedOriginLocationId = result.joGeneral.originLocationId
        this.SelectedDestLocationId = result.joGeneral.destLocationId
        //this.fetch();
        this.RfqIncoTerm = result.incoTerms
        this.RfqCommodity = result.joCommodity
        // result.documents.map((enqdoc: { documentId: any; documentName: any; remarks: any; createdBy: any; createdDate: any; }) => {
        //   let rfqdoc: RfqDocument = {
        //     rfqDocumentId: 0,
        //     rfqId: 0,
        //     documentId: enqdoc.documentId,
        //     documentName: enqdoc.documentName,
        //     docname: '',
        //     remarks: enqdoc.remarks,
        //     createdBy: enqdoc.createdBy,
        //     createdDate: enqdoc.createdDate
        //   }
        //   this.rfqdocument.push(rfqdoc);
        //   this.ImageDataArray.push(rfqdoc);
        //   this.rfqdocument = [...this.rfqdocument];
        // })

        result.joPackage.forEach((joPackages: { packageTypeId: any; commodityId: any; height: any; length: any; breadth: any; cbm: any; packWeightKg: any; chargePackWtKg: any; packageTypeName: any; commodityName: any; }) => {
          let joPackage: RfqPackage = {
            RfqPackageId: 0,
            RfqId: 0,
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

          this.RFQPackage.push(joPackage);
        });
      });


  }
  optionSelectedStorageUomId(id: number): string {
    this.SelectedStorageUomId = id;
    const selectedUom = this.UomStorage.find(
      (uom) => uom.uomId === id
    );
    return selectedUom ? selectedUom.uomName : '';
  }

  ///Edit from Enquiry//

  optionSelectedModeofTransportId(id: number) {
    if (id != null) {
      switch (id) {
        case 1:
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = false;
          this.chargablepackage = false
          break;
        case 2:
          this.airportflag = false;
          this.fetch();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true;
          this.chargablepackage = true
          break;
        case 3:
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false;
          this.chargablepackage = false
          break;
        default:
          console.log("Default case");
      }

    }
  }

  optionSelectedStatusId(id: number): string {
    this.SelectedStatusId = id;
    const selectedStatus = this.EnquiryStatus.find(
      (status) => status.rfqStatusId === id
    );
    return selectedStatus ? selectedStatus.rfqStatus : '';
  }

  optionSelectedOriginCountryId(id: number): string {
    this.SelectedOriginCountryId = id;
    const selectedCountry = this.country.find(
      (country) => country.countryId === id
    );
    return selectedCountry ? selectedCountry.countryName : '';
  }

  optionSelectedDestCountryId(id: number): string {
    this.SelectedDestCountryId = id;
    const selectedCountry = this.country.find(
      (country) => country.countryId === id
    );
    return selectedCountry ? selectedCountry.countryName : '';
  }

  optionSelectedOriginLocationId(id: number): string {
    this.SelectedOriginLocationId = id;
    const selectedLocation = this.city.find(
      (location) => location.cityId === id
    );
    return selectedLocation ? selectedLocation.cityName : '';
  }

  optionSelectedDestLocationId(id: number): string {
    this.SelectedDestLocationId = id;
    const selectedLocation = this.Destcity.find(
      (location) => location.cityId === id
    );
    return selectedLocation ? selectedLocation.cityName : '';
  }

  optionSelectedTrailerTypeId(id: number): string {
    this.SelectedTrailerTypeId = id;
    const selectedType = this.trailer.find(
      (type) => type.trailerTypeId === id
    );
    return selectedType ? selectedType.trailerTypeName : '';
  }
  optionSelectedTransportTypeId(id: number): string {
    this.SelectedTransportTypeId = id;
    const selectedType = this.transType.find(
      (type) => type.transportTypeId === id
    );
    return selectedType ? selectedType.transportType : '';
  }


  optionSelectedShipmentTypeId(id: number): string {
    this.SelectedShipmentTypeId = id;
    const selectedType = this.shipmenttype.find(
      (type) => type.shipmentTypeId === id
    );
    return selectedType ? selectedType.shipmentType : '';
  }

  optionSelectedContainerTypeId(id: number): string {
    this.SelectedContainerTypeId = id;
    const selectedType = this.containertype.find(
      (type) => type.containerTypeId === id
    );
    return selectedType ? selectedType.containerTypeName : '';
  }

  optionSelectedCargoTypeId(id: number): string {
    this.SelectedCargoTypeId = id;
    const selectedType = this.cargo.find(
      (type) => type.cargoTypeId === id
    );
    return selectedType ? selectedType.cargoType : '';
  }

  optionSelectedInformationSourceId(id: number): string {
    this.SelectedInformationSourceId = id;
    const selectedSource = this.Infosource.find(
      (source) => source.informationSourceId === id
    );
    return selectedSource ? selectedSource.informationSourceName : '';
  }
  optionSelectedReasonId(id: number): string {
    this.SelectedReasonId = id;
    const selectedReason = this.reason.find(
      (reason) => reason.reasonId === id
    );
    return selectedReason ? selectedReason.reasonName : '';
  }


  ///Edit from Enquiry//


  optionSelectedStatus(event: MatAutocompleteSelectedEvent): void {
    const selectedStatus = this.EnquiryStatus.find(
      (status) => status.rfqStatus === event.option.viewValue
    );
    if (selectedStatus) {
      const selectedStatusId = selectedStatus.rfqStatusId;
      this.SelectedStatusId = selectedStatusId;
    }
  }

  optionSelectedDestCountry(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = this.country.find(
      (country) => country.countryName === event.option.viewValue
    );
    if (selectedCountry) {
      const selectedCountryId = selectedCountry.countryId;
      this.SelectedDestCountryId = selectedCountryId;
    }
    this.Cservice.getAllCitiesbyCountry(this.SelectedDestCountryId).subscribe(res => {
      this.Destcity = res
      this.filter();
    });
    this.transportSelectedoption();
  }

  optionSelectedLoadingPort(event: MatAutocompleteSelectedEvent): void {
    const selectedPort = this.orginPortDropDown.find(
      (port) => port.name === event.option.viewValue
    );
    if (selectedPort) {
      const selectedPortId = selectedPort.Id;
      this.SelectedLoadingPortId = selectedPortId;
    }
  }
  optionSelectedOriginCountry(event: MatAutocompleteSelectedEvent): void {
    const selectedCountry = this.country.find(
      (country) => country.countryName === event.option.viewValue
    );
    if (selectedCountry) {
      const selectedCountryId = selectedCountry.countryId;
      this.SelectedOriginCountryId = selectedCountryId;
    }
    this.Cservice.getAllCitiesbyCountry(this.SelectedOriginCountryId).subscribe(res => {
      this.city = res
      console.log("this.city", this.city);
      this.filter();
    });
    this.transportSelectedoption();
  }
  optionSelectedDestinationPort(event: MatAutocompleteSelectedEvent): void {
    const selectedPort = this.DestPortDropDown.find(
      (port) => port.name === event.option.viewValue
    );
    if (selectedPort) {
      const selectedPortId = selectedPort.Id;
      this.SelectedDestinationPortId = selectedPortId;
    }
  }

  optionSelectedOriginLocation(event: MatAutocompleteSelectedEvent): void {
    const selectedLocation = this.city.find(
      (location) => location.cityName === event.option.viewValue
    );
    if (selectedLocation) {
      const selectedLocationId = selectedLocation.cityId;
      this.SelectedOriginLocationId = selectedLocationId;
    }
  }
  optionSelectedDestLocation(event: MatAutocompleteSelectedEvent): void {
    const selectedLocation = this.Destcity.find(
      (location) => location.cityName === event.option.viewValue
    );
    if (selectedLocation) {
      const selectedLocationId = selectedLocation.cityId;
      this.SelectedDestLocationId = selectedLocationId;
    }
  }
  optionSelectedTrailerType(event: MatAutocompleteSelectedEvent): void {
    const selectedType = this.trailer.find(
      (type) => type.trailerTypeName === event.option.viewValue
    );
    if (selectedType) {
      const selectedTypeId = selectedType.trailerTypeId;
      this.SelectedTrailerTypeId = selectedTypeId;
    }
  }
  optionSelectedTransportType(event: MatAutocompleteSelectedEvent): void {
    const selectedType = this.transType.find(
      (type) => type.transportType === event.option.viewValue
    );
    if (selectedType) {
      const selectedTypeId = selectedType.transportTypeId;
      this.SelectedTransportTypeId = selectedTypeId;
    }
  }
  optionSelectedShipmentType(event: MatAutocompleteSelectedEvent): void {
    const selectedType = this.shipmenttype.find(
      (type) => type.shipmentType === event.option.viewValue
    );
    if (selectedType) {
      const selectedTypeId = selectedType.shipmentTypeId;
      this.SelectedShipmentTypeId = selectedTypeId;
    }


    if (this.SelectedShipmentTypeId === 2) {
      // Set validators for mandatory fields when statusId is 1
      this.RfqgeneralForm.get('containerTypeId')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.RfqgeneralForm.get('containerTypeId')?.setValidators([Validators.nullValidator]);

      this.RfqgeneralForm.get('containerTypeId')?.setValue(null);
    }

    this.RfqgeneralForm.get('containerTypeId')?.updateValueAndValidity();
  }
  optionSelectedStorageUom(event: MatAutocompleteSelectedEvent): void {
    const selectedUom = this.UomStorage.find(
      (uom) => uom.uomName === event.option.viewValue
    );
    if (selectedUom) {
      const selectedUomId = selectedUom.uomId;
      this.SelectedStorageUomId = selectedUomId;
    }
  }
  optionSelectedContainerType(event: MatAutocompleteSelectedEvent): void {
    const selectedType = this.containertype.find(
      (type) => type.containerTypeName === event.option.viewValue
    );
    if (selectedType) {
      const selectedTypeId = selectedType.containerTypeId;
      this.SelectedContainerTypeId = selectedTypeId;
    }
  }
  optionSelectedCargoType(event: MatAutocompleteSelectedEvent): void {
    const selectedType = this.cargo.find(
      (type) => type.cargoType === event.option.viewValue
    );
    if (selectedType) {
      const selectedTypeId = selectedType.cargoTypeId;
      this.SelectedCargoTypeId = selectedTypeId;
    }
  }
  optionSelectedLineItem(event: MatAutocompleteSelectedEvent): void {
    this.enable = false
    const selectedLineItem = this.lineitemmaster.find(
      (item) => item.lineItemName === event.option.viewValue
    );
    if (selectedLineItem) {
      const selectedLineItemId = selectedLineItem.lineItemId;
      this.SelectedLineItemId = selectedLineItemId;
      this.selectedLineItemname = selectedLineItem.lineItemName;
      this.selectedLineItemCategoryId = selectedLineItem.lineItemCategoryId;
      this.selectedLineItemCategoryname = selectedLineItem.lineItemCategoryName;

    }

    if (this.editingIndex > -1) {
      this.standalonearray.splice(this.editingIndex, 1);
      const standalone = {
        lineItemId: this.SelectedLineItemId,
        lineItemName: this.selectedLineItemname,
        lineItemCategoryName: this.selectedLineItemCategoryname
      };
      const lineItemIdExists = this.standalonearray.some(item => item.lineItemId === standalone.lineItemId);
      if (!lineItemIdExists) {
        this.standalonearray.splice(this.editingIndex, 0, standalone);
        this.editingIndex = -1;
        this.lineItemId = "";
        this.showAddRow = false;
        this.enable = true;
      } else {
        this.standalonearray.splice(this.editingIndex, 0, this.Editedvalues);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Line Item already exists!",
          showConfirmButton: false,
          timer: 2000,
        });
        this.showAddRow = false;
        this.enable = true;
      }

    }

  }
  getAlljobOrder() {
    this.regionService.GetAllJobOrder().subscribe((res: any) => {
      this.joborder = res
    });
  }
  getEnquirydrop() {
    const newEnquiry = this.enquiry.map(res => {
      return {
        ...res,
        Id: res.enquiryId,
        code: res.enquiryNumber
      };
    });
    this.NewRefnumID = [...newEnquiry];
    this.filteredRefNumberIds = this.RfqForm.get(
      "refNumberId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterRefNumbers(name) : this.NewRefnumID?.slice()))
    );


  }

  getJobOredr() {

    const newJob = this.joborder.map((res: { jobOrderId: any; jobOrderNumber: any; }) => {
      return {
        ...res,
        Id: res.jobOrderId,
        code: res.jobOrderNumber
      };
    });
    this.NewRefnumID = [...newJob];
    this.filteredRefNumberIds = this.RfqForm.get(
      "refNumberId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterRefNumbers(name) : this.NewRefnumID?.slice()))
    );



  }




  filter() {
    this.filteredRfqAgainst = this.RfqForm.get('rfqAgainstId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.rfqAgainst)),
      map((name: any) => (name ? this._filterRfqAgainst(name) : this.RfqAgainstList?.slice()))
    );

    this.filteredLineItems = this.RfqForm.get('lineItemId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.lineItemName)),
      map((name: any) => (name ? this._filterLineItems(name) : this.lineitemmaster?.slice()))
    );
    this.filteredJobCategories = this.RfqgeneralForm.get('jobCategoryId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobCategory)),
      map((name: any) => (name ? this._filterJobCategories(name) : this.jobCategory?.slice()))
    );
    this.filteredJobTypes = this.RfqgeneralForm.get('jobTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobTypeName)),
      map((name: any) => (name ? this._filterJobTypes(name) : this.jobtype?.slice()))
    );
    this.filteredOriginCountries = this.RfqgeneralForm.get('originCountryId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this._filterOriginCountries(name) : this.country?.slice()))
    );

    this.filteredDestCountries = this.RfqgeneralForm.get('destCountryId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this._filterDestCountries(name) : this.country?.slice()))
    );

    this.filteredOriginLocations = this.RfqgeneralForm.get('originLocationId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this._filterOriginLocations(name) : this.city?.slice()))
    );

    this.filteredDestLocations = this.RfqgeneralForm.get('destLocationId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this._filterDestLocations(name) : this.Destcity?.slice()))
    );
    this.filteredTrailerTypes = this.RfqgeneralForm.get('trailerTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.trailerTypeName)),
      map((name: any) => (name ? this._filterTrailerTypes(name) : this.trailer?.slice()))
    );

    this.filteredTransportTypes = this.RfqgeneralForm.get('transportTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofTransport)),
      map((name: any) => (name ? this._filterTransportTypes(name) : this.transType?.slice()))
    );

    this.filteredShipmentTypes = this.RfqgeneralForm.get('shipmentTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.shipmentType)),
      map((name: any) => (name ? this._filterShipmentTypes(name) : this.shipmenttype?.slice()))
    );

    this.filteredContainerTypes = this.RfqgeneralForm.get('containerTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.containerTypeName)),
      map((name: any) => (name ? this._filterContainerTypes(name) : this.containertype?.slice()))
    );

    this.filteredCargoTypes = this.RfqgeneralForm.get('cargoTypeid')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cargoType)),
      map((name: any) => (name ? this._filterCargoTypes(name) : this.cargo?.slice()))
    );

    this.filteredInformationSources = this.RfqgeneralForm.get('informationSourceId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.informationSourceName)),
      map((name: any) => (name ? this._filterInformationSources(name) : this.Infosource?.slice()))
    );

    this.filteredReasons = this.RfqgeneralForm.get('reasonId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.reasonName)),
      map((name: any) => (name ? this._filterReasons(name) : this.reason?.slice()))
    );

    this.filteredStorageUoms = this.RfqgeneralForm.get('storageUomId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.uomName)),
      map((name: any) => (name ? this._filterStorageUoms(name) : this.UomStorage?.slice()))
    );

    this.filtereddocumentId = this.RFQDoc.get(
      "documentId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.documentName)),
      map((name: any) => (name ? this._filternextFollowUpdocId(name) : this.document?.slice()))
    );
    this.filteredStatuses = this.RfqgeneralForm.get('statusId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.rfqStatus)),
      map((name: any) => (name ? this._filterStatuses(name) : this.EnquiryStatus?.slice()))
    );
  }
  private _filterStatuses(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.EnquiryStatus.filter((status) =>
      status.enquiryStatus.toLowerCase().includes(filterValue)
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

  private _filterOriginCountries(value: string): Country[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.country.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["originCountryId"].setValue("");
    }

    return filterresult;
  }
  private _filterDestCountries(value: string): Country[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.country.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["destCountryId"].setValue("");
    }

    return filterresult;
  }
  private _filterStorageUoms(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.UomStorage.filter((uom) =>
      uom.uomName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["storageUomId"].setValue("");
    }

    return filterresult;
  }
  private _filterReasons(value: string): Reason[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.reason.filter((reason) =>
      reason.reasonName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["reasonId"].setValue("");
    }

    return filterresult;
  }

  private _filterInformationSources(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.Infosource.filter((source) =>
      source.informationSourceName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["informationSourceId"].setValue("");
    }

    return filterresult;
  }

  private _filterCargoTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.cargo.filter((type) =>
      type.cargoType.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["cargoTypeid"].setValue("");
    }

    return filterresult;
  }


  private _filterContainerTypes(value: string): ContainerType[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.containertype.filter((type) =>
      type.containerTypeName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["containerTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterShipmentTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.shipmenttype.filter((type) =>
      type.shipmentType.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["shipmentTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterTransportTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.transType.filter((type) =>
      type.transportType.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["transportTypeId"].setValue("");
    }

    return filterresult;
  }
  private _filterTrailerTypes(value: string): TrailerType[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.trailer.filter((type) =>
      type.trailerTypeName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["trailerTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterDestLocations(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.Destcity.filter((location) =>
      location.cityName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["destLocationId"].setValue("");
    }

    return filterresult;
  }
  private _filterOriginLocations(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.city.filter((location) =>
      location.cityName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["originLocationId"].setValue("");
    }

    return filterresult;
  }
  private _filterJobTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.jobtype.filter((type) =>
      type.jobTypeName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["jobTypeId"].setValue("");
    }

    return filterresult;
  }
  private _filterJobCategories(value: string): JobCategory[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.jobCategory.filter((category) =>
      category.jobCategory.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["jobCategoryId"].setValue("");
    }

    return filterresult;
  }

  private _filterLineItems(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.lineitemmaster.filter((item) =>
      item.lineItemName.toLowerCase().includes(filterValue)
    );


  }
  private _filterRfqAgainst(value: string): RfqAgainst[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.RfqAgainstList.filter((rfq) =>
      rfq.rfqAgainst.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqForm.controls["rfqAgainstId"].setValue("");
    }

    return filterresult;
  }
  deselect() {
    this.SelectedRfqAgainstId = 0;
    this.SelectedRefNumberId = 0;
    this.RfqForm.controls["refNumberId"].setValue("");
  }
  private _filterRefNumbers(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.NewRefnumID.filter((ref) =>
      ref.code.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqForm.controls["refNumberId"].setValue("");
    }

    return filterresult;
  }
  optionSelectedRefNumberId(id: number) {
    const selectedRfq = this.enquiry.find(
      (rfq) => rfq.enquiryId === id
    );

    this.selectedrefnumbertxt = selectedRfq?.enquiryNumber;
    this.RfqForm.controls["refNumberId"].setValue(selectedRfq?.enquiryNumber);

  }
  optionSelectedRfqAgainstId(id: number) {
    this.SelectedRfqAgainstId = id;
    const selectedRfq = this.RfqAgainstList.find(
      (rfq) => rfq.rfqAgainstId === id
    );
    const RFQagainst = {
      ...this.RfqForm.value,
      rfqAgainstId: this.SelectedRfqAgainstId,
      refNumberId: this.SelectedRefNumberId

    }
    this.selectrfqagainsttxt = selectedRfq?.rfqAgainst;
    this.SRFQ.GetRfqAgainst(RFQagainst).subscribe((res) => {
      this.rfqlineitem = res;
    });
    this.RfqForm.controls["rfqAgainstId"].setValue(selectedRfq?.rfqAgainst);
  }
  addRow() {
    // Check if standalonearray already has a row
    if (!this.showAddRow) {
      // Check if lineItemId is not null
      if (this.SelectedLineItemId) {
        const standalone = {
          lineItemId: this.SelectedLineItemId,
          lineItemName: this.selectedLineItemname,
          lineItemCategoryName: this.selectedLineItemCategoryname
        };
        // Check if the lineItemId already exists in the array
        const lineItemIdExists = this.standalonearray.some(item => item.lineItemId === standalone.lineItemId);
        if (!lineItemIdExists) {
          this.standalonearray.push(standalone); // Push the new row to the array
          this.lineItemId = "";
          this.showAddRow = false;
          this.enable = true;
          console.log("this.standalonearray", this.standalonearray);
        } else {
          this.lineItemId = "";
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Line Item already exists!",
            showConfirmButton: false,
            timer: 2000,
          });
          this.showAddRow = false;
        }
      } else {
        this.showAddRow = false;
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Line Item is Required",
          showConfirmButton: false,
          timer: 2000,
        }); // Alert if lineItemId is null
      }
    } else {
      alert("Only one row is allowed at a time!");
    }
  }

  addDocumentRow() {
    if (this.RFQDoc.valid) {
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

            const Value = {
              ...this.RFQDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              Isedit: false,
              documentId: this.SelectedDocumentId
            }
            // Push the modified object into ImageDataArray
            this.ImageDataArray.push(Value);
            this.rfqdocument = [...this.ImageDataArray]
            this.RFQDoc.reset();
            this.showAddRowDoc = false;
            //this.InitializeDoc();
          } else {
            // Update the existing image data
            const modifiedImageDetail = { ...imageDetail, documentName };
            this.ImageDataArray[existingImageDataIndex] = {
              ...this.RFQDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              documentId: this.SelectedDocumentId,
              createdBy: 1,
              createdDate: this.date,
            };
            this.RFQDoc.reset();
            this.rfqdocument = [...this.ImageDataArray];
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
      this.RFQDoc.markAllAsTouched();
      this.validateall(this.RFQDoc);
    }

  }
  uomvalue() {
    const heightControl = this.RfqgeneralForm.get('valuePerUom');
    if (heightControl && heightControl.value < 0) {
      heightControl.setValue(Math.abs(heightControl.value)); // Set the absolute value
    }
  }
  Numberogpks() {
    const heightControl = this.RfqgeneralForm.get('packageNos');
    if (heightControl && heightControl.value < 0) {
      heightControl.setValue(Math.abs(heightControl.value)); // Set the absolute value
    }
  }
  getSelectedlineitem(id: number): string {
    const selectedLineItem = this.lineitemmaster.find(
      (item) => item.lineItemId === id
    );
    return selectedLineItem ? selectedLineItem.lineItemName : '';
  }

  generateRFQ() {
    if (this.RfqForm.valid) {

      if (this.rfqlineitem.length > 0) {
        this.ActiveLineitems = this.rfqlineitem.filter(item => item.active === 1);
      } else {
        this.ActiveLineitems = this.standalonearraynew.filter(item => item.select === true);
      }
      if (this.ActiveLineitems.length > 0) {
        this.ShowgenerateRFQ = true;
        this.ShowRFQAgainst = false;
        this.RfqgeneralForm.controls["rfqAgainst"].setValue(this.selectrfqagainsttxt);
        this.RfqgeneralForm.controls["refNumberId"].setValue(this.selectedrefnumbertxt);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please select atleast one lineitem",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      if (this.SelectedRfqAgainstId) {
        switch (this.SelectedRfqAgainstId) {
          case 1:
            this.FromEnquiry(this.SelectedRefNumberId);
            break;
          case 2:
            this.FromJOB(this.SelectedRefNumberId);
            break;
          case 3:

            break;
          case 4:
            alert(4);
            break;
          default:
            console.log("Default case");
        }
      }
    } else {
      this.RfqForm.markAllAsTouched();
      this.validateall(this.RfqForm);
    }
  }

  dateFilter1 = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return !date || date <= currentDate;
  };
  dateFilter = (date: Date | null): boolean => {
    // Get the current date and set the time to the start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get the enquiry date from the form control
    const enquiryDateValue = this.RfqgeneralForm.controls['rfqDate'].value;

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

  oncancelDoc(data: any, index: any) {
    debugger
    if (data?.documentId) {
      data.Isedit = false;
      this.rfqdocument = [...this.rfqdocument];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.isEditDocument = false;
      return;
    } else {
      this.rfqdocument = this.rfqdocument.filter((_, idx) => idx !== index);
      this.showAddRowDoc = false;
      this.isEditDocument = false;
    }

  }

  EditDoc(data: any, index: any) {
    const updatedDocuments = this.rfqdocument.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, Isedit: true };
      }
      return doc;
    });
    this.RFQDoc.controls['documentId'].patchValue(this.getSelectedDoc(data.documentId))
    this.showAddRowDoc = true;
    this.isEditDocument = true;
    this.rfqdocument = updatedDocuments;
  }

  DeleteImage(item: any, i: number) {
    if (this.showAddRowDoc != true) {
      if (i !== -1) {
        this.ImageDataArray = [...this.rfqdocument];
        this.ImageDataArray.splice(i, 1);
        this.rfqdocument = [...this.ImageDataArray]
        this.showAddRowDoc = false;
      }
    }
  }

  optionSelectedJobCategory(event: MatAutocompleteSelectedEvent): void {
    this.RfqgeneralForm.controls["jobTypeId"].setValue(null);
    const selectedCategory = this.jobCategory.find(
      (category) => category.jobCategory === event.option.viewValue
    );
    if (selectedCategory) {
      const selectedCategoryId = selectedCategory.jobCategoryId;
      this.SelectedJobCategoryId = selectedCategoryId;
    }
    this.Jtype.getJobTypesByJobCatId(this.SelectedJobCategoryId).subscribe((res => {
      this.jobtype = res;
      this.filter();
    }))

    if (this.SelectedJobCategoryId) {
      switch (this.SelectedJobCategoryId) {
        case 1:
          this.Showpakageheader = false
          break;
        case 2:
          this.Showpakageheader = true
          break;
        case 3:
          this.Showpakageheader = false
          break;
        default:
          console.log("Default case");
      }
    }
  }

  optionSelectedJobType(event: MatAutocompleteSelectedEvent): void {
    const selectedType = this.jobtype.find(
      (type) => type.jobTypeName === event.option.viewValue
    );
    if (selectedType) {
      const selectedTypeId = selectedType.jobTypeId;
      this.SelectedJobTypeId = selectedTypeId;
    }
  }

  optionSelectedJobTypeAgainstDirect(event: MatAutocompleteSelectedEvent): void {
    const selectedType = this.jobtype.find(
      (type) => type.jobTypeName === event.option.viewValue
    );
    if (selectedType) {
      const selectedTypeId = selectedType.jobTypeId;
      this.SelectedJobTypeId = selectedTypeId;
    }
    this.Jtype.getAllJopTypeById(this.SelectedJobTypeId).subscribe((res => {
      this.rfqlineitem = res.jobTypeLineItems;
      this.SelectedJobCategoryId = res.jobTypeGeneral.jobCategoryId;
      this.SelectedJobTypeId = res.jobTypeGeneral.jobTypeId;
      this.RfqgeneralForm.controls["jobCategoryId"].setValue(res.jobTypeGeneral.jobCategory);
      this.RfqgeneralForm.controls["jobTypeId"].setValue(res.jobTypeGeneral.jobTypeName);
      this.Jtype.getAllJopTypeById(this.SelectedJobTypeId).subscribe((res) => {
        this.JobtypeModeoftans = res.jtModeofTransport;
        var modeoftrns = this.JobtypeModeoftans.map(id => id.modeofTransportId);
        this.RfqgeneralForm.controls["transportModeId"].setValue(modeoftrns);
        if (this.JobtypeModeoftans.length > 0) {
          this.onSelectModeoftrns();
        }
        this.jobtypeIncoTerms = res.jobTypeGeneral.incoTermId;
        this.RfqgeneralForm.controls["incoTermId"].setValue([this.jobtypeIncoTerms]);
        if (this.jobtypeIncoTerms) {
          this.onSelectInco();
        }
      });
    }))
  }

  toggleCheckbox(i: number) {
    this.selectall = false;
    this.rfqlineitem[i].active = this.rfqlineitem[i].active ? 0 : 1;
    this.rfqlineitem[i].createdBy = 1;
    this.rfqlineitem[i].updatedBy = 1;
    this.checkAllActive();
  }
  checkAllActive() {
    this.selectall = this.rfqlineitem.every(item => item.active === 1);
  }
  toggle(i: number) {
    this.standalonearray[i].active = this.standalonearray[i].active ? 0 : 1;
    this.standalonearray[i].createdBy = 1;
    this.standalonearray[i].updatedBy = 1;
  }

  onSelectCommodity() {
    const selectedCommodities = this.RfqgeneralForm.controls['commodityId'].value;
    const uniqueSelectedcommodity = selectedCommodities.filter(
      (selectedCommodity: any) =>
        !this.RfqCommodity.some(
          (existingcommodity: any) => existingcommodity.commodityId === selectedCommodity
        )
    );
    uniqueSelectedcommodity.forEach((selectedCommodityId: any) => {
      this.CommodityForm = this.Fb.group({
        RfqcommodityId: [0],
        RfqId: [0],
        commodityId: [selectedCommodityId],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.RfqCommodity.push(this.CommodityForm.value);
    });
    const uncheckedCommoditys = this.RfqCommodity.filter(
      (existingcommodity: any) =>
        !selectedCommodities.includes(existingcommodity.commodityId)
    );
    uncheckedCommoditys.forEach((uncheckedCommodity: any) => {
      const index = this.RfqCommodity.findIndex(
        (existingcommodity: any) =>
          existingcommodity.commodityId === uncheckedCommodity.commodityId
      );
      if (index !== -1) {
        this.RfqCommodity.splice(index, 1);
      }
    });

    console.log("EnqCommodity", this.RfqCommodity)
  }


  onSelectInco() {
    const selectedIncos = this.RfqgeneralForm.controls['incoTermId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedInco: any) =>
        !this.RfqIncoTerm.some(
          (existingInco: any) => existingInco.incoTermId === selectedInco
        )
    );
    uniqueSelectedInco.forEach((selectedInco: any) => {
      this.IncoForm = this.Fb.group({
        RfqIncoId: [0],
        RfqId: [0],
        incoTermId: [selectedInco],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.RfqIncoTerm.push(this.IncoForm.value);
    });
    const uncheckedIncos = this.RfqIncoTerm.filter(
      (existingInco: any) =>
        !selectedIncos.includes(existingInco.incoTermId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.RfqIncoTerm.findIndex(
        (existingInco: any) =>
          existingInco.incoTermId === uncheckedInco.incoTermId
      );
      if (index !== -1) {
        this.RfqIncoTerm.splice(index, 1);
      }
    });

    console.log("Enqinco", this.EnqIncoTerm);
  }
  async onSelectModeoftrns() {

    await this.transportSelectedoption();
    const selectedIncos = this.RfqgeneralForm.controls['transportModeId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedInco: any) =>
        !this.RfqModeoftransport.some(
          (existingInco: any) => existingInco.transportModeId === selectedInco
        )
    );
    uniqueSelectedInco.forEach((selectedInco: any) => {
      this.TransportForm = this.Fb.group({
        rfqTransportModeId: [0],
        rfqId: [0],
        transportModeId: [selectedInco],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.RfqModeoftransport.push(this.TransportForm.value);
    });
    const uncheckedIncos = this.RfqModeoftransport.filter(
      (existingInco: any) =>
        !selectedIncos.includes(existingInco.transportModeId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.RfqModeoftransport.findIndex(
        (existingInco: any) =>
          existingInco.transportModeId === uncheckedInco.transportModeId
      );
      if (index !== -1) {
        this.RfqModeoftransport.splice(index, 1);
      }
    });

    console.log("Rfq--------->Modeoftransport", this.RfqModeoftransport);

  }


  async onSelectModeoftrnsfromenq(event: any) {

    if (event[0] != null) {

      const selectedIncos = this.RfqgeneralForm.controls['transportModeId'].value;
      const uniqueSelectedInco = selectedIncos.filter(
        (selectedInco: any) =>
          !this.RfqModeoftransport.some(
            (existingInco: any) => existingInco.transportModeId === selectedInco
          )
      );
      uniqueSelectedInco.forEach((selectedInco: any) => {
        this.TransportForm = this.Fb.group({
          rfqTransportModeId: [0],
          rfqId: [0],
          transportModeId: [selectedInco],
          createdBy: [parseInt(this.userId$)],
          createdDate: [this.date],
          updatedBy: [parseInt(this.userId$)],
          updatedDate: [this.date]
        });
        this.RfqModeoftransport.push(this.TransportForm.value);
      });
      const uncheckedIncos = this.RfqModeoftransport.filter(
        (existingInco: any) =>
          !selectedIncos.includes(existingInco.transportModeId)
      );
      uncheckedIncos.forEach((uncheckedInco: any) => {
        const index = this.RfqModeoftransport.findIndex(
          (existingInco: any) =>
            existingInco.transportModeId === uncheckedInco.transportModeId
        );
        if (index !== -1) {
          this.RfqModeoftransport.splice(index, 1);
        }
      });

      console.log("Rfq--------->Modeoftransport", this.RfqModeoftransport);
    }

  }

  addPackage() {
    debugger
    const noOfpkg = this.RfqgeneralForm.controls['packageNos'].value
    const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
    const count = this.RFQPackage.length;
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
      const dialogRef = this.dialog.open(RfqpackageComponent, {
        data: {
          list: this.RFQPackage,
          modeofTransport: this.RfqModeoftransport,
          show: this.chargablepackage
        }, disableClose: true, autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.RFQPackage.push(result);
          this.RFQPackage = [...this.RFQPackage];
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

  Edit(Data: any, i: number) {

    const dialogRef = this.dialog.open(RfqpackageComponent, {
      data: {
        RFQData: Data,
        mode: 'Edit',
        show: this.chargablepackage,
        modeofTransport: this.RfqModeoftransport,
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.RFQPackage.splice(i, 1);
        this.RFQPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }

  View(Data: any, i: number) {
    const dialogRef = this.dialog.open(RfqpackageComponent, {
      data: {
        RFQData: Data,
        mode: 'view',
        show: this.chargablepackage
      }, disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.RFQPackage.splice(i, 1);
        this.RFQPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }

  DeletepacKage(item: any, i: number) {
    if (i !== -1) {
      this.RFQPackage.splice(i, 1);
    }
  }
  getTotalCrossWeight(): string {
    const totalCrossWeight = this.RFQPackage.reduce((total, item) => total + (+item.packWeightKg || 0), 0);
    return totalCrossWeight.toFixed(2);
  }

  getTotalChargeableWeight(): string {
    const totalChargeableWeight = this.RFQPackage.reduce((total, item) => total + (+item.chargePackWtKg || 0), 0);
    return totalChargeableWeight.toFixed(2);
  }

  optionSelecteddocumentId(event: MatAutocompleteSelectedEvent): void {
    const selectedDocID = this.document.find(
      (Stype) => Stype.documentName === event.option.viewValue
    );
    if (selectedDocID) {
      const selectedDocId = selectedDocID.documentId;
      this.SelectedDocumentId = selectedDocId;
      this.DocRemarks = selectedDocID.remarks;

      this.RFQDoc.patchValue({
        remarks: this.DocRemarks,
      });

      const exists = this.ImageDataArray.some(item => item.documentId === this.SelectedDocumentId);
      if (exists) {
        Swal.fire({
          icon: "error",
          title: "Duplicate",
          text: "Document already exist..!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        });
        this.RFQDoc.get("documentId")?.setValue("");
      }


    }

  }
  InitializeDoc() {
    this.RFQDoc = this.Fb.group({
      rfqDocumentId: [0],
      rfqId: [0],
      documentId: ["", [Validators.required]],
      documentName: [""],
      remarks: [""],
      createdBy: parseInt(this.userId$),
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
        if (['jpg', 'png', 'jpeg', 'pdf', 'jfif', 'docx', 'doc', 'xls', 'xlsx'].includes(fileType)) {
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
            "Please Choose JPG, PNG,PDF,JFIF, DOCX, DOC, XLS, or XLSX Files."
          );
          this.RFQDoc.controls["documentName"].setValue("");
        }

      }
    }
  }

  // vendor Filter Dialog//
  VendorFilterDialog() {
    const dialogRef = this.dialog.open(VendorfilterdialogComponent, {
      data: {
        Dataarray: this.vendorList
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // this.vendorlist1.push(...result.activevendors);
        // console.log("this.vendorlist1",this.vendorlist1)
        this.vendorList.push(...result.activevendors);
        const Activevendors = this.vendorList.filter(item => item.active === true);
        this.vendorList = [...Activevendors];

        ///this.vendorcontact = result.activecontacts;
        ///this.vendoraddress = result.activeaddress

        //console.log("this.vendorcontact", this.vendorcontact);
        //console.log("this.vendoraddress", this.vendoraddress);
      } else {
        this.vendorList = [... this.vendorList];
      }
    });
  }




  openContactview(Vid: number, Vtype: string, index: number, rfqvendorid: number) {
    this.indexofcontact = index;

    while (this.vendorcontactFilterByIndex.length <= index) {
      this.vendorcontactFilterByIndex.push([]);
    }
    const ContactParms = {
      vendorId: Vid,
      vendorType: Vtype
    }
    if (this.vendorcontactFilterByIndex[index]) {
      const vendorcontactindex = this.vendorcontactFilterByIndex[index];
      if (vendorcontactindex.length == 0 && Vtype == null) {
        var contact = this.vendorcontactlist[index];
        this.vendorcontactFilterByIndex = [...this.vendorcontactlist]
        const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
          data: {
            list: contact
          }, disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorcontactFilterByIndex[this.indexofcontact] = [];
              this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
              this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
            }
          }
        });
      } else if (vendorcontactindex.length == 0) {
        this.RFQS.Getvendorcontacts(ContactParms).subscribe((res) => {
          this.vendorcontactlist = res;
          const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
            data: {
              list: this.vendorcontactlist
            }, disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
              if (result.length > 0) {
                this.vendorcontactFilterByIndex[this.indexofcontact] = [];
                this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
                this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
                console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
              }
            }
          });
        });
      } else {
        var contact = this.vendorcontactlist[index];
        contact = vendorcontactindex;
        const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
          data: {
            list: contact
          }, disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorcontactFilterByIndex[this.indexofcontact] = [];
              this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
              this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
            }
          }
        });

      }
    }

  }

  openAddressview(Vid: number, Vtype: string, index: number, rfqvendorid: number) {
    this.indexofAddress = index;

    while (this.vendorAddressFilterByIndex.length <= index) {
      this.vendorAddressFilterByIndex.push([]);
    }
    const ContactParms = {
      vendorId: Vid,
      vendorType: Vtype
    }

    if (this.vendorAddressFilterByIndex[index]) {
      const vendorAddressindex = this.vendorAddressFilterByIndex[index];
      if (vendorAddressindex.length == 0 && Vtype == null) {

        var address = this.vendorAddresslist[index];
        this.vendorAddressFilterByIndex = [...this.vendorAddresslist]
        const dialogRef = this.dialog.open(RfqaddressdialogComponent, {
          data: {
            list: address
          }, disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorAddressFilterByIndex[this.indexofAddress] = [];
              this.vendorAddressFilterByIndex[this.indexofAddress].push(...result);
              this.vendorAddresslist = [...this.vendorAddressFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorAddressFilterByIndex);
            }
          }
        });

      } else if (vendorAddressindex.length == 0) {
        this.RFQS.GetvendorAddress(ContactParms).subscribe((res) => {
          this.vendorAddresslist = res;
          const dialogRef = this.dialog.open(RfqaddressdialogComponent, {
            data: {
              list: this.vendorAddresslist
            }, disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
              if (result.length > 0) {
                this.vendorAddressFilterByIndex[this.indexofAddress] = [];
                this.vendorAddressFilterByIndex[this.indexofAddress].push(...result);
                this.vendorAddresslist = [...this.vendorAddressFilterByIndex]
                console.log("this.vendorAddressFilterByIndex", this.vendorAddressFilterByIndex);
              }
            }
          });
        });
      } else {
        var address = this.vendorAddresslist[index];
        address = vendorAddressindex;
        this.vendorAddressFilterByIndex = [...this.vendorAddresslist]
        const dialogRef = this.dialog.open(RfqaddressdialogComponent, {
          data: {
            list: address
          }, disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorAddressFilterByIndex[this.indexofAddress] = [];
              this.vendorAddressFilterByIndex[this.indexofAddress].push(...result);
              this.vendorAddresslist = [...this.vendorAddressFilterByIndex]
              console.log("this.vendorAddressFilterByIndex", this.vendorAddressFilterByIndex);
            }
          }
        });

      }
    }

  }

  openContact(Vid: number, Vtype: string, index: number, rfqvendorid: number) {
    this.indexofcontact = index;

    while (this.vendorcontactFilterByIndex.length <= index) {
      this.vendorcontactFilterByIndex.push([]);
    }
    const ContactParms = {
      vendorId: Vid,
      vendorType: Vtype
    }
    if (this.vendorcontactFilterByIndex[index]) {
      this.vendorcontactFilterByIndex = this.vendorcontactlist;
      const vendorcontactindex = this.vendorcontactFilterByIndex[index];
      if (vendorcontactindex.length == 0 && Vtype == null) {
        var contact = this.vendorcontactlist[index];
        this.vendorcontactFilterByIndex = [...this.vendorcontactlist]
        const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
          data: {
            list: contact
          }, disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorcontactFilterByIndex[this.indexofcontact] = [];
              this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
              this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
            }
          }
        });
      } else if (vendorcontactindex.length == 0) {
        this.RFQS.Getvendorcontacts(ContactParms).subscribe((res) => {
          this.vendorcontactlist = res;
          this.vendorcontactlist.forEach(contact => {
            if (contact.primaryContact === true) {
              // If this is the primary contact, ensure active is true
              contact.active = true;
            }
          });
          const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
            data: {
              list: this.vendorcontactlist
            }, disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
              if (result.length > 0) {
                this.vendorcontactFilterByIndex[this.indexofcontact] = [];
                this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
                this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
                console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
              }
            }
          });
        });
      } else {
        var contact = this.vendorcontactlist[index];
        contact = vendorcontactindex;
        const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
          data: {
            list: contact
          }, disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorcontactFilterByIndex[this.indexofcontact] = [];
              this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
              this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
            }
          }
        });

      }
    }
  }

  openviewContact(Vid: number, Vtype: string, index: number, rfqvendorid: number) {
    this.indexofcontact = index;

    while (this.vendorcontactFilterByIndex.length <= index) {
      this.vendorcontactFilterByIndex.push([]);
    }
    const ContactParms = {
      vendorId: Vid,
      vendorType: Vtype
    }
    if (this.vendorcontactFilterByIndex[index]) {
      this.vendorcontactFilterByIndex = this.vendorcontactlist;
      const vendorcontactindex = this.vendorcontactFilterByIndex[index];
      if (vendorcontactindex.length == 0 && Vtype == null) {
        var contact = this.vendorcontactlist[index];
        this.vendorcontactFilterByIndex = [...this.vendorcontactlist]
        const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
          data: {
            list: contact,
            mode: "view",
          }, disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorcontactFilterByIndex[this.indexofcontact] = [];
              this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
              this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
            }
          }
        });
      } else if (vendorcontactindex.length == 0) {
        this.RFQS.Getvendorcontacts(ContactParms).subscribe((res) => {
          this.vendorcontactlist = res;
          const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
            data: {
              list: this.vendorcontactlist,
              mode: "view",
            }, disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
              if (result.length > 0) {
                this.vendorcontactFilterByIndex[this.indexofcontact] = [];
                this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
                this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
                console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
              }
            }
          });
        });
      } else {
        var contact = this.vendorcontactlist[index];
        contact = vendorcontactindex;
        const dialogRef = this.dialog.open(RfqvendorcontactdialogComponent, {
          data: {
            list: contact,
            mode: "view",
          }, disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorcontactFilterByIndex[this.indexofcontact] = [];
              this.vendorcontactFilterByIndex[this.indexofcontact].push(...result);
              this.vendorcontactlist = [...this.vendorcontactFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorcontactlist);
            }
          }
        });

      }
    }
  }

  openAddress(Vid: number, Vtype: string, index: number, rfqvendorid: number) {
    this.indexofAddress = index;

    while (this.vendorAddressFilterByIndex.length <= index) {
      this.vendorAddressFilterByIndex.push([]);
    }
    const ContactParms = {
      vendorId: Vid,
      vendorType: Vtype
    }

    if (this.vendorAddressFilterByIndex[index]) {
      const vendorAddressindex = this.vendorAddressFilterByIndex[index];
      if (vendorAddressindex.length == 0 && Vtype == null) {

        var address = this.vendorAddresslist[index];
        this.vendorAddressFilterByIndex = [...this.vendorAddresslist]
        const dialogRef = this.dialog.open(RfqaddressdialogComponent, {
          data: {
            list: address
          }, disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorAddressFilterByIndex[this.indexofAddress] = [];
              this.vendorAddressFilterByIndex[this.indexofAddress].push(...result);
              this.vendorAddresslist = [...this.vendorAddressFilterByIndex]
              console.log("this.vendorcontactFilterByIndex", this.vendorAddressFilterByIndex);
            }
          }
        });

      } else if (vendorAddressindex.length == 0) {
        this.RFQS.GetvendorAddress(ContactParms).subscribe((res) => {
          this.vendorAddresslist = res;
          const dialogRef = this.dialog.open(RfqaddressdialogComponent, {
            data: {
              list: this.vendorAddresslist
            }, disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
              if (result.length > 0) {
                this.vendorAddressFilterByIndex[this.indexofAddress] = [];
                this.vendorAddressFilterByIndex[this.indexofAddress].push(...result);
                this.vendorAddresslist = [...this.vendorAddressFilterByIndex]
                console.log("this.vendorAddressFilterByIndex", this.vendorAddressFilterByIndex);
              }
            }
          });
        });
      } else {
        var address = this.vendorAddresslist[index];
        address = vendorAddressindex;
        this.vendorAddressFilterByIndex = [...this.vendorAddresslist]
        const dialogRef = this.dialog.open(RfqaddressdialogComponent, {
          data: {
            list: address
          }, disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            if (result.length > 0) {
              this.vendorAddressFilterByIndex[this.indexofAddress] = [];
              this.vendorAddressFilterByIndex[this.indexofAddress].push(...result);
              this.vendorAddresslist = [...this.vendorAddressFilterByIndex]
              console.log("this.vendorAddressFilterByIndex", this.vendorAddressFilterByIndex);
            }
          }
        });

      }
    }

  }
  async transportSelectedoption() {
    const selectedModes = this.RfqgeneralForm.controls['transportModeId'].value;
    selectedModes.forEach((mode: number) => {
      if (mode === 1 && selectedModes.includes(2)) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Cannot select both Air and Sea simultaneously",
          showConfirmButton: false,
          timer: 2000,
        });
        this.RfqgeneralForm.controls['transportModeId'].reset();
        this.RfqgeneralForm.controls['loadingPortId'].reset();
        this.RfqgeneralForm.controls['destinationPortId'].reset();
      }
    });
    selectedModes.forEach((mode: number) => {
      if (mode === 4 && (selectedModes.includes(1) || selectedModes.includes(2) || selectedModes.includes(3))) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Can't select  Air, Sea, Road and Courier simultaneously",
          showConfirmButton: false,
          timer: 2000,
        });
        // this.portofLoadingList = []
        // this.portofDestinationList = []
        // this.pqTransportMode = [];
        // this.destinationPortId = null;
        // this.loadingPortId = null;
        this.RfqgeneralForm.controls['transportModeId'].reset()
        this.RfqgeneralForm.controls['loadingPortId'].reset()
        this.RfqgeneralForm.controls['destinationPortId'].reset()

      }
    });

    if (selectedModes.includes(1) && selectedModes.includes(3)) {
      const calcairandroad = 10000
      this.Calculation(calcairandroad);
      this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
      this.getDestAirdropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.RfqgeneralForm.controls['loadingPortId'].reset();
      this.RfqgeneralForm.controls['destinationPortId'].reset();
      this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();

    } else if (selectedModes.includes(2) && selectedModes.includes(3)) {
      const calcseaandroad = 10000
      this.Calculation(calcseaandroad);
      this.getorginseadropbycountryid(this.SelectedOriginCountryId);
      this.getDestseadropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = true;
      this.ShowOnlysea = true
      this.chargablepackage = false;
      this.RfqgeneralForm.controls['loadingPortId'].reset();
      this.RfqgeneralForm.controls['destinationPortId'].reset();

      // if (selectedModes.includes(2) && selectedModes.includes(3)) {
      //   // Set validators for mandatory fields when statusId is 1
      //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
      // } else {
      //   // Remove validators if statusId is not 2
      //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

      //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
      // }

      // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(1)) {
      const calcair = 6000
      this.Calculation(calcair);
      this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
      this.getDestAirdropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = false;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.RfqgeneralForm.controls['loadingPortId'].reset();
      this.RfqgeneralForm.controls['destinationPortId'].reset();
      this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(2)) {
      this.getorginseadropbycountryid(this.SelectedOriginCountryId);
      this.getDestseadropbycountryid(this.SelectedDestCountryId);
      // if (selectedModes.includes(2)) {
      //   // Set validators for mandatory fields when statusId is 1
      //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
      // } else {
      //   // Remove validators if statusId is not 2
      //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

      //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
      // }

      // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
      this.ShowOnlyroad = false;
      this.ShowOnlysea = true
      this.chargablepackage = true;
      this.RfqgeneralForm.controls['loadingPortId'].reset();
      this.RfqgeneralForm.controls['destinationPortId'].reset();
    }
    else if (selectedModes.includes(3)) {
      this.SelectedLoadingPortId = null;
      this.SelectedDestinationPortId = null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calroad = 10000
      this.Calculation(calroad);
      this.orginPortDropDown = [];
      this.DestPortDropDown = [];
      this.RfqgeneralForm.controls['loadingPortId'].reset();
      this.RfqgeneralForm.controls['destinationPortId'].reset();
      this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
    }
    else if (selectedModes.includes(4)) {
      this.SelectedLoadingPortId = null;
      this.SelectedDestinationPortId = null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calccurior = 5000
      this.Calculation(calccurior);
      this.orginPortDropDown = [];
      this.DestPortDropDown = [];
      this.RfqgeneralForm.controls['loadingPortId'].reset();
      this.RfqgeneralForm.controls['destinationPortId'].reset();
      this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
    }
  }


  Deletevendor(i: number) {
    if (i !== -1) {
      this.vendorList.splice(i, 1);
      this.vendorcontactlist.splice(i, 1);
      this.vendorAddresslist.splice(i, 1);
      this.vendorcontactFilterByIndex.splice(i, 1);
      this.vendorAddressFilterByIndex.splice(i, 1);

      this.vendorList = [...this.vendorList];
    }
  }


  getAirdrop() {
    this.Cservice.getAllAirport(this.livestatus).subscribe((res) => {
      this.airport = res


      const air = this.airport.map(res => {
        return {
          ...res,
          Id: res.airportId,
          name: res.airportName
        };
      });
      this.PortDropDown = [...air];

      this.filteredLoadingPorts = this.RfqgeneralForm.get('loadingPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterLoadingPorts(name) : this.PortDropDown?.slice()))
      );

      this.filteredDestinationPorts = this.RfqgeneralForm.get('destinationPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterDestinationPorts(name) : this.PortDropDown?.slice()))
      );

    })
  }

  getseadrop() {
    this.Cservice.getAllSeaport(this.livestatus).subscribe((res) => {
      this.seapoart = res
      const sea = this.seapoart.map(res => {
        return {
          ...res,
          Id: res.seaportId,
          name: res.seaportName
        };
      });
      this.PortDropDown = [...sea];
      this.filteredLoadingPorts = this.RfqgeneralForm.get('loadingPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterLoadingPorts(name) : this.PortDropDown?.slice()))
      );

      this.filteredDestinationPorts = this.RfqgeneralForm.get('destinationPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterDestinationPorts(name) : this.PortDropDown?.slice()))
      );
    })
  }

  private _filterLoadingPorts(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.PortDropDown.filter((port) =>
      port.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterDestinationPorts(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.PortDropDown.filter((port) =>
      port.name.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.RfqgeneralForm.controls["cargoTypeid"].setValue("");
    }

    return filterresult;
  }


  SaveRFQ(id: any) {
    debugger;
    if(id==1){
      const rfqDate = this.formatDate(this.RfqgeneralForm.controls['rfqDate'].value);
      if (rfqDate != null) {
        this.RfqgeneralForm.controls['rfqDate'].setErrors(null);
      }
  
     
      const expectedQuoteDate = this.formatDate(this.RfqgeneralForm.controls['expectedQuoteDate'].value);
     
        const RFQgneralpayload = {
          ...this.RfqgeneralForm.value,
          rfqNumber: this.RfqgeneralForm.controls["rfqNumber"].value,
          rfqAgainst: this.SelectedRfqAgainstId,
          refNumberId: this.SelectedRefNumberId,
          jobCategoryId: this.SelectedJobCategoryId,
          jobTypeId: this.SelectedJobTypeId,
          rfqDate: rfqDate,
          expectedQuoteDate: expectedQuoteDate != null ? expectedQuoteDate : null,
          originCountryId: this.SelectedOriginCountryId || this.getUnknownId("Country"),
          destCountryId: this.SelectedDestCountryId || this.getUnknownId("Country"),
          loadingPortId: this.SelectedLoadingPortId,
          destinationPortId: this.SelectedDestinationPortId,
          originLocationId: this.SelectedOriginLocationId,
          destLocationId: this.SelectedDestLocationId,
          trailerTypeId: this.SelectedTrailerTypeId,
          transportTypeId: this.SelectedTransportTypeId,
          shipmentTypeId: this.SelectedShipmentTypeId,
          containerTypeId: this.SelectedContainerTypeId,
          cargoTypeid: this.SelectedCargoTypeId,
          statusId: this.SelectedStatusId,
          //approvalStatusId: this.approvalStatusId,
  
          storageUomId: this.SelectedStorageUomId,
          updatedBy: 1,
        }
  
  
        const RFQPayload: RFQcombine = {
          rFQs: RFQgneralpayload,
          rfqTransportModes: this.RfqModeoftransport,
          rfqLineItems: this.ActiveLineitems,
          rfqCommoditys: this.RfqCommodity,
          rfqIncoTerms: this.RfqIncoTerm,
          rfqPackages: this.RFQPackage,
          rfqDocuments: this.ImageDataArray,
          rfqVendors: this.vendorList,
          rfqVendorContacts: this.vendorcontactlist,
        }
        console.log(RFQPayload);
        this.RFQS.CreateRFQ(RFQPayload).subscribe((res) => {
          const formData = new FormData();
          this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
          this.Fs.FileUpload(formData).subscribe({
            next: (res) => {
  
            },
            error: (error) => {
            }
          });
          var rfqid = res.rFQs.rfqId   
            Swal.fire({
              title: 'RFQ Saved Sucessfully.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(["/crm/transaction/rfqlist"]);
              } 
            })
            const parms = {
              MenuId: 62,
              currentUser: this.userId$,
              activityName: "Creation",
              id: res.rFQs.rfqId,
              code: res.rFQs.rfqNumber
            }
            this.Ns.TriggerNotification(parms).subscribe((res => {
  
            }));
          
  
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
        }
      );

    }else if(id==2){
      const rfqDate = this.formatDate(this.RfqgeneralForm.controls['rfqDate'].value);
      if (rfqDate != null) {
        this.RfqgeneralForm.controls['rfqDate'].setErrors(null);
      }
  
      const noOfpkg = this.RfqgeneralForm.controls['packageNos'].value
      const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
      const count = this.RFQPackage.length;
      const expectedQuoteDate = this.formatDate(this.RfqgeneralForm.controls['expectedQuoteDate'].value);
      if (this.RfqgeneralForm.valid && this.vendorList.length > 0 && noOfpkgcount == count) {
        const RFQgneralpayload = {
          ...this.RfqgeneralForm.value,
          rfqNumber: this.RfqgeneralForm.controls["rfqNumber"].value,
          rfqAgainst: this.SelectedRfqAgainstId,
          refNumberId: this.SelectedRefNumberId,
          jobCategoryId: this.SelectedJobCategoryId,
          jobTypeId: this.SelectedJobTypeId,
          rfqDate: rfqDate,
          expectedQuoteDate: expectedQuoteDate != null ? expectedQuoteDate : null,
          originCountryId: this.SelectedOriginCountryId,
          destCountryId: this.SelectedDestCountryId,
          loadingPortId: this.SelectedLoadingPortId,
          destinationPortId: this.SelectedDestinationPortId,
          originLocationId: this.SelectedOriginLocationId,
          destLocationId: this.SelectedDestLocationId,
          trailerTypeId: this.SelectedTrailerTypeId,
          transportTypeId: this.SelectedTransportTypeId,
          shipmentTypeId: this.SelectedShipmentTypeId,
          containerTypeId: this.SelectedContainerTypeId,
          cargoTypeid: this.SelectedCargoTypeId,
          statusId: this.SelectedStatusId,
          //approvalStatusId: this.approvalStatusId,
  
          storageUomId: this.SelectedStorageUomId,
          updatedBy: 1,
        }
  
  
        const RFQPayload: RFQcombine = {
          rFQs: RFQgneralpayload,
          rfqTransportModes: this.RfqModeoftransport,
          rfqLineItems: this.ActiveLineitems,
          rfqCommoditys: this.RfqCommodity,
          rfqIncoTerms: this.RfqIncoTerm,
          rfqPackages: this.RFQPackage,
          rfqDocuments: this.ImageDataArray,
          rfqVendors: this.vendorList,
          rfqVendorContacts: this.vendorcontactlist,
        }
        console.log(RFQPayload);
        this.RFQS.CreateRFQ(RFQPayload).subscribe((res) => {
          const formData = new FormData();
          this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
          this.Fs.FileUpload(formData).subscribe({
            next: (res) => {
  
            },
            error: (error) => {
            }
          });
          var rfqid = res.rFQs.rfqId
          if (this.edit == true) {
            Swal.fire({
              title: 'RFQ Updated Sucessfully.',
              text: "Do you need to create Follow Up??",
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(["/crm/transaction/followup/4/", rfqid]);
              } else {
                this.router.navigate(["/crm/transaction/rfqlist"]);
              }
            })
            const parms = {
              MenuId: 62,
              currentUser: this.userId$,
              activityName: "Updation",
              id: res.rFQs.rfqId,
              code: res.rFQs.rfqNumber
            }
            this.Ns.TriggerNotification(parms).subscribe((res => {
  
            }));
          } else {
            Swal.fire({
              title: 'RFQ Saved Sucessfully.',
              text: "Do you need to create Follow Up??",
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(["/crm/transaction/followup/4/", rfqid]);
              } else {
                this.router.navigate(["/crm/transaction/rfqlist"]);
              }
            })
            const parms = {
              MenuId: 62,
              currentUser: this.userId$,
              activityName: "Creation",
              id: res.rFQs.rfqId,
              code: res.rFQs.rfqNumber
            }
            this.Ns.TriggerNotification(parms).subscribe((res => {
  
            }));
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
        }
      );
  
      } else {
        this.RfqgeneralForm.markAllAsTouched();
        this.changeTab(0);
        this.validateall(this.RfqgeneralForm);
        if (this.vendorList.length == 0) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill Vendor Details",
            showConfirmButton: false,
            timer: 2000,
          });
          this.changeTab(2);
        } else {
  
          const noOfpkg = this.RfqgeneralForm.controls['packageNos'].value
          const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
          const count = this.RFQPackage.length;
          const invalidControls = this.findInvalidControls();
          if (noOfpkgcount != count) {
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Package details is less when compared to No of packages.",
              showConfirmButton: true,
            });
            this.changeTab(1);
            return;
          } else
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
              showConfirmButton: true,
            });
  
            if(invalidControls?.includes("Rfq Date")){
              this.changeTab(0);
            } else {
              this.changeTab(1);
            }
        }
  
      }
    }
    
  }
  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.RfqgeneralForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(this.capitalizeWords(this.toUpperCaseAndTrimId(name)));
      }
    }
    return invalidControls;
  }
  getUnknownId(value: any) {
    let option = this.UnknownValueList.find(option => option?.name == value)
    return option?.id;
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

  reset() {
    if (this.edit = true) {
      var RfqID = this.RFQS.itemId;
      this.RFQS.GetAllRFQById(RfqID).subscribe(async (result: RFQcombine) => {
        this.SelectedRfqAgainstId = result.rFQs.rfqAgainst;
        this.SelectedRefNumberId = result.rFQs.refNumberId;
        this.SelectedJobCategoryId = result.rFQs.jobCategoryId;
        this.SelectedJobTypeId = result.rFQs.jobTypeId;
        this.SelectedOriginCountryId = result.rFQs.originCountryId;
        this.SelectedDestCountryId = result.rFQs.destCountryId;
        this.SelectedLoadingPortId = result.rFQs.loadingPortId;
        this.SelectedDestinationPortId = result.rFQs.destinationPortId;
        this.SelectedOriginLocationId = result.rFQs.originLocationId;
        this.SelectedDestLocationId = result.rFQs.destLocationId;
        this.SelectedTrailerTypeId = result.rFQs.trailerTypeId;
        this.SelectedTransportTypeId = result.rFQs.transportTypeId;
        this.SelectedShipmentTypeId = result.rFQs.shipmentTypeId;
        this.SelectedContainerTypeId = result.rFQs.containerTypeId;
        this.SelectedCargoTypeId = result.rFQs.cargoTypeid;
        this.SelectedStorageUomId = result.rFQs.storageUomId;
        this.SelectedStatusId = result.rFQs.statusId;
        //this.approvalStatusId = result.rFQs.approvalStatusId;



        this.ImageDataArray = result.rfqDocuments
        this.rfqdocument = result.rfqDocuments
        this.RFQPackage = result.rfqPackages
        this.vendorcontactlist = result.rfqVendorContacts
        //this.vendorAddresslist = result.rfqVendorAddresses
        this.RfqIncoTerm = result.rfqIncoTerms
        this.RfqCommodity = result.rfqCommoditys
        this.ActiveLineitems = result.rfqLineItems
        this.vendorList = result.rfqVendors
        this.vendorlist1 = result.rfqVendors
        this.RfqModeoftransport = result.rfqTransportModes


        this.Cservice.getAllCitiesbyCountry(result.rFQs.originCountryId).subscribe(res => {
          this.city = res
          console.log("this.city", this.city);
          this.filter();

        });





        this.Cservice.getAllCitiesbyCountry(result.rFQs.destCountryId).subscribe(res => {
          this.Destcity = res
          console.log("this.city", this.city);
          this.filter();

        });
        this.Jtype.getJobTypesByJobCatId(result.rFQs.jobCategoryId).subscribe((res => {
          this.jobtype = res;
          this.filter();

        }));


        const selectedtransportMode = this.RfqModeoftransport.map(val => val.transportModeId);
        this.RfqgeneralForm.controls['transportModeId'].setValue(selectedtransportMode);
        if (selectedtransportMode.includes(1) && selectedtransportMode.includes(3)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();
          this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
          this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();

        } else if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          this.airportflag = false;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = true
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();

          // if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
          //   // Set validators for mandatory fields when statusId is 1
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
          // } else {
          //   // Remove validators if statusId is not 2
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
          // }

          // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
        } else if (selectedtransportMode.includes(1)) {
          this.airportflag = true;
          this.fetch();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
          this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
        } else if (selectedtransportMode.includes(2)) {
          this.airportflag = false;
          this.fetch();
          // if (selectedtransportMode.includes(2)) {
          //   // Set validators for mandatory fields when statusId is 1
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.required]);
          // } else {
          //   // Remove validators if statusId is not 2
          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

          //   this.RfqgeneralForm.get('shipmentTypeId')?.setValue(null);
          // }

          // this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true
          this.chargablepackage = true;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();
        } else if (selectedtransportMode.includes(4)) {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
          this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
          this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
        }
        else {
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false
          this.RfqgeneralForm.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
          this.RfqgeneralForm.get('shipmentTypeId')?.updateValueAndValidity();
        }




        this.RfqgeneralForm.patchValue(result.rFQs);

        this.RfqgeneralForm.controls['rfqAgainst'].setValue(result.rFQs.rfqAgainstName);
        this.RfqgeneralForm.controls['refNumberId'].setValue(result.rFQs.refNumber);
        this.RfqgeneralForm.controls['jobCategoryId'].setValue(result.rFQs.jobCategoryName);
        this.RfqgeneralForm.controls['jobTypeId'].setValue(result.rFQs.jobTypeName);

        this.RfqgeneralForm.controls['originCountryId'].setValue(result.rFQs.orgincountryName);
        this.RfqgeneralForm.controls['destCountryId'].setValue(result.rFQs.destCountryname);
        this.RfqgeneralForm.controls['originLocationId'].setValue(result.rFQs.originLocationname);
        this.RfqgeneralForm.controls['destLocationId'].setValue(result.rFQs.destLocationName);
        this.RfqgeneralForm.controls['shipmentTypeId'].setValue(result.rFQs.shipmentType);
        this.RfqgeneralForm.controls['containerTypeId'].setValue(result.rFQs.containerTypeName);
        this.RfqgeneralForm.controls['trailerTypeId'].setValue(result.rFQs.trailerTypeName);
        this.RfqgeneralForm.controls['transportTypeId'].setValue(result.rFQs.transportType);

        this.RfqgeneralForm.controls['rfqDate'].setErrors(null);
        this.RfqgeneralForm.controls['expectedQuoteDate'].setErrors(null);
        this.RfqgeneralForm.controls['cargoTypeid'].setValue(result.rFQs.cargoType);
        this.RfqgeneralForm.controls['statusId'].setValue(result.rFQs.statusname);
        //this.RfqgeneralForm.controls['approvalStatusId'].setValue(result.rFQs);

        this.RfqgeneralForm.controls['temperatureReq'].setValue(result.rFQs.temperatureReq);
        this.RfqgeneralForm.controls['storageUomId'].setValue(result.rFQs.storageUomName);
        this.RfqgeneralForm.controls['updatedBy'].setValue(1);

        const selectedCommodity = this.RfqCommodity.map(val => val.commodityId);
        this.RfqgeneralForm.controls['commodityId'].setValue(selectedCommodity);

        const selectedIncoTerm = this.RfqIncoTerm.map(val => val.incoTermId);
        this.RfqgeneralForm.controls['incoTermId'].setValue(selectedIncoTerm);





        var setheader = this.optionSelectedJobCategoryId(result.rFQs.jobCategoryId);

      });

    } else {
      this.RfqgeneralForm.reset(),
        this.RFQDoc.reset(),
        this.RfqModeoftransport = [],
        this.RfqCommodity = [],
        this.RfqIncoTerm = [],
        this.RFQPackage = [],
        this.ImageDataArray = [],
        this.vendorList = [],
        this.vendorcontactlist = [],
        this.vendorAddresslist = [],
        this.RFQgenralForm();
      this.InitializeDoc();
      this.RfqgeneralForm.controls["rfqAgainst"].setValue(this.selectrfqagainsttxt);
      this.RfqgeneralForm.controls["refNumberId"].setValue(this.selectedrefnumbertxt);
      if (this.rfqlineitem.length > 0) {
        this.ActiveLineitems = this.rfqlineitem.filter(item => item.active === 1);
      } else {
        this.ActiveLineitems = this.standalonearraynew.filter(item => item.active === true);
      }
    }
  }

  getorginAirdropbycountryid(id: any) {
    this.Cservice.GetAllAirportByCountryId(id).subscribe((res) => {
      this.airport = res


      const air = this.airport.map(res => {
        return {
          ...res,
          Id: res.airportId,
          name: res.airportName
        };
      });
      this.orginPortDropDown = [...air];

      this.filteredLoadingPorts = this.RfqgeneralForm.get('loadingPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterLoadingPorts(name) : this.orginPortDropDown?.slice()))
      );

    })
  }

  getDestAirdropbycountryid(id: any) {
    this.Cservice.GetAllAirportByCountryId(id).subscribe((res) => {
      this.airport = res


      const air = this.airport.map(res => {
        return {
          ...res,
          Id: res.airportId,
          name: res.airportName
        };
      });
      this.DestPortDropDown = [...air];

      this.filteredDestinationPorts = this.RfqgeneralForm.get('destinationPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterDestinationPorts(name) : this.DestPortDropDown?.slice()))
      );

    })
  }

  getorginseadropbycountryid(id: any) {
    this.Cservice.GetAllSeaportByCountryId(id).subscribe((res) => {
      this.seapoart = res
      const sea = this.seapoart.map(res => {
        return {
          ...res,
          Id: res.seaportId,
          name: res.seaportName
        };
      });
      this.orginPortDropDown = [...sea];
      this.filteredLoadingPorts = this.RfqgeneralForm.get('loadingPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterLoadingPorts(name) : this.orginPortDropDown?.slice()))
      );
    })
  }

  getDestseadropbycountryid(id: any) {
    this.Cservice.GetAllSeaportByCountryId(id).subscribe((res) => {
      this.seapoart = res
      const sea = this.seapoart.map(res => {
        return {
          ...res,
          Id: res.seaportId,
          name: res.seaportName
        };
      });
      this.DestPortDropDown = [...sea];
      this.filteredDestinationPorts = this.RfqgeneralForm.get('destinationPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterDestinationPorts(name) : this.DestPortDropDown?.slice()))
      );
    })
  }


  //LineItem//
  AddLineItem() {
    if (!this.showAddRowLineItem) {
      const newRow = {
        lineItemId: '',
        lineItemName: '',
        select: false,
        IseditLineItem: true,
        createdBy: parseInt(this.userId$),
        updatedBy: parseInt(this.userId$),
      };
      this.standalonearray = [newRow, ...this.standalonearray];
      this.showAddRowLineItem = true;
    }
  }
  SaveLineItem(dataItem: any) {
    if (dataItem.lineItemName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    this.standalonearraynew.forEach(x => {
      if (x.lineItemName === dataItem.lineItemName) {
        this.existLineItem = true;
      }
    });
    if (this.existLineItem) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      dataItem.IseditLineItem = true;
      this.showAddRowLineItem = true;
      this.existLineItem = false;
      return
    } else {
      const value = {
        ...dataItem,
        lineItemId: this.SelectedLineItemId,
        lineItemName: this.selectedLineItemname,
        lineItemCategoryName: this.selectedLineItemCategoryname,
        IseditLineItem: false,
      }
      this.standalonearraynew.push(value);
      this.standalonearray = [...this.standalonearraynew];
      this.showAddRowLineItem = false;
      this.SelectedLineItemId = 0;
      this.selectedLineItemname = "";
    }
  }

  UpdateLineItem(dataItem: any, index: number) {
    if (dataItem.lineItemName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    this.standalonearraynew.forEach(x => {
      if (x.lineItemName === dataItem.lineItemName) {
        this.existLineItem = true;
      }
    });
    if (this.existLineItem) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      dataItem.IseditLineItem = true;
      this.showAddRowLineItem = true;
      this.existLineItem = false;
      return
    } else {
      if (this.SelectedLineItemId == 0 && this.selectedLineItemname == "") {
        const value = {
          ...dataItem,
          IseditLineItem: false,
        }
        //this.standalonearraynew.splice(index,1)
        this.standalonearraynew.splice(index, 0, value);
        this.standalonearray = [...this.standalonearraynew];
        this.showAddRowLineItem = false;
      } else {
        const value = {
          ...dataItem,
          lineItemId: this.SelectedLineItemId,
          lineItemName: this.selectedLineItemname,
          lineItemCategoryName: this.selectedLineItemCategoryname,
          IseditLineItem: false,
        }
        //this.standalonearraynew.splice(index,1)
        this.standalonearraynew.splice(index, 0, value);
        this.standalonearray = [...this.standalonearraynew];
        this.showAddRowLineItem = false;
        this.SelectedLineItemId = 0;
        this.selectedLineItemname = "";
      }
    }


  }

  EditLineItem(dataItem: any, index: number) {
    this.standalonearraynew.splice(index, 1);
    this.Editedarray = { ...dataItem }
    this.standalonearraynew.forEach((element) => {
      element.IseditLineItem = false;
    });
    dataItem.IseditLineItem = true;
    this.showAddRowLineItem = false;
    this.oncancel = true;
  }

  DeleteLineItem(dataItem: any, index: number) {
    this.standalonearraynew.splice(index, 1);
    this.standalonearray = [...this.standalonearraynew];
    this.showAddRowLineItem = false;

  }
  oncancelLineItem(dataItem: any, index: number) {
    if (this.oncancel) {
      //this.standalonearraynew.splice(index,1)
      this.standalonearraynew.splice(index, 0, this.Editedarray);
      this.standalonearray = [...this.standalonearraynew];
      this.showAddRowLineItem = false;
    } else {
      this.standalonearray.splice(index, 1);
      this.standalonearray = [...this.standalonearray];
      this.showAddRowLineItem = false;
    }
  }
  ValidateFieldLine(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }


  returntolist() {
    if (this.Eservice.Fromenq == true) {
      this.router.navigate(["/crm/transaction/enquirylist"]);
      this.Eservice.Fromenq = false;
    } else {
      this.router.navigate(["/crm/transaction/rfqlist"]);
      this.Eservice.Fromenq = false;
    }
  }

  Calculation(value: number) {
    this.RFQPackage = this.RFQPackage.map(pkg => {
      return {
        ...pkg,
        cbm: parseFloat((pkg.length * pkg.breadth * pkg.height).toFixed(2)),
        chargePackWtKg: parseFloat((pkg.length * pkg.breadth * pkg.height / value).toFixed(2))
      };
    });
  }
  toggleSelectAll(event: any): void {
    const checked = event.checked;
    if (checked) {
      this.rfqlineitem.forEach(item => {
        item.active = 1;
        this.checked = true;
        //this.checkAllActive();
        this.selectall = true;
      });
    } else {
      this.rfqlineitem.forEach(item => {
        item.active = 0;
        this.checked = false;
        this.selectall = true;
        //this.checkAllActive();
      });
    }
  }

  show(event: any): void {
    var filePath = this.Filepath + event
    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jfif') {
      this.dialog.open(this.imagePreview, { data: filePath });
    } else {
      window.open(filePath, '_blank');
    }
  }

  isAllowedExtension(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return this.allowedExtensions.includes(extension || '');
  }

  isOptionDisabled(option: any): any {
    if (this.SelectedStatusId == 1) {
      this.isDraft = false;
      return !(option.rfqStatusId === 1 || option.rfqStatusId === 2);
    } else if (this.SelectedStatusId == 2) {
      this.isDraft = false;
      return !(option.rfqStatusId === 2);
    }
    else if (this.SelectedStatusId == 3) {
      this.isDraft = false;
      return !(option.rfqStatusId === 3);
    }
    else if (this.SelectedStatusId == 4) {
      this.isDraft = true;
      return !(option.rfqStatusId === 4);
    }
  }
}
