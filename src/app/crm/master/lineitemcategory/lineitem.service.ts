import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LineitemService {

  constructor(private http: HttpClient) 
  { 

  }
 
  CreatelineItem(lineItem:lineitem):Observable<lineitem>{
    return this.http.post<lineitem>(environment.apiUrl+"LineItemCategory/LineItemCategory",lineItem)
  }
   GetAlllineItem(id: number): Observable<lineitem[]> {
    return this.http.get<lineitem[]>(
      environment.apiUrl + "LineItemCategory/GetAllLineItemCategory" + "/" + id
    );
  }

  DeletelineItem(id:number):Observable<lineitem>{
    return this.http.delete<lineitem>(environment.apiUrl+"LineItemCategory/Delete"+'/'+id);
  } 
  isActiveLineItem(id: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "LineItemCategory/IsActive/" + id);
  }
}
