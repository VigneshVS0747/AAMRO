import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs';
import { Airport } from 'src/app/Models/crm/master/Airport';
import { ApprovalStatusModel, CargoTypes, Intrestlevel, ModeofTransports, ShipmentTypes, Transport } from 'src/app/Models/crm/master/Dropdowns';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { Reason } from 'src/app/Models/crm/master/Reason';
import { Seaport } from 'src/app/Models/crm/master/Seaport';
import { TrailerType } from 'src/app/Models/crm/master/trailerType';
import { CustomerCategory } from 'src/app/Models/crm/master/transactions/CustomerCategory';
import { EnqPackage } from 'src/app/Models/crm/master/transactions/EnquiryPackage';
import { EnquiryStatus } from 'src/app/Models/crm/master/transactions/Enquirystatus';
import { SalesFunnel } from 'src/app/Models/crm/master/transactions/SalesFunnels';
import { City } from 'src/app/Models/ums/city.model';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { ContainerType } from 'src/app/crm/master/containertype/containertype.model';
import { ContainerTypeService } from 'src/app/crm/master/containertype/containertype.service';
import { Customer, CustomerAddress, CustomerContact } from 'src/app/crm/master/customer/customer.model';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { InfosourceService } from 'src/app/crm/master/infosource/infosource.service';
import { JobCategory, JobTypeGeneral, JTModeofTransport } from 'src/app/crm/master/jobtype/jobtypemodel.model';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { PotentialCustomer, PotentialCustomerAddress, PotentialCustomerContact } from 'src/app/crm/master/potential-customer/potential-customer.model';
import { PotentialCustomerService } from 'src/app/crm/master/potential-customer/potential-customer.service';
import { TrailerTypeService } from 'src/app/crm/master/trailer-type/trailer-type.service';
import { UOM } from 'src/app/crm/master/unitofmeasure/unitofmeasure.model';
import { UOMsService } from 'src/app/crm/master/unitofmeasure/unitofmeasure.service';
import { CommonService } from 'src/app/services/common.service';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { Employee } from 'src/app/ums/masters/employee/employee.model';
import Swal from 'sweetalert2';
import { EnqpackageDialogComponent } from './enqpackage-dialog/enqpackage-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EnqCommodity, EnqContact, EnqIncoTerm, EnquiryCombine } from 'src/app/Models/crm/master/transactions/Enquiry';
import { packagetypeService } from 'src/app/crm/master/packagetype/packagetype.service';
import { PackageType } from 'src/app/crm/master/packagetype/packagetype.model';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import { EnquiryService } from '../enquiry.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { saveAs } from 'file-saver';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { environment } from 'src/environments/environment.development';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EnquiryComponent implements OnInit {


  Enquiry: FormGroup;
  IncoForm: FormGroup;
  TransportForm: FormGroup;
  CommodityForm: FormGroup;
  ContactForm: FormGroup;
  EnqDoc: FormGroup;
  CustomerCategory: CustomerCategory[] = [];
  maxDate: Date = new Date();
  skip = 0;
  pageSize = 10;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>; 
  Filepath = environment.Fileretrive;
  allowedExtensions: string[] = ['jpg', 'png'];
  filteredCustomerCategory: Observable<CustomerCategory[]> | undefined;
  filteredCustomerName: Observable<any[]> | undefined;
  filteredAddresses: Observable<PotentialCustomerAddress[]> | undefined;
  filteredSalesOwners: Observable<Employee[]> | undefined;
  filteredSalesExecutives: Observable<Employee[]> | undefined;
  filteredJobCategories: Observable<JobCategory[]> | undefined;
  filteredJobTypes: Observable<JobTypeGeneral[]> | undefined;
  filteredModeofTransports: Observable<ModeofTransports[]> | undefined;
  filteredInterestLevels: Observable<Intrestlevel[]> | undefined;

  filteredSalesFunnels: Observable<SalesFunnel[]> | undefined;

  filteredStatuses: Observable<EnquiryStatus[]> | undefined;
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

  filteredCargoTypes: Observable<CargoTypes[]> | undefined;

  filteredInformationSources: Observable<Infosource[]> | undefined;

  filteredReasons: Observable<Reason[]> | undefined;
  filteredStorageUoms: Observable<UOM[]> | undefined;

  filtereddocumentId: Observable<Documents[]> | undefined;

  SelectedcustcatId: number;
  Livestatus = 1;
  Employee: Employee[] = [];
  SelectedCustomerId: number;
  PotentialCustomer: PotentialCustomer[] = [];
  Customer: Customer[] = [];
  CustDropDown: any[] = [];
  filteredCustomer: any;

  potentialCustomerContacts: PotentialCustomerContact[] = [];
  potentialCustomerAddress: PotentialCustomerAddress[] = [];
  SelectedAddressId: number;
  customerContact: any[] = [];
  customerAddress: any[] = [];
  SelectedSalesOwnerId: number;
  SelectedSalesExecutiveId: number;
  jobCategory: JobCategory[] = [];
  SelectedJobCategoryId: number;
  jobtype: JobTypeGeneral[] = [];
  SelectedJobTypeId: number;
  Modeoftrasport: ModeofTransports[] = [];
  SelectedModeofTransportId: number;
  intrestlevel: Intrestlevel[] = [];
  SelectedInterestLevelId: number;
  EnquiryStatus: EnquiryStatus[] = [];
  SelectedStatusId: number;
  salesFunnels: SalesFunnel[] = [];
  SelectedSalesFunnelId: number;
  country: Country[] = [];
  SelectedOriginCountryId: any;
  SelectedDestCountryId: any;
  city: City[] = [];
  SelectedOriginLocationId: any;
  SelectedDestLocationId: any;
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
  EnqPackage: EnqPackage[] = [];
  EnqCommodity: EnqCommodity[] = [];
  date = new Date()
  EnqIncoTerm: EnqIncoTerm[] = [];
  Contactperson: EnqContact[] = [];
  package: PackageType[] = [];
  ContactDropDown: any[] = [];
  CAdressDropDown: any[] = [];
  document: Documents[] = [];
  SelectedDocumentId: number;
  DocRemarks: string;
  ImageDetailsArray: any[] = [];
  ImageDataArray: any[] = [];
  disablefields: boolean = false;
  ShowUpdate: boolean;
  Showsave: boolean;
  ShowReset: boolean;
  titile: string;
  ImageStore: any;
  Showpakageheader: boolean = false;
  chargablepackage: boolean;
  Addresslink: any;
  contactlink: string;
  selectedinfosource: string;
  showrefencedetail: boolean;
  orginPortDropDown: any[] = [];
  DestPortDropDown: any[] = [];
  airportflag: boolean;
  showinput: boolean;
  showtable: boolean;
  Enqdocument: any[] = [];
  showAddRowDoc: boolean;
  Isedit: boolean;
  userId$: string;
  edit: boolean = false;
  Destcity: City[] = [];
  seapoartflag: boolean;
  showclose: boolean;
  showewdirectbutton: boolean = false;
  Link: string;
  EditedEnquiry: number;
  selectedAddressname: string | undefined;
  JobtypeModeoftans: JTModeofTransport[]=[];
  jobtypeIncoTerms: number;
  EnqModeoftransport: any[]=[];
  addDate= new Date();
  isEditDocument: boolean;
  UnknownValueList: any[]=[];
  selectedIndex = 0;

  constructor(private fb: FormBuilder,
    private Cservice: CommonService,
    private PCs: PotentialCustomerService,
    private Cus: CustomerService,
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
    private ErrorHandling: ErrorhandlingService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private potentialCustomerSvc: PotentialCustomerService,
    private customerService: CustomerService,
    private UserIdstore: Store<{ app: AppState }>,
    private Fs:FileuploadService,
    private Ns:NofificationconfigurationService,
    private errorHandler: ApiErrorHandlerService

  ) {
    this.fetchDropDownData();
  }

  ngOnInit(): void {
    this.titile = "New Enquiry"
    this.GetUserId();
    this.add30Days();
    this.initializeForm();
    this.InitializeDoc();
   // this.GetAllApprovalStatus();
    this.getUnknownValues();
    // Disable future dates
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.Enquiry.controls["statusId"].setValue("Draft");
    if (this.edit == false) {
      this.SelectedStatusId = 4;
    }
  }


  //INVALID CONTROLS//
  getInvalidRequiredFields() {
    debugger
    const invalidFields: string[] = [];
  
    // Loop over form controls
    Object.keys(this.Enquiry.controls).forEach(key => {
      const control = this.Enquiry.get(key);
      
      // Check if the control is required and invalid
      if (control?.invalid) {
        console.log("control?.invalid",key)  // Collect the field name
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

  initializeForm() {
    const currentDate = new Date();
    this.Enquiry = this.fb.group({
      enquiryId: [0],
      enquiryNumber: [{ value: '', disabled: true }],
      enquiryDate: [currentDate, Validators.required],
      customerCategoryId: ['', Validators.required],
      customerId: ['', Validators.required],
      email: [null, Validators.email],
      phone: [null],
      addressId: [null],
      contactId: [null, Validators.required],
      salesOwnerId: ['', Validators.required],
      salesExecutiveId: [null],
      jobCategoryId: ['', Validators.required],
      jobTypeId: ['', Validators.required],
      modeofTransportId: [null],
      interestLevelId: [null],
      informationSourceId: [null],
      referenceDetail: [null],
      expectedClosingDate: [this.addDate],
      statusId: ['', Validators.required],
      //approvalStatusId:[null],
      reasonId: [null],
      closedRemarks: [null],
      validityPeriod: [null],
      remarks: [null],
      tags: [null],
      originCountryId: [null,Validators.required],
      destCountryId: [null,Validators.required],
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
      incoTermId: [null],
      temperatureReq: [null],
      commodityId: [null],
      storageUomId: [null],
      valuePerUom: [null],
      packageNos: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [currentDate],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [currentDate]
    });
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
        this.Enquiry.controls['expectedClosingDate'].setValue(newDate)
      }
    }


  async EditMode() {
    var Path = this.router.url;
    if (Path == "/crm/transaction/enquiry/edit/" + this.route.snapshot.params["id"]) {
      this.edit = true;
      this.titile = "Update Enquiry";
      this.disablefields = false;
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
      this.showewdirectbutton=true;
      this.EnqS.GetAllEnquiryById(this.route.snapshot.params["id"])
        .subscribe(async (result: EnquiryCombine) => {
          this.Jtype.getJobTypesByJobCatId(result.enquiryGeneral.jobCategoryId).subscribe((res => {
            this.jobtype = res;
            this.Filters();
            this.optionSelectedCustomerNameId(result.enquiryGeneral.customerId);
          }));
          //this.Enquiry.controls['approvalStatusId'].setValue(result.enquiryGeneral)
          this.EditedEnquiry=result.enquiryGeneral.enquiryId
          this.SelectedcustcatId = result.enquiryGeneral.customerCategoryId
          this.SelectedCustomerId = result.enquiryGeneral.customerId
         
          this.SelectedModeofTransportId = result.enquiryGeneral.modeofTransportId
          this.SelectedOriginCountryId = result.enquiryGeneral.originCountryId
          this.SelectedDestCountryId = result.enquiryGeneral.destCountryId
          this.SelectedOriginLocationId = result.enquiryGeneral.originLocationId
          this.SelectedDestLocationId = result.enquiryGeneral.destLocationId
          this.SelectedSalesOwnerId = result.enquiryGeneral.salesOwnerId;
          this.SelectedSalesExecutiveId = result.enquiryGeneral.salesExecutiveId;
          this.SelectedJobCategoryId=result.enquiryGeneral.jobCategoryId;


          this.optionSelectedJobCategoryId(result.enquiryGeneral.jobCategoryId);
          this.SelectedJobTypeId = result.enquiryGeneral.jobTypeId;
          this.optionSelectedModeofTransportId(result.enquiryGeneral.modeofTransportId),
          this.SelectedInterestLevelId = result.enquiryGeneral.interestLevelId;
          this.SelectedInformationSourceId = result.enquiryGeneral.informationSourceId;
          this.optionSelectedInformationSourceId(result.enquiryGeneral.informationSourceId);
          this.SelectedStatusId = result.enquiryGeneral.statusId;
          //this.approvalStatusId = result.enquiryGeneral.approvalStatusId;

          this.SelectedReasonId = result.enquiryGeneral.reasonId;
          this.SelectedTrailerTypeId = result.enquiryGeneral.trailerTypeId;
          this.SelectedTransportTypeId = result.enquiryGeneral.transportTypeId;
          this.SelectedShipmentTypeId = result.enquiryGeneral.shipmentTypeId;
          this.SelectedContainerTypeId = result.enquiryGeneral.containerTypeId;
          this.SelectedCargoTypeId = result.enquiryGeneral.cargoTypeid;
          this.SelectedStorageUomId = result.enquiryGeneral.storageUomId;
          this.SelectedAddressId = result.enquiryGeneral.addressId;
          this.selectedAddressname =result.enquiryGeneral.addressName
          await this.getdropsvalue();
          this.Enquiry.patchValue({
            enquiryId: result.enquiryGeneral.enquiryId,
            enquiryNumber: result.enquiryGeneral.enquiryNumber,
            enquiryDate: result.enquiryGeneral.enquiryDate,
            customerCategoryId: result.enquiryGeneral.customercategory,
            customerId: result.enquiryGeneral.customerName,
            email: result.enquiryGeneral.email,
            phone: result.enquiryGeneral.phone,
            addressId: result.enquiryGeneral.addressName,
            contactId: result.contacts.map(id => id.contactId),
            salesOwnerId: result.enquiryGeneral.salesOwnerName,
            salesExecutiveId: result.enquiryGeneral.salesExecutiveName,
            jobCategoryId: result.enquiryGeneral.jobCategory,
            jobTypeId: result.enquiryGeneral.jobTypeName,
            modeofTransportId: result.enqTransportModes.map(id=>id.transportModeId),
            interestLevelId:result.enquiryGeneral.interestlevel,
            informationSourceId: result.enquiryGeneral.informationSourceName,
            referenceDetail: result.enquiryGeneral.referenceDetail,
            // salesFunnelId: this.optionSelectedSalesFunnelId(result.enquiryGeneral.salesFunnelId),
            expectedClosingDate: result.enquiryGeneral.expectedClosingDate,
            statusId:result.enquiryGeneral.enquiryStatus,
            reasonId: result.enquiryGeneral.reasonName,
            closedRemarks: result.enquiryGeneral.closedRemarks,
            validityPeriod: result.enquiryGeneral.validityPeriod,
            remarks: result.enquiryGeneral.remarks,
            tags: result.enquiryGeneral.tags,
            originCountryId: this.optionSelectedOriginCountryId(result.enquiryGeneral.originCountryId),
            destCountryId: this.optionSelectedDestCountryId(result.enquiryGeneral.destCountryId),
            loadingPortId: this.optionSelectedLoadingPortId(result.enquiryGeneral.loadingPortId),
            destinationPortId: this.optionSelectedDestinationPortId(result.enquiryGeneral.destinationPortId),
            originLocationId: this.optionSelectedOriginLocationId(result.enquiryGeneral.originLocationId),
            destLocationId: this.optionSelectedDestLocationId(result.enquiryGeneral.destLocationId),
            trailerTypeId: result.enquiryGeneral.trailerTypeName,
            transportTypeId: result.enquiryGeneral.transportType,
            pickUpLocation: result.enquiryGeneral.pickUpLocation,
            deliveryPlace: result.enquiryGeneral.deliveryPlace,
            shipmentTypeId: result.enquiryGeneral.shipmentType,
            containerTypeId: result.enquiryGeneral.containerTypeName,
            cargoTypeid: result.enquiryGeneral.cargoType,
            incoTermId: result.incoTerms.map(id => id.incoTermId),
            temperatureReq: result.enquiryGeneral.temperatureReq,
            commodityId: result.commodity.map(id => id.commodityId),
            storageUomId:result.enquiryGeneral.uomName,
            valuePerUom: result.enquiryGeneral.valuePerUom,
            packageNos: result.enquiryGeneral.packageNos,
            createdBy: result.enquiryGeneral.createdBy,
            createdDate: result.enquiryGeneral.createdDate,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.date

          });
          var trns = result.enqTransportModes.map(id=>id.transportModeId);
          this.Enquiry.controls['modeofTransportId'].setValue(trns);
          this.transportSelectedoption();
          this.Contactperson = result.contacts;
          this.EnqIncoTerm = result.incoTerms;
          this.EnqCommodity = result.commodity;
          this.EnqPackage = result.package;
          this.ImageDataArray = result.documents;
          this.Enqdocument = result.documents;
          this.EnqModeoftransport = result.enqTransportModes;
          this.Enquiry.controls['enquiryDate'].setErrors(null);
          this.Enquiry.controls['expectedClosingDate'].setErrors(null);

          const selectedtransportMode = this.EnqModeoftransport.map(val => val.transportModeId);
        this.Enquiry.controls['modeofTransportId'].setValue(selectedtransportMode);
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
          this.seapoartflag = true;
          this.fetch();
          this.ShowOnlyroad = true;
          this.ShowOnlysea = true
          this.chargablepackage = false;
          //this.RfqgeneralForm.controls['loadingPortId'].reset();
          //this.RfqgeneralForm.controls['destinationPortId'].reset();

         //if (selectedtransportMode.includes(2) && selectedtransportMode.includes(3)) {
            // Set validators for mandatory fields when statusId is 1
           // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
          //} else {
            // Remove validators if statusId is not 2
            //this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

           // this.Enquiry.get('shipmentTypeId')?.setValue(null);
         // }

         //this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
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
          this.seapoartflag = true;
          this.fetch();
          if (selectedtransportMode.includes(2)) {
            // Set validators for mandatory fields when statusId is 1
            //this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
          } else {
            // Remove validators if statusId is not 2
            //this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

            //this.Enquiry.get('shipmentTypeId')?.setValue(null);
          }

          //this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
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

    //Document From Document Mapping
    if(Path !== "/crm/transaction/enquiry/edit/" + this.route.snapshot.params["id"] && Path !== "/crm/transaction/enquiry/view/" + this.route.snapshot.params["id"]){
      this.EnqS.GetAllDocumentMappingByScreenId(11).subscribe(res => {
        if (res) {
          this.Enqdocument = res.map((ele:any) => {
            return {
              enquiryDocumentId: 0,
              enquiryId: 0,
              documentId: ele.documentId,
              documentName: '',
              remarks: "",
              createdBy: parseInt(this.userId$),
              createdDate: this.date,
              Isedit: false
            };
          });
          this.Enqdocument = [...this.Enqdocument];
          this.ImageDataArray = [...this.Enqdocument];
        }
        console.log(this.Enqdocument)
      });
    }
  }

  fetch() {
    const Cities$ = this.Cservice.getAllCitiesbyCountry(this.SelectedOriginCountryId);
    const CityDest$ = this.Cservice.getAllCitiesbyCountry(this.SelectedDestCountryId);
    const orginair$ = this.Cservice.GetAllAirportByCountryId(this.SelectedOriginCountryId);
    const destair$ = this.Cservice.GetAllAirportByCountryId(this.SelectedDestCountryId);
    const orginsea$ = this.Cservice.GetAllSeaportByCountryId(this.SelectedOriginCountryId);
    const destsea$ = this.Cservice.GetAllSeaportByCountryId(this.SelectedDestCountryId);



    forkJoin([Cities$, CityDest$, orginair$, destair$, orginsea$, destsea$]).subscribe({
      next: ([Cities, CityDest, orginairs, destair, orginsea, destsea]) => {

        this.city = Cities;
        this.Destcity = CityDest;

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

          this.filteredLoadingPorts = this.Enquiry.get('loadingPortId')?.valueChanges.pipe(
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

          this.filteredDestinationPorts = this.Enquiry.get('destinationPortId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterDestinationPorts(name) : this.DestPortDropDown?.slice()))
          );
          var setloadingPortId = this.optionSelectedLoadingPortId(this.SelectedLoadingPortId);
          this.Enquiry.controls['loadingPortId'].setValue(setloadingPortId);
          var setdestinationPortId = this.optionSelectedDestinationPortId(this.SelectedDestinationPortId);
          this.Enquiry.controls['destinationPortId'].setValue(setdestinationPortId);
        } else if (this.seapoartflag) {
          this.seapoart = orginsea
          const sea = this.seapoart.map(res => {
            return {
              ...res,
              Id: res.seaportId,
              name: res.seaportName
            };
          });
          this.orginPortDropDown = [...sea];
          this.filteredLoadingPorts = this.Enquiry.get('loadingPortId')?.valueChanges.pipe(
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
          this.filteredDestinationPorts = this.Enquiry.get('destinationPortId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterDestinationPorts(name) : this.DestPortDropDown?.slice()))
          );
          var setloadingPortId = this.optionSelectedLoadingPortId(this.SelectedLoadingPortId);
          this.Enquiry.controls['loadingPortId'].setValue(setloadingPortId);
          var setdestinationPortId = this.optionSelectedDestinationPortId(this.SelectedDestinationPortId);
          this.Enquiry.controls['destinationPortId'].setValue(setdestinationPortId);
        }
        var orginLocation = this.optionSelectedOriginLocationId(this.SelectedOriginLocationId);
        this.Enquiry.controls['originLocationId'].setValue(orginLocation);
        var Destlocation = this.optionSelectedDestLocationId(this.SelectedDestLocationId);
        this.Enquiry.controls['destLocationId'].setValue(Destlocation);
       
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  ViewMode() {
    var Path = this.router.url;
    if (Path == "/crm/transaction/enquiry/view/" + this.route.snapshot.params["id"]) {
      this.titile = "View Enquiry";
      this.edit = true;
      this.disablefields = true;
      this.ShowUpdate = false;
      this.Showsave = false;
      this.ShowReset = false;
      this.EnqS.GetAllEnquiryById(this.route.snapshot.params["id"])
      .subscribe(async (result: EnquiryCombine) => {

        this.Jtype.getJobTypesByJobCatId(result.enquiryGeneral.jobCategoryId).subscribe((res => {
          this.jobtype = res;
          this.Filters();
          this.optionSelectedCustomerNameId(result.enquiryGeneral.customerId);
        }));
        //this.Enquiry.controls['approvalStatusId'].setValue(result.enquiryGeneral)

        this.EditedEnquiry=result.enquiryGeneral.enquiryId
        this.SelectedcustcatId = result.enquiryGeneral.customerCategoryId
        this.SelectedCustomerId = result.enquiryGeneral.customerId
       
        this.SelectedModeofTransportId = result.enquiryGeneral.modeofTransportId
        this.SelectedOriginCountryId = result.enquiryGeneral.originCountryId
        this.SelectedDestCountryId = result.enquiryGeneral.destCountryId
        this.SelectedOriginLocationId = result.enquiryGeneral.originLocationId
        this.SelectedDestLocationId = result.enquiryGeneral.destLocationId
        this.SelectedSalesOwnerId = result.enquiryGeneral.salesOwnerId;
        this.SelectedSalesExecutiveId = result.enquiryGeneral.salesExecutiveId;
        this.SelectedJobCategoryId=result.enquiryGeneral.jobCategoryId;


        this.optionSelectedJobCategoryId(result.enquiryGeneral.jobCategoryId);
        this.SelectedJobTypeId = result.enquiryGeneral.jobTypeId;
        this.optionSelectedModeofTransportId(result.enquiryGeneral.modeofTransportId),
        this.SelectedInterestLevelId = result.enquiryGeneral.interestLevelId;
        this.SelectedInformationSourceId = result.enquiryGeneral.informationSourceId;
        this.optionSelectedInformationSourceId(result.enquiryGeneral.informationSourceId);
        this.SelectedStatusId = result.enquiryGeneral.statusId;
       // this.approvalStatusId = result.enquiryGeneral.approvalStatusId;
        this.SelectedReasonId = result.enquiryGeneral.reasonId;
        this.SelectedTrailerTypeId = result.enquiryGeneral.trailerTypeId;
        this.SelectedTransportTypeId = result.enquiryGeneral.transportTypeId;
        this.SelectedShipmentTypeId = result.enquiryGeneral.shipmentTypeId;
        this.SelectedContainerTypeId = result.enquiryGeneral.containerTypeId;
        this.SelectedCargoTypeId = result.enquiryGeneral.cargoTypeid;
        this.SelectedStorageUomId = result.enquiryGeneral.storageUomId;
        this.SelectedAddressId = result.enquiryGeneral.addressId;
        this.selectedAddressname =result.enquiryGeneral.addressName
        await this.getdropsvalue();
        this.Enquiry.patchValue({
          enquiryId: result.enquiryGeneral.enquiryId,
          enquiryNumber: result.enquiryGeneral.enquiryNumber,
          enquiryDate: result.enquiryGeneral.enquiryDate,
          customerCategoryId: result.enquiryGeneral.customercategory,
          customerId: result.enquiryGeneral.customerName,
          email: result.enquiryGeneral.email,
          phone: result.enquiryGeneral.phone,
          addressId: result.enquiryGeneral.addressName,
          contactId: result.contacts.map(id => id.contactId),
          salesOwnerId: result.enquiryGeneral.salesOwnerName,
          salesExecutiveId: result.enquiryGeneral.salesExecutiveName,
          jobCategoryId: result.enquiryGeneral.jobCategory,
          jobTypeId: result.enquiryGeneral.jobTypeName,
          modeofTransportId: result.enqTransportModes.map(id=>id.transportModeId),
          interestLevelId:result.enquiryGeneral.interestlevel,
          informationSourceId: result.enquiryGeneral.informationSourceName,
          referenceDetail: result.enquiryGeneral.referenceDetail,
          // salesFunnelId: this.optionSelectedSalesFunnelId(result.enquiryGeneral.salesFunnelId),
          expectedClosingDate: result.enquiryGeneral.expectedClosingDate,
          statusId:result.enquiryGeneral.enquiryStatus,
          reasonId: result.enquiryGeneral.reasonName,
          closedRemarks: result.enquiryGeneral.closedRemarks,
          validityPeriod: result.enquiryGeneral.validityPeriod,
          remarks: result.enquiryGeneral.remarks,
          tags: result.enquiryGeneral.tags,
          originCountryId: this.optionSelectedOriginCountryId(result.enquiryGeneral.originCountryId),
          destCountryId: this.optionSelectedDestCountryId(result.enquiryGeneral.destCountryId),
          loadingPortId: this.optionSelectedLoadingPortId(result.enquiryGeneral.loadingPortId),
          destinationPortId: this.optionSelectedDestinationPortId(result.enquiryGeneral.destinationPortId),
          originLocationId: this.optionSelectedOriginLocationId(result.enquiryGeneral.originLocationId),
          destLocationId: this.optionSelectedDestLocationId(result.enquiryGeneral.destLocationId),
          trailerTypeId: result.enquiryGeneral.trailerTypeName,
          transportTypeId: result.enquiryGeneral.transportType,
          pickUpLocation: result.enquiryGeneral.pickUpLocation,
          deliveryPlace: result.enquiryGeneral.deliveryPlace,
          shipmentTypeId: result.enquiryGeneral.shipmentType,
          containerTypeId: result.enquiryGeneral.containerTypeName,
          cargoTypeid: result.enquiryGeneral.cargoType,
          incoTermId: result.incoTerms.map(id => id.incoTermId),
          temperatureReq: result.enquiryGeneral.temperatureReq,
          commodityId: result.commodity.map(id => id.commodityId),
          storageUomId:result.enquiryGeneral.uomName,
          valuePerUom: result.enquiryGeneral.valuePerUom,
          packageNos: result.enquiryGeneral.packageNos,
          createdBy: result.enquiryGeneral.createdBy,
          createdDate: result.enquiryGeneral.createdDate,
          updatedBy: parseInt(this.userId$),
          updatedDate: this.date

        });
        var trns = result.enqTransportModes.map(id=>id.transportModeId);
        this.Enquiry.controls['modeofTransportId'].setValue(trns);
        this.transportSelectedoption();
        this.Contactperson = result.contacts;
        this.EnqIncoTerm = result.incoTerms;
        this.EnqCommodity = result.commodity;
        this.EnqPackage = result.package;
        this.ImageDataArray = result.documents;
        this.Enqdocument = result.documents;
        this.EnqModeoftransport = result.enqTransportModes;
        this.Enquiry.controls['enquiryDate'].setErrors(null);
        this.Enquiry.controls['expectedClosingDate'].setErrors(null);

        if (result.enquiryGeneral.modeofTransportId) {
          switch (result.enquiryGeneral.modeofTransportId) {
            case 1:
              this.airportflag = true;
              this.fetch();
              break;
            case 2:
              this.seapoartflag = true;
              this.fetch();
              break;
            default:
              this.fetch();
          }
        }
      });
    }
  }


  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.isEditDocument = false;
    this.EnqDoc.controls['documentId'].reset();
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRowDoc) {
      const Value = {
        ...this.EnqDoc.value,
        documentName: "",
        remarks: this.DocRemarks,
        documentId: this.SelectedDocumentId,
        createdBy: 1,
        createdDate: this.date,
        Isedit: true
      }
      //this.ImageDataArray.push(Value);
      this.Enqdocument = [Value, ...this.Enqdocument];
      this.showAddRowDoc = true;
    }

    //this.showtable = false;
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  fetchDropDownData() {
    const Custcat$ = this.Cservice.getAllCustomerCategory();
    const Employee$ = this.Cservice.getEmployees(this.Livestatus);
    const Jobtypecat$ = this.Jtype.GetAllJobCategory();
    const Modeoftrns$ = this.Cservice.getAllModeofTransport();
    const Intrest$ = this.Cservice.getAllInterest();

    const Enquirystat$ = this.Cservice.getAllEnquiryStatus();

    const SalesFunnels$ = this.Cservice.getAllSalesFunnels();

    const Country$ = this.Country.getAllCountries(this.Livestatus);


    const trailer$ = this.Strailer.GetAllTrailerType(this.Livestatus);

    const trnstype$ = this.Cservice.getAllTransportType();

    const Shipmenttype$ = this.Cservice.GetAllShipmentTypes();
    const Containertype$ = this.ConType.getAllActiveContainerType();

    const cargo$ = this.Cservice.getAllCargo();

    const Incoterms$ = this.Sinco.getIncoterms(this.Livestatus);

    const Comodity$ = this.SCamodity.getAllActiveCommodity();

    const Infosource$ = this.Sinfosource.getInfosource(this.Livestatus);

    const Reason$ = this.Sreason.getAllReason(this.Livestatus);

    const UomStorage$ = this.uomService.getAllActiveUOM();
    const Package$ = this.packagetypeServices.getAllActivePackagetype()
    const Doc$ = this.docs.getDocuments(this.Livestatus);
    const PotentialC$ = this.PCs.getAllActivePotentialCustomer();
    const Cust$ = this.Cus.getAllActiveCustomer();
    const Airport$ = this.Cservice.getAllAirport(this.Livestatus);
    const Allsea$ = this.Cservice.getAllSeaport(this.Livestatus);
    




    forkJoin([Allsea$, Airport$, Cust$, PotentialC$, Doc$, Custcat$, Employee$, Jobtypecat$, Modeoftrns$, Intrest$, Enquirystat$, SalesFunnels$, Country$, trailer$, trnstype$, Shipmenttype$, Containertype$, cargo$, Incoterms$, Comodity$, Infosource$, Reason$, UomStorage$, Package$]).subscribe({
      next: ([Allsea, Airport, Cust, PotentialC, Doc, Custcat, Employee, Jobtypecat, Modeoftrns, Intrest, Enquirystat, SalesFunnels, Country, trailer, trnstype, Shipmenttype, Containertype, cargo, Incoterms, Comodity, Infosource, Reason, UomStorage, Package]) => {
        this.CustomerCategory = Custcat
        this.Employee = Employee
        this.jobCategory = Jobtypecat
        this.Modeoftrasport = Modeoftrns
        this.intrestlevel = Intrest
        this.salesFunnels = SalesFunnels

        this.EnquiryStatus = Enquirystat
        this.country = Country
        this.trailer = trailer

        this.transType = trnstype

        this.shipmenttype = Shipmenttype

        this.containertype = Containertype

        this.cargo = cargo

        this.incoterms = Incoterms

        this.Comodity = Comodity

        this.Infosource = Infosource
        this.reason = Reason

        this.UomStorage = UomStorage

        this.package = Package

        this.document = Doc;
        this.PotentialCustomer = PotentialC;
        this.Customer = Cust;

        this.airport = Airport;
        this.seapoart = Allsea;
        this.Filters();
        this.EditMode();
        this.ViewMode();
        if (!this.edit) {
          this.SelectedSalesOwnerId = parseInt(this.userId$);
          this.SelectedSalesExecutiveId = parseInt(this.userId$);
          this.Enquiry.controls["salesOwnerId"].setValue(this.optionSelectedSalesOwnerId(parseInt(this.userId$)));
          this.Enquiry.controls["salesExecutiveId"].setValue(this.optionSelectedSalesExecutiveId(parseInt(this.userId$)));
        }

      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  //Filters//
  Filters() {
    this.filteredCustomerCategory = this.Enquiry.get(
      "customerCategoryId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.customerCategory)),
      map((name: any) => (name ? this._filter(name) : this.CustomerCategory?.slice()))
    );


    this.filteredSalesOwners = this.Enquiry.get('salesOwnerId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this._filterSalesOwners(name) : this.Employee?.slice()))
    );
    this.filteredSalesExecutives = this.Enquiry.get('salesExecutiveId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this._filterSalesExecutives(name) : this.Employee?.slice()))
    );

    this.filteredJobCategories = this.Enquiry.get('jobCategoryId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobCategory)),
      map((name: any) => (name ? this._filterJobCategories(name) : this.jobCategory?.slice()))
    );

    this.filteredJobTypes = this.Enquiry.get('jobTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobTypeName)),
      map((name: any) => (name ? this._filterJobTypes(name) : this.jobtype?.slice()))
    );
    this.filteredModeofTransports = this.Enquiry.get('modeofTransportId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofTransport)),
      map((name: any) => (name ? this._filterModeofTransports(name) : this.Modeoftrasport?.slice()))
    );

    this.filteredInterestLevels = this.Enquiry.get('interestLevelId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.interestlevel)),
      map((name: any) => (name ? this._filterInterestLevels(name) : this.intrestlevel?.slice()))
    );

    this.filteredStatuses = this.Enquiry.get('statusId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.enquiryStatus)),
      map((name: any) => (name ? this._filterStatuses(name) : this.EnquiryStatus?.slice()))
    );

    this.filteredSalesFunnels = this.Enquiry.get('salesFunnelId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.salesFunnel)),
      map((name: any) => (name ? this._filterSalesFunnels(name) : this.salesFunnels?.slice()))
    );

    this.filteredOriginCountries = this.Enquiry.get('originCountryId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this._filterOriginCountries(name) : this.country?.slice()))
    );

    this.filteredDestCountries = this.Enquiry.get('destCountryId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this._filterDestCountries(name) : this.country?.slice()))
    );

    this.filteredOriginLocations = this.Enquiry.get('originLocationId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this._filterOriginLocations(name) : this.city?.slice()))
    );

    this.filteredDestLocations = this.Enquiry.get('destLocationId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cityName)),
      map((name: any) => (name ? this._filterDestLocations(name) : this.Destcity?.slice()))
    );
    this.filteredTrailerTypes = this.Enquiry.get('trailerTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.trailerTypeName)),
      map((name: any) => (name ? this._filterTrailerTypes(name) : this.trailer?.slice()))
    );

    this.filteredTransportTypes = this.Enquiry.get('transportTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofTransport)),
      map((name: any) => (name ? this._filterTransportTypes(name) : this.transType?.slice()))
    );

    this.filteredShipmentTypes = this.Enquiry.get('shipmentTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.shipmentType)),
      map((name: any) => (name ? this._filterShipmentTypes(name) : this.shipmenttype?.slice()))
    );

    this.filteredContainerTypes = this.Enquiry.get('containerTypeId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.containerTypeName)),
      map((name: any) => (name ? this._filterContainerTypes(name) : this.containertype?.slice()))
    );

    this.filteredCargoTypes = this.Enquiry.get('cargoTypeid')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cargoType)),
      map((name: any) => (name ? this._filterCargoTypes(name) : this.cargo?.slice()))
    );

    this.filteredInformationSources = this.Enquiry.get('informationSourceId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.informationSourceName)),
      map((name: any) => (name ? this._filterInformationSources(name) : this.Infosource?.slice()))
    );

    this.filteredReasons = this.Enquiry.get('reasonId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.reasonName)),
      map((name: any) => (name ? this._filterReasons(name) : this.reason?.slice()))
    );

    this.filteredStorageUoms = this.Enquiry.get('storageUomId')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.uomName)),
      map((name: any) => (name ? this._filterStorageUoms(name) : this.UomStorage?.slice()))
    );

    this.filtereddocumentId = this.EnqDoc.get(
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

    const filterresult = this.document.filter((invflg) =>
      invflg.documentName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.EnqDoc.controls["documentId"].setValue("");
    }

    return filterresult;
  }

  private _filterStorageUoms(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.UomStorage.filter((uom) =>
      uom.uomName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["storageUomId"].setValue("");
    }

    return filterresult;
  }
  private _filterReasons(value: string): Reason[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.reason.filter((reason) =>
      reason.reasonName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["reasonId"].setValue("");
    }

    return filterresult;
  }

  private _filterInformationSources(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Infosource.filter((source) =>
      source.informationSourceName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["informationSourceId"].setValue("");
    }

    return filterresult;
  }

  private _filterCargoTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.cargo.filter((type) =>
      type.cargoType.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["cargoTypeid"].setValue("");
    }

    return filterresult;
  }


  private _filterContainerTypes(value: string): ContainerType[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.containertype.filter((type) =>
      type.containerTypeName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["containerTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterShipmentTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.shipmenttype.filter((type) =>
      type.shipmentType.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["shipmentTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterTransportTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.transType.filter((type) =>
      type.transportType.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["transportTypeId"].setValue("");
    }

    return filterresult;
  }
  private _filterTrailerTypes(value: string): TrailerType[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.trailer.filter((type) =>
      type.trailerTypeName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["trailerTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterDestLocations(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Destcity.filter((location) =>
      location.cityName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["originLocationId"].setValue("");
    }

    return filterresult;
  }
  private _filterOriginLocations(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.city.filter((location) =>
      location.cityName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["destLocationId"].setValue("");
    }

    return filterresult;
  }
  private _filter(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.CustomerCategory.filter((invflg) =>
      invflg.customerCategory.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["customerCategoryId"].setValue("");
    }

    return filterresult;
  }

  private _filterCustomers(value: string): any[] {
    const filterValue = value.toLowerCase();

    const filterresult = this.CustDropDown.filter((customer) =>
      customer.name.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["customerId"].setValue("");
      this.Enquiry.controls["email"].setValue("");
      this.Enquiry.controls["phone"].setValue("");
      this.Enquiry.controls["salesOwnerId"].setValue("");
      this.Enquiry.controls["salesExecutiveId"].setValue("");
    }

    return filterresult;
  }
  private _filterAddresses(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.CAdressDropDown.filter((address) =>
      address.name.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["addressId"].setValue("");
    }

    return filterresult;
  }

  private _filterSalesOwners(value: string): Employee[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Employee.filter((owner) =>
      owner.employeeName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["salesOwnerId"].setValue("");
    }

    return filterresult;
  }

  private _filterSalesExecutives(value: string): Employee[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Employee.filter((executive) =>
      executive.employeeName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["salesExecutiveId"].setValue("");
    }

    return filterresult;
  }
  private _filterJobCategories(value: string): JobCategory[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.jobCategory.filter((category) =>
      category.jobCategory.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["jobCategoryId"].setValue("");
    }

    return filterresult;
  }

  private _filterJobTypes(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.jobtype.filter((type) =>
      type.jobTypeName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["jobTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterModeofTransports(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Modeoftrasport.filter((transport) =>
      transport.modeofTransport.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["modeofTransportId"].setValue("");
    }

    return filterresult;
  }
  private _filterInterestLevels(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.intrestlevel.filter((level) =>
      level.interestlevel.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["interestLevelId"].setValue("");
    }

    return filterresult;
  }

  private _filterStatuses(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.EnquiryStatus.filter((status) =>
      status.enquiryStatus.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["statusId"].setValue("");
    }

    return filterresult;
  }

  private _filterSalesFunnels(value: string): SalesFunnel[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.salesFunnels.filter((funnel) =>
      funnel.salesFunnel.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["salesFunnelId"].setValue("");
    }

    return filterresult;
  }

  private _filterOriginCountries(value: string): Country[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.country.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Enquiry.controls["originCountryId"].setValue("");
    }

    return filterresult;
  }

  private _filterDestCountries(value: string): Country[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.country.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["destCountryId"].setValue("");
    }

    return filterresult;
  }

  private _filterLoadingPorts(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.orginPortDropDown.filter((port) =>
      port.name.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["loadingPortId"].setValue("");
    }

    return filterresult;
  }

  private _filterDestinationPorts(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.DestPortDropDown.filter((port) =>
      port.name.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Enquiry.controls["destinationPortId"].setValue("");
    }

    return filterresult;
  }




  //---------------------Auto Complete------------------------------//

  // Cust Category//

  optionSelectedCustomerCategory(event: MatAutocompleteSelectedEvent): void {
    this.CustDropDown = [];
    this.Enquiry.controls["customerId"].setValue(null);
    const selectedCcat = this.CustomerCategory.find(
      (Stype) => Stype.customerCategory === event.option.viewValue
    );
    if (selectedCcat) {
      const selectedCuscatId = selectedCcat.customerCategoryId;
      this.SelectedcustcatId = selectedCuscatId;
    }

    if (this.SelectedcustcatId) {
      switch (this.SelectedcustcatId) {
        case 1:
          this.getPCdrop();
          break;
        case 2:
          this.getCusdrop();
          break;
        default:
          console.log("Default case");
      }
    }
  }
  optionSelectedCustomerName(event: MatAutocompleteSelectedEvent): void {

    const selectedCustomer = this.CustDropDown.find(
      (customer) => customer.name === event.option.viewValue
    );
    if (selectedCustomer) {
      const selectedCustomerId = selectedCustomer.Id;
      this.SelectedCustomerId = selectedCustomerId;
    }

    console.log("selectedCustomer", selectedCustomer);
    if (this.SelectedcustcatId) {
      switch (this.SelectedcustcatId) {
        case 1:
          this.SelectedSalesOwnerId = selectedCustomer.salesOwnerId;
          this.SelectedSalesExecutiveId = selectedCustomer.salesExecutiveId
          this.Enquiry.patchValue({
            email: selectedCustomer.customerEmail,
            phone: selectedCustomer.customerPhone,
            salesOwnerId: selectedCustomer.salesOwnerName,
            salesExecutiveId: selectedCustomer.salesExecutiveName,
          });
          this.Addresslink = "/crm/master/potentialcustomer/create";
          this.contactlink = "/crm/master/potentialcustomer/create";
          this.PCs.getAllPotentialCustomerById(this.SelectedCustomerId).subscribe(result => {

            console.log("getAllPotentialCustomerById", result);

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

            this.customerContact.forEach((item) => {
              switch (item.primaryContact) {
                case true:
                  var contact = this.Enquiry.controls["contactId"].setValue([item.pcContactId]);
                  this.onSelectcontact();
                  break;
                default:
                  // Do something else if primaryAddress is not 1
                  break;
              }
            });

            this.potentialCustomerAddress = result.potentialCustomerAddresses;
            const liveCustomerAddress = this.potentialCustomerAddress.filter(Address => Address.liveStatus == true);


            const cusAdress = liveCustomerAddress.map(res => {
              return {
                ...res,
                Id: res.pcAddressId,
                name: res.addressName
              };
            });
            this.CAdressDropDown = [...cusAdress];


            console.log("this.customerContact", this.customerContact)

            this.filteredAddresses = this.Enquiry.get('addressId')?.valueChanges.pipe(
              startWith(''),
              map((value: any) => (typeof value === 'string' ? value : value?.name)),
              map((name: any) => (name ? this._filterAddresses(name) : this.CAdressDropDown?.slice()))
            );

            liveCustomerAddress.forEach((item) => {
              switch (item.primaryAddress) {
                case true:
                  this.SelectedAddressId = item.pcAddressId
                  this.Enquiry.controls["addressId"].setValue(item.addressName);
                  break;
                default:
                  // Do something else if primaryAddress is not 1
                  break;
              }
            });

          });
          break;
        case 2:
          this.SelectedSalesOwnerId = selectedCustomer.salesOwnerId;
          this.SelectedSalesExecutiveId = selectedCustomer.salesExecutiveId
          this.Enquiry.patchValue({
            email: selectedCustomer.customerEmail,
            phone: selectedCustomer.customerPhone,
            salesOwnerId: selectedCustomer.salesOwnerName,
            salesExecutiveId: selectedCustomer.salesExecutiveName,
          });
          this.Addresslink = "/crm/master/customer/create";
          this.contactlink = "/crm/master/customer/create";
          this.Cus.getAllCustomerById(this.SelectedCustomerId).subscribe(res => {

            this.customerContact = res.customerContact;
            const liveCustomerContacts = this.customerContact.filter(contact => contact.liveStatus === true);

            liveCustomerContacts.forEach((item) => {
              switch (item.primaryContact) {
                case true:
                  this.Enquiry.controls["contactId"].setValue([item.cContactId]);
                  this.onSelectcontact();
                  break;
                default:
                  // Do something else if primaryAddress is not 1
                  break;
              }
            });

            const cuscontact = this.customerContact.map(res => {
              return {
                ...res,
                Id: res.cContactId,
                name: res.contactPerson
              };
            });
            this.ContactDropDown = [...cuscontact];
            this.customerAddress = res.customerAddress;
            const liveCustomerAddress = this.customerAddress.filter(Address => Address.liveStatus === true);



            const cusAdress = liveCustomerAddress.map(res => {
              return {
                ...res,
                Id: res.cAddressId,
                name: res.addressName
              };
            });
            this.CAdressDropDown = [...cusAdress];

            this.filteredAddresses = this.Enquiry.get('addressId')?.valueChanges.pipe(
              startWith(''),
              map((value: any) => (typeof value === 'string' ? value : value?.name)),
              map((name: any) => (name ? this._filterAddresses(name) : this.CAdressDropDown?.slice()))
            );


            liveCustomerAddress.forEach((item) => {
              switch (item.primaryAddress) {
                case true:
                  this.SelectedAddressId = item.cAddressId
                  this.Enquiry.controls["addressId"].setValue(item.addressName);
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
  Addresspt() {
    switch (this.SelectedcustcatId) {
      case 1:
        this.potentialCustomerSvc.isView = false;
        this.potentialCustomerSvc.isEdit = true;
        this.potentialCustomerSvc.setItemId(this.SelectedCustomerId);
        this.router.navigate([this.Addresslink]);
        break;
      case 2:
        this.customerService.isView = false;
        this.customerService.isEdit = true;
        this.customerService.setItemId(this.SelectedCustomerId);
        this.router.navigate([this.Addresslink]);
        break;
    }

  }
  ContactPt() {
    switch (this.SelectedcustcatId) {
      case 1:
        this.potentialCustomerSvc.isView = false;
        this.potentialCustomerSvc.isEdit = true;
        this.potentialCustomerSvc.setItemId(this.SelectedCustomerId);
        this.router.navigate([this.contactlink]);
        break;
      case 2:
        this.customerService.isView = false;
        this.customerService.isEdit = true;
        this.customerService.setItemId(this.SelectedCustomerId);
        this.router.navigate([this.contactlink]);
        break;
    }
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

  optionSelectedSalesOwner(event: MatAutocompleteSelectedEvent): void {
    const selectedOwner = this.Employee.find(
      (owner) => owner.employeeName === event.option.viewValue
    );
    if (selectedOwner) {
      const selectedOwnerId = selectedOwner.employeeId;
      this.SelectedSalesOwnerId = selectedOwnerId;
    }
  }


  optionSelectedAddress(event: MatAutocompleteSelectedEvent): void {
    const selectedAddress = this.CAdressDropDown.find(
      (address) => address.name === event.option.viewValue
    );
    if (selectedAddress) {
      const selectedAddressId = selectedAddress.Id;
      this.SelectedAddressId = selectedAddressId;
    }
  }
  optionSelectedSalesExecutive(event: MatAutocompleteSelectedEvent): void {
    const selectedExecutive = this.Employee.find(
      (executive) => executive.employeeName === event.option.viewValue
    );
    if (selectedExecutive) {
      const selectedExecutiveId = selectedExecutive.employeeId;
      this.SelectedSalesExecutiveId = selectedExecutiveId;
    }
  }

  optionSelectedJobCategory(event: MatAutocompleteSelectedEvent): void {
    this.Enquiry.controls["jobTypeId"].setValue(null);
    const selectedCategory = this.jobCategory.find(
      (category) => category.jobCategory === event.option.viewValue
    );
    if (selectedCategory) {
      const selectedCategoryId = selectedCategory.jobCategoryId;
      this.SelectedJobCategoryId = selectedCategoryId;
    }
    this.Jtype.getJobTypesByJobCatId(this.SelectedJobCategoryId).subscribe((res => {
      this.jobtype = res;
      this.Filters();
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
    this.Jtype.getAllJopTypeById(this.SelectedJobTypeId).subscribe((res)=>{
     this.JobtypeModeoftans = res.jtModeofTransport;
     var trns = this.JobtypeModeoftans.map(id=>id.modeofTransportId);
     this.Enquiry.controls['modeofTransportId'].setValue(trns);
     if(this.JobtypeModeoftans.length>0){
      this.onSelectModeoftrns();
     }
     this.jobtypeIncoTerms = res.jobTypeGeneral.incoTermId;
     this.Enquiry.controls["incoTermId"].setValue([this.jobtypeIncoTerms]);
     if(this.jobtypeIncoTerms!=null){
      this.onSelectInco();
     }
    });

  }

  optionSelectedModeofTransport(event: MatAutocompleteSelectedEvent): void {
    const selectedTransport = this.Modeoftrasport.find(
      (transport) => transport.modeofTransport === event.option.viewValue
    );
    if (selectedTransport) {
      const selectedTransportId = selectedTransport.modeofTransportId;
      this.SelectedModeofTransportId = selectedTransportId;
    }
    if (this.SelectedModeofTransportId) {
      switch (this.SelectedModeofTransportId) {
        case 1:
          //this.getAirdrop();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = false;
          this.chargablepackage = false;
          const calcair = 6000
          this.Calculation(calcair);
          // this.Enquiry.get('shipmentTypeId')?.clearValidators();
          // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
          break;
        case 2:
          //this.getseadrop();
          this.ShowOnlyroad = false;
          this.ShowOnlysea = true;
          this.chargablepackage = true;
          const calcsea = 10000
          this.Calculation(calcsea);
          break;
        case 3:
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          this.orginPortDropDown = [];
          this.DestPortDropDown = [];
          const calcroad = 10000
          this.Calculation(calcroad);
          this.Enquiry.controls["loadingPortId"].setValue(null);
          this.Enquiry.controls["destinationPortId"].setValue(null);
          // this.Enquiry.get('shipmentTypeId')?.clearValidators();
          // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
          break;
          case 4:
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false
          this.chargablepackage = false;
          const calccurior = 5000
          this.Calculation(calccurior);
          this.orginPortDropDown = [];
          this.DestPortDropDown = [];
          // this.Enquiry.get('shipmentTypeId')?.clearValidators();
          // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
          break;
        default:
          console.log("Default case");
      }
    }

   
    if (this.SelectedModeofTransportId && this.SelectedOriginCountryId) {
      switch (this.SelectedModeofTransportId) {
        case 1:
          this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
          this.getDestAirdropbycountryid(this.SelectedDestCountryId);
          break;
        case 2:
          this.getorginseadropbycountryid(this.SelectedOriginCountryId);
          this.getDestseadropbycountryid(this.SelectedDestCountryId);
          break;
        default:
          console.log("Default case");
      }
    }

    // if (this.SelectedModeofTransportId === 2) {
    //   // Set validators for mandatory fields when statusId is 1
    //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
    // } else {
    //   // Remove validators if statusId is not 2
    //   this.Enquiry.get('shipmentTypeId')?.clearValidators();

    //   this.Enquiry.get('shipmentTypeId')?.setValue(null);
    // }

    // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();

  }
  Calculation(value: number) {
    this.EnqPackage = this.EnqPackage.map(pkg => {
      return {
        ...pkg,
        cbm:parseFloat((pkg.length*pkg.breadth*pkg.height).toFixed(2)),
        chargePackWtKg: parseFloat((pkg.length*pkg.breadth*pkg.height / value).toFixed(2))
      };
    });
  }

  optionSelectedInterestLevel(event: MatAutocompleteSelectedEvent): void {
    const selectedLevel = this.intrestlevel.find(
      (level) => level.interestlevel === event.option.viewValue
    );
    if (selectedLevel) {
      const selectedLevelId = selectedLevel.interestlevelId;
      this.SelectedInterestLevelId = selectedLevelId;
    }
  }

  optionSelectedStatus(event: MatAutocompleteSelectedEvent): void {
    const selectedStatus = this.EnquiryStatus.find(
      (status) => status.enquiryStatus === event.option.viewValue
    );
    if (selectedStatus) {
      const selectedStatusId = selectedStatus.enquiryStatusId;
      this.SelectedStatusId = selectedStatusId;
    }
    if(this.SelectedStatusId ===1){
      this.showclose=false;
    }
    if (this.SelectedStatusId === 2) {
      this.showclose=true;
      // Set validators for mandatory fields when statusId is 1
      this.Enquiry.get('reasonId')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.Enquiry.get('reasonId')?.clearValidators();

      this.Enquiry.get('reasonId')?.setValue(null);
    }

    this.Enquiry.get('reasonId')?.updateValueAndValidity();

  }
  optionSelectedSalesFunnel(event: MatAutocompleteSelectedEvent): void {
    const selectedFunnel = this.salesFunnels.find(
      (funnel) => funnel.salesFunnel === event.option.viewValue
    );
    if (selectedFunnel) {
      const selectedFunnelId = selectedFunnel.salesFunnelId;
      this.SelectedSalesFunnelId = selectedFunnelId;
    }
  }

  optionSelectedOriginCountry(event: MatAutocompleteSelectedEvent): void {
    debugger;
    const selectedCountry = this.country.find(
      (country) => country.countryName === event.option.viewValue
    );
    if (selectedCountry) {
      const selectedCountryId = selectedCountry.countryId;
      this.SelectedOriginCountryId = selectedCountryId;
    }
    this.Enquiry.controls["loadingPortId"].setValue(null);
    this.Cservice.getAllCitiesbyCountry(this.SelectedOriginCountryId).subscribe(res => {
      this.city = res
      console.log("this.city", this.city);
      this.Filters();
    });

    const selectedModes = this.Enquiry.controls['modeofTransportId'].value;

    if (selectedModes.includes(1) && selectedModes.includes(3)) {
      const calcairandroad = 10000
      this.Calculation(calcairandroad);
      this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
      this.getDestAirdropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
  
    } else if (selectedModes.includes(2) && selectedModes.includes(3)) {
      const calcseaandroad = 10000
      this.Calculation(calcseaandroad);
      this.getorginseadropbycountryid(this.SelectedOriginCountryId);
      this.getDestseadropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = true;
      this.ShowOnlysea = true
      this.chargablepackage = false;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
  
      // if (selectedModes.includes(2) && selectedModes.includes(3)) {
      //   // Set validators for mandatory fields when statusId is 1
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
      // } else {
      //   // Remove validators if statusId is not 2
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
  
      //   this.Enquiry.get('shipmentTypeId')?.setValue(null);
      // }
  
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(1)) {
      const calcair = 6000
      this.Calculation(calcair);
      this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
      this.getDestAirdropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = false;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(2)) {
      this.getorginseadropbycountryid(this.SelectedOriginCountryId);
      this.getDestseadropbycountryid(this.SelectedDestCountryId);
  
      // if (selectedModes.includes(2)) {
      //   // Set validators for mandatory fields when statusId is 1
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
      // } else {
      //   // Remove validators if statusId is not 2
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
  
      //   this.Enquiry.get('shipmentTypeId')?.setValue(null);
      // }
  
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
      this.ShowOnlyroad = false;
      this.ShowOnlysea = true
      this.chargablepackage = true;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
    }
    else if (selectedModes.includes(3)) {
      this.SelectedLoadingPortId=null;
      this.SelectedDestinationPortId=null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calroad = 10000
      this.Calculation(calroad);
      this.orginPortDropDown=[];
      this.DestPortDropDown=[];
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    }
    else if (selectedModes.includes(4)) {
      this.SelectedLoadingPortId=null;
      this.SelectedDestinationPortId=null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calccurior = 5000
      this.Calculation(calccurior);
      this.orginPortDropDown=[];
      this.DestPortDropDown=[];
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
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
    this.Enquiry.controls["destinationPortId"].setValue(null);
    this.Cservice.getAllCitiesbyCountry(this.SelectedDestCountryId).subscribe(res => {
      this.Destcity = res
      this.Filters();
    });

    const selectedModes = this.Enquiry.controls['modeofTransportId'].value;

    if (selectedModes.includes(1) && selectedModes.includes(3)) {
      const calcairandroad = 10000
      this.Calculation(calcairandroad);
      this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
      this.getDestAirdropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
  
    } else if (selectedModes.includes(2) && selectedModes.includes(3)) {
      const calcseaandroad = 10000
      this.Calculation(calcseaandroad);
      this.getorginseadropbycountryid(this.SelectedOriginCountryId);
      this.getDestseadropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = true;
      this.ShowOnlysea = true
      this.chargablepackage = false;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
  
      // if (selectedModes.includes(2) && selectedModes.includes(3)) {
      //   // Set validators for mandatory fields when statusId is 1
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
      // } else {
      //   // Remove validators if statusId is not 2
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
  
      //   this.Enquiry.get('shipmentTypeId')?.setValue(null);
      // }
  
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(1)) {
      const calcair = 6000
      this.Calculation(calcair);
      this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
      this.getDestAirdropbycountryid(this.SelectedDestCountryId);
      this.ShowOnlyroad = false;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    } else if (selectedModes.includes(2)) {
      this.getorginseadropbycountryid(this.SelectedOriginCountryId);
      this.getDestseadropbycountryid(this.SelectedDestCountryId);
  
      // if (selectedModes.includes(2)) {
      //   // Set validators for mandatory fields when statusId is 1
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
      // } else {
      //   // Remove validators if statusId is not 2
      //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
  
      //   this.Enquiry.get('shipmentTypeId')?.setValue(null);
      // }
  
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
      this.ShowOnlyroad = false;
      this.ShowOnlysea = true
      this.chargablepackage = true;
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
    }
    else if (selectedModes.includes(3)) {
      this.SelectedLoadingPortId=null;
      this.SelectedDestinationPortId=null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calroad = 10000
      this.Calculation(calroad);
      this.orginPortDropDown=[];
      this.DestPortDropDown=[];
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    }
    else if (selectedModes.includes(4)) {
      this.SelectedLoadingPortId=null;
      this.SelectedDestinationPortId=null;
      this.ShowOnlyroad = true;
      this.ShowOnlysea = false
      this.chargablepackage = false;
      const calccurior = 5000
      this.Calculation(calccurior);
      this.orginPortDropDown=[];
      this.DestPortDropDown=[];
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
      // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
      // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    }
   
  }

  optionSelectedReason(event: MatAutocompleteSelectedEvent): void {
    const selectedReason = this.reason.find(
      (reason) => reason.reasonName === event.option.viewValue
    );
    if (selectedReason) {
      const selectedReasonId = selectedReason.reasonId;
      this.SelectedReasonId = selectedReasonId;
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
    const selectedLocation = this.city.find(
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

  optionSelectedLoadingPort(event: MatAutocompleteSelectedEvent): void {
    const selectedPort = this.orginPortDropDown.find(
      (port) => port.name === event.option.viewValue
    );
    if (selectedPort) {
      const selectedPortId = selectedPort.Id;
      this.SelectedLoadingPortId = selectedPortId;
    }
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

  optionSelectedInformationSource(event: MatAutocompleteSelectedEvent): void {
    const infosource = "Reference".toLowerCase();
    const selectedSource = this.Infosource.find(
      (source) => source.informationSourceName === event.option.viewValue
    );
    if (selectedSource) {
      const selectedSourceId = selectedSource.informationSourceId;
      this.SelectedInformationSourceId = selectedSourceId;
      this.selectedinfosource = selectedSource.informationSourceName
    }
    if (this.selectedinfosource.toLowerCase() == infosource) {
      this.showrefencedetail = true
    } else {
      this.showrefencedetail = false
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
      this.Enquiry.get('containerTypeId')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.Enquiry.get('containerTypeId')?.clearValidators();

      this.Enquiry.get('containerTypeId')?.setValue(null);
    }

    this.Enquiry.get('containerTypeId')?.updateValueAndValidity();
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

  // ---------------------Cust Category-------------------//
  //Edit Bind//

  optionSelectedCustomerCategoryId(id: number): string {
  
    const selectedid = this.CustomerCategory.find(
      (item) => item.customerCategoryId === id
    );

    return selectedid ? selectedid.customerCategory : "";

  }

  async getdropsvalue() {
    if (this.SelectedcustcatId) {
      switch (this.SelectedcustcatId) {
        case 1:
          try {
            const PcCust = await this.PCs.getAllPotentialCustomerById(this.SelectedCustomerId).toPromise();
            if (PcCust !== undefined && PcCust !== null) {
              this.customerContact = PcCust.potentialCustomerContacts;
              this.potentialCustomerAddress = PcCust.potentialCustomerAddresses;
              console.log("this.potentialCustomerAddress==>", this.potentialCustomerAddress);
            } else {
              console.log("Potential customer not found");
            }
          } catch (error) {
            console.log("error==>", error);
          }
          break;
        case 2:
          try {
            const Customer = await this.Cus.getAllCustomerById(this.SelectedCustomerId).toPromise();
            if (Customer !== undefined && Customer !== null) {
              this.customerContact = Customer.customerContact;
              this.customerAddress = Customer.customerAddress;
            } else {
              console.log("Customer not found");
            }
          } catch (error) {
            console.log("error==>", error);
          }
          break;
        default:
          console.log("Default case");
      }
    }
  }



  optionSelectedCustomerNameId(id: number): string {
    this.SelectedCustomerId = id;
    if (this.SelectedcustcatId) {
      switch (this.SelectedcustcatId) {
        case 1:
          this.Addresslink = "/crm/master/potentialcustomer/create";
          this.contactlink = "/crm/master/potentialcustomer/create";
          const newPotentialcustomer = this.PotentialCustomer.map(res => {
            return {
              ...res,
              Id: res.potentialCustomerId,
              name: res.customerName
            };
          });
          this.CustDropDown = [...newPotentialcustomer];

          this.filteredCustomerName = this.Enquiry.get('customerId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterCustomers(name) : this.CustDropDown?.slice()))
          );
          break;
        case 2:
          this.Addresslink = "/crm/master/customer/create";
          this.contactlink = "/crm/master/customer/create";
          const customer = this.Customer.map(res => {
            return {
              ...res,
              Id: res.customerId,
              name: res.customerName
            };
          });
          this.CustDropDown = [...customer];
          this.filteredCustomerName = this.Enquiry.get('customerId')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => (typeof value === 'string' ? value : value?.name)),
            map((name: any) => (name ? this._filterCustomers(name) : this.CustDropDown?.slice()))
          );
          break;
        default:
          console.log("Default case");
      }
    }
    if (this.SelectedcustcatId) {
      switch (this.SelectedcustcatId) {
        case 1:
          this.PCs.getAllPotentialCustomerById(this.SelectedCustomerId).subscribe(result => {

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

            this.potentialCustomerAddress = result.potentialCustomerAddresses;
            const liveCustomerAddress = this.potentialCustomerAddress.filter(Address => Address.liveStatus == true);
            const cusAdress = liveCustomerAddress.map(res => {
              return {
                ...res,
                Id: res.pcAddressId,
                name: res.addressName
              };
            });
            this.CAdressDropDown = [...cusAdress];

            this.filteredAddresses = this.Enquiry.get('addressId')?.valueChanges.pipe(
              startWith(''),
              map((value: any) => (typeof value === 'string' ? value : value?.name)),
              map((name: any) => (name ? this._filterAddresses(name) : this.CAdressDropDown?.slice()))
            );

            this.Enquiry.controls["addressId"].setValue(this.selectedAddressname);

          });

          break;
        case 2:
          this.Cus.getAllCustomerById(this.SelectedCustomerId).subscribe(res => {

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
            this.customerAddress = res.customerAddress;
            const liveCustomerAddress = this.customerAddress.filter(Address => Address.liveStatus === true);



            const cusAdress = liveCustomerAddress.map(res => {
              return {
                ...res,
                Id: res.cAddressId,
                name: res.addressName
              };
            });
            this.CAdressDropDown = [...cusAdress];

            this.filteredAddresses = this.Enquiry.get('addressId')?.valueChanges.pipe(
              startWith(''),
              map((value: any) => (typeof value === 'string' ? value : value?.name)),
              map((name: any) => (name ? this._filterAddresses(name) : this.CAdressDropDown?.slice()))
            );
            this.Enquiry.controls["addressId"].setValue(this.selectedAddressname);
          });
          break;
        default:
          console.log("Default case");
      }
    }

    const selectedCustomer = this.CustDropDown.find(
      (customer) => customer.Id === id
    );
    return selectedCustomer ? selectedCustomer.name : '';
  }


  optionSelectedAddressId(id: number): string {
    this.customerContact
    console.log("this.this.customerContact", this.customerContact)
    console.log("this.potentialCustomerAddress", this.potentialCustomerAddress)

    this.SelectedAddressId = id;
    const selectedAddress = this.CAdressDropDown.find(
      (address) => address.Id === id
    );
    return selectedAddress ? selectedAddress.name : '';
  }

  optionSelectedJobCategoryId(id: number) {

    const selectedCategory = this.jobCategory.find(
      (category) => category.jobCategoryId === id
    );
    this.Jtype.getJobTypesByJobCatId(this.SelectedJobCategoryId).subscribe((res => {
      this.jobtype = res;
      this.Filters();
    }));
    if (this.SelectedJobCategoryId) {
      switch (this.SelectedJobCategoryId) {
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
  }
  optionSelectedJobTypeId(id: number): string {
    this.SelectedJobTypeId = id;
    const selectedType = this.jobtype.find(
      (type) => type.jobTypeId === id
    );
    return selectedType ? selectedType.jobTypeName : '';
  }
  optionSelectedModeofTransportId(id: number) {
    this.SelectedModeofTransportId = id;
    const selectedTransport = this.Modeoftrasport.find(
      (transport) => transport.modeofTransportId === id
    );

    if (this.SelectedModeofTransportId) {
      switch (this.SelectedModeofTransportId) {
        case 1:
          this.ShowOnlyroad = false;
          this.ShowOnlysea = false;
          this.chargablepackage = false
          break;
        case 2:

          this.ShowOnlyroad = false;
          this.ShowOnlysea = true;
          this.chargablepackage = true
          break;
        case 3:
          this.ShowOnlyroad = true;
          this.ShowOnlysea = false;
          this.chargablepackage = false
          break;
          case 4:
            this.ShowOnlyroad = true;
            this.ShowOnlysea = false
            this.chargablepackage = false;
            break;
        default:
          console.log("Default case");
      }
    }
  }

  
  optionSelectedStatusId(id: number) {
    const selectedStatus = this.EnquiryStatus.find(
      (status) => status.enquiryStatusId === id
    );
    if(this.SelectedStatusId ===1){
      this.showclose=false;
    }
    if(this.SelectedStatusId ===2){
      this.showclose=true;
    }
  }

  optionSelectedSalesFunnelId(id: number): string {
    this.SelectedSalesFunnelId = id;
    const selectedFunnel = this.salesFunnels.find(
      (funnel) => funnel.salesFunnelId === id
    );
    return selectedFunnel ? selectedFunnel.salesFunnel : '';
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

 
 

 
  optionSelectedInformationSourceId(id: number) {
    const infosource = "Reference"
    this.SelectedInformationSourceId = id;
    const selectedSource = this.Infosource.find(
      (source) => source.informationSourceId === id
    );
    if (selectedSource?.informationSourceName == infosource) {
      this.showrefencedetail = true
    } else {
      this.showrefencedetail = false
    }
   
  }

  optionSelectedSalesOwnerId(id: number): string {
    this.SelectedSalesOwnerId = id;
    const selectedOwner = this.Employee.find(
      (owner) => owner.employeeId === id
    );
    return selectedOwner ? selectedOwner.employeeName : '';
  }
  optionSelectedSalesExecutiveId(id: number): string {
    this.SelectedSalesExecutiveId = id;
    const selectedExecutive = this.Employee.find(
      (executive) => executive.employeeId === id
    );
    return selectedExecutive ? selectedExecutive.employeeName : '';
  }
  

  // get dropdown//

  getPCdrop() {
    this.CustDropDown = [];
    this.PCs.getAllActivePotentialCustomer().subscribe((res) => {
      this.PotentialCustomer = res


      console.log("PotentialCustomer", res)
      const LivePotentialCustomer = this.PotentialCustomer.filter(contact => contact.pcStatusId != 2);

      const newPotentialcustomer = LivePotentialCustomer.map(res => {
        return {
          ...res,
          Id: res.potentialCustomerId,
          name: res.customerName
        };
      });
      this.CustDropDown = [...newPotentialcustomer];

      this.filteredCustomerName = this.Enquiry.get('customerId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterCustomers(name) : this.CustDropDown?.slice()))
      );
    })
  }

  getCusdrop() {
    this.CustDropDown = [];
    this.Cus.getAllActiveCustomer().subscribe((res) => {
      this.Customer = res
      console.log("Customer", res)
      const LiveCustomer = this.Customer.filter(contact => contact.cStatusId != 2);
      const customer = LiveCustomer.map(res => {
        return {
          ...res,
          Id: res.customerId,
          name: res.customerName
        };
      });
      this.CustDropDown = [...customer];
      this.filteredCustomerName = this.Enquiry.get('customerId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterCustomers(name) : this.CustDropDown?.slice()))
      );
    })

  }

  getAirdrop() {
    this.Cservice.getAllAirport(this.Livestatus).subscribe((res) => {
      this.airport = res


      const air = this.airport.map(res => {
        return {
          ...res,
          Id: res.airportId,
          name: res.airportName
        };
      });
      this.PortDropDown = [...air];

      this.filteredLoadingPorts = this.Enquiry.get('loadingPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterLoadingPorts(name) : this.PortDropDown?.slice()))
      );

      this.filteredDestinationPorts = this.Enquiry.get('destinationPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterDestinationPorts(name) : this.PortDropDown?.slice()))
      );

    })
  }

  getseadrop() {
    this.Cservice.getAllSeaport(this.Livestatus).subscribe((res) => {
      this.seapoart = res
      const sea = this.seapoart.map(res => {
        return {
          ...res,
          Id: res.seaportId,
          name: res.seaportName
        };
      });
      this.PortDropDown = [...sea];
      this.filteredLoadingPorts = this.Enquiry.get('loadingPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterLoadingPorts(name) : this.PortDropDown?.slice()))
      );

      this.filteredDestinationPorts = this.Enquiry.get('destinationPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterDestinationPorts(name) : this.PortDropDown?.slice()))
      );
    })
  }


  ////Package Details/////

  Numberogpks() {
    const heightControl = this.Enquiry.get('packageNos');
    if (heightControl && heightControl.value < 0) {
      heightControl.setValue(Math.abs(heightControl.value)); // Set the absolute value
    }
  }

  uomvalue() {
    const heightControl = this.Enquiry.get('valuePerUom');
    if (heightControl && heightControl.value < 0) {
      heightControl.setValue(Math.abs(heightControl.value)); // Set the absolute value
    }
  }

  addPackage() {
    debugger
    const noOfpkg = this.Enquiry.controls['packageNos'].value
    const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
    const count = this.EnqPackage.length;
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
      const dialogRef = this.dialog.open(EnqpackageDialogComponent, {
        data: {
          list: this.EnqPackage,
          modeoftransport: this.EnqModeoftransport,
          show: this.chargablepackage
        }, disableClose: true, autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.EnqPackage.push(result);
          this.EnqPackage = [...this.EnqPackage];
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

  onSelectCommodity() {
    const selectedCommodities = this.Enquiry.controls['commodityId'].value;
    const uniqueSelectedcommodity = selectedCommodities.filter(
      (selectedCommodity: any) =>
        !this.EnqCommodity.some(
          (existingcommodity: any) => existingcommodity.commodityId === selectedCommodity
        )
    );
    uniqueSelectedcommodity.forEach((selectedCommodityId: any) => {
      this.CommodityForm = this.fb.group({
        enquirycommodityId: [0],
        enquiryId: [0],
        commodityId: [selectedCommodityId],
        createdBy: [1],
        createdDate: [this.date],
        updatedBy: [1],
        updatedDate: [this.date]
      });
      this.EnqCommodity.push(this.CommodityForm.value);
    });
    const uncheckedCommoditys = this.EnqCommodity.filter(
      (existingcommodity: any) =>
        !selectedCommodities.includes(existingcommodity.commodityId)
    );
    uncheckedCommoditys.forEach((uncheckedCommodity: any) => {
      const index = this.EnqCommodity.findIndex(
        (existingcommodity: any) =>
          existingcommodity.commodityId === uncheckedCommodity.commodityId
      );
      if (index !== -1) {
        this.EnqCommodity.splice(index, 1);
      }
    });

    console.log("EnqCommodity", this.EnqCommodity)
  }


  onSelectInco() {
    const selectedIncos = this.Enquiry.controls['incoTermId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedInco: any) =>
        !this.EnqIncoTerm.some(
          (existingInco: any) => existingInco.incoTermId === selectedInco
        )
    );
    uniqueSelectedInco.forEach((selectedInco: any) => {
      this.IncoForm = this.fb.group({
        enquiryIncoId: [0],
        enquiryId: [0],
        incoTermId: [selectedInco],
        createdBy: [1],
        createdDate: [this.date],
        updatedBy: [1],
        updatedDate: [this.date]
      });
      this.EnqIncoTerm.push(this.IncoForm.value);
    });
    const uncheckedIncos = this.EnqIncoTerm.filter(
      (existingInco: any) =>
        !selectedIncos.includes(existingInco.incoTermId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.EnqIncoTerm.findIndex(
        (existingInco: any) =>
          existingInco.incoTermId === uncheckedInco.incoTermId
      );
      if (index !== -1) {
        this.EnqIncoTerm.splice(index, 1);
      }
    });

    console.log("Enqinco", this.EnqIncoTerm);
  }


  onSelectcontact() {
    const selectedIncos = this.Enquiry.controls['contactId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedCont: any) =>
        !this.Contactperson.some(
          (existingInco: any) => existingInco.contactId === selectedCont
        )
    );
    uniqueSelectedInco.forEach((selectedCon: any) => {
      this.ContactForm = this.fb.group({
        enquiryContactId: [0],
        enquiryId: [0],
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

    console.log("Contact", this.Contactperson);

  }

  Edit(Data: any, i: number) {
    const dialogRef = this.dialog.open(EnqpackageDialogComponent, {
      data: {
        EnquiryData: Data,
        mode: 'Edit',
        show: this.chargablepackage,
        modeoftransport: this.EnqModeoftransport,
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.EnqPackage.splice(i, 1);
        this.EnqPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }

  View(Data: any, i: number) {
    const dialogRef = this.dialog.open(EnqpackageDialogComponent, {
      data: {
        EnquiryData: Data,
        mode: 'view',
        show: this.chargablepackage,
        modeoftransport: this.EnqModeoftransport,
      }, disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.EnqPackage.splice(i, 1);
        this.EnqPackage.splice(
          i,
          0,
          result
        );
      }
    });
  }

  DeletepacKage(item: any, i: number) {
    if (i !== -1) {
      this.EnqPackage.splice(i, 1);
    }
  }

  getSelectedPackage(selectedId: number): string {
    const selectedbrand = this.package.find(
      (item) => item.packageTypeId === selectedId
    );
    return selectedbrand ? selectedbrand.packageTypeName : "";
  }
  getSelectedComodity(selectedId: number): string {
    const selectedbrand = this.Comodity.find(
      (item) => item.commodityId === selectedId
    );
    return selectedbrand ? selectedbrand.commodityName : "";
  }



  //// Document Attachment ///
  InitializeDoc() {
    this.EnqDoc = this.fb.group({
      enquiryDocumentId: [0],
      enquiryId: [0],
      documentId: ["", [Validators.required]],
      documentName: [""],
      remarks: [""],
      createdBy: 1,
      createdDate: this.date
    });

  }


  optionSelecteddocumentId(event: MatAutocompleteSelectedEvent): void {
    const selectedDocID = this.document.find(
      (Stype) => Stype.documentName === event.option.viewValue
    );
    if (selectedDocID) {
      const selectedDocId = selectedDocID.documentId;
      this.SelectedDocumentId = selectedDocId;
      this.DocRemarks = selectedDocID.remarks;

      this.EnqDoc.patchValue({
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
        this.EnqDoc.get("documentId")?.setValue("");
      }

    }

  }

  selectFile(evt: any) {
    if (evt?.target?.files && evt.target.files.length > 0) {
      const files = evt.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

        // Check if the file type is allowed (jpg or png)
        if (['jpg', 'png','jpeg', 'docx','jfif', 'doc','pdf', 'xls', 'xlsx'].includes(fileType)) {
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
          this.EnqDoc.controls["documentName"].setValue("");
        }

      }
    }
  }

  addRow() {
    if (this.EnqDoc.valid) {
      if (this.ImageDetailsArray.length > 0) {

        for (let imageDetail of this.ImageDetailsArray) {
          // Rename the 'name' property to 'imagePath'
          const documentName = imageDetail.name;

          // Check if the object with the same 'imagePath' already exists in ImageDataArray
          const existingImageDataIndex = this.ImageDataArray.findIndex(data => data.documentId === this.SelectedDocumentId);

          // If the object doesn't exist, add it to ImageDataArray
          if (existingImageDataIndex === -1) {
            // Create a new object with the modified property name
            const modifiedImageDetail = { ...imageDetail, documentName };

            const Value = {
              ...this.EnqDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              Isedit: false,
              documentId: this.SelectedDocumentId
            }
            // Push the modified object into ImageDataArray
            this.ImageDataArray.push(Value);
            this.Enqdocument = [...this.ImageDataArray]
            this.EnqDoc.reset();
            this.showAddRowDoc = false;
            //this.InitializeDoc();
          } else {
            // Update the existing image data
            const modifiedImageDetail = { ...imageDetail, documentName };
            this.ImageDataArray[existingImageDataIndex] = {
              ...this.EnqDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              documentId: this.SelectedDocumentId,
              createdBy: 1,
              createdDate: this.date,
            };
            this.EnqDoc.reset();
            this.Enqdocument = [...this.ImageDataArray];
            this.showAddRowDoc = false;
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
      this.EnqDoc.markAllAsTouched();
      this.validateall(this.EnqDoc);
    }
  }
  Download() {

  }

  EditDoc(data: any, index: any) {
    const updatedDocuments = this.Enqdocument.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, Isedit: true };
      }
      return doc;
    });
    this.EnqDoc.controls['documentId'].patchValue(this.getSelectedDoc(data.documentId))
    this.showAddRowDoc = true;
    this.isEditDocument = true;
    this.Enqdocument = updatedDocuments;
  }

  oncancelDoc(data: any, index: any){
    debugger
    if(data?.documentId){
      data.Isedit = false;
      this.Enqdocument = [...this.Enqdocument];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.isEditDocument = false;
      return;
    } else {
      this.Enqdocument = this.Enqdocument.filter((_, idx) => idx !== index);
      this.showAddRowDoc = false;
      this.isEditDocument = false;
    }

  }

  DeleteImage(item: any, i: number) {
    if (this.showAddRowDoc != true) {
      if (i !== -1) {
        this.ImageDataArray = [...this.Enqdocument];
        this.ImageDataArray.splice(i, 1);
        this.Enqdocument = [...this.ImageDataArray]
        this.showAddRowDoc = false;
      }
    }
  }
  getSelectedDoc(selectedId: number): string {
    const selectedDoc = this.document.find(
      (item) => item.documentId === selectedId
    );
    return selectedDoc ? selectedDoc.documentName : "";
  }

  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.Enquiry.controls;
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
  SaveEnquiry(id:number) {
    debugger

    if(id==2){

      this.Enquiry.controls['enquiryDate'].setErrors(null);
      this.Enquiry.controls['jobCategoryId'].setErrors(null);
      this.Enquiry.controls['jobTypeId'].setErrors(null);
      this.Enquiry.controls['originCountryId'].setErrors(null);
      this.Enquiry.controls['destCountryId'].setErrors(null);
      this.Enquiry.controls['enquiryDate'].updateValueAndValidity();
      this.Enquiry.controls['jobCategoryId'].updateValueAndValidity();
      this.Enquiry.controls['jobTypeId'].updateValueAndValidity();
      this.Enquiry.controls['originCountryId'].updateValueAndValidity();
      this.Enquiry.controls['destCountryId'].updateValueAndValidity();
  
      const expectedClosingDate = this.formatDate(this.Enquiry.controls['expectedClosingDate'].value);
      const Enquiry = {
        ...this.Enquiry.value,
        enquiryNumber: this.Enquiry.controls["enquiryNumber"].value,
        enquiryDate: this.formatDate(this.Enquiry.controls['enquiryDate'].value),
        customerCategoryId: this.SelectedcustcatId,
        //customerName: this.SelectedCustomerId,
        customerId: this.SelectedCustomerId,
        addressId: this.SelectedAddressId,
        salesOwnerId: this.SelectedSalesOwnerId,
        salesExecutiveId: this.SelectedSalesExecutiveId,
        jobCategoryId: this.SelectedJobCategoryId ||this.getUnknownId("JobCat"),
        jobTypeId: this.SelectedJobTypeId || this.getUnknownId("JobType"),
        modeofTransportId: this.SelectedModeofTransportId,
        interestLevelId: this.SelectedInterestLevelId,
        informationSourceId: this.SelectedInformationSourceId,
        salesFunnelId: this.SelectedSalesFunnelId,
        expectedClosingDate: expectedClosingDate != null ? expectedClosingDate : null,
        statusId: this.SelectedStatusId,
       // approvalStatusId: this.approvalStatusId,

        reasonId: this.SelectedReasonId,
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
        storageUomId: this.SelectedStorageUomId,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,

      }

      const EnquiryPayload: EnquiryCombine = {
        enquiryGeneral: Enquiry,
        contacts: this.Contactperson,
        commodity: this.EnqCommodity,
        incoTerms: this.EnqIncoTerm,
        package: this.EnqPackage,
        documents: this.ImageDataArray,
        enqTransportModes:this.EnqModeoftransport
      }

      console.log("EnquiryPayload", EnquiryPayload);

      this.EnqS
        .CreateEnquiry(EnquiryPayload).subscribe({
          next: (res) => {
            const formData = new FormData();
            this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
            this.Fs.FileUpload(formData).subscribe({
              next: (res) => {
                
              },
              error: (error) => {
              }
            });

            if (!this.edit) {
              const parms ={
                MenuId:50,
                currentUser:this.userId$,
                activityName:"Creation",
                id:res.enquiryGeneral.enquiryId,
                code:res.enquiryGeneral.enquiryNumber
              }
              this.Ns.TriggerNotification(parms).subscribe((res=>{

              }));
              this.Cservice.displayToaster(
                "success",
                "Success",
                "Enquiry Added Sucessfully.."
              );
              this.router.navigate(["/crm/transaction/enquirylist"]);
            } else {
              const parms ={
                MenuId:50,
                currentUser:this.userId$,
                activityName:"Updation",
                id:res.enquiryGeneral.enquiryId,
                code:res.enquiryGeneral.enquiryNumber
              }
              this.Ns.TriggerNotification(parms).subscribe((res=>{
                console.log(res);
              }));
              this.Cservice.displayToaster(
                "success",
                "Success",
                "Enquiry Updated Sucessfully.."
              );
              this.router.navigate(["/crm/transaction/enquirylist"]);
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
          error: (error) => {
            console.log("error", error)
            var ErrorHandle = this.ErrorHandling.handleApiError(error)
            this.Cservice.displayToaster(
              "error",
              "Error",
              ErrorHandle
            );
          },
        });

    
    }else if(id==1){

      this.Enquiry.controls['enquiryDate'].setErrors(null);
    const noOfpkg = this.Enquiry.controls['packageNos'].value
    const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
    const count = this.EnqPackage.length;
    if (this.Enquiry.valid && noOfpkgcount ==count) {
      const expectedClosingDate = this.formatDate(this.Enquiry.controls['expectedClosingDate'].value);
      const Enquiry = {
        ...this.Enquiry.value,
        enquiryNumber: this.Enquiry.controls["enquiryNumber"].value,
        enquiryDate: this.formatDate(this.Enquiry.controls['enquiryDate'].value),
        customerCategoryId: this.SelectedcustcatId,
        //customerName: this.SelectedCustomerId,
        customerId: this.SelectedCustomerId,
        addressId: this.SelectedAddressId,
        salesOwnerId: this.SelectedSalesOwnerId,
        salesExecutiveId: this.SelectedSalesExecutiveId,
        jobCategoryId: this.SelectedJobCategoryId,
        jobTypeId: this.SelectedJobTypeId,
        modeofTransportId: this.SelectedModeofTransportId,
        interestLevelId: this.SelectedInterestLevelId,
        informationSourceId: this.SelectedInformationSourceId,
        salesFunnelId: this.SelectedSalesFunnelId,
        expectedClosingDate: expectedClosingDate != null ? expectedClosingDate : null,
        statusId: this.SelectedStatusId,
       // approvalStatusId: this.approvalStatusId,

        reasonId: this.SelectedReasonId,
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
        storageUomId: this.SelectedStorageUomId,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,

      }

      const EnquiryPayload: EnquiryCombine = {
        enquiryGeneral: Enquiry,
        contacts: this.Contactperson,
        commodity: this.EnqCommodity,
        incoTerms: this.EnqIncoTerm,
        package: this.EnqPackage,
        documents: this.ImageDataArray,
        enqTransportModes:this.EnqModeoftransport
      }

      console.log("EnquiryPayload", EnquiryPayload);

      this.EnqS
        .CreateEnquiry(EnquiryPayload).subscribe({
          next: (res) => {
            const formData = new FormData();
            this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
            this.Fs.FileUpload(formData).subscribe({
              next: (res) => {
                
              },
              error: (error) => {
              }
            });

            if (!this.edit) {
              const parms ={
                MenuId:50,
                currentUser:this.userId$,
                activityName:"Creation",
                id:res.enquiryGeneral.enquiryId,
                code:res.enquiryGeneral.enquiryNumber
              }
              this.Ns.TriggerNotification(parms).subscribe((res=>{

              }));
              this.Cservice.displayToaster(
                "success",
                "Success",
                "Enquiry Added Sucessfully.."
              );
              this.router.navigate(["/crm/transaction/enquirylist"]);
            } else {
              const parms ={
                MenuId:50,
                currentUser:this.userId$,
                activityName:"Updation",
                id:res.enquiryGeneral.enquiryId,
                code:res.enquiryGeneral.enquiryNumber
              }
              this.Ns.TriggerNotification(parms).subscribe((res=>{
                console.log(res);
              }));
              this.Cservice.displayToaster(
                "success",
                "Success",
                "Enquiry Updated Sucessfully.."
              );
              this.router.navigate(["/crm/transaction/enquirylist"]);
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
      this.Enquiry.controls['enquiryDate'].setErrors(null);
      const noOfpkg = this.Enquiry.controls['packageNos'].value
      const noOfpkgcount = noOfpkg == null ? 0 : noOfpkg
      const count = this.EnqPackage.length;
      const invalidControls = this.findInvalidControls();
      if(noOfpkgcount!=count){
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Package details is less when compared to No of packages.",
          showConfirmButton: true,
        });
        this.changeTab(2);
      }
     else{
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
      this.changeTab(0);
      this.Enquiry.markAllAsTouched();
      this.validateall(this.Enquiry);
     }
     
    }

    }
  
  }

  getUnknownValues() {
    this.Cservice.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
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

  dateFilter = (date: Date | null): boolean => {
    // Get the current date and set the time to the start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    // Get the enquiry date from the form control
    const enquiryDateValue = this.Enquiry.controls['enquiryDate'].value;
  
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

  getTotalCrossWeight(): string {
    const totalCrossWeight = this.EnqPackage.reduce((total, item) => total + (+item.packWeightKg || 0), 0);
    return totalCrossWeight.toFixed(2);
  }

  getTotalChargeableWeight(): string {
    const totalChargeableWeight = this.EnqPackage.reduce((total, item) => total + (+item.chargePackWtKg || 0), 0);
    return totalChargeableWeight.toFixed(2);
  }

  Reset() {
    var Path = this.router.url;
    if (Path == "/crm/transaction/enquiry/edit/" + this.route.snapshot.params["id"]) {
      this.EditMode();

    } else {
      this.EnqPackage = [];
      this.Contactperson = [];
      this.EnqCommodity = [];
      this.EnqIncoTerm = [];
      this.ImageDataArray = [];

      this.Enquiry.reset();
      this.ContactForm.reset();
      this.EnqDoc.reset();

      this.IncoForm.reset();
      this.CommodityForm.reset();
      this.EnqDoc.get("documentName")?.setValue(null);
      this.initializeForm();
      this.InitializeDoc();
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

      this.filteredLoadingPorts = this.Enquiry.get('loadingPortId')?.valueChanges.pipe(
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

      this.filteredDestinationPorts = this.Enquiry.get('destinationPortId')?.valueChanges.pipe(
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
      this.filteredLoadingPorts = this.Enquiry.get('loadingPortId')?.valueChanges.pipe(
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
      this.filteredDestinationPorts = this.Enquiry.get('destinationPortId')?.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'string' ? value : value?.name)),
        map((name: any) => (name ? this._filterDestinationPorts(name) : this.DestPortDropDown?.slice()))
      );
    })
  }
  // Clear() {
  //   const pkgvalue = this.Enquiry.controls['packageNos'].value;
  //   if (pkgvalue < this.EnqPackage.length) {
  //     this.EnqPackage.splice(pkgvalue, 1);
  //   }
  // }
  EnqtoFollowup(){
    this.Link="/crm/transaction/followup/"+2+"/"+this.EditedEnquiry;
    this.router.navigate([this.Link]);
  }

  restrictInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9()+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  Downloads(file:any){
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }

  show(event: any): void {
    var filePath=this.Filepath+event
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


  onInput(event: Event, controlName:string): void {
    const input = (event.target as HTMLInputElement).value;
    if (!input) {
      // Clear the ID when the input value is erased
     var id = (this as any)[controlName] = null;
    }
  }


  //#region Mode of transport Multiselect
  onSelectModeoftrns() {
   
    this.transportSelectedoption();
    const selectedIncos = this.Enquiry.controls['modeofTransportId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedInco: any) =>
        !this.EnqModeoftransport.some(
          (existingInco: any) => existingInco.transportModeId === selectedInco
        )
    );
    uniqueSelectedInco.forEach((selectedInco: any) => {
      this.TransportForm = this.fb.group({
        rfqTransportModeId: [0],
        rfqId: [0],
        transportModeId: [selectedInco],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.EnqModeoftransport.push(this.TransportForm.value);
    });
    const uncheckedIncos = this.EnqModeoftransport.filter(
      (existingInco: any) =>
        !selectedIncos.includes(existingInco.transportModeId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.EnqModeoftransport.findIndex(
        (existingInco: any) =>
          existingInco.transportModeId === uncheckedInco.transportModeId
      );
      if (index !== -1) {
        this.EnqModeoftransport.splice(index, 1);
      }
    });
}
async transportSelectedoption() {
  const selectedModes = this.Enquiry.controls['modeofTransportId'].value;
  selectedModes.forEach((mode: number) => {
    if (mode === 1 && selectedModes.includes(2)) {
      Swal.fire({
        icon: "info",
        title: "Oops!",
        text: "Cannot select both Air and Sea simultaneously",
        showConfirmButton: false,
        timer: 2000,
      });
      this.Enquiry.controls['modeofTransportId'].reset();
      this.Enquiry.controls['loadingPortId'].reset();
      this.Enquiry.controls['destinationPortId'].reset();
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
      this.Enquiry.controls['modeofTransportId'].reset()
      this.Enquiry.controls['loadingPortId'].reset()
      this.Enquiry.controls['destinationPortId'].reset()

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
    this.Enquiry.controls['loadingPortId'].reset();
    this.Enquiry.controls['destinationPortId'].reset();
    // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
    // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();

  } else if (selectedModes.includes(2) && selectedModes.includes(3)) {
    const calcseaandroad = 10000
    this.Calculation(calcseaandroad);
    this.getorginseadropbycountryid(this.SelectedOriginCountryId);
    this.getDestseadropbycountryid(this.SelectedDestCountryId);
    this.ShowOnlyroad = true;
    this.ShowOnlysea = true
    this.chargablepackage = false;
    this.Enquiry.controls['loadingPortId'].reset();
    this.Enquiry.controls['destinationPortId'].reset();

    // if (selectedModes.includes(2) && selectedModes.includes(3)) {
    //   // Set validators for mandatory fields when statusId is 1
    //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
    // } else {
    //   // Remove validators if statusId is not 2
    //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

    //   this.Enquiry.get('shipmentTypeId')?.setValue(null);
    // }

    // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
  } else if (selectedModes.includes(1)) {
    const calcair = 6000
    this.Calculation(calcair);
    this.getorginAirdropbycountryid(this.SelectedOriginCountryId);
    this.getDestAirdropbycountryid(this.SelectedDestCountryId);
    this.ShowOnlyroad = false;
    this.ShowOnlysea = false
    this.chargablepackage = false;
    this.Enquiry.controls['loadingPortId'].reset();
    this.Enquiry.controls['destinationPortId'].reset();
    // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
    // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
  } else if (selectedModes.includes(2)) {
    this.getorginseadropbycountryid(this.SelectedOriginCountryId);
    this.getDestseadropbycountryid(this.SelectedDestCountryId);

    // if (selectedModes.includes(2)) {
    //   // Set validators for mandatory fields when statusId is 1
    //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.required]);
    // } else {
    //   // Remove validators if statusId is not 2
    //   this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);

    //   this.Enquiry.get('shipmentTypeId')?.setValue(null);
    // }

    // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
    this.ShowOnlyroad = false;
    this.ShowOnlysea = true
    this.chargablepackage = true;
    this.Enquiry.controls['loadingPortId'].reset();
    this.Enquiry.controls['destinationPortId'].reset();
  }
  else if (selectedModes.includes(3)) {
    this.SelectedLoadingPortId=null;
    this.SelectedDestinationPortId=null;
    this.ShowOnlyroad = true;
    this.ShowOnlysea = false
    this.chargablepackage = false;
    const calroad = 10000
    this.Calculation(calroad);
    this.orginPortDropDown=[];
    this.DestPortDropDown=[];
    this.Enquiry.controls['loadingPortId'].reset();
    this.Enquiry.controls['destinationPortId'].reset();
    // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
    // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
  }
  else if (selectedModes.includes(4)) {
    this.SelectedLoadingPortId=null;
    this.SelectedDestinationPortId=null;
    this.ShowOnlyroad = true;
    this.ShowOnlysea = false
    this.chargablepackage = false;
    const calccurior = 5000
    this.Calculation(calccurior);
    this.orginPortDropDown=[];
    this.DestPortDropDown=[];
    this.Enquiry.controls['loadingPortId'].reset();
    this.Enquiry.controls['destinationPortId'].reset();
    // this.Enquiry.get('shipmentTypeId')?.setValidators([Validators.nullValidator]);
    // this.Enquiry.get('shipmentTypeId')?.updateValueAndValidity();
  }
}

changeTab(index: number): void {
  this.selectedIndex = index;
}
}
