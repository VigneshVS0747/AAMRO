import { Injectable } from '@angular/core';
import { Designation } from '../../../Models/ums/designation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DesignationsService {

  
  constructor(private http: HttpClient) { }

  addDesignation(designation:Designation) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "Designation/AddDesignation",designation)
   
}

deleteDesignation(designationId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "Designation/Delete/" + designationId);
}
isActiveDesignation(designationId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "Designation/IsActive/" + designationId);
}

getDesignation(id: number) {
  
  return this.http.get<{ designationId: number;
    designationCode: string;
    designationName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; }>(
      environment.apiUrl + "Designation/DesignationBy/" + id
  );
}

updateDesignation(designation:Designation) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "Designation/UpdateDesignation",designation);
}

}
