import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckPassword, ForegetPassword, forgetPasswordChange } from 'src/app/Models/ums/Login.modal';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

  constructor(private http: HttpClient) {}


  checkpassword(check:CheckPassword):Observable<CheckPassword>{
    return this.http.post<CheckPassword>(environment.apiUrl+"Login/CheckPasswordandUpdate",check)
  }

  Forgetpassword(check:ForegetPassword):Observable<ForegetPassword>{
    return this.http.post<ForegetPassword>(environment.apiUrl+"Login/ForgetPassword",check)
  }

  Verifyotp(check:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Login/Verifyotp",check)
  }

  ForgetpasswordUpdate(check:forgetPasswordChange):Observable<forgetPasswordChange>{
    return this.http.post<forgetPasswordChange>(environment.apiUrl+"Login/PasswordandUpdate",check)
  }
}
