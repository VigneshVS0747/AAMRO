import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrailerType } from 'src/app/Models/crm/master/trailerType';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TrailerTypeService {

  constructor(private http: HttpClient) 
  { 

  }
 
  CreateTrailerType(TrailerType:TrailerType):Observable<TrailerType>{
    return this.http.post<TrailerType>(environment.apiUrl+"TrailerType/AddTrailerType",TrailerType)
  }
   GetAllTrailerType(id: number): Observable<TrailerType[]> {
    return this.http.get<TrailerType[]>(
      environment.apiUrl + "TrailerType/GetAllTrailerType" + "/" + id
    );
  }

  DeleteTrailerType(id:number):Observable<TrailerType>{
    return this.http.delete<TrailerType>(environment.apiUrl+"TrailerType/Delete"+'/'+id);
  } 

  IsActive(id:number):Observable<TrailerType>{
    return this.http.delete<TrailerType>(environment.apiUrl+"TrailerType/IsActive"+'/'+id);
  } 

}
