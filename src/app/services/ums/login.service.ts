import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Login } from "src/app/Models/ums/Login.modal";

import { environment } from "src/environments/environment.development";
import { Injectable } from "@angular/core";
import { passwordRemainder } from "src/app/ums/admin/user/user.model";


@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(private http: HttpClient) {}

  UserLogin(logins: Login): Observable<Login> {
    return this.http.post<any>(`${environment.apiUrl}Login/CheckLogins`, logins);
  }

  logout = () => {
    localStorage.clear();
  };

  GenerateRefreshToken(){
    let input ={
      "jwtToken":this.GetToken(),
      "refreshToken":this.GetRefreshToken()
    }
    return this.http.post(environment.apiUrl +'Login/Refreshtoken',input);
  }

  isLoggedIn = () => {
    
    let storedData = localStorage.getItem("local_data");
    if (!storedData) return false;
    let decryptedData = CryptoJS.AES.decrypt(
      localStorage.getItem("local_data")!,
      environment.secret_key
    ).toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      this.logout();
    } else {
      decryptedData = JSON.parse(decryptedData);
    }
    return decryptedData ? true : false;
  };

  IsLoggedIn(){
    return localStorage.getItem("token")!=null;
  }

  GetToken(){
    return localStorage.getItem("token");
  }

  GetRefreshToken(){
    return localStorage.getItem("refreshtoken");
  }

  SaveToken(tokendata:any){
    localStorage.setItem("token",tokendata.jwtToken);
    localStorage.setItem("refreshtoken",tokendata.refreshToken);

  }

  LoginAttempt(Data:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Login/LoginAttempt",Data)
  }

  CheckEmployee(Data:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Login/CheckEmployee",Data)
  }

  LoginAttemptupdate(Data:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Login/LoginAttemptupdate",Data)
  }
  PasswordControl(Data:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Login/PasswordControl",Data)
  }

  PasswordRemainder(Data:any):Observable<passwordRemainder>{
    return this.http.post<passwordRemainder>(environment.apiUrl+"Login/PasswordRemainder",Data)
  }
}
