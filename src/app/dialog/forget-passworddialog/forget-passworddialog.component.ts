import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangepasswordService } from '../changepassworddialog/changepassword.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ForegetPassword } from 'src/app/Models/ums/Login.modal';
import { VerifyOtpdialogComponent } from '../verify-otpdialog/verify-otpdialog.component';
import { ForgetpasswordchangedialogComponent } from '../forgetpasswordchangedialog/forgetpasswordchangedialog.component';

@Component({
  selector: 'app-forget-passworddialog',
  templateUrl: './forget-passworddialog.component.html',
  styleUrls: ['./forget-passworddialog.component.css']
})
export class ForgetPassworddialogComponent implements OnInit {
  
  Forgetpassword!: FormGroup;
  
  constructor(private FB:FormBuilder,
    private service:ChangepasswordService
    , public dialogRef: MatDialogRef<ForgetPassworddialogComponent>,
    private dialog: MatDialog,){}
  ngOnInit(): void {
   this.ForgetPasswordForm();
  }

  ForgetPasswordForm(){
    this.Forgetpassword = this.FB.group({
      userId: ["", Validators.required] 
    });
  }

  Submit(){
    if(this.Forgetpassword.valid){
      const forget:ForegetPassword={
        ...this.Forgetpassword.value
      }
      this.service.Forgetpassword(forget).subscribe((res=>{
        res.message
        if(res.userId !=null){
          var iddds=localStorage.setItem("User",res.userId); 
          console.log("iddds----------------------",iddds)
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'Otp send to your email'
          })
         const dialogRef = this.dialog.open(VerifyOtpdialogComponent, {
     
         });
         this.dialogRef.close();
        }else{
         Swal.fire({
           icon: "error",
           title: "error",
           text: "UserId not found",
           showConfirmButton: false,
           timer: 2000,
         });
         this.Forgetpassword.get('userId')?.setValue("");
        }
       }));
    }else{
      this.Forgetpassword.markAllAsTouched();
      this.validateall(this.Forgetpassword);
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
}
