import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private filterState = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  //#region filter State
  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }
  //#endregion


  addEmployee(Employee: Employee) {

    return this.http
      .post<{ message: string }>(environment.apiUrl + "Employee/AddEmployee", Employee)
  }

  deleteEmployee(EmployeeId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "Employee/Delete/" + EmployeeId);
  }

  isActiveEmployee(EmployeeId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "Employee/IsActive/" + EmployeeId);
  }

  getEmployee(id: number) {

    return this.http.get<{
      employeeId: number;
      employeeCode: string;
      employeeName: string;
      departmentId: number;
      departmentName: string;
      reportingTo: number;
      reportingName: string;
      designationId: number;
      designationName: string;
      branchId: number;
      branchName: string;
      cityId: number;
      cityName: string;
      stateId: number;
      stateName: string;
      countryId: number;
      countryName: string;
      email: string;
      contactNumber: string;
      doj: Date;
      address: string;
      empSignature: string;
      livestatus: boolean;
      createdBy: number;
      createdDate: Date;
      updatedBy: number;
      updatedDate: Date;
    }>(
      environment.apiUrl + "Employee/EmployeeBy/" + id
    );
  }

  updateEmployee(Employee: Employee) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "Employee/UpdateEmployee", Employee);
  }

}
