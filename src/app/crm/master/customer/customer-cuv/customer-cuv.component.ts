import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { Observable, concat, map, startWith } from 'rxjs';
import { ApprovalStatusModel, BillingCurrencys, CVTypeModel, ModeofFollowUp, ReportingStageModel, ServiceSector, StatusTypeInC, StatusTypeInPC, cDocument } from 'src/app/Models/crm/master/Dropdowns';
import { IndustryServiceService } from '../../industry-type/industry-type-service.service';
import { Industry } from 'src/app/Models/crm/master/Industry';
import { ServiceTypeServiceService } from '../../servicetype/service-type-service.service';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { DocmentsService } from '../../document/document.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import { Customer, CustomerAddress, CustomerContact, CustomerContainer, CustomerServices, DocumentChecklist, cLineItemCategory } from '../customer.model';

import { MatDialog } from '@angular/material/dialog';
import { CContactDialogComponent } from '../c-contact-dialog/c-contact-dialog.component';
import { CAddressDialogComponent } from '../c-address-dialog/c-address-dialog.component';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { CustomerrankingService } from '../../customerranking/customerranking.service';
import { CustomerRanking } from '../../customerranking/customerranking.model';
import { EmployeeService } from 'src/app/ums/masters/employee/employee.service';
import { InfosourceService } from '../../infosource/infosource.service';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { PotentialCustomerService } from '../../potential-customer/potential-customer.service';
import { pcLineItemCategory, PotentialCustomer, PotentialCustomerAddress, PotentialCustomerContact, PotentialCustomerDocument } from '../../potential-customer/potential-customer.model';
import { Employee } from 'src/app/ums/masters/employee/employee.model';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DocumentMappingService } from '../../document-mapping/document-mapping.service';
import { DocumentMapping } from '../../document-mapping/document-mapping.model';
import { CustomerDocDialogComponent } from '../customer-doc-dialog/customer-doc-dialog.component';
import { ApprovalDialogComponent } from '../../approval/approval-dialog/approval-dialog.component';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { Reason } from 'src/app/Models/crm/master/Reason';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { environment } from 'src/environments/environment.development';
import { saveAs } from 'file-saver';
import { ApprovalHistoryService } from '../../approval/approval-history.service';
import { ApprovalDashboard } from '../../approval/approval-history.model';
import { LineitemService } from '../../lineitemcategory/lineitem.service';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
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
  selector: 'app-customer-cuv',
  templateUrl: './customer-cuv.component.html',
  styleUrls: ['./customer-cuv.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CustomerCuvComponent {
  customerForm: FormGroup;
  serviceForm: FormGroup;
  viewMode: boolean = false;
  date = new Date;
  disablefields: boolean;
  processTitle = 'Add';
  gereralEdit: boolean;
  potentialCustomerContacts: PotentialCustomerContact[] = [];
  potentialCustomerAddress: PotentialCustomerAddress[] = [];
  potentialCustomerDocuments: PotentialCustomerDocument[] = [];
  liveStatus = 1;
  currencyList: Currency[];
  filteredCurrencyListOptions$: Observable<any[]>;
  customerCurrencyId: number;
  billingCurrencyList: BillingCurrencys[];
  filteredbillingCurrencyListOptions$: Observable<any[]>;
  billingCurrencyId: number;
  salesOwnerList: Employee[];
  salesExecutiveList: Employee[];
  filteredsalesOwnerOptions$: any;
  salesOwnerId: number;
  filteredsalesExecutiveOptions$: Observable<any[]>;
  salesExecutiveId: any;
  filteredindustryOptions$: Observable<any[]>;
  industryList: Industry[];
  industryId: any;
  CVtypeList: CVTypeModel[];
  filteredcustypeOptions$: Observable<any>;
  cvTypeId: any;
  ReportingStageList: ReportingStageModel[];
  filteredReportingStageOptions$: Observable<any[]>;
  jobNotificationStageId: any;
  serviceTypeList: ServiceSector[];
  filteredServiceTypeListOptions$: Observable<any[]>;
  serviceSectorId: any[] = [];
  keywordDoc = 'documentName'

  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  documents: Documents[];
  showAddRowDoc: boolean;
  onSelectDoc: boolean;
  remarks: any;
  documentId: any;
  fileType: boolean;
  filePath: any;
  existDoc: boolean;
  documentName: any;
  // cDocumentArray: CustomerDocument[] = [];
  // customerDocument: CustomerDocument[] = [];
  customerContact: CustomerContact[] = [];
  customerAddress: CustomerAddress[] = [];
  customerServices: CustomerServices[] = [];
  customer: Customer = new Customer();

  rowIndexforDoc: number;

  editDocumet: any;
  //removeDoc: CustomerDocument[];
  rowIndexContact: number;
  editedContact: any;
  rowIndexAddress: any;
  editedAddress: any;
  customerId: number;
  customerRankingList: CustomerRanking[];
  customerRankingId: any;
  filteredcustomerRankingOptions$: Observable<any[]>;
  filteredcustomerRankingOptions1$: Observable<any[]>;
  fileInput: any;
  file: any;
  fileName: any = '';
  customerContainer: CustomerContainer;
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
  potentialCustomer: PotentialCustomer;
  userId$: string;
  documentTypeName: any;
  newcustomer: boolean = false;
  documentChecklist: DocumentChecklist[] = [];
  showAddRow: any;
  IseditDocCheck: boolean;
  fileCheckName: any;
  documentCheckName: string;
  editedDocCheck: any;
  editedDocCheckindex: number;
  mandatoryDocuments: DocumentMapping[];
  documentCheckArrayList: DocumentChecklist[];
  newDocx: boolean;
  rowIndexDocument: number;
  editedDocument: any;
  hidebutton: boolean;
  hideApprovebutton: boolean = true;
  invalidAddresses: any[] = [];
  invalidContact: any[] = [];

  serviceTypeId: any;
  serviceTypeInterestList: ServiceType[];
  filteredServiceInterestListOptions$: Observable<any[]>;
  informationSourceName: any;
  reference: boolean;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  approvalStatusList: ApprovalStatusModel[];
  filteredApprovalStatusOptions$: Observable<any[]>;
  approvalStatusId: number;
  reasonList: Reason[];
  filteredreasonOptions$: Observable<any[]>;
  reasonId: any;
  closedField: boolean = false;
  ImageDetailsArray: any[] = [];
  Filepath = environment.Fileretrive;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  approvalDashboard: ApprovalDashboard[] = [];
  approvevalue: ApprovalDashboard | undefined;
  LineItemCategoryList: lineitem[];
  lineItemCategoryId: any;
  IncoForm: FormGroup;
  cLineItemCategory: cLineItemCategory[] = [];
  pcLineItemCategory: pcLineItemCategory[];
  selectedIndex = 0;
  UnknownValueList: any[]=[];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private customerService: CustomerService,
    private commonService: CommonService,
    private lineitemService: LineitemService,
    private customerrankingService: CustomerrankingService,
    private IndustryTypeService: IndustryServiceService,
    private docmentsService: DocmentsService,
    private infosourceService: InfosourceService,
    private reasonmstSvc: ReasonService,
    private ErrorHandling: ErrorhandlingService,
    private employeeService: EmployeeService,
    private serviceTypeService: ServiceTypeServiceService,
    private approvalHistoryService: ApprovalHistoryService,
    private potentialCustomerService: PotentialCustomerService,
    private documentMappingService: DocumentMappingService,
    private UserIdstore: Store<{ app: AppState }>,
    private Fs: FileuploadService, private Ns: NofificationconfigurationService,
    private errorHandler: ApiErrorHandlerService,

  ) {
  }

  ngOnInit() {
    this.GetUserId();
    // this.buttonDraft = true;
    // this.buttonSave = false;
    this.iniForm();
    this.GetAllApprovalStatus();
    this.getCurrencyList();
    this.GetAlllineItem();
    this.getbillingCurrencyList();
    this.getEmployeeList();
    this.getIndustryList();
    this.getAllCVType();
    this.getAllReportingStage();
    this.GetAllServiceType();
    this.getDocumentList();
    this.getCustomerRankingList();
    this.getAllCStatus();
    this.getAllInfosource();
    this.getAllCommunication();
    this.GetAllServiceInterest();
    this.getReasons();
    this.getUnknownValues();
    if (this.customerService.isApprove) {
      this.hideApprovebutton = false;
    }
    if (!this.potentialCustomerService.movetoCustomer && !this.customerService.isEdit && !this.customerService.isView) {
      //document check list binding 
      this.documentMappingService.GetAllDocumentMappingByScreenId(5).subscribe(res => {
        this.mandatoryDocuments = res;
        this.mandatoryDocuments.forEach(ele => {
          let document = {
            CDocumentId: 0,
            customerId: 0,
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
          this.documentChecklist.push(document);
        });
        this.documentChecklist = [...this.documentChecklist]
        console.log(this.documentChecklist)
      });
    }

    if (this.potentialCustomerService.itemId && this.potentialCustomerService.movetoCustomer) {
      this.processTitle = 'Edit';
      this.gereralEdit = true;
      this.disablefields = false;
      const id = this.potentialCustomerService.itemId;
      this.getPCbyId(id);
      this.newcustomer = false;
      return
    } else {
      this.newcustomer = true;
    }
    if (this.customerService.itemId && this.customerService.isEdit) {
      this.processTitle = 'Edit';
      this.gereralEdit = true;
      this.disablefields = false;
      const id = this.customerService.itemId;
      this.getAllbyId(id);
    } else if (this.customerService.itemId && this.customerService.isView) {
      const id = this.customerService.itemId;
      this.processTitle = 'View';
      this.gereralEdit = false;
      this.disablefields = true;
      this.viewMode = true;
      this.getAllbyId(id);
    }
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

  getPCbyId(id: number) {
    this.potentialCustomerService.getAllPotentialCustomerById(id).subscribe(result => {
      this.potentialCustomerContacts = result.potentialCustomerContacts;
      this.potentialCustomerAddress = result.potentialCustomerAddresses;
      this.potentialCustomerDocuments = result.potentialCustomerDocuments;
      this.potentialCustomer = result.potentialCustomer;
      this.pcLineItemCategory = result.pcLineItemCategory;

      if (result != null) {
        this.contactPatch();
        this.customerContact = [...this.customerContact];
        this.addressPatch();
        this.customerAddress = [...this.customerAddress];
        // this.documentPatch();
        // this.customerDocument = [...this.customerDocument];

      }
      if (this.pcLineItemCategory.length != 0) {
        const selectedCommodity = this.pcLineItemCategory.map(val => val.lineItemCategoryId);
        this.customerForm.controls['lineItemCategoryId'].setValue(selectedCommodity);
        this.onSelectLineIC()
      }

      //document check list binding 
      this.documentMappingService.GetAllDocumentMappingByScreenId(5).subscribe(res => {
        this.mandatoryDocuments = res;
        this.mandatoryDocuments.forEach(ele => {
          let document = {
            CDocumentId: 0,
            customerId: 0,
            documentId: ele.documentId,
            mandatory: ele.mandatory,
            isCollected: false,
            collectedDate: null,
            remarks: '',
            documentName: '',
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            documentTypeName: ele.documentName,
            IseditDocCheck: false,
            files: ''
          };
          this.documentChecklist.push(document);
        });
        this.potentialCustomerDocuments.forEach(element => {
          let document = {
            CDocumentId: 0,
            customerId: 0,
            documentId: element.documentId,
            mandatory: false,
            isCollected: true,
            collectedDate: element.createdDate,
            remarks: element.remarks,
            documentName: element.documentName,
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            documentTypeName: element.documentTypeName,
            IseditDocCheck: false,
            files: ''
          };
          const index = this.documentChecklist.findIndex(doc => doc.documentId === element.documentId);
          this.documentChecklist.findIndex(doc => {
            if (doc.documentId === element.documentId) {
              document.mandatory = true;
            }
          });

          if (index !== -1) {
            this.documentChecklist.splice(index, 1);
          }
          this.documentChecklist.push(document);
        });
        this.documentChecklist = this.documentChecklist.map(item => {
          const formattedpqDate = this.formatDate(item.collectedDate);
          return { ...item, collectedDate: formattedpqDate };
        });
        this.documentChecklist = [...this.documentChecklist]
        console.log(this.documentChecklist)
      });


      //general value patch
      this.customerForm.patchValue(result.potentialCustomer);
      this.customerId = 0;
      this.customerCurrencyId = result.potentialCustomer.customerCurrencyId;
      this.billingCurrencyId = result.potentialCustomer.billingCurrencyId;
      this.salesOwnerId = result.potentialCustomer.salesOwnerId;
      this.salesExecutiveId = result.potentialCustomer.salesExecutiveId;
      this.industryId = result.potentialCustomer.industryId;
      this.serviceTypeId = result.potentialCustomer.serviceId;
      this.customerRankingId = result.potentialCustomer.customerRankingId;
      this.jobNotificationStageId = null;
      this.serviceTypeId = null;
      this.cvTypeId = null;
      this.informationSourceId = result.potentialCustomer.informationSourceId;
      //this.cStatusId = result.potentialCustomer.pcStatusId;
      this.modeofFollowUpId = result.potentialCustomer.modeofFollowUpId;

      const referenceDetails = result.potentialCustomer.referenceDetails;
      if (referenceDetails != null) {
        this.reference = true;
        this.UpdateValidityRef();
      } else {
        this.reference = false;
        this.customerForm.controls['referenceDetails'].setValue(null);
        this.UpdateValidityRef();
      }

      if (result.potentialCustomer.customerRankingId != null) {
        this.customerRankingList.forEach(element => {
          if (this.customerRankingId == element.customerRankingId) {
            this.customerForm.controls['customerRevenue'].setValue(element);
          }
        });
      }
      if (result.potentialCustomer.salesExecutiveId != null) {
        this.employeeService.getEmployee(result.potentialCustomer.salesExecutiveId).subscribe(res => {
          this.customerForm.controls['salesExecutiveId'].setValue(res);
        });
      }
      if (result.potentialCustomer.salesOwnerId != null) {
        this.employeeService.getEmployee(result.potentialCustomer.salesOwnerId).subscribe(res => {
          this.customerForm.controls['salesOwnerId'].setValue(res);
        });
      }
      this.customerForm.controls['customerId'].setValue(0);
      //this.customerForm.controls['customerCurrencyId'].setValue(result.potentialCustomer);
      if (this.billingCurrencyId != null) {
        this.customerForm.controls['billingCurrencyId'].setValue(result.potentialCustomer);
      }
      if (this.customerCurrencyId != null) {
        this.customerForm.controls['customerCurrencyId'].setValue(result.potentialCustomer);

      }
      this.customerForm.controls['customerRankingId'].setValue(result.potentialCustomer);
      this.customerForm.controls['industryId'].setValue(result.potentialCustomer);
      if (this.cvTypeId != null) {
        this.customerForm.controls['customerTypeId'].setValue(result.potentialCustomer);
      }
      this.customerForm.controls['informationSourceId'].setValue(result.potentialCustomer);
      this.customerForm.controls['serviceInterest'].setValue(result.potentialCustomer);

      //this.customerForm.controls['cStatusId'].setValue(result.potentialCustomer);
      this.customerForm.controls['modeofFollowUpId'].setValue(result.potentialCustomer);
      const selectedServicetypes = [this.potentialCustomer.serviceId];

      // this.customerForm.controls['serviceType'].setValue(selectedServicetypes);
      // const test = this.customerForm.controls['serviceType'].value
      // this.onselectService();
    });

  }
  contactPatch() {
    debugger
    this.potentialCustomerContacts.forEach(ele => {
      let custContact = {
        cContactId: 0,
        customerId: 0,
        contactTypeId: ele.contactTypeId,
        contactPerson: ele.contactPerson,
        departmentId: ele.departmentId,
        designation: ele.designation,
        contactPersonPhone: ele.contactPersonPhone,
        contactPersonEmail: ele.contactPersonEmail,
        primaryContact: ele.primaryContact,
        liveStatus: ele.liveStatus,
        createdBy: parseInt(this.userId$),
        createdDate: ele.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: ele.updatedDate,
        contactTypeName: ele.contactTypeName,
        departmentName: ele.departmentName
      };
      this.customerContact.push(custContact);
    })
  }
  addressPatch() {
    this.potentialCustomerAddress.forEach(ele => {
      let custAddress = {
        cAddressId: 0,
        customerId: 0,
        addressTypeId: ele.addressTypeId,
        addressName: ele.addressName,
        countryId: ele.countryId,
        stateId: ele.stateId,
        cityId: ele.cityId,
        addressLine1: ele.addressLine1,
        addressLine2: ele.addressLine2,
        phoneNumber: ele.phoneNumber,
        primaryAddress: ele.primaryAddress,
        liveStatus: ele.liveStatus,
        createdBy: parseInt(this.userId$),
        createdDate: ele.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: ele.updatedDate,
        addresstypeName: ele.addresstypeName,
        countryName: ele.countryName,
        stateName: ele.stateName,
        cityName: ele.cityName
      };

      this.customerAddress.push(custAddress);
    });
  }
  // documentPatch() {
  //   debugger
  //   this.potentialCustomerDocuments.forEach(item => {
  //     let CDocument: CustomerDocument = {
  //       cDocumentId: 0,
  //       customerId: 0,
  //       documentId: item.documentId,
  //       documentTypeName: item.documentTypeName,
  //       documentName: item.documentName ?? '',
  //       IseditDoc: item.IseditDoc,
  //       newDoc: item.newDoc,
  //       remarks: item.remarks ?? '',
  //       files: item.files ?? '',
  //       createdDate: item.createdDate,
  //       createdBy: parseInt(this.userId$)
  //     };
  //     this.customerDocument.push(CDocument);
  //   });
  //   this.cDocumentArray = this.customerDocument;
  // }
  getAllbyId(id: any) {
    this.customerService.getAllCustomerById(id).subscribe(res => {
      this.customerContainer = res;
      this.customer = res.customer;
      // const draft = this.customer.cStatus;
      // if (draft.toLowerCase() == 'pending for accounts verification') {
      //   this.buttonDraft = false;
      //   this.buttonSave = true;
      // }
      // else {
      //   this.buttonDraft = true;
      //   this.buttonSave = false;
      // }
      //this.customerServices = res.customerServices;
      this.customerServices = [...res.customerServices];
      this.customerContact = res.customerContact;
      this.customerAddress = res.customerAddress;
      this.cLineItemCategory = res.cLineItemCategory;
      // this.customerDocument = res.customerDocument;
      // this.customerDocument = [...this.customerDocument];

      // this.documentChecklist = res.documentChecklist
      this.documentChecklist = res.documentChecklist.map(item => {
        const formattedpqDate = this.formatDate(item.collectedDate);
        return { ...item, collectedDate: formattedpqDate };
      });
      if (res.documentChecklist.length != 0) {
        this.documentChecklist = res.documentChecklist;
      }
      console.log(res)
      this.setValues()
    });
  }
  formatDate(dateString: any): any {
    debugger
    if (dateString != null && dateString != "") {
      return new Date(dateString);
    } else {
      return null;
    }
  }
  setValues() {
    debugger
    this.customerForm.patchValue(this.customer);
    this.customerId = this.customer.customerId;
    this.customerCurrencyId = this.customer.customerCurrencyId;
    this.billingCurrencyId = this.customer.billingCurrencyId;
    this.salesOwnerId = this.customer.salesOwnerId;
    this.salesExecutiveId = this.customer.salesExecutiveId;
    this.industryId = this.customer.industryId;
    this.serviceTypeId = this.customer.serviceTypeId;
    this.customerRankingId = this.customer.customerRankingId;
    this.jobNotificationStageId = this.customer.jobNotificationStageId;
    this.cvTypeId = this.customer.customerTypeId;
    this.informationSourceId = this.customer.informationSourceId;
    this.cStatusId = this.customer.cStatusId;
    this.modeofFollowUpId = this.customer.modeofFollowUpId;
    this.approvalStatusId = this.customer.approvalStatusId;
    this.reasonId = this.customer.reasonId;


    const referenceDetails = this.customer.referenceDetails;
    if (referenceDetails != null) {
      this.reference = true;
      this.UpdateValidityRef();
    } else {
      this.reference = false;
      this.customerForm.controls['referenceDetails'].setValue(null);
      this.UpdateValidityRef();
    }

    const reasonDetails = this.customer.reasonId;
    if (reasonDetails != null) {
      this.closedField = true;
      this.UpdateValidityReason();
    } else {
      this.closedField = false;
      this.customerForm.controls['reasonId'].setValue(null);
      this.UpdateValidityReason();
    }


    if (this.customer.customerRankingId != null) {
      this.customerRankingList.forEach(element => {
        if (this.customerRankingId == element.customerRankingId) {
          this.customerForm.controls['customerRevenue'].setValue(element);
        }
      });
    }
    if (this.cLineItemCategory.length != 0) {
      const selectedCommodity = this.cLineItemCategory.map(val => val.lineItemCategoryId);
      this.customerForm.controls['lineItemCategoryId'].setValue(selectedCommodity);
    }
    this.customerForm.controls['customerId'].setValue(this.customer);
    this.customerForm.controls['customerCurrencyId'].setValue(this.customer);
    this.customerForm.controls['billingCurrencyId'].setValue(this.customer);
    this.customerForm.controls['industryId'].setValue(this.customer);
    this.customerForm.controls['customerTypeId'].setValue(this.customer);
    this.customerForm.controls['jobNotificationStageId'].setValue(this.customer);
    this.customerForm.controls['informationSourceId'].setValue(this.customer);
    this.customerForm.controls['cStatusId'].setValue(this.customer);
    this.customerForm.controls['modeofFollowUpId'].setValue(this.customer);
    this.customerForm.controls['serviceInterest'].setValue(this.customer);
    this.customerForm.controls['approvalStatusId'].setValue(this.customer);
    this.customerForm.controls['reasonId'].setValue(this.customer);

    const selectedServicetypes = this.customerServices.map(val => val.serviceSectorId);
    this.customerForm.controls['serviceType'].setValue(selectedServicetypes);
    this.salesOwnerget();
    this.salesExecutiveget();
    this.customerForm.controls['customerRankingId'].setValue(this.customer);
  }
  salesOwnerget() {
    this.employeeService.getEmployee(this.customer.salesOwnerId).subscribe(res => {
      this.customerForm.controls['salesOwnerId'].setValue(res);
    });
  }
  salesExecutiveget() {
    if (this.customer.salesExecutiveId != null) {
      this.employeeService.getEmployee(this.customer.salesExecutiveId).subscribe(res => {
        this.customerForm.controls['salesExecutiveId'].setValue(res);
      });
    }
  }
  onSelectionChange(event: any) {
    this.updatevalues = [];
    const valueToCheck = event.value;
    for (let value of event.value) {
      if (!this.serviceSectorId.some(item => item.serviceSectorId === value)) {
        if (!this.updatevalues.includes(value)) {
          this.updatevalues.push(value);
        }
      }
    }
  }

  //--------get all dropdown--------------------------------
  //#region 
  getAllCStatus() {
    this.commonService.getAllCStatus().subscribe(result => {
      this.statusList = result;
      const value = this.statusList.find(obj => obj.cStatusId == 5)
      this.customerForm.controls['cStatusId'].setValue(value);
      this.cStatusId = 5;
      this.statusFun();
    });
  }
  statusFun() {
    this.filteredStatusOptions$ = this.customerForm.controls['cStatusId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cStatus)),
      map((name: any) => (name ? this.filteredStatusOptions(name) : this.statusList?.slice()))
    );
  }
  private filteredStatusOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.statusList.filter((option: any) => option.cStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataStatus();
  }
  NoDataStatus(): any {
    this.customerForm.controls['cStatusId'].setValue('');
    return this.statusList;
  }
  displayStausListLabelFn(data: any): string {
    return data && data.cStatus ? data.cStatus : '';
  }
  StatusListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.cStatusId = selectedValue.cStatusId;
    const close = this.customerForm.controls['cStatusId'].value;
    if (close.cStatus.toLowerCase() == 'closed') {
      this.closedField = true;
      this.UpdateValidityReason();
    }
    else {
      this.closedField = false;
      this.UpdateValidityReason();
    }
  }

  statusEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.closedField = false;
      this.reasonId = null;
      this.customerForm.controls['reasonId'].reset();
      this.customerForm.controls['closedRemarks'].reset();
    }
  }

  //#endregion 

  //#region infosourceService
  getAllInfosource() {
    this.infosourceService.getInfosource(this.liveStatus).subscribe(result => {
      this.infosourceList = result;
      this.infosourceFun();
    });
  }
  infosourceFun() {
    this.filteredinfosourceOptions$ = this.customerForm.controls['informationSourceId'].valueChanges.pipe(
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
    this.customerForm.controls['informationSourceId'].setValue('');
    return this.infosourceList;
  }
  displayinfosourceListLabelFn(data: any): string {
    return data && data.informationSourceName ? data.informationSourceName : '';
  }
  infosourceSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.informationSourceId = selectedValue.informationSourceId;
    this.informationSourceName = selectedValue.informationSourceName.toLowerCase();
    if (this.informationSourceName == 'by reference') {
      this.reference = true;
      this.UpdateValidityRef();
    } else {
      this.reference = false;
      this.customerForm.controls['referenceDetails'].setValue(null);
      this.UpdateValidityRef();
    }
  }
  SourceEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.informationSourceId = null;
      this.reference = false;
      this.customerForm.controls['referenceDetails'].setValue(null);
      this.UpdateValidityRef();
    }
  }

  UpdateValidityRef() {
    if (this.reference) {
      this.customerForm.get('referenceDetails')?.setValidators([Validators.required]);
    }
    else {
      this.customerForm.controls['referenceDetails']?.setValidators([Validators.nullValidator]);
    }
    this.customerForm.controls['referenceDetails']?.updateValueAndValidity();
  }
  UpdateValidityReason() {
    if (this.cStatusId == 4) {
      this.customerForm.get('reasonId')?.setValidators([Validators.required]);
    }
    else {
      this.customerForm.controls['reasonId']?.setValidators([Validators.nullValidator]);
    }
    this.customerForm.controls['reasonId']?.updateValueAndValidity();
  }

  //#endregion
  //#region reason
  getReasons() {
    this.reasonmstSvc.getAllReason(1).subscribe((result) => {
      this.reasonList = result;
      this.reasonFun();
    });
  }
  reasonFun() {
    this.filteredreasonOptions$ = this.customerForm.controls['reasonId'].valueChanges.pipe(
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
    this.customerForm.controls['reasonId'].setValue('');
    return this.reasonList;
  }
  displayreasonListLabelFn(data: any): string {
    return data && data.reasonName ? data.reasonName : '';
  }
  reasonSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.reasonId = selectedValue.reasonId;
  }

  reasonEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.reasonId = null;
      this.customerForm.controls['reasonId'].setValue(null);
    }
  }

  //#endregion

  //#region get all service Type 
  //#region 
  getAllCommunication() {
    this.commonService.getAllCommunication().subscribe(result => {
      this.CommunicationList = result;
      this.communicationFun();
    });
  }
  communicationFun() {
    this.filteredcommunicationOptions$ = this.customerForm.controls['modeofFollowUpId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofFollowUp)),
      map((name: any) => (name ? this.filteredcommunicationOptions(name) : this.CommunicationList?.slice()))
    );
  }
  private filteredcommunicationOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CommunicationList.filter((option: any) => option.modeofFollowUp.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatacommunication();
  }
  NoDatacommunication(): any {
    this.customerForm.controls['modeofFollowUpId'].setValue('');
    return this.CommunicationList;
  }
  displaycommunicationListLabelFn(data: any): string {
    return data && data.modeofFollowUp ? data.modeofFollowUp : '';
  }
  communicationListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.modeofFollowUpId = selectedValue.modeofFollowUpId;
  }
  //#endregion
  GetAllServiceType() {
    this.commonService.GetAllServiceSector().subscribe(res => {
      this.serviceTypeList = res;
      this.ServiceTypeFun();
    })
  }
  ServiceTypeFun() {
    this.filteredServiceTypeListOptions$ = this.customerForm.controls['serviceType'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.serviceSector)),
      map((name: any) => (name ? this.filteredServiceTypeListOptions(name) : this.serviceTypeList?.slice()))
    );
  }
  private filteredServiceTypeListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.serviceTypeList.filter((option: any) => option.serviceTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataServiceType();
  }
  NoDataServiceType(): any {
    this.customerForm.controls['serviceType'].setValue('');
    return this.serviceTypeList;
  }
  displayServiceTypeListLabelFn(data: any): string {
    return data && data.serviceTypeName ? data.serviceTypeName : '';
  }
  ServiceTypeListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.serviceSectorId = selectedValue.serviceSectorId;
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
    this.filteredCurrencyListOptions$ = this.customerForm.controls['customerCurrencyId'].valueChanges.pipe(
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
    this.customerForm.controls['customerCurrencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.customerCurrencyId = selectedValue.currencyId;
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
    this.filteredbillingCurrencyListOptions$ = this.customerForm.controls['billingCurrencyId'].valueChanges.pipe(
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
    this.customerForm.controls['billingCurrencyId'].setValue('');
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

  //#region Employee
  getEmployeeList() {
    this.commonService.getEmployees(this.liveStatus).subscribe(result => {
      this.salesOwnerList = result;
      this.salesExecutiveList = result;
      this.salesOwnerFun();
      this.salesExecutivefun();
      if (this.newcustomer) {
        this.salesOwnerList.forEach(ele => {
          if (ele.employeeId == parseInt(this.userId$)) {
            this.customerForm.controls['salesOwnerId'].setValue(ele);
            this.customerForm.controls['salesExecutiveId'].setValue(ele);
            this.salesExecutiveId = ele.employeeId;
            this.salesOwnerId = ele.employeeId;
          }
        })
      }
    });
  }
  salesOwnerFun() {
    this.filteredsalesOwnerOptions$ = this.customerForm.controls['salesOwnerId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this.filteredsalesOwnerOptions(name) : this.salesOwnerList?.slice()))
    );
  }
  private filteredsalesOwnerOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.salesOwnerList.filter((option: any) => option.employeeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatasalesOwner();
  }
  NoDatasalesOwner(): any {
    this.customerForm.controls['salesOwnerId'].setValue('');
    return this.salesOwnerList;
  }
  displaysalesOwnerListLabelFn(data: any): string {
    return data && data.employeeName ? data.employeeName : '';
  }
  salesOwnerListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.salesOwnerId = selectedValue.employeeId;
    this.customerForm.controls['salesExecutiveId'].setValue(data.option.value);
    this.salesExecutiveId = this.salesOwnerId;
  }
  //#endregion 

  //#region 
  salesExecutivefun() {
    this.filteredsalesExecutiveOptions$ = this.customerForm.controls['salesExecutiveId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this.filteredsalesExecutiveOptions(name) : this.salesExecutiveList?.slice()))
    );
  }
  private filteredsalesExecutiveOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.salesExecutiveList.filter((option: any) => option.employeeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatasalesExecutive();
  }
  NoDatasalesExecutive(): any {
    this.customerForm.controls['salesExecutiveId'].setValue('');
    return this.salesExecutiveList;
  }
  displaysalesExecutiveListLabelFn(data: any): string {
    return data && data.employeeName ? data.employeeName : '';
  }
  salesExecutiveListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.salesExecutiveId = selectedValue.employeeId;
  }
  //#endregion

  //#region industry
  getAllCVType() {
    this.commonService.getAllCVType().subscribe(result => {
      this.CVtypeList = result;
      this.custypeFun();
    });
  }
  custypeFun() {
    this.filteredcustypeOptions$ = this.customerForm.controls['customerTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.cvType)),
      map((name: any) => (name ? this.filteredcustypeOptions(name) : this.CVtypeList?.slice()))
    );
  }
  private filteredcustypeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CVtypeList.filter((option: any) => option.cvType.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCVtype();
  }
  NoDataCVtype(): any {
    this.customerForm.controls['customerTypeId'].setValue('');
    return this.CVtypeList;
  }
  displayCVtypeListLabelFn(data: any): string {
    return data && data.cvType ? data.cvType : '';
  }
  CVtypeListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.cvTypeId = selectedValue.cvTypeId;
  }
  //#endregion

  //#region service Interest
  GetAllServiceInterest() {
    this.serviceTypeService.GetAllServiceType(this.liveStatus).subscribe(res => {
      this.serviceTypeInterestList = res;
      this.ServiceInterestFun();
    })
  }
  ServiceInterestFun() {
    this.filteredServiceInterestListOptions$ = this.customerForm.controls['serviceInterest'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.serviceTypeName)),
      map((name: any) => (name ? this.filteredServiceInterestListOptions(name) : this.serviceTypeInterestList?.slice()))
    );
  }
  private filteredServiceInterestListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.serviceTypeInterestList.filter((option: any) => option.serviceTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataServiceIneterst();
  }
  NoDataServiceIneterst(): any {
    this.customerForm.controls['serviceInterest'].setValue('');
    return this.serviceTypeInterestList;
  }
  displayServiceInterestListLabelFn(data: any): string {
    return data && data.serviceTypeName ? data.serviceTypeName : '';
  }
  ServiceInterestListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.serviceTypeId = selectedValue.serviceTypeId;
  }

  ServiceEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.serviceTypeId = null;
    }
  }

  //#endregion

  //#region inco terms autocomplete
  GetAlllineItem() {
    this.lineitemService.GetAlllineItem(this.liveStatus).subscribe(res => {
      this.LineItemCategoryList = res;
    });
  }

  LineItemCategorySelectedoption(data: any) {
    let selectedIncoterm = data.option.value;
    this.lineItemCategoryId = selectedIncoterm.lineItemCategoryId;
  }
  //#endregion
  // #region Line Item Category


  onSelectLineIC() {
    const selectedIncos = this.customerForm.controls['lineItemCategoryId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedInco: any) =>
        !this.cLineItemCategory.some(
          (existingInco: any) => existingInco.lineItemCategoryId === selectedInco
        )
    );
    uniqueSelectedInco.forEach((selectedInco: any) => {
      this.IncoForm = this.fb.group({
        cLineItemCategoryId: [0],
        CustomerId: [0],
        lineItemCategoryId: [selectedInco],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.cLineItemCategory.push(this.IncoForm.value);
    });
    const uncheckedIncos = this.cLineItemCategory.filter(
      (existingInco: any) =>
        !selectedIncos.includes(existingInco.lineItemCategoryId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.cLineItemCategory.findIndex(
        (existingInco: any) =>
          existingInco.lineItemCategoryId === uncheckedInco.lineItemCategoryId
      );
      if (index !== -1) {
        this.cLineItemCategory.splice(index, 1);
      }
    });
  }

  //#region industry
  getAllReportingStage() {
    this.commonService.getAllReportingStage().subscribe(result => {
      this.ReportingStageList = result;
      this.ReportingStageFun();
    });
  }
  ReportingStageFun() {
    this.filteredReportingStageOptions$ = this.customerForm.controls['jobNotificationStageId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.reportingStage)),
      map((name: any) => (name ? this.filteredReportingStageOptions(name) : this.ReportingStageList?.slice()))
    );
  }
  private filteredReportingStageOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.ReportingStageList.filter((option: any) => option.reportingStage.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataReportingStage();
  }
  NoDataReportingStage(): any {
    this.customerForm.controls['jobNotificationStageId'].setValue('');
    return this.ReportingStageList;
  }
  displayReportStageListLabelFn(data: any): string {
    return data && data.reportingStage ? data.reportingStage : '';
  }
  ReportStageListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.jobNotificationStageId = selectedValue.reportingStageId;
  }
  //#endregion


  //#region industry
  getIndustryList() {
    this.IndustryTypeService.GetAllIndustry(this.liveStatus).subscribe(result => {
      this.industryList = result;
      this.industryFun();
    });
  }
  industryFun() {
    this.filteredindustryOptions$ = this.customerForm.controls['industryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.industryName)),
      map((name: any) => (name ? this.filteredindustryOptions(name) : this.industryList?.slice()))
    );
  }
  private filteredindustryOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.industryList.filter((option: any) => option.industryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataindustry();
  }
  NoDataindustry(): any {
    this.customerForm.controls['industryId'].setValue('');
    return this.industryList;
  }
  displayindustryListLabelFn(data: any): string {
    return data && data.industryName ? data.industryName : '';
  }
  industryListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.industryId = selectedValue.industryId;
  }
  //#endregion

  //#region 
  getCustomerRankingList() {
    this.customerrankingService.GetAllActiveCustomerRanking().subscribe(result => {
      this.customerRankingList = result;
      this.customerRankingFun();
      this.customerRankingFun1();
    })
  }
  customerRankingFun() {
    this.filteredcustomerRankingOptions$ = this.customerForm.controls['customerRankingId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.rankName)),
      map((name: any) => (name ? this.filteredcustomerRankingOptions(name) : this.customerRankingList?.slice()))
    );
  }
  private filteredcustomerRankingOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.customerRankingList.filter((option: any) => option.rankName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatacustomerRanking();
  }
  NoDatacustomerRanking(): any {
    this.customerForm.controls['customerRankingId'].setValue('');
    return this.customerRankingList;
  }
  displaycustomerRankingListLabelFn(data: any): string {
    return data && data.rankName ? data.rankName : '';
  }
  customerRankingListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.customerRankingId = selectedValue.customerRankingId;
    this.customerRankingList.forEach(element => {
      if (this.customerRankingId == element.customerRankingId) {
        this.customerForm.controls['customerRevenue'].setValue(element);
        this.customerRankingId = element.customerRankingId;
      }
    });
  }

  customerRankingFun1() {
    this.filteredcustomerRankingOptions1$ = this.customerForm.controls['customerRevenue'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.fromValue || value?.toValue)),
      map((name: any) => (name ? this.filteredcustomerRankingOptions1(name) : this.customerRankingList?.slice()))
    );
  }
  private filteredcustomerRankingOptions1(name: string): any[] {
    const filterValue = name;
    const results = this.customerRankingList.filter(
      (option: any) =>
        option.fromValue.includes(filterValue) ||
        option.toValue.includes(filterValue)
    );
    return results.length ? results : this.NoDatacustomerRanking1();
  }
  NoDatacustomerRanking1(): any[] {
    this.customerForm.controls['customerRevenue'].setValue('');
    return this.customerRankingList;
  }
  displaycustomerRankingListLabelFn1(data: any): string {
    return data && data.fromValue ? `${data.fromValue} - ${data.toValue}` : '';
  }
  customerRankingListSelectedoption1(data: any) {
    let selectedValue = data.option.value;
    this.customerRankingId = selectedValue.customerRankingId;
    this.customerRankingList.forEach(element => {
      if (this.customerRankingId == element.customerRankingId) {
        this.customerForm.controls['customerRankingId'].setValue(element);
        this.customerRankingId = element.customerRankingId;
      }
    });
  }
  //#endregion

  //#region approval status
  GetAllApprovalStatus() {
    this.commonService.GetAllApprovalStatus().subscribe(result => {
      this.approvalStatusList = result;
      const value = this.approvalStatusList.find(obj => obj.approvalStatusId == 1)
      this.customerForm.controls['approvalStatusId'].setValue(value);
      this.approvalStatusId = 1;
      this.ApprovalStatusFun();
    })
  }
  ApprovalStatusFun() {
    this.filteredApprovalStatusOptions$ = this.customerForm.controls['approvalStatusId'].valueChanges.pipe(
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
    this.customerForm.controls['approvalStatusId'].setValue('');
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


  //-------Keydown----------
  handleChangeC(event: any) {
    this.customerForm.controls['customerRevenue'].setValue('');
    this.customerRankingId = '';
  }
  handleChangeR(event: any) {
    this.customerForm.controls['customerRevenue'].setValue('');
    this.customerForm.controls['customerRankingId'].setValue('');
    this.customerRankingId = '';
  }

  //---------------------Customer---------------------------

  restrictInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9()+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }


  iniForm() {
    this.customerForm = this.fb.group({
      customerId: [0],
      potentialCustomerId: [null],
      customerCode: [{ value: null, disabled: true }],
      customerName: [null, Validators.required],
      aliasName: [null, Validators.required],
      customerEmail: [null, [Validators.required, Validators.email]],
      customerPhone: [null, Validators.required],
      companyWebsite: [null],
      customerTypeId: [null, Validators.required],
      billingCurrencyId: [null, Validators.required],
      customerCurrencyId: [null, Validators.required],
      industryId: [null],
      serviceInterest: [null],
      serviceType: [[], Validators.required],
      lineItemCategoryId: [[], Validators.required],
      salesOwnerId: [null, Validators.required],
      salesExecutiveId: [null],
      jobNotificationStageId: [null, Validators.required],
      informationSourceId: [null],
      referenceDetails: [null],
      modeofFollowUpId: [null],
      cStatusId: [null, Validators.required],
      approvalStatusId: [null],
      reasonId: [null],
      closedRemarks: [null],

      liveStatus: [true],
      customerRemarks: [null],
      tags: [null],
      creditLimit: [null],
      creditDays: [null],
      tradeLicenseNumber: [null],
      tradeLicenseExpiryDate: [null],
      trn: [null],
      customerRankingId: [null],
      customerRevenue: [null],
      sapRefCode: [{ value: null, disabled: true }],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date],
    });
  }
  // UpdateValidity() {
  //   if (this.cStatusId === 3) {
  //     // Set validators for mandatory fields when statusId is 1
  //     this.customerForm.get('creditLimit')?.setValidators([Validators.required]);
  //     this.customerForm.get('creditDays')?.setValidators([Validators.required]);
  //     this.customerForm.get('tradeLicenseNumber')?.setValidators([Validators.required]);
  //     this.customerForm.get('trn')?.setValidators([Validators.required]);
  //     this.customerForm.get('tradeLicenseExpiryDate')?.setValidators([Validators.required]);
  //     this.customerForm.get('customerRankingId')?.setValidators([Validators.required]);
  //   }
  //   this.customerForm.get('creditLimit')?.updateValueAndValidity();
  //   this.customerForm.get('creditDays')?.updateValueAndValidity();
  //   this.customerForm.get('tradeLicenseNumber')?.updateValueAndValidity();
  //   this.customerForm.get('trn')?.updateValueAndValidity();
  //   this.customerForm.get('tradeLicenseExpiryDate')?.updateValueAndValidity();
  //   this.customerForm.get('customerRankingId')?.updateValueAndValidity();
  //   this.customerForm.markAllAsTouched();
  //   this.validateall(this.customerForm);
  // }



  //#region Approve get and open dialog window
  onApprovel() {
    this.approvalHistoryService.getAllApprovalDashboard(parseInt(this.userId$)).subscribe(result => {
      this.approvalDashboard = result;
      this.approvevalue = this.approvalDashboard.find(x => x.referenceId == this.customerId)
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

  dateFilter = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date >= currentDate;
  };

  get tradeLicenseExpiryDateControl(): AbstractControl | null {
    return this.customerForm.get('tradeLicenseExpiryDate');
  }

  setName() {
    debugger
    const aliasName = this.customerForm.controls['aliasName'].value
    if (aliasName == null) {
      const name = this.customerForm.controls['customerName'].value
      this.customerForm.controls['aliasName'].setValue(name);
    }
  }

  onselectService() {
    debugger
    const selectedServices = this.customerForm.controls['serviceType'].value;
    const uniqueSelectedServices = selectedServices.filter(
      (selectedService: any) =>
        !this.customerServices.some(
          (existingService: any) => existingService.serviceSectorId === selectedService
        )
    );
    // Add new services to the array
    uniqueSelectedServices.forEach((selectedService: any) => {
      this.serviceForm = this.fb.group({
        cServiceId: [0],
        customerId: [0],
        serviceSectorId: [selectedService],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date],
      });
      this.customerServices.push(this.serviceForm.value);
    });
    const uncheckedServices = this.customerServices.filter(
      (existingService: any) =>
        !selectedServices.includes(existingService.serviceSectorId)
    );
    uncheckedServices.forEach((uncheckedService: any) => {
      const index = this.customerServices.findIndex(
        (existingService: any) =>
          existingService.serviceSectorId === uncheckedService.serviceSectorId
      );
      if (index !== -1) {
        this.customerServices.splice(index, 1);
      }
    });
  }


  isOptionDisabled(option: any): any {
    const cstatus = this.customerForm.controls['cStatusId'].value;
    if (cstatus.cStatusId == 5) {
      this.hidebutton = false;
      return !(option.cStatusId === 5 || option.cStatusId === 2 || option.cStatusId === 4);
    } else if (cstatus.cStatusId == 1) {
      this.hidebutton = true;
      return !(option.cStatusId === 1 || option.cStatusId === 2);
    } else if (cstatus.cStatusId == 2) {
      this.hidebutton = true;
      return !(option.cStatusId === 2);
    } else if (this.cStatusId == 3) {
      this.hidebutton = true;
      return !(option.cStatusId === 3);
    } else if (cstatus.cStatusId == 4) {
      this.hidebutton = true;
      return !(option.cStatusId === 4);
    }

    if (this.cStatusId == 5) {
      this.hidebutton = false;
      return !(option.cStatusId === 5 || option.cStatusId === 2 || option.cStatusId === 4);
    } else if (this.cStatusId == 1) {
      this.hidebutton = true;
      return !(option.cStatusId === 1 || option.cStatusId === 2);
    } else if (this.cStatusId == 2) {
      this.hidebutton = true;
      return !(option.cStatusId === 2);
    } else if (this.cStatusId == 3) {
      this.hidebutton = true;
      return !(option.cStatusId === 3);
    } else if (this.cStatusId == 4) {
      this.hidebutton = true;
      return !(option.cStatusId === 4);
    }
  }
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
    this.customerForm.controls['creditLimit'].setValue(value);
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
    this.customerForm.controls['creditDays'].setValue(value);
  }

  // #region finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.customerForm.controls;
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
  //#endregion
  // #region onSaveGeneral
  onSaveGeneral(value: any) {

    // if (this.cStatusId == 4) {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Info!",
    //     text: "This customer is already awaiting approval.",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   return;
    // }
    const cStatus = this.customerForm.controls['cStatusId'].value;
    // if (cStatus.cStatusId == 3) {
    //   this.UpdateValidity();
    // }
    if (value === 'Save') {
      if (cStatus.cStatusId == 5) {
        this.cStatusId = 1;
      }
      else if (cStatus.cStatusId == 3) {
        this.cStatusId = 1;
      } else if (cStatus.cStatusId == 4) {
        this.cStatusId = 4;
      }
    }
    else if (value === 'Draft') {
      if (cStatus.cStatusId == 5) {
        this.cStatusId = 5;
      } else if (cStatus.cStatusId == 2) {
        this.cStatusId = 2;
      }
    }

    let j = 0
    this.customerContact.forEach(ele => {
      if (ele.contactTypeId == null) {
        j++;
        this.invalidContact.push(ele.contactPerson);
      }
    });

    if (j > 0 && this.cStatusId != 5) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please fill the Contact details for the following Contact: " + this.invalidContact.join(", ") + ".",
        showConfirmButton: false,
        timer: 2000,
      });
      this.invalidContact = [];
      this.changeTab(1);
      return;
    }


    let i = 0
    this.customerAddress.forEach(ele => {
      if (ele.countryId == null || ele.cityId == null || ele.stateId == null || ele.addressLine1 === "" || ele.phoneNumber === "") {
        i++;
        this.invalidAddresses.push(ele.addressName);
      }
    });

    if (i > 0 && this.cStatusId != 5) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please fill the address details for the following addresses: " + this.invalidAddresses.join(", ") + ".",
        showConfirmButton: false,
        timer: 2000,
      });
      this.changeTab(2);
      this.invalidAddresses = [];
      return;
    }

    const validDateValue = this.customerForm?.get('tradeLicenseExpiryDate')?.value;
    if (validDateValue) {
      let adjustedDate = new Date(validDateValue);
      // Adjust timezone to match your local timezone
      const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
      adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
      this.customerForm.get('tradeLicenseExpiryDate')?.setValue(adjustedDate);
    }

    let name = this.customerForm.controls['customerName'].value
    if (!name) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the Customer Name.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    this.customer = this.customerForm.value;
    this.customer.creditDays = this.customerForm.controls['creditDays'].value;
    this.customer.creditLimit = this.customerForm.controls['creditLimit'].value;
    const dateValue = this.customerForm.controls['tradeLicenseExpiryDate'].value;
    this.customer.tradeLicenseExpiryDate = dateValue != null ? dateValue : null;
    this.customer.trn = this.customerForm.controls['trn'].value;
    this.customer.customerRankingId = this.customerRankingId;
    this.customer.sapRefCode = this.customerForm.controls['sapRefCode'].value;

    // if (
    //   (this.customer.creditDays == null ||
    //     this.customer.creditLimit == null ||
    //     this.customer.tradeLicenseNumber == null ||
    //     this.customer.tradeLicenseExpiryDate == null ||
    //     this.customer.trn == null ||
    //     this.customer.customerRankingId == null) &&
    //   cStatus.cStatusId == 3
    // ) {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Info",
    //     text: "Please fill the account details.",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   return;
    // }

    if (!this.customerForm.controls['customerEmail'].valid && this.cStatusId != 5) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please provide a valid email address.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.customerForm.controls['customerEmail'].markAllAsTouched();
      this.changeTab(0);
      return
    }
    if (this.customerForm.valid || this.cStatusId === 5) {
      // for (let ele of this.documentChecklist) {
      //   if (ele.mandatory && ele.documentName == "" && cStatus.cStatusId == 3) {
      //     Swal.fire({
      //       icon: "info",
      //       title: "Info",
      //       text: "Please fill the mandatory documents.",
      //       showConfirmButton: false,
      //       timer: 2000,
      //     });
      //     return;
      //   }
      //}
      this.customer.customerCode = this.customerForm.controls['customerCode'].value;
      this.customer.customerId = this.customerForm.controls['customerId'].value;
      this.customer.aliasName = this.customerForm.controls['aliasName'].value;
      this.customer.customerEmail = this.customerForm.controls['customerEmail'].value || 'test@gmail.com';
      this.customer.customerPhone = this.customerForm.controls['customerPhone'].value || '123456789';
      this.customer.companyWebsite = this.customerForm.controls['companyWebsite'].value;
      this.customer.tags = this.customerForm.controls['tags'].value;
      this.customer.customerRemarks = this.customerForm.controls['customerRemarks'].value;
      this.customer.closedRemarks = this.customerForm.controls['closedRemarks'].value;

      this.customer.customerId = this.customerId;
      this.customer.customerCurrencyId = this.customerCurrencyId || this.getUnknownId("Currency");
      this.customer.billingCurrencyId = this.billingCurrencyId || this.getUnknownId("BillingCurrency");
      this.customer.salesOwnerId = this.salesOwnerId;
      this.customer.salesExecutiveId = this.salesExecutiveId;
      this.customer.industryId = this.industryId;
      this.customer.serviceTypeId = this.serviceTypeId;
      this.customer.customerTypeId = this.cvTypeId || this.getUnknownId("CVType");
      this.customer.jobNotificationStageId = this.jobNotificationStageId || this.getUnknownId("ReportingStage");
      this.customer.customerRankingId = this.customerRankingId;
      this.customer.cStatusId = this.cStatusId;
      this.customer.approvalStatusId = this.approvalStatusId;
      this.customer.reasonId = this.reasonId;

      this.customer.modeofFollowUpId = this.modeofFollowUpId;
      this.customer.informationSourceId = this.informationSourceId;
      this.customer.updatedBy = parseInt(this.userId$);

      const ModelContainer: CustomerContainer = {
        customer: this.customer,
        customerServices: this.customerServices,
        customerContact: this.customerContact,
        customerAddress: this.customerAddress,
        cLineItemCategory: this.cLineItemCategory,
        documentChecklist: this.documentChecklist
      }
      //console.log('ModelContainer',ModelContainer);
      if (this.customerContact.length == 0 && this.cStatusId != 5) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary contact details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(1);
        return
      }
      if (this.customerAddress.length == 0 && this.cStatusId != 5) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary address details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(2);
        return
      }

      let contact = this.customerContact.find((element) => element.primaryContact == true);
      let address = this.customerAddress.find((element) => element.primaryAddress == true);

      if (contact?.primaryContact == false || contact == undefined && this.cStatusId != 5) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary contact details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(1);
        return
      }
      if (address?.primaryAddress == false || address == undefined && this.cStatusId != 5) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary address details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(2);
        return
      }
      if (ModelContainer.customer.customerId == 0 || ModelContainer.customer.customerId == undefined) {
        this.customerService.CustomerSave(ModelContainer).subscribe({
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
            const parms = {
              MenuId: 26,
              currentUser: this.userId$,
              activityName: "Creation",
              id: res.customer.customerId,
              code: res.customer.customerCode
            }
            this.Ns.TriggerNotification(parms).subscribe((res => {

            }));
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
      }
      else {
        this.customerService.CustomerSave(ModelContainer).subscribe({
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
            const parms = {
              MenuId: 26,
              currentUser: this.userId$,
              activityName: "Updation",
              id: res.customer.customerId,
              code: res.customer.customerCode
            }
            this.Ns.TriggerNotification(parms).subscribe((res => {

            }));
            this.commonService.displayToaster(
              "success",
              "Success",
              "Updated Sucessfully"
            );
            if (this.customerService.editFromApprove) {
              this.router.navigate(["/crm/master/approvalhistorylist"]);
              this.customerService.editFromApprove = false;
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
      this.changeTab(0);
      const invalidControls = this.findInvalidControls();
      this.customerForm.markAllAsTouched();
      this.validateall(this.customerForm);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
    }

  }
  //#endregion
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

  returnToList() {
    if (this.customerService.editFromApprove) {
      this.router.navigate(["/crm/master/approvalhistorylist"]);
      this.customerService.editFromApprove = false;
      return;
    }
    if (this.customerService.isApprove) {
      this.router.navigate(["/crm/master/approvalhistorylist"]);
      this.customerService.isApprove = false;
      return;
    }
    if (this.potentialCustomerService.movetoCustomer) {
      this.router.navigate(["/crm/master/potentialcustomerlist"]);
      this.potentialCustomerService.movetoCustomer = false
      return;
    }
    this.router.navigate(["/crm/master/customerlist"]);
    this.potentialCustomerService.itemId = 0;

  }
  resetGeneral() {
    if (this.potentialCustomerService.movetoCustomer) {
      this.getPCbyId(this.potentialCustomerService.itemId);
      return
    }
    if (this.gereralEdit) {
      this.getAllbyId(this.customer.customerId);
    }
    this.customerForm.reset();
    this.closedField = false;
    this.customer = new Customer();
    this.customerContact = [];
    this.customerAddress = [];
    // this.statusList.forEach(x => {
    //   if (x.cStatusId == 6) {
    //     this.customerForm.controls['cStatusId'].setValue(x);
    //     this.cStatusId = x.cStatusId;
    //   }
    // });
    // this.customerDocument = [];
    this.customerServices = [];
    this.ngOnInit();
    // this.cDocumentArray = [];
  }


  //---------------------Contact-----------------------------

  onEditContact(Data: any) {
    this.rowIndexContact = this.customerContact.indexOf(Data);
    this.editedContact = { ...Data }
    this.customerContact.splice(this.rowIndexContact, 1);
    const dialogRef = this.dialog.open(CContactDialogComponent, {
      data: {
        contactData: Data,
        list: this.customerContact,
        mode: 'Edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.customerContact.splice(this.rowIndexContact, 0, result);
        this.customerContact = [...this.customerContact];
      }
      else {
        this.customerContact.splice(this.rowIndexContact, 0, this.editedContact);
        this.customerContact = [...this.customerContact];
      }
    });
  }
  onDeleteContact(data: any) {
    const rowIndex = this.customerContact.indexOf(data);
    this.customerContact.splice(rowIndex, 1);
    this.customerContact = [...this.customerContact];
  }
  onviewContact(Data: any) {
    const dialogRef = this.dialog.open(CContactDialogComponent, {
      data: {
        contactData: Data,
        mode: 'View',
      }
    });

  }
  openDialog() {
    debugger
    const dialogRef = this.dialog.open(CContactDialogComponent, {
      data: {
        list: this.customerContact
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.customerContact.splice(0, 0, result);
        this.customerContact = [...this.customerContact];
      }
    });
  }

  //---------------------Address-----------------------------

  onEditAddress(Data: any) {
    debugger
    this.rowIndexAddress = this.customerAddress.indexOf(Data);
    this.editedAddress = { ...Data }
    this.customerAddress.splice(this.rowIndexAddress, 1);
    const dialogRef = this.dialog.open(CAddressDialogComponent, { data: { addressDate: Data, list: this.customerAddress, mode: 'Edit', index: this.rowIndexContact }, disableClose: true, autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.customerAddress.splice(this.rowIndexAddress, 0, result);
        this.customerAddress = [...this.customerAddress];
      }
      else {
        this.customerAddress.splice(this.rowIndexAddress, 0, this.editedAddress);
        this.customerAddress = [...this.customerAddress];
      }
    });
  }
  onDeleteAddress(data: any) {
    const rowIndex = this.customerAddress.indexOf(data);
    this.customerAddress.splice(rowIndex, 1);
    this.customerAddress = [...this.customerAddress];
  }
  onviewAddress(Data: any) {
    const dialogRef = this.dialog.open(CAddressDialogComponent, {
      data: {
        addressDate: Data,
        mode: 'View',
      }
    });
  }
  AddressDialog() {
    const dialogRef = this.dialog.open(CAddressDialogComponent, { data: { list: this.customerAddress } });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.customerAddress.splice(0, 0, result)
        this.customerAddress = [...this.customerAddress];
      }
    });
  }
  //----------------------Document Check list-----------------------------------
  getDocumentList() {
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      this.documents = res;
    });
  }
  onEditDocument(Data: any) {
    debugger;
    this.rowIndexDocument = this.documentChecklist.indexOf(Data);
    this.editedDocument = { ...Data };
    this.documentChecklist.splice(this.rowIndexDocument, 1);

    const dialogRefDoc = this.dialog.open(CustomerDocDialogComponent, {
      data: {
        documentData: Data,
        list: this.documentChecklist,
        mode: 'Edit',
      },
      autoFocus: false,
      disableClose: true,
    });

    dialogRefDoc.afterClosed().subscribe(result => {
      debugger;
      if (result != null) {
        this.documentChecklist.splice(this.rowIndexDocument, 0, result);
        this.documentChecklist = [...this.documentChecklist];
        this.ImageDetailsArray = result.Document;
      } else {
        this.documentChecklist.splice(this.rowIndexDocument, 0, this.editedDocument);
        this.documentChecklist = [...this.documentChecklist];
        this.ImageDetailsArray = result.Document;
      }
    });
  }

  onDeleteDocument(data: any) {

    if (data.mandatory) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "It's a mandatory document. Not able to delete!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    const rowIndex = this.documentChecklist.indexOf(data);
    this.documentChecklist.splice(rowIndex, 1);
    this.documentChecklist = [...this.documentChecklist];
  }
  onviewDocument(Data: any) {
    const dialogRefDoc = this.dialog.open(CustomerDocDialogComponent, {
      data: {
        documentData: Data,
        mode: 'View',
      }, autoFocus: false, disableClose: true,
    });

  }
  openDialogDocument() {
    debugger
    const dialogRefDoc = this.dialog.open(CustomerDocDialogComponent, {
      data: {
        list: this.documentChecklist
      }, disableClose: true, autoFocus: false
    });
    dialogRefDoc.afterClosed().subscribe(result => {
      debugger
      if (result != null) {
        this.documentChecklist.splice(0, 0, result);
        this.ImageDetailsArray = result.Document;
        this.documentChecklist = [...this.documentChecklist];
      }
    });
  }
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
  //--------------------------------------------------------------



  // AddDocumentCheckList() {
  //   this.documentCheckArrayList = this.documentChecklist;
  //   if (!this.showAddRowDoc) {
  //     const newRow: DocumentChecklist = {
  //       CDocumentId: 0,
  //       customerId: 0,
  //       documentId: 0,
  //       isCollected: false,
  //       collectedDate: this.date,
  //       remarks: '',
  //       documentName: '',
  //       createdBy: 0,
  //       createdDate: this.date,
  //       documentTypeName: '',
  //       IseditDocCheck: true,
  //       files: '',
  //       mandatory: false
  //     };
  //     this.remarks = '';
  //     this.newDocx = true;
  //     this.documentChecklist = [newRow, ...this.documentChecklist];
  //     this.showAddRowDoc = true;
  //   }
  // }

  // SaveDocCheck(data: any) {
  //   data.documentTypeName = this.documentTypeName;
  //   data.documentName = this.fileCheckName;
  //   this.documentCheckName = this.fileCheckName;
  //   if (data.documentTypeName == "" || this.fileCheckName == "") {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops!",
  //       text: "Please fill the mandatory fields",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     return;
  //   }
  //   this.documentCheckArrayList.forEach(element => {
  //     if (element.documentTypeName === data.documentTypeName) {
  //       this.existDoc = true
  //     }
  //   });
  //   if (this.existDoc) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Info",
  //       text: "Already exist",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     this.showAddRowDoc = true;
  //     data.IseditDocCheck = true;
  //     this.existDoc = false;
  //     return;
  //   }
  //   else {
  //     this.documentCheckArrayList.splice(0, 0, data);
  //     this.showAddRowDoc = false;
  //     data.IseditDocCheck = false;
  //   }
  //   this.fileCheckName = '';
  // }
  // UpdateDocCheck(data: any) {
  //   debugger
  //   data.documentId = this.documentId;
  //   data.documentTypeName = this.documentTypeName;
  //   data.documentName = this.fileCheckName;
  //   this.documentCheckName = this.fileCheckName;
  //   if (data.documentTypeName == "" || this.fileCheckName == "") {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops!",
  //       text: "Please fill the mandatory fields",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     return;
  //   }
  //   this.documentCheckArrayList.splice(this.editedDocCheckindex, 1);
  //   this.documentCheckArrayList.forEach(element => {
  //     if (element.documentTypeName === data.documentTypeName) {
  //       this.existDoc = true
  //     }
  //   });
  //   if (this.existDoc) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Info",
  //       text: "Already exist",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     this.showAddRowDoc = true;
  //     data.IseditDocCheck = true;
  //     this.existDoc = false;
  //     return;
  //   }
  //   else {
  //     this.documentCheckArrayList.splice(0, 0, data);
  //     this.showAddRowDoc = false;
  //     data.IseditDocCheck = false;
  //   }
  //   this.fileCheckName = '';


  // }
  // onviewDocCheck(data: any) {

  // }
  // EditDocCheck(data: any) {
  //   data.IseditDocCheck = true;
  //   this.documentId = data.documentId;
  //   this.fileCheckName = data.documentName;
  //   this.editedDocCheckindex = this.documentChecklist.indexOf(data);
  //   this.editedDocCheck = { ...data };
  // }

  // oncancelDocCheck(data: any) {
  //   debugger
  //   const rowIndex = this.documentChecklist.indexOf(data);
  //   if (this.newDocx) {
  //     this.documentChecklist.splice(data, 1);
  //     this.documentChecklist = [...this.documentChecklist];
  //     this.showAddRowDoc = false;
  //     this.newDocx = false;
  //     this.fileCheckName = '';
  //     return;
  //   }
  //   this.documentChecklist.splice(this.editedDocCheckindex, 1);
  //   this.documentChecklist.splice(this.editedDocCheckindex, 0, this.editedDocCheck);
  //   this.documentChecklist = [...this.documentChecklist]
  //   this.editedDocCheck.IseditDocCheck = false;
  // }

  // FileCheck(event: any) {
  //   if (event?.target?.files && event.target.files.length > 0) {
  //     const files = event.target.files;

  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       this.fileCheckName = file.name;
  //       const fileName = file.name.toLowerCase();
  //       const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

  //       // Check if the file type is allowed (jpg or png)
  //       if (['jpg', 'png', 'docx', 'doc', 'xls', 'xlsx'].includes(fileType)) {
  //         // Check if the image already exists, then update it
  //         const existingIndex = this.documentChecklist.findIndex(img => img.documentName.toLowerCase() === fileName);
  //         if (existingIndex !== -1) {
  //           // If the image already exists, update it
  //           //this.ImageDetailsArray[existingIndex] = file;

  //         } else {
  //           // If the image doesn't exist, add it to the array
  //           // this.ImageDetailsArray.push(file);
  //         }
  //       } else {
  //         // Handle unsupported file types
  //         this.commonService.displayToaster(
  //           "error",
  //           "error",
  //           "Please Choose JPG, PNG, DOCX, DOC, XLS, or XLSX Files."
  //         );
  //         this.documentCheckName = ''
  //       }
  //     }
  //   }
  // }
  // ValidateFieldDoc(item: any) {
  //   if (item !== '') {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  // selectDocevent(item: any) {
  //   debugger
  //   this.onSelectDoc = true;
  //   this.documentId = item.documentId;
  //   this.documentTypeName = item.documentName;
  //   // this.remarks = item.remarks
  // }
  // //#region Keyboard tab operation
  // /// to provoke save or update method
  // hndlKeyPressDocCheck(event: any, dataItem: any) {
  //   if (event.key === 'Enter') {
  //     this.showAddRowDoc ? this.SaveDocCheck(dataItem) : this.UpdateDocCheck(dataItem);
  //   }
  // }
  // /// to reach submit button
  // handleChangeDocCheck(event: any, dataItem: any) {
  //   if (event.key === 'Tab' || event.key === 'Enter') {
  //     this.submitButton.nativeElement.focus();
  //   }
  // }
  // /// to reach cancel button
  // hndlChangeDocCheck(event: any) {
  //   if (event.key === 'Tab') {
  //     this.cancelButton.nativeElement.focus();
  //   }
  // }
  // /// to provoke cancel method
  // handleKeyPressDocCheck(event: any, dataItem: any) {
  //   if (event.key === 'Enter') {
  //     this.oncancelDocCheck(dataItem)
  //   }
  // }
  //#endregion


  //#region document
  //---------------------Document-----------------------------

  // AddDocument() {
  //   if (!this.showAddRowDoc) {
  //     const newRow: CustomerDocument = {
  //       cDocumentId: 0,
  //       customerId: 0,
  //       documentId: 0,
  //       remarks: '',
  //       createdBy: parseInt(this.userId$),
  //       createdDate: this.date,
  //       documentName: '',
  //       documentTypeName: '',
  //       IseditDoc: true,
  //       newDoc: true,
  //       files: ''
  //     };
  //     this.remarks = '';
  //     this.customerDocument = [newRow, ...this.customerDocument];
  //     this.showAddRowDoc = true;
  //   }
  // }

  // SaveDoc(data: CustomerDocument) {
  //   debugger
  //   if (data.documentTypeName == "" || this.fileName == "") {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops!",
  //       text: "Please fill the mandatory fields",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     return;
  //   }
  //   data.files = this.file;
  //   data.documentTypeName = this.documentTypeName;
  //   data.documentName = this.fileName;
  //   data.documentId = this.documentId;
  //   data.remarks = this.remarks;
  //   this.cDocumentArray.forEach(element => {
  //     if (element.documentTypeName === data.documentTypeName) {
  //       this.existDoc = true
  //     }
  //   });
  //   if (this.existDoc) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Info",
  //       text: "Already exist",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     this.showAddRowDoc = true;
  //     data.IseditDoc = true;
  //     this.existDoc = false;
  //     return;
  //   }
  //   else {
  //     this.cDocumentArray.splice(0, 0, data);
  //     this.showAddRowDoc = false;
  //     data.IseditDoc = false;
  //     data.newDoc = false;
  //   }
  //   this.onSelectDoc = false;
  //   this.fileName = '';
  // }

  // UpdateDoc(data: CustomerDocument) {
  //   debugger
  //   if (data.documentTypeName == "" || this.fileName == "") {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops!",
  //       text: "Please fill the mandatory fields",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     return;
  //   }
  //   data.files = this.file;
  //   data.documentTypeName = this.documentTypeName;
  //   data.documentName = this.fileName;
  //   data.documentId = this.documentId;
  //   data.remarks = this.remarks;
  //   if (this.onSelectDoc) {
  //     data.documentName = this.fileName;
  //     data.remarks = this.remarks;
  //     data.documentTypeName = this.documentTypeName;
  //     data.documentId = this.documentId;
  //   }
  //   this.cDocumentArray.forEach(element => {
  //     if (element.documentTypeName === data.documentTypeName) {
  //       this.existDoc = true;
  //     }
  //   });
  //   if (this.existDoc) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Info",
  //       text: "Already exist",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     this.showAddRowDoc = true;
  //     data.IseditDoc = true;
  //     this.existDoc = false;
  //     return;
  //   }
  //   else {
  //     this.cDocumentArray.splice(this.rowIndexforDoc, 0, data);
  //     //this.cDocumentArray.push(data);
  //     this.showAddRowDoc = false;
  //     data.IseditDoc = false;
  //     data.newDoc = false;
  //   }
  //   this.fileName = '';
  // }
  // EditDoc(data: CustomerDocument) {
  //   debugger
  //   data.IseditDoc = true;
  //   this.documentTypeName = data.documentTypeName;
  //   this.remarks = data.remarks;
  //   this.fileName = data.documentName;
  //   this.documentId = data.documentId;
  //   const rowIndex = this.cDocumentArray.indexOf(data);
  //   this.rowIndexforDoc = rowIndex;
  //   this.editDocumet = { ...data };
  //   this.removeDoc = this.cDocumentArray.splice(rowIndex, 1)
  //   this.onSelectDoc = false;
  // }
  // Deletedoc(data: CustomerDocument) {
  //   debugger
  //   const rowIndex = this.cDocumentArray.indexOf(data);
  //   this.cDocumentArray.splice(rowIndex, 1);
  //   this.customerDocument.splice(rowIndex, 1);
  //   this.customerDocument = [...this.customerDocument];
  //   data.IseditDoc = false;
  //   this.showAddRowDoc = false;
  // }
  // oncancelDoc(data: any) {
  //   debugger
  //   const rowIndex = this.customerDocument.indexOf(data);
  //   if (data.newDoc) {
  //     this.customerDocument.splice(rowIndex, 1);
  //     //this.cDocumentArray.splice(rowIndex,1);
  //     this.customerDocument = [...this.customerDocument];
  //     this.showAddRowDoc = false;
  //     data.newDoc = false;
  //     this.fileName = '';
  //     return;
  //   }
  //   if (data.IseditDoc) {
  //     this.customerDocument.splice(rowIndex, 1);
  //     this.customerDocument.splice(rowIndex, 0, this.editDocumet);
  //     this.cDocumentArray.splice(rowIndex, 0, this.editDocumet);
  //     this.customerDocument = [...this.customerDocument];
  //     this.showAddRowDoc = false;
  //     this.editDocumet.IseditDoc = false;
  //     data.newDoc = false;
  //     this.fileName = '';
  //   }

  // }

  // File(event: any): void {
  //   if (event?.target?.files && event.target.files.length > 0) {
  //     const files = event.target.files;

  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       this.fileName = file.name;
  //       const fileName = file.name.toLowerCase();
  //       const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

  //       // Check if the file type is allowed (jpg or png)
  //       if (['jpg', 'png', 'docx', 'doc', 'xls', 'xlsx'].includes(fileType)) {
  //         // Check if the image already exists, then update it
  //         const existingIndex = this.customerDocument.findIndex(img => img.documentName.toLowerCase() === fileName);
  //         if (existingIndex !== -1) {
  //           // If the image already exists, update it
  //           //this.ImageDetailsArray[existingIndex] = file;

  //         } else {
  //           // If the image doesn't exist, add it to the array
  //           // this.ImageDetailsArray.push(file);
  //         }
  //       } else {
  //         // Handle unsupported file types
  //         this.commonService.displayToaster(
  //           "error",
  //           "error",
  //           "Please Choose JPG, PNG, DOCX, DOC, XLS, or XLSX Files."
  //         );
  //         this.documentName = ''
  //       }
  //     }
  //   }
  // }

  // onviewDoc(data: any) {
  //   const fileUrl = data.files
  //   const winUrl = URL.createObjectURL(fileUrl);
  //   window.open(winUrl, '_blank');
  // }
  // // selectDocevent(item: any) {
  // //   debugger
  // //   this.onSelectDoc = true;
  // //   this.documentId = item.documentId;
  // //   this.documentTypeName = item.documentName;
  // //   // this.remarks = item.remarks
  // // }
  // download(data: any) {

  // }
  // ValidateFieldDoc(item: any) {
  //   if (item !== '') {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  // //#region Keyboard tab operation
  // /// to provoke save or update method
  // hndlKeyPressDoc(event: any, dataItem: any) {
  //   if (event.key === 'Enter') {
  //     this.showAddRowDoc ? this.SaveDoc(dataItem) : this.UpdateDoc(dataItem);
  //   }
  // }
  // /// to reach submit button
  // handleChangeDoc(event: any, dataItem: any) {
  //   if (event.key === 'Tab' || event.key === 'Enter') {
  //     this.submitButton.nativeElement.focus();
  //   }
  // }
  // /// to reach cancel button
  // hndlChangeDoc(event: any) {
  //   if (event.key === 'Tab') {
  //     this.cancelButton.nativeElement.focus();
  //   }
  // }
  // /// to provoke cancel method
  // handleKeyPressDoc(event: any, dataItem: any) {
  //   if (event.key === 'Enter') {
  //     this.oncancelDoc(dataItem)
  //   }
  // }
  // //#endregion

  //#endregion

  changeTab(index: number): void {
    this.selectedIndex = index;
  }
}
