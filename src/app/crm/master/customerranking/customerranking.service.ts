import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerRanking } from './customerranking.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerrankingService {

  constructor( private http: HttpClient) { }
  getCustomerRanking(): Observable<CustomerRanking[]> {    
    return this.http.get<CustomerRanking[]>(environment.apiUrl + "CustomerRanking/GetAllCustomerRanking")
 }
 GetAllActiveCustomerRanking(): Observable<CustomerRanking[]> {    
  return this.http.get<CustomerRanking[]>(environment.apiUrl + "CustomerRanking/GetAllActiveCustomerRanking")
}
 addCustomerRanking(customerRanking: CustomerRanking) {
  return this.http
    .post<{ message: string }>(environment.apiUrl + "CustomerRanking/CustomerRankingSave", customerRanking)
}
deleteCustomerRanking(Id: number) {
  return this.http.delete<{ message: string }>(environment.apiUrl + "CustomerRanking/CustomerRankingDelete/" + Id);
}
updateCustomerRanking(customerRanking: CustomerRanking) {
  return this.http
    .put<{ message: string }>(environment.apiUrl + "CustomerRanking/CustomerRankingSave", customerRanking);
}
isActiveCustomerRanking(id: number){
  return this.http.delete<{ message: string}>(environment.apiUrl + "CustomerRanking/IsActive/" + id);
}
}
