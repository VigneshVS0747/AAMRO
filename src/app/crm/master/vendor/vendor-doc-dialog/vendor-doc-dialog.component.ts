import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { DocmentsService } from '../../document/document.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Documents } from 'src/app/Models/crm/master/documents';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { EnqpackageDialogComponent } from 'src/app/crm/transaction/Enquiry/enquiry/enqpackage-dialog/enqpackage-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VDocument } from 'src/app/Models/crm/master/Vendor';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
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
  selector: 'app-vendor-doc-dialog',
  templateUrl: './vendor-doc-dialog.component.html',
  styleUrls: ['./vendor-doc-dialog.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class VendorDocDialogComponentm implements OnInit {
  VendorDoc: FormGroup;
  document: any;
  Livestatus = 1;
  SelectedDocumentId: number;
  selectedDocumentName: any;
  filtereddocumentId: Observable<Documents[]> | undefined;
  ImageDetailsArray: any[] = [];
  ImageDataArray: any[] = [];
  date = new Date()
  disablefields: boolean;
  mandatory: any;
  documentName: any;
  maxDate: Date;
  viewMode: boolean;
  constructor(private Cservice: CommonService, private fb: FormBuilder, private docs: DocmentsService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EnqpackageDialogComponent>) {
    this.fetchDropDownData();
    this.maxDate = new Date();
  }
  ngOnInit(): void {
    this.ImageDataArray = this.data.list
    this.initializeForm();
  }


  initializeForm() {
    const currentDate = new Date();
    this.VendorDoc = this.fb.group({
      vDocumentId: [0],
      vendorId: [0],
      documentId: ["", Validators.required],
      mandatory: [false],
      isCollected: [false],
      collectedDate: [null],
      documentName: [""],
      docname: [""],
      remarks: [null],
      createdBy: [1],
      createdDate: [currentDate],
    });
    this.VendorDoc.controls['mandatory'].disable();
  }

  fetchDropDownData() {
    const Doc$ = this.docs.getDocuments(this.Livestatus);
    forkJoin([Doc$]).subscribe({
      next: ([Doc]) => {
        this.document = Doc;
        this.Filter();
        this.EditMode();
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  optionSelecteddocumentId(event: MatAutocompleteSelectedEvent): void {
    const selectedDocID = this.document.find(
      (Stype: { documentName: string; }) => Stype.documentName === event.option.viewValue
    );
    if (selectedDocID) {
      const selectedDocId = selectedDocID.documentId;
      this.SelectedDocumentId = selectedDocId;
      this.selectedDocumentName = selectedDocID.documentName;
    }

    const exists = this.ImageDataArray.some(item => item.documentId === this.SelectedDocumentId);
    if (exists) {
      Swal.fire({
        icon: "error",
        title: "Duplicate",
        text: "Document already exist..!",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
      this.VendorDoc.get("documentId")?.setValue("");
    }
  }


  Filter() {
    this.filtereddocumentId = this.VendorDoc.get(
      "documentId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.documentName)),
      map((name: any) => (name ? this._filter(name) : this.document?.slice()))
    );
  }
  private _filter(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const filterresult = this.document.filter((invflg: { documentName: string; }) =>
      invflg.documentName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.VendorDoc.controls["documentId"].setValue("");
    }

    return filterresult;
  }
  dateFilter = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date <= currentDate;
  };

  AddtoList() {
    debugger
    const validDateValue = this.VendorDoc?.get('collectedDate')?.value;
    if (validDateValue) {
      let adjustedDate = new Date(validDateValue);
      // Adjust timezone to match your local timezone
      const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // +5.5 hours for IST
      adjustedDate = new Date(adjustedDate.getTime() + offsetInMilliseconds);
      this.VendorDoc.get('collectedDate')?.setValue(adjustedDate);
    }

    if (this.VendorDoc.valid) {
      if (this.ImageDetailsArray.length > 0) {

        for (let imageDetail of this.ImageDetailsArray) {
          // Rename the 'name' property to 'imagePath'
          const documentName = imageDetail.name;

          // Check if the object with the same 'imagePath' already exists in ImageDataArray
          //const existingImageDataIndex = this.ImageDataArray.findIndex((data: { documentId: number; }) => data.documentId === this.SelectedDocumentId);

          // If the object doesn't exist, add it to ImageDataArray

          // Create a new object with the modified property name
          const modifiedImageDetail = { ...imageDetail, documentName };

          const Value: VDocument = {
            ...this.VendorDoc.value,
            Document: this.ImageDetailsArray,
            ...modifiedImageDetail,
            documentTypeName: this.selectedDocumentName,
            documentId: this.SelectedDocumentId,
          }
          this.documentName = Value.documentName;
          Value.mandatory = this.mandatory
          if (this.documentName && (Value.collectedDate == null || Value.isCollected == false)) {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Please fill the collected Information!",
              confirmButtonColor: "#007dbd",
              showConfirmButton: true,
            });
            return;
          }
          if (this.documentName == '' && Value.isCollected == true) {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Please upload the document!",
              confirmButtonColor: "#007dbd",
              showConfirmButton: true,
            });
            return;
          }
          this.dialogRef.close(Value);
          this.VendorDoc.reset();
        }
      } else {
        const Value: VDocument = {
          ...this.VendorDoc.value,
          documentTypeName: this.selectedDocumentName,
          documentId: this.SelectedDocumentId
        }
        if (this.documentName && (Value.collectedDate == null || Value.isCollected == false)) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Please fill the collected Information!",
            confirmButtonColor: "#007dbd",
            showConfirmButton: true,
          });
          return;
        }
        if (this.documentName == '' && Value.isCollected == true) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Please upload the document!",
            confirmButtonColor: "#007dbd",
            showConfirmButton: true,
          });
          return;
        }
        Value.mandatory = this.mandatory
        this.dialogRef.close(Value);
        this.VendorDoc.reset();
      }
    } else {
      this.VendorDoc.markAllAsTouched();
      this.validateall(this.VendorDoc);
    }
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

  Close() {
    this.dialogRef.close();
  }
  selectFile(evt: any) {
    if (evt?.target?.files && evt.target.files.length > 0) {
      const files = evt.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
        const supportedFileTypes = [
          'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'pdf', 
          'doc', 'docx', 'xls', 'xlsx'
        ];
        
        // Check if the file type is allowed (jpg or png)
        if (supportedFileTypes.includes(fileType))
          {
          // Check if the image already exists, then update it
          const existingIndex = this.ImageDetailsArray.findIndex(img => img.name.toLowerCase() === fileName);
          if (existingIndex !== -1) {
            // If the image already exists, update it
            this.ImageDetailsArray[existingIndex] = file;

          } else {
            // If the image doesn't exist, add it to the array
            this.ImageDetailsArray.push(file);
          }
        } else {
          // Handle unsupported file types
          this.Cservice.displayToaster(
            "error",
            "error",
            "Please Choose a JPG, JPEG, PNG, GIF, BMP, TIFF, SVG, PDF, DOC, DOCX, XLS, or XLSX File."
          );
          this.VendorDoc.controls["documentName"].setValue("");
        }

      }
    }
  }
  EditMode() {

    if (this.data.mode == "Edit") {
      this.SelectedDocumentId = this.data.docdata.documentId;
      this.selectedDocumentName = this.data.docdata.documentTypeName;
      this.mandatory = this.data.docdata.mandatory;
      this.documentName = this.data.docdata.documentName;
      this.VendorDoc.patchValue({

        vDocumentId: this.data.docdata.vDocumentId,
        vendorId: this.data.docdata.vendorId,
        documentId: this.data.docdata.documentTypeName,
        //documentName:this.data.list.documentName,
        mandatory: this.data.docdata.mandatory,
        isCollected: this.data.docdata.isCollected,
        collectedDate: this.data.docdata.collectedDate,
        remarks: this.data.docdata.remarks,
        createdBy: this.data.docdata.createdBy,
        createdDate: this.data.docdata.createdDate,
      });
      if (this.mandatory) {
        this.VendorDoc.controls['documentId'].disable();
      } else {
        this.VendorDoc.controls['documentId'].enable();
      }
    } else if (this.data.mode == "view") {
      this.ViewMode();
    }

  }
  isFieldEnabled(): boolean {
    return !this.VendorDoc.controls['documentId'].disabled;
  }

  ViewMode() {
    this.VendorDoc.disable();
    this.disablefields = true;
    this.viewMode = true;
    this.SelectedDocumentId = this.data.docdata.documentId;
    this.selectedDocumentName = this.data.docdata.documentTypeName;
    this.mandatory = this.data.docdata.mandatory;
    this.documentName = this.data.docdata.documentName;
    this.VendorDoc.patchValue({

      vDocumentId: this.data.docdata.vDocumentId,
      vendorId: this.data.docdata.vendorId,
      documentId: this.data.docdata.documentTypeName,
      //documentName:this.data.list.documentName,
      mandatory: this.data.docdata.mandatory,
      isCollected: this.data.docdata.isCollected,
      collectedDate: this.data.docdata.collectedDate,
      remarks: this.data.docdata.remarks,
      createdBy: this.data.docdata.createdBy,
      createdDate: this.data.docdata.createdDate,
    });
  }
}
