import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeServiceService {

  constructor(private http: HttpClient) 
  { 

  }
 
  CreateServiceType(ServiceType:ServiceType):Observable<ServiceType>{
    return this.http.post<ServiceType>(environment.apiUrl+"ServiceType/ServiceType",ServiceType)
  }
   GetAllServiceType(id: number): Observable<ServiceType[]> {
    return this.http.get<ServiceType[]>(
      environment.apiUrl + "ServiceType/GetAllServiceType" + "/" + id
    );
  }

  DeleteServiceType(id:number):Observable<ServiceType>{
    return this.http.delete<ServiceType>(environment.apiUrl+"ServiceType/Delete"+'/'+id);
  } 
  IsActive(id:number):Observable<ServiceType>{
    return this.http.delete<ServiceType>(environment.apiUrl+"ServiceType/IsActive"+'/'+id);
  } 
}
