import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Industry } from 'src/app/Models/crm/master/Industry';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IndustryServiceService {

  constructor(private http: HttpClient) 
  { }
 
  CreateIndustry(Industry:Industry):Observable<Industry>{
    return this.http.post<Industry>(environment.apiUrl+"Industry/Industry",Industry)
  }
   GetAllIndustry(id: number): Observable<Industry[]> {
    return this.http.get<Industry[]>(
      environment.apiUrl + "Industry/GetAllIndustry" + "/" + id
    );
  }

  DeleteIndustry(id:number):Observable<Industry>{
    return this.http.delete<Industry>(environment.apiUrl+"Industry/Delete"+'/'+id);
  } 
  
  IsActive(id:number):Observable<Industry>{
    return this.http.delete<Industry>(environment.apiUrl+"Industry/IsActive"+'/'+id);
  } 
}
