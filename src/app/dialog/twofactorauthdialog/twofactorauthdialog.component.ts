import { Component } from '@angular/core';
import { ChangepasswordService } from '../changepassworddialog/changepassword.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-twofactorauthdialog',
  templateUrl: './twofactorauthdialog.component.html',
  styleUrls: ['./twofactorauthdialog.component.css']
})
export class TwofactorauthdialogComponent {
  minutes: number = 5;
  seconds: number = 0;
  timer: any;
  otpValue: string[] = ['', '', '', ''];
  concatenatedValue: string = '';

  constructor(private service:ChangepasswordService, private dialog: MatDialog, private router: Router,
    public dialogRef: MatDialogRef<TwofactorauthdialogComponent>) { }

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.minutes === 0 && this.seconds === 0) {
          clearInterval(this.timer);
          // Timer completed, you can perform actions here
          console.log('Timer completed');
          return;
        }
        this.minutes--;
        this.seconds = 59;
      }
    }, 1000);
  }


  digitValidate(event: any) {
    let value = event.value;
    event.value = value.replace(/[^0-9]/g, '');
  }

  onKeyup(index: number, event: any) {
    const prevIndex = index - 1;
    const prevInput = document.getElementsByName('otp')[prevIndex] as HTMLInputElement;
    const currentInput = event.target as HTMLInputElement;

    if (event.keyCode === 8 && index > 0) {
        event.preventDefault();
        currentInput.value = '';
        prevInput.focus();
    } else {
        const nextInput = document.getElementsByName('otp')[index + 1] as HTMLInputElement;
        if (nextInput && currentInput.value.length === 1) {
            nextInput.focus();
        }
    }
}

isBoxEmpty(index: number): boolean {
  return !this.otpValue[index];
}
isAnyBoxEmpty(): boolean {
  return this.otpValue.some(value => !value);
}
submit(){
  this.concatenatedValue = this.otpValue.join('');
  var user =localStorage.getItem('User');

  var payload = {
    userId: user,
    otp: this.concatenatedValue
    
  };

  this.service.Verifyotp(payload).subscribe({
    next: (res) => {
      if(res.message=="success"){
        this.dialogRef.close();
        this.router.navigate(["ums"]);
       }else{
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Otp expired",
          showConfirmButton: false,
          timer: 3000,
        });
       }
    },
    error: (err) => {
      if(err.error.ErrorDetails=="Sequence contains no elements")
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Please enter valid otp",
        showConfirmButton: false,
        timer: 3000,
      });
    },
  });
}
}
