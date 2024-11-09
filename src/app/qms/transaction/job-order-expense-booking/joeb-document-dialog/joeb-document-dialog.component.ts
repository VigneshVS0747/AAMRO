import { ChangeDetectorRef, Component, ElementRef, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Documents } from 'src/app/Models/crm/master/documents';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { JOCostBookingDocument } from '../job-order-expense-booking.model';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import * as saveAs from 'file-saver';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-joeb-document-dialog',
  templateUrl: './joeb-document-dialog.component.html',
  styleUrls: ['./joeb-document-dialog.component.css']
})
export class JoebDocumentDialogComponent {

  keywordDoc = 'documentName'
  userId$: string;
  date = new Date();
  viewMode: boolean=false;
  liveStatus = 1;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  documents: Documents[] = [];
  showAddRowDoc: boolean = false;
  remarks: any;
  documentId: any;
  onSelectDoc: boolean;
  documentName: any
  jocbDocuments: JOCostBookingDocument[] = [];
  jocbDocumentsArray: JOCostBookingDocument[] = [];
  file: any;
  fileName: any = '';
  documentTypeName: any;
  existDoc: boolean;
  rowIndexforDoc: number;
  removeDoc: JOCostBookingDocument[];
  editDocumet: any;
  ImageDetailsArray: any[] = [];
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  Filepath = environment.Fileretrive;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;

  constructor(
    private commonService: CommonService,
    private docmentsService: DocmentsService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JoebDocumentDialogComponent>,
    private Fs: FileuploadService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,


  ) { dialogRef.disableClose = true; }
  ngOnInit() {
    debugger
    this.GetUserId();
    this.getDocumentList();
    this.viewMode=this.data.viewMode;
    if (this.data.document) {
      this.jocbDocuments = this.data.document;
      this.jocbDocumentsArray = this.data.document;
    }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  getDocumentList() {
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      this.documents = res;
    });
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({ skip: skip, take: take });

    if (!this.showAddRowDoc) {
      const newRow: JOCostBookingDocument = {
        jocbDocumentId: 0,
        joCostBookingId: 0,
        documentId: 0,
        remarks: '',
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        documentName: '',
        documentTypeName: '',
        IseditDoc: true,
        newDoc: true,
        files: ''
      };
      this.remarks = '';
      this.jocbDocuments = [newRow, ...this.jocbDocuments];
      this.showAddRowDoc = true;
    }
  }
  onInputChange(event: any, dataItem: any) {
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.documents.some(doc => doc.documentName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.documentTypeName = '';
    }
  }
  SaveDoc(data: JOCostBookingDocument) {
    debugger

    if (data.documentTypeName == "" || this.fileName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.files = this.file;
    data.documentTypeName = this.documentTypeName
    data.documentName = this.fileName;
    data.documentId = this.documentId;
    data.remarks = this.remarks;
    this.jocbDocumentsArray.forEach(element => {
      if (element.documentTypeName === data.documentTypeName) {
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
      this.jocbDocumentsArray.splice(0, 0, data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
    this.onSelectDoc = false;
    this.fileName = '';
  }
  UpdateDoc(data: JOCostBookingDocument) {
    debugger
    if (data.documentTypeName == "" || this.fileName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.files = this.file;
    data.documentTypeName = this.documentTypeName
    data.documentName = this.fileName;
    data.documentId = this.documentId;
    data.remarks = this.remarks;
    if (this.onSelectDoc) {
      data.documentName = this.fileName;
      data.remarks = this.remarks;
      data.documentTypeName = this.documentTypeName;
      data.documentId = this.documentId;
    }
    this.jocbDocumentsArray.forEach(element => {
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
      this.jocbDocumentsArray.splice(this.rowIndexforDoc, 0, data);
      //this.jocbDocumentsArray.push(data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
  }
  EditDoc(data: JOCostBookingDocument) {
    debugger
    data.IseditDoc = true;
    this.documentTypeName = data.documentTypeName;
    this.documentId = data.documentId;
    this.remarks = data.remarks;
    this.fileName = data.documentName;
    const rowIndex = this.jocbDocumentsArray.indexOf(data);
    this.rowIndexforDoc = rowIndex;
    this.editDocumet = { ...data };
    this.removeDoc = this.jocbDocumentsArray.splice(rowIndex, 1)
    this.onSelectDoc = false;
  }
  Deletedoc(data: JOCostBookingDocument,index:any) {
    debugger
    // const rowIndex = this.jocbDocumentsArray.indexOf(data);
    // this.jocbDocumentsArray.splice(rowIndex, 1);
    // this.jocbDocuments.splice(rowIndex, 1);
    this.jocbDocumentsArray = this.jocbDocumentsArray.filter((_, i) => i !== index);
    this.jocbDocuments = this.jocbDocuments.filter((_, i) => i !== index);
    this.cdr.detectChanges();
    this.jocbDocuments = [...this.jocbDocuments];
    data.IseditDoc = false;
    this.showAddRowDoc = false;
  }
  oncancelDoc(data: any) {
    debugger
    const rowIndex = this.jocbDocuments.indexOf(data);
    if (data.newDoc) {
      this.jocbDocuments.splice(rowIndex, 1);
      //this.jocbDocumentsArray.splice(rowIndex,1);
      this.jocbDocuments = [...this.jocbDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.fileName = '';
      return;
    }
    if (data.IseditDoc) {
      this.jocbDocuments.splice(rowIndex, 1);
      this.jocbDocuments.splice(rowIndex, 0, this.editDocumet);
      this.jocbDocumentsArray.splice(rowIndex, 0, this.editDocumet);
      this.jocbDocuments = [...this.jocbDocuments];
      this.showAddRowDoc = false;
      this.editDocumet.IseditDoc = false;
      data.newDoc = false;
      this.fileName = '';
    }

  }


  File(event: any): void {

    if (event?.target?.files && event.target.files.length > 0) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.fileName = file.name;
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
        const supportedFileTypes = [
          'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'pdf',
          'doc', 'docx', 'xls', 'xlsx'
        ];

        // Check if the file type is allowed (jpg or png)
        if (supportedFileTypes.includes(fileType)) {
          // Check if the image already exists, then update it
          const existingIndex = this.jocbDocuments.findIndex(img => img.documentName.toLowerCase() === fileName);
          if (existingIndex !== -1) {
            // If the image already exists, update it
            this.ImageDetailsArray[existingIndex] = file;

          } else {
            // If the image doesn't exist, add it to the array
            this.ImageDetailsArray.push(file);
            console.log(this.ImageDetailsArray)
          }
        } else {
          // Handle unsupported file types
          this.commonService.displayToaster(
            "error",
            "error",
            "Please Choose a JPG, JPEG, PNG, GIF, BMP, TIFF, SVG, PDF, DOC, DOCX, XLS, or XLSX File."
          );
          this.documentName = ''
        }
      }
    }
  }

  selectDocevent(item: any) {
    debugger
    this.onSelectDoc = true;
    this.documentId = item.documentId;
    this.documentTypeName = item.documentName;
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
  Downloads(file: any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }

  show(event: any): void {
    var filePath = this.Filepath + event
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg') {
      this.dialog.open(this.imagePreview, { data: filePath });
    } else {
      window.open(filePath, '_blank');
    }
  }
  ValidateFieldDoc(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }

  Close() {
    this.showAddRowDoc = false;
    this.dialogRef.close();
  }

  AddtodocumentList() {
    if(this.showAddRowDoc)
    {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please save the document.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    this.showAddRowDoc = false;
    const parms = {
      docs: this.jocbDocuments,
      images: this.ImageDetailsArray
    }
    this.dialogRef.close(parms);
  }
}
