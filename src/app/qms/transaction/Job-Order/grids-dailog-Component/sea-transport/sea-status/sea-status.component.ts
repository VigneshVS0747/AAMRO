import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, startWith, map } from 'rxjs';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { AddJobOrderComponent } from '../../../add-job-order/add-job-order.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonService } from 'src/app/services/common.service';

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
  selector: 'app-sea-status',
  templateUrl: './sea-status.component.html',
  styleUrls: ['./sea-status.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SeaStatusComponent {
  userId$: any;
  pageSize = 10;
  skip = 0;
  JOSeaStatusList:any[]=[];

  filteredJobOrderStageControl: Observable<any[]>;
  filteredJobOrderStatusControl: Observable<any[]>;
  myFormGroup: FormGroup;
  JobOrderStageList: any[]=[];
  JobOrderStatusList: any[]=[];
  preferenceOrder:any;


  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>, private regionService: RegionService,
    private UserIdstore: Store<{ app: AppState }>,public dialog: MatDialog,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private jobtypeService: JobtypeserviceService, public AirStatusDailog: MatDialogRef<AddJobOrderComponent>,
  ) { 
    this.myFormGroup = this.fb.group({
      jobOrderStageControl: ['', [Validators.required, this.StageValidator.bind(this)]],
      dateControl: ['', Validators.required],
      jobOrderStatusControl: [
        { value: '', disabled: true }, 
        [Validators.required, this.StatusValidator.bind(this)]
      ],
      remarksControl: ['', [Validators.maxLength(500)]]
    });
   }
  ngOnInit(): void {
    this.GetAllJobStage();
    this.getAllStatusType();
    this.matFilter();
    console.log(this.data)
    if(this.data?.list){
      this.JOSeaStatusList = this.data?.list;
    }
    this.GetUserId();
  }


  matFilter(){
    this.filteredJobOrderStageControl = this.myFormGroup.controls['jobOrderStageControl']?.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredJobOrderStageControl(value || '')),
    );
    this.filteredJobOrderStatusControl = this.myFormGroup.controls['jobOrderStatusControl']?.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredJobOrderStatusControl(value || '')),
    );
  }

  private _filteredJobOrderStageControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStageList.filter((option: any) => option?.jobStage.toLowerCase().includes(filterValue));
  }
  private _filteredJobOrderStatusControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStatusList.filter((option: any) => option?.jobStageStatus.toLowerCase().includes(filterValue));
  }

  StageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.JobOrderStageList?.some((option: any) => option?.jobStage === value);
    return isValid ? null : { invalidOption: true };
  }
  StatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.JobOrderStatusList?.some((option: any) => option?.jobStageStatus === value);
    return isValid ? null : { invalidOption: true };
  }
  

  onchangeEvent(event: any) {
    this.matFilter();
  }

  onStageChangeEvent(event: any){
    let value = event?.option?.value ? event?.option?.value : event;
    let selectedStage = this.JobOrderStageList.find(option => option?.jobStage === value);
    if(selectedStage){
      this.myFormGroup.controls['jobOrderStatusControl'].patchValue(selectedStage?.jobStageStatus)
      this.preferenceOrder = selectedStage?.preferenceOrder;
    }
    this.matFilter();
  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  GetAllJobStage() {
    this.JobOrderStageList = this.data?.joStageandStatus;;
    this.matFilter();
    // this.jobtypeService.GetAllJobStage().subscribe((result: any) => {
    //   this.JobOrderStageList = result;
    //   this.matFilter();
    // });
  }

  getAllStatusType() {
      this.JobOrderStatusList = this.data?.joStageandStatus;
      this.matFilter();
    // this.jobtypeService.getAllStatusType().subscribe(result => {
    //   this.JobOrderStatusList = result;
    //   this.matFilter();
    // });
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  save(){
    if(this.myFormGroup.invalid){
      this.myFormGroup.markAllAsTouched();
      
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });

      return;
    } else {
      let payload = {
        joRoadStatusHisId: this.data?.list?.joRoadStatusHisId || 0,
        jobOrderId: this.data?.jobOrderId ? this.data?.jobOrderId : 0,
        joRoadModeId: this.data?.joRoadModeId ? this.data?.joRoadModeId : 0,
        date: this.normalizeDateToUTC(this.myFormGroup.controls['dateControl'].value),
        stageId: this.getStage(this.myFormGroup.controls['jobOrderStageControl'].value),
        statusId: this.getStatus(this.myFormGroup.controls['jobOrderStatusControl'].value),
        jobStage: this.myFormGroup.controls['jobOrderStageControl'].value,
        jobStageStatus: this.myFormGroup.controls['jobOrderStatusControl'].value,
        remarks: this.myFormGroup.controls['remarksControl'].value,
        createdBy: this.data?.createdBy,
        createdDate: new Date(),
        updatedBy: this.data?.createdBy,
        updatedDate: new Date(),
        preferenceOrder: this.preferenceOrder
      }

      this.JOSeaStatusList = [payload, ...this.JOSeaStatusList]
      this.myFormGroup.reset();
    }
  }

  close(){
    this.AirStatusDailog.close(this.JOSeaStatusList)
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }

  getStage(value: any) {
    let option = this.JobOrderStageList.find(option => option?.jobStage == value)
    return option?.jtypeStageId;
  }
  getStatus(value: any) {
    let option = this.JobOrderStatusList.find(option => option?.jobStageStatus == value)
    return option?.statusId;
  }
}
