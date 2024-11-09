import { Injectable } from '@angular/core';
import { UOM } from './unitofmeasure.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UOMsService {


  constructor(private http: HttpClient) { }

    addUOM(uoms:UOM) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "UOM/AddUOMs",uoms)
}
getAllActiveUOM() {
  return this.http.get<UOM[]>( environment.apiUrl+ "UOM/UOMGetAllActive");
}
deleteUOM(uomId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl +  "UOM/DeleteUOM/" + uomId);
}

getUOM(id: number) {
  
  return this.http.get<{ uomId: number;
    uomCode: string;
    uomName: string;
    uomDescription:string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; }>(
      environment.apiUrl + "UOM/UOMsBy/" + id
  );
}

getUOMs(): Observable<UOM[]> {
    return this.http.get<UOM[]>(
      environment.apiUrl + "UOM/GetAllUOMs" 
    );
  }
updateUOM(uom:UOM) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "UOM/UpdateUOMs",uom);
}
IsActive(id:number):Observable<UOM>{
  return this.http.delete<UOM>(environment.apiUrl+"UOM/IsActive"+'/'+id);
} 
}
