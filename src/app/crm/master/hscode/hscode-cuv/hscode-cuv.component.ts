import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HscodeService } from '../hscode.service';
import { Observable, catchError, map, startWith } from 'rxjs';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { Documents,  HsCode, 
  HsCodeCategory,  HsCodeDocument,
  HsCodeModelContainer, HsCodePart, 
  HsCodePermit, Partdetails,
  Permitdetails } from 'src/app/Models/crm/master/HsCode';
import Swal from 'sweetalert2';
import { DocmentsService } from '../../document/document.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-hscode-cuv',
  templateUrl: './hscode-cuv.component.html',
  styleUrls: ['./hscode-cuv.component.css']
})
export class HscodeCuvComponent {
  hscodegeneralForm: FormGroup;
  processTitle: string = 'Add';
  Livestaus = 1;
  hscodecommonID:number=0;
  keywordpermit = "permitName";

  CountryDatalist: Country[] = [];
  filteredCountryOptions$: Observable<any[]>;
  countryIdValue: number;
  skip = 0;
  HscodecategoryDatalist:HsCodeCategory[]=[];
  filteredHscodecategoryOptions$: Observable<any[]>;
  hscodecategoryIdValue:number;

  // PartDataList: Partdetails[]=[];
  // filteredPartOptions$: Observable<any[]>;
  // partIdValue:number;

  // DocumentDataList: Documents[]=[];
  // filteredDocumentOptions$: Observable<any[]>;
  // documentIdValue:number;

  hscodeMasterDataModel: HsCode = new HsCode();
  
  //hscodeParttemparr: HsCodePart[]=[];
  parts:Partdetails[]=[];
  hscodePartarr: HsCodePart[]=[];
  hscodePartArray: HsCodePart[]=[];
  showAddRowPart: boolean;
  partName:string;
  keywordPart='partName';
  duty:number|null;
  tax:number |null;
  addtax:number |null;
  partNumber:number;
  existPart:boolean
  editPart:any;
  removePart:HsCodePart[];

  Permit:Permitdetails[]=[];
  permitIdValue:number;
  getHscodeData: any;
  hscodePermitarr: HsCodePermit[]=[];
  hscodePermitArray:HsCodePermit[]=[];
  onSelectPermit: boolean;
  permitCode:string;
  permitName:string;
  rowIndexforPermit:number;
  editPermit:any;
  removepermit: HsCodePermit[];
  showAddRowPermitItem: boolean | undefined;
  Date = new Date();
  permitId:number;
  existpermitItem: boolean;
  keywordPermit = 'permitcode';
  onSelectPart:boolean;
  rowIndexforPart:number;
  partId:number;

  hscodeDocumentarr:HsCodeDocument[]=[];
  documents: Documents[] = [];
  hscodeDocArray:HsCodeDocument[]=[];
  showAddRowDoc: boolean=false;
  existDoc: boolean;
  onSelectDoc: boolean;
  rowIndexforDoc: number;
  editDoc:any;
  removeDoc: HsCodeDocument[];
  documentId: number;
  documentCode: string;
  documentName: string;
  keywordDoc = 'documentName'
  doclivestatus:boolean=true;
  
  viewMode:boolean=false
  pageSize = 10;
  @ViewChild('submitdocButton') submitdocButton!: ElementRef;
  @ViewChild('canceldocButton') canceldocButton!: ElementRef;
  userId$: string;
  selectedIndex = 0;


  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private hscodeSvc: HscodeService,
    private docmentsService: DocmentsService,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService

  ) { 
    this.getCountryMasterListdata();
    this.getHscodecategoryMasterListdata();
    this.getAllPermits();
    this.getDocumentList();
    this.getpartList();
  }

  ngOnInit(): void { 
    this.GetUserId();
    this.hscodegeneralForm = this.formbuilder.group({
      hSCodeId:0,
      hsCode: ["", Validators.required],
      hsCodeDescription: [""],
      country: ["", Validators.required],
      eccn: ["" ],
      hsCodCategory: ["", Validators.required ],
      remarks:[''],
      permit:[''],
      part:[''],
      document:[''],
      livestatus:true
    });

    if (!this.hscodeSvc.itemId && !this.hscodeSvc.isView) {
      this.hscodeSvc.GetAllDocumentMappingByScreenId(11).subscribe(res => {
        if (res) {
          this.hscodeDocumentarr = res.map(ele => {
            return {
              HSCodeDocumentId: 0,
              HSCodeId: 0,
              DocumentId: ele.documentId,
              livestatus: true,
              CreatedBy: parseInt(this.userId$),
              CreatedDate: this.Date,
              UpdatedBy: parseInt(this.userId$),
              UpdatedDate: this.Date,
              IseditDoc: false,
              documentName: ele.documentName,
              documentCode: '',
              remarks: '',
              newDoc: true
            };
          });
          this.hscodeDocumentarr = [...this.hscodeDocumentarr];
          this.hscodeDocArray = [...this.hscodeDocumentarr];
        }
        console.log(this.hscodeDocumentarr)
      });
    }

    if(this.hscodeSvc.itemId && !this.hscodeSvc.isView){
      this.processTitle='Edit';
      this.hscodeSvc.getHscodebyId(this.hscodeSvc.itemId).subscribe(res=>{
        this.getHscodeData=res;
        console.log("this.getHscodeData",this.getHscodeData);
        this.hscodeDocumentarr=this.getHscodeData.hsCodeDocuments;
       this.hscodePermitarr=this.getHscodeData.hsCodePermits;
       this.hscodePartarr=this.getHscodeData.hsCodeParts;

       this.hscodePermitArray=this.getHscodeData.hsCodePermits;
       this.hscodePartArray=this.getHscodeData.hsCodeParts;
       this.hscodeDocArray=this.getHscodeData.hsCodeDocuments;

       console.log("this.hscodePartArray",this.hscodePartArray);
       this.hscodePartArray.forEach(data=>{
        if(data.updatedBy!=1){
          data.updatedBy=1
        }
      })
      this.hscodePermitArray.forEach(data=>{
        if(data.updatedBy!=1){
          data.updatedBy=1
        }
      })
      this.hscodeDocArray.forEach(data=>{
        if(data.UpdatedBy!=1){
          data.UpdatedBy=1
        }
      })
         this.setHscodevalues();
      })
    }
    if(this.hscodeSvc.itemId&&this.hscodeSvc.isView){
      this.view();
      this.viewMode=true;
   }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  returnToList() {
    this.router.navigate(['crm/master/hscode']);
  }
  view(){
    this.processTitle='View';
    this.hscodeSvc.getHscodebyId(this.hscodeSvc.itemId).subscribe(res=>{
      this.getHscodeData=res;
      if(this.getHscodeData!=0){
        this.getHscodeData=res;
        this.hscodeDocumentarr=this.getHscodeData.hsCodeDocuments;
       this.hscodePermitarr=this.getHscodeData.hsCodePermits;
       this.hscodePartarr=this.getHscodeData.hsCodeParts;

       this.hscodePermitArray=this.getHscodeData.hsCodePermits;
       this.hscodePartArray=this.getHscodeData.hsCodeParts;
       this.hscodeDocArray=this.getHscodeData.hsCodeDocuments;
        this.setFormControlsReadonly(true);
        this.setHscodevalues();
      }
    })
  }
  //dynamically make all the form controls readonly if view
  setFormControlsReadonly(readonly: boolean): void {
    Object.keys(this.hscodegeneralForm.controls).forEach(controlName => {
      const control = this.hscodegeneralForm.get(controlName);
      if (control) {
        if (readonly) {
          control.disable();
        } else {
          control.enable();
        }
      }
    });
  }
  //#endregion
  setHscodevalues(){    
    this.hscodecommonID=this.getHscodeData.hsCodes.hsCodeId;
    this.countryIdValue=this.getHscodeData.hsCodes.countryId;
    this.hscodecategoryIdValue=this.getHscodeData.hsCodes.hsCodeCategoryId;
    this.hscodegeneralForm.controls['hsCode'].setValue(this.getHscodeData.hsCodes.hsCode);
    this.hscodegeneralForm.controls['hsCodeDescription'].setValue(this.getHscodeData.hsCodes.hsCodeDescription);
    this.hscodegeneralForm.controls['country'].setValue(this.getHscodeData.hsCodes);
    this.hscodegeneralForm.controls['eccn'].setValue(this.getHscodeData.hsCodes.eccn);
    this.hscodegeneralForm.controls['hsCodCategory'].setValue(this.getHscodeData.hsCodes);
    this.hscodegeneralForm.controls['remarks'].setValue(this.getHscodeData.hsCodes.remarks);
    this.hscodegeneralForm.controls['livestatus'].setValue(this.getHscodeData.hsCodes.livestatus); 
    this.hscodeDocumentarr=this.getHscodeData.hsCodeDocuments;
    this.hscodePermitarr=this.getHscodeData.hsCodePermits;
    this.hscodePartarr=this.getHscodeData.hsCodeParts;
    this.hscodeDocumentarr = [...this.hscodeDocumentarr];
    this.hscodePermitarr = [...this.hscodePermitarr];
       this.hscodePartarr = [...this.hscodePartarr];
  }
   //#region 
 
  getAllPermits(){
    this.hscodeSvc.getallActivePermitCode().subscribe(res=>{
        this.Permit=res;

        console.log("res--------->",res);
      });
  }
  AddPermit() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRowPermitItem) {
      const newRow: HsCodePermit = {
        hsCodePermitId: 0,
        hsCodeId: 0,
        permitId: 0,
        permitCode: '',
        permitName: '',
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        IseditPermit: true,
        newPermit: true
      };
      this.permitCode = '';
      this.permitName='';
      this.hscodePermitarr = [newRow, ...this.hscodePermitarr];
      this.showAddRowPermitItem = true;
    }
    console.log(this.showAddRowPermitItem);
    
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  SavePermit(data: HsCodePermit) {
    if (data.permitName!="") {

      data.permitName = this.permitName;
      data.permitCode = this.permitCode;
      data.permitId = this.permitId;
      data.createdBy=parseInt(this.userId$);
      data.updatedBy=parseInt(this.userId$);
      this.hscodePermitArray.forEach(element => {
        if (element.permitName === data.permitName) {
          this.existDoc = true
        }
      });
      if (this.existDoc) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Already exist",
          showConfirmButton: false,
          timer: 2000,
        });
        this.showAddRowDoc = true;
        data.IseditPermit = true;
        this.existDoc = false;
        return;
      }
      else {
        this.hscodePermitArray.push(data);
        this.showAddRowPermitItem = false;
        data.IseditPermit = false;
        data.newPermit = false;
      }
      }else{
        this.onSelectPermit=false;
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the mandatory fields",
          showConfirmButton: false,
          timer: 2000,
        });
      
      }
      
    }
    selectpermitsevent(item: any) {
      console.log(item);
      
      this.onSelectPermit = true;
      this.permitId = item.permitId;
      this.permitCode = item.permitCode;
      this.permitName = item.permitName;
    }
    ValidateField(item:any){
      if (item !== '') {
        return false;
      } else {
        return true;
      }
    }
    Editpermit(obj:HsCodePermit){
      console.log('b4',this.hscodePermitArray);
      console.log(this.hscodePermitarr);
      obj.IseditPermit = true;
    this.permitCode =obj.permitCode;
    this.permitName = obj.permitName;
    const rowIndex = this.hscodePermitArray.indexOf(obj);
    this.rowIndexforPermit = rowIndex;
    this.editPermit= { ...obj };
    this.removepermit = this.hscodePermitArray.splice(rowIndex, 1)
    this.onSelectPermit = false;
    console.log('after',this.hscodePermitArray);
    console.log(this.hscodePermitarr);
    
    }
    Deletepermit(obj:any){
    const rowIndex = this.hscodePermitArray.indexOf(obj);
    this.hscodePermitArray.splice(rowIndex,1);
    //this.hscodePermitarr.splice(rowIndex,1);
    this.hscodePermitarr = [...this.hscodePermitArray];
    obj.IseditDoc = false;
    this.showAddRowDoc = false;
    }
    Updatepermit(obj:HsCodePermit){
      if (obj.permitCode == ""||obj.permitCode == undefined||obj.permitCode == null) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the mandatory fields",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
      obj.updatedBy=parseInt(this.userId$);
      obj.permitName = this.permitName;
      obj.permitCode = this.permitCode;
      obj.permitId = this.permitId;
      obj.createdBy=1;
      obj.updatedBy=1;
      if (this.onSelectPermit) {
        obj.permitName = this.permitName;
        obj.permitCode = this.permitCode;
        obj.permitId = this.permitId;
        obj.createdBy=1;
        obj.updatedBy=1;
      }
      this.hscodePermitArray.forEach(element => {
        if (element.permitName === obj.permitName) {
          this.existpermitItem = true;
        }
      });
      if (this.existpermitItem) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Already exist",
          showConfirmButton: false,
          timer: 2000,
        });
        this.showAddRowPermitItem = true;
        obj.IseditPermit = true;
        this.existpermitItem = false;
        return;
      }
      else {
        obj.createdBy=1;
        obj.updatedBy=1;
        this.hscodePermitArray.push(obj);
        this.hscodePermitArray.forEach(data=>{
          if(data.updatedBy!=1){
            data.updatedBy=1
          }
        })
        this.showAddRowPermitItem = false;
        obj.IseditPermit = false;
        obj.newPermit = false;
      }
    }
    oncancelpermit(obj:any){
      this.hscodePermitArray=this.hscodePermitarr;
    const rowIndex = this.hscodePermitarr.indexOf(obj);
 
    if (obj.newPermit&&!this.removepermit) {
      this.hscodePermitarr.splice(rowIndex,1);
      //this.hscodePermitArray.splice(rowIndex,1);
      this.hscodePermitarr = [...this.hscodePermitarr];
      this.showAddRowPermitItem=false;
      obj.newPermit = false;
      return;
    }
    if(obj.IseditPermit&&this.removepermit){
      this.hscodePermitarr.splice(rowIndex,1);
      //this.hscodePermitArray.splice(rowIndex,1)
      // this.hscodePermitarr.splice(rowIndex,0, this.editPermit);
      this.hscodePermitArray.splice(rowIndex,0,this.editPermit);
      this.hscodePermitarr = [...this.hscodePermitarr];
      this.showAddRowPermitItem=false;
      this.editPermit.IseditPermit = false;
      obj.newPermit = false;
    }
    else{
    this.hscodePermitarr.splice(rowIndex,0, this.editPermit);
    this.hscodePermitArray.splice(rowIndex,0,this.editPermit);
    this.hscodePermitarr = [...this.hscodePermitarr];
    this.editPermit.IseditPermit = false;
    this.showAddRowPermitItem = false;
    obj.newPermit = false;
    }
    }

     //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressPermit(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRowDoc ? this.SaveDoc(dataItem) : this.UpdateDoc(dataItem);
    }
  }
  /// to reach submit button
  // handleChangepermit(event: any, dataItem: any) {
  //   if (event.key === 'Tab' || event.key === 'Enter') {
  //     this.submitdocButton.nativeElement.focus();
  //   }
  // }
  /// to reach cancel button
  handleChangepermit(event: any) {
    if (event.key === 'Tab') {
      this.canceldocButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressPermit(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelDoc(dataItem)
    }
  }
  //#endregion

  //#region country autocomplete
  getCountryMasterListdata() {
    this.hscodeSvc.getCountries(this.Livestaus).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
    });
  }
  CountryTypeFun() {
    this.filteredCountryOptions$ = this.hscodegeneralForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this.filterCountryFunType(name) : this.CountryDatalist?.slice()))
    );
  }
  private filterCountryFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    //return this.CountryDatalist.filter((option: any) => option.country.toLowerCase().includes(filterValue));
    const results = this.CountryDatalist.filter((option: any) => option.countryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoData();
  }
  NoData(): any {
    this.hscodegeneralForm.controls['country'].setValue('');
    //this.countryIdValue = 0;
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.countryIdValue = selectedCountry.countryId;
  }
  //#endregion

  //#region Hscodecategory autocomplete
  getHscodecategoryMasterListdata() {
    this.hscodeSvc.getallHSCodecategory(this.Livestaus).subscribe(result => {
        this.HscodecategoryDatalist = result;
        this.HscodecategoryTypeFun();
    });
  }
  HscodecategoryTypeFun() {
    this.filteredHscodecategoryOptions$ = this.hscodegeneralForm.controls['hsCodCategory'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.hsCodeCategoryName)),
      map((name: any) => (name ? this.filterHscodecategoryFunType(name) : this.HscodecategoryDatalist?.slice()))
    );
  }
  private filterHscodecategoryFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    //return this.StateDatalist.filter((option: any) => option.state.toLowerCase().includes(filterValue));
    const results = this.HscodecategoryDatalist.filter((option: any) => option.hsCodeCategoryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.HSCodeCategoryNoData();
  }
  HSCodeCategoryNoData(): any {
    this.hscodegeneralForm.controls['hsCodCategory'].setValue('');
    this.hscodecategoryIdValue = 0;
    return this.HscodecategoryDatalist;
  }
  displayHSCodeCategoryLabelFn(Hscodecategorydata: any): string {
    return Hscodecategorydata && Hscodecategorydata.hsCodeCategoryName ? Hscodecategorydata.hsCodeCategoryName : '';
  }

  clearHscodecategoryNameData() {
    //this.HSCodeCategoryNameValue = 0;
    this.hscodegeneralForm.controls['hsCodCategory'].reset();
  }

  HscodecategorySelectedoption(HscodecategoryData: any) {
    let selectedHscodecategory = HscodecategoryData.option.value;
    this.hscodecategoryIdValue = selectedHscodecategory.hsCodeCategoryId;
  }
  //#endregion
  //#region Document
  getDocumentList() {
    this.docmentsService.getDocuments(this.Livestaus).subscribe(res => {
      this.documents = res;
    });
  }
  AddDocument() {
    if (!this.showAddRowDoc) {
      const newRow: HsCodeDocument = {
        HSCodeDocumentId: 0,
        HSCodeId: 0,
        DocumentId: 0,
        livestatus: true,
        CreatedBy: parseInt(this.userId$),
        CreatedDate: this.Date,
        UpdatedBy: parseInt(this.userId$),
        UpdatedDate: this.Date,
        IseditDoc: true,
        documentName: '',
        documentCode: '',
        remarks:'',
        newDoc: true
      };
      this.documentCode = ''
      this.hscodeDocumentarr = [newRow, ...this.hscodeDocumentarr];
      this.showAddRowDoc = true;
    }
  }
  SaveDoc(data: HsCodeDocument) {
  if (data.documentName ==null || data.documentName ==undefined) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.documentName = this.documentName;
    data.documentCode = this.documentCode;
    data.DocumentId = this.documentId;
    data.livestatus=this.doclivestatus;
    data.CreatedBy=parseInt(this.userId$);
    data.UpdatedBy=parseInt(this.userId$);
    this.hscodeDocArray.forEach(element => {
      if (element.documentName === data.documentName) {
        this.existDoc = true
      }
    });
    if (this.existDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowDoc = true;
      data.IseditDoc = true;
      this.existDoc = false;
      return;
    }
    else {
      this.hscodeDocArray.push(data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
    this.onSelectDoc=false;
  }

  UpdateDoc(data: HsCodeDocument) {
    if (data.documentName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.documentName = this.documentName;
    data.documentCode = this.documentCode;
    data.DocumentId = this.documentId;
    data.livestatus=this.doclivestatus
    data.CreatedBy=parseInt(this.userId$);
    data.UpdatedBy=parseInt(this.userId$);
    if (this.onSelectDoc) {
      data.documentName = this.documentName;
      data.documentCode = this.documentCode;
      data.DocumentId = this.documentId;
      data.CreatedBy=parseInt(this.userId$);
    data.UpdatedBy=parseInt(this.userId$);
    }
    this.hscodeDocArray.forEach(element => {
      if (element.documentName === data.documentName) {
        this.existDoc = true;
      }
    });
    if (this.existDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowDoc = true;
      data.IseditDoc = true;
      this.existDoc = false;
      return;
    }
    else {
      data.CreatedBy=parseInt(this.userId$);
      data.UpdatedBy=parseInt(this.userId$);
      this.hscodeDocArray.push(data);
      this.hscodeDocArray.forEach(data=>{
        if(data.UpdatedBy!=1){
          data.UpdatedBy=1
        }
      })
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
  }
  EditDoc(data: any) {    
    data.IseditDoc = true;
    this.documentCode =data.documentCode;
    this.documentName = data.documentName;
    this.doclivestatus=data.livestatus;

    const rowIndex = this.hscodeDocArray.indexOf(data);
    this.rowIndexforDoc = rowIndex;
    this.editDoc= { ...data };
    this.removeDoc = this.hscodeDocArray.splice(rowIndex, 1)
    this.onSelectDoc = false;
  }
  // Deletedoc(data: PotentialCustomerDocument) {
  //   debugger
  //   const rowIndex = this.pcDocumentArray.indexOf(data);
  //   this.pcDocumentArray.splice(rowIndex,1);
  //   this.potentialCustomerDocuments.splice(rowIndex,1);
  //   this.potentialCustomerDocuments = [...this.potentialCustomerDocuments];
  //   data.IseditDoc = false;
  //   this.showAddRowDoc = false;
  // }
  Deletedoc(data: HsCodeDocument) {
    debugger
    if(this.hscodeSvc.itemId && !this.hscodeSvc.isView){
      const rowIndex = this.hscodeDocArray.indexOf(data);    
      this.hscodeDocArray.splice(rowIndex,1);
      //this.hscodeDocumentarr.splice(rowIndex,1);    
      this.hscodeDocumentarr = [...this.hscodeDocArray];
      data.IseditDoc = false;
      this.showAddRowDoc = false;
    }
     else{
      const rowIndex = this.hscodeDocArray.indexOf(data);    
      this.hscodeDocArray.splice(rowIndex,1);
      //this.hscodeDocumentarr.splice(rowIndex,1);    
      this.hscodeDocumentarr = [...this.hscodeDocArray];
      data.IseditDoc = false;
      this.showAddRowDoc = false;
     }
    
    
  }
  oncancelDoc(data: any) {
    const rowIndex = this.hscodeDocumentarr.indexOf(data);
    if (data.newDoc) {
      this.hscodeDocumentarr.splice(rowIndex,1);
      this.hscodeDocArray.splice(rowIndex,1);
      this.hscodeDocumentarr = [...this.hscodeDocumentarr];
      this.showAddRowDoc=false;
      data.newDoc = false;
      return;
    }
    if(data.IseditDoc){
   
      this.hscodeDocumentarr.splice(rowIndex,1);
      this.hscodeDocumentarr.splice(rowIndex,0, this.editDoc);
      this.hscodeDocArray.splice(rowIndex,0,this.editDoc);
      this.hscodeDocumentarr = [...this.hscodeDocumentarr];
      this.showAddRowDoc=false;
      this.editDoc.IseditDoc = false;
      data.newDoc = false;
    }
    else{
    this.hscodeDocumentarr.splice(rowIndex,0, this.editDoc);
    this.hscodeDocArray.splice(rowIndex,0,this.editDoc);
    this.hscodeDocumentarr = [...this.hscodeDocumentarr];
    this.editDoc.IseditDoc = false;
    this.showAddRowDoc = false;
    data.newDoc = false;
    }
  }
  selectDocevent(item: any) {
    this.onSelectDoc = true;
    this.documentId = item.documentId;
    this.documentCode = item.documentCode;
    this.documentName = item.documentName;
  }

  ValidateFieldDoc(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }
  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressDoc(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRowDoc ? this.SaveDoc(dataItem) : this.UpdateDoc(dataItem);
    }
  }
  /// to reach submit button
  handleChangeDoc(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitdocButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeDoc(event: any) {
    if (event.key === 'Tab') {
      this.canceldocButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressDoc(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelDoc(dataItem)
    }
  }
  //#endregion

  //#region Part
  getpartList(){
    this.hscodeSvc.getallPartdetails(this.Livestaus).subscribe(res=>{
      this.parts=res;
    })
  }
  AddPart(){
    if (!this.showAddRowPart) {
      const newRow: HsCodePart = {
        hSCodePartId: 0,
        hSCodeId: 0,
        partId:null,
        duty:null,
        tax: null,
        addTax: null,
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        IseditPart: true,
        newPart: true,
        createdBy: 1,
        partName: '',
        partNumber:''
      };
      this.tax=null;
      this.addtax=null;
      this.duty=null;
      this.partName='';
      this.hscodePartarr = [newRow, ...this.hscodePartarr];
      this.showAddRowPart = true;
    }
  }
  EditPart(data: any) {    
    data.IseditPart = true;
    this.partId=data.partId
    this.partNumber =data.partNumber;
    this.partName = data.partName;
    const rowIndex = this.hscodePartArray.indexOf(data);
    this.rowIndexforPart = rowIndex;
    this.editPart= { ...data };
    this.removePart = this.hscodePartArray.splice(rowIndex, 1)
    this.onSelectPart = false;
    console.log(this.partNumber,data.partNumber);
    
  }
  Deletepart(obj:any){
    const rowIndex = this.hscodePartArray.indexOf(obj);
    this.hscodePartArray.splice(rowIndex,1);
    console.log(this.hscodePartArray);
    
    //this.hscodeDocumentarr.splice(rowIndex,1);
    this.hscodePartarr = [...this.hscodePartArray];
    obj.IseditPart = false;
    this.showAddRowPart = false;
  }
  hndlKeyPressPart(event: any, dataItem: any){
  }
  SavePart(obj:any){
    if(obj.partNumber !=null &&  obj.tax!=null && obj.duty!=null && obj.addTax!=null ){
      obj.partNumber=this.partNumber;
    obj.partName=this.partName;
    obj.partId=this.partId; 
    this.hscodePartArray.forEach(element => {
      if (element.partNumber === obj.partNumber) {
        this.existPart = true
      }
    });
    if (this.existPart) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowPart = true;
      obj.IseditPart = true;
      this.existPart = false;
      return;
    }
    else {
      this.hscodePartArray.push(obj);
      this.showAddRowPart = false;
      obj.IseditPart = false;
      obj.newPart = false;
    }
    this.onSelectPart=false;
     
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
    }
   
  }
  UpdatePart(obj:any){
    if (obj.partNumber !=null &&  obj.tax!=null && obj.duty!=null && obj.addTax!=null )  {
      obj.partName = this.partName;
      obj.partNumber = this.partNumber;
      obj.partId=this.partId;
      obj.CreatedBy=parseInt(this.userId$);
      obj.UpdatedBy=parseInt(this.userId$);
      
      if (this.onSelectPart) {
        obj.partName = this.partName;
      obj.partNumber = this.partNumber;
      obj.tax = this.tax;
      obj.duty = this.duty;
      obj.addTax=this.addtax;
      obj.CreatedBy=parseInt(this.userId$);
      obj.UpdatedBy=parseInt(this.userId$);
      }
      this.hscodePartArray.forEach(element => {
        if (element.partName === obj.partName) {
          this.existPart = true;
        }
      });
      if (this.existPart) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Already exist",
          showConfirmButton: false,
          timer: 2000,
        });
        this.showAddRowPart = true;
        obj.IseditPart = true;
        this.existPart = false;
        return;
      }
      else {
        obj.CreatedBy=parseInt(this.userId$);
        obj.UpdatedBy=parseInt(this.userId$);
        this.hscodePartArray.push(obj);
        this.hscodePartArray.forEach(data=>{
          if(data.updatedBy!=1){
            data.updatedBy=1
          }
        })
        this.showAddRowPart = false;
        obj.IseditPart = false;
        obj.newPart = false;
      }
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
    }
   
  }
  handleKeyPressPart(event: any, dataItem: any){}
  oncancelPart(data:any){
    const rowIndex = this.hscodePartarr.indexOf(data);
    if (data.newPart) {
      this.hscodePartarr.splice(rowIndex,1);
      this.hscodePartArray.splice(rowIndex,1);
      this.hscodePartarr = [...this.hscodePartarr];
      this.showAddRowPart=false;
      data.newPart = false;
      return;
    }
    if(data.IseditPart){
      this.hscodePartarr.splice(rowIndex,1);
      this.hscodePartarr.splice(rowIndex,0, this.editPart);
      this.hscodePartArray.splice(rowIndex,0,this.editPart);
      this.hscodePartarr = [...this.hscodePartarr];
      this.showAddRowPart=false;
      this.editPart.IseditPart = false;
      data.newPart = false;
    }
    else{
    this.hscodePartarr.splice(rowIndex,0, this.editPart);
    this.hscodePartArray.splice(rowIndex,0,this.editPart);
    this.hscodePartarr = [...this.hscodePartarr];
    this.editPart.IseditPart = false;
    this.showAddRowPart = false;
    data.newPart = false;
    }
  }

  selectPartevent(obj:any){    
    console.log(obj);
    this.partId=obj.partId;
    this.partNumber=obj.partNumber
  this.partName=obj.partName  
  console.log(this.partId);
  
  }

  //#endregion
  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.hscodegeneralForm.controls;
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
  onSaveHscode() {
   if(this.hscodegeneralForm.valid){
       this.hscodeMasterDataModel.HSCodeId=this.hscodecommonID;
       this.hscodeMasterDataModel.HSCode=this.hscodegeneralForm.controls['hsCode'].value;
       this.hscodeMasterDataModel.HSCodeDescription=this.hscodegeneralForm.controls['hsCodeDescription'].value;
       this.hscodeMasterDataModel.CountryId=this.countryIdValue;
       this.hscodeMasterDataModel.HSCodeCategoryId=this.hscodecategoryIdValue;
       this.hscodeMasterDataModel.ECCN=this.hscodegeneralForm.controls['eccn'].value;
       this.hscodeMasterDataModel.Remarks=this.hscodegeneralForm.controls['remarks'].value;
       this.hscodeMasterDataModel.Livestatus=this.hscodegeneralForm.controls['livestatus'].value?true:false;
       this.hscodeMasterDataModel.CreatedBy=parseInt(this.userId$);
       this.hscodeMasterDataModel.UpdatedBy=parseInt(this.userId$);
       
       this.hscodeMasterDataModel.CreatedDate=new Date();
      this.hscodeMasterDataModel.UpdatedDate=new Date();
       const ModelContainer: HsCodeModelContainer = {
        hsCodes: this.hscodeMasterDataModel,
        hsCodePermits: this.hscodePermitarr,
        hsCodeParts: this.hscodePartArray,
        hsCodeDocuments: this.hscodeDocumentarr,
      }

      this.hscodeSvc.addHScode(ModelContainer).subscribe((res) => {
        this.hscodegeneralForm.reset();
        this.hscodegeneralForm.controls['livestatus'].setValue(true);
        this.router.navigate(['crm/master/hscode']);
        if(this.processTitle == 'Add'){
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Added Successfully',
            showConfirmButton: false,
            timer: 2000
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Updated Successfully',
            showConfirmButton: false,
            timer: 2000
          })
        }

       },
       (err: HttpErrorResponse) => {
        let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
        if(stausCode === 500){
          this.errorHandler.handleError(err);
        } else if(stausCode === 400){
          this.errorHandler.FourHundredErrorHandler(err);
        } else {
          this.errorHandler.commonMsg();
        }
      });
    }
    else {
      const invalidControls = this.findInvalidControls();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
      this.hscodegeneralForm.markAllAsTouched();
      this.changeTab(0);
      return
    }
  }
  
  reset(form:any){
    if(this.hscodeSvc.itemId && !this.hscodeSvc.isView){
      this.processTitle='Edit';
      this.hscodeSvc.getHscodebyId(this.hscodeSvc.itemId).subscribe(res=>{
        this.getHscodeData=res;
        console.log("this.getHscodeData",this.getHscodeData);
        this.hscodeDocumentarr=this.getHscodeData.hsCodeDocuments;
       this.hscodePermitarr=this.getHscodeData.hsCodePermits;
       this.hscodePartarr=this.getHscodeData.hsCodeParts;

       this.hscodePermitArray=this.getHscodeData.hsCodePermits;
       this.hscodePartArray=this.getHscodeData.hsCodeParts;
       this.hscodeDocArray=this.getHscodeData.hsCodeDocuments;

       console.log("this.hscodePartArray",this.hscodePartArray);
       this.hscodePartArray.forEach(data=>{
        if(data.updatedBy!=1){
          data.updatedBy=1
        }
      })
      this.hscodePermitArray.forEach(data=>{
        if(data.updatedBy!=1){
          data.updatedBy=1
        }
      })
      this.hscodeDocArray.forEach(data=>{
        if(data.UpdatedBy!=1){
          data.UpdatedBy=1
        }
      })
         this.setHscodevalues();
      })
    }else{
      this.hscodegeneralForm.reset();
      this.hscodeDocumentarr=[];
      this.hscodePermitarr=[];
      this.hscodePartarr=[];
      this.hscodePermitArray=[];
      this.hscodePartArray=[];
      this.hscodeDocArray=[];
    }
  }
  Tax(event: any): number {
    // Ensure the value is a number and check if it's negative
    if (event.tax < 0) {
      // Set the value to the absolute value (positive)
      event.tax = Math.abs(event.tax).toFixed(2);
      // Update the input element's value
      return event.tax;
    }
    // Return the adjusted value
    return event.tax;
  }

  Addtax(event: any): number {
    // Ensure the value is a number and check if it's negative
    if (event.addTax < 0) {
      // Set the value to the absolute value (positive)
      event.addTax = Math.abs(event.tax).toFixed(2);
      // Update the input element's value
      return event.addTax;
    }
    // Return the adjusted value
    return event.addTax;
  }

  Duty(event: any): number {
    // Ensure the value is a number and check if it's negative
    if (event.duty < 0) {
      // Set the value to the absolute value (positive)
      event.duty = Math.abs(event.duty).toFixed(2);
      // Update the input element's value
      return event.duty;
    }
    // Return the adjusted value
    return event.duty;
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }
}
