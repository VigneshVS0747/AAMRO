import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators }
 from '@angular/forms';
import { ChangepasswordService } from './changepassword.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { CheckPassword } from 'src/app/Models/ums/Login.modal';
import { LoginService } from 'src/app/services/ums/login.service';

 const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const existPassword = control.get('existpassword');
  const newPassword = control.get('password');
  const confirmPassword = control.get('repeatpassword');

  if (existPassword && newPassword && existPassword.value === newPassword.value) {
    return { existpasswordMatch: true };
  }

  if (confirmPassword && newPassword && confirmPassword.value != newPassword.value) {
    return { repeatpasswordMatch: true };
  }

  return null;
};
@Component({
  selector: 'app-changepassworddialog',
  templateUrl: './changepassworddialog.component.html',
  styleUrls: ['./changepassworddialog.component.css']
})

export class ChangepassworddialogComponent implements OnInit {
  changepassword!: FormGroup;
  hide:boolean=true;
  hidepassword:boolean=true;
  hiderepeatpassword:boolean=true;
  LoginUser=localStorage.getItem("User_id")!;
  LoginUserId=localStorage.getItem("Emp_id")!;
  passwordIsValid: any;

  constructor(private FB:FormBuilder,
    private service:ChangepasswordService,
    private Ls:LoginService
    , public dialogRef: MatDialogRef<ChangepassworddialogComponent>){}
    
  ngOnInit(): void {
    this.ChangePasswordForm();
  }

  ChangePasswordForm(){
    this.changepassword = this.FB.group({
      existpassword: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]],
      repeatpassword: ["", [Validators.required, Validators.minLength(8)]],
    }, { validator: passwordMatchValidator });
  }
  
  Submit(){
    if(this.changepassword.valid){
      const passctrl ={
        userId:this.LoginUserId,
        userPassword:this.changepassword.controls["password"].value
      }
      this.Ls.PasswordControl(passctrl).subscribe((res)=>{
      if(res.message =='Success'){
        const CheckPass:CheckPassword={
          employeeCode:this.LoginUser,
          ...this.changepassword.value 
        }
        this.service.checkpassword(CheckPass).subscribe((res=>{
         res.message
         if(res.message==="Password updated successfully."){
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Password updated successfully.",
            showConfirmButton: false,
            timer: 2000,
          });
          this.dialogRef.close();
         }else{
          Swal.fire({
            icon: "error",
            title: "error",
            text: "Provided old password does not match",
            showConfirmButton: false,
            timer: 5000,
          });
          this.changepassword.get('existpassword')?.setValue("");
         }
        }));       
      }else{
        Swal.fire({
          icon: "error",
          title: "error",
          text: res.message,
          showConfirmButton: false,
          timer: 5000,
        });
      }
      });
      
    }else{
      this.changepassword.markAllAsTouched();
      this.validateall(this.changepassword);
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

  
  passwordValid(event: any) {
    this.passwordIsValid = event;
  }
}
