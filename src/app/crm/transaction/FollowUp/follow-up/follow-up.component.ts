import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { FollowupBaseDoc, FollowupStatus, ModeofFollowUp } from 'src/app/Models/crm/master/Dropdowns';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/ums/masters/employee/employee.model';
import { FollowUpCombine, FollowUpDocuments } from 'src/app/Models/crm/master/transactions/Followup';
import { Documents } from 'src/app/Models/crm/master/documents';
import Swal from 'sweetalert2';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { PotentialCustomerService } from 'src/app/crm/master/potential-customer/potential-customer.service';
import { FollowupService } from '../followup.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { DateAdapter, MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { EnquiryService } from '../../Enquiry/enquiry.service';
import { Enquiry } from 'src/app/Models/crm/master/transactions/Enquiry';
import { RfqService } from '../../RFQ/rfq.service';
import { Rfqgeneral } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor.service';
import { PotentialVendor } from 'src/app/crm/master/potential-vendor/potential-vendor.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDateFormats } from '@angular-material-components/datetime-picker';
import { CustomNgxDatetimeAdapter } from '../CustomNgxDatetimeAdapter';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { PurchaseQuotationCuvService } from '../../purchese-quotation/purchase-quotation-cuv.service';
import { Customer } from 'src/app/crm/master/customer/customer.model';
import { PurchaseQuotation } from '../../purchese-quotation/purchase-quotation.model';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.development';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { SignalRconnectionService } from 'src/app/services/NotificationConnection/signal-rconnection.service';
import { notificationpopup } from 'src/app/Models/ums/notificationconfiguration.modal';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: ['DD/MM/YYYY HH:mm', 'DD/MMM/YYYY HH:mm'] as any,
  },
  display: {
    dateInput: 'DD/MMM/YYYY HH:mm',
    monthYearLabel: 'MM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  }
};

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class FollowUpComponent implements OnInit  {
  FollowUp!: FormGroup;
  FollowUpDoc!: FormGroup;
  BaseDoc: FollowupBaseDoc[] = [];
  date = new Date;
  filteredBaseDoc: Observable<FollowupBaseDoc[]> | undefined;
  filteredBaseDocId: Observable<any[]> | undefined;
  filteredFollowUpUserId: Observable<Employee[]> | undefined;
  filteredfollowUpModeId: Observable<ModeofFollowUp[]> | undefined;
  filteredstatusId: Observable<FollowupStatus[]> | undefined;
  filterednextFollowUpModeId: Observable<ModeofFollowUp[]> | undefined;
  filteredfollowUpAssignedId: Observable<Employee[]> | undefined;
  filtereddocumentId: Observable<Documents[]> | undefined;
  SelectedDocId: number | null;
  DocID: any[] = [];
  BaseDocId: string[] = [];
  SelectedbaseDocId: number;
  Livestatus = 1;
  Employee: Employee[] = [];
  SelectedFollowupId: number;
  ModeofFollowUp: ModeofFollowUp[] = [];
  SelectedModeFollowupId: number;
  Followupstatus: FollowupStatus[] = [];
  SelectedstatusId: number;
  NextModeofFollowUp: ModeofFollowUp[];
  SelectedNextModeFollowupId: number;
  FollowUpAssignedEmployee: Employee[];
  SelectedAssignedId: number;
  document: Documents[] = [];
  SelectedDocumentId: number;
  DocRemarks: string;
  ImageDetailsArray: any[] = [];
  ImageDataArray: any[] = [];
  ImageStore: any[] = [];
  remainder: any;
  titile: string;
  disablefields: boolean;
  ShowUpdate: boolean;
  ShowReset: boolean;
  Showsave: boolean;
  NewDocID: any[] = [];
  enquiry: Enquiry[] = [];
  Date = new Date();
  pageSize = 10;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>; 
  Filepath = environment.Fileretrive;
  allowedExtensions: string[] = ['jpg', 'png'];
  //Date Time Picker//
  //public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  defaultTime = [new Date().getHours(), 0, 0];
  minDate: Date;
  maxDate: Date;
  skip = 0;
  @ViewChild('picker') picker: any;
  RFQlist: Rfqgeneral[] = [];
  Pvlist: PotentialVendor[] = [];
  userId$: string;
  Listrouter: string;
  Followdocument: any[] = [];
  showAddRowDoc: boolean;
  Customer: Customer[] = [];
  vendor: any[] = [];
  Pqlist: PurchaseQuotation[] = [];
  edit: boolean;
  isEditDocument: boolean;



  constructor(private SPV: PotentialVendorService,
    private SRFQ: RfqService,
    private adapter: DateAdapter<any>,
    private datePipe: DatePipe,
    private service: CommonService,
    private ErrorHandling: ErrorhandlingService,
    private router: Router,
    private FS: FollowupService,
    private route: ActivatedRoute,
    private Eservice: EnquiryService,
    private docs: DocmentsService,
    private FB: FormBuilder,
    private UserIdstore: Store<{ app: AppState }>,
    private Pvs: PotentialCustomerService,
    private Cservice: CustomerService,
    private Vs: VendorService,
    private pQs: PurchaseQuotationCuvService,
    private Ns:NofificationconfigurationService,
    private commonService: CommonService,
    private Fs:FileuploadService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private signalRService: SignalRconnectionService,
    private errorHandler: ApiErrorHandlerService) {
    this.fetchDropDownData();

    // Set minDate to current date
    this.minDate = new Date();
    this.maxDate = new Date();
    // Set adapter locale to match user's locale if needed
    this.adapter.setLocale('en');
  }
  dateFilter = (date: Date | null): boolean => {
    // Get the enquiry date and time from the form control
    const enquiryDateValue = this.FollowUp.controls['followUpDate'].value;
  
    // Ensure enquiryDateValue is a valid Date object
    const enquiryDate = enquiryDateValue ? new Date(enquiryDateValue) : null;
  
    // If enquiryDate is not valid, allow all dates
    if (!enquiryDate) {
      return true;
    }
  
    // Return true if date is null or date is greater than or equal to enquiryDate
    return !date || date >= enquiryDate;
  };
  dateFilterRemainder = (startDate: Date | null, endDate: Date | null): Date[] => {
    if (!startDate || !endDate) {
        return [];
    }

    // Initialize an empty array to store the dates
    const dates: Date[] = [];

    // Copy the start date to manipulate it
    let currentDate = new Date(startDate);

    // Iterate through each date until the end date
    while (currentDate <= endDate) {
        // Add the current date to the array
        dates.push(new Date(currentDate));
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

  
  ngOnInit(): void {
    this.GetUserId();
    this.IntializeForm();
    this.InitializeDoc();
    this.titile = "New Follow Up";
    this.Listrouter = "/crm/transaction/followuplist";
    this.SelectedstatusId=2;
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  IntializeForm() {
    const currentDate = new Date();
    this.FollowUp = this.FB.group({
      followUpId: [0],
      followUpCode: [{ value: '', disabled: true }],
      followUpDate: [currentDate, [Validators.required]],
      baseDocNameId: ["", [Validators.required]],
      baseDocId: ["", [Validators.required]],
      followUpUserId: ["", [Validators.required]],
      followUpModeId: ["", [Validators.required]],
      followUpNotes: ["", [Validators.required]],
      statusId: ["", [Validators.required]],
      nextFollowUpDate: [null],
      nextFollowUpModeId: [null],
      nextFollowUpNotes: [null],
      followUpAssignedId: [null],
      remainder: [1],
      remainderDate: [null],
      remarks: [null],
      tags: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });

  }
  InitializeDoc() {
    this.FollowUpDoc = this.FB.group({
      fUDocumentId: [0],
      followUpId: [0],
      documentId: ["", [Validators.required]],
      documentName: [""],
      remarks: [""],
      createdBy: parseInt(this.userId$),
      createdDate: this.date
    });

  }

  EditMode() {
    var Path = this.router.url;
    if (Path == "/crm/transaction/followup/edit/" + this.route.snapshot.params["id"]) {
      this.edit = true;
      this.titile = "Update Follow Up";
      this.disablefields = false;
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
      this.FS.GetAllFollowUpById(this.route.snapshot.params["id"])
        .subscribe(async (result: FollowUpCombine) => {
          this.SelectedbaseDocId = result.follow_Up.baseDocNameId;
          this.SelectedDocId = result.follow_Up.baseDocId;
          this.SelectedFollowupId = result.follow_Up.followUpUserId;
          this.SelectedModeFollowupId = result.follow_Up.followUpModeId;
          this.SelectedstatusId = result.follow_Up.statusId;
          this.SelectedNextModeFollowupId = result.follow_Up.nextFollowUpModeId;
          this.SelectedAssignedId = result.follow_Up.followUpAssignedId;
          var values = await this.optionSelectedbaseDocNameId(result.follow_Up.baseDocNameId);
          this.optionSelectedEditstatus(result.follow_Up.statusId);
          this.FollowUp.patchValue({
            followUpId: result.follow_Up.followUpId,
            followUpCode: result.follow_Up.followUpCode,
            followUpDate: result.follow_Up.followUpDate,
            baseDocNameId: result.follow_Up.followUpBaseDocname,
            baseDocId: result.follow_Up.baseDocname,
            followUpUserId: result.follow_Up.followUpperson,
            followUpModeId: result.follow_Up.modeofFollowUp,
            followUpNotes: result.follow_Up.followUpNotes,
            statusId: result.follow_Up.followUpStatus,
            nextFollowUpDate: result.follow_Up.nextFollowUpDate,
            nextFollowUpModeId: result.follow_Up.nextmodeoffollowUp,
            nextFollowUpNotes: result.follow_Up.nextFollowUpNotes,
            followUpAssignedId: result.follow_Up.followUpAssigned,
            remainder: this.optionSelected(result.follow_Up.remainder),
            remainderDate: result.follow_Up.remainderDate,
            remarks: result.follow_Up.remarks,
            tags: result.follow_Up.tags,
            createdBy: result.follow_Up.createdBy,
            createdDate: result.follow_Up.createdDate,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.date
          });
          this.FollowUp.controls['followUpDate'].setErrors(null);
          this.FollowUp.controls['nextFollowUpDate'].setErrors(null);
          this.FollowUp.controls['remainderDate'].setErrors(null);
          this.ImageDataArray = result.followUp_Documents;
          this.Followdocument = result.followUp_Documents;
          this.ImageDataArray.forEach((row => {
            this.ImageStore.push(row.documentName);
          }));

        });
    }


    //Document From Document Mapping
    let editPath = "/crm/transaction/followup/edit/" + this.route.snapshot.params["id"];
    let viewPath = "/crm/transaction/followup/view/" + this.route.snapshot.params["id"];
    if(Path !== editPath && Path !== viewPath){
      this.FS.GetAllDocumentMappingByScreenId(12).subscribe(res => {
        if (res) {
          this.Followdocument = res.map((ele:any) => {
            return {
              fUDocumentId: 0,
              followUpId: 0,
              documentId: ele.documentId,
              documentName: '',
              remarks: '',
              createdBy: parseInt(this.userId$),
              createdDate: this.date,
              Isedit: false
            };
          });
          this.Followdocument = [...this.Followdocument];
          this.ImageDataArray = [...this.Followdocument];
        }
        console.log(this.Followdocument)
      });
    }
  }

  ViewMode() {
    var Path = this.router.url;
    if (Path == "/crm/transaction/followup/view/" + this.route.snapshot.params["id"]) {

      this.titile = "View Follow Up";
      this.disablefields = true;
      this.ShowUpdate = false;
      this.Showsave = false;
      this.ShowReset = false;
      this.FS.GetAllFollowUpById(this.route.snapshot.params["id"])
        .subscribe((result: FollowUpCombine) => {

          this.SelectedbaseDocId = result.follow_Up.baseDocNameId;
          this.SelectedDocId = result.follow_Up.baseDocId;
          this.SelectedFollowupId = result.follow_Up.followUpUserId;
          this.SelectedModeFollowupId = result.follow_Up.followUpModeId;
          this.SelectedstatusId = result.follow_Up.statusId;
          this.SelectedNextModeFollowupId = result.follow_Up.nextFollowUpModeId;
          this.SelectedAssignedId = result.follow_Up.followUpAssignedId;

          console.log("result", result);
          //var values = await this.optionSelectedbaseDocNameId(result.follow_Up.baseDocNameId);
          this.optionSelectedEditstatus(result.follow_Up.statusId);
          this.FollowUp.patchValue({
            followUpId: result.follow_Up.followUpId,
            followUpCode: result.follow_Up.followUpCode,
            followUpDate: result.follow_Up.followUpDate,
            baseDocNameId: result.follow_Up.followUpBaseDocname,
            baseDocId: result.follow_Up.baseDocname,
            followUpUserId: result.follow_Up.followUpperson,
            followUpModeId: result.follow_Up.modeofFollowUp,
            followUpNotes: result.follow_Up.followUpNotes,
            statusId: result.follow_Up.followUpStatus,
            nextFollowUpDate: result.follow_Up.nextFollowUpDate,
            nextFollowUpModeId: result.follow_Up.nextmodeoffollowUp,
            nextFollowUpNotes: result.follow_Up.nextFollowUpNotes,
            followUpAssignedId: result.follow_Up.followUpAssigned,
            remainder: this.optionSelected(result.follow_Up.remainder),
            remainderDate: result.follow_Up.remainderDate,
            remarks: result.follow_Up.remarks,
            tags: result.follow_Up.tags,
            createdBy: result.follow_Up.createdBy,
            createdDate: result.follow_Up.createdDate,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.date
          });
          this.FollowUp.controls['followUpDate'].setErrors(null);
          this.FollowUp.controls['nextFollowUpDate'].setErrors(null);
          this.FollowUp.controls['remainderDate'].setErrors(null);
          this.ImageDataArray = result.followUp_Documents;
          this.Followdocument = result.followUp_Documents;

          this.ImageDataArray.forEach((row => {
            this.ImageStore.push(row.documentName);
          }));

        });
    }
  }



  ////////dropdown Edited Values///////////////////////////////


  optionSelected(id: any): number {
    if (id == true) {
      this.remainder = true;
      return 0;
    } else {
      this.remainder = false;
      return 1;
    } 
  }

  optionSelectedbaseDocNameId(id: number): string {
    this.SelectedbaseDocId = id;
    const selectedid = this.BaseDoc.find(
      (item) => item.followupBaseDocId === id
    );

    if (this.SelectedbaseDocId) {
      const selectedDocId = this.SelectedbaseDocId;
      switch (selectedDocId) {
        case 1:
          this.getPcdrop();
          break;
        case 2:
          this.getEnquirydrop();
          break;
        case 3:
          this.getPvdrop();
          break;
        case 4:
          this.getRFQdrop();
          break;
        case 5:
          this.getCustomer();
          break;
        case 6:
          this.getVendor();
          break;
        case 7:
          this.getPQ();
          break;
        default:
          console.log("Default case");
      }
    }
    return selectedid ? selectedid.followupBaseDoc : "";

  }
  optionSelectedfollowUpUserId(id: number): string {
    this.SelectedFollowupId = id;
    const selectedid = this.Employee.find(
      (item) => item.employeeId === id
    );
    return selectedid ? selectedid.employeeName : "";

  }

  optionSelectedfollowUpMode(id: number): string {
    this.SelectedModeFollowupId = id;
    const selectedid = this.ModeofFollowUp.find(
      (item) => item.modeofFollowUpId === id
    );
    return selectedid ? selectedid.modeofFollowUp : "";

  }

  optionSelectedEditstatus(id: number) {

    if (this.SelectedstatusId === 2) {
      // Set validators for mandatory fields when statusId is 1
      this.FollowUp.get('nextFollowUpDate')?.setValidators([Validators.required]);
      this.FollowUp.get('nextFollowUpModeId')?.setValidators([Validators.required]);
      this.FollowUp.get('nextFollowUpNotes')?.setValidators([Validators.required]);
      this.FollowUp.get('followUpAssignedId')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.FollowUp.get('nextFollowUpDate')?.clearValidators();
      this.FollowUp.get('nextFollowUpModeId')?.clearValidators();
      this.FollowUp.get('nextFollowUpNotes')?.clearValidators();
      this.FollowUp.get('followUpAssignedId')?.clearValidators();

      this.FollowUp.get('nextFollowUpDate')?.setValue(null);
      this.FollowUp.get('nextFollowUpModeId')?.setValue(null);
      this.FollowUp.get('nextFollowUpNotes')?.setValue(null);
      this.FollowUp.get('followUpAssignedId')?.setValue(null);
    }

    // Update the validation status
    this.FollowUp.get('nextFollowUpDate')?.updateValueAndValidity();
    this.FollowUp.get('nextFollowUpModeId')?.updateValueAndValidity();
    this.FollowUp.get('nextFollowUpNotes')?.updateValueAndValidity();
    this.FollowUp.get('followUpAssignedId')?.updateValueAndValidity();
  }
  SelectednextFollowUpModeId(id: number): string {
    this.SelectedNextModeFollowupId = id;
    const selectedid = this.ModeofFollowUp.find(
      (item) => item.modeofFollowUpId === id
    );
    return selectedid ? selectedid.modeofFollowUp : "";

  }

  SelectednextAssignedId(id: number): string {
    this.SelectedAssignedId = id;
    const selectedid = this.Employee.find(
      (item) => item.employeeId === id
    );
    return selectedid ? selectedid.employeeName : "";

  }

  optionSelectedbaseDocId(id: number): string {
    let selectedid = null;

    if (this.SelectedbaseDocId) {
      const selectedDocId = this.SelectedbaseDocId;
      switch (selectedDocId) {
        case 1:
          this.SelectedDocId = id;
          selectedid = this.NewDocID.find((item) => item.Id === id);
          return selectedid ? selectedid.code : "";
        case 2:
          this.SelectedDocId = id;
          selectedid = this.NewDocID.find((item) => item.Id === id);
          return selectedid ? selectedid.code : "";

        case 3:
          this.SelectedDocId = id;
          selectedid = this.NewDocID.find((item) => item.Id === id);
          return selectedid ? selectedid.code : "";
        case 4:
          this.SelectedDocId = id;
          selectedid = this.NewDocID.find((item) => item.Id === id);
          return selectedid ? selectedid.code : "";
        case 5:
          this.SelectedDocId = id;
          selectedid = this.NewDocID.find((item) => item.Id === id);
          return selectedid ? selectedid.code : "";
        case 6:
          this.SelectedDocId = id;
          selectedid = this.NewDocID.find((item) => item.Id === id);
          return selectedid ? selectedid.code : "";
        case 7:
          this.SelectedDocId = id;
          selectedid = this.NewDocID.find((item) => item.Id === id);
          return selectedid ? selectedid.code : "";
        default:
          console.log("Default case");
      }
    }
    return selectedid ? selectedid : "";
  }



  Fromanotherscreen() {
    //this.titile = "Follow Up Potential Customer";
    this.route.paramMap.subscribe(params => {
      const param1 = params.get('param1')!;
      const param2 = params.get('param2')!;
      if (param1 != null && param2 != null) {
        this.FollowUp.controls["baseDocNameId"].disable();
        this.FollowUp.controls["baseDocId"].disable();
        this.FollowUp.patchValue({
          baseDocNameId: this.SelectedbaseDoc(parseInt(param1)),
          baseDocId: this.Selectedbase(parseInt(param2))
        });
      }
    });
  }

  Selectedbase(baseDocId: number): string {
    this.SelectedDocId = baseDocId;
    const selected = this.NewDocID.find(
      (item) => item.Id === baseDocId
    );
    return selected ? selected.code : "";
  }

  SelectedbaseDoc(baseDocId: number): string {
    this.SelectedbaseDocId = baseDocId;
    const selected = this.BaseDoc.find(
      (item) => item.followupBaseDocId === baseDocId
    );
    if (this.SelectedbaseDocId) {
      const selectedDocId = this.SelectedbaseDocId;
      switch (selectedDocId) {
        case 1:
          this.getPcdrop();
          this.Listrouter = "/crm/master/potentialcustomerlist"
          break;
        case 2:
          this.getEnquirydrop();
          this.Listrouter = "/crm/transaction/enquirylist"
          break;
        case 3:
          this.getPvdrop();
          this.Listrouter = "/crm/master/potentialvendorlist"
          break;
        case 4:
          this.getRFQdrop();
          this.Listrouter = "/crm/transaction/rfqlist"
          break;
        case 5:
          this.getCustomer();
          this.Listrouter = "/crm/master/customerlist"
          break;
        case 6:
          this.getVendor();
          this.Listrouter = "/crm/master/vendor"
          break;
        case 7:
          this.getPQ();
          this.Listrouter = "/crm/transaction/purchasequotationlist"
          break;
        default:
          console.log("Default case");
      }
    }
    return selected ? selected.followupBaseDoc : "";
  }

  fetchDropDownData() {
    const BaseDoc$ = this.service.getAllFollowupBaseDoc();
    const BaseDocId$ = this.Pvs.getAllActivePotentialCustomer();
    const Employee$ = this.service.getEmployees(this.Livestatus);
    const ModeOffollowUp$ = this.service.getAllCommunication();
    const Followupstatus$ = this.service.getAllFollowupStatus();
    const NextModeOffollowUp$ = this.service.getAllCommunication();
    const Doc$ = this.docs.getDocuments(this.Livestatus);
    const FollowUpAssignedEmployee$ = this.service.getEmployees(this.Livestatus);
    const Enquiry$ = this.Eservice.GetOpenEnquiry();
    const RFQ$ = this.SRFQ.GetAllopenRfq();
    const GetPV$ = this.SPV.getAllActivePotentialVendor();
    const GetCustomer$ = this.Cservice.getAllActiveCustomer();
    const GetVendor$ = this.Vs.VendorGetAllActive();
    const GetPQ$ = this.pQs.PurchaseQuotationGetAllByStatus();




    forkJoin([GetPQ$, GetVendor$, GetCustomer$, GetPV$, RFQ$, Enquiry$, BaseDoc$, BaseDocId$, Employee$, ModeOffollowUp$, Followupstatus$, NextModeOffollowUp$, FollowUpAssignedEmployee$, Doc$]).subscribe({
      next: ([GetPQ, GetVendor, Customer, GetPV, RFQ, Enquiry, BaseDocRes, BaseDocIdres, Employeeres, ModeOffollowUpres, Followupstatusres, NextModeOffollowUpres, FollowUpAssignedEmployeeres, Docres]) => {
        this.BaseDoc = BaseDocRes;
        this.DocID = BaseDocIdres;
        this.Employee = Employeeres;
        this.ModeofFollowUp = ModeOffollowUpres;
        this.Followupstatus = Followupstatusres;
        this.NextModeofFollowUp = NextModeOffollowUpres;
        this.FollowUpAssignedEmployee = FollowUpAssignedEmployeeres;
        this.document = Docres;
        this.enquiry = Enquiry;
        this.RFQlist = RFQ;
        this.Pvlist = GetPV;
        this.Customer = Customer
        this.vendor = GetVendor
        this.Pqlist = GetPQ

        console.log("this.RFQlist", this.RFQlist)
        this.Filters();
        this.Fromanotherscreen();
        this.EditMode();
        this.ViewMode();

        if (!this.edit) {
          this.SelectedFollowupId = parseInt(this.userId$);
          this.SelectedAssignedId = parseInt(this.userId$);
          this.FollowUp.controls["followUpUserId"].setValue(this.optionSelectedfollowUpUserId(parseInt(this.userId$)));
          this.FollowUp.controls["followUpAssignedId"].setValue(this.SelectednextAssignedId(parseInt(this.userId$)));
        }

      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  selectFile(evt: any) {
    if (evt?.target?.files && evt.target.files.length > 0) {
      const files = evt.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

        // Check if the file type is allowed (jpg or png)
        if (['jpg', 'png','jpeg','jfif', 'docx','pdf', 'doc', 'xls', 'xlsx'].includes(fileType)) {
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
          this.service.displayToaster(
            "error",
            "error",
             "Please Choose JPG, PNG,PDF, DOCX,JFIF, DOC, XLS, or XLSX Files."
          );
          this.FollowUpDoc.controls["documentName"].setValue("");
        }

      }
    }
  }
  // show(event: any): void {
  //   let dialogRef = this.dialog.open(this.imagePreview,
  //     { data: this.Filepath+event });  
  // }

  oncancelDoc(data: any, index: any){
    debugger
    if(data?.documentId){
      data.Isedit = false;
      this.Followdocument = [...this.Followdocument];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.isEditDocument = false;
      return;
    } else {
      this.Followdocument = this.Followdocument.filter((_, idx) => idx !== index);
      this.showAddRowDoc = false;
      this.isEditDocument = false;
    }

  }

  EditDoc(data: any, index: any) {
    const updatedDocuments = this.Followdocument.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, Isedit: true };
      }
      return doc;
    });
    this.FollowUpDoc.controls['documentId'].patchValue(this.getSelectedDoc(data.documentId))
    this.showAddRowDoc = true;
    this.isEditDocument = true;
    this.Followdocument = updatedDocuments;
  }

  addRow() {
    if (this.FollowUpDoc.valid) {
      if (this.ImageDetailsArray.length > 0) {
        for (let imageDetail of this.ImageDetailsArray) {
          // Rename the 'name' property to 'imagePath'
          const documentName = imageDetail.name;

          // Check if the object with the same 'imagePath' already exists in ImageDataArray
          const existingImageDataIndex = this.ImageDataArray.findIndex(data => data.documentId === this.SelectedDocumentId);
          //const existarray =  this.ImageDataArray.find(data => data.documentId === documentName);

          // If the object doesn't exist, add it to ImageDataArray
          if (existingImageDataIndex === -1) {
            // Create a new object with the modified property name
            const modifiedImageDetail = { ...imageDetail, documentName };

            const Value = {
              ...this.FollowUpDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              Isedit: false,
              documentId: this.SelectedDocumentId,
              createdBy: 1,
              createdDate: this.date,
            }
            // Push the modified object into ImageDataArray
            this.ImageDataArray.push(Value);
            this.Followdocument = [...this.ImageDataArray]
            this.FollowUpDoc.reset();
            this.showAddRowDoc = false;
          } else {
            // Update the existing image data
            const modifiedImageDetail = { ...imageDetail, documentName };
            this.ImageDataArray[existingImageDataIndex] = {
              ...this.FollowUpDoc.value,
              ...modifiedImageDetail,
              remarks: this.DocRemarks,
              documentId: this.SelectedDocumentId,
              createdBy: 1,
              createdDate: this.date,
            };
            this.FollowUpDoc.reset();
            this.Followdocument = [...this.ImageDataArray];
            this.showAddRowDoc = false;
          }

        }
      } else {
        this.service.displayToaster(
          "error",
          "error",
          "Please choose files."
        );
      }
    } else {
      this.FollowUpDoc.markAllAsTouched();
      this.validateall(this.FollowUpDoc);
    }


  }


  // dateFilter = (date: Date | null): boolean => {
  //   const currentDate = new Date();
  //   return !date || date >= currentDate;
  // };

  Filters() {
    this.filteredBaseDoc = this.FollowUp.get(
      "baseDocNameId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.followupBaseDoc)),
      map((name: any) => (name ? this._filter(name) : this.BaseDoc?.slice()))
    );

    this.filteredFollowUpUserId = this.FollowUp.get(
      "followUpUserId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this._filterEmployee(name) : this.Employee?.slice()))
    );

    this.filteredfollowUpAssignedId = this.FollowUp.get(
      "followUpAssignedId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this._filterassignedEmployee(name) : this.Employee?.slice()))
    );

    this.filteredfollowUpModeId = this.FollowUp.get(
      "followUpModeId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofFollowUp)),
      map((name: any) => (name ? this._filterModeoffollowup(name) : this.ModeofFollowUp?.slice()))
    );

    this.filteredstatusId = this.FollowUp.get(
      "statusId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.followUpStatus)),
      map((name: any) => (name ? this._filterfollowupstatus(name) : this.Followupstatus?.slice()))
    );

    this.filterednextFollowUpModeId = this.FollowUp.get(
      "nextFollowUpModeId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofFollowUp)),
      map((name: any) => (name ? this._filternextFollowUpModeId(name) : this.ModeofFollowUp?.slice()))
    );
    this.filtereddocumentId = this.FollowUpDoc.get(
      "documentId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.documentName)),
      map((name: any) => (name ? this._filternextFollowUpdocId(name) : this.document?.slice()))
    );
  }
  private _filter(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.BaseDoc.filter((invflg) =>
      invflg.followupBaseDoc.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.FollowUp.controls["baseDocNameId"].setValue("");
    }

    return filterresult;
  }

  private _filterbaseDoc(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.NewDocID.filter((invflg) =>
      invflg.code.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.FollowUp.controls["baseDocId"].setValue("");
    }

    return filterresult;
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
      this.FollowUp.controls["documentId"].setValue("");
    }

    return filterresult;
  }

  private _filterEmployee(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Employee.filter((invflg) =>
      invflg.employeeName.toLowerCase().includes(filterValue)
    );


    if (filterresult.length === 0) {
      this.FollowUp.controls["followUpUserId"].setValue("");
    }

    return filterresult;
  }

  private _filterassignedEmployee(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Employee.filter((invflg) =>
      invflg.employeeName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.FollowUp.controls["followUpAssignedId"].setValue("");
    }

    return filterresult;
  }
  private _filterModeoffollowup(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.ModeofFollowUp.filter((invflg) =>
      invflg.modeofFollowUp.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.FollowUp.controls["followUpModeId"].setValue("");
    }

    return filterresult;
  }
  private _filternextFollowUpModeId(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.ModeofFollowUp.filter((invflg) =>
      invflg.modeofFollowUp.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.FollowUp.controls["nextFollowUpModeId"].setValue("");
    }

    return filterresult;
  }
  private _filterfollowupstatus(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Followupstatus.filter((invflg) =>
      invflg.followUpStatus.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.FollowUp.controls["statusId"].setValue("");
    }

    return filterresult;
  }
  optionSelecteddocumentId(event: MatAutocompleteSelectedEvent): void {
    const selectedDocID = this.document.find(
      (Stype) => Stype.documentName === event.option.viewValue
    );
    if (selectedDocID) {
      const selectedDocId = selectedDocID.documentId;
      this.SelectedDocumentId = selectedDocId;
      this.DocRemarks = selectedDocID.remarks;

      this.FollowUpDoc.patchValue({
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
        this.FollowUpDoc.get("documentId")?.setValue("");
      }

    }

  }
  optionSelectedBaseDocId(event: MatAutocompleteSelectedEvent): void {
    const selectedDoc = this.NewDocID.find(
      (Stype) => Stype.code === event.option.viewValue
    );
    if (selectedDoc) {
      const selectedDocId = selectedDoc.Id;
      this.SelectedDocId = selectedDocId;
    }
  }
  optionSelectedstatusId(event: MatAutocompleteSelectedEvent): void {
    const selectedstatus = this.Followupstatus.find(
      (Stype) => Stype.followUpStatus === event.option.viewValue
    );
    if (selectedstatus) {
      const selectedstatusId = selectedstatus.followUpStatusId;
      this.SelectedstatusId = selectedstatusId;
    }

    if (this.SelectedstatusId === 2) {
      // Set validators for mandatory fields when statusId is 1
      this.FollowUp.get('nextFollowUpDate')?.setValidators([Validators.required]);
      this.FollowUp.get('nextFollowUpModeId')?.setValidators([Validators.required]);
      this.FollowUp.get('nextFollowUpNotes')?.setValidators([Validators.required]);
      this.FollowUp.get('followUpAssignedId')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.FollowUp.get('nextFollowUpDate')?.clearValidators();
      this.FollowUp.get('nextFollowUpModeId')?.clearValidators();
      this.FollowUp.get('nextFollowUpNotes')?.clearValidators();
      this.FollowUp.get('followUpAssignedId')?.clearValidators();

      this.FollowUp.get('nextFollowUpDate')?.setValue(null);
      this.FollowUp.get('nextFollowUpModeId')?.setValue(null);
      this.FollowUp.get('nextFollowUpNotes')?.setValue(null);
      this.FollowUp.get('followUpAssignedId')?.setValue(null);
    }

    // Update the validation status
    this.FollowUp.get('nextFollowUpDate')?.updateValueAndValidity();
    this.FollowUp.get('nextFollowUpModeId')?.updateValueAndValidity();
    this.FollowUp.get('nextFollowUpNotes')?.updateValueAndValidity();
    this.FollowUp.get('followUpAssignedId')?.updateValueAndValidity();

  }
  optionSelectedFollowUpUserId(event: MatAutocompleteSelectedEvent): void {
    const selectedfollowup = this.Employee.find(
      (Stype) => Stype.employeeName === event.option.viewValue
    );
    if (selectedfollowup) {
      const selectedFollowupId = selectedfollowup.employeeId;
      this.SelectedFollowupId = selectedFollowupId;
    }
  }

  optionSelectedfollowUpAssignedId(event: MatAutocompleteSelectedEvent): void {
    const selectedfollowup = this.Employee.find(
      (Stype) => Stype.employeeName === event.option.viewValue
    );
    if (selectedfollowup) {
      const selectedFollowupId = selectedfollowup.employeeId;
      this.SelectedAssignedId = selectedFollowupId;
    }
  }

  optionSelectednextFollowUpModeId(event: MatAutocompleteSelectedEvent): void {
    const selectedModefollowup = this.ModeofFollowUp.find(
      (Stype) => Stype.modeofFollowUp === event.option.viewValue
    );
    if (selectedModefollowup) {
      const selectedFollowupId = selectedModefollowup.modeofFollowUpId;
      this.SelectedNextModeFollowupId = selectedFollowupId;
    }
  }

  optionSelectedfollowUpModeId(event: MatAutocompleteSelectedEvent): void {
    const selectedModefollowup = this.ModeofFollowUp.find(
      (Stype) => Stype.modeofFollowUp === event.option.viewValue
    );
    if (selectedModefollowup) {
      const selectedFollowupId = selectedModefollowup.modeofFollowUpId;
      this.SelectedModeFollowupId = selectedFollowupId;
    }
  }


  optionSelectedBaseDoc(event: MatAutocompleteSelectedEvent): void {
    this.FollowUp.controls["baseDocId"].setValue("");
    const selectedDoc = this.BaseDoc.find(
      (Stype) => Stype.followupBaseDoc === event.option.viewValue
    );
    if (selectedDoc) {
      const selectedDocId = selectedDoc.followupBaseDocId;
      this.SelectedbaseDocId = selectedDocId;
    }
    if (selectedDoc) {
      const selectedDocId = selectedDoc.followupBaseDocId;
      switch (selectedDocId) {
        case 1:
          this.getPcdrop();
          break;
        case 2:
          this.getEnquirydrop();
          break;
        case 3:
          this.getPvdrop();
          break;
        case 4:
          this.getRFQdrop();
          break;
        case 5:
          this.getCustomer();
          break;
        case 6:
          this.getVendor();
          break;
        case 7:
          this.getPQ();
          break;
        default:
          console.log("Default case");
      }
    }

  }

  getPcdrop() {

    const newPotentialcustomer = this.DocID.map(res => {
      return {
        ...res,
        Id: res.potentialCustomerId,
        code: res.potentialCustomerCode
      };
    });
    this.NewDocID = [...newPotentialcustomer];
    this.filteredBaseDocId = this.FollowUp.get(
      "baseDocId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterbaseDoc(name) : this.NewDocID?.slice()))
    );
  }

  getEnquirydrop() {
    const newEnquiry = this.enquiry.map(res => {
      return {
        ...res,
        Id: res.enquiryId,
        code: res.enquiryNumber
      };
    });
    this.NewDocID = [...newEnquiry];
    this.filteredBaseDocId = this.FollowUp.get(
      "baseDocId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterbaseDoc(name) : this.NewDocID?.slice()))
    );
  }
  getRFQdrop() {
    const newRFQ = this.RFQlist.map(res => {
      return {
        ...res,
        Id: res.rfqId,
        code: res.rfqNumber
      };
    });
    this.NewDocID = [...newRFQ];
    this.filteredBaseDocId = this.FollowUp.get(
      "baseDocId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterbaseDoc(name) : this.NewDocID?.slice()))
    );
  }
  getPvdrop() {
    const newPv = this.Pvlist.map(res => {
      return {
        ...res,
        Id: res.potentialVendorId,
        code: res.potentialVendorCode
      };
    });
    this.NewDocID = [...newPv];
    this.filteredBaseDocId = this.FollowUp.get(
      "baseDocId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterbaseDoc(name) : this.NewDocID?.slice()))
    );
  }
  getCustomer() {
    const newCus = this.Customer.map(res => {
      return {
        ...res,
        Id: res.customerId,
        code: res.customerCode
      };
    });
    this.NewDocID = [...newCus];
    this.filteredBaseDocId = this.FollowUp.get(
      "baseDocId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterbaseDoc(name) : this.NewDocID?.slice()))
    );
  }
  getVendor() {
    const newven = this.vendor.map(res => {
      return {
        ...res,
        Id: res.vendorId,
        code: res.vendorCode
      };
    });
    this.NewDocID = [...newven];
    this.filteredBaseDocId = this.FollowUp.get(
      "baseDocId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterbaseDoc(name) : this.NewDocID?.slice()))
    );
  }
  getPQ() {
    const newPq = this.Pqlist.map(res => {
      return {
        ...res,
        Id: res.purchaseQuoteId,
        code: res.pqNumber
      };
    });
    this.NewDocID = [...newPq];
    this.filteredBaseDocId = this.FollowUp.get(
      "baseDocId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this._filterbaseDoc(name) : this.NewDocID?.slice()))
    );
  }
  FollowUpSubmit() {
    if (this.FollowUp.valid) {
      var nextFollowUpDate = null;
      var remainderDate = null;
      const followUpDate = this.formatDate(this.FollowUp.controls['followUpDate'].value);
      if (this.FollowUp.controls['nextFollowUpDate'].value != null) {
        nextFollowUpDate = this.formatDate(this.FollowUp.controls['nextFollowUpDate'].value);
      }
      if (this.FollowUp.controls['remainderDate'].value) {
        remainderDate = this.formatDate(this.FollowUp.controls['remainderDate'].value);
      }
      const Followup = {
        ...this.FollowUp.value,
        followUpCode: this.FollowUp.controls["followUpCode"].value,
        followUpDate: followUpDate,
        nextFollowUpDate: nextFollowUpDate != null ? nextFollowUpDate : null,
        remainderDate: remainderDate != null ? remainderDate : null,
        remainder: this.remainder,
        baseDocNameId: this.SelectedbaseDocId,
        baseDocId: this.SelectedDocId,
        followUpUserId: this.SelectedFollowupId,
        followUpModeId: this.SelectedModeFollowupId,
        statusId: this.SelectedstatusId,
        nextFollowUpModeId: this.SelectedNextModeFollowupId,
        followUpAssignedId: this.SelectedAssignedId,

      }
      const FollowUpPayLoad: FollowUpCombine = {
        follow_Up: Followup,
        followUp_Documents: this.ImageDataArray,
        followupId: 0
      }

      console.log("FollowUpPayLoad", FollowUpPayLoad)

      this.FS
        .CreateFollowUp(FollowUpPayLoad).subscribe({
          next: (res) => {

            if (!this.edit) {
              const parms ={
                MenuId:51,
                currentUser:this.userId$,
                activityName:"Creation",
                id:res.follow_Up.followUpId,
                code:res.follow_Up.followUpCode
              }

              this.Ns.TriggerNotification(parms).subscribe((res=>{

              }));
              this.service.displayToaster(
                "success",
                "Success",
                "FollowUp Added Sucessfully.."
              );
              this.router.navigate([this.Listrouter]);
            } else {
              const parms ={
                MenuId:51,
                currentUser:this.userId$,
                activityName:"Updation",
                id:res.follow_Up.followUpId,
                code:res.follow_Up.followUpCode
              }
              this.Ns.TriggerNotification(parms).subscribe((res=>{
                console.log(res);
              }));
              this.service.displayToaster(
                "success",
                "Success",
                "FollowUp Updated Sucessfully.."
              );
              const messages: notificationpopup[] = [
                { userId: 1, message: 'This is the first notification',menuUrl:'menu',id:1,isMail:1,isPopup:1,isMessage:1,autoId:1,activityName:'action' },
                
              ];
              this.router.navigate([this.Listrouter]);
            }
            const formData = new FormData();
            this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
            this.Fs.FileUpload(formData).subscribe({
              next: (res) => {
                
              },
              error: (error) => {
                var ErrorHandle = this.ErrorHandling.handleApiError(error)
                this.commonService.displayToaster(
                  "error",
                  "Error",
                  ErrorHandle
                );
              }
            });
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
          // error: (error) => {
          //   console.log("error", error)
          //   var ErrorHandle = this.ErrorHandling.handleApiError(error)
          //   this.service.displayToaster(
          //     "error",
          //     "Error",
          //     ErrorHandle
          //   );
          // },
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
      this.FollowUp.markAllAsTouched();
      this.validateall(this.FollowUp);
    }
  }
  formatDate(date: Date): string {
    // Get the current time
    const currentTime = new Date();
    // Format the date and concatenate with the current time
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    const formattedTime = this.datePipe.transform(currentTime, 'HH:mm:ss');
    return formattedDate + 'T' + formattedTime;
  }

  getSelectedDoc(selectedId: number): string {
    const selectedDoc = this.document.find(
      (item) => item.documentId === selectedId
    );
    return selectedDoc ? selectedDoc.documentName : "";
  }
  optionSelectedremainder(event: any) {
    if (event.value == "0") {
      this.remainder = true;

    } else {
      this.remainder = false;
    }

    if (event.value == "0") {
      // Set validators for mandatory fields when statusId is 1
      this.FollowUp.get('remainderDate')?.setValidators([Validators.required]);
    } else {
      // Remove validators if statusId is not 2
      this.FollowUp.get('remainderDate')?.clearValidators();


      this.FollowUp.get('remainderDate')?.setValue(null);
    }
    // Update the validation status 
    this.FollowUp.get('remainderDate')?.updateValueAndValidity();


  }



  DeleteImage(item: any, i: number) {
    if (this.showAddRowDoc != true) {
      if (i !== -1) {
        this.ImageDataArray = [...this.Followdocument];
        this.ImageDataArray.splice(i, 1);
        this.Followdocument = [...this.ImageDataArray]
        this.showAddRowDoc = false;
      }
    }
  }

  Download(file:any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }
  Downloads(){

  }

  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.FollowUpDoc.controls['documentId'].reset();
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRowDoc) {
      const Value = {
        ...this.FollowUpDoc.value,
        documentName: "",
        remarks: this.DocRemarks,
        documentId: this.SelectedDocumentId,
        createdBy: 1,
        createdDate: this.date,
        Isedit: true
      }
      //this.ImageDataArray.push(Value);
      this.Followdocument = [Value, ...this.Followdocument];
      this.showAddRowDoc = true;
    }

    //this.showtable = false;
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Reset() {
    var Path = this.router.url;
    if (Path == "/crm/transaction/followup/edit/" + this.route.snapshot.params["id"]) {
      this.edit = true;
      this.titile = "Update Follow Up";
      this.disablefields = false;
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
      this.FS.GetAllFollowUpById(this.route.snapshot.params["id"])
        .subscribe(async (result: FollowUpCombine) => {
          this.SelectedbaseDocId = result.follow_Up.baseDocNameId;
          this.SelectedDocId = result.follow_Up.baseDocId;
          this.SelectedFollowupId = result.follow_Up.followUpUserId;
          this.SelectedModeFollowupId = result.follow_Up.followUpModeId;
          this.SelectedstatusId = result.follow_Up.statusId;
          this.SelectedNextModeFollowupId = result.follow_Up.nextFollowUpModeId;
          this.SelectedAssignedId = result.follow_Up.followUpAssignedId;

          console.log("result", result);
          var values = await this.optionSelectedbaseDocNameId(result.follow_Up.baseDocNameId);
          this.optionSelectedEditstatus(result.follow_Up.statusId);
          this.FollowUp.patchValue({
            followUpId: result.follow_Up.followUpId,
            followUpCode: result.follow_Up.followUpCode,
            followUpDate: result.follow_Up.followUpDate,
            baseDocNameId: result.follow_Up.followUpBaseDocname,
            baseDocId: result.follow_Up.baseDocname,
            followUpUserId: result.follow_Up.followUpperson,
            followUpModeId: result.follow_Up.modeofFollowUp,
            followUpNotes: result.follow_Up.followUpNotes,
            statusId: result.follow_Up.followUpStatus,
            nextFollowUpDate: result.follow_Up.nextFollowUpDate,
            nextFollowUpModeId: result.follow_Up.nextmodeoffollowUp,
            nextFollowUpNotes: result.follow_Up.nextFollowUpNotes,
            followUpAssignedId: result.follow_Up.followUpAssigned,
            remainder: this.optionSelected(result.follow_Up.remainder),
            remainderDate: result.follow_Up.remainderDate,
            remarks: result.follow_Up.remarks,
            tags: result.follow_Up.tags,
            createdBy: result.follow_Up.createdBy,
            createdDate: result.follow_Up.createdDate,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.date
          });
          this.FollowUp.controls['followUpDate'].setErrors(null);
          this.FollowUp.controls['nextFollowUpDate'].setErrors(null);
          this.FollowUp.controls['remainderDate'].setErrors(null);
          this.ImageDataArray = result.followUp_Documents;
          this.Followdocument = result.followUp_Documents;
          this.ImageDataArray.forEach((row => {
            this.ImageStore.push(row.documentName);
          }));

        });
    } else {
      this.FollowUp.reset();
      this.IntializeForm();
      this.InitializeDoc();
      this.ImageDataArray = [];
      this.ImageDetailsArray = [];
      this.ImageStore = [];
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
  FBEmpty() {
    this.SelectedDocId = null;
    this.FollowUp.controls['baseDocId'].setValue('');
    this.NewDocID = [];
  }

 
  MindateFilter = (date: Date | null): boolean => {
    // Get the current date and set the time to the start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    // Get the enquiry date from the form control
    const enquiryDateValue = this.FollowUp.controls['followUpDate'].value;
  
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

  MaxdateFilter = (date: Date | null): boolean => {
    // Get the current date and set the time to the start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    // Get the enquiry date from the form control
    const enquiryDateValue = this.FollowUp.controls['nextFollowUpDate'].value;
    // Ensure enquiryDateValue is a valid Date object
    const enquiryDate = enquiryDateValue ? new Date(enquiryDateValue) : null;
  
    // If enquiryDate is not valid, allow all dates
    if (!enquiryDate) {
      return true;
    }
  
    // Set the time of enquiryDate to the start of the day for a fair comparison
    enquiryDate.setHours(0, 0, 0, 0);
  
    // Return true if date is null or date is greater than or equal to enquiryDate
    return !date || date < enquiryDate;
  };



  show(event: any): void {
    var filePath=this.Filepath+event
      const fileExtension = filePath.split('.').pop()?.toLowerCase();

      if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jfif') {
        this.dialog.open(this.imagePreview, { data: filePath }); 
      } else {
        window.open(filePath, '_blank');
      }
  }
  downloadExcelFile(file:any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }
  getFileExtension(filePath: string): string {
    const extension = filePath.split('.').pop();
    return extension ? extension.toLowerCase() : '';
  }

  isAllowedExtension(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return this.allowedExtensions.includes(extension || '');
  }
}
