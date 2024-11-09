import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { JobOrderExpenseBookingDialogComponent } from '../job-order-expense-booking-dialog/job-order-expense-booking-dialog.component';
import { JOCBModelContainer, JOCostBookingDetail, JOCostBookingDocument, JOCostBookingGeneral } from '../job-order-expense-booking.model';
import { JoebDocumentDialogComponent } from '../joeb-document-dialog/joeb-document-dialog.component';
import { RegionService } from 'src/app/services/qms/region.service';
import { JobOrderDetails, JOLineItemModal } from '../../Job-Order/job-order.modals';
import { Observable, map, startWith } from 'rxjs';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { JobOrderExpenseBookingService } from '../job-order-expense-booking.service';
import { JoebLineitemDialogComponent } from '../joeb-lineitem-dialog/joeb-lineitem-dialog.component';
import { aggregateBy, AggregateResult } from '@progress/kendo-data-query';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { DefaultSettings, groupCompany } from 'src/app/Models/crm/master/Dropdowns';
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
  selector: 'app-job-order-expense-booking-cuv',
  templateUrl: './job-order-expense-booking-cuv.component.html',
  styleUrls: ['./job-order-expense-booking-cuv.component.css', '../../../../ums/ums.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class JobOrderExpenseBookingCuvComponent {
  viewMode: boolean = false;
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  disablefields: boolean = false;
  jobOrderexpenseForm: FormGroup
  date = new Date();
  JOCostBookingDetail: JOCostBookingDetail[] = [];
  JOCostBookingDocument: JOCostBookingDocument[] = [];
  joList: any[] = [];
  filteredJobOrderOptions$: Observable<any[]>;
  jobOrderId: any;
  jodetails: any;
  joebGeneral: JOCostBookingGeneral;
  jocbValuebyId: JOCBModelContainer;
  gereralEdit: boolean;
  joCostBookingId: number;
  hidebutton: boolean;

  //Kendo grid
  public aggregates: any[] = [
    { field: "totalInCompanyCurrency", aggregate: "sum" },
  ];
  public total: AggregateResult;
  joLineItemvalue: JOLineItemModal[];
  Edit: boolean = false;
  ImageDetailsArray: any[] = [];
  invalidDetails: any[] = [];
  fromJO: boolean = false;
  datereadonly: boolean = false;
  joCostBookingList: JOCostBookingGeneral[];
  JOmatchvalue: JOCostBookingGeneral | undefined;
  destCountryId: any;
  groupCompanyList: groupCompany[];
  defaultSettingsValues: DefaultSettings[];
  groupCompanyId: any;
  companyName: string | undefined;
  selectedLineItems: any[];

  selectedKeys: any[] = [];
  JOCostBookingDetailfomJO: JOCostBookingDetail[];
  joSelect: boolean = false;
  JOCostBookingDetailPartiallyBooked: JOCostBookingDetail[];
  alreadyBooked: boolean;


  constructor(private router: Router,
    public dialog: MatDialog,
    public dialogdoc: MatDialog,
    public dialogline: MatDialog,
    private Fs: FileuploadService,
    private fb: FormBuilder,
    private ErrorHandling: ErrorhandlingService,
    private UserIdstore: Store<{ app: AppState }>,
    private regionService: RegionService,
    private commonService: CommonService,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService,
    private cdr: ChangeDetectorRef,
    private errorHandler: ApiErrorHandlerService
  ) { }

  ngOnInit() {
    debugger
    this.GetUserId();
    this.iniForm();
    // #region from JO
    this.jobOrderId = this.jobOrderExpenseBookingService.joId;

    this.jobOrderExpenseBookingService.GetAllJOCostBooking().subscribe(res => {
      this.joCostBookingList = res;
      this.JOmatchvalue = this.joCostBookingList.find(x => x.jobOrderId == this.jobOrderId);

      if (this.joCostBookingList.length != 0 && this.JOmatchvalue) {

        this.joCostBookingId = this.JOmatchvalue.joCostBookingId;
        this.gereralEdit = true;
        this.Edit = true;
        this.fromJO = true;
        this.getJOCBbyId();
        this.GetAllJobOrderInEdit();

      } else {

        if (this.jobOrderId && this.jobOrderId != 0) {
          this.Edit = true;
          this.fromJO = true;
          this.gereralEdit = false;
          this.regionService.GetAllJobOrder().subscribe((res: any) => {
            this.joList = res;
            this.JobOrderFun();
            let joValue = this.joList.find(item => item.jobOrderId === this.jobOrderId);
            this.jobOrderexpenseForm.controls['jobOrderId'].setValue(joValue);
            this.GetJobOrderById(this.jobOrderId);
            //this.patchLineItemNew();
            this.patchLineItemFromJO();
          });
          return;
        }
      }
    });

    if (this.jobOrderExpenseBookingService.isEdit == true && this.jobOrderExpenseBookingService.isView == false) {
      this.joCostBookingId = this.jobOrderExpenseBookingService.itemId;
      this.gereralEdit = true;
      this.Edit = true;
      this.viewMode = false;
      this.getJOCBbyId();
      this.GetAllJobOrderInEdit();
    } else if (this.jobOrderExpenseBookingService.isEdit == false && this.jobOrderExpenseBookingService.isView == true) {
      this.joCostBookingId = this.jobOrderExpenseBookingService.itemId;
      this.gereralEdit = false;
      this.Edit = true;
      this.viewMode = true;
      this.disablefields = true;
      this.jobOrderexpenseForm.controls['isDraft'].disable();
      this.getJOCBbyId();
      this.GetAllJobOrderInEdit();
    }
    else {
      this.GetAllJobOrder();
    }

    this.calculateAggregates();
  }
  // #region calculate Aggregates
  private calculateAggregates(): void {
    debugger
    const value = aggregateBy(this.JOCostBookingDetail, this.aggregates);
    this.total = value;
  }

  getJOCBbyId() {
    debugger
    this.jobOrderExpenseBookingService.GetAllByIdJOCostBookingId(this.joCostBookingId).subscribe(res => {
      this.jocbValuebyId = res;
      this.jobOrderId = this.jocbValuebyId.jocbGeneral.jobOrderId
      this.JOCostBookingDetail = this.jocbValuebyId.jocbDetail;
      this.JOCostBookingDetail = [...this.JOCostBookingDetail]
      this.JOCostBookingDetailPartiallyBooked = this.JOCostBookingDetail.filter(x => x.partiallyBooked == true);
      console.log('JOCostBookingDetailPartiallyBooked', this.JOCostBookingDetailPartiallyBooked);
      this.GetJobOrderById(this.jobOrderId);
      this.patchLineItemNew();
      this.jobOrderexpenseForm.patchValue(this.jocbValuebyId.jocbGeneral);
      this.jobOrderexpenseForm.controls['jobOrderId'].setValue(this.jocbValuebyId.jocbGeneral);
      const isChecked = this.jobOrderexpenseForm.controls['isDraft'].value
      if (isChecked) {
        this.hidebutton = false;
      } else {
        this.hidebutton = true;
        this.datereadonly = true;
        this.jobOrderexpenseForm.controls['isDraft'].disable();
      }
      this.calculateAggregates();
    });
  }

  dateFilter1 = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return !date || date <= currentDate;
  };
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  //#region Form
  iniForm() {
    this.jobOrderexpenseForm = this.fb.group({
      joCostBookingId: [0],
      costBookingDate: [, Validators.required],
      jobOrderId: ['', Validators.required],
      referenceNumber: [''],
      customerName: [''],
      jobTypeName: [''],
      salesOwner: [''],
      jobOwnerName: [''],
      jobStage: [''],
      jobStageStatus: [''],
      overallCIFValue: [''],
      cifCurrencyName: [''],
      isDraft: [true],
      remarks: [''],
      totalinCompanyCurrency: [0.00],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });
    this.jobOrderexpenseForm.controls['costBookingDate'].setValue(this.date);
  }
  // #region GetAllJobOrder
  GetAllJobOrderInEdit() {
    this.regionService.GetAllJobOrder().subscribe((res: any) => {
      this.joList = res;
      this.JobOrderFun();
    });
  }
  GetAllJobOrder() {
    this.regionService.GetJOIsExpenseBooking().subscribe((res: any) => {
      this.joList = res;
      this.JobOrderFun();
    });
  }
  JobOrderFun() {
    debugger
    this.filteredJobOrderOptions$ = this.jobOrderexpenseForm.controls['jobOrderId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobOrderNumber)),
      map((name: any) => (name ? this.filteredJobOrderOptions(name) : this.joList?.slice()))
    );
  }
  private filteredJobOrderOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.joList.filter((option: any) => option.jobOrderNumber.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataJobOrder();
  }
  NoDataJobOrder(): any {
    this.jobOrderexpenseForm.controls['jobOrderId'].setValue('');
    return this.joList;
  }
  displayJobOrderListLabelFn(data: any): string {
    return data && data.jobOrderNumber ? data.jobOrderNumber : '';
  }
 
  JobOrderSelectedoption(data: any) {
    this.joSelect = true;
    let selectedValue = data.option.value;
    this.jobOrderId = selectedValue.jobOrderId;
    this.JOCostBookingDetail = [];
    this.GetJobOrderById(this.jobOrderId);
    this.patchLineItemFromJO();
    
  }
  emptytjo(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.jobOrderexpenseForm.reset();
      this.jobOrderId = null;
    }
  }

  //#region Load Line Item from JO
  patchLineItemFromJO() {
    this.jobOrderExpenseBookingService.GetJOCostBookingLineItemDetails(this.jobOrderId).subscribe(res => {
      this.JOCostBookingDetail = res;

      // this.JOCostBookingDetail.forEach(item => {
      //   item.selected = true;
      // });
      // this.selectedKeys = this.JOCostBookingDetail.map(item => item.lineItemName);
      // this.selectedLineItems = this.JOCostBookingDetail;
      // console.log('JOCostBookingDetail', this.JOCostBookingDetail);

      // const event = {
      //   selectedRows: this.JOCostBookingDetail.map(item => ({ dataItem: item })),
      //   deselectedRows: []
      // };
      // this.onSelectionChange(event);
      this.calculateAggregates();
    });
  }
  patchLineItemNew() {
    debugger
    this.jobOrderExpenseBookingService.GetJOCostBookingLineItemDetails(this.jobOrderId).subscribe(res => {
      this.JOCostBookingDetailfomJO = res;
      console.log('JOCostBookingDetailfomJO:', this.JOCostBookingDetailfomJO);


      this.selectedKeys = this.JOCostBookingDetail.map(item => item.lineItemName);
      this.selectedLineItems = this.JOCostBookingDetail;
      console.log('JOCostBookingDetail', this.JOCostBookingDetail);

      const event = {
        selectedRows: this.JOCostBookingDetail.map(item => ({ dataItem: item })),
        deselectedRows: []
      };
      this.onSelectionChangeEdit(event);

      if (this.JOCostBookingDetailfomJO) {
        const existingLineItemNames = new Set(this.JOCostBookingDetail.map(item => item.lineItemName));

        this.JOCostBookingDetailfomJO.forEach(itemFromJO => {
          if (!existingLineItemNames.has(itemFromJO.lineItemName)) {
            this.JOCostBookingDetail.push(itemFromJO);
          }
        });
        this.JOCostBookingDetail = [...this.JOCostBookingDetail];

        this.selectedLineItems = this.selectedLineItems?.filter(option => option?.joCostBookingDetailId != 0)
        console.log('Updated JOCostBookingDetail:', this.JOCostBookingDetail);
        console.log(' this.selectedLineItems', this.selectedLineItems);
      }

      this.calculateAggregates();
    });
  }
  patchLineItemOnFirst() {
    debugger
    this.jobOrderExpenseBookingService.GetJOCostBookingLineItemDetails(this.jobOrderId).subscribe(res => {
      this.JOCostBookingDetailfomJO = res;
      console.log('JOCostBookingDetailfomJO:', this.JOCostBookingDetailfomJO);

      if (this.JOCostBookingDetailfomJO) {
        const existingLineItemNames = new Set(this.JOCostBookingDetail.map(item => item.lineItemName));

        this.JOCostBookingDetailfomJO.forEach(itemFromJO => {
          if (!existingLineItemNames.has(itemFromJO.lineItemName)) {
            this.JOCostBookingDetail.push(itemFromJO);
          }
        });
        //this.JOCostBookingDetail = [...this.JOCostBookingDetail];
        this.selectedLineItems = this.selectedLineItems?.filter(option => option?.selected == true)
        console.log('Updated JOCostBookingDetail:', this.JOCostBookingDetail);
      }

      this.calculateAggregates();
    });
  }


  // #region GetJobOrder by id
  GetJobOrderById(id: number) {
    this.regionService.GetJobOrderById(id).subscribe((res: any) => {
      this.jodetails = res;
      console.log('this.jodetails', this.jodetails);

      this.destCountryId = this.jodetails.joGeneral.destCountryId;

      this.jobOrderexpenseForm.controls['customerName'].setValue(this.jodetails.joGeneral.customerName);
      this.jobOrderexpenseForm.controls['jobTypeName'].setValue(this.jodetails.joGeneral.jobTypeName);
      this.jobOrderexpenseForm.controls['salesOwner'].setValue(this.jodetails.joGeneral.salesOwner);
      this.jobOrderexpenseForm.controls['jobOwnerName'].setValue(this.jodetails.joGeneral.jobOwnerName);
      this.jobOrderexpenseForm.controls['jobStage'].setValue(this.jodetails.joGeneral.jobStage);
      this.jobOrderexpenseForm.controls['jobStageStatus'].setValue(this.jodetails.joGeneral.jobStageStatus);
      this.jobOrderexpenseForm.controls['overallCIFValue'].setValue(this.jodetails.joGeneral.overallCIFValue);
      this.jobOrderexpenseForm.controls['cifCurrencyName'].setValue(this.jodetails.joGeneral.cifCurrencyName);
    });
  }
  onDraftChange(event: any) {
    debugger
    const isChecked = event.checked;
    if (isChecked) {
      this.hidebutton = false;
    } else {
      this.hidebutton = true;
    }
  }
  // #region General save
  onSaveGeneral(value: any) {
    debugger
    if (value === 'Save') {
      this.jobOrderexpenseForm.controls['isDraft'].setValue(false);
    }
    else if (value === 'Draft') {
      this.jobOrderexpenseForm.controls['isDraft'].setValue(true);
    }
    let totalCompanyCurrency = this.total?.['totalInCompanyCurrency']?.sum ? this.total?.['totalInCompanyCurrency']?.sum : 0.0000
    this.jobOrderexpenseForm.controls['totalinCompanyCurrency']?.setValue(totalCompanyCurrency);

    const validDateValue1 = this.jobOrderexpenseForm?.get('costBookingDate')?.value;
    if (validDateValue1) {
      let adjustedDate = new Date(validDateValue1);
      // Adjust timezone to match your local timezone
      const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
      adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
      this.jobOrderexpenseForm.get('costBookingDate')?.setValue(adjustedDate);
    }

    this.jobOrderexpenseForm.controls['costBookingDate'].setErrors(null);

    if (this.jobOrderexpenseForm.valid) {
      this.joebGeneral = this.jobOrderexpenseForm.value;
      this.joebGeneral.jobOrderId = this.jobOrderId

      if (this.selectedLineItems == undefined) {
        this.selectedLineItems = [];
      }

      let updatedJOCostBookingDetail = this.selectedLineItems.map(option => {
        return {
          ...option,
          taxPer: String(option.taxPer)
        };
      });

      let i = 0;
      this.invalidDetails = [];

      this.selectedLineItems.forEach(jocbDetail => {
        if (
          jocbDetail.serviceInId == null || jocbDetail.serviceInId == 0 ||
          jocbDetail.groupCompanyId == null || jocbDetail.groupCompanyId == 0 ||
          jocbDetail.regionId == null || jocbDetail.regionId == 0 ||

          jocbDetail.currencyId == null || jocbDetail.currencyId == 0 ||
          jocbDetail.calculationParameterId == null || jocbDetail.calculationParameterId == 0 ||
          jocbDetail.calculationTypeId == null || jocbDetail.calculationTypeId == 0 ||
          jocbDetail.taxId == null || jocbDetail.taxId == 0 ||
          jocbDetail.rate == null || jocbDetail.rate == 0 ||
          jocbDetail.quantity == null || jocbDetail.quantity == 0 ||

          jocbDetail.taxValue == null ||
          jocbDetail.exchangeRate == null || jocbDetail.exchangeRate == 0
        ) {
          i++;
          this.invalidDetails.push(jocbDetail.lineItemName);
        }
      });

      if (i > 0) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Please fill the details for the selected following line items: " + this.invalidDetails.join(", ") + ".",
          showConfirmButton: true,
        });
        this.invalidDetails = [];
        return;
      }

      this.JOCostBookingDetail.forEach(item => {

        if (item.joCostBookingDetailId != 0) {
          let value = updatedJOCostBookingDetail.find(x => x.joCostBookingDetailId == item.joCostBookingDetailId)
          if (!value) {
            item.selected = false;
            updatedJOCostBookingDetail.push(item);
          }
        }
      });

      console.log('Updated JOCostBookingDetail:', updatedJOCostBookingDetail);

      if (this.joSelect) {
        updatedJOCostBookingDetail.map(x => {
          x.createdBy = parseInt(this.userId$);
          x.createdDate = this.date;  
            x.updatedBy = parseInt(this.userId$);
            x.updatedDate = this.date;  
          return x; 
        });
      } else {
        updatedJOCostBookingDetail.map(x => {
          if (x.joCostBookingDetailId === 0) {
            x.createdBy = parseInt(this.userId$);
            x.createdDate = this.date;  
            x.updatedBy = parseInt(this.userId$); 
            x.updatedDate =  this.date; 
          }
          return x;
        });
      }

      const ModelContainer: JOCBModelContainer = {
        jocbGeneral: this.joebGeneral,
        jocbDetail: updatedJOCostBookingDetail
      }
     
      console.log(ModelContainer)
      if (ModelContainer.jocbGeneral.joCostBookingId == 0) {
        this.jobOrderExpenseBookingService.JOCostBookingSave(ModelContainer).subscribe({
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
            this.jobOrderExpenseBookingService.setJOId(0);
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
          }
          // error: (error) => {
          //   console.log(error)
          //   var ErrorHandle = this.ErrorHandling.handleApiError(error)
          //   this.commonService.displayToaster(
          //     "error",
          //     "Error",
          //     ErrorHandle
          //   );
          // },
        });
      }
      else {
        this.jobOrderExpenseBookingService.JOCostBookingSave(ModelContainer).subscribe({
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
          }
        });
      }
    }
    else {
      const invalidControls = this.findInvalidControls();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
      this.jobOrderexpenseForm.markAllAsTouched();
      this.validateall(this.jobOrderexpenseForm);

    }
  }
  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.jobOrderexpenseForm.controls;
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
  // #region reset General

  resetGeneral() {
    this.selectedLineItems = [];
    this.selectedKeys = [];
    if (this.gereralEdit) {
      this.getJOCBbyId();
      this.jobOrderExpenseBookingService.setJOId(0);
      return;
    } else {
      this.jobOrderexpenseForm.reset();
      this.JOCostBookingDetail = []
      this.fromJO = false;
      this.Edit = false;
      this.jobOrderId = null;
      this.jobOrderExpenseBookingService.setJOId(0);
      this.ngOnInit();
    }
  }

  returnToList() {
    if (this.fromJO) {
      this.router.navigate(["qms/transaction/job-order-list"]);
      this.jobOrderExpenseBookingService.setJOId(0);
      return;
    }
    this.router.navigate(["qms/transaction/job-order-expense-booking-list"]);
    this.fromJO = false;
    this.jobOrderExpenseBookingService.setJOId(0);

  }
  // #region Details dialog window
  openDialog() {
    debugger
    if (!this.jobOrderId) {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Job Order",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    let CIFValue = this.jobOrderexpenseForm.controls['overallCIFValue']?.value;
    let CIFCurrencyName = this.jobOrderexpenseForm.controls['cifCurrencyName']?.value;
    let costBookingDate = this.jobOrderexpenseForm.controls['costBookingDate'].value

    const dialogRef = this.dialog.open(JobOrderExpenseBookingDialogComponent, {
      data: {
        CIFValue: CIFValue,
        CIFCurrencyName: CIFCurrencyName,
        costBookingDate: costBookingDate,
        destCountryId: this.destCountryId,
        JOCostBookingDetail: this.JOCostBookingDetail,
        jobOrderId: this.jobOrderId
      },
      height: '700px',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result != null) {
       // this.JOCostBookingDetail.push(result);
        result.selected = false;
        this.JOCostBookingDetail = [...this.JOCostBookingDetail,result];
        const event = {
          selectedRows: this.JOCostBookingDetail.map(item => ({ dataItem: item })),
          deselectedRows: []
        };
        this.onSelectionChangeEdit(event);
        this.calculateAggregates();

        //  let changedvalue= this.selectedLineItems.find(x=>x.lineItemName==result.lineItemName)

        //  if(changedvalue){
        //  let rowIndex= this.selectedLineItems.findIndex(result);
        //  this.selectedLineItems.splice(rowIndex, 1);
        //  this.selectedLineItems.splice(rowIndex,0,result)
        //  }
      }

    });
  }
  // #region View 
  onviewDetails(data: any, event: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(JobOrderExpenseBookingDialogComponent, {
      data: {
        joebdata: data, mode: 'View',
        destCountryId: this.destCountryId,
        jobOrderId: this.jobOrderId,
        costBookingDate: this.jobOrderexpenseForm.controls['costBookingDate'].value,
      }, height: '700px', disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

      }
    });

  }
  // #region Edit
  onEditDetails(data: any, event: any) {
    debugger
    event.stopPropagation();
    let CIFValue = this.jobOrderexpenseForm.controls['overallCIFValue']?.value;
    let CIFCurrencyName = this.jobOrderexpenseForm.controls['cifCurrencyName']?.value;

    const dialogRef = this.dialog.open(JobOrderExpenseBookingDialogComponent, {
      data: {
        destCountryId: this.destCountryId, JOCostBookingDetail: this.JOCostBookingDetail, jobOrderId: this.jobOrderId,
        joebdata: data, mode: 'Edit', CIFValue: CIFValue, CIFCurrencyName: CIFCurrencyName,
        costBookingDate: this.jobOrderexpenseForm.controls['costBookingDate'].value
      }, height: '700px', disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result != null) {

        const rowIndex = this.JOCostBookingDetail.findIndex(item => item.joLineitemId === data.joLineitemId);
        if (rowIndex !== -1) {
          this.JOCostBookingDetail.splice(rowIndex, 1);
          this.JOCostBookingDetail.splice(rowIndex, 0, result);
          this.JOCostBookingDetail = [...this.JOCostBookingDetail];
        }
        //const rowIndex = this.JOCostBookingDetail.indexOf(data);
      
        if (this.selectedLineItems) {
          let changedvalue = this.selectedLineItems.find(x => x.lineItemName == result.lineItemName)
          if (changedvalue) {
              let index = this.selectedLineItems.indexOf(data);
              this.selectedLineItems.splice(index, 1);
              result.selected = true;
              this.selectedLineItems.splice(index, 0, result)
          }
        }
      }
      this.calculateAggregates();
    });
  }

  // #region delete
  onDeleteDetails(data: any, event: any) {
    event.stopPropagation();
    const rowIndex = this.JOCostBookingDetail.indexOf(data);
    this.JOCostBookingDetail.splice(rowIndex, 1);
    this.JOCostBookingDetail = [...this.JOCostBookingDetail];
    if (this.selectedLineItems) {
      const rowIndex1 = this.selectedLineItems.indexOf(data);
      this.selectedLineItems.splice(rowIndex1, 1);
    }

    this.calculateAggregates();

  }


  // #region document

  document(data: any,event:any) {
    debugger
    event.stopPropagation();
    const dialogRef = this.dialogdoc.open(JoebDocumentDialogComponent, {
      data: {
        viewMode: this.viewMode,
        document: data.jocbDocument
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result != null) {
        data.jocbDocument = result.docs;
        if (result.images) {
          this.ImageDetailsArray = [...result.images]
        }
      }
    });
  }
  // #region line Item
  lineItem(data: any ,event:any) {
    event.stopPropagation();
    let lineItemId = data.joLineitemId
    let lineItemName = data.lineItemName
    const dialogRef = this.dialogline.open(JoebLineitemDialogComponent, {
      data: {
        lineItemId: lineItemId, lineItemName: lineItemName, jobOrderId: this.jobOrderId
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {

      }
    });
  }

  // public onSelectionChangeOld(event: any): void {
  //   debugger

  //   if (!this.selectedLineItems) {
  //     this.selectedLineItems = [];
  //   }


  //   if (event.selectedRows.length > 0) {
  //     event.selectedRows?.forEach((row: any) => {
  //       const selectedLineItem = row.dataItem;
  //       if (this.selectedLineItems.indexOf(selectedLineItem) === -1) {
  //         selectedLineItem.selected = true;
  //         this.selectedLineItems.push(selectedLineItem);
  //       }
  //     });
  //   }

  //   if (event.deselectedRows.length > 0) {
  //     event.deselectedRows?.forEach((row: any) => {
  //       const deselectedLineItem = row.dataItem;
  //       const index = this.selectedLineItems.indexOf(deselectedLineItem);

  //         if (index !== -1) {
  //           this.selectedLineItems.splice(index, 1);
  //         }
  //     });
  //   }

  //   const selectedItem = event.selectedRows.map((row: any) => row.dataItem.lineItemName);

  //   // Check if the item is already selected
  //   selectedItem.forEach((item: any) => {
  //     if (!this.selectedLineItems.includes(item)) {
  //       this.selectedKeys.push(item);
  //     } else {
  //       this.selectedKeys = this.selectedKeys.filter(key => key !== item);
  //     }
  //   });

  // }


  //chackValue: any
  // public onSelectionChange(event: any): void {
  //   debugger

  //   // console.log(event?.deselectedRows)
  //   // event.deselectedRows.forEach((deselectedRow: any) => {
  //   //   this.chackValue = deselectedRow.dataItem;
  //   // })

  //   // if(this.chackValue?.joCostBookingDetailId === 0){
  //   //   if (!this.selectedLineItems) {
  //   //     this.selectedLineItems = [];
  //   //   }


  //     if (event.selectedRows.length > 0) {
  //       event.selectedRows?.forEach((row: any) => {
  //         const selectedLineItem = row.dataItem;
  //         if (this.selectedLineItems.indexOf(selectedLineItem) === -1) {
  //           selectedLineItem.selected = true;
  //           this.selectedLineItems.push(selectedLineItem);
  //         }
  //       });
  //     }

  //     if (event.deselectedRows.length > 0) {
  //       event.deselectedRows?.forEach((row: any) => {
  //         const deselectedLineItem = row.dataItem;
  //         const index = this.selectedLineItems.indexOf(deselectedLineItem);

  //         if (index !== -1) {
  //               this.selectedLineItems.splice(index, 1);
  //             }

  //         // if (deselectedLineItem.joCostBookingDetailId) {
  //         //   alert('selected already');
  //         //   if (index !== -1) {
  //         //     this.selectedLineItems.splice(index, 1);
  //         //   }
  //         //   // deselectedLineItem.selected = true;
  //         //   // this.selectedLineItems.push(deselectedLineItem);

  //         //   const event = {
  //         //     selectedRows: this.JOCostBookingDetail.map(item => ({ dataItem: item })),
  //         //     deselectedRows: []
  //         //   };

  //         //   if (event.selectedRows.length > 0) {
  //         //     event.selectedRows?.forEach((row: any) => {
  //         //       const selectedItem1 = row.dataItem;
  //         //       if (this.selectedLineItems.indexOf(selectedItem1) === -1) {
  //         //         selectedItem1.selected = true;
  //         //         this.selectedLineItems.push(selectedItem1);
  //         //       }
  //         //     });
  //         //   }
  //         //   const selectedItem1 = event.selectedRows.map((row: any) => row.dataItem.lineItemName);

  //         //   // Check if the item is already selected
  //         //   selectedItem1.forEach((item: any) => {
  //         //     if (!this.selectedLineItems.includes(item)) {
  //         //       this.selectedKeys.push(item);
  //         //     } else {
  //         //       this.selectedKeys = this.selectedKeys.filter(key => key !== item);
  //         //     }
  //         //   });


  //         // } else {
  //         //   if (index !== -1) {
  //         //     this.selectedLineItems.splice(index, 1);
  //         //   }
  //         // }

  //       });
  //     }
  //     const selectedItem = event.selectedRows.map((row: any) => row.dataItem.lineItemName);

  //     // Check if the item is already selected
  //     selectedItem.forEach((item: any) => {
  //       if (!this.selectedLineItems.includes(item)) {
  //         this.selectedKeys.push(item);
  //       } else {
  //         this.selectedKeys = this.selectedKeys.filter(key => key !== item);
  //       }
  //     });

  //   //  else {

  //   // }

  // }

  public onSelectionChange(event: any): void {
    if (!this.selectedLineItems) {
      this.selectedLineItems = [];
    }

    if (event.selectedRows.length > 0) {
      event.selectedRows.forEach((row: any) => {
        const selectedLineItem = row.dataItem;
        if (selectedLineItem.joCostBookingDetailId === 0 || selectedLineItem.joCostBookingDetailId === null) {
          if (this.selectedLineItems.indexOf(selectedLineItem) === -1) {
            selectedLineItem.selected = true;
            this.selectedLineItems.push(selectedLineItem);
          }
        }
      });
    }

    if (event.deselectedRows.length > 0) {
      event.deselectedRows.forEach((row: any) => {
        const deselectedLineItem = row.dataItem;

        if (deselectedLineItem.joCostBookingDetailId !== 0 && deselectedLineItem.joCostBookingDetailId !== null) {
          Swal.fire({
            icon: "info",
            title: "Info!",
            text: "Can't deselect an already expense booked Line Item.",
            showConfirmButton: false,
            timer: 2000,
          });
          event.selectedRows.push(row);
        } else {
          const index = this.selectedLineItems.indexOf(deselectedLineItem);
          if (index !== -1) {
            this.selectedLineItems.splice(index, 1);
            deselectedLineItem.selected = false;
            if (this.joSelect) {
              this.patchLineItemOnFirst();
            }
          }
        }
      });
    }
    this.selectedKeys = this.selectedLineItems.map(item => item.lineItemName);
  }


  public onSelectionChangeEdit(event: any): void {
    if (!this.selectedLineItems) {
      this.selectedLineItems = [];
    }


    if (event.selectedRows.length > 0) {
      event.selectedRows?.forEach((row: any) => {
        const selectedLineItem = row.dataItem;
        if (this.selectedLineItems.indexOf(selectedLineItem) === -1) {
          if (selectedLineItem.selected == true) {
            this.selectedLineItems.push(selectedLineItem);
          }

        }
      });
    }
    console.log(' this.selectedLineItems', this.selectedLineItems);
  }
  // #region Partially Booked
  onPartiallyBookedChange(dataItem: any) {
    debugger
    let partiallyBookedvalue = null
    if (dataItem.joCostBookingDetailId != 0) {
      partiallyBookedvalue = this.JOCostBookingDetailPartiallyBooked.find(x => x.joCostBookingDetailId == dataItem.joCostBookingDetailId)
    }
    if (partiallyBookedvalue == null || partiallyBookedvalue == undefined) {
      this.alreadyBooked = false;
    } else {
      this.alreadyBooked = true;
    }

    if (dataItem.joCostBookingDetailId != 0 && dataItem.partiallyBooked == true && this.alreadyBooked == false) {
      dataItem.partiallyBooked = null;
      setTimeout(() => {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "Can't select an already revenue booked Line Item.",
          showConfirmButton: true,
        });
        dataItem.partiallyBooked = false;
        this.JOCostBookingDetail = [...dataItem];
        this.cdr.detectChanges();
      }, 0);
    } else if (dataItem.joCostBookingDetailId != 0 && dataItem.partiallyBooked == false && this.alreadyBooked == true) {
      dataItem.partiallyBooked = false;
      // this.JOCostBookingDetail = [...dataItem];

      const index = this.JOCostBookingDetail.findIndex(item => item.joCostBookingDetailId === dataItem.joCostBookingDetailId);
      if (index !== -1) {
          this.JOCostBookingDetail[index] = { ...dataItem };
      }

      this.cdr.detectChanges();
    } else if (dataItem.joCostBookingDetailId == 0 && dataItem.partiallyBooked == false && this.alreadyBooked == false) {
      dataItem.partiallyBooked = false;
      //this.JOCostBookingDetail = [...dataItem];

      const index = this.JOCostBookingDetail.findIndex(item => item.joCostBookingDetailId === dataItem.joCostBookingDetailId);
      if (index !== -1) {
          this.JOCostBookingDetail[index] = { ...dataItem };
      }
      
      this.cdr.detectChanges();
    } else {
      dataItem.partiallyBooked = true;
      //this.JOCostBookingDetail = [...dataItem];

      const index = this.JOCostBookingDetail.findIndex(item => item.joCostBookingDetailId === dataItem.joCostBookingDetailId);
      if (index !== -1) {
          this.JOCostBookingDetail[index] = { ...dataItem };
      }
      
      this.cdr.detectChanges();
    }

  }

}
