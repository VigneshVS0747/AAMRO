import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorizationmatrix } from '../../Models/ums/authorizationmatrix.modal';
import { Observable } from 'rxjs';
import { AuthorizationItem } from '../../Models/ums/authorizationitem.model';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationmatrixService {

  constructor(private http:HttpClient) { }

  createAuthoriazationmatrix(Authmatrix:Authorizationmatrix):Observable<Authorizationmatrix>{
    return this.http.post<Authorizationmatrix>(environment.apiUrl+"Authorizationmatrix/AddAuthorizationMatrix",Authmatrix)
  }
  GetAuthorizationmatrix() : Observable<Authorizationmatrix[]>{
    return this.http.get<Authorizationmatrix[]>(environment.apiUrl+"Authorizationmatrix/GetAllAuthorizationMatrix")
   }
  
   GetAuthorizationmatrixbyid(id:string): Observable<Authorizationmatrix[]>{
    return this.http.get<Authorizationmatrix[]>(environment.apiUrl+"Authorizationmatrix/AuthorizationMatrixBy"+'/'+id);
   }
   getitem(id:string){
    return this.http.get<Authorizationmatrix>(environment.apiUrl+"Authorizationmatrix/AuthorizationMatrixBy"+'/'+id);
   }
   UpdateAuthmatrix(data:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Authorizationmatrix/UpdateAuthorizationmatrix",data)
  }
  
  UpdateAuthmatrixname(data:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Authorizationmatrix/UpdateAuthorizationmatrixName",data)
  }

  GetAuthorizationitems(id:number) : Observable<AuthorizationItem[]>{
    return this.http.get<AuthorizationItem[]>(environment.apiUrl+"AuthorizationItem/GetAllAuthorizationitem"+'/'+id)
   }

   GetAuthorizationitemList(data:any):Observable<any> {
    return this.http.post<any>(environment.apiUrl+"Authorizationmatrix/GetAuthitem", data);
  }

}
