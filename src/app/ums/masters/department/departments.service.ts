import { Injectable } from '@angular/core';
import { Department } from './department.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(private http: HttpClient) { }

  addDepartment(department:Department) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "Department/AddDepartments",department)
}

deleteDepartment(departmentId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "Department/Delete/" + departmentId);
}
IsActiveDepartment(departmentId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "Department/IsActive/" + departmentId);
}

getDepartment(id: number) {
  
  return this.http.get<{ departmentId: number;
    departmentCode: string;
    departmentName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; }>(
      environment.apiUrl + "Department/DepartmentsBy/" + id
  );
}

updateDepartment(department:Department) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "Department/UpdateDepartments",department);
}
}
