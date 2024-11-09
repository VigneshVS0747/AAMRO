import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, startWith, map } from 'rxjs';
import { CustomerDocDialogComponent } from 'src/app/crm/master/customer/customer-doc-dialog/customer-doc-dialog.component';
import { DocumentChecklist } from 'src/app/crm/master/customer/customer.model';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import { CommonService } from 'src/app/services/common.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { JODocumentModal } from '../../job-order.modals';

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
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AttachmentComponent {
  userId$: string;
  viewMode: boolean;
  JODocumetList: JODocumentModal[] = [];
  customerDoc: FormGroup;
  exists: boolean;
  liveStatus = 1;
  documentsList: Documents[];
  filteredDocumentListOptions$: Observable<any[]>;
  documentId: any;
  disablefields: boolean;
  documentName: any;
  fileName: any;
  mandatory: any;
  maxDate: Date;
  ImageDetailsArray: any[]=[];


  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialog: MatDialog,
    private docmentsService: DocmentsService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRefDoc: MatDialogRef<CustomerDocDialogComponent>
  ) {
    dialogRefDoc.disableClose = true;
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.GetUserId();
    this.getDocumentList();
    this.initializeForm();
    this.EditMode();
    this.JODocumetList = this.data.list;
    if (this.data && this.data.list) {
      this.data.list["rowNumber"] = this.data.rowNumber;
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
      this.documentsList = res;
      if (this.data.mode == 'View' || this.data.mode == 'Edit') {
        this.documentsList.forEach(ele => {
          if (this.data.documentData.documentId == ele.documentId) {
            this.customerDoc.controls["documentId"].setValue(ele);
          }
        })
      }
      this.DocumentFun();
    });
  }

  DocumentFun() {
    this.filteredDocumentListOptions$ = this.customerDoc.controls['documentId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.documentName)),
      map((name: any) => (name ? this.filteredDocumentListOptions(name) : this.documentsList?.slice()))
    );
  }
  private filteredDocumentListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.documentsList.filter((option: any) => option.documentName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataDocument();
  }
  NoDataDocument(): any {
    this.customerDoc.controls['documentId']?.setValue('');
    return this.documentsList;
  }
  displayDocumentListLabelFn(data: any): string {
    return data && data?.documentName ? data?.documentName : '';
  }
  DocumentListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.documentId = selectedValue.documentId;
    this.documentName = selectedValue.documentName;

  }
  initializeForm() {
    const currentDate = new Date();
    this.customerDoc = this.fb.group({
      joDocumentId: [0],
      jobOrderId: [0],
      documentId: ["", Validators.required],
      mandatory: [false],
      isCollected: [false],
      collectedDate: [null],
      documentName: [null],
      documentTypeName: [""],
      remarks: [null],
      createdBy: [this.data?.createdBy],
      createdDate: [currentDate],
      updatedBy: [this.data?.createdBy],
      updatedDate: [currentDate]
    });
    this.customerDoc.controls['mandatory'].disable();
  }

  selectFile(evt: any) {
    if (evt?.target?.files && evt.target.files.length > 0) {
      const files = evt.target.files;
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
          const existingIndex = this.JODocumetList.findIndex(img => img.documentName.toLowerCase() === fileName);
          if (existingIndex !== -1) {
            // If the image already exists, update it
            this.ImageDetailsArray[existingIndex] = file;
          } else {
            // If the image doesn't exist, add it to the array
            this.ImageDetailsArray.push(file);
          }
        } else {
          // Handle unsupported file types
          this.commonService.displayToaster(
            "error",
            "error",
            "Please Choose a JPG, JPEG, PNG, GIF, BMP, TIFF, SVG, PDF, DOC, DOCX, XLS, or XLSX File."
          );
          this.customerDoc.controls["documentName"].setValue("");
        }
      }
    }
  }
  isFieldEnabled(): boolean {
    return !this.customerDoc.controls['documentId'].disabled;
  }
  EditMode() {
    debugger
    console.log(this.data.documentData);

    if (this.data.mode == 'Edit') {
      this.customerDoc.patchValue(this.data.documentData);
      this.documentId = this.data.documentData.documentId;
      this.documentName = this.data.documentData.documentTypeName;
      this.fileName = this.data.documentData.documentName;
      this.mandatory= this.data.documentData.mandatory;
      if(this.mandatory){
        this.customerDoc.controls['documentId'].disable();
      }else
      {
        this.customerDoc.controls['documentId'].enable();
      }
    }
    else if (this.data.mode == 'View') {
      this.viewMode = true;
      this.customerDoc.disable();
      this.customerDoc.patchValue(this.data.documentData);
      this.documentId = this.data.documentData.documentId;
      this.documentName = this.data.documentData.documentTypeName;
      this.fileName = this.data.documentData.documentName;

    }
  }
  Close() {
    this.dialogRefDoc.close();
  }
  // AddtodocumentList() {
  //   debugger
  //   const validDateValue = this.customerDoc?.get('collectedDate')?.value;
  //   if (validDateValue) {
  //     let adjustedDate = new Date(validDateValue);
  //     // Adjust timezone to match your local timezone
  //     const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
  //     adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
  //     this.customerDoc.get('collectedDate')?.setValue(adjustedDate);
  //   }
  //   if (this.customerDoc.valid) {
  //     const documentDetail: DocumentChecklist = {
  //       ...this.customerDoc.value,
  //     }
  //     documentDetail.documentTypeName = this.documentName;
  //     documentDetail.documentName = this.fileName;
  //     documentDetail.documentId = this.documentId;
  //     documentDetail.mandatory=this.mandatory;
  //     if (documentDetail.documentName && (documentDetail.collectedDate == null || documentDetail.isCollected == false)) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Info",
  //         text: "Please fill the collected Information!",
  //         confirmButtonColor: "#007dbd",
  //         showConfirmButton: true,
  //       });
  //       return;
  //     }
  //     if (documentDetail.documentName == '' && documentDetail.isCollected == true) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Info",
  //         text: "Please upload the document!",
  //         confirmButtonColor: "#007dbd",
  //         showConfirmButton: true,
  //       });
  //       return;
  //     }
  //     this.JODocumetList.forEach(x => {
  //       if (x.documentTypeName == this.documentName) {
  //         this.exists = true;
  //       }
  //     });
  //     if (this.exists) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Info",
  //         text: "Document already exists...!",
  //         confirmButtonColor: "#007dbd",
  //         showConfirmButton: true,
  //       });
  //       this.exists = false;
  //       return;
  //     }
  //     this.dialogRefDoc.close(documentDetail);
  //     this.customerDoc.reset();
  //   }
  //   else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops!",
  //       text: "Please fill the mandatory fields",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //   }
  // }

  AddtodocumentList() {
    debugger;
    const validDateValue = this.customerDoc?.get('collectedDate')?.value;
    if (validDateValue) {
      let adjustedDate = new Date(validDateValue);
      const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
      adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
      this.customerDoc.get('collectedDate')?.setValue(adjustedDate);
    }
  
    if (this.customerDoc.valid) {
      const documentDetail: JODocumentModal = {
        ...this.customerDoc.value,
        Document: this.ImageDetailsArray
      }
      console.log("documentDetail",documentDetail);
      
      documentDetail.documentTypeName = this.documentName;
      documentDetail.documentName = this.fileName;
      documentDetail.documentId = this.documentId;
      documentDetail.mandatory = this.mandatory;
      
          // Check if documentName is selected and both collectedDate and isCollected are required
    if (documentDetail.documentName == undefined) {
      if (!documentDetail.collectedDate || !documentDetail.isCollected) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Please fill the collected Information!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
          timer: 2000,
        });
        return;
      }
    }
  

    // Check if document is required to be uploaded but not provided
    if (!documentDetail.documentName == undefined) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please upload the document!",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
        timer: 2000,
      });
      return;
    }
  
      // Check if the document already exists in the list
      this.exists = this.JODocumetList.some(x => x.documentTypeName === this.documentName && x?.rowNumber !== this.data.rowNumber );
      if (this.exists) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Document already exists...!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
          timer: 2000,
        });
        this.exists = false;
        return;
      }
  
      // If all checks pass, close the dialog and reset the form
      this.dialogRefDoc.close(documentDetail);
      this.customerDoc.reset();
    } else {
      // If form is invalid, show error message
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  
}
