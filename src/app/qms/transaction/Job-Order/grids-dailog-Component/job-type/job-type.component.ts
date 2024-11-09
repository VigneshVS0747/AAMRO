import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map, debounceTime, forkJoin } from 'rxjs';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AddVendorContractInfoComponent } from '../../../vendor-contract/add-vendor-contract-info/add-vendor-contract-info.component';
import { LineitemService } from '../../../../../crm/master/lineitemcategory/lineitem.service';
import { PartmasterService } from 'src/app/crm/master/PartMaster/partmaster.service';
import { HscodeService } from 'src/app/crm/master/hscode/hscode.service';
import { JOPartDetailModal } from '../../job-order.modals';
import Swal from 'sweetalert2';
import { decimalValidator } from 'src/app/qms/date-validator';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-job-type',
  templateUrl: './job-type.component.html',
  styleUrls: ['./job-type.component.css']
})
export class JobTypeComponent {
  filteredpartNumberControl: Observable<any[]>;
  filteredHSCodeDestinationControl: Observable<any[]>;
  filteredHSCodeOriginControl: Observable<any[]>;
  filteredStage: Observable<any[]>;
  filteredStatus: Observable<any[]>;

  Livestatus = 1;
  PartMaster: any[] = [];
  hsCodesOriginList: any[] = [];
  hsCodesDestList: any[] = [];
  JTDetails: JOPartDetailModal = new JOPartDetailModal();

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, 
    private regionService: RegionService,@Inject(MAT_DIALOG_DATA) public data: any,
    public JobTypeDailog: MatDialogRef<JobTypeComponent>,
    private partService: PartmasterService, private hscodeSvc: HscodeService,private commonService: CommonService,
  ) { }

  ngOnInit(): void {

    this.GetAllPartMaster();
    this.getHSCodeItems();
    this.matFilter();
    console.log(this.data)

    if (this.data?.list) {
      if (this.data && this.data.list) {
        this.data.list["rowNumber"] = this.data.rowNumber;
      }
      if (this.data?.view) {
        this.JTForm.disable();
      }
      setTimeout(()=>{
        this.JTForm.patchValue({
          partNumberControl: this.data?.list?.partNumber,
          partDescriptionControl: this.data?.list?.partName,
          HSCodeDestinationControl: this.data?.list?.hsDestination,
          HSCodeOriginControl: this.data?.list?.hsOrigin,
          partCIFValueControl: this.data?.list?.partCIFValue,
          dutyControl: this.data?.list?.dutypercent,
          dutyValueControl: this.data?.list?.dutyValue,
          additionalTaxControl: this.data?.list?.additionalTaxPercent,
          additionalTaxValueControl: this.data?.list?.additionalTaxValue,
          ECCNNumberControl: this.data?.list?.eccnNumber,
          quantityControl: this.data?.list?.quantity,
          totalNetWeightControl: this.data?.list?.netWeight,
        });
      },700)

      this.getPartDes(this.data?.list?.partNumber);
      this.calculateDutyValue();
      this.calculateTaxValue();
    }

    this.JTForm.get('partCIFValueControl')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.calculateDutyValue();
      this.calculateTaxValue();
    });

    this.JTForm.get('dutyControl')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.calculateDutyValue();
    });

    this.JTForm.get('additionalTaxControl')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.calculateTaxValue();
    });


    this.matFilter();
  }

  JTForm = new FormGroup({
    partNumberControl: new FormControl('', [Validators.required, this.PartNumberValidator.bind(this)]),
    partDescriptionControl: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]),
    HSCodeDestinationControl: new FormControl('', [Validators.required, this.HSCodeDestinationValidator.bind(this)]),
    HSCodeOriginControl: new FormControl('', [this.HSCodeOriginValidator.bind(this)]),
    partCIFValueControl: new FormControl('', [Validators.required, decimalValidator(14, 2)]),
    dutyControl: new FormControl('', [Validators.required, decimalValidator(6, 2)]),
    dutyValueControl: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    additionalTaxControl: new FormControl('', [Validators.required]),
    additionalTaxValueControl: new FormControl('', [Validators.required]),
    ECCNNumberControl: new FormControl('',[Validators.maxLength(25)]),
    quantityControl: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    totalNetWeightControl: new FormControl('', [Validators.required, decimalValidator(6, 2)]),
  })

  get f() {
    return this.JTForm.controls;
  }

  addTax(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
      if (value === '') {
        value = '0';
      }
    }
    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (!regex.test(value)) {
      value = input.value.slice(0, -1);
    }
    const splitValue = value.split('.');
    if (splitValue[0].length > 14) {
      splitValue[0] = splitValue[0].slice(0, 14);
      value = splitValue.join('.');
    }

    // if (parseFloat(value) > 100) {
    //   value = '100';
    // }
  
    input.value = value;
    this.JTForm.controls.additionalTaxControl.setValue(input.value);
  }

  additionalTaxValue(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
      if (value === '') {
        value = '0';
      }
    }
    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (!regex.test(value)) {
      value = input.value.slice(0, -1);
    }
    const splitValue = value.split('.');
    if (splitValue[0].length > 14) {
      splitValue[0] = splitValue[0].slice(0, 14);
      value = splitValue.join('.');
    }
  
    input.value = value;
    this.JTForm.controls.additionalTaxValueControl.setValue(input.value);
  }

  // Method to trim negative values
  trimNegativeValue(event: any, controlName: keyof typeof this.JTForm.controls): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
      if (value === '') {
        value = '0';
      }
    }

    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (!regex.test(value)) {
      value = input.value.slice(0, -1);
    }

    const splitValue = value.split('.');
    if (splitValue[0].length > 14) {
      splitValue[0] = splitValue[0].slice(0, 14);
      value = splitValue.join('.');
    }

    input.value = value;
    this.JTForm.controls[controlName].setValue(value, { emitEvent: false });
  }


  PartNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.PartMaster?.some((option: any) => option?.partNumber === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  HSCodeDestinationValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.hsCodesDestList?.some((option: any) => option?.hsCode === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  HSCodeOriginValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.hsCodesOriginList?.some((option: any) => option?.hsCode === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  matFilter() {
    this.filteredpartNumberControl = this.JTForm.controls.partNumberControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredpartNumberControl(value || '')),
    );
    this.filteredHSCodeDestinationControl = this.JTForm.controls.HSCodeDestinationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredHSCodeDestinationControl(value || '')),
    );
    this.filteredHSCodeOriginControl = this.JTForm.controls.HSCodeOriginControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredHSCodeOriginControl(value || '')),
    );

  }
  private _filteredpartNumberControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.PartMaster?.filter((option: any) => option?.partNumber.toLowerCase().includes(filterValue));
  }
  private _filteredHSCodeDestinationControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.hsCodesDestList?.filter((option: any) => option?.hsCode.toLowerCase().includes(filterValue));
  }
  private _filteredHSCodeOriginControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.hsCodesOriginList?.filter((option: any) => option?.hsCode.toLowerCase().includes(filterValue));
  }


  triggerValidation() {
    Object.keys(this.JTForm.controls).forEach(field => {
      const control = this.JTForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  calculateDutyValue(): void {
    const partCIFValue: any = this.JTForm.get('partCIFValueControl')?.value;
    const dutyPercent: any = this.JTForm.get('dutyControl')?.value;

    if (partCIFValue && dutyPercent) {
      const dutyValue: any = partCIFValue * (dutyPercent / 100);
      this.JTForm.get('dutyValueControl')?.setValue(dutyValue);
    } else {
      this.JTForm.get('dutyValueControl')?.setValue('');
    }
  }

  calculateTaxValue(): void {
    const partCIFValue: any = this.JTForm.get('partCIFValueControl')?.value;
    const additionalTax: any = this.JTForm.get('additionalTaxControl')?.value;

    if (partCIFValue && additionalTax) {
      const dutyValue: any = partCIFValue * (additionalTax / 100);
      this.JTForm.get('additionalTaxValueControl')?.setValue(dutyValue);
    } else {
      let defaultValue:any = 0;
      this.JTForm.get('additionalTaxValueControl')?.setValue(defaultValue);
    }
  }

  getLineItem(event: any) {
    this.matFilter();
  }
  getPartDes(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;
    var selectedOption;

    if (this.PartMaster?.length != 0) {
      selectedOption = this.PartMaster.find(option => option?.partNumber === value)
      if (selectedOption) {
        this.JTForm.get('partDescriptionControl')?.patchValue(selectedOption?.partName);
      } else {
        this.JTForm.get('partDescriptionControl')?.reset();
      }
      this.handlePartSelection(selectedOption);
    } else {
      this.partService.GetAllPartMaster(this.Livestatus).subscribe(res => {
        if (res && res.length > 0) {
          this.PartMaster = res;
          this.matFilter();
          selectedOption = this.PartMaster.find(option => option?.partNumber === value)
          if (selectedOption) {
            this.JTForm.get('partDescriptionControl')?.patchValue(selectedOption?.partName);
          } else {
            this.JTForm.get('partDescriptionControl')?.reset();
          }
          this.handlePartSelection(selectedOption);
        }
      });
    }


    this.matFilter();
  }


  handlePartSelection(selectedOption: any) {
    if (selectedOption) {
      this.JTForm.get('partDescriptionControl')?.patchValue(selectedOption?.partName);
    } else {
      this.JTForm.get('partDescriptionControl')?.reset();
    }
  
    const partId = selectedOption?.partId;
    const originCountryId = this.data?.originCountryID || null;
    const destinationCountryId = this.data?.destinationCountryID || null;
  
    if (partId) {
      this.commonService.GetHSCodeByPartAndCountryId(partId, originCountryId, destinationCountryId).subscribe((res: any) => {
        if (res) {
          this.hsCodesOriginList = res?.hscodeByPartAndCountriesByOrigin;
          if (this.hsCodesOriginList?.length > 0) {
            let hs = this.hsCodesOriginList[0];
            this.JTForm.controls.HSCodeOriginControl.patchValue(hs?.hsCode);
          } else {
            this.JTForm.controls.HSCodeOriginControl.reset();
          }
  
          this.hsCodesDestList = res?.hscodeByPartAndCountriesByDestination;
          if (this.hsCodesDestList?.length > 0) {
            let hsDes = this.hsCodesDestList[0];
            this.JTForm.controls.HSCodeDestinationControl.patchValue(hsDes?.hsCode);
            this.JTForm.controls.dutyControl.patchValue(hsDes?.duty);
            this.JTForm.controls.additionalTaxControl.patchValue(hsDes?.addTax);
          } else {
            this.JTForm.controls.HSCodeDestinationControl.reset();
            this.JTForm.controls.dutyControl.reset();
            this.JTForm.controls.additionalTaxControl.reset();
          }
  
          this.matFilter(); 
        }
      });
    }
  }



  getLineItemId(event: any) {
    this.matFilter();
  }


  GetAllPartMaster() {
    this.partService.GetAllPartMaster(this.Livestatus).subscribe(res => {
      this.PartMaster = res;
      this.matFilter();
    });
  }
  getHSCodeItems() {
    this.hscodeSvc.getAllHsCodes(this.Livestatus).subscribe((result:any) => {
      // if(result){
      //   let hsId = result.find((x:any) =>x.hsCodeId)
      //   this.hscodeSvc.getHscodebyId(hsId?.hsCodeId).subscribe((res:any)=>{
      //     console.log(res)
      //     this.PartMaster = res?.hsCodeParts;
      //     this.matFilter();
      //   })
      // }
      // if(result?.length != 0){
      //   this.hsCodesOriginList = result.filter((option:any) => option?.countryId === this.data?.originCountryID)
      //   this.hsCodesDestList = result.filter((option:any) => option?.countryId === this.data?.destinationCountryID)
      // }
      this.matFilter();
    })
  }

  save() {
    this.triggerValidation();
    console.log(this.data)
    if (this.JTForm.invalid) {
      this.JTForm.markAllAsTouched();
    } else {
      this.JTDetails.joPartDetailId = this.data?.list?.joPartDetailId ? this.data?.list?.joPartDetailId : 0,
        this.JTDetails.jobOrderId = +this.data?.jobOrderId ? +this.data?.jobOrderId : 0,
        this.JTDetails.partId = this.getPart(this.JTForm.controls.partNumberControl.value) || 0,
        this.JTDetails.partNumber = this.JTForm.controls.partNumberControl.value || '',
        this.JTDetails.partName = this.JTForm.controls.partDescriptionControl.value || '',
        this.JTDetails.hsCodeDestinationId = this.getHSDes(this.JTForm.controls.HSCodeDestinationControl.value) || null,
        this.JTDetails.hsCodeOriginId = this.getHSOrigin(this.JTForm.controls.HSCodeOriginControl.value) || null,
        this.JTDetails.hsDestination = this.JTForm.controls.HSCodeDestinationControl.value || '',
        this.JTDetails.hsOrigin = this.JTForm.controls.HSCodeOriginControl.value || '',
        this.JTDetails.partCIFValue = parseInt(this.JTForm?.controls?.partCIFValueControl?.value ?? '0') || 0;
        this.JTDetails.dutypercent = this.JTForm.controls.dutyControl.value || 0,
        this.JTDetails.dutyValue = this.JTForm.controls.dutyValueControl.value || 0,
        this.JTDetails.additionalTaxPercent = this.JTForm.controls.additionalTaxControl.value || 0,
        this.JTDetails.additionalTaxValue = this.JTForm.controls.additionalTaxValueControl.value || 0,
        this.JTDetails.eccnNumber = this.JTForm.controls.ECCNNumberControl.value || '',
        this.JTDetails.quantity = this.JTForm.controls.quantityControl.value || 0,
        this.JTDetails.netWeight = this.JTForm.controls.totalNetWeightControl.value || 0,
        this.JTDetails.createdBy = this.data?.createdBy,
        this.JTDetails.updatedBy = this.data?.createdBy,
        this.JTDetails.rowNumber = this.data?.rowNumber

      if (this.data?.overAllList?.length !== 0) {
        const isDuplicate = this.data?.overAllList?.some(
          (item: any) => item.partId === this.JTDetails.partId && item?.rowNumber !== this.JTDetails.rowNumber
        );

        if (isDuplicate) {
          Swal.fire({
            icon: 'info',
            title: 'Duplicate',
            text: 'Duplicate entry detected for Part Number',
            showConfirmButton: true,
          });
          this.JTForm.controls.partNumberControl.reset();
          return;
        } else {
          this.JobTypeDailog.close(this.JTDetails);
        }
      } else {
        this.JobTypeDailog.close(this.JTDetails);
      }

    }
  }

  Close() {
    this.JobTypeDailog.close()
  }


  getPart(value: any) {
    let option = this.PartMaster.find(option => option?.partNumber == value)
    return option?.partId;
  }
  getHSDes(value: any) {
    let option = this.hsCodesDestList.find(option => option?.hsCode == value)
    return option?.hsCodeId;
  }
  getHSOrigin(value: any) {
    let option = this.hsCodesOriginList.find(option => option?.hsCode == value)
    return option?.hsCodeId;
  }

}

