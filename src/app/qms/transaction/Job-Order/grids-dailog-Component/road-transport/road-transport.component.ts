import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AddVendorContractInfoComponent } from '../../../vendor-contract/add-vendor-contract-info/add-vendor-contract-info.component';
import { LineitemService } from '../../../../../crm/master/lineitemcategory/lineitem.service';
import { CommonService } from 'src/app/services/common.service';
import { TrailerTypeService } from 'src/app/crm/master/trailer-type/trailer-type.service';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { JORoadModeModal } from '../../job-order.modals';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import Swal from 'sweetalert2';
import { DateValidatorService } from 'src/app/qms/date-validator';


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
  selector: 'app-road-transport',
  templateUrl: './road-transport.component.html',
  styleUrls: ['./road-transport.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RoadTransportComponent {
  filteredTransportTypeControl: Observable<any[]>;
  filteredTrailerTypeControl: Observable<any[]>;
  filteredStage: Observable<any[]>;
  filteredStatus: Observable<any[]>;

  transportList: any[] = [];
  Livestatus = 1;
  trailerTypeList: any[] = [];
  JobOrderStageList: any[] = [];
  JobOrderStatusList: any[] = [];
  RoadTransport:JORoadModeModal = new JORoadModeModal();
  jobstage: any;
  jobstatus: any;

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, private regionService: RegionService,
    @Inject(MAT_DIALOG_DATA) public data: any, public RoadTransportDailog: MatDialogRef<RoadTransportComponent>,
    private commonService: CommonService, private trailerTypeService: TrailerTypeService,private jobtypeService: JobtypeserviceService,
  ) { }

  ngOnInit(): void {
    this.GetAllJobStage();
    this.getAllStatusType();
    this.GetTransport();
    this.GetTrailerType();
    this.matFilter();
    console.log(this.data);
    this.jobstage=this.data.stage;
    this.jobstatus=this.data.status;
     this.RoadTransportForm.get('stageControl')?.disable();
     this.RoadTransportForm.get('statusControl')?.disable();
     this.RoadTransportForm.get('stageControl')?.patchValue(this.jobstage);
     this.RoadTransportForm.get('statusControl')?.patchValue(this.jobstatus);

    if (this.data?.list) {
      if (this.data && this.data.list) {
        this.data.list["rowNumber"] = this.data.rowNumber;
      }
      if (this.data?.view) {
        this.RoadTransportForm.disable();
      }

      this.RoadTransportForm.patchValue({
        transportTrackingNumberControl: this.data?.list?.trackingNumber,
        transportTypeControl: this.data?.list?.transportType,
        trailerTypeControl: this.data?.list?.trailerTypeName,
        ETDControl: this.data?.list?.etd,
        ETAControl: this.data?.list?.eta,
        stageControl: this.data?.list?.jobStage,
        statusControl: this.data?.list?.jobStageStatus,
      })


    }
  }

  RoadTransportForm = new FormGroup({
    transportTrackingNumberControl: new FormControl('', [Validators.required,Validators.maxLength(25)]),
    transportTypeControl: new FormControl('', [Validators.required, this.TransportTypeValidator.bind(this)]),
    trailerTypeControl: new FormControl('', [Validators.required, this.TrailerTypeValidator.bind(this)]),
    ETDControl: new FormControl(''),
    ETAControl: new FormControl(''),
    stageControl: new FormControl('', [ this.StageValidator.bind(this)]),
    statusControl: new FormControl('', [ this.StatusValidator.bind(this)]),
    // stageControl: new FormControl({value:'',disabled:true}, [ this.StageValidator.bind(this)]),
    // statusControl: new FormControl({value:'',disabled:true}, [ this.StatusValidator.bind(this)]),
  },{
    validators: DateValidatorService.dateRangeValidator('ETDControl', 'ETAControl')
  })

  get f() {
    return this.RoadTransportForm.controls;
  }

  TransportTypeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.transportList?.some((option: any) => option?.transportType === value);
      return isValid ? null : { invalidOption: true };
    }
    return null
  }
  TrailerTypeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.trailerTypeList?.some((option: any) => option?.trailerTypeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null
  }
  StageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.JobOrderStageList?.some((option: any) => option?.jobStage === value);
      return isValid ? null : { invalidOption: true };
    }
    return null
  }
  StatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.JobOrderStatusList?.some((option: any) => option?.jobStageStatus === value);
      return isValid ? null : { invalidOption: true };
    }
    return null
  }
  
  matFilter() {
    this.filteredTransportTypeControl = this.RoadTransportForm.controls.transportTypeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredTransportTypeControl(value || '')),
    );
    this.filteredTrailerTypeControl = this.RoadTransportForm.controls.trailerTypeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredTrailerTypeControl(value || '')),
    );
    this.filteredStage = this.RoadTransportForm.controls.stageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredStage(value || '')),
    );
    this.filteredStatus = this.RoadTransportForm.controls.statusControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredStatus(value || '')),
    );

  }
  private _filteredTransportTypeControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.transportList?.filter((option: any) => option?.transportType.toLowerCase().includes(filterValue));
  }
  private _filteredTrailerTypeControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.trailerTypeList?.filter((option: any) => option?.trailerTypeName.toLowerCase().includes(filterValue));
  }

  private _filteredStage(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStageList?.filter((option: any) => option?.jobStage.toLowerCase().includes(filterValue));
  }
  private _filteredStatus(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStatusList?.filter((option: any) => option?.jobStageStatus.toLowerCase().includes(filterValue));
  }

  triggerValidation() {
    Object.keys(this.RoadTransportForm.controls).forEach(field => {
      const control = this.RoadTransportForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  getLineItem(event: any) {
    this.matFilter();
  }
  getLineItemId(event: any) {
    this.matFilter();
  }


  GetTransport() {
    this.commonService.getAllTransportType().subscribe(res => {
      this.transportList = res;
      this.matFilter();
    });
  }
  GetTrailerType() {
    this.trailerTypeService.GetAllTrailerType(this.Livestatus).subscribe(res => {
      this.trailerTypeList = res;
      this.matFilter();
    });
  }

  GetAllJobStage() {
    this.jobtypeService.GetAllJobStage().subscribe((result: any) => {
      this.JobOrderStageList = result;
      this.matFilter();
    });
  }

  getAllStatusType() {
    this.jobtypeService.getAllStatusType().subscribe(result => {
      this.JobOrderStatusList = result;
      this.matFilter();
    });
  }


  save() {
    this.triggerValidation();
    console.log(this.data)
    if (this.RoadTransportForm.invalid) {
      this.RoadTransportForm.markAllAsTouched();
    } else {

      this.RoadTransport.joRoadModeId = this.data?.list?.joAirModeId ? this.data.list?.joAirModeId : 0,
      this.RoadTransport.jobOrderId = +this.data?.jobOrderId ? +this.data?.jobOrderId : 0,
      this.RoadTransport.trackingNumber = this.RoadTransportForm.controls.transportTrackingNumberControl.value || '' ,
      this.RoadTransport.transportTypeId = this.getTType(this.RoadTransportForm.controls.transportTypeControl.value) || null ,
      this.RoadTransport.trailerTypeId = this.getTrailerType(this.RoadTransportForm.controls.trailerTypeControl.value) || null ,
      this.RoadTransport.trailerTypeName = this.RoadTransportForm.controls.trailerTypeControl.value || null ,
      this.RoadTransport.transportType = this.RoadTransportForm.controls.transportTypeControl.value || null ,
      this.RoadTransport.etd = this.normalizeDateToUTC(this.RoadTransportForm.controls.ETDControl.value) || null ,
      this.RoadTransport.eta = this.normalizeDateToUTC(this.RoadTransportForm.controls.ETAControl.value) || null ,
      this.RoadTransport.stageId = this.getStage(this.RoadTransportForm.controls.stageControl.value) || null ,
      this.RoadTransport.statusId = this.getStatus(this.RoadTransportForm.controls.statusControl.value) || null ,
      this.RoadTransport.jobStage = this.RoadTransportForm.controls.stageControl.value || null ,
      this.RoadTransport.jobStageStatus = this.RoadTransportForm.controls.statusControl.value || null ,
      this.RoadTransport.createdBy = this.data?.createdBy,
      this.RoadTransport.createdDate= this.data?.list?.createdDate,
      this.RoadTransport.updatedBy = this.data?.createdBy,
      this.RoadTransport.updatedDate = this.normalizeDateToUTC(new Date())
      this.RoadTransport.rowNumber = this.data?.rowNumber,
      this.RoadTransport.joRoadStatusHistoryModal = this.data?.list?.joRoadStatusHistoryModal

      if (this.data?.overAllList?.length !== 0) {
        const isDuplicate = this.data?.overAllList?.some(
          (item: any) => item.trackingNumber === this.RoadTransport.trackingNumber && item?.rowNumber !== this.RoadTransport.rowNumber
        );

        if (isDuplicate) {
          Swal.fire({
            icon: 'info',
            title: 'Duplicate',
            text: 'Duplicate entry detected for Tracking Number',
            showConfirmButton: true,
          });
          this.RoadTransportForm.controls.transportTrackingNumberControl.reset();
          return;
        } else {
          this.RoadTransportDailog.close(this.RoadTransport);
        }
      } else {
        this.RoadTransportDailog.close(this.RoadTransport);
      }


    }
  }

  Close() {
    this.RoadTransportDailog.close()
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }

  getTType(value: any) {
    let option = this.transportList.find(option => option?.transportType == value)
    return option?.transportTypeId;
  }
  getTrailerType(value: any) {
    let option = this.trailerTypeList.find(option => option?.trailerTypeName == value)
    return option?.trailerTypeId;
  }
  getStage(value: any) {
    let option = this.JobOrderStageList.find(option => option?.jobStage == value)
    return option?.jtypeStageId;
  }
  getStatus(value: any) {
    let option = this.JobOrderStatusList.find(option => option?.jobStageStatus == value)
    return option?.jobStageStatusId;
  }

}

