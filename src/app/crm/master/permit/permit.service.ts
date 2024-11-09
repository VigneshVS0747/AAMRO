import { Injectable } from '@angular/core';
import { Permit } from './permit.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PermitService {

  constructor(private http: HttpClient) { }

  getAllPermit(): Observable<Permit[]> {
    return this.http.get<Permit[]>(environment.apiUrl + "Permit/GetAllPermit")

  }
  getAllActivePermit() {
    return this.http.get<Permit[]>( environment.apiUrl+ "Permit/PermitGetAllActive");
}
  addPermit(permit: Permit) {

    return this.http
      .post<{ message: string }>(environment.apiUrl + "Permit/AddPermit", permit)
  }

  deletePermit(permitId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "Permit/Delete/" + permitId);
  }

  getPermit(id: number) {

    return this.http.get<{
      permitId: number;
      permitCode: string;
      permitName: string;
      countryId: number;
      countryName: string;
      livestatus: boolean;
      createdBy: number;
      createdDate: Date;
      updatedBy: number | null;
      updatedDate: Date;
    }>(
      environment.apiUrl + "Permit/PermitBy/" + id
    );
  }

  updatePermit(permit: Permit) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "Permit/UpdatePermit", permit);
  }
  isActivePermit(id: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "Permit/IsActive/" + id);
  }

}
