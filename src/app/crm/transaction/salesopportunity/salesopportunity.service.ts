import { Injectable } from '@angular/core';
import {  SalesOpportunity, SalesOpportunityContainer } from './salesopportunity.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
//import { ModeofTransports } from '../../master/jobtype/jobtypemodel.model';

@Injectable({
  providedIn: 'root'
})
export class SalesOpportunityService {
 // readonly apiUrl = "http://1.22.214.78/AamroApi/api/";
 // readonly localUrl = "https://localhost:7179/api/SalesOpportunity/"
   public isView: boolean = false;
  public isEdit:boolean=false;
  public itemId: number;
  public movetoSalesOpportunity: boolean=false;
  setItemId(id: number): void {
    this.itemId = id;
}
  constructor(private http: HttpClient) { }

  getAllSalesOpportunity(): Observable<SalesOpportunity[]> {
    return this.http.get<SalesOpportunity[]>(environment.apiUrl + "SalesOpportunity/SalesOpportunityGetAll")
  }
  
  SaveSalesOpportunity(salesOpportunityContainer: SalesOpportunityContainer) {

    return this.http
      .post<{ message: string }>(environment.apiUrl + "SalesOpportunity/SalesOpportunitySave", salesOpportunityContainer)
  }

  deleteSalesOpportunity(SalesOpportunityId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "SalesOpportunityDelete/" + SalesOpportunityId);
  }

  getAllSalesOpportunityById(id: number) {
    return this.http.get<SalesOpportunityContainer[]>(
      environment.apiUrl + "SalesOpportunity/SalesOpportunityGetAllById/" + id);
}
getSalesOpportunityByCustomerId(id: number) {
  return this.http.get<SalesOpportunity>(
    environment.apiUrl + "SalesOpportunity/GetSalesOpportunitByCustomerId/" + id);
}

//   GetAllModeofTransport()//"SalesOpportunityGetAllById/" + id
// {
//   return this.http.get<ModeofTransports[]>(
//     environment.apiUrl + "DropDown/GetAllModeofTransport");
// }

}
