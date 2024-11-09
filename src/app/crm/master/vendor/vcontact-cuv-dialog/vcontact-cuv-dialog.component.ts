import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ContactType } from 'src/app/Models/crm/master/ContactType';
import { Designation } from 'src/app/Models/ums/designation.model';
import { CommonService } from 'src/app/services/common.service';
import { Department } from 'src/app/ums/masters/department/department.model';
import { ContactTypeService } from '../../contact-type/contact-type.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { VContact } from 'src/app/Models/crm/master/Vendor';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';

@Component({
  selector: 'app-vcontact-cuv-dialog',
  templateUrl: './vcontact-cuv-dialog.component.html',
  styleUrls: ['./vcontact-cuv-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class VcontactCuvDialogComponent {
  liveStatus = 1;
  date = new Date;
  ContactForm: FormGroup;
  departmentList: Department[] = [];
  designationList: Designation[] = [];
  ContactList: ContactType[] = [];
  filteredContactOptions$: Observable<any[]>;
  contactTypeId: any;
  filteredDepartmentOptions$: Observable<any[]>;
  departmentId: any;
  filtereddesignationOptions$: Observable<any[]>;
  contactTypeName: any;
  departmentName: any;
  viewMode: boolean = false;
  vContact: VContact[] = [];
  exists: boolean;
  existcontact: boolean;
  userId$: string;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private contactTypeService: ContactTypeService,
    public dialog: MatDialog,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VcontactCuvDialogComponent>,
  ) {

  }

  ngOnInit() {
    this.GetUserId();
    this.iniForm();
    this.getContactList();
    this.getDepartmentList();
    this.EditMode();
    this.vContact = this.data.list;

  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  restrictInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9()+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  iniForm() {
    this.ContactForm = this.fb.group({
      vContactId: [0],
      vendorId: [0],
      contactPerson: ['', Validators.required],
      contactTypeId: [''],
      departmentId: [null],
      designation: [''],
      contactPersonPhone: [''],
      contactPersonEmail: ['', Validators.email],
      primaryContact: [false],
      liveStatus: [true],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });
  }
  AddtoContactList() {
    if (!this.ContactForm.controls['contactPersonEmail'].valid) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please provide a valid email address.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.ContactForm.controls['contactPersonEmail'].markAllAsTouched();
      return;
    }
    if (this.ContactForm.valid) {
      const contactDetail: VContact = {
        ...this.ContactForm.value,
        contactTypeId: this.contactTypeId,
        departmentId: this.departmentId,
        departmentName: this.departmentName,
        contactTypeName: this.contactTypeName
      }
      contactDetail.updatedBy = parseInt(this.userId$);
      const primary = this.ContactForm.controls['primaryContact'].value;
      this.vContact.forEach(x => {
        if (x.primaryContact == true && x.primaryContact == primary) {
          this.exists = true;
        }
      });
      if (this.exists) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Primary Contact already added...!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        });
        this.exists = false;
        this.ContactForm.controls['primaryContact'].setValue(false);
        return;
      }
      //first contact added will be the primary contact 
      if (this.vContact.length == 0) {
        contactDetail.primaryContact = true;
      }
      this.dialogRef.close(contactDetail);
      this.ContactForm.reset();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.ContactForm.markAllAsTouched();
      this.validateall(this.ContactForm);
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
  EditMode() {
    debugger
    if (this.data.mode == 'Edit') {
      this.ContactForm.patchValue(this.data.contactData);
      this.contactTypeId = this.data.contactData.contactTypeId;
      this.departmentId = this.data.contactData.departmentId;
      this.departmentName = this.data.contactData.departmentName
      this.contactTypeName = this.data.contactData.contactTypeName
      this.ContactForm.controls['contactTypeId'].setValue(this.data.contactData);
      this.ContactForm.controls['departmentId'].setValue(this.data.contactData);
    }
    else if (this.data.mode == 'View') {
      this.viewMode = true;
      this.ContactForm.disable();
      this.ContactForm.patchValue(this.data.contactData);
      this.contactTypeId = this.data.contactData.contactTypeId;
      this.departmentId = this.data.contactData.departmentId;
      this.departmentName = this.data.contactData.departmentName
      this.contactTypeName = this.data.contactData.contactTypeName
      this.ContactForm.controls['contactTypeId'].setValue(this.data.contactData);
      this.ContactForm.controls['departmentId'].setValue(this.data.contactData);
    }
  }
  Close() {
    this.dialogRef.close();
    this.ContactForm.reset();
  }
  //Load dropdown

  //contact List
  getContactList() {
    debugger
    this.contactTypeService.getContactTypeActive().subscribe(res => {
      this.ContactList = res;
      console.log(this.ContactList)
      this.contactFun();
    });
  }
  contactFun() {
    this.filteredContactOptions$ = this.ContactForm.controls['contactTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.contactTypeName)),
      map((name: any) => (name ? this.filteredContactOptions(name) : this.ContactList?.slice()))
    );
  }
  private filteredContactOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.ContactList.filter((option: any) => option.contactTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatacontact();
  }
  NoDatacontact(): any {
    this.ContactForm.controls['contactTypeId'].setValue('');
    return this.ContactList;
  }
  displaycontactLabelFn(data: any): string {
    return data && data.contactTypeName ? data.contactTypeName : '';
  }
  contactSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.contactTypeId = selectedValue.contactTypeId;
    this.contactTypeName = selectedValue.contactTypeName;
  }

  //department list
  getDepartmentList() {
    this.commonService.getDepartments(this.liveStatus).subscribe(res => {
      this.departmentList = res;
      this.departmentFun();
    });

  }
  departmentFun() {
    this.filteredDepartmentOptions$ = this.ContactForm.controls['departmentId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.departmentName)),
      map((name: any) => (name ? this.filteredDepartmentOptions(name) : this.departmentList?.slice()))
    );
  }
  private filteredDepartmentOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.departmentList.filter((option: any) => option.departmentName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataDepartment();
  }
  NoDataDepartment(): any {
    this.ContactForm.controls['departmentId'].setValue('');
    return this.departmentList;
  }
  displayDepartmentLabelFn(data: any): string {
    return data && data.departmentName ? data.departmentName : '';
  }
  DepartmentSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.departmentId = selectedValue.departmentId;
    this.departmentName = selectedValue.departmentName;
  }

}
