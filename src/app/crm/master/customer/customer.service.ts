import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer, CustomerContainer } from './customer.model';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public isView: boolean = false;
  public isEdit:boolean=false;
  public isApprove:boolean=false;
  public editFromApprove:boolean= false;
  public isApproveHistory:boolean=false;

  public itemId: number;
  constructor(private http: HttpClient) { }
  //#region operation on add-edit-view
  setItemId(id: number): void {
    this.itemId = id;
  }
  //#endregion

  getAllCustomer() {
    return this.http.get<Customer[]>(
      environment.apiUrl + "Customer/CustomerGetAll");
  }
  getAllActiveCustomer() {
    return this.http.get<Customer[]>(
      environment.apiUrl + "Customer/CustomerGetAllActive");
  }
  CustomerSave(Customer: any) {
    return this.http.post<CustomerContainer>(
      environment.apiUrl + "Customer/CustomerSave", Customer);
  }
  getAllCustomerById(id: number) {
    debugger
    return this.http.get<CustomerContainer>(
      environment.apiUrl + "Customer/CustomerGetAllById/" + id);
  }

  deleteCustomer(id: number) {
    return this.http.delete<{ message: string }>(
      environment.apiUrl + "Customer/CustomerDelete/" + id);
  }

  CustomerIdByAddress(id: any) {
    let url = environment.apiUrl +`Customer/CustomerIdByAddress?Id=${id}`;
    return this.http.get(url);
  }

  CustomerIdByContact(id: any) {
    let url = environment.apiUrl +`Customer/CustomerIdByContact?id=${id}`;
    return this.http.get(url);
  }
  GetAllPCustomerTOCustomerCount() {
    let url = environment.apiUrl +`Customer/GetAllPCustomerTOCustomerCount`;
    return this.http.get(url);
  }
  GetAllCustomerStatusID(id:any) {
    let url = environment.apiUrl +`Customer/GetAllCustomerStatusID?id=${id}`;
    return this.http.get(url);
  }
  GetCustomerTransformationCounts() {
    let url = environment.apiUrl +`Customer/GetCustomerTransformationCounts`;
    return this.http.get(url);
  }
  GetPCtoCustomerReport(fromDate: any,toDate: any,country: any, salesOwner: any,salesExecutive: any ): Observable<any[]>  {
    return this.http.get<any[]>(
      environment.apiUrl + "Customer/GetPCtoCustomerReport/" + fromDate+"/"+ toDate+"/"+ country+"/"+ salesOwner+"/"+ salesExecutive);
  }
}
