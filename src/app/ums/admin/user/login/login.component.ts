import { Component, OnInit } from "@angular/core";
import {  
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
import { NotificationService } from "src/app/services/notification.service";
import { LoginService } from "src/app/services/ums/login.service";
import { ForegetPassword, Login } from "src/app/Models/ums/Login.modal";
import { environment } from "src/environments/environment";
import { setPrivileges } from "src/app/store/user_privileges/privileges.actions";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { setUserId } from "src/app/store/UserIdStore/userId.action";
import { ForgetPassworddialogComponent } from "src/app/dialog/forget-passworddialog/forget-passworddialog.component";
import { TwofactorauthdialogComponent } from "src/app/dialog/twofactorauthdialog/twofactorauthdialog.component";
import Swal from "sweetalert2";
import { ChangepasswordService } from "src/app/dialog/changepassworddialog/changepassword.service";
import { ChangepassworddialogComponent } from "src/app/dialog/changepassworddialog/changepassworddialog.component";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  resError: string = "";
  hide = true;
  EmployeeId: string;
  mfa: boolean;
  locked: boolean;
  employeecode: string;
  message: any;
  remainingdays: any;
  submitdisable: boolean = false;

  constructor(
    private loginService: LoginService,
    private FB: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private service: ChangepasswordService
  ) { }

  ngOnInit(): void {
    this.LoginFourmbuilder();
  }
  LoginFourmbuilder() {
    this.LoginForm = this.FB.group({
      employeeCode: ["", Validators.required],
      employeePassword: ["", Validators.required],
    });
  }

  SubmitLogin() {
    debugger;
    this.resError = "";
    if (this.LoginForm.valid) {
      const LoginApi = {
        ...this.LoginForm.value,
        menuAuth: [null],
      };
      console.log("LoginApi", LoginApi);
      this.loginService.UserLogin(this.LoginForm.value).subscribe({
        next: (res: Login) => {
          if (res.menuAuth) {
            let encryptedData = CryptoJS.AES.encrypt(
              JSON.stringify(this.LoginForm.value.employeeCode),
              environment.secret_key
            ).toString();
            localStorage.setItem("local_data", encryptedData);
            localStorage.setItem("User_id", res.employeeCode);
            localStorage.setItem("Emp_id", res.employeeId);
            localStorage.setItem("token", res.jwtToken);
            localStorage.setItem("refreshtoken", res.refreshToken);
            this.mfa = res.mfa;
            this.locked = res.locked;
            this.EmployeeId = res.employeeId;
            this.employeecode = res.employeeCode
            if (res.employeeId != null) {
              var Rempass = {
                userID: res.employeeId
              }
              this.loginService.PasswordRemainder(Rempass).subscribe((res) => {
                if (res != null) {
                  this.message = res.reminderMessage;
                  this.remainingdays = res.daysRemaining;
                  if (res.daysRemaining == 1) {
                    const dialogRef = this.dialog.open(ChangepassworddialogComponent, {

                    });
                  } else {
                    if (this.locked == false) {
                      var Updateemp = {
                        employeeId: this.EmployeeId
                      }
                      this.loginService.LoginAttemptupdate(Updateemp).subscribe((res) => {
                        console.log(res);
                      });
                    }
                    if (this.locked == true) {
                      Swal.fire({
                        icon: "error",
                        title: "error",
                        text: "You tried more attempts so your Account has been blocked...!",
                        showConfirmButton: false,
                        timer: 5000,
                      });
                      return;
                    }

                    if (this.mfa == true) {
                      this.submitdisable = true;
                      const forget: ForegetPassword = {
                        userId: this.employeecode,
                        message: ""
                      }
                      this.service.Forgetpassword(forget).subscribe((res => {
                        res.message
                        if (res.userId != null) {
                          var iddds = localStorage.setItem("User", res.userId);
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
                          const dialogRef = this.dialog.open(TwofactorauthdialogComponent, {
                            data: {
                           
                            }, disableClose: true, autoFocus: false
                          });
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "error",
                            text: "UserId not found",
                            showConfirmButton: false,
                            timer: 2000,
                          });
                        }
                      }));
                    } else {
                      this.router.navigate(["ums"]);
                      if (this.remainingdays <= 5) {
                        const Toast = Swal.mixin({
                          toast: true,
                          position: 'top-end',
                          showConfirmButton: false,
                          timer: 8000,
                          timerProgressBar: true,
                          didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                          }
                        })

                        Toast.fire({
                          icon: 'warning',
                          title: this.message
                        })
                      }
                    }
                  }
                } else {
                  if (this.locked == false) {
                    var Updateemp = {
                      employeeId: this.EmployeeId
                    }
                    this.loginService.LoginAttemptupdate(Updateemp).subscribe((res) => {
                      console.log(res);
                    });
                  }
                  if (this.locked == true) {
                    Swal.fire({
                      icon: "error",
                      title: "error",
                      text: "You tried more attempts so your Account has been blocked...!",
                      showConfirmButton: false,
                      timer: 5000,
                    });
                    return;
                  }

                  if (this.mfa == true) {
                    this.submitdisable = true
                    const forget: ForegetPassword = {
                      userId: this.employeecode,
                      message: ""
                    }
                    this.service.Forgetpassword(forget).subscribe((res => {
                      res.message
                      if (res.userId != null) {
                        var iddds = localStorage.setItem("User", res.userId);
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
                        const dialogRef = this.dialog.open(TwofactorauthdialogComponent, {
                          data: {
                           
                          }, disableClose: true, autoFocus: false
                        });
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "error",
                          text: "UserId not found",
                          showConfirmButton: false,
                          timer: 2000,
                        });
                      }
                    }));
                  } else {
                    this.router.navigate(["ums"]);
                    if (this.remainingdays <= 5) {
                      const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 8000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                      })

                      Toast.fire({
                        icon: 'warning',
                        title: this.message
                      })
                    }

                  }
                }

              });
            }


          } else {
            this.resError = res.message;
            this.LoginForm.markAllAsTouched();
            this.LoginForm.reset();
          }
        },
        error: (err) => {
          var employeeCode = this.LoginForm.controls["employeeCode"].value;
          var Checkemp = {
            employeeCode: employeeCode
          }

          this.loginService.CheckEmployee(Checkemp).subscribe({
            next: (res: Login) => {

              if (res.employeeId != null) {
                this.EmployeeId = res.employeeId;
                const LoginAttempt = {
                  employeeId: this.EmployeeId,
                  attempt: 1,
                };
                if (res.locked == false || res.locked == null) {
                  this.loginService.LoginAttempt(LoginAttempt).subscribe((res) => {
                    this.resError = res.message;
                  });
                } else {
                  this.resError = "Your account has been locked...!";
                }

              } else {
                this.resError = "Please enter valid userId";
              }
            },
            error: (err) => {
              this.resError = "Please enter valid userId";
            },
          });
          console.log("login error =>", err);
          this.resError = "Invalid userId and password";
        },
      });
    } else {
      this.LoginForm.markAllAsTouched();
      this.validateall(this.LoginForm);
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

  Forgotpassword() {
    const dialogRef = this.dialog.open(ForgetPassworddialogComponent, {

    });
  }
}
