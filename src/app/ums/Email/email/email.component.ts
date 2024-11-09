import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { EnquiryService } from 'src/app/crm/transaction/Enquiry/enquiry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  mail: FormGroup;
  Id: any;
  ScreenId: any;
  filteredEmails: Observable<string[]>;
  emailHistory: string[] = [];
  selectedEmails: string = '';
  selectedFile: any;
  constructor(
    private fb: FormBuilder,
    private service: EnquiryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EmailComponent>
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    this.initializeForm();
    console.log("data", this.data);
    this.Id = this.data.id;
    this.ScreenId = this.data.screenId;
    this.mail.controls["to"].setValue(this.data.email);
    this.mail.controls['attachment'].setValue(this.data.pdf);


    // Load saved emails from local storage (if any)
    const savedEmails = localStorage.getItem('emailHistory');
    if (savedEmails) {
      this.emailHistory = JSON.parse(savedEmails);
    }

    // Filter emails based on input
    this.filteredEmails = this.mail.controls["cc"].valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmails(value || ''))
    );
  }

  private _filterEmails(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.emailHistory.filter(email => email.toLowerCase().includes(filterValue));
  }

  saveEmail() {
    debugger;
    const email = this.mail.controls["cc"].value;
    if (email && !this.emailHistory.includes(email)) {
      this.emailHistory.push(email);
      // Save updated history to local storage
      localStorage.setItem('emailHistory', JSON.stringify(this.emailHistory));
    }
  }

  initializeForm() {
    this.mail = this.fb.group({
      from:[""],
      to: [""],
      cc: [""],
      bcc:[""],
      subject: [""],
      body: [""],
      attachment: [],
    });
  }
  displayedColumns: string[] = ['link', 'type', 'action'];
  externalDocuments = [
    { link: 'FASTTRACK INT_L_EST070421009693-0', type: 'path/to/icon.png' }
  ];


  attachments: File[] = [];



  Download() {
    debugger;
    const Payload = {

      id: this.Id,
      screenId: this.ScreenId,
    }
    this.service.downloadPdf(Payload).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Document.pdf'; // Set a default filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Clean up URL
    });
  }

  SendMail() {
    const formData = new FormData();
    
    // Append form values
    formData.append('id', this.Id);
    formData.append('screenId', this.ScreenId);
    formData.append('from', this.mail.controls["from"].value);
    formData.append('to', this.mail.controls["to"].value);
    formData.append('cc', this.mail.controls["cc"].value);
    formData.append('bcc', this.mail.controls["bcc"].value);
    formData.append('subject', this.mail.controls["subject"].value);
    formData.append('body', this.mail.controls["body"].value);
    // Append the file (assuming you have a file input bound to 'this.selectedFile')
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    this.service.SendMail(formData).subscribe((res => {
      Swal.fire(
        'Closed!',
        'Mail has been sent',
        'success'
      );
      this.dialogRef.close();
    }));
  }


  Close() {
    this.dialogRef.close();
  }

  Reset() {
    this.mail.reset();
    this.initializeForm();
    console.log("data", this.data);
    this.Id = this.data.id;
    this.mail.controls["to"].setValue(this.data.email);
    this.mail.controls['attachment'].setValue(this.data.pdf);
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
