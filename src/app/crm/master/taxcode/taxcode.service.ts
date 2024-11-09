import { Injectable } from '@angular/core';
import { TaxCode } from './taxcode.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TaxcodeService {
  
  constructor(private http: HttpClient) { }

  addTaxCode(TaxCode:TaxCode) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "TaxCode/AddTaxCode",TaxCode)
}

deleteTaxCode(TaxCodeId: number) {
  console.log(TaxCodeId)
  return this.http.delete<{ message: string}>(environment.apiUrl + "TaxCode/Delete/" + TaxCodeId);
}

getTaxCodes(): Observable<TaxCode[]> {
  return this.http.get<TaxCode[]>(
    environment.apiUrl + "TaxCode/GetAllTaxCode" 
  );
}
getTaxCode(id: number) {
  console.log(id)
  return this.http.get<{
    createddate: string; 
    taxCodeId: number;
    txCode: string;
    taxCodeName: string;
    taxType: string;
    taxPer: string;
    effectiveDate : Date;
    countryId: number;
    countryName: string;
    livestatus:boolean;
    createdby: number;
    createdDate:Date ;
    updatedby:number | null;
    updateddate:Date;
  }>(
    environment.apiUrl + "TaxCode/TaxCodeBy/" + id
  );
}

updateTaxCode(TaxCode:TaxCode) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "TaxCode/UpdateTaxCode",TaxCode);
}
}


