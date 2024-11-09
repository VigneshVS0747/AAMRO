import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ChangepasswordService } from '../changepassworddialog/changepassword.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { forgetPasswordChange } from 'src/app/Models/ums/Login.modal';
import { LoginService } from 'src/app/services/ums/login.service';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const newPassword = control.get('password');
  const confirmPassword = control.get('repeatpassword');

  if (confirmPassword && newPassword && confirmPassword.value != newPassword.value) {
    return { repeatpasswordMatch: true };
  }

  return null;
};

@Component({
  selector: 'app-forgetpasswordchangedialog',
  templateUrl: './forgetpasswordchangedialog.component.html',
  styleUrls: ['./forgetpasswordchangedialog.component.css']
})
export class ForgetpasswordchangedialogComponent {
  forgetpasswordchange!: FormGroup;
  hide:boolean=true;
  hidepassword:boolean=true;
  hiderepeatpassword:boolean=true;
  LoginUser=localStorage.getItem("User")!;
  LoginUserId=localStorage.getItem("User")!;
  passwordIsValid: any;
  Employeeid: any;

  constructor(private FB:FormBuilder,
    private service:ChangepasswordService,
    private Ls:LoginService,public dialogRef: MatDialogRef<ForgetpasswordchangedialogComponent>
   ){}
    
  ngOnInit(): void {
    this.ChangePasswordForm();
  }

  ChangePasswordForm(){
    this.forgetpasswordchange = this.FB.group({
      password: ["", [Validators.required, Validators.minLength(8)]],
      repeatpassword: ["", [Validators.required, Validators.minLength(8)]],
    }, { validator: passwordMatchValidator });
  }
  
  Submit(){
    if(this.forgetpasswordchange.valid){
      var Checkemp={
        employeeCode:this.LoginUser
      }
      this.Ls.CheckEmployee(Checkemp).subscribe((res=>{
        if(res.employeeId!=null){
          this.Employeeid = res.employeeId;
          const passctrl ={
            userId:this.Employeeid,
            userPassword:this.forgetpasswordchange.controls["password"].value
          }
          this.Ls.PasswordControl(passctrl).subscribe((res)=>{
            if(res.message =='Success'){
              const ForgetPass:forgetPasswordChange={
                employeeCode:this.LoginUser,
                ...this.forgetpasswordchange.value 
              }
              this.service.ForgetpasswordUpdate(ForgetPass).subscribe((res=>{
               res.message
               if(res.message==="Password updated successfully."){
                Swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "Password reset successfully.",
                  showConfirmButton: false,
                  timer: 2000,
                });
                this.dialogRef.close();
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
          })
    
        }else{
          Swal.fire({
            icon: "error",
            title: "error",
            text: "Please enter valid userId",
            showConfirmButton: false,
            timer: 5000,
          });
        }
      }));
      
      
    }else{
      this.forgetpasswordchange.markAllAsTouched();
      this.validateall(this.forgetpasswordchange);
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
