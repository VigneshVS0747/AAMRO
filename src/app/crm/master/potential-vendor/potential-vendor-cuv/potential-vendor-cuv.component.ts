import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CurrenciesService } from 'src/app/ums/masters/currencies/currencies.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { PotentialVendorService } from '../potential-vendor.service';
import { BillingCurrencys, StatusTypeInPC, StatsuTypeInPVs, ApprovalStatusModel } from 'src/app/Models/crm/master/Dropdowns';
import { PotentialVendor, PotentialVendorAddress, PotentialVendorContact, PotentialVendorContainer, PotentialVendorDocument, PotentialVendorServiceDetails, PotentialVendorServices } from '../potential-vendor.model';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DocmentsService } from '../../document/document.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import { StatusTypeInJobTypes } from '../../jobtype/jobtypemodel.model';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { ServiceTypeServiceService } from '../../servicetype/service-type-service.service';
import { PotentialvendorAddressDialogComponent } from '../potentialvendor-address-dialog/potentialvendor-address-dialog/potentialvendor-address-dialog.component';
import { PotentialvendorContactDialogComponent } from '../potentialvendor-contact-dialog/potentialvendor-contact-dialog/potentialvendor-contact-dialog.component';
import { Country } from "src/app/ums/masters/countries/country.model";
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment.development';
import { LineitemService } from '../../lineitemcategory/lineitem.service';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-potential-vendor-cuv',
  templateUrl: './potential-vendor-cuv.component.html',
  styleUrls: ['./potential-vendor-cuv.component.css','../../../../ums/ums.styles.css']
})
export class PotentialVendorCuvComponent {
  pppvServiceArray: PotentialVendorServices[] = [];
  PotentialVendorForm: FormGroup;
  viewMode: boolean = false;
  liveStatus = 1;
  currencyList: Currency[] = [];
  billingCurrencyList: BillingCurrencys[] = [];
  statusList: StatsuTypeInPVs[] = [];
  keywordService = "countryName";
  keywordServiceDetails = "serviceTypeName";
  countries: Country[] = [];
  servicetypes: ServiceType[] = [];
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;

  filteredCurrencyListOptions$: Observable<any[]>;
  filteredbillingCurrencyListOptions$: Observable<any[]>;
  filteredStatusOptions$: Observable<any[]>;
  selectedItems: any[] = [];
  vendorCurrencyId: number;
  billingCurrencyId: number;
  processTitle = 'Add';
  gereralEdit: boolean;

  potentialVendorContainer: PotentialVendorContainer;
  potentialVendor: PotentialVendor = new PotentialVendor();
  potentialVendorServices: PotentialVendorServices[] = [];
  potentialVendorServiceDetails: PotentialVendorServiceDetails[] = [];
  potentialVendorContacts: PotentialVendorContact[] = [];
  potentialVendorAddress: PotentialVendorAddress[] = [];
  potentialVendorDocuments: PotentialVendorDocument[] = [];

  pvService: PotentialVendorServices[] = [];
  pvServiceArray: PotentialVendorServices[] = [];

  
  pvServiceDetailsArray: PotentialVendorServiceDetails[] = [];
  pvContactArray: PotentialVendorContact[] = [];
  pvAddressArray: PotentialVendorAddress[] = [];
  pvDocumentArray: PotentialVendorDocument[] = [];

  Showform: boolean | undefined;
  documentModel: PotentialVendorDocument[] = [];
  date = new Date;
  showAddRowDoc: boolean;
  showAddRowServiceDetails: boolean;
  showAddRowServices: boolean = false;
  remarks: any;
  documentId: any;
  onSelectDoc: boolean;
  onSelectServiceDetails: boolean;
  onSelectServices: boolean;
  documents: Documents[] = [];
  statusTypeInJobTypes: StatusTypeInJobTypes[] = [];
  keywordStatus = 'statusTypeInJobType'
  keywordDoc = 'documentName'
  documentName: any
  filteredAddressOptions$: Observable<any[]>;
  potentialVendorId: number;
  existStatus: boolean = false;
  editedContact: any;
  rowIndexContact: number;
  existaddress: boolean;
  filePath: string;
  disablefields: boolean;
  existDoc: boolean;
  existServiceDetails: boolean;
  existServices: boolean;
  rowIndexforDoc: any;
  rowIndexforServiceDetails: any;
  rowIndexforServices: any;
  editDocumet: any;
  editServices: any;
  editServiceDetails: any;
  removeDoc: PotentialVendorDocument[];
  removeServices: PotentialVendorServices[];
  removeServiceDetails: PotentialVendorServiceDetails[];
  rowIndexAddress: number;
  editedAddress: any;
  fileType: boolean;
  ServiceType: any;
  pvServiceId: number;
  pvServiceDetailsId: any;
  countryId: any;
  LineItemCategoryId: any;
  contactTypeId: any;
  departmentId: any;
  addressTypeId: any;
  stateId: any;
  cityId: any;
  potentialService: PotentialVendorService[];
  countryName: string | null;
  serviceTypeName: string | null;
  lineItemCategorys: any[] = [];

  selectedcountyid: any;
  toppings = new FormControl();
  form: FormGroup<{ userId: FormControl<never[] | null>; }>;

  dataSource!: MatTableDataSource<PotentialVendorServices>;
  file: string;
  fileName: any='';
  pvStatusId: any;
  filteredServiceTypeListOptions$: Observable<any[]>;
  fileInput: any;
  isServiceTypesEmpty: boolean;
  userId$: string;
  pvres: any;
  converthide: boolean=false;
  documentTypeName: any;

  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;

  ImageDetailsArray: any[]=[];
  Filepath = environment.Fileretrive;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>; 
  lineItemCategoryList: lineitem[];

  approvalStatusList: ApprovalStatusModel[];
  approvalStatusId: any;
  filteredApprovalStatusOptions$: Observable<any[]>;
  selectedIndex = 0;
  isEditDocument: boolean;
  isDraft: boolean=true;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private commonService: CommonService,
    private ServiceTypeService: ServiceTypeServiceService,
    private potentialVendorService: PotentialVendorService,
    private docmentsService: DocmentsService,
    private ErrorHandling: ErrorhandlingService,
    private currenciesService: CurrenciesService,
    private UserIdstore: Store<{ app: AppState }>,
    private Fs:FileuploadService,
    private lineitemService: LineitemService,  private Ns:NofificationconfigurationService,
    private errorHandler: ApiErrorHandlerService
) {

  }
  ghjserviceTypeId: number[] = [1, 2, 3, 4, 5];

  returnToList() {
    this.router.navigate(["/crm/master/potentialvendorlist"]);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.potentialVendorServices);
    this.GetUserId();
    this.iniForm();
    this.getCurrencyList();
    this.getbillingCurrencyList();
    this.getAllStatusVendor();
    this.getCountries();
    this.GetAllServiceType();
    this.getDocumentList();
    this.getLineItemCategoryList();
    //this.GetAllApprovalStatus();


    if (!this.potentialVendorService.itemId && !this.potentialVendorService.isEdit && !this.potentialVendorService.isView) {
      //document check list binding 
      this.potentialVendorService.GetAllDocumentMappingByScreenId(9).subscribe(res => {
        if(res){
          this.potentialVendorDocuments = res.map(ele => {
            return {
              pvDocumentId: 0,
              potentialVendorId: 0,
              documentId: ele.documentId,
              remarks: '',
              createdBy: parseInt(this.userId$),
              createdDate: this.date,
              documentName: '',
              documentTypeName: ele.documentName,
              IseditDoc: false,
              newDoc: true,
              statusTypeInJobType: '',
              files: ''
            };
          });
          this.potentialVendorDocuments = [...this.potentialVendorDocuments];
          this.pvDocumentArray = [...this.potentialVendorDocuments];
        }
        console.log(this.potentialVendorDocuments)
      });
    }

    if (this.potentialVendorService.itemId && this.potentialVendorService.isEdit) {
      this.processTitle = 'Edit';
      this.gereralEdit = true;
      this.disablefields = false;
      this.converthide=true;
      const id = this.potentialVendorService.itemId;
      this.getAllbyId(id);
    } else if (this.potentialVendorService.itemId && this.potentialVendorService.isView) {
      const id = this.potentialVendorService.itemId;
      this.processTitle = 'View';
      this.gereralEdit = false;
      this.disablefields = true;
      this.viewMode = true;
      this.converthide=true;
      this.getAllbyId(id);
      this.isDraft = true;

    }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  getLineItemCategoryList() {
    this.lineitemService.GetAlllineItem(this.liveStatus).subscribe(result => {
      this.lineItemCategoryList = result;
      console.log(this.lineItemCategoryList);
      
    });
  }
  //#region vendor currency
  getCurrencyList() {
    this.commonService.getCurrencies(this.liveStatus).subscribe(result => {
      this.currencyList = result;
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.PotentialVendorForm.controls['vendorCurrencyId'].valueChanges.pipe(
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
    this.PotentialVendorForm.controls['vendorCurrencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    console.log(data);

    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.vendorCurrencyId = selectedValue.currencyId;
  }
  //#endregion

  //#region billing currency
  getbillingCurrencyList() {
    this.commonService.getBillingCurrencies(this.liveStatus).subscribe(result => {
      this.billingCurrencyList = result;
      this.billingCurrencyFun();
    });
  }
  billingCurrencyFun() {
    this.filteredbillingCurrencyListOptions$ = this.PotentialVendorForm.controls['billingCurrencyId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.billingCurrency)),
      map((name: any) => (name ? this.filteredbillingCurrencyListOptions(name) : this.billingCurrencyList?.slice()))
    );
  }
  private filteredbillingCurrencyListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.billingCurrencyList.filter((option: any) => option.billingCurrency.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataBillCurrency1();
  }
  NoDataBillCurrency1(): any {
    this.PotentialVendorForm.controls['billingCurrencyId'].setValue('');
    return this.billingCurrencyList;
  }
  displayBillCurrencyListLabelFn(data: any): string {
    return data && data.billingCurrency ? data.billingCurrency : '';
  }
  billCurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.billingCurrencyId = selectedValue.billingCurrencyId;
  }


  //#region Status
  getAllStatusVendor() {
    this.commonService.getAllStatusVendor().subscribe(result => {
      this.statusList = result;
      const value= this.statusList.find(obj=> obj.pvStatus=='Draft')
      this.PotentialVendorForm.controls['pvStatusId'].setValue(value);
      this.pvStatusId=value?.pvStatusId;
      this.statusFun();
    });
  }
  statusFun() {
    this.filteredStatusOptions$ = this.PotentialVendorForm.controls['pvStatusId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.pvStatus)),
      map((name: any) => (name ? this.filteredStatusOptions(name) : this.statusList?.slice()))
    );
  }
  private filteredStatusOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.statusList.filter((option: any) => option.pvStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataStatus();
  }
  NoDataStatus(): any {
    this.PotentialVendorForm.controls['pvStatusId'].setValue('');
    return this.statusList;
  }
  displayStausListLabelFn(data: any): string {
    return data && data.pvStatus ? data.pvStatus : '';
  }
  StatusListSelectedoption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.pvStatusId = selectedValue.pvStatusId;
    if(this.pvStatusId==3)
      {
        this.converthide=true;
      }
      else
      {
        this.converthide=false;
      }
  }
  isOptionDisabled(option: any): any {
    if (this.pvStatusId == 1) {
      this.isDraft = false;
      return !(option.pvStatusId === 1 || option.pvStatusId === 2);
    } else if (this.pvStatusId == 2) {
      this.isDraft = false;
      return !(option.pvStatusId === 1 || option.pvStatusId === 2);
    }
    else if (this.pvStatusId == 3) {
      this.converthide=false;
      return !(option.pvStatusId === 3);
    }
    else if (this.pvStatusId == 4) {
      this.isDraft = true;
      this.converthide=true;
      return !(option.pvStatusId === 4);
    }
  }

   //#region approval status
  //  GetAllApprovalStatus() {
  //   this.commonService.GetAllApprovalStatus().subscribe(result => {
  //     this.approvalStatusList = result;
  //     const value = this.approvalStatusList.find(obj => obj.approvalStatusId == 1)
  //     this.PotentialVendorForm.controls['approvalStatusId'].setValue(value);
  //     this.approvalStatusId = 1;
  //     this.ApprovalStatusFun();
  //   })
  // }
  // ApprovalStatusFun() {
  //   this.filteredApprovalStatusOptions$ = this.PotentialVendorForm.controls['approvalStatusId'].valueChanges.pipe(
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
  //   this.PotentialVendorForm.controls['approvalStatusId'].setValue('');
  //   return this.approvalStatusList;
  // }
  // displayApprovalStatusLabelFn(data: any): string {
  //   return data && data.approvalStatus ? data.approvalStatus : '';
  // }
  // selectApprovalStatus(data: any) {
  //   let selectedValue = data.option.value;
  //   this.approvalStatusId = selectedValue.approvalStatusId;
  // }

  //#endregion
  //getAll by potential vendor Id 
  getAllbyId(id: number) {
    this.potentialVendorService.getAllPotentialVendorById(id).subscribe(result => {
      this.potentialVendorContainer = result;
      this.potentialVendor = result.potentialVendor;
      this.potentialVendorServices = result.potentialVendorServices
      this.potentialVendorContacts = result.potentialVendorContacts;
      this.potentialVendorAddress = result.potentialVendorAddresses;
      this.potentialVendorDocuments = result.potentialVendorDocuments;

      this.pvService=result.potentialVendorServices;
      this.pvServiceArray=result.potentialVendorServices;
          
      if(this.potentialVendor.pvStatusId==3)
        {
          this.converthide=true;
        }
        else
        {
          this.converthide=false;
        }
      this.pvService.forEach(service => {
        if(service.lineItemCategorysIdsArray!=null)
        {
          service.lineItemCategorys = service.lineItemCategorysIdsArray.split(',').map(id => parseInt(id, 10));
        }
      });
      this.potentialVendorDocuments = [...this.potentialVendorDocuments];
      this.pvService = [...this.pvService];
      this.pppvServiceArray = result.potentialVendorServices;
      this.pvContactArray = result.potentialVendorContacts;
      this.pvAddressArray = result.potentialVendorAddresses;
      this.pvDocumentArray = result.potentialVendorDocuments;


      this.setValues();
    });
  }
  setName() {
    const aliasName = this.PotentialVendorForm.controls['aliasName'].value
    if (aliasName == null) {
      const name = this.PotentialVendorForm.controls['vendorName'].value
      this.PotentialVendorForm.controls['aliasName'].setValue(name);
    }
  }

  setValues() {
    debugger
    this.PotentialVendorForm.patchValue(this.potentialVendor);
    this.potentialVendorId = this.potentialVendor.potentialVendorId;
    this.vendorCurrencyId = this.potentialVendor.vendorCurrencyId;
    this.billingCurrencyId = this.potentialVendor.billingCurrencyId;
    this.pvStatusId = this.potentialVendor.pvStatusId;
    if (this.pvStatusId == 4) {
      this.isDraft = true;
    }
    //this.approvalStatusId = this.potentialVendor.approvalStatusId;

    this.PotentialVendorForm.controls['potentialVendorId'].setValue(this.potentialVendor);
    this.PotentialVendorForm.controls['vendorCurrencyId'].setValue(this.potentialVendor);
    this.PotentialVendorForm.controls['billingCurrencyId'].setValue(this.potentialVendor);
    this.PotentialVendorForm.controls['pvStatusId'].setValue(this.potentialVendor);
    //this.PotentialVendorForm.controls['approvalStatusId'].setValue(this.potentialVendor);



  }
  vendorCurrencyget() {
    debugger
    this.currenciesService.getCurrency(this.potentialVendor.vendorCurrencyId).subscribe(res => {
      this.PotentialVendorForm.controls['vendorCurrencyId'].setValue(res.currencyName);
      console.log(res)
    });
  }


  //---------------------------General--------------------------------------
  value(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.startsWith('0') && value.length > 1) {
      value = value.slice(1);
    }
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    input.value = value;
    this.PotentialVendorForm.controls['yearOfOperation'].setValue(value);
  }

  restrictInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9()+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  iniForm() {
    this.PotentialVendorForm = this.fb.group({
      potentialVendorId: [0],
      potentialVendorCode: [{ value: null, disabled: true }],
      vendorName: ['', Validators.required],
      aliasName: [null, Validators.required],
      vendorEmail: ['', Validators.email],
      vendorPhone: ['', Validators.required],
      companyWebsite: [null],
      billingCurrencyId: [null],
      vendorCurrencyId: [null],
      yearOfOperation: [null],
      //approvalStatusId: [null],
      pvStatusId: [0, Validators.required],
      vendorRemarks: [null],
      tags: [null],
      liveStatus: [true],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });

  }
  onSaveGeneralAndConvert() {
    debugger
    if (!this.PotentialVendorForm.controls['vendorEmail'].valid) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please provide a valid email address.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.changeTab(0);
      this.PotentialVendorForm.controls['vendorEmail'].markAllAsTouched();
      return
    }
    if (this.PotentialVendorForm.valid) {
      this.potentialVendor = this.PotentialVendorForm.value;
      this.potentialVendor.potentialVendorCode = this.PotentialVendorForm.controls['potentialVendorCode'].value;
      this.potentialVendor.potentialVendorId = this.PotentialVendorForm.controls['potentialVendorId'].value;
      this.potentialVendor.aliasName = this.PotentialVendorForm.controls['aliasName'].value;
      this.potentialVendor.vendorEmail = this.PotentialVendorForm.controls['vendorEmail'].value;
      this.potentialVendor.vendorPhone = this.PotentialVendorForm.controls['vendorPhone'].value;
      this.potentialVendor.vendorName = this.PotentialVendorForm.controls['vendorName'].value;
      this.potentialVendor.yearOfOperation = this.PotentialVendorForm.controls['yearOfOperation'].value;
      this.potentialVendor.companyWebsite = this.PotentialVendorForm.controls['companyWebsite'].value;
      this.potentialVendor.tags = this.PotentialVendorForm.controls['tags'].value;
      this.potentialVendor.vendorRemarks = this.PotentialVendorForm.controls['vendorRemarks'].value;
      this.potentialVendor.potentialVendorId = this.potentialVendorId;
      this.potentialVendor.vendorCurrencyId = this.vendorCurrencyId;
      this.potentialVendor.billingCurrencyId = this.billingCurrencyId;
      this.potentialVendor.pvStatusId = this.pvStatusId;
      //this.potentialVendor.approvalStatusId = this.approvalStatusId;
      this.potentialVendor.createdBy=this.PotentialVendorForm.controls['createdBy'].value
      this.potentialVendor.updatedBy = parseInt(this.userId$);

      const ModelContainer: PotentialVendorContainer = {
        potentialVendor: this.potentialVendor,
        potentialVendorServices: this.pvServiceArray,
       // potentialVendorServiceDetails: this.potentialVendorServiceDetails,
        potentialVendorContacts: this.potentialVendorContacts,
        potentialVendorAddresses: this.potentialVendorAddress,
        potentialVendorDocuments: this.potentialVendorDocuments,

      }
      if(this.potentialVendorContacts.length==0 )
      {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary contact details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(2);
        return
      }
      if(this.potentialVendorAddress.length==0)
      {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary address details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(3);
        return
      }

      let contact = this.potentialVendorContacts.find((element) => element.primaryContact == true);
      let address = this.potentialVendorAddress.find((element) => element.primaryAddress == true);

      if(contact?.primaryContact==false|| contact==undefined)
      {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary contact details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(2);
        return
      }
      if(address?.primaryAddress==false|| address==undefined)
      {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary address details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(3);
        return
      }
      if (ModelContainer.potentialVendor.potentialVendorId == 0 || ModelContainer.potentialVendor.potentialVendorId == undefined) {
        this.potentialVendorService.PotentialVendorSave(ModelContainer).subscribe({
          next: (res) => {
            debugger
            this.pvres=res
            const id= this.pvres.potentialVendorId
            this.commonService.displayToaster(
              "success",
              "Success",
              "Added Sucessfully"
            );
            this.potentialVendorService.movetoVendor=true;
            this.potentialVendorService.setItemId(id);
            this.router.navigate(["/crm/master/vendor/create-edit-view"]);
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
      else {
        const status=this.PotentialVendorForm.controls['pvStatusId'].value;
        if(status.pvStatus.toLowerCase()=="moved to vendor"){
          Swal.fire({
            title: 'Exist',
            text: "The " + status.vendorName + ' potential vendor is already moved to vendor...!',
            icon: 'warning',
            confirmButtonText: 'ok'
          })
          return
        }
        this.potentialVendorService.movetoVendor=true;
        this.potentialVendorService.setItemId(this.potentialVendorId);
        this.router.navigate(["/crm/master/vendor/create-edit-view"]);
      }
    }
    else {
      this.PotentialVendorForm.markAllAsTouched();
      this.validateall(this.PotentialVendorForm);

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.changeTab(0);
    }

  }
    //// finding In valid field
    findInvalidControls(): string[] {
      const invalidControls: string[] = [];
      const controls = this.PotentialVendorForm.controls;
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

  onSaveGeneral(value:any) {
      if (!this.PotentialVendorForm.controls['vendorEmail'].valid && this.pvStatusId!=4) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please provide a valid email address.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(0);
        this.PotentialVendorForm.controls['vendorEmail'].markAllAsTouched();
        return
      }
      if(this.showAddRowDoc){
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
          //Status Update 
    if (value === 'Save') {
      if (this.pvStatusId == 1) {
        this.pvStatusId = 1;
      } else if (this.pvStatusId == 2) {
        this.pvStatusId = 2;
      }
      else if (this.pvStatusId == 3) {
        this.pvStatusId = 3;
      } if (this.pvStatusId == 4) {
        this.pvStatusId = 1;
      }
    }
    else if (value === 'Draft') {
      if (this.pvStatusId == 4) {
        this.pvStatusId = 4;
      }
    }
    if (this.PotentialVendorForm.valid || this.pvStatusId === 4) {

     let name = this.PotentialVendorForm.controls['vendorName'].value
     if(!name){
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the Vendor Name.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
     }

      this.potentialVendor = this.PotentialVendorForm.value;
      this.potentialVendor.potentialVendorCode = this.PotentialVendorForm.controls['potentialVendorCode'].value;
      this.potentialVendor.potentialVendorId = this.PotentialVendorForm.controls['potentialVendorId'].value;
      this.potentialVendor.aliasName = this.PotentialVendorForm.controls['aliasName'].value;
      this.potentialVendor.vendorEmail = this.PotentialVendorForm.controls['vendorEmail'].value || 'test@gmail.com';
      this.potentialVendor.vendorPhone = this.PotentialVendorForm.controls['vendorPhone'].value || '123456789' ;
      this.potentialVendor.vendorName = this.PotentialVendorForm.controls['vendorName'].value;
      this.potentialVendor.yearOfOperation = this.PotentialVendorForm.controls['yearOfOperation'].value;
      this.potentialVendor.companyWebsite = this.PotentialVendorForm.controls['companyWebsite'].value;
      this.potentialVendor.tags = this.PotentialVendorForm.controls['tags'].value;
      this.potentialVendor.vendorRemarks = this.PotentialVendorForm.controls['vendorRemarks'].value;
      this.potentialVendor.potentialVendorId = this.potentialVendorId;
      this.potentialVendor.vendorCurrencyId = this.vendorCurrencyId;
      //this.potentialVendor.approvalStatusId = this.approvalStatusId;
      this.potentialVendor.billingCurrencyId = this.billingCurrencyId;
      this.potentialVendor.pvStatusId = this.pvStatusId;
      this.potentialVendor.updatedBy = parseInt(this.userId$);

      const ModelContainer: PotentialVendorContainer = {
        potentialVendor: this.potentialVendor,
        potentialVendorServices: this.pvServiceArray,
       // potentialVendorServiceDetails: this.potentialVendorServiceDetails,
        potentialVendorContacts: this.potentialVendorContacts,
        potentialVendorAddresses: this.potentialVendorAddress,
        potentialVendorDocuments: this.potentialVendorDocuments,

      }
      if(this.potentialVendorContacts.length==0 && this.pvStatusId!=4)
      {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary contact details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(2);
        return
      }
      if(this.potentialVendorAddress.length==0 && this.pvStatusId!=4)
      {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary address details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(3);
        return
      }
      if(this.potentialVendorContacts.length)
        {
      let contact = this.potentialVendorContacts.find((element) => element.primaryContact == true);
      if(contact?.primaryContact==false|| contact==undefined)
        {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill the one primary contact details.",
            showConfirmButton: false,
            timer: 2000,
          });
          this.changeTab(2);
          return
        }
        }

      if(this.potentialVendorAddress.length)
        {
          let address = this.potentialVendorAddress.find((element) => element.primaryAddress == true);
          if(address?.primaryAddress==false|| address==undefined)
          {
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Please fill the one primary address details.",
              showConfirmButton: false,
              timer: 2000,
            });
            this.changeTab(3);
            return
          }
        }
     
      if (ModelContainer.potentialVendor.potentialVendorId == 0 || ModelContainer.potentialVendor.potentialVendorId == undefined) {
        this.potentialVendorService.PotentialVendorSave(ModelContainer).subscribe({
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
            const parms ={
              MenuId:27,
              currentUser:this.userId$,
              activityName:"Creation",
              id:res.potentialVendor.potentialVendorId,
              code:res.potentialVendor.potentialVendorCode
            }
            this.Ns.TriggerNotification(parms).subscribe((res=>{

            }));
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
          },
        });
      }
      else {
        this.potentialVendorService.PotentialVendorSave(ModelContainer).subscribe({
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
            this.returnToList();
            const parms ={
              MenuId:27,
              currentUser:this.userId$,
              activityName:"Updation",
              id:res.potentialVendor.potentialVendorId,
              code:res.potentialVendor.potentialVendorCode
            }
            this.Ns.TriggerNotification(parms).subscribe((res=>{

            }));
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
    else {
      const invalidControls = this.findInvalidControls();

      this.PotentialVendorForm.markAllAsTouched();
      this.validateall(this.PotentialVendorForm);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
      this.changeTab(0);
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
  resetGeneral() {
    this.showAddRowDoc=false;
    this.showAddRowServices=false;
    if (this.gereralEdit) {
      this.getAllbyId(this.potentialVendorService.itemId);
    }
    this.PotentialVendorForm.reset();
    this.potentialVendor = new PotentialVendor();
    this.potentialVendorServices = [];
    this.potentialVendorServiceDetails = [];
    this.potentialVendorContacts = [];
    this.potentialVendorAddress = [];
    this.potentialVendorDocuments = [];
    
    this.pppvServiceArray = [];
    this.pvContactArray = [];
    this.pvAddressArray = [];
    this.pvDocumentArray = [];
    this.ngOnInit();

  }
   /////////////////////---------------service Details-------------------------
   getCountries() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.countries = result;
      // this.dataSource.data = this.countries;
      console.log(this.countries)
    });
  }
  GetAllServiceType() {
    this.ServiceTypeService.GetAllServiceType(this.liveStatus).subscribe(res => {
      this.servicetypes = res;
      //this.ServiceTypeFun();
    })
  }
  onInputChangecountries(event: any, dataItem: any) {
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.countries.some(cun => cun.countryName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.countryName = '';
    }
  }
  AddService() {
    debugger
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});

    if (!this.showAddRowServices) {
      const newRow: PotentialVendorServices = {
        pvServiceId: 0,
        potentialVendorId: 0,
        countryId: 0,
        remarks: '',
        liveStatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedDate: this.date,
        updatedBy: parseInt(this.userId$),
        countryName: '',
        IseditServices: true,
        newServices: true,
        LineItemCategoryId: 0,
        serviceTypeName: '',
        lineItemCategorys: [],
        lineItemCategorysIdsArray: '',
      };
      this.pvService = [newRow, ...this.pvService];
      this.showAddRowServices = true;
      this.lineItemCategorys = [];
      this.remarks='';
    }
  }
  onlineItemCategoryChangeEvent(lineItemCategory: any) {
    this.lineItemCategorys= lineItemCategory;
  }

  
  SaveService(data: PotentialVendorServices) {
    debugger
    this.isServiceTypesEmpty = data.lineItemCategorys.length === 0;
    if (this.countryName == "" || this.isServiceTypesEmpty) {
      this.isServiceTypesEmpty=false;
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.lineItemCategorys=this.lineItemCategorys;
    data.countryName = this.countryName;
    data.countryId = this.countryId;
    data.serviceTypeName = this.serviceTypeName;
    data.LineItemCategoryId = this.LineItemCategoryId;
    data.remarks = this.remarks;
    
    this.pvServiceArray.forEach(element => {
      if (element.countryName === data.countryName) {
        this.existServices = true;
      }
    });
    if (this.existServices) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowServices = true;
      data.IseditServices = true;
      this.existServices = false;
      return;
    }
    else {
      this.pvServiceArray.splice(0, 0, data);
     // this.pvService = [ ...this.pvService];
      this.showAddRowServices = false;
      data.IseditServices = false;
      data.newServices = false;
    }
    this.onSelectServices = false;
    console.log(data)
    console.log('test',this.pvServiceArray)
  }


  UpdateService(data: PotentialVendorServices) {
    debugger
    this.isServiceTypesEmpty = data.lineItemCategorys.length === 0;
    if (data.countryName == "" || this.isServiceTypesEmpty) {
      this.isServiceTypesEmpty=false;
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.updatedBy=parseInt(this.userId$);
    data.lineItemCategorys=this.lineItemCategorys;
    data.LineItemCategoryId = this.LineItemCategoryId;
    data.serviceTypeName = this.serviceTypeName;
    data.countryName = this.countryName;
    data.countryId = this.countryId;
    data.remarks = this.remarks;

    if (this.onSelectServices) {
      data.lineItemCategorys=this.lineItemCategorys;
      data.LineItemCategoryId = this.LineItemCategoryId;
      data.serviceTypeName = this.serviceTypeName;
      data.countryId = this.countryId;
      data.countryName = this.countryName;
      data.remarks = this.remarks;

    }
    this.pvServiceArray.forEach(element => {
      if (element.countryName === data.countryName && element.serviceTypeName === data.serviceTypeName) {
        this.existServices = true;
      }
    });

    if (this.existServices) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowServices = true;
      data.IseditServices = true;
      this.existServices = false;

      return;
    }
    else {
      this.pvServiceArray.splice(this.rowIndexforServices, 0, data);
      //this.pvDocumentArray.push(data);
      this.showAddRowServices = false;
      data.IseditServices = false;
      data.newServices = false;

    }
  }

  EditService(data: PotentialVendorServices) {
    debugger
    data.IseditServices = true;
    data.newServices = false;
    this.countryName = data.countryName;
    this.countryId=data.countryId;
    this.serviceTypeName = data.serviceTypeName;
    this.lineItemCategorys=data.lineItemCategorys;
    this.remarks = data.remarks;
    const rowIndex = this.pvServiceArray.indexOf(data);
    this.rowIndexforServices = rowIndex;
    this.editServices = { ...data };
    this.removeServices = this.pvServiceArray.splice(rowIndex, 1)
    this.onSelectServices = false;
  }

  DeleteService(data: PotentialVendorServices) {
    const rowIndex = this.pvServiceArray.indexOf(data);
    this.pvServiceArray.splice(rowIndex, 1);
    this.pvService.splice(rowIndex, 1);
    this.pvService = [...this.pvService];
    data.IseditServices = false;
    this.showAddRowServices = false;
  }
  oncancelService(data: PotentialVendorServices) {
    debugger
    const rowIndex = this.pvService.indexOf(data);
    if (data.newServices&&rowIndex!=-1) {
      this.pvService.splice(rowIndex, 1);
      this.pvService = [...this.pvService];
      this.showAddRowServices = false;
      data.newServices = false;
      return;
    }
    if (data.IseditServices&&rowIndex!=-1) {
      this.pvService.splice(rowIndex, 1);
      this.pvService.splice(rowIndex, 0, this.editServices);
      //this.pvServiceArray.splice(rowIndex,0,this.editServices);
      this.pvService = [...this.pvService];
      this.showAddRowServices = false;
      this.editServices.IseditServices = false;
      data.newServices = false;
    }
    data.IseditServices=false;
    this.showAddRowServices = false;
      this.editServices.IseditServices = false;
  }

  selectServiceEvent(item: any) {
    this.onSelectServices = true;
    this.countryId = item.countryId;
    this.countryName = item.countryName;
    this.remarks = item.remarks;
  }
  
  ValidateFieldService(item: any) {
    if (item !== "") {
      return false;
    } else {
      return true;
    }
  }
  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressService(event: any, dataItem: PotentialVendorServices) {
    if (event.key === 'Enter') {
      this.showAddRowServices ? this.SaveService(dataItem) : this.UpdateService(dataItem);
    }
  }
  /// to reach submit button
  handleChangeService(event: any, dataItem: PotentialVendorServices) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeService(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressService(event: any, dataItem: PotentialVendorServices) {
    if (event.key === 'Enter') {
      this.oncancelService(dataItem)
    }
  }
  //3---------------------------contacts--------------------------------------

  onEditContact(Data: any) {
    this.rowIndexContact = this.potentialVendorContacts.indexOf(Data);
    this.editedContact = { ...Data }
    this.potentialVendorContacts.splice(this.rowIndexContact, 1);
    const dialogRef = this.dialog.open(PotentialvendorContactDialogComponent, {
      data: {
        contactData: Data,
        list: this.potentialVendorContacts,
        mode: 'Edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialVendorContacts.splice(this.rowIndexContact, 0, result);
        this.potentialVendorContacts = [...this.potentialVendorContacts];
      }
      else {
        this.potentialVendorContacts.splice(this.rowIndexContact, 0, this.editedContact);
        this.potentialVendorContacts = [...this.potentialVendorContacts];
      }
    });
  }
  onDeleteContact(data: any) {
    const rowIndex = this.potentialVendorContacts.indexOf(data);
    this.potentialVendorContacts.splice(rowIndex, 1);
    this.potentialVendorContacts = [...this.potentialVendorContacts];
  }
  onviewContact(Data: any) {
    const dialogRef = this.dialog.open(PotentialvendorContactDialogComponent, {
      data: {
        contactData: Data,
        mode: 'View',
      }
    });

  }
  openDialog() {
    debugger
    const dialogRef = this.dialog.open(PotentialvendorContactDialogComponent, {
      data: {
        list: this.potentialVendorContacts
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialVendorContacts.splice(0, 0, result);
        this.potentialVendorContacts = [...this.potentialVendorContacts];
      }
    });
  }


  //4---------------------------address--------------------------------------

  onEditAddress(Data: any) {
    debugger
    this.rowIndexAddress = this.potentialVendorAddress.indexOf(Data);
    this.editedAddress = { ...Data }
    this.potentialVendorAddress.splice(this.rowIndexAddress, 1);
    const dialogRef = this.dialog.open(PotentialvendorAddressDialogComponent, { data: { addressDate: Data, list: this.potentialVendorAddress, mode: 'Edit', index: this.rowIndexContact }, disableClose: true, });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialVendorAddress.splice(this.rowIndexAddress, 0, result);
        this.potentialVendorAddress = [...this.potentialVendorAddress];
      }
      else {
        this.potentialVendorAddress.splice(this.rowIndexAddress, 0, this.editedAddress);
        this.potentialVendorAddress = [...this.potentialVendorAddress];
      }
    });
  }
  onDeleteAddress(data: any) {
    const rowIndex = this.potentialVendorAddress.indexOf(data);
    this.potentialVendorAddress.splice(rowIndex, 1);
    this.potentialVendorAddress = [...this.potentialVendorAddress];
  }
  onviewAddress(Data: any) {
    const dialogRef = this.dialog.open(PotentialvendorAddressDialogComponent, {
      data: {
        addressDate: Data,
        mode: 'View',
      }
    });
  }
  AddressDialog() {
    const dialogRef = this.dialog.open(PotentialvendorAddressDialogComponent, { data: { list: this.potentialVendorAddress } });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialVendorAddress.splice(0, 0, result)
        this.potentialVendorAddress = [...this.potentialVendorAddress];
      }
    });
  }


  //5---------------------------attachments--------------------------------------

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
    this.pageChange({skip:skip,take:take});
    this.isEditDocument = false;
    if (!this.showAddRowDoc) {
      const newRow: PotentialVendorDocument = {
        pvDocumentId: 0,
        potentialVendorId: 0,
        documentId: 0,
        remarks: '',
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        documentName: '',
        documentTypeName:'',
        IseditDoc: true,
        newDoc: true,
        statusTypeInJobType: '',
        files: ''
      };
      this.remarks = '';
      this.potentialVendorDocuments = [newRow, ...this.potentialVendorDocuments];
      this.showAddRowDoc = true;
    }
  }
  onInputChange(event: any, dataItem: any) {
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.documents.some(doc => doc.documentName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.documentTypeName = '';
    }
  }
  SaveDoc(data: PotentialVendorDocument) {
    debugger

    if (data.documentTypeName == ""|| this.fileName=="") {
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
    data.documentTypeName=this.documentTypeName;
    data.documentName = this.fileName;
    data.documentId = this.documentId;
    data.remarks = this.remarks;
    this.pvDocumentArray.forEach(element => {
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
      this.pvDocumentArray.splice(0, 0, data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
    this.onSelectDoc = false;
    this.fileName='';
  }

  UpdateDoc(data: PotentialVendorDocument) {
    debugger
    if (data.documentTypeName == ""|| this.fileName=="") {
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
    data.documentTypeName=this.documentTypeName;
    data.documentName = this.fileName;
    data.remarks = this.remarks;
    data.documentId = this.documentId;
    if (this.onSelectDoc) {
      data.documentName = this.fileName;
      data.documentTypeName=this.documentTypeName;
      data.remarks = this.remarks;
      data.documentId = this.documentId;
    }
    this.pvDocumentArray.forEach(element => {
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
      this.pvDocumentArray.splice(this.rowIndexforDoc, 0, data);
      //this.pvDocumentArray.push(data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
  }
  EditDoc(data: PotentialVendorDocument) {
    debugger
    this.isEditDocument = true;
    data.IseditDoc = true;
    this.documentTypeName = data.documentName;
    this.remarks = data.remarks;
    this.fileName = data.documentName;
    this.documentId=data.documentId;
    const rowIndex = this.pvDocumentArray.indexOf(data);
    this.rowIndexforDoc = rowIndex;
    this.editDocumet = { ...data };
    this.removeDoc = this.pvDocumentArray.splice(rowIndex, 1)
    this.onSelectDoc = false;
  }
  Deletedoc(data: PotentialVendorDocument) {
    debugger
    const rowIndex = this.pvDocumentArray.indexOf(data);
    this.pvDocumentArray.splice(rowIndex, 1);
    this.potentialVendorDocuments.splice(rowIndex, 1);
    this.potentialVendorDocuments = [...this.potentialVendorDocuments];
    data.IseditDoc = false;
    this.showAddRowDoc = false;
  }
  oncancelDoc(data: any) {
    debugger
    const rowIndex = this.potentialVendorDocuments.indexOf(data);
    if(data?.documentTypeName !== ""){
      data.IseditDoc = false;
      this.potentialVendorDocuments = [...this.potentialVendorDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.fileName = '';
      return;
    }

    if (data.newDoc) {
      this.potentialVendorDocuments.splice(rowIndex, 1);
      //this.pvDocumentArray.splice(rowIndex,1);
      this.potentialVendorDocuments = [...this.potentialVendorDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.fileName='';
      return;
    }
    if (data.IseditDoc) {
      this.potentialVendorDocuments.splice(rowIndex, 1);
      this.potentialVendorDocuments.splice(rowIndex, 0, this.editDocumet);
      this.pvDocumentArray.splice(rowIndex, 0, this.editDocumet);
      this.potentialVendorDocuments = [...this.potentialVendorDocuments];
      this.showAddRowDoc = false;
      this.editDocumet.IseditDoc = false;
      data.newDoc = false;
      this.fileName='';
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
        if (supportedFileTypes.includes(fileType))
          {
          // Check if the image already exists, then update it
          const existingIndex = this.potentialVendorDocuments.findIndex(img => img.documentName.toLowerCase() === fileName);
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
          this.documentName=''
        }
      }
    }
  }

  onviewDoc(data: any) {
    const fileUrl = data.filePath
    const winUrl = URL.createObjectURL(fileUrl);
    window.open(fileUrl, '_blank');
  }
  selectDocevent(item: any) {
    debugger
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

  Downloads(file:any){
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }

  show(event: any): void {
    var filePath=this.Filepath+event
      const fileExtension = filePath.split('.').pop()?.toLowerCase();
      if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg') {
        this.dialog.open(this.imagePreview, { data: filePath });
      } else {
        window.open(filePath, '_blank');
      }
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }
}
