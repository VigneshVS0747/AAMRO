import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationItem } from '../../Models/ums/authorizationitem.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Branch } from '../../ums/masters/branch/branch.model';
import { customer } from 'src/app/Models/ums/customer.modal';
import { jobtype } from 'src/app/Models/ums/Jobtype.modal';
import { Brand } from 'src/app/Models/ums/brand.modal';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationitemService {
  private filterState = new BehaviorSubject<any>(null);
  
  constructor(private http:HttpClient) { }

  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }

  createAuthoriazationitem(Auth:AuthorizationItem):Observable<AuthorizationItem>{
    return this.http.post<AuthorizationItem>(environment.apiUrl+"AuthorizationItem/AddAuthorizationitem",Auth)
  }
  
  GetAuthorizationitems(id:number) : Observable<AuthorizationItem[]>{
    return this.http.get<AuthorizationItem[]>(environment.apiUrl+"AuthorizationItem/GetAllAuthorizationitem"+'/'+id)
   }


   GetAuthorizationitembyId(id:string): Observable<any>{
    return this.http.get<any>(environment.apiUrl+"AuthorizationItem/AuthorizationitemBy"+'/'+id);
   }

   DeleteAuthorizationitembyId(id:number): Observable<AuthorizationItem>{
    return this.http.delete<AuthorizationItem>(environment.apiUrl+"AuthorizationItem/Delete"+'/'+id);
   }
   IsActiveAuthorizationitembyId(id:number): Observable<AuthorizationItem>{
    return this.http.delete<AuthorizationItem>(environment.apiUrl+"AuthorizationItem/IsActive"+'/'+id);
   }
   UpdateAuthorizationitem(Auth:AuthorizationItem):Observable<AuthorizationItem>{
    return this.http.put<AuthorizationItem>(environment.apiUrl+"AuthorizationItem/UpdateAuthorizationitem",Auth);
  }
  GetAuthorizationitemList(data:any):Observable<any> {
    return this.http.post<any>(environment.apiUrl+"Authorizationmatrix/GetAuthitem", data);
  }

  Getbranch() : Observable<Branch[]>{
    return this.http.get<Branch[]>(environment.apiUrl+"Branch/GetAllBranchtype")
   }

   Getcustomer() : Observable<customer[]>{
    return this.http.get<customer[]>(environment.apiUrl+"Customer/CustomerGetAll")
   }

   Getjobtype() : Observable<jobtype[]>{
    return this.http.get<jobtype[]>(environment.apiUrl+"Jobtype/GetAlljobtype")
   }
   Getbrand() : Observable<Brand[]>{
    return this.http.get<Brand[]>(environment.apiUrl+"Brand/GetAllBrand")
   }

}
