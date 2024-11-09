import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactType } from 'src/app/Models/crm/master/ContactType';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContactTypeService {

  constructor(private http: HttpClient) { }
  getContactTypeActive(): Observable<ContactType[]> {
    return this.http.get<ContactType[]>(environment.apiUrl + "ContactType/GetIsActiveContactType")
  }
  getContactType(): Observable<ContactType[]> {
    return this.http.get<ContactType[]>(environment.apiUrl + "ContactType/GetAllContact")
  }
  addContactType(contactType: ContactType) {
    return this.http
      .post<{ message: string }>(environment.apiUrl + "ContactType/ContactSave", contactType)
  }
  deleteContactType(contactTypeId: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "ContactType/Delete/" + contactTypeId);
  }
  updateContactType(contactType: ContactType) {
    return this.http
      .post<{ message: string }>(environment.apiUrl + "ContactType/ContactSave", contactType);
  }
  getContactTypeById(id: number) {
    return this.http.get<ContactType[]>(environment.apiUrl + "ContactType/GetContactTypeById/" + id);
  }
  isActiveContactType(contactTypeid: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "ContactType/IsActive/" + contactTypeid);
  }
}
