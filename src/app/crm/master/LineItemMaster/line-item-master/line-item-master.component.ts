import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { invoiceFlag } from 'src/app/Models/crm/master/invoiceFlag';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { LineitemmasterService } from './lineitemmaster.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';


@Component({
  selector: 'app-line-item-master',
  templateUrl: './line-item-master.component.html',
  styleUrls: ['./line-item-master.component.css','../../../../ums/ums.styles.css']
})
export class LineItemMasterComponent implements OnInit {
  LineItem!: FormGroup;
  Date = new Date();
  InvoicingFlags:invoiceFlag [] = [];
  LineItemCategory:lineitem [] = [];
  Livestatus = 1;
  SelectedInvFlgId: number;
  SelectedLineItemCategory: number;
  filteredLineItem: Observable<lineitem[]> | undefined;
  filteredInvoicingFlag: Observable<invoiceFlag[]> | undefined;
  titile: string;
  disablefields: boolean = false;
  showbutton: boolean;
  ShowUpdate: boolean;
  Showsave: boolean;
  ShowReset: boolean;
  userId$: string;
  filteredInvoOptions$: Observable<any[]>;
  invoicingFlagId: any;
  filteredInvoCtgOptions$: Observable<any[]>;
  lineItemCategoryId: any;
 
  constructor(private FB: FormBuilder,
    private service:LineitemmasterService,
    private ErrorHandling:ErrorhandlingService,
    private commonService: CommonService,
    private router: Router, 
    private route: ActivatedRoute,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
)
    {
    this.service.GetAllInvoiceFlag().subscribe((result) => {
      this.InvoicingFlags = result;
      this. Filters();
      console.log(result)
    });

    this.service.GetAllLineItemCategory(this.Livestatus).subscribe((result) => {
      this.LineItemCategory = result;
      console.log(result);
      this. Filters();
    });
  }

  ngOnInit(): void {
    this.getinvoList();
    this.getinvoCtgList();
    this.GetUserId();
    this.titile = "New Line Item";
    this.ShowUpdate = false;
    this.Showsave = true;
    this.ShowReset = true;
    this.InItializeForms();
    this.Filters();
    this.EditMode();
    this.ViewMode();
    if(this.disablefields){
      this.LineItem.controls['livestatus'].disable();
    }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  InItializeForms(){
    this.LineItem = this.FB.group({
      lineItemId: [0],
      lineItemCode: ["", [Validators.required]],
      lineItemName: ["", Validators.required],
      lineItemCategoryId: ["", Validators.required],
      invoicingFlagId: ["", Validators.required],
      sapReferenceCode: ["", Validators.required],
      livestatus: [true, Validators.required],
      createdBy: [parseInt(this.userId$), Validators.required],
      createdDate: [this.Date, Validators.required],
      updatedBy: [parseInt(this.userId$), Validators.required],
      updatedDate:[this.Date, Validators.required],
    });
  }
  EditMode(){
    debugger
    var Path1 = this.router.url;
    if (Path1 == "/crm/master/lineitemmaster/edit/" + this.route.snapshot.params["id"]) {
      this.titile = "Update Line Item";
      this.disablefields = false;
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
      if(this.disablefields){
        this.LineItem.controls['livestatus'].disable();
      }
      this.service
        .GetAllLineItemMasterById(this.route.snapshot.params["id"])
        .subscribe((result) => {
          console.log("result", result);
          this.LineItem.patchValue({
            lineItemId: result.lineItemId,
            lineItemCode: result.lineItemCode,
            lineItemName: result.lineItemName,
            lineItemCategoryId:result.lineItemCategoryName,
            invoicingFlagId:result.invoicingFlag,
            sapReferenceCode:result.sapReferenceCode,
            livestatus: result.livestatus,
            createdBy:result.createdBy,
            createdDate:result.createdDate,
            updatedBy:result.updatedBy,
            updatedDate:this.Date
          });
          this.invoicingFlagId=result.invoicingFlagId;
          this.lineItemCategoryId =result.lineItemCategoryId
          this.LineItem.controls['lineItemCategoryId'].setValue(result);
          this.LineItem.controls['invoicingFlagId'].setValue(result);
        });
    }
  }

  ViewMode(){
    var Path2 = this.router.url;
   
    if (Path2 == "/crm/master/lineitemmaster/view/" + this.route.snapshot.params["id"]) {
      this.titile = "View Line Item";
      this.disablefields = true;
      if(this.disablefields){
        this.LineItem.controls['livestatus'].disable();
      }
      this.ShowUpdate = false;
      this.Showsave = false;
      this.ShowReset = false;
      this.service
        .GetAllLineItemMasterById(this.route.snapshot.params["id"])
        .subscribe((result) => {
          console.log("result", result);
          this.LineItem.patchValue({
            lineItemId: result.lineItemId,
            lineItemCode: result.lineItemCode,
            lineItemName: result.lineItemName,
            lineItemCategoryId:result.lineItemCategoryName,
            invoicingFlagId:result.invoicingFlag,
            sapReferenceCode:result.sapReferenceCode,
            livestatus: result.livestatus,
            createdBy:result.createdBy,
            createdDate:result.createdDate,
            updatedBy:result.updatedBy,
            updatedDate:this.Date
          });
          this.LineItem.controls['lineItemCategoryId'].setValue(result);
          this.LineItem.controls['invoicingFlagId'].setValue(result);
        });
    }
  }

  Filters(){
    this.filteredInvoicingFlag = this.LineItem.get(
      "invoicingFlagId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );

    this.filteredLineItem = this.LineItem.get(
      "lineItemCategoryId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterLineItem(value))
    );
  }
  optionSelectedlineId(sline: string): void {
    const selectedCustomer = this.LineItemCategory.find(
      (customer) => customer.lineItemCategoryName === sline
    );
    if (selectedCustomer) {
      const selectedCustomerId = selectedCustomer.lineItemCategoryId;
      this.SelectedLineItemCategory = selectedCustomerId;
    }
  }
  optionSelectedinvId(sline: string): void {
    const selectedCustomer = this.InvoicingFlags.find(
      (customer) => customer.invoicingFlag === sline
    );
    if (selectedCustomer) {
      const selectedCustomerId = selectedCustomer.invoicingFlagId;
      this.SelectedInvFlgId = selectedCustomerId;
    }
  }

  optionSelectedINvoicingFlag(event: MatAutocompleteSelectedEvent): void {
    const selectedInvFlg = this.InvoicingFlags.find(
      (Invflg) => Invflg.invoicingFlag === event.option.viewValue
    );
    if (selectedInvFlg) {
      const selectedInvFlgId = selectedInvFlg.invoicingFlagId;
      this.SelectedInvFlgId = selectedInvFlgId;
    }
  }
  optionSelectedCategory(event: MatAutocompleteSelectedEvent): void {
    const selectedInvFlg = this.LineItemCategory.find(
      (Invflg) => Invflg.lineItemCategoryName === event.option.viewValue
    );
    if (selectedInvFlg) {
      const selectedInvFlgId = selectedInvFlg.lineItemCategoryId;
      this.SelectedLineItemCategory = selectedInvFlgId;
    }
  }
  private _filter(value: string): any[] {
    if(value==null){
      return [];
    }
    const filterValue = value.toLowerCase();

    if (filterValue === '%') {
      return this.InvoicingFlags; 
    }
    return this.InvoicingFlags.filter((invflg) =>
    invflg.invoicingFlag.toLowerCase().includes(filterValue)
    );
  }

  private _filterLineItem(value: string): any[] {

    if(value==null){
      return [];
    }
    const filterValue = value.toLowerCase();

    if (filterValue === '%') {
      return this.LineItemCategory; 
    }
    return this.LineItemCategory.filter((invflg) =>
    invflg.lineItemCategoryName.toLowerCase().includes(filterValue)
    );
  }

//#region  InvoicingFlags
  getinvoList() {
    this.service.GetAllInvoiceFlag().subscribe((result) => {
      this.InvoicingFlags = result;
      this.InvoListFun();
    });
  }
  InvoListFun() {
    this.filteredInvoOptions$ = this.LineItem.controls['invoicingFlagId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.invoicingFlag)),
      map((name: any) => (name ? this.filteredInvoOptions(name) : this.InvoicingFlags?.slice()))
    );
  }
  private filteredInvoOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.InvoicingFlags.filter((option: any) => option.invoicingFlag.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatainvo();
  }
  NoDatainvo(): any {
    this.LineItem.controls['invoicingFlagId'].setValue('');
    return this.InvoicingFlags;
  }
  displayInvoLabelFn(data: any): string {
    return data && data.invoicingFlag ? data.invoicingFlag : '';
  }
  InvoSelectedoption(data: any) {
    debugger
    let selectedIncoterm = data.option.value;
    this.invoicingFlagId = selectedIncoterm.invoicingFlagId;
  }

//#endregion

//#region  lineItemCategory
getinvoCtgList() {
  this.service.GetAllLineItemCategory(this.Livestatus).subscribe((result) => {
    this.LineItemCategory = result;
    this. InvoCtgListFun();
  });
}
InvoCtgListFun() {
  this.filteredInvoCtgOptions$ = this.LineItem.controls['lineItemCategoryId'].valueChanges.pipe(
    startWith(''),
    map((value: any) => (typeof value === 'string' ? value : value?.lineItemCategoryName)),
    map((name: any) => (name ? this.filteredInvoCtgOptions(name) : this.LineItemCategory?.slice()))
  );
}
private filteredInvoCtgOptions(name: string): any[] {
  const filterValue = name.toLowerCase();
  const results = this.LineItemCategory.filter((option: any) => option.lineItemCategoryName.toLowerCase().includes(filterValue));
  return results.length ? results : this.NoDatainvoCtg();
}
NoDatainvoCtg(): any {
  this.LineItem.controls['lineItemCategoryId'].setValue('');
  return this.LineItemCategory;
}
displayInvoCtgLabelFn(data: any): string {
  return data && data.lineItemCategoryName ? data.lineItemCategoryName : '';
}
InvoCtgSelectedoption(data: any) {
  debugger
  let selectedIncoterm = data.option.value;
  this.lineItemCategoryId = selectedIncoterm.lineItemCategoryId;
}

//#endregion



  Savedata(){
    const LineItemMaster = {
      ...this.LineItem.value,
      lineItemCategoryId: this.lineItemCategoryId,
      invoicingFlagId: this.invoicingFlagId,
    };
    LineItemMaster.updatedBy=parseInt(this.userId$)
    console.log("Form Value===>",LineItemMaster);
    if (this.LineItem.valid) {
      this.service.CreateLineItemMaster(LineItemMaster).subscribe({
        next: (res:any) => {

          if(res?.message === '1'){
            this.commonService.displayToaster(
              "error",
              "Error",
              'The Line Item Code you entered already exist'
            );
            this.LineItem.controls['lineItemCode'].reset();
            this.LineItem.controls['lineItemCode'].markAllAsTouched();
          } else if(res?.message === '2'){
            this.commonService.displayToaster(
              "error",
              "Error",
              'The Line Item Name you entered already exist'
            );
            this.LineItem.controls['lineItemName'].reset();
            this.LineItem.controls['lineItemName'].markAllAsTouched();
          } else if(res?.message === '3'){
            this.commonService.displayToaster(
              "error",
              "Error",
              'The SAP Reference Code you entered already exist'
            );
            this.LineItem.controls['sapReferenceCode'].reset();
            this.LineItem.controls['sapReferenceCode'].markAllAsTouched();
          } else {
            this.commonService.displayToaster(
              "success",
              "Success",
              res.message
            );
            this.LineItem.reset();
            this.InItializeForms();
            this.Filters();
            this.PageNavigation();
          }

          
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
        },
      });

    }else{
      this.LineItem.markAllAsTouched();
      this.validateall(this.LineItem);
    }
    
  }
  Update(){
    this.Savedata();   
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

  reset(){
    this.LineItem.reset();
    this.InItializeForms();
    this.Filters();
    var Path1 = this.router.url;
    if (Path1 == "/crm/master/lineitemmaster/edit/" + this.route.snapshot.params["id"]) {
      this.EditMode();
    }
  }

  PageNavigation() { 
      this.router.navigate(["/crm/master/lineitemmaster"]);
  }

}
