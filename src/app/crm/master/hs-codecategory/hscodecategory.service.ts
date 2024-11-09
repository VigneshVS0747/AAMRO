import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hscodecategory } from 'src/app/Models/crm/master/Hscodecategory';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HscodecategoryService {

  constructor(private http: HttpClient) 
  { 

  }
 
  CreatehSCodeCategory(hSCodeCategory:Hscodecategory):Observable<Hscodecategory>{
    return this.http.post<Hscodecategory>(environment.apiUrl+"HSCodeCategory/AddHsCode",hSCodeCategory)
  }
   GetAllhSCodeCategory(id: number): Observable<Hscodecategory[]> {
    return this.http.get<Hscodecategory[]>(
      environment.apiUrl + "HSCodeCategory/GetAllHSCodeCategory" + "/" + id
    );
  }

  DeletehSCodeCategory(id:number):Observable<Hscodecategory>{
    return this.http.delete<Hscodecategory>(environment.apiUrl+"HSCodeCategory/Delete"+'/'+id);
  } 

  IsActive(id:number):Observable<Hscodecategory>{
    return this.http.delete<Hscodecategory>(environment.apiUrl+"HSCodeCategory/IsActive"+'/'+id);
  } 

  UpdatehSCodeCategory(hSCodeCategory:Hscodecategory):Observable<Hscodecategory>{
    return this.http.put<Hscodecategory>(environment.apiUrl+"HSCodeCategory/UpdateHscodecategory",hSCodeCategory)
  }
}
