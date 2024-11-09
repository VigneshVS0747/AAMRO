import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { LineitemService } from 'src/app/crm/master/lineitemcategory/lineitem.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { PQMapping } from '../purchase-quotation.model';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mapping-dialog',
  templateUrl: './mapping-dialog.component.html',
  styleUrls: ['./mapping-dialog.component.css']
})
export class MappingDialogComponent {
  mapForm: FormGroup;
  LiveStatus = 1;
  date = new Date();
  viewMode: boolean = false;
  lineItemDatalist: LineItemMaster[];
  filteredlineitemOptions$: Observable<any[]>;
  lineItemId: any;
  lineItemName: any;
  value:any;
  filteredLineItemCtgOptions$: Observable<any[]>;
  lineItemCtgDatalist: lineitem[];
  lineItemCategoryName: any;
  categoryId: any;
  userId$: string;
  lineItemCode: any;
  showAddRowLineItem: any;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  lineItems: PQMapping[]=[];
  keywordlineItemCategory='lineItemCategoryName';
  keywordLine='lineItemName';
  totalValue: any;
  addedValue: number;
  rowIndexforLineitem: any;
  RMLineItem: PQMapping[];
  editLineItem: any;
  edit: boolean=false;
  exists: boolean;

  constructor(
    private lineIetmService: LineitemmasterService,
    private LineitemCtgService: LineitemService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRefmap: MatDialogRef<MappingDialogComponent>
  ) {

  }
  ngOnInit() {
    debugger
    this.GetUserId();
    this.totalValue=this.data.value;
    this.viewMode=this.data.viewMode;
    if(this.data.list!=null)
    {
      this.lineItems=this.data.list;
    }
    this.getLineItem();
    this.getLineItemCtg();

  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  AddLineItem() {
    debugger
    this.exists=false;
    const pqMappings: PQMapping[] = this.lineItems
    this.addedValue = pqMappings.reduce((accumulator, current) => accumulator + current.value, 0);

    if(this.totalValue<=this.addedValue )
    {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Maximum value exceeded. The actual value: "+this.totalValue,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!this.showAddRowLineItem) {
      const newRow: PQMapping = {
        pqMappingId: 0,
        pqPriceId: 0,
        lineItemId: 0,
        value: 0,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy:parseInt(this.userId$),
        updatedDate:this.date,
        lineItemName: '',
        lineItemCategoryName: '',
        IseditLineItem: true,
        newLineItem: true
      };
      this.lineItemCategoryName = '';
      this.lineItemName = '';
      this.lineItems = [newRow, ...this.lineItems];
      this.showAddRowLineItem = true;
      this.getLineItem() 
    }
  }
  inputvalue(event:any, dataItem:any){
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,8}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 8) {
      parts[0] = parts[0].slice(0, 8);
    }
    input.value = parts.join('.');
    dataItem.value = input.value;
  }

  getLineItem() {
    this.lineIetmService.GetAllLineItemMaster(this.LiveStatus).subscribe(result => {
      this.lineItemDatalist = result;
    });
  }

  getLineItemCtg() {
    this.LineitemCtgService.GetAlllineItem(this.LiveStatus).subscribe(result => {
      this.lineItemCtgDatalist = result;
    });
  }
  onInputChangelineitem(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.lineItemDatalist.some(x => x.lineItemName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.lineItemName = '';
      dataItem.lineItemCategoryName = '';
    }
  }
  onInputChangelineitemCtg(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.lineItemCtgDatalist.some(x => x.lineItemCategoryName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.lineItemCategoryName = '';

    }
  }
  SaveLineItem(dataItem: any) {
    debugger
    if(this.exists){
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Line item already exists...!",
        showConfirmButton: false,
        timer: 2000,
    });
    dataItem.lineItemName='';
    dataItem.lineItemId='';
    dataItem.lineItemCategoryName='';
    this.lineItemName='';
    this.lineItemCategoryName='';
    this.exists=false;
    return;
    }
    dataItem.lineItemName = this.lineItemName;
    dataItem.lineItemId = this.lineItemId;
    dataItem.lineItemCategoryName = this.lineItemCategoryName;
    const balvalue= this.totalValue-this.addedValue;
    if(balvalue<dataItem.value)
    {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Maximum value exceeded. The actual Value: "+this.totalValue,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (dataItem.lineItemName == "" || dataItem.lineItemCategoryName == ""|| dataItem.value==0) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    dataItem.IseditLineItem = false;
    this.showAddRowLineItem = false;
    dataItem.newLineItem = false;
    this.exists=false;
  }

  UpdateLineItem(dataItem: any) {
    debugger
    if(this.exists){
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Line item already exists...!",
        showConfirmButton: false,
        timer: 2000,
    });
    dataItem.lineItemName='';
    dataItem.lineItemId='';
    dataItem.lineItemCategoryName='';
    this.lineItemName='';
    this.lineItemCategoryName='';
    this.exists=true;
    return;
    }
    dataItem.updatedBy=parseInt(this.userId$);
    dataItem.lineItemName = this.lineItemName;
    dataItem.lineItemId = this.lineItemId;
    dataItem.lineItemCategoryName = this.lineItemCategoryName;
    const balvalue= this.totalValue-this.addedValue;
    if(balvalue<dataItem.value)
    {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Maximum value exceeded. The actual Value: "+this.totalValue,
        showConfirmButton: false,
        timer: 2000,
      });
      this.addedValue=0;
      return;
    }
    if (dataItem.lineItemName == "" || dataItem.lineItemCategoryName == ""|| dataItem.value==0) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    this.lineItems.splice(this.rowIndexforLineitem,0, dataItem);
    dataItem.IseditLineItem = false;
    this.showAddRowLineItem = false;
    dataItem.newLineItem = false;
    this.edit=false;
  }

  EditLineItem(dataItem: any) {
    debugger
    this.edit=true
    dataItem.IseditLineItem = true;
    this.value=dataItem.value;
    this.lineItemCategoryName=dataItem.lineItemCategoryName;
    this.lineItemName=dataItem.lineItemName;
    this.lineItemId=dataItem.lineItemId;
    const rowIndex = this.lineItems.indexOf(dataItem);
    this.rowIndexforLineitem = rowIndex;
    this.editLineItem = { ...dataItem };
    this.RMLineItem = this.lineItems.splice(rowIndex, 1)
    const pqMappings: PQMapping[] = this.lineItems
    this.addedValue = pqMappings.reduce((accumulator, current) => accumulator + current.value, 0);
  }

  DeleteLineItem(dataItem: any) {
    debugger
    const rowIndex = this.lineItems.indexOf(dataItem);
    this.lineItems.splice(rowIndex,1);
    this.lineItems = [...this.lineItems];
    dataItem.IseditLineItem = false;
    this.showAddRowLineItem = false;

    const pqMappings: PQMapping[] = this.lineItems
    this.addedValue = pqMappings.reduce((accumulator, current) => accumulator + current.value, 0);
  }
  oncancelLineItem(dataItem: any) {
    debugger
    const rowIndex = this.lineItems.indexOf(dataItem);
    if (dataItem.newLineItem) {
      this.lineItems.splice(rowIndex,1);
      this.lineItems = [...this.lineItems];
      this.showAddRowLineItem=false;
      dataItem.newStatus = false;
      return;
    }
    else{
      this.lineItems.splice(rowIndex,0, this.editLineItem);
      this.lineItems = [...this.lineItems];
      this.showAddRowLineItem=false;
      this.editLineItem.IseditLineItem = false;
    }
    const pqMappings: PQMapping[] = this.lineItems
    this.addedValue = pqMappings.reduce((accumulator, current) => accumulator + current.value, 0);
    this.showAddRowLineItem=false;
    this.edit=false;
  }


  AddtoList(){
    debugger
    // const pqMappings: PQMapping[] = this.lineItems
    // this.addedValue = pqMappings.reduce((accumulator, current) => accumulator + current.value, 0);
    //  const balvalue= this.totalValue-this.addedValue;
    // if(balvalue!=0)
    // {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Oops!",
    //     text: "Vendor Value & Line Item Mapping Value should be equal. The actual Value: "+this.totalValue,
    //     showConfirmButton: true,
    //   });
    //   return;
    // }
    this.addedValue = this.lineItems.reduce((accumulator, current) => {
      return accumulator + +current.value;
    }, 0);
    
    const balvalue = this.totalValue - this.addedValue;
    
    if (balvalue !== 0) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Vendor Value & Line Item Mapping Value should be equal. The actual Value: " + this.totalValue,
        showConfirmButton: true,
      });
      return;
    }

    if(this.showAddRowLineItem||this.edit)
    {
      Swal.fire({
        icon: "info",
        title: "Oops!",
        text: "Please Save the data...!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
      this.dialogRefmap.close(this.lineItems);
      this.showAddRowLineItem=false;
      this.edit=false;
  }

  Close()
  {
    if(this.edit)
    {
      Swal.fire({
        icon: "info",
        title: "Oops!",
        text: "Please Save the data...!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    this.dialogRefmap.close();
    this.showAddRowLineItem=false;
    this.edit=false;
  }

  selectLineevent(data: any, dataItem:any) {
    debugger
    this.lineItemName = data.lineItemName;
    this.lineItemId = data.lineItemId;
    this.lineItemCategoryName = data.lineItemCategoryName;
    dataItem.lineItemCategoryName=data.lineItemCategoryName;
    this.lineItems.forEach(ele=>{
      if(ele.lineItemId==data.lineItemId && ele.lineItemCategoryName==data.lineItemCategoryName){
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Line item already exists...!",
          showConfirmButton: false,
          timer: 2000,
      });
      dataItem.lineItemName='';
      dataItem.lineItemId='';
      this.lineItemName='';
      this.lineItemCategoryName='';
      this.exists=true;
      return;
      }else{
        this.exists=false;
      }
    });

  }
  selectLineCatevent(data: any,dataItem:any)
  {
    dataItem.lineItemName='';
    dataItem.lineItemId='';
    this.lineIetmService.GetbyLineItemCategoryId(data.lineItemCategoryId).subscribe(result => {
      this.lineItemDatalist = result;
    });
  }

  ValidateFieldLine(item: any) {
    debugger
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }

  ValidateField(item:any)
  {
    debugger
    if (item != 0) {
      return false;
    } else {
      return true;
    }
  }

  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressLineItem(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRowLineItem ? this.SaveLineItem(dataItem) : this.UpdateLineItem(dataItem);
    }
  }
  /// to reach submit button
  handleChangeLineItem(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeLineItem(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressLineItem(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelLineItem(dataItem)
    }
  }

}
