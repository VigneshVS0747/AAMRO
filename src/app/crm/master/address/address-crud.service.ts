import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressType } from 'src/app/Models/crm/master/AddresssType';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AddressCrudService {

  constructor(private http: HttpClient) { }
  getAddressType(): Observable<AddressType[]> {
    return this.http.get<AddressType[]>(environment.apiUrl + "AddressType/GetAllAddressType")
  }
  GetAllActiveAddressType(): Observable<AddressType[]> {
    return this.http.get<AddressType[]>(environment.apiUrl + "AddressType/GetAllActiveAddressType")
  }
  addAddressType(addressType: AddressType) {
    return this.http
      .post<{ message: string }>(environment.apiUrl + "AddressType/AddAddressType", addressType)
  }
  deleteAddressType(AddressTypeId: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "AddressType/Delete/" + AddressTypeId);
  }
  updateAddressType(addressType: AddressType) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "AddressType/UpdateAddressType", addressType);
  }
  getAddressTypeById(id: number) {

    return this.http.get<AddressType[]>(environment.apiUrl + "AddressType/AddressTypeBy/" + id);
  }
  isActiveAddresstype(addressid: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "AddressType/IsActive/" + addressid);
  }
}
