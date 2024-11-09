import { Injectable } from '@angular/core';
import { ContainerType } from './containertype.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContainerTypeService {

  constructor(private http: HttpClient) { }

  getAllContainerType(): Observable<ContainerType[]> {
    return this.http.get<ContainerType[]>(environment.apiUrl + "ContainerType/GetAllContainerType")

  }
  getAllActiveContainerType(): Observable<ContainerType[]> {
    return this.http.get<ContainerType[]>(environment.apiUrl + "ContainerType/ContainerTypeGetAllActive")

  }

  addContainerType(containerType: ContainerType) {

    return this.http
      .post<{ message: string }>(environment.apiUrl + "ContainerType/AddContainerType", containerType)
  }

  deleteContainerType(containerTypeId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "ContainerType/Delete/" + containerTypeId);
  }

  getContainerType(id: number) {

    return this.http.get<{
      containerTypeId: number;
      containerTypeCode: string;
      containerTypeName: string;
      description: string;
      livestatus: boolean;
      createdBy: number;
      createdDate: Date;
      updatedBy: number | null;
      updatedDate: Date;
    }>(
      environment.apiUrl + "ContainerType/ContainerTypeBy/" + id
    );
  }

  updatecontainerType(containerType: ContainerType) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "ContainerType/UpdateContainerType", containerType);
  }
  isActiveContainerType(id: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "ContainerType/IsActive/" + id);
  }
}
