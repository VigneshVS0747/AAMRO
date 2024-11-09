import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EnquiryService } from '../../Enquiry/enquiry.service';
import { Observable, map, startWith } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Enquiry } from 'src/app/Models/crm/master/transactions/Enquiry';
import { RfqService } from '../rfq.service';
import { Rfqgeneral } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PurchaseQuotation } from '../../purchese-quotation/purchase-quotation.model';
import { MaingridComponent } from '../subgrids/maingrid/maingrid.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pqcompare',
  templateUrl: './pqcompare.component.html',
  styleUrls: ['./pqcompare.component.css']
})
export class PqcompareComponent implements OnInit {
  PQcompare: FormGroup;
  Enquiry:Enquiry[];
  SelectedRefNumberId: any;
  filteredRefNumberIds: Observable<any[]> | undefined;
  filteredRfqNumberIds: Observable<any[]> | undefined;
  RFQ:Rfqgeneral[]=[];
  SelectedRfqNumberId: number;
  showWeightScale = false;
  PQcompareList:PurchaseQuotation[]=[]
  selectedVendors: any[]=[];

constructor(private Es:EnquiryService,
  private Fb: FormBuilder,
  private SRFQ: RfqService,
  public dialogRef: MatDialogRef<PqcompareComponent>,public dialog: MatDialog,){

}

ngOnInit(): void {
  this.PQform();
  this.Es.GetOpenEnquiry().subscribe(res=>{
    this.Enquiry=res;
    this.Filter();
  });
this.SRFQ.GetAllopenRfq().subscribe(response=>{
  this.RFQ=response;
  this.Filter();
});

// Show the weight scale icon when the component initializes
this.showWeightScale = true;

// Hide the weight scale icon after the animation completes
setTimeout(() => {
  this.showWeightScale = false;
}, 2000); // The duration of the animation (3s)
}

PQform() {
  this.PQcompare = this.Fb.group({ 
    refNumberId: [""],
    rfqNumberId: [""],
  });

}

  optionSelectedRefNumber(event: MatAutocompleteSelectedEvent): void {
    const selectedRefNumber = this.Enquiry.find(
      (ref) => ref.enquiryNumber === event.option.viewValue
    );
    if (selectedRefNumber) {
      const selectedRefNumberId = selectedRefNumber.enquiryId;
      this.SelectedRefNumberId = selectedRefNumberId;
    }
  }
  optionSelectedRfqNumber(event: MatAutocompleteSelectedEvent): void {
    const selectedRefNumber = this.RFQ.find(
      (ref) => ref.rfqNumber === event.option.viewValue
    );
    if (selectedRefNumber) {
      const selectedRefNumberId = selectedRefNumber.rfqId;
      this.SelectedRfqNumberId = selectedRefNumberId;

    }

    this.SRFQ.GetPqcomparevendor(this.SelectedRfqNumberId).subscribe((res=>{
      this.PQcompareList=res;     
    }));
  }

  Filter(){
    this.filteredRefNumberIds = this.PQcompare.get(
      "refNumberId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.enquiryNumber)),
      map((name: any) => (name ? this._filterRefNumbers(name) : this.Enquiry?.slice()))
    );

    this.filteredRfqNumberIds = this.PQcompare.get(
      "rfqNumberId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.rfqNumber)),
      map((name: any) => (name ? this._filterRfqNumbers(name) : this.RFQ?.slice()))
    );
  }

  private _filterRefNumbers(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.Enquiry.filter((ref) =>
      ref.enquiryNumber.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.PQcompare.controls["refNumberId"].setValue("");
    }

    return filterresult;
  }

  private _filterRfqNumbers(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.RFQ.filter((ref) =>
      ref.rfqNumber.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.PQcompare.controls["rfqNumberId"].setValue("");
    }

    return filterresult;
  }

  close(){
     this.dialogRef.close();
  }
  vendorsFilters(vendorId: number, isChecked: boolean): void {
    if (isChecked) {
      // Add the vendorId if the checkbox is checked
      this.selectedVendors.push(vendorId);
    } else {
      // Remove the vendorId if the checkbox is unchecked
      const index = this.selectedVendors.indexOf(vendorId);
      if (index > -1) {
        this.selectedVendors.splice(index, 1);
      }
    }
    console.log("this.selectedVendors",this.selectedVendors); // for debugging purposes
  }

  Compare(){   
    if(this.selectedVendors.length<=2){
      let vendorids: string = this.selectedVendors.join(','); // "1,2,3,4,5"
      this.SRFQ.GetVendorsByName(vendorids,this.SelectedRfqNumberId).subscribe((res=>{
        const dialogRef = this.dialog.open(MaingridComponent, {
          data: {
            list:res
          }, disableClose: true, autoFocus: false
        });
      }));
    }else{
      Swal.fire({
        icon: "error",
        title: "Please Select",
        text: "Please Select atleaset two vendors",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
    }
    
  }
}
