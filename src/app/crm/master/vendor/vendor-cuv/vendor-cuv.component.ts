import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VAddress, VContact, VDocument, VService, VServiceDetails, Vendor, VendorModelContainer, VendorRanking, VendorType } from 'src/app/Models/crm/master/Vendor';
import { VcontactCuvDialogComponent } from '../vcontact-cuv-dialog/vcontact-cuv-dialog.component';
import { VaddressCuvDialogComponent } from '../vaddress-cuv-dialog/vaddress-cuv-dialog.component';
import { DocmentsService } from '../../document/document.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { Observable, map, of, startWith } from 'rxjs';
import { ApprovalStatusModel, BillingCurrencys, VendorRankings, VendorStatus } from 'src/app/Models/crm/master/Dropdowns';
import { VendorService } from '../vendor.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ServiceTypeServiceService } from '../../servicetype/service-type-service.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { PotentialVendorService } from '../../potential-vendor/potential-vendor.service';
import { PotentialVendor, PotentialVendorAddress, PotentialVendorContact, PotentialVendorContainer, PotentialVendorDocument, PotentialVendorServices } from '../../potential-vendor/potential-vendor.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { VendorDocDialogComponentm } from '../vendor-doc-dialog/vendor-doc-dialog.component';
import { DocumentMappingService } from '../../document-mapping/document-mapping.service';
import { DocumentMapping } from '../../document-mapping/document-mapping.model';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { environment } from 'src/environments/environment.development';
import { saveAs } from 'file-saver';
import { LineitemService } from '../../lineitemcategory/lineitem.service';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
import { ApprovalDialogComponent } from '../../approval/approval-dialog/approval-dialog.component';
import { ApprovalHistoryService } from '../../approval/approval-history.service';
import { ApprovalDashboard } from '../../approval/approval-history.model';
import { ReasonService } from 'src/app/services/crm/reason.service';
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
  selector: 'app-vendor-cuv',
  templateUrl: './vendor-cuv.component.html',
  styleUrls: ['./vendor-cuv.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class VendorCuvComponent {
  VendorForm: FormGroup;
  viewMode: boolean = false;
  vendorId: number = 0;
  tradeLicenseExpiryDate!: Date | null;
  isInvalidDate: boolean = false;
  maxDate: Date;
  processTitle: string = 'Add';
  getVendorData: any;
  disablefields: boolean = false;
  liveStatus = 1;
  currencyList: Currency[] = [];
  filteredCurrencyListOptions$: Observable<any[]>;
  filteredbillingCurrencyListOptions$: Observable<any[]>;
  billingCurrencyList: BillingCurrencys[] = [];
  billingCurrencyId: number;

  keywordService = "countryName";
  keywordServiceDetails = "serviceTypeName";
  lineItemCategorys: any[] = [];

  vendorCurrencyId: number;
  vendorContacts: VContact[] = [];
  rowIndexContact: number;
  editedContact: any;

  vendorTypeList: VendorType[] = [];
  filteredVendorTypeListOptions$: Observable<any[]>;
  vendorTypeId: number;

  vendorRankingList: VendorRanking[] = [];
  filteredVendorRankingListOptions$: Observable<any[]>;
  vendorRankingId: number;

  vendorAddress: VAddress[] = [];
  rowIndexAddress: number;
  editedAddress: any;

  documents: Documents[] = [];
  vDocuments: VDocument[] = [];
  showAddRowDoc: boolean;
  documentId: any;
  documentName: any
  date = new Date;
  remarks: string;
  file: any;
  fileName: any = '';
  vDocumentArray: VDocument[] = [];
  existDoc: boolean;
  onSelectDoc: boolean;
  rowIndexforDoc: any;
  filePath: string;
  editDocumet: any;
  removeDoc: VDocument[];
  fileInput: any;
  keywordDoc = 'documentName';

  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;

  vendorMasterDataModel: Vendor = new Vendor();
  showAddRowServices: boolean = false;
  vServiceArray: VService[] = [];
  vServiceDetailsArray: VServiceDetails[] = [];
  vServices: VService[] = [];
  vServiceDetails: VServiceDetails[] = [];
  countries: Country[];
  servicetypes: ServiceType[];
  countryName: string;
  serviceTypeName: string;
  countryId: any;
  LineItemCategoryId: number;
  onSelectServices: boolean;
  editServices: any;
  existServices: boolean;
  rowIndexforServices: number;
  removeServices: VService[];
  serviceForm: FormGroup;
  gereralEdit: any;
  vendorRankList: VendorRankings[];
  vendorStatusList: VendorStatus[];
  vStatusId: any;
  filteredVendorStatusListOptions$: Observable<any[]>;
  isServiceTypesEmpty: boolean = false;
  potentialVendorContainer: PotentialVendorContainer;
  potentialVendor: PotentialVendor;
  potentialVendorContacts: PotentialVendorContact[] = [];
  potentialVendorServices: PotentialVendorServices[] = [];
  potentialVendorDocuments: PotentialVendorDocument[] = [];
  potentialVendorAddress: PotentialVendorAddress[] = [];
  pvService: PotentialVendorServices[] = [];
  pvServiceArray: PotentialVendorServices[] = [];
  potentialVendorId: number = 0;
  userId$: string;
  documentTypeName: string;
  documentarray: VDocument[] = [];
  mandatoryDocuments: DocumentMapping[];
  hidebutton: boolean;
  invalidAddresses: any[] = [];
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  ImageDetailsArray: any[] = [];
  Filepath = environment.Fileretrive;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  lineItemCategoryList: lineitem[];
  approvalStatusList: ApprovalStatusModel[];
  approvalStatusId: any;
  filteredApprovalStatusOptions$: Observable<any[]>;
  selectedIndex = 0;
  hideApprovebutton: boolean = true;
  approvalDashboard: ApprovalDashboard[] = [];
  approvevalue: ApprovalDashboard | undefined;
  filteredcancelReasonControl: Observable<any[]>;
  CancelReasonList: any[] = [];
  UnknownValueList: any[]=[];

  public showCancelFields = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public vendorSvc: VendorService,
    private lineitemService: LineitemService,
    private docmentsService: DocmentsService,
    private commonService: CommonService,
    private ErrorHandling: ErrorhandlingService,
    private ServiceTypeService: ServiceTypeServiceService,
    private fb: FormBuilder,
    private potentialVendorService: PotentialVendorService,
    private documentMappingService: DocumentMappingService,
    private UserIdstore: Store<{ app: AppState }>,
    private Fs: FileuploadService,
    private errorHandler: ApiErrorHandlerService,
    private approvalHistoryService: ApprovalHistoryService,
    private reasonmstSvc: ReasonService,

  ) {
    this.GetUserId();
    this.getDocumentList();
    this.iniForm();
    this.getReasons();
    this.getVendorType();
    this.getbillingCurrencyList();
    this.getCurrencyList();
    this.getCountries();
    this.GetAllServiceType();
    this.getVendorRanking();
    this.getVendorStatus();
    this.getLineItemCategoryList();
    this.GetAllApprovalStatus();
    this.getUnknownValues();
    if (this.vendorSvc.isApprove) {
      this.hideApprovebutton = false;
    }
    this.maxDate = new Date();
    if (!this.potentialVendorService.movetoVendor && !this.potentialVendorService.isEdit && !this.potentialVendorService.isView) {
      //document check list binding 
      this.documentMappingService.GetAllDocumentMappingByScreenId(6).subscribe(res => {
        this.mandatoryDocuments = res;
        this.mandatoryDocuments.forEach(ele => {
          let document = {
            vDocumentId: 0,
            vendorId: 0,
            documentId: ele.documentId,
            mandatory: ele.mandatory,
            isCollected: false,
            collectedDate: null,
            remarks: '',
            documentName: '',
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.date,
            documentTypeName: ele.documentName,
            IseditDocCheck: false,
            files: ''
          };
          this.documentarray.push(document);
        });
        this.documentarray = [...this.documentarray]
        console.log(this.documentarray)
      });
    }
    if (this.potentialVendorService.itemId && this.potentialVendorService.movetoVendor) {
      this.processTitle = 'Add';
      this.gereralEdit = true;
      this.disablefields = false;
      this.potentialVendorId = this.potentialVendorService.itemId;
      this.getPotentialVendor(this.potentialVendorId);
      return
    }
    if (this.vendorSvc.itemId && !this.vendorSvc.isView) {
      this.processTitle = 'Edit';
      this.viewMode = false;
      this.gereralEdit = true;
      this.getVendorById();

    }
    if (this.vendorSvc.itemId && this.vendorSvc.isView) {
      this.processTitle = 'View';
      this.disablefields = true
      this.gereralEdit = true;
      this.viewMode = true;
      this.getVendorById();
    }

    this.filteredcancelReasonControl = this.VendorForm.controls['cancelReasonControl'].valueChanges.pipe(
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

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getUnknownValues() {
    this.commonService.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
  }

  getUnknownId(value: any) {
    let option = this.UnknownValueList.find(option => option?.name == value)
    return option?.id;
  }

  onApprovel() {
    //#region Approve get and open dialog window
    this.approvalHistoryService.getAllApprovalDashboard(parseInt(this.userId$)).subscribe(result => {
      this.approvalDashboard = result;
      alert(this.vendorId)
      this.approvevalue = this.approvalDashboard.find(x => x.referenceId == this.vendorId)
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
  getLineItemCategoryList() {
    this.lineitemService.GetAlllineItem(this.liveStatus).subscribe(result => {
      this.lineItemCategoryList = result;
      console.log(this.lineItemCategoryList);

    });
  }
  onlineItemCategoryChangeEvent(lineItemCategory: any) {
    this.lineItemCategorys = lineItemCategory;
  }
  getPotentialVendor(id: number) {
    this.potentialVendorService.getAllPotentialVendorById(id).subscribe(result => {
      debugger
      this.potentialVendorContainer = result;
      this.potentialVendor = result.potentialVendor;
      this.potentialVendorServices = result.potentialVendorServices
      this.potentialVendorContacts = result.potentialVendorContacts;
      this.potentialVendorAddress = result.potentialVendorAddresses;
      this.potentialVendorDocuments = result.potentialVendorDocuments;

      this.pvService = result.potentialVendorServices;
      this.pvServiceArray = result.potentialVendorServices;
      //document check list binding 
      this.documentMappingService.GetAllDocumentMappingByScreenId(6).subscribe(res => {
        this.mandatoryDocuments = res;
        this.mandatoryDocuments.forEach(ele => {
          let document = {
            vDocumentId: 0,
            vendorId: 0,
            documentId: ele.documentId,
            mandatory: ele.mandatory,
            isCollected: false,
            collectedDate: null,
            remarks: '',
            documentName: '',
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            documentTypeName: ele.documentName,

          };
          this.documentarray.push(document);
        });
        this.potentialVendorDocuments.forEach(element => {
          let document = {
            vDocumentId: 0,
            vendorId: 0,
            documentId: element.documentId,
            mandatory: false,
            isCollected: true,
            collectedDate: element.createdDate,
            remarks: element.remarks,
            documentName: element.documentName,
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            documentTypeName: element.documentTypeName,

          };
          const index = this.documentarray.findIndex(doc => doc.documentId === element.documentId);
          this.documentarray.findIndex(doc => {
            if (doc.documentId === element.documentId) {
              document.mandatory = true;
            }
          });

          if (index !== -1) {
            this.documentarray.splice(index, 1);
          }
          this.documentarray.push(document);
        });

        this.documentarray = this.documentarray.map(item => {
          const formattedpqDate = this.formatDate(item.collectedDate);
          return { ...item, collectedDate: formattedpqDate };
        });

        this.documentarray = [...this.documentarray]
        console.log(this.documentarray)
      });

      ///set the value PV to V
      this.contactPatch();
      this.addressPatch();
      this.servicePatch();

      this.vendorContacts = [... this.vendorContacts];
      this.vendorAddress = [... this.vendorAddress];
      this.vDocuments = [... this.vDocuments];
      this.vServices = [... this.vServices];
      this.vServices.forEach(service => {
        if (service.lineItemCategorysIdsArray != null) {
          service.lineItemCategorys = service.lineItemCategorysIdsArray.split(',').map(id => parseInt(id, 10));
        }
      });
      this.vServiceArray = this.vServices;
      this.VendorForm.patchValue(this.potentialVendor)
      this.vendorId = 0;
      this.vendorCurrencyId = this.potentialVendor.vendorCurrencyId;
      this.billingCurrencyId = this.potentialVendor.billingCurrencyId;
      if (this.vendorCurrencyId != null) {
        this.VendorForm.controls['vendorCurrency'].setValue(result.potentialVendor);
      }
      if (this.billingCurrencyId != null) {
        this.VendorForm.controls['billingCurrency'].setValue(result.potentialVendor);
      }

    })
  }
  servicePatch() {
    this.potentialVendorServices.forEach(item => {
      let vService: VService = {
        vServiceId: 0,
        vendorId: 0,
        countryId: item.countryId,
        remarks: item.remarks,
        liveStatus: item.liveStatus,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: item.updatedDate,
        countryName: item.countryName ?? '',
        IseditServices: item.IseditServices,
        newServices: item.newServices,
        LineItemCategoryId: item.LineItemCategoryId,
        serviceTypeName: item.serviceTypeName ?? '',
        lineItemCategorys: item.lineItemCategorys,
        lineItemCategorysIdsArray: item.lineItemCategorysIdsArray
      };
      this.vServices.push(vService)
    });
  }
  contactPatch() {
    debugger
    this.potentialVendorContacts.forEach(item => {
      let vContact: VContact = {
        vContactId: 0,
        vendorId: 0,
        contactTypeId: item.contactTypeId ?? 0,
        contactPerson: item.contactPerson ?? '',
        departmentId: item.departmentId ?? null,
        contactTypeName: item.contactTypeName ?? '',
        departmentName: item.departmentName ?? '',
        designation: item.designation ?? '',
        contactPersonPhone: item.contactPersonPhone ?? '',
        contactPersonEmail: item.contactPersonEmail ?? '',
        primaryContact: item.primaryContact,
        liveStatus: item.liveStatus,
        createdBy: parseInt(this.userId$),
        createdDate: item.createdDate,
        updatedBy: parseInt(this.userId$) ?? null,
        updatedDate: item.updatedDate
      };
      this.vendorContacts.push(vContact);
    })
  }
  addressPatch() {
    this.potentialVendorAddress.forEach(item => {
      let vAddress: VAddress = {
        vAddressId: 0,
        vendorId: 0,
        addressTypeId: item.addressTypeId,
        addressName: item.addressName ?? '',
        countryId: item.countryId ?? null,
        stateId: item.stateId ?? null,
        cityId: item.cityId ?? null,
        addressLine1: item.addressLine1 ?? '',
        addressLine2: item.addressLine2 ?? '',
        phoneNumber: item.phoneNumber ?? '',
        primaryAddress: item.primaryAddress,
        addresstypeName: item.addresstypeName ?? '',
        countryName: item.countryName ?? '',
        stateName: item.stateName ?? '',
        cityName: item.cityName ?? '',
        liveStatus: item.liveStatus,
        CreatedBy: parseInt(this.userId$),
        CreatedDate: item.createdDate,
        UpdatedBy: parseInt(this.userId$) ?? null,
        UpdatedDate: item.updatedDate
      };


      this.vendorAddress.push(vAddress);
    });
  }

  returnToList() {
    if (this.vendorSvc.editFromApprove) {
      this.router.navigate(["/crm/master/approvalhistorylist"]);
      this.vendorSvc.editFromApprove = false;
      return;
    }
    if (this.vendorSvc.isApprove) {
      this.router.navigate(["/crm/master/approvalhistorylist"]);
      this.vendorSvc.isApprove = false;
      return;
    }
    if (this.potentialVendorService.movetoVendor) {
      this.router.navigate(["/crm/master/potentialvendorlist"]);
      this.potentialVendorService.movetoVendor = false
      return;
    }

    this.router.navigate(["/crm/master/vendor"]);
    this.potentialVendorService.itemId = 0;
  }
  dateFilter = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date >= currentDate;
  };

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
    this.VendorForm.controls['yearOfOperation'].setValue(value);
  }
  restrictInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9()+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  iniForm() {
    this.VendorForm = this.fb.group({
      vendorId: [0],
      potentialVendorId: [null],
      vendorCode: [{ value: null, disabled: true }],
      vendorName: [null, Validators.required],
      aliasName: [null, Validators.required],
      vendorEmail: [null, Validators.email],
      vendorType: [null, Validators.required],
      vendorPhone: [null, Validators.required],
      companyWebsite: [null],
      yearOfOperation: [null],
      billingCurrency: [null, Validators.required],
      vendorCurrency: [null, Validators.required],
      vendorRemarks: [null],
      vStatusId: [null, Validators.required],
      approvalStatusId: [null],
      tags: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date],
      creditLimit: [null],
      creditDays: [null],
      tradeLicenseNumber: [null],
      trn: [null],
      sapRefCode: [{ value: null, disabled: true }],
      vendorRankingId: [null],
      tradeLicenseExpiryDate: [null],

      cancelReasonControl: [''],
      cancelRemarkControl: [''],
    });
    // this.VendorForm = this.fb.group({

    // });
    this.tradeLicenseExpiryDate = this.maxDate;

  }
  getVendorById() {
    this.vendorSvc.getVendorbyId(this.vendorSvc.itemId).subscribe(res => {
      this.getVendorData = res;
      this.vendorContacts = this.getVendorData.vContacts;
      this.vendorAddress = this.getVendorData.vAddresses;
      this.documentarray = this.getVendorData.vDocuments;
      this.vServices = this.getVendorData.vService;
      this.vServiceDetails = this.getVendorData.vServiceDetails;
      this.documentarray = this.getVendorData.vDocuments;

      this.documentarray = this.documentarray.map(item => {
        const formattedpqDate = this.formatDate(item.collectedDate);
        return { ...item, collectedDate: formattedpqDate };
      });

      if (this.getVendorData.vDocuments.length != 0) {
        this.documentarray = this.getVendorData.vDocuments;;
      }
      this.vServices.forEach(service => {
        if (service.lineItemCategorysIdsArray != null) {
          service.lineItemCategorys = service.lineItemCategorysIdsArray.split(',').map(id => parseInt(id, 10));
        }
      });


      this.vDocumentArray = this.getVendorData.vDocuments;
      this.vServiceArray = this.getVendorData.vService;
      //this.vServiceDetailsArray=this.getVendorData.vServiceDetails;
      console.log('ServiceD', this.vServiceDetailsArray);

      this.vendorContacts.forEach(data => {
        if (data.updatedBy != 1) {
          data.updatedBy = 1
        }
      })
      this.vendorAddress.forEach(data => {
        if (data.UpdatedBy != 1) {
          data.UpdatedBy = 1
        }
      })
      this.setVendorvalues();
    })
  }
  formatDate(dateString: any): any {
    debugger
    if (dateString != null && dateString != "") {
      return new Date(dateString);
    } else {
      return null;
    }
  }
  setVendorvalues() {
    debugger
    this.VendorForm.patchValue(this.getVendorData.vendors);
    this.VendorForm.patchValue(this.getVendorData.vendors);

    this.vendorId = this.getVendorData.vendors.vendorId;
    this.potentialVendorId = this.getVendorData.vendors.potentialVendorId
    this.billingCurrencyId = this.getVendorData.vendors.billingCurrencyId;
    this.vendorCurrencyId = this.getVendorData.vendors.vendorCurrencyId;
    this.vendorRankingId = this.getVendorData.vendors.vendorRankingId;
    this.vendorTypeId = this.getVendorData.vendors.vendorTypeId;
    this.vStatusId = this.getVendorData.vendors.vStatusId;
    this.approvalStatusId = this.getVendorData.vendors.approvalStatusId;

    this.showCancelFields = (this.getVendorData.vendors.vStatusId === 4);

    this.VendorForm.controls['vendorCode'].setValue(this.getVendorData.vendors.vendorCode);
    this.VendorForm.controls['vendorName'].setValue(this.getVendorData.vendors.vendorName);
    this.VendorForm.controls['aliasName'].setValue(this.getVendorData.vendors.aliasName);
    this.VendorForm.controls['vendorPhone'].setValue(this.getVendorData.vendors.vendorPhone);
    this.VendorForm.controls['companyWebsite'].setValue(this.getVendorData.vendors.companyWebsite);
    this.VendorForm.controls['vendorEmail'].setValue(this.getVendorData.vendors.vendorEmail);
    this.VendorForm.controls['vendorType'].setValue(this.getVendorData.vendors);
    this.VendorForm.controls['vendorCurrency'].setValue(this.getVendorData.vendors);
    this.VendorForm.controls['billingCurrency'].setValue(this.getVendorData.vendors);
    this.VendorForm.controls['yearOfOperation'].setValue(this.getVendorData.vendors.yearOfOperation);
    // this.VendorForm.controls['creditLimit'].setValue(this.getVendorData.vendors);
    // this.VendorForm.controls['creditDays'].setValue(this.getVendorData.vendors);
    // this.VendorForm.controls['trn'].setValue(this.getVendorData.vendors);
    this.VendorForm.controls['tradeLicenseExpiryDate'].setValue(this.getVendorData.vendors.tradeLicenseExpiryDate);
    this.VendorForm.controls['vendorRankingId'].setValue(this.getVendorData.vendors);
    this.VendorForm.controls['vStatusId'].setValue(this.getVendorData.vendors);
    this.VendorForm.controls['approvalStatusId'].setValue(this.getVendorData.vendors);
    this.VendorForm.controls['cancelReasonControl'].setValue(this.getVendorData?.reasonName);
    this.VendorForm.controls['cancelRemarkControl'].setValue(this.getVendorData?.closedRemarks);


    this.vDocuments = [...this.vDocuments];
    this.vendorAddress = [...this.vendorAddress];
    this.vendorContacts = [...this.vendorContacts];
    this.vServices = [...this.vServices];


  }
  //#region 
  //--------------------------specific func---------------------------//
  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.tradeLicenseExpiryDate = event.value;
    if (event.value === null) {
      this.isInvalidDate = true;
    } else {
      this.isInvalidDate = false;
    }
  }

  updateAliasName(event: any) {
    const aliasName = this.VendorForm.controls['aliasName'].value
    if (aliasName == null) {
      const name = this.VendorForm.controls['vendorName'].value
      this.VendorForm.controls['aliasName'].setValue(name);
    }
  }


  //---------------------------------Vendor Contact----------------//

  //#region  Contact
  openDialog() {

    const dialogRef = this.dialog.open(VcontactCuvDialogComponent, {
      data: {
        list: this.vendorContacts
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.vendorContacts.splice(0, 0, result);
        this.vendorContacts = [...this.vendorContacts];
      }
    });
  }
  onEditContact(Data: any) {
    this.rowIndexContact = this.vendorContacts.indexOf(Data);
    this.editedContact = { ...Data }
    this.vendorContacts.splice(this.rowIndexContact, 1);
    const dialogRef = this.dialog.open(VcontactCuvDialogComponent, {
      data: {
        contactData: Data,
        list: this.vendorContacts,
        mode: 'Edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.vendorContacts.splice(this.rowIndexContact, 0, result);
        this.vendorContacts = [...this.vendorContacts];
      }
      else {
        this.vendorContacts.splice(this.rowIndexContact, 0, this.editedContact);
        this.vendorContacts = [...this.vendorContacts];
      }
    });
  }
  onDeleteContact(data: any) {
    const rowIndex = this.vendorContacts.indexOf(data);
    this.vendorContacts.splice(rowIndex, 1);
    this.vendorContacts = [...this.vendorContacts];
  }
  onviewContact(Data: any) {
    const dialogRef = this.dialog.open(VcontactCuvDialogComponent, {
      data: {
        contactData: Data,
        mode: 'View',
      }
    });

  }
  //#endregion

  //#region approval status
  GetAllApprovalStatus() {
    this.commonService.GetAllApprovalStatus().subscribe(result => {
      this.approvalStatusList = result;
      const value = this.approvalStatusList.find(obj => obj.approvalStatusId == 1)
      this.VendorForm.controls['approvalStatusId'].setValue(value);
      this.approvalStatusId = 1;
      this.ApprovalStatusFun();
    })
  }
  ApprovalStatusFun() {
    this.filteredApprovalStatusOptions$ = this.VendorForm.controls['approvalStatusId'].valueChanges.pipe(
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
    this.VendorForm.controls['approvalStatusId'].setValue('');
    return this.approvalStatusList;
  }
  displayApprovalStatusLabelFn(data: any): string {
    return data && data.approvalStatus ? data.approvalStatus : '';
  }
  selectApprovalStatus(data: any) {
    let selectedValue = data.option.value;
    this.approvalStatusId = selectedValue.approvalStatusId;
  }

  //#endregion
  //---------------------Vendor Address--------------------------//

  //#region Vendor Address
  onEditAddress(Data: any) {
    this.rowIndexAddress = this.vendorAddress.indexOf(Data);
    this.editedAddress = { ...Data }
    this.vendorAddress.splice(this.rowIndexAddress, 1);
    const dialogRef = this.dialog.open(VaddressCuvDialogComponent, { data: { addressDate: Data, list: this.vendorAddress, mode: 'Edit', index: this.rowIndexContact }, disableClose: true, });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.vendorAddress.splice(this.rowIndexAddress, 0, result);
        this.vendorAddress = [...this.vendorAddress];
      }
      else {
        this.vendorAddress.splice(this.rowIndexAddress, 0, this.editedAddress);
        this.vendorAddress = [...this.vendorAddress];
      }
    });
    console.log(this.vendorAddress);
  }
  onDeleteAddress(data: any) {
    const rowIndex = this.vendorAddress.indexOf(data);
    this.vendorAddress.splice(rowIndex, 1);
    this.vendorAddress = [...this.vendorAddress];
  }
  onviewAddress(Data: any) {
    const dialogRef = this.dialog.open(VaddressCuvDialogComponent, {
      data: {
        addressDate: Data,
        mode: 'View',
      }
    });
  }
  AddressDialog() {
    const dialogRef = this.dialog.open(VaddressCuvDialogComponent, { data: { list: this.vendorAddress } });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.vendorAddress.splice(0, 0, result)
        this.vendorAddress = [...this.vendorAddress];
      }
    });
    console.log(this.vendorAddress);
  }
  //#endregion

  //---------------------Vendor Currency-----------------------//

  //#region vendor currency
  getCurrencyList() {
    this.commonService.getCurrencies(this.liveStatus).subscribe(result => {
      this.currencyList = result;
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.VendorForm.controls['vendorCurrency'].valueChanges.pipe(
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
    this.VendorForm.controls['vendorCurrency'].setValue('');
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

  //#region billing currency
  getbillingCurrencyList() {
    this.commonService.getBillingCurrencies(this.liveStatus).subscribe(result => {
      this.billingCurrencyList = result;
      this.billingCurrencyFun();
    });
  }
  billingCurrencyFun() {
    this.filteredbillingCurrencyListOptions$ = this.VendorForm.controls['billingCurrency'].valueChanges.pipe(
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
    this.VendorForm.controls['billingCurrency'].setValue('');
    return this.billingCurrencyList;
  }
  displayBillCurrencyListLabelFn(data: any): string {
    return data && data.billingCurrency ? data.billingCurrency : '';
  }
  billCurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.billingCurrencyId = selectedValue.billingCurrencyId;
  }
  //#endregion

  //#region Vendor type
  getVendorType() {
    this.vendorSvc.getvendorType().subscribe(result => {
      this.vendorTypeList = result;
      this.vendorTypeFun();
    });
  }
  vendorTypeFun() {
    this.filteredVendorTypeListOptions$ = this.VendorForm.controls['vendorType'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cvType)),
      map((name: any) => (name ? this.filteredVendortypeListOptions(name) : this.vendorTypeList?.slice()))
    );
  }
  private filteredVendortypeListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.vendorTypeList.filter((option: any) => option.cvType.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataVendorType();
  }
  NoDataVendorType() {
    this.VendorForm.controls['vendorType'].setValue('');
    return this.vendorTypeList;
  }
  displayVendorTypeListLabelFn(data: any): string {
    return data && data.cvType ? data.cvType : '';
  }
  VendorListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.vendorTypeId = selectedValue.cvTypeId;
  }
  //#endregion

  //#region Vendor Ranking
  getVendorRanking() {
    this.vendorSvc.getvendorRanking().subscribe(result => {
      this.vendorRankingList = result;
      this.vendorRankingFun();
    });
  }
  vendorRankingFun() {
    this.filteredVendorRankingListOptions$ = this.VendorForm.controls['vendorRankingId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.vendorRanking)),
      map((name: any) => (name ? this.filteredVendorrankingListOptions(name) : this.vendorRankingList?.slice()))
    );
  }
  private filteredVendorrankingListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.vendorRankingList.filter((option: any) => option.vendorRanking.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataVendorranking();
  }
  NoDataVendorranking() {
    this.VendorForm.controls['vendorRankingId'].setValue('');
    return this.vendorRankingList;
  }
  displayVendorRankingListLabelFn(data: any): string {
    return data && data.vendorRanking ? data.vendorRanking : '';
  }
  VendorrankListSelectedoption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.vendorRankingId = selectedValue.vendorRankingId;
  }
  //#endregion

  //#region Vendor Ranking
  getVendorStatus() {
    this.commonService.GetAllVendorStatus().subscribe(result => {
      this.vendorStatusList = result;
      const value = this.vendorStatusList.find(obj => obj.vStatusId == 5)
      this.VendorForm.controls['vStatusId'].setValue(value);
      this.vStatusId = 5;
      this.vendorStatusFun();
    });
  }
  isOptionDisabled(option: any): any {
    const vstatus = this.VendorForm.controls['vStatusId'].value;
    if (vstatus.vStatusId == 3) {
      this.hidebutton = true;
      return !(option.vStatusId === 3);
    } else if (vstatus.vStatusId == 5) {
      this.hidebutton = false;
      return !(option.vStatusId === 5 || option.vStatusId === 2);
    } else if (vstatus.vStatusId == 1) {
      this.hidebutton = true;
      return !(option.vStatusId === 1 || option.vStatusId === 2);
    } else if (vstatus.vStatusId == 2) {
      this.hidebutton = true;
      return !(option.vStatusId === 2);
    } else if (vstatus.vStatusId == 4) {
      this.hidebutton = true;
      return !(option.vStatusId === 4);
    }
    if (this.vStatusId == 3) {
      this.hidebutton = true;
      return !(option.vStatusId === 3);
    } else if (this.vStatusId == 5) {
      this.hidebutton = false;
      return !(option.vStatusId === 5 || option.vStatusId === 2);
    } else if (this.vStatusId == 1) {
      this.hidebutton = true;
      return !(option.vStatusId === 1 || option.vStatusId === 2);
    } else if (this.vStatusId == 2) {
      this.hidebutton = true;
      return !(option.vStatusId === 2);
    } else if (this.vStatusId == 4) {
      this.hidebutton = true;
      return !(option.vStatusId === 4);
    }
    this.showCancelFields = (this.vStatusId === 4);
  }

  vendorStatusFun() {
    this.filteredVendorStatusListOptions$ = this.VendorForm.controls['vStatusId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.vStatus)),
      map((name: any) => (name ? this.filteredVendorStatusListOptions(name) : this.vendorStatusList?.slice()))
    );
  }
  private filteredVendorStatusListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.vendorStatusList.filter((option: any) => option.vStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataVendorranking();
  }
  NoDataVendorStatus() {
    this.VendorForm.controls['vStatusId'].setValue('');
    return this.vendorStatusList;
  }
  displayVendorStatusListLabelFn(data: any): string {
    return data && data.vStatus ? data.vStatus : '';
  }
  VendorStatusListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.vStatusId = selectedValue.vStatusId;
    this.showCancelFields = (this.vStatusId === 4);
  }

  UpdateValidity() {
    debugger
    if (this.vStatusId === 3) {
      // Set validators for mandatory fields when statusId is 1
      this.VendorForm.get('creditLimit')?.setValidators([Validators.required]);
      this.VendorForm.get('creditDays')?.setValidators([Validators.required]);
      this.VendorForm.get('tradeLicenseNumber')?.setValidators([Validators.required]);
      this.VendorForm.get('trn')?.setValidators([Validators.required]);
      this.VendorForm.get('tradeLicenseExpiryDate')?.setValidators([Validators.required]);
      this.VendorForm.get('vendorRankingId')?.setValidators([Validators.required]);
    }

    this.VendorForm.get('creditLimit')?.updateValueAndValidity();
    this.VendorForm.get('creditDays')?.updateValueAndValidity();
    this.VendorForm.get('tradeLicenseNumber')?.updateValueAndValidity();
    this.VendorForm.get('trn')?.updateValueAndValidity();
    this.VendorForm.get('tradeLicenseExpiryDate')?.updateValueAndValidity();
    this.VendorForm.get('vendorRankingId')?.updateValueAndValidity();

  }
  //#endregion

  creditLimit(event: any) {
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
    this.VendorForm.controls['creditLimit'].setValue(value);
  }
  creditDays(event: any) {
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
    this.VendorForm.controls['creditDays'].setValue(value);
  }
  //// finding In valid field

  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.VendorForm.controls;
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

  onSaveGeneral(value: string) {
    debugger
    const vstatus = this.VendorForm.controls['vStatusId'].value;
    if (vstatus.vStatusId == 3) {
      this.UpdateValidity();
    }

    if (value === 'Save') {
      if (vstatus.vStatusId == 5) {
        this.vStatusId = 1;
      }
      else if (vstatus.vStatusId == 3) {
        this.vStatusId = 1;
      } else if (vstatus.vStatusId == 4) {
        this.vStatusId = 4;
      }
    }
    else if (value === 'Draft') {
      if (vstatus.vStatusId == 5) {
        this.vStatusId = 5;
      } else if (vstatus.vStatusId == 2) {
        this.vStatusId = 2;
      }
    }

    let i = 0
    this.vendorAddress.forEach(ele => {
      if (ele.countryId == null || ele.cityId == null || ele.stateId == null || ele.addressLine1 === "") {
        i++;
        this.invalidAddresses.push(ele.addressName);
      }
    });

    if (i > 0 && this.vStatusId != 5) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please fill the address details for the following addresses: " + this.invalidAddresses.join(", ") + ".",
        showConfirmButton: false,
        timer: 2000,
      });
      this.invalidAddresses = [];
      this.changeTab(3);
      return;
    }

    const validDateValue = this.VendorForm?.get('tradeLicenseExpiryDate')?.value;
    if (validDateValue) {
      let adjustedDate = new Date(validDateValue);
      // Adjust timezone to match your local timezone
      const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
      adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
      this.VendorForm.get('tradeLicenseExpiryDate')?.setValue(adjustedDate);
    }

    this.vendorMasterDataModel.CreditLimit = this.VendorForm.controls['creditLimit'].value;
    this.vendorMasterDataModel.CreditDays = this.VendorForm.controls['creditDays'].value;
    this.vendorMasterDataModel.TradeLicenseNumber = this.VendorForm.controls['tradeLicenseNumber'].value;
    this.vendorMasterDataModel.TRN = this.VendorForm.controls['trn'].value;
    this.vendorMasterDataModel.VendorRankingId = this.vendorRankingId;
    this.vendorMasterDataModel.TradeLicenseExpiryDate = this.VendorForm.controls['tradeLicenseExpiryDate'].value;
    this.vendorMasterDataModel.SAPRefCode = this.VendorForm.controls['sapRefCode'].value;

    // if (
    //   (this.vendorMasterDataModel.CreditDays == null ||
    //     this.vendorMasterDataModel.CreditLimit == null ||
    //     this.vendorMasterDataModel.TradeLicenseNumber == null ||
    //     this.vendorMasterDataModel.TradeLicenseExpiryDate == null ||
    //     this.vendorMasterDataModel.TRN == null ||
    //     this.vendorMasterDataModel.VendorRankingId == null) &&
    //   this.vStatusId == 1
    // ) {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Info",
    //     text: "Please fill the account details.",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   this.VendorForm.markAllAsTouched();
    //   this.changeTab(4);
    //   this.validateall(this.VendorForm);
    //   return;
    // }

    if (!this.VendorForm.controls['vendorEmail'].valid && this.vStatusId != 5) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please provide a valid email address.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.VendorForm.controls['vendorEmail'].markAllAsTouched();
      this.changeTab(0);
      return;
    }
    debugger
    if (this.VendorForm.valid || this.vStatusId == 5) {

      // for (let ele of this.documentarray) {
      //   if (ele.mandatory && ele.documentName == "" && this.vStatusId == 1) {
      //     Swal.fire({
      //       icon: "info",
      //       title: "Info",
      //       text: "Please fill the mandatory documents.",
      //       showConfirmButton: false,
      //       timer: 2000,
      //     });
      //     this.changeTab(5);
      //     return;
      //   }
      // }

      this.vendorMasterDataModel.VendorId = this.vendorId;
      this.vendorMasterDataModel.PotentialVendorId = this.potentialVendorId;
      this.vendorMasterDataModel.VendorName = this.VendorForm.controls['vendorName'].value;
      this.vendorMasterDataModel.VendorCode = this.VendorForm.controls['vendorCode'].value;
      this.vendorMasterDataModel.AliasName = this.VendorForm.controls['aliasName'].value;
      this.vendorMasterDataModel.VendorPhone = this.VendorForm.controls['vendorPhone'].value || '123456789';
      this.vendorMasterDataModel.CompanyWebsite = this.VendorForm.controls['companyWebsite'].value;
      this.vendorMasterDataModel.VendorEmail = this.VendorForm.controls['vendorEmail'].value || 'test@gmail.com';
      this.vendorMasterDataModel.VendorTypeId = this.vendorTypeId || this.getUnknownId("CVType");
      this.vendorMasterDataModel.VStatusId = this.vStatusId;
      this.vendorMasterDataModel.approvalStatusId = this.approvalStatusId;
      this.vendorMasterDataModel.VendorCurrencyId = this.vendorCurrencyId || this.getUnknownId("Currency");
      this.vendorMasterDataModel.BillingCurrencyId = this.billingCurrencyId || this.getUnknownId("BillingCurrency");
      this.vendorMasterDataModel.YearOfOperation = this.VendorForm.controls['yearOfOperation'].value;
      this.vendorMasterDataModel.VendorRemarks = this.VendorForm.controls['vendorRemarks'].value;
      this.vendorMasterDataModel.Tags = this.VendorForm.controls['tags'].value;

      this.vendorMasterDataModel.reasonId = this.getReasonId(this.VendorForm.controls['cancelReasonControl'].value) || null;
      this.vendorMasterDataModel.closedRemarks = this.VendorForm.controls['cancelRemarkControl'].value || null;

      this.vendorMasterDataModel.CreatedBy = parseInt(this.userId$);
      this.vendorMasterDataModel.CreatedDate = new Date();
      this.vendorMasterDataModel.UpdatedDate = new Date();

      this.vendorMasterDataModel.UpdatedBy = parseInt(this.userId$);

      this.vendorMasterDataModel.CreatedDate = new Date();
      this.vendorMasterDataModel.UpdatedDate = new Date();
      const ModelContainer: VendorModelContainer = {
        vendors: this.vendorMasterDataModel,
        vContacts: this.vendorContacts,
        vAddresses: this.vendorAddress,
        vDocuments: this.documentarray,
        vService: this.vServiceArray,
        // vServiceDetails: this.vServiceDetailsArray
      }
      if (this.vendorContacts.length == 0 && this.vStatusId != 5) {
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
      if (this.vendorAddress.length == 0 && this.vStatusId != 5) {
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

      let contact = this.vendorContacts.find((element) => element.primaryContact == true);
      let address = this.vendorAddress.find((element) => element.primaryAddress == true);

      if (contact?.primaryContact == false || contact == undefined && this.vStatusId != 5) {
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
      if (address?.primaryAddress == false || address == undefined && this.vStatusId != 5) {
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
      if (ModelContainer.vendors.VendorId == 0 || ModelContainer.vendors.VendorId == undefined) {
        this.vendorSvc.addVendor(ModelContainer).subscribe({
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

      } else {
        this.vendorSvc.addVendor(ModelContainer).subscribe({
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

            if (this.vendorSvc.editFromApprove) {
              this.router.navigate(["/crm/master/approvalhistorylist"]);
              this.vendorSvc.editFromApprove = false;
              return;
            } else {
              this.returnToList();
            }
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
    }
    else {
      const invalidControls = this.findInvalidControls();
      this.VendorForm.markAllAsTouched();
      this.validateall(this.VendorForm);
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

  getReasonId(value: any) {
    let option = this.CancelReasonList.find(option => option?.reasonName == value)
    return option?.reasonId;
  }

  resetGeneral() {
    this.showAddRowServices = false;
    if (this.potentialVendorService.movetoVendor) {
      this.getPotentialVendor(this.potentialVendorService.itemId);
      return
    }
    if (this.gereralEdit) {
      this.getVendorById();
    }
    this.VendorForm.reset();
    this.VendorForm.reset();
    this.vendorStatusList.forEach(x => {
      if (x.vStatusId == 5) {
        this.VendorForm.controls['vStatusId'].setValue(x);
        this.vStatusId = x.vStatusId;
      }
    });
    this.vendorContacts = [];
    this.vendorAddress = [];
    this.vDocuments = [];
    this.vServices = [];
    this.vServiceDetails = [];
    this.vDocumentArray = [];
    this.vServiceArray = [];
  }
  //---------------------------attachments--------------------------------------//
  //#region 
  getDocumentList() {
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      this.documents = res;
    });
  }

  AddDocument() {
    const dialogRef = this.dialog.open(VendorDocDialogComponentm, {
      data: {
        list: this.documentarray
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.ImageDetailsArray = result.Document;
        this.documentarray.push(result);
        this.documentarray = [...this.documentarray]

      }
    });
  }



  File(event: any): void {
    if (event?.target?.files && event.target.files.length > 0) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.fileName = file.name;
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

        // Check if the file type is allowed (jpg or png)
        if (['jpg', 'png', 'docx', 'doc', 'xls', 'xlsx'].includes(fileType)) {
          // Check if the image already exists, then update it
          const existingIndex = this.vDocuments.findIndex(img => img.documentName.toLowerCase() === fileName);
          if (existingIndex !== -1) {
            // If the image already exists, update it
            //this.ImageDetailsArray[existingIndex] = file;

          } else {
            // If the image doesn't exist, add it to the array
            // this.ImageDetailsArray.push(file);
          }
        } else {
          // Handle unsupported file types
          this.commonService.displayToaster(
            "error",
            "error",
            "Please Choose JPG, PNG, DOCX, DOC, XLS, or XLSX Files."
          );
          this.documentName = ''
        }
      }
    }
  }


  Edit(Data: any, i: number) {
    const dialogRef = this.dialog.open(VendorDocDialogComponentm, {
      data: {
        docdata: Data,
        mode: 'Edit',
      }, autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.ImageDetailsArray = result.Document;
        this.documentarray.splice(i, 1)
        this.documentarray.splice(
          i,
          0,
          result
        );
      }
      this.documentarray = [...this.documentarray];
    });
  }

  View(Data: any, i: number) {
    const dialogRef = this.dialog.open(VendorDocDialogComponentm, {
      data: {
        docdata: Data,
        mode: 'view',
      },
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.documentarray.splice(i, 1);
        this.documentarray.splice(
          i,
          0,
          result
        );
      }
    });
  }

  Delete(item: any, i: number) {
    if (item.mandatory) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "It's a mandatory document. Not able to delete!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (i !== -1) {

      this.documentarray.splice(i, 1);
      this.documentarray = [...this.documentarray];
    }
  }
  Downloads(file: any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
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

  //#endregion

  //#region Keyboard tab operation

  //#endregion

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
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  AddService() {
    debugger
    let skip = 0
    let take = this.pageSize
    this.pageChange({ skip: skip, take: take });

    if (!this.showAddRowServices) {
      const newRow: VService = {
        vServiceId: 0,
        vendorId: 0,
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
      this.vServices = [newRow, ...this.vServices];
      this.showAddRowServices = true;
      this.lineItemCategorys = [];
      this.remarks = '';
    }
  }
  onServiceTypeChangeEvent(lineItemCategorys: any) {
    debugger
    this.lineItemCategorys = lineItemCategorys;
    //this.onselectService()
  }

  // onselectService() {
  //   debugger
  //   const selectedServices = this.lineItemCategorys;
  //   const uniqueSelectedServices = selectedServices.filter(
  //     (selectedService: any) =>
  //       !this.vServiceDetailsArray.some(
  //         (existingService: any) => existingService.LineItemCategoryId === selectedService
  //       )
  //   );
  //   // Add new services to the array
  //   uniqueSelectedServices.forEach((selectedService: any) => {
  //     this.serviceForm = this.fb.group({
  //       vServiceDetailsId: [0],
  //       vServiceId: [0],
  //       LineItemCategoryId: [selectedService],
  //       createdBy: [1],
  //       createdDate: [this.date],
  //       updatedBy: [1],
  //       updatedDate: [this.date],
  //     });
  //     this.vServiceDetailsArray.push(this.serviceForm.value);
  //   });
  //   const uncheckedServices = this.vServiceDetailsArray.filter(
  //     (existingService: any) =>
  //       !selectedServices.includes(existingService.LineItemCategoryId)
  //   );
  //   uncheckedServices.forEach((uncheckedService: any) => {
  //     const index = this.vServiceDetailsArray.findIndex(
  //       (existingService: any) =>
  //         existingService.LineItemCategoryId === uncheckedService.LineItemCategoryId
  //     );
  //     if (index !== -1) {
  //       this.vServiceDetailsArray.splice(index, 1);
  //     }
  //   });
  // }

  SaveService(data: VService) {
    debugger
    this.isServiceTypesEmpty = data.lineItemCategorys.length === 0;
    if (this.countryName == "" || this.isServiceTypesEmpty) {
      this.isServiceTypesEmpty = false;
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.lineItemCategorys = this.lineItemCategorys;
    data.countryName = this.countryName;
    data.countryId = this.countryId;
    data.serviceTypeName = this.serviceTypeName;
    data.LineItemCategoryId = this.LineItemCategoryId;
    data.remarks = this.remarks;

    this.vServiceArray.forEach(element => {
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
      this.vServiceArray.splice(0, 0, data);
      // this.vServices = [ ...this.vServices];
      this.showAddRowServices = false;
      data.IseditServices = false;
      data.newServices = false;
    }
    this.onSelectServices = false;
    console.log(data)
    console.log('test', this.vServiceArray)
  }


  UpdateService(data: VService) {
    debugger
    this.isServiceTypesEmpty = data.lineItemCategorys.length === 0;
    if (data.countryName == "" || this.isServiceTypesEmpty) {
      this.isServiceTypesEmpty = false;
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.updatedBy = parseInt(this.userId$);
    data.lineItemCategorys = this.lineItemCategorys;
    data.LineItemCategoryId = this.LineItemCategoryId;
    data.serviceTypeName = this.serviceTypeName;
    data.countryName = this.countryName;
    data.countryId = this.countryId;
    data.remarks = this.remarks;

    if (this.onSelectServices) {
      data.lineItemCategorys = this.lineItemCategorys;
      data.LineItemCategoryId = this.LineItemCategoryId;
      data.serviceTypeName = this.serviceTypeName;
      data.countryId = this.countryId;
      data.countryName = this.countryName;
      data.remarks = this.remarks;

    }
    this.vServiceArray.forEach(element => {
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
      this.vServiceArray.splice(this.rowIndexforServices, 0, data);
      //this.pvDocumentArray.push(data);
      this.showAddRowServices = false;
      data.IseditServices = false;
      data.newServices = false;

    }
  }

  EditService(data: VService) {
    debugger
    data.IseditServices = true;
    data.newServices = false;
    this.countryName = data.countryName;
    this.countryId = data.countryId;
    this.serviceTypeName = data.serviceTypeName;
    this.lineItemCategorys = data.lineItemCategorys;
    this.remarks = data.remarks;
    const rowIndex = this.vServiceArray.indexOf(data);
    this.rowIndexforServices = rowIndex;
    this.editServices = { ...data };
    this.removeServices = this.vServiceArray.splice(rowIndex, 1)
    this.onSelectServices = false;


  }

  DeleteService(data: VService) {
    debugger
    const rowIndex = this.vServiceArray.indexOf(data);
    this.vServiceArray.splice(rowIndex, 1);
    this.vServices.splice(rowIndex, 1);
    this.vServices = [...this.vServices];
    data.IseditServices = false;
    this.showAddRowServices = false;


  }
  oncancelService(data: VService) {
    debugger
    const rowIndex = this.vServices.indexOf(data);
    if (data.newServices && rowIndex != -1) {
      this.vServices.splice(rowIndex, 1);
      this.vServices = [...this.vServices];
      this.showAddRowServices = false;
      data.newServices = false;
      return;
    }
    if (data.IseditServices && rowIndex != -1) {
      this.vServices.splice(rowIndex, 1);
      this.vServices.splice(rowIndex, 0, this.editServices);
      //this.vServiceArray.splice(rowIndex,0,this.editServices);
      this.vServices = [...this.vServices];
      this.showAddRowServices = false;
      this.editServices.IseditServices = false;
      data.newServices = false;
    }
    data.IseditServices = false;
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
  hndlKeyPressService(event: any, dataItem: VService) {
    if (event.key === 'Enter') {
      this.showAddRowServices ? this.SaveService(dataItem) : this.UpdateService(dataItem);
    }
  }
  /// to reach submit button
  handleChangeService(event: any, dataItem: VService) {
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
  handleKeyPressService(event: any, dataItem: VService) {
    if (event.key === 'Enter') {
      this.oncancelService(dataItem)
    }
  }
  // GetAllVendorRanking() {
  //   this.commonService.GetAllVendorRanking().subscribe(result => {
  //     this.vendorRankList = result;
  //     this.VendorRankingFun();
  //   });
  // }
  // VendorRankingFun() {
  //   this.filteredCurrencyListOptions$ = this.VendorForm.controls['vendorCurrency'].valueChanges.pipe(
  //     startWith(''),
  //     map((value: any) => (typeof value === 'string' ? value : value?.vendorRanking)),
  //     map((name: any) => (name ? this.filteredCurrencyListOptions(name) : this.vendorRankList?.slice()))
  //   );
  // }
  // private filteredVendorRankingOptions(name: string): any[] {
  //   const filterValue = name.toLowerCase();
  //   const results = this.vendorRankList.filter((option: any) => option.vendorRanking.toLowerCase().includes(filterValue));
  //   return results.length ? results : this.NoDataVendorRanking();
  // }
  // NoDataVendorRanking(): any {
  //   this.VendorForm.controls['vendorCurrency'].setValue('');
  //   return this.vendorRankList;
  // }
  // displayVendorRankingLabelFn(data: any): string {
  //   return data && data.vendorRanking ? data.vendorRanking : '';
  // }
  // VendorRankingSelectedoption(data: any) {
  //   let selectedValue = data.option.value;
  //   this.vendorCurrencyId = selectedValue.currencyId;
  // }
  // //#endregion
  changeTab(index: number): void {
    this.selectedIndex = index;
  }

}