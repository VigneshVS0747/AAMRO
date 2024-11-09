import { Component, ElementRef, ViewChild } from '@angular/core';
import { DocmentsService } from '../document/document.service';
import { CommonService } from 'src/app/services/common.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import { DocumentChecklists } from 'src/app/Models/crm/master/Dropdowns';
import Swal from 'sweetalert2';
import { DocumentMapping } from './document-mapping.model';
import { DocumentMappingService } from './document-mapping.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-document-mapping',
  templateUrl: './document-mapping.component.html',
  styleUrls: ['./document-mapping.component.css','../../../ums/ums.styles.css']
})
export class DocumentMappingComponent {
  documents: Documents[];
  LiveStatus: number = 1;
  documentsCheckList: DocumentChecklists[];
  showAddRowDoc: boolean;
  date = new Date();
 // documentMapping: DocumentMapping[]=[];
  documentId: any;
  documentName: any;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  documentMappingList: DocumentMapping[]=[];
  keywordDoc='documentName'
  keywordScreen='screen'
  userId$: any;
  screenId: any;
  screen: any;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;

  ngOnInit() {
    this.GetUserId();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    this.GetAllDocumentMapping();
    this.GetAllDocumentChecklist();
    this.getDocumentList();
  }

  constructor(
    private docmentsService: DocmentsService,
    private commonService: CommonService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private documentMappingService: DocumentMappingService,
    private ErrorHandling: ErrorhandlingService,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
  ) {

  }
  GetAllDocumentMapping(){
this.documentMappingService.GetAllDocumentMapping().subscribe(res=>{
  this.documentMappingList=res;
  console.log(this.documentMappingList)

});
  }

  GetAllDocumentChecklist() {
    this.commonService.GetAllDocumentChecklist().subscribe(res => {
      this.documentsCheckList = res;
      console.log(this.documentsCheckList)
    });
  }
  getDocumentList() {
    this.docmentsService.getDocuments(this.LiveStatus).subscribe(res => {
      this.documents = res;
      console.log(this.documents)
    });
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});

    if (!this.showAddRowDoc) {
      const newRow: DocumentMapping = {
        documentMapId: 0,
        documentId: 0,
        screenId: 0,
        mandatory: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,
        IseditDoc: true,
        documentName: '',
        screen: ''
      };
      this.documentName='';
      this.documentId='';
      this.screenId='';
      this.screen='';
      this.documentMappingList = [newRow, ...this.documentMappingList];
      this.showAddRowDoc = true;
    }
  }
  SaveDoc(data: DocumentMapping) {
    data.documentName=this.documentName;
    data.documentId=this.documentId;
    data.screenId=this.screenId;
    data.screen=this.screen;
    if (data.documentName == "" || data.screen=="") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    this.documentMappingService.SaveDocumentMap(data).subscribe({
      next: (res) => {
        this.commonService.displayToaster(
          "success",
          "Success",
          "Added Sucessfully"
        );
        this.GetAllDocumentMapping();
        this.showAddRowDoc = false;
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
    return false

  }

  UpdateDoc(data: DocumentMapping) {
    debugger
    if (data.documentName == "" || data.screen=="") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
      data.updatedBy=parseInt(this.userId$);
      this.documentMappingService.SaveDocumentMap(data).subscribe({
        next: (res) => {
          this.commonService.displayToaster(
            "success",
            "Success",
            "Updated Sucessfully"
          );
          this.GetAllDocumentMapping();
          this.showAddRowDoc = false;
          this.documentName='';
          this.documentId='';
          this.screenId='';
          this.screen='';
        },
        error: (error) => {
          var ErrorHandle = this.ErrorHandling.handleApiError(error)
          this.commonService.displayToaster(
            "error",
            "Error",
            ErrorHandle
          );
        },
      });
      return false;

  }
  EditDoc(data: DocumentMapping) {
    debugger
    this.documentName=data.documentName;
    this.documentId=data.documentId;
    this.screenId=data.screenId;
    this.screen=data.screen;
    data.IseditDoc=true;
  }

  oncancelDoc(data: any) {
    data.IseditDoc = false;
    this.showAddRowDoc = false;
    this.GetAllDocumentMapping();

    }

  Deletedoc(data: DocumentMapping) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Mapped Document!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentMappingService.DeleteDocumentMapping(data.documentMapId).subscribe(res=>{
          this.GetAllDocumentMapping();
          this.showAddRowDoc = false;
          Swal.fire(
            'Deleted!',
            'Mapped Document has been deleted',
            'success'
          )
        });
      }
    })

  }

  selectDocevent(item: any) {
    debugger

    this.documentId = item.documentId;
    this.documentName = item.documentName;
  }
  selectScreenvent(item: any){
    this.screenId=item.screenId;
    this.screen=item.screen;
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
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeDoc(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressDoc(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelDoc(dataItem)
    }
  }
  //#endregion


}
