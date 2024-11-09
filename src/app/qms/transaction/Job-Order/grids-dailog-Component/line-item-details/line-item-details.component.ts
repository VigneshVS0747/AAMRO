import { ChangeDetectorRef, Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AddVendorContractInfoComponent } from '../../../vendor-contract/add-vendor-contract-info/add-vendor-contract-info.component';
import { LineitemService } from '../../../../../crm/master/lineitemcategory/lineitem.service';
import { CommonService } from 'src/app/services/common.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { LineVendorFilterComponent } from './line-vendor-filter/line-vendor-filter.component';
import { JOLineItemModal } from '../../job-order.modals';
import Swal from 'sweetalert2';
import { JobOrderExpenseBookingService } from '../../../job-order-expense-booking/job-order-expense-booking.service';
import { QuotationService } from '../../../Quotations/quotation.service';
import { DefaultSettings } from 'src/app/Models/crm/master/Dropdowns';

@Component({
  selector: 'app-line-item-details',
  templateUrl: './line-item-details.component.html',
  styleUrls: ['./line-item-details.component.css']
})
export class LineItemDetailsComponent {
  filteredlineItemDescriptionControl: Observable<any[]>;
  filteredserviceInControl: Observable<any[]>;
  filteredvendorControl: Observable<any[]>;
  filteredRegion: Observable<any[]>;
  filteredsource: Observable<any[]>;
  filteredRefNumber: Observable<any[]>;

  lineItemCategory: any[] = [];
  Livestatus = 1;
  LineItemMaster: any[] = [];
  LineItem: any[] = [];
  CalculationParameter: any[] = [];
  CalculationType: any[] = [];
  TaxType: any[] = [];

  LineItemForm: FormGroup;

  liveStatus = 1;

  vendorPopupdialog: any;
  Vendor: any;
  Contract: any;
  MappedVendor: any;
  filteredoriginCountryControl: Observable<any[]>;
  originCountryControl = new FormControl('', [this.OriginCountryValidator.bind(this)]);
  lineItemCategoryControl = new FormControl('');
  OriginCountryList: any[] = [];
  vendorList: any[] = [];
  pageSize = 10;
  skip = 0;
  regionList: any[] = [];
  isVendorSelected: boolean=false;
  lineItem: JOLineItemModal = new JOLineItemModal();
  SelectedvendorId: any;
  sourceList: any[] = [];
  refList: any[] = [];
  filteredvendors: any[] = [];
  selectedvendors: any;
  selectedRefNumberId: any;
  selectedvendorName: any;
  vendorType: any;
  selectedrefNumber: null;
  vendorTypeId: number;
  selectedSourceFromId: any;
  selectedSourceFromName: any;
  selectedvendor: any;
  selectedvendorType: any;
  show: boolean;
  defaultSettingsValues: DefaultSettings[];
  isView: boolean = false;

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, private regionService: RegionService,
    @Inject(MAT_DIALOG_DATA) public data: any, public LineItemDetailsDailog: MatDialogRef<AddVendorContractInfoComponent>,
    public dialog: MatDialog, private commonService: CommonService, private Cs: CommonService,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService, private cdr: ChangeDetectorRef,
    private Qs: QuotationService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getlist();
    this.GetLineItemMaster();
    this.getCountryMaster();
    this.getAllRegion();
    this.getSourceFroms();
    this.getAllvendors();
    //this.matFilter();
    console.log(this.data)

    if (this.data?.defaultService) {
      this.LineItemForm.controls['serviceInControl'].patchValue(this.data?.defaultService)
    }

    if (this.data?.list) {
      debugger
      if (this.data && this.data.list) {
        this.data.list["rowNumber"] = this.data.rowNumber;
      }
      if (this.data?.view) {
        this.LineItemForm.disable();
        this.isView = true;
      }
      setTimeout(() => {
        this.LineItemForm.patchValue({
          lineItemCodeControl: this.data?.list?.lineItemCode,
          lineItemDescriptionControl: this.data?.list?.lineItemName,
          lineItemCategoryControl: this.data?.list?.lineItemCategoryName,
          serviceInControl: this.data?.list?.countryName,
          vendorControl: this.data?.list?.vendorName,
          regionControl: this.data?.list?.regionName,
          sourceControl: this.data?.list?.sourceFrom,
          referenceControl: this.data?.list?.refNumber,
        })

        this.sourceFromEdit(this.data?.list?.sourceFrom);

        if (this.data?.list?.lineItemCode === undefined || this.data?.list?.lineItemCode === null || this.data?.list?.lineItemCode === "") {
          //this.UpdateLICode();
          let value = this.data?.list?.lineItemName;
          let selectedValue = this.LineItemMaster.find(option => option?.lineItemName == value);
          if (selectedValue) {
            this.LineItemForm.get('lineItemCodeControl')?.patchValue(selectedValue?.lineItemCode);
          }
        }
      }, 700)



      this.LineItemForm.updateValueAndValidity();
      this.LineItemForm.get('regionControl')?.updateValueAndValidity();

      this.SelectedvendorId = this.data.list?.vendorId,
        this.selectedRefNumberId = this.data.list.refNumberId,
        this.selectedSourceFromId = this.data.list.sourceFromId,
        this.isVendorSelected = this.data?.list?.isVendor;
      if (this.isVendorSelected == true) {
        this.show = true;
        this.LineItemForm.controls['vendorControl'].enable();
        this.getSelectedVendorId(this.data?.list?.vendorName);


        //Mandatory Fields
        const vendorControl = this.LineItemForm.controls['vendorControl'];
        const sourceControl = this.LineItemForm.controls['sourceControl'];
        const referenceControl = this.LineItemForm.controls['referenceControl'];
        vendorControl.setValidators([Validators.required]);
        sourceControl.setValidators([Validators.required]);
        referenceControl.setValidators([Validators.required]);
        vendorControl.updateValueAndValidity();
        sourceControl.updateValueAndValidity();
        referenceControl.updateValueAndValidity();

      } else {
        this.show = false;
      }
      if (this.selectedSourceFromId == 3) {
        this.LineItemForm.get('referenceControl')?.disable();
      } else {
        this.LineItemForm.get('referenceControl')?.enable();
      }
    } else {

      //DefaultSetting
      this.commonService.GetAllDefaultSettings().subscribe(res => {
        this.defaultSettingsValues = res;
        //Region
        if (res) {
          let defaultRegion = this.defaultSettingsValues.find(x => x.settingName == 'Region')
          let regionId = defaultRegion?.defaultValueId;
          let region = this.regionList?.find(x => x.regionId === regionId)

          setTimeout(() => {
            this.LineItemForm.controls['regionControl'].patchValue(region?.regionName)
          }, 750)
        }


      });

    }

    if (this.data?.list?.countryName === '' || this.data?.list?.countryName === null || this.data?.list?.countryName === undefined) {
      this.LineItemForm.controls['serviceInControl'].patchValue(this.data?.defaultService)
    }

  }
  private initializeForm() {
    this.LineItemForm = new FormGroup({
      lineItemCodeControl: new FormControl({ value: '', disabled: true }),
      lineItemDescriptionControl: new FormControl('', [Validators.required, this.LineItemDescriptionValidator.bind(this)]),
      lineItemCategoryControl: new FormControl({ value: '', disabled: true }),
      serviceInControl: new FormControl('', [Validators.required, this.ServiceInValidator.bind(this)]),
      vendorControl: new FormControl({ value: '', disabled: !this.isVendorSelected }),
      regionControl: new FormControl('', [Validators.required, this.RegionValidator.bind(this)]),
      sourceControl: new FormControl(''),
      referenceControl: new FormControl(''),

    })
  }


  get f() {
    return this.LineItemForm.controls;
  }

  LineItemDescriptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.LineItemMaster?.some((option: any) => option?.lineItemName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;

  }
  ServiceInValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.OriginCountryList?.some((option: any) => option?.countryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  VendorValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;

    if (isTouched && value !== '' && value !== null) {
      var isValid = this.lineItemCategory?.some((option: any) => option?.lineItemCategoryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  RegionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;


    if (isTouched && value !== '' && value !== null && this.regionList) {
      const isValid = this.regionList.some((option: any) => option?.regionName === value);
      console.log('Is Valid:', isValid);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  SourceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.sourceList?.some((option: any) => option?.sourceFrom === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  matFilter() {
    this.filteredlineItemDescriptionControl = this.LineItemForm.controls['lineItemDescriptionControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filteredlineItemDescriptionControl(value || '')),
    );
    this.filteredserviceInControl = this.LineItemForm.controls['serviceInControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filteredserviceInControl(value || '')),
    );
    this.filteredvendorControl = this.LineItemForm.controls['vendorControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filteredvendorControl(value || '')),
    );
    this.filteredRegion = this.LineItemForm.controls['regionControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filteredRegion(value || '')),
    );
    this.filteredsource = this.LineItemForm.controls['sourceControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filteredsource(value || '')),
    );
    this.filteredRefNumber = this.LineItemForm.controls['referenceControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filteredRefNumber(value || '')),
    );
  }

  private _filteredlineItemDescriptionControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.LineItemMaster?.filter((option: any) => option?.lineItemName.toLowerCase().includes(filterValue));
  }
  private _filteredserviceInControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.OriginCountryList?.filter((option: any) => option?.countryName.toLowerCase().includes(filterValue));
  }
  private _filteredvendorControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredvendors?.filter((option: any) => option?.vendorName.toLowerCase().includes(filterValue));
  }
  private _filteredRegion(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.regionList?.filter((option: any) => option?.regionName.toLowerCase().includes(filterValue));
  }
  private _filteredsource(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.sourceList?.filter((option: any) => option?.sourceFrom.toLowerCase().includes(filterValue));
  }
  private _filteredRefNumber(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.refList?.filter((option: any) => option?.refNumber.toLowerCase().includes(filterValue));
  }


  OriginCountryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '') {
      var isValid = this.OriginCountryList?.some((option: any) => option?.countryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  triggerValidation() {
    Object.keys(this.LineItemForm.controls).forEach(field => {
      const control = this.LineItemForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  OnchangeEvent(event: any) {
    this.matFilter();
  }

  sourceFromSelectedOption(data: any) {
    let selectedValue = data?.option?.value;
    let selectedLineItemId = this.getLineItemID(this.LineItemForm.controls['lineItemDescriptionControl'].value);
    let sourceForm = this.sourceList?.find(option => option?.sourceFrom === selectedValue)
    this.LineItemForm.get('referenceControl')?.reset();

    if (sourceForm.sourceFromId == 1) {
      this.selectedSourceFromId = sourceForm.sourceFromId;
      this.selectedSourceFromName = sourceForm.sourceFrom;
      this.getvendor("PQ", this.vendorTypeId, this.SelectedvendorId, selectedLineItemId);
      this.LineItemForm.get('referenceControl')?.reset();
      this.refList = [];

    }
    if (sourceForm.sourceFromId == 2) {
      this.selectedSourceFromId = sourceForm.sourceFromId;
      this.selectedSourceFromName = sourceForm.sourceFrom;
      this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, selectedLineItemId);
      this.LineItemForm.get('referenceControl')?.reset();
      this.refList = [];
    }
    if (sourceForm.sourceFromId == 3) {
      this.LineItemForm.get('referenceControl')?.disable();
      this.LineItemForm.get('referenceControl')?.reset();
      this.refList = [];
    } else {
      this.LineItemForm.get('referenceControl')?.enable();
    }
    //if (this.selectedSourceFromId == 3) {
    //if (this.selectedSourceFromId == 3) {
    this.LineItemForm.controls['referenceControl'].reset();
    //}

    this.matFilter();
  }

  getSourceFrom(id: number) {
    const Data = {
      vendorType: id,
      vendorId: this.SelectedvendorId
    }
    this.Cs.GetAllPQandContract(Data).subscribe((res => {
      this.refList = res;
      this.matFilter();
    }));
  }

  toggleVendorField(event: any): void {
    console.log(this.isVendorSelected);
    const selectedValue = event.value;
    if (selectedValue == true) {
      const lineItemDescriptionValue = this.LineItemForm.controls['lineItemDescriptionControl'].value;

      if (lineItemDescriptionValue !== null && lineItemDescriptionValue !== "") {
        const vendorControl = this.LineItemForm.controls['vendorControl'];
        const sourceControl = this.LineItemForm.controls['sourceControl'];
        const referenceControl = this.LineItemForm.controls['referenceControl'];

        if (this.isVendorSelected) {
          vendorControl.enable();
          vendorControl.setValidators([Validators.required]);

          sourceControl.setValidators([Validators.required]);

          referenceControl.setValidators([Validators.required]);
          this.show = true;
        } else {
          vendorControl.clearValidators();
          sourceControl.clearValidators();
          referenceControl.clearValidators();
        }

        vendorControl.updateValueAndValidity();
        sourceControl.updateValueAndValidity();
        referenceControl.updateValueAndValidity();
      } else {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "Please select a line item description and then use filter",
          showConfirmButton: false,
          timer: 2000,
        });

        this.isVendorSelected = false;

        this.show = false;


        this.cdr.detectChanges();

        return;
      }
    } else {
      this.LineItemForm.controls['vendorControl'].reset();
      this.LineItemForm.controls['sourceControl'].reset();
      this.LineItemForm.controls['referenceControl'].reset();
      this.LineItemForm.controls['vendorControl'].clearValidators();
      this.LineItemForm.controls['sourceControl'].clearValidators();
      this.LineItemForm.controls['referenceControl'].clearValidators();
      this.show = false;
      this.LineItemForm.controls['sourceControl'].setValidators(Validators.nullValidator);
      this.LineItemForm.controls['sourceControl'].updateValueAndValidity();
    }
  }


  getLineItem(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;
    let selectedValue = this.LineItemMaster.find(option => option?.lineItemName == value);
    if (selectedValue) {
      let category = this.lineItemCategory.find(options => options?.lineItemCategoryId === selectedValue?.lineItemCategoryId);

      this.LineItemForm.get('lineItemCodeControl')?.patchValue(selectedValue?.lineItemCode);
      this.LineItemForm.get('lineItemCategoryControl')?.patchValue(category?.lineItemCategoryName);
    } else {
      this.LineItemForm.get('lineItemCodeControl')?.reset();
      this.LineItemForm.get('lineItemCategoryControl')?.reset();
    }
    this.matFilter();
  }

  getSelectedVendorId(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;

    if (this.filteredvendors?.length === 0) {
      this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
        this.filteredvendors = res;

        this.findVendor(value);
      });
    } else {
      this.findVendor(value);
    }
  }
  findVendor(value: any) {
    let selectedValue = this.filteredvendors?.find(option => option?.vendorName === value)
    this.SelectedvendorId = selectedValue?.vendorId;
    this.selectedvendorName = selectedValue.vendorName;
    this.vendorType = selectedValue.vendorType;
    this.selectedrefNumber = null;
    this.selectedRefNumberId = null;
    this.LineItemForm.controls['sourceControl']?.setValue(null);
    this.LineItemForm.controls['referenceControl']?.setValue(null);
    if (this.vendorType == 'V') {
      this.vendorTypeId = 2;
    } else if (this.vendorType == 'PV') {
      this.vendorTypeId = 1;
    }

    let selectedLineItemId = this.getLineItemID(this.LineItemForm.controls['lineItemDescriptionControl'].value);
    const payload = {
      vendorId: this.SelectedvendorId,
      lineitemId: selectedLineItemId
    }
    this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
      if (res?.length > 0) {
        this.selectedvendors = res;
        var direct = this.sourceList.find(id => id.sourceFromId == 2);
        this.selectedSourceFromId = 2
        this.selectedSourceFromName = direct?.sourceFrom;
        this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, selectedLineItemId);
        this.LineItemForm.controls['sourceControl']?.setValue(direct?.sourceFrom);
        this.LineItemForm.controls['referenceControl']?.setValue(this.selectedvendors?.refNumber);
        if (res?.length == 1) {
          this.selectedvendors = res[0];
          this.selectedRefNumberId = this.selectedvendors.refNumberId;
          this.selectedrefNumber = this.selectedvendors.refNumber;
          this.LineItemForm.controls['referenceControl']?.setValue(this.selectedvendors?.refNumber);
        }
      }

      this.LineItemForm.controls['sourceControl'].setValidators(Validators.required);
      this.LineItemForm.controls['sourceControl'].updateValueAndValidity();

    }));
    this.matFilter();
  }

  // getSelectedVendorId(event: any) {
  //   debugger
  //   let value = event?.option?.value ? event?.option?.value : event;

  //   if(this.filteredvendors?.length === 0){
  //     this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
  //       this.filteredvendors = res;
  //       this.matFilter();
  //     });
  //   }

  //   let selectedValue = this.filteredvendors?.find(option => option?.vendorName === value)
  //   this.SelectedvendorId = selectedValue?.vendorId;
  //   this.selectedvendorName = selectedValue.vendorName;
  //   this.vendorType = selectedValue.vendorType;
  //   this.selectedrefNumber = null;
  //   this.selectedRefNumberId = null;
  //   this.LineItemForm.controls['sourceControl']?.setValue(null);
  //   this.LineItemForm.controls['referenceControl']?.setValue(null);
  //   if (this.vendorType == 'V') {
  //     this.vendorTypeId = 2;
  //   } else if (this.vendorType == 'PV') {
  //     this.vendorTypeId = 1;
  //   }

  //   let selectedLineItemId = this.getLineItemID(this.LineItemForm.controls['lineItemDescriptionControl'].value);
  //   const payload = {
  //     vendorId: this.SelectedvendorId,
  //     lineitemId: selectedLineItemId
  //   }
  //   this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
  //     if (res?.length > 0) {
  //       this.selectedvendors = res;
  //       var direct = this.sourceList.find(id => id.sourceFromId == 2);
  //       this.selectedSourceFromId = 2
  //       this.selectedSourceFromName = direct?.sourceFrom;
  //       this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, selectedLineItemId);
  //       this.LineItemForm.controls['sourceControl']?.setValue(direct?.sourceFrom);
  //       this.LineItemForm.controls['referenceControl']?.setValue(this.selectedvendors?.refNumber);
  //       if (res?.length == 1) {
  //         this.selectedvendors = res[0];
  //         this.selectedRefNumberId = this.selectedvendors.refNumberId;
  //         this.selectedrefNumber = this.selectedvendors.refNumber;
  //         this.LineItemForm.controls['referenceControl']?.setValue(this.selectedvendors?.refNumber);
  //       }
  //     }

  //     this.LineItemForm.controls['sourceControl'].setValidators(Validators.required);
  //     this.LineItemForm.controls['sourceControl'].updateValueAndValidity();

  //   }));
  //   this.matFilter();
  // }

  getvendor(seleted: string, Vtype: any, Vid: number, lineitem: number) {
    this.Qs.GetQVerndorDetails(seleted, Vtype, Vid, lineitem).subscribe(res => {
      this.refList = res;

      if (seleted === 'Contract') {
        this.refList = res;


        const selectedJobOrderDate = this.data?.selectedJobOrderDate;

        if (selectedJobOrderDate) {
          const selectedDate = new Date(selectedJobOrderDate);
          selectedDate.setHours(0, 0, 0, 0);

          this.refList = this.refList.filter((item: any) => {
            const validFromDate = new Date(item.validFrom);
            const validToDate = new Date(item.validTo);

            validFromDate.setHours(0, 0, 0, 0);
            validToDate.setHours(0, 0, 0, 0);

            return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';

          });

          if (this.refList?.length === 0 || this.refList === null || this.refList === undefined) {
            this.LineItemForm.controls['referenceControl'].reset();
          }
        }
      }

      this.matFilter();
    });
  }
  getLineItemId(event: any) {
    this.matFilter();
  }
  getRefernceId(event: any) {
    this.selectedrefNumber = this.selectedvendor.refNumber;
    this.selectedRefNumberId = this.selectedvendor.refNumberId;
    this.matFilter();
  }

  getCountryMaster() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.OriginCountryList = result;
      this.matFilter();
    });
  }

  GetLineItemMaster() {
    this.service.GetAllLineItemMaster(this.Livestatus).subscribe((res) => {
      this.LineItemMaster = res;
      this.matFilter();
    });
  }
  getAllRegion() {
    this.regionService.getRegions().subscribe(data => {
      this.regionList = data;
      this.matFilter();
    });
  }
  getlist() {
    this.LineitemService.GetAlllineItem(this.Livestatus).subscribe((result: any) => {
      this.lineItemCategory = result;
      this.matFilter();
    });
  }
  getSourceFroms() {
    this.Cs.GetAllSourceFrom().subscribe((result) => {
      this.sourceList = result;
      this.matFilter();
    });
  }

  getAllvendors() {
    this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
      this.filteredvendors = res;
      this.matFilter();
    });
  }

  vendorFilter() {
    let selectedLineItemId = this.getLineItemID(this.LineItemForm.controls['lineItemDescriptionControl'].value);
    if (selectedLineItemId != null) {
      this.vendorPopupdialog = this.dialog.open(LineVendorFilterComponent, {
        disableClose: true,
        autoFocus: false,
        height: '650px',
        data: {
          lineItemId: selectedLineItemId
        }
      });
      this.vendorPopupdialog.afterClosed().subscribe((result: any) => {
        console.log(result)
        // if (result) {
        //   this.SelectedvendorId = result?.vendorId;
        //   this.LineItemForm.get('vendorControl')?.patchValue(result?.vendorName);
        //   this.LineItemForm.get('sourceControl')?.patchValue(result?.sources);
        //   this.LineItemForm.get('referenceControl')?.patchValue(result?.refNumber);
        //   this.selectedRefNumberId = result.refNumberId;
        // }
        this.selectedSourceFromId = null;
        this.selectedSourceFromName = null;
        this.selectedrefNumber = null;
        this.selectedRefNumberId = null;
        this.LineItemForm.controls['sourceControl']?.setValue(null);
        this.LineItemForm.controls['referenceControl']?.setValue(null);




        this.selectedvendor = result;
        this.SelectedvendorId = this.selectedvendor.vendorId;
        this.selectedvendorName = this.selectedvendor.vendorName;
        this.selectedRefNumberId = this.selectedvendor.refNumberId;
        this.selectedrefNumber = this.selectedvendor.refNumber;
        this.selectedvendorType = this.selectedvendor.vendorType;

        if (this.selectedvendorType == 'V') {
          this.vendorTypeId = 2;
        } else if (this.vendorType == 'PV') {
          this.vendorTypeId = 1;
        }


        if (this.selectedvendor.sourceFrom == "PQ") {
          this.selectedSourceFromId = 1;
          var vendor = this.sourceList.find(id => id.sourceFromId == 1);
          this.selectedSourceFromName = vendor?.sourceFrom;
          this.LineItemForm.controls['sourceControl']?.setValue(vendor?.sourceFrom);
          //this.getvendor("pq",this.vendorTypeId,this.SelectedvendorId,this.selectedLineItemId);
        } else {
          this.selectedSourceFromId = 2
          var vendor = this.sourceList.find(id => id.sourceFromId == 2);
          this.selectedSourceFromName = vendor?.sourceFrom;
          this.LineItemForm.controls['sourceControl']?.setValue(vendor?.sourceFrom);

          let selectedLineItemId = this.getLineItemID(this.LineItemForm.controls['lineItemDescriptionControl'].value);
          const payload = {
            vendorId: this.SelectedvendorId,
            lineitemId: selectedLineItemId
          }
          this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
            if (res.length > 0) {
              this.selectedvendors = res;
              var direct = this.sourceList.find(id => id.sourceFromId == 2);
              this.selectedSourceFromId = 2
              this.selectedSourceFromName = direct?.sourceFrom;
              this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, selectedLineItemId);
              this.LineItemForm.controls['sourceControl']?.setValue(direct?.sourceFrom);
              this.LineItemForm.controls['referenceControl']?.setValue(this.selectedvendors?.refNumber);
              if (res?.length == 1) {
                this.selectedvendors = res[0];
                this.selectedRefNumberId = this.selectedvendors.refNumberId;
                this.selectedrefNumber = this.selectedvendors.refNumber;
                this.LineItemForm.controls['referenceControl']?.setValue(this.selectedvendors?.refNumber);

              }
            }

          }));
        }
        this.LineItemForm.get('vendorControl')?.patchValue(this.selectedvendor?.vendorName);
        this.selectedrefNumber = this.selectedvendor.refNumber;
        this.selectedRefNumberId = this.selectedvendor.refNumberId;
        this.LineItemForm.controls['referenceControl']?.setValue(this.selectedvendor?.refNumber);

      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select line item description and then use filter",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  save() {
    this.triggerValidation();
    console.log(this.data)
    if (this.LineItemForm.invalid) {
      this.LineItemForm.markAllAsTouched();
    } else {
      this.lineItem.joLineItemId = +this.data?.list?.joLineItemId ? +this.data.list?.joLineItemId : 0,
        this.lineItem.jobOrderId = +this.data?.jobOrderId ? +this.data?.jobOrderId : 0,
        this.lineItem.lineItemCategoryId = this.getLineItemCategory(this.LineItemForm.controls['lineItemCategoryControl'].value) || null,
        this.lineItem.lineItemId = this.getLineItemID(this.LineItemForm.controls['lineItemDescriptionControl'].value) || null,
        this.lineItem.isVendor = this.isVendorSelected || false,
        this.lineItem.vendorId = this.SelectedvendorId || null,
        this.lineItem.regionId = this.getRegion(this.LineItemForm.controls['regionControl'].value) || null,
        this.lineItem.serviceInId = this.getService(this.LineItemForm.controls['serviceInControl'].value) || null,
        this.lineItem.createdBy = this.data?.createdBy,
        this.lineItem.updatedBy = this.data?.createdBy,
        this.lineItem.lineItemName = this.LineItemForm.controls['lineItemDescriptionControl'].value || '',
        this.lineItem.lineItemCode = this.LineItemForm.controls['lineItemCodeControl'].value || '',
        this.lineItem.lineItemCategoryName = this.LineItemForm.controls['lineItemCategoryControl'].value || '',
        this.lineItem.vendorName = this.LineItemForm.controls['vendorControl'].value || '',
        this.lineItem.countryName = this.LineItemForm.controls['serviceInControl'].value || '',
        this.lineItem.regionName = this.LineItemForm.controls['regionControl'].value || '',
        this.lineItem.refNumber = this.LineItemForm.controls['referenceControl'].value || '',
        this.lineItem.sourceFrom = this.LineItemForm.controls['sourceControl'].value || '',

        this.lineItem.refNumberId = this.selectedRefNumberId || this.getref(this.LineItemForm.controls['referenceControl'].value),
        this.lineItem.sourceFromId = this.selectedSourceFromId || null,

        this.lineItem.rowNumber = this.data?.rowNumber


      if (this.data?.overAllList?.length !== 0) {
        const isDuplicate = this.data?.overAllList?.some(
          (item: any) => item.lineItemId === this.lineItem.lineItemId && item?.rowNumber !== this.lineItem.rowNumber
        );

        if (isDuplicate) {
          Swal.fire({
            icon: 'info',
            title: 'Duplicate',
            text: 'Duplicate entry detected for Line item',
            showConfirmButton: true,
          });
          this.LineItemForm.controls['lineItemCodeControl'].reset();
          this.LineItemForm.controls['lineItemDescriptionControl'].reset();
          this.LineItemForm.controls['lineItemCategoryControl'].reset();
          return;
        } else {
          this.LineItemDetailsDailog.close(this.lineItem);
        }
      } else {
        this.LineItemDetailsDailog.close(this.lineItem);
      }
    }
  }

  Close() {
    this.LineItemDetailsDailog.close()
  }

  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  getLineItemCategory(value: any) {
    let option = this.lineItemCategory.find(option => option?.lineItemCategoryName == value)
    return option?.lineItemCategoryId;
  }
  getLineItemID(value: any) {
    let option = this.LineItemMaster.find(option => option?.lineItemName == value)
    return option?.lineItemId;
  }
  // getvendorID(value: any) {
  //   let option = this.LineItem.find(option => option?.lineItemName == value)
  //   return option?.lineItemId;
  // }
  getRegion(value: any) {
    let option = this.regionList.find(option => option?.regionName == value)
    return option?.regionId;
  }
  getService(value: any) {
    let option = this.OriginCountryList.find(option => option?.countryName == value)
    return option?.countryId;
  }
  getref(value: any) {
    let option = this.refList.find(option => option?.refNumber == value)
    return option?.refNumberId || null;
  }
  getSource(value: any) {
    let option = this.sourceList.find(option => option?.sourceFrom == value)
    return option?.sourceFromId;
  }



  //Edit 
  sourceFromEdit(data: any) {
    let selectedValue = data?.option?.value ? data?.option?.value : data;
    let selectedLineItemId = this.getLineItemID(this.LineItemForm.controls['lineItemDescriptionControl'].value);
    let sourceForm = this.sourceList?.find(option => option?.sourceFrom === selectedValue)

    if (sourceForm?.sourceFromId == 1) {
      this.selectedSourceFromId = sourceForm.sourceFromId;
      this.selectedSourceFromName = sourceForm.sourceFrom;
      this.getvendor("PQ", this.vendorTypeId, this.SelectedvendorId, selectedLineItemId);
      //this.LineItemForm.get('referenceControl')?.reset();
      this.refList = [];

    }
    if (sourceForm?.sourceFromId == 2) {
      this.selectedSourceFromId = sourceForm.sourceFromId;
      this.selectedSourceFromName = sourceForm.sourceFrom;
      this.getvendor("Contract", this.vendorTypeId, this.SelectedvendorId, selectedLineItemId);
      //this.LineItemForm.get('referenceControl')?.reset();
      this.refList = [];
    }
    if (sourceForm?.sourceFromId == 3) {
      this.LineItemForm.get('referenceControl')?.disable();
      this.LineItemForm.get('referenceControl')?.reset();
      this.refList = [];
    } else {
      this.LineItemForm.get('referenceControl')?.enable();
    }
    //if (this.selectedSourceFromId == 3) {
    //if (this.selectedSourceFromId == 3) {
    //this.LineItemForm.controls['referenceControl'].reset();
    //}

    this.matFilter();
  }

}

