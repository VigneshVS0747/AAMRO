import { Injectable } from '@angular/core';
import { UOMConversion } from './uomconversion.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UOMConversionService {
  

  constructor(private http: HttpClient) { }

    addUOMConversion(uomConversion:UOMConversion) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "UOMConversion/AddUOMConversion",uomConversion)
}
getAllActiveUOMConversion() {
  return this.http.get<UOMConversion[]>( environment.apiUrl+ "UOMConversion/UOMConversionGetAllActive");
}
deleteUOMConversion(uomConversionId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl +  "UOMConversion/DeleteUOMConversion/" + uomConversionId);
}

getUOMConversion(id: number) {
  
  return this.http.get<{
    uomConversionId: number;
    //selectedValueToUOM: string;
    uomName:string;
    uomtoName:string;
   // uomCodee:string;
    uomFromId:number;
    uomToId:number;
    conversionRate:number;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;

}>(
  environment.apiUrl + "UOMConversion/UOMConversionBy/" + id
  );
}

getAllUOMConversion(): Observable<UOMConversion[]> {
    return this.http.get<UOMConversion[]>(
      environment.apiUrl + "UOMConversion/GetAllUOMConversion" 
    );
  }

updateUOMConversion(uomConversion:UOMConversion) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "UOMConversion/UpdateUOMConversion",uomConversion);
}
}
