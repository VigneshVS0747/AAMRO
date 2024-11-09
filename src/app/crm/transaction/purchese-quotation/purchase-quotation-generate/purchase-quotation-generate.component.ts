import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { PQAgainst } from 'src/app/Models/crm/master/Dropdowns';
import { CommonService } from 'src/app/services/common.service';
import { PurchaseQuotationCuvService } from '../purchase-quotation-cuv.service';
import Swal from 'sweetalert2';
import { Vendor } from 'src/app/Models/crm/master/Vendor';
import { MatDialog } from '@angular/material/dialog';
import { StandaloneDialogComponent } from '../standalone-dialog/standalone-dialog.component';
import { PotentialVendorService } from 'src/app/crm/master/potential-vendor/potential-vendor-service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { PotentialVendor } from 'src/app/crm/master/potential-vendor/potential-vendor.model';
import { VendorList } from '../purchase-quotation.model';
import { RfqService } from '../../RFQ/rfq.service';
import { Rfqgeneral } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { EnquiryService } from '../../Enquiry/enquiry.service';
import { RegionService } from 'src/app/services/qms/region.service';

@Component({
  selector: 'app-purchase-quotation-generate',
  templateUrl: './purchase-quotation-generate.component.html',
  styleUrls: ['./purchase-quotation-generate.component.css', '../../../../ums/ums.styles.css']
})
export class PurchaseQuotationGenerateComponent {

  pqform: FormGroup;
  vendorId: number = 0;
  vendor: string = '';
  filteredpqAgainstOptions$: Observable<any[]>;
  pqAgainstId: any;
  pqAgainstList: PQAgainst[] = [];
  vendorList: any[];
  checkbox: boolean;
  SelectedVendor: number = 0;
  potentialVendorList: PotentialVendor[];
  list: any[];
  selectRFQ: boolean = false;

  type: any;
  searchValue: string = '';
  refNumberId: any;
  rfqorEnqList: any[];
  rfqorEnqId: any;
  filteredrfqOptions$: Observable<any[]>;
  vendorCode: string;
  refCode: any;
  refnumberField: boolean = true;
  vendorType: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private commonService: CommonService,
    private pqServices: PurchaseQuotationCuvService,
    private potentialVendorService: PotentialVendorService,
    private vendorService: VendorService,
    private rfqService: RfqService,
    private enquiryService: EnquiryService,
    private regionService: RegionService,
  ) { }
  ngOnInit() {
    debugger
    this.vendorId = 0;
    this.SelectedVendor = 0;
    this.pqform = this.fb.group({
      pqAgainstId: ['', Validators.required],
      refNumberId: [null],
    });

    this.getAllPQAgainst();
    const rfqId = this.rfqService.itemId
    if (this.rfqService.rfq && rfqId != 0) {
      this.rfqService.GetAllopenRfq().subscribe(res => {
        this.rfqorEnqList = res;

        this.rfqorEnqList = res.map(res => {
          return {
            rfqId: res.rfqId,
            code: res.rfqNumber
          };

        });

        this.rfqFun();
        this.rfqService.GetAllRFQById(rfqId).subscribe(res => {
          this.list = res.rfqVendors;
          this.selectRFQ = true;
          this.refNumberId = rfqId;
          //binding ref number
          this.rfqorEnqList.forEach(ele => {
            if (ele.rfqId == this.refNumberId) {
              this.refCode = ele.code;
              this.pqform.controls['refNumberId'].enable();
              this.pqform.controls['refNumberId'].setValue(ele);

            }
          });
          //binding pq Against
          this.pqAgainstList.forEach(ele => {
            if (ele.pqAgainstId == 1) {
              this.pqAgainstId = ele.pqAgainstId;
              this.pqform.controls['pqAgainstId'].setValue(ele);
            }
          });
        });
      });
      return;
    }
  }

  //#region country autocomplete
  getAllPQAgainst() {
    debugger
    this.commonService.getAllPQAgainst().subscribe(res => {
      this.pqAgainstList = res;
      this.PQAgainstFun();
    });

  }

  PQAgainstFun() {
    this.filteredpqAgainstOptions$ = this.pqform.controls['pqAgainstId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.pqAgainst)),
      map((name: any) => (name ? this.filteredpqAgainstOptions(name) : this.pqAgainstList?.slice()))
    );

  }
  private filteredpqAgainstOptions(name: string): any[] {

    const filterValue = name.toLowerCase();
    const results = this.pqAgainstList.filter((option: any) => option.pqAgainst.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoData();
  }
  NoData(): any {
    this.pqform.controls['pqAgainstId'].setValue('');
    return this.pqAgainstList;
  }
  displayPQAgainstLabelFn(data: any): string {
    return data && data.pqAgainst ? data.pqAgainst : '';
  }
  PQAgainstSelectedoption(Data: any) {
    debugger
    let selectedvalue = Data.option.value;
    this.pqAgainstId = selectedvalue.pqAgainstId;
    this.refNumberId = '';
    if (this.pqAgainstId == 1) {
      this.selectRFQ = true;
      this.rfqService.rfq = true;
      this.rfqService.job = false;
      this.rfqService.enq = false;
      this.refnumberField = false;
      this.pqform.controls['refNumberId'].enable();
      this.rfqService.GetAllopenRfq().subscribe(res => {
        const rfqlist = res.map(res => {
          return {
            Id: res.rfqId,
            code: res.rfqNumber
          };
        });
        this.rfqorEnqList = [...rfqlist];
        this.rfqFun();
        this.pqform.controls['refNumberId'].setValue('');
        this.pqform.controls['refNumberId'].enable();
      });
    } else if (this.pqAgainstId == 2) {
      this.selectRFQ = false;
      this.rfqorEnqList = [];
      this.list = [];
      this.refnumberField = false;
      this.rfqService.job = true;
      this.rfqService.enq = false;
      this.rfqService.rfq = false;

      this.regionService.GetAllJobOrder().subscribe((res: any) => {
        const JobOrderList = res.map((res: { jobOrderId: any; jobOrderNumber: any; }) => {
          return {
            Id: res.jobOrderId,
            code: res.jobOrderNumber
          };
        });
        this.rfqorEnqList = [...JobOrderList];
        this.rfqFun();
      })
      //this.NoDatarfq();
      this.checkbox = false;
      this.pqform.controls['refNumberId'].setValue('');
      this.pqform.controls['refNumberId'].enable();
    }
    else if (this.pqAgainstId == 3) {
      debugger
      this.pqform.controls['refNumberId'].setValue('');
      this.pqform.controls['refNumberId'].disable();
      this.rfqorEnqList = [];
      this.list = [];
      this.NoDatarfq();
      this.refnumberField = true;
      this.checkbox = false;
      this.selectRFQ = false;
    } else if (this.pqAgainstId == 4) {
      this.selectRFQ = false;
      this.rfqService.rfq = false;
      this.rfqService.job = false;
      this.rfqService.enq = true;
      this.refnumberField = false;
      this.pqform.controls['refNumberId'].setValue('');
      this.pqform.controls['refNumberId'].enable();
      this.enquiryService.GetOpenEnquiry().subscribe(res => {
        const rfqlist = res.map(res => {
          return {
            Id: res.enquiryId,
            code: res.enquiryNumber
          };
        });
        this.rfqorEnqList = [...rfqlist];
        this.rfqFun();
      });
    }
  }
  //#endregion

  isFieldEnabled(): boolean {
    return !this.pqform.controls['refNumberId'].disabled;
  }

  rfqFun() {
    this.filteredrfqOptions$ = this.pqform.controls['refNumberId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.code)),
      map((name: any) => (name ? this.filteredrfqOptions(name) : this.rfqorEnqList?.slice()))
    );

  }
  private filteredrfqOptions(name: string): any[] {

    const filterValue = name.toLowerCase();
    const results = this.rfqorEnqList.filter((option: any) => option.code.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatarfq();
  }
  NoDatarfq(): any {
    this.pqform.controls['refNumberId'].setValue('');
    return this.rfqorEnqList;
  }
  displayrfqLabelFn(data: any): string {
    return data && data.code ? data.code : '';
  }
  rfqSelectedoption(event: any) {
    let selectedvalue = event.option.value;
    this.rfqorEnqId = selectedvalue.Id;
    if (this.rfqService.enq) {
      this.enquiryService.GetAllEnquiryById(this.rfqorEnqId).subscribe(res => {
        console.log(res)
        this.refNumberId = this.rfqorEnqId;
        this.refCode = selectedvalue.code
      });
    } else if (this.rfqService.job) {
      this.regionService.GetJobOrderById(this.rfqorEnqId).subscribe(res=>{
        this.refNumberId = this.rfqorEnqId;
        this.refCode = selectedvalue.code
      });
    } else {
      this.rfqService.GetAllRFQById(this.rfqorEnqId).subscribe(res => {
        this.list = res.rfqVendors;
        this.refNumberId = this.rfqorEnqId;
        this.refCode = selectedvalue.code
      });
    }
  }

  getVendorItems() {
    this.vendorService.getAllVendor().subscribe(result => {
      this.vendorList = result;
    })
  }
  getAllPotentialVendor() {
    this.potentialVendorService.getAllActivePotentialVendor().subscribe(result => {
      this.potentialVendorList = result;
    });
  }
  generatePQ() {
    if (this.pqAgainstId != 3 && this.refNumberId == '') {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please select the Reference Number..!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (this.pqform.valid) {
      if (this.checkbox && this.SelectedVendor != 0) {
        this.pqServices.isEdit = false;
        this.pqServices.isView = false;
        this.pqServices.setpqAgainstId(this.pqAgainstId);
        this.pqServices.setVendorId(this.SelectedVendor);
        this.pqServices.setvendorTyppe(this.type);
        this.pqServices.setrefNumber(this.refNumberId);
        this.pqServices.setrefNumberValue(this.refCode);
        this.router.navigate(["/crm/transaction/purchasequotation/cuv"]);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please select the Vendor..!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please select the PQ Against",
        showConfirmButton: false,
        timer: 2000,
      });
      this.searchValue = "";
    }

  }
  returnToList() {
    if (this.rfqService.Fromrfq) {
      this.rfqService.Fromrfq = false;
      this.rfqService.rfq = false;
      this.rfqService.job = false;

      this.rfqService.enq = false;
      this.router.navigate(["/crm/transaction/rfqorEnqList"]);
      return;
    }
    this.rfqService.Fromrfq = false;
    this.rfqService.rfq = false;
    this.rfqService.job = false;

    this.rfqService.enq = false;
    this.router.navigate(["/crm/transaction/purchasequotationlist"]);
  }

  // toggleCheckbox(index: number, id: number) {
  //   debugger
  //   this.SelectedVendor==0;
  //   if(this.SelectedVendor==0)
  //     {
  //       const ind = this.list.findIndex(item => item.vendorId === id);
  //       this.list.forEach(vendor => vendor.checkbox = false);
  //       this.list[ind].checkbox = true;
  //       this.SelectedVendor = id;
  //       this.checkbox = true;
  //       const vendor = this.list.find(item => item.vendorId == id);
  //       console.log(vendor)
  //       if (vendor.vendorTypeId == 1) {
  //         this.type = 'PV'
  //       } else {
  //         this.type = 'V'
  //       }
  //     }else{
  //       this.SelectedVendor=0;
  //     }

  // }
  toggleCheckbox(index: number, id: number) {
    debugger;
    // Find the current vendor
    const vendor = this.list.find(item => item.vendorId === id);

    if (!vendor) {
      console.error('Vendor not found!');
      return;
    }
    // If the same vendor is clicked again, uncheck it
    if (this.SelectedVendor === id) {
      vendor.checkbox = false;
      this.SelectedVendor = 0;
      this.type = '';
      this.checkbox = false;
    } else {
      // Uncheck all vendors
      this.list.forEach(v => v.checkbox = false);
      // Check the selected vendor
      vendor.checkbox = true;
      this.SelectedVendor = id;
      this.checkbox = true;
      // Set the type based on vendorTypeId
      this.type = (vendor.vendorTypeId === 1) ? 'PV' : 'V';
    }
  }


  toggleCheckbox1(event: any) {
    this.checkbox = event.checked;
  }

  searchVendor() {
    if (this.pqform.valid) {
      if (this.vendor != '') {
        this.pqServices.getAllSearchedVendors(this.vendor).subscribe(res => {
          this.list = res;
        });
      }
      else {
        this.vendorId = 0;
      }
    }
    else {
      this.vendor = '';
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please select the PQ Against",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  optionSelected(event: any) {
    debugger
    let selectedValue = event.option.value;
    this.vendor = selectedValue;
    const selected = this.list.find(
      (vendor) => vendor.vendorName === selectedValue
    );
    this.type = selected.type;
    this.SelectedVendor = selected.vendorId;
    this.vendorId = this.SelectedVendor
    this.vendorCode = selected.vendorCode;
    if (selected.type == 'PV') {
      this.vendorType = "Potential Vendor"
    }
    else {
      this.vendorType = "Vendor"
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.vendorId = 0;
      this.vendorType = "";
      this.vendorCode = "";
      this.SelectedVendor = 0;
    }
  }
  ReferenceClear(event: any) {
    if (event.key === 'Backspace') {
      this.refNumberId = '';
      this.list = [];
      this.checkbox = false;
      this.SelectedVendor = 0;
    }


  }
}
