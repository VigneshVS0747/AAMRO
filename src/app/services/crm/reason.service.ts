import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reason, ReasonFlag } from 'src/app/Models/crm/master/Reason';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ReasonService {
  constructor(private http: HttpClient) { }
  // Get All Reason
  getAllReason(id:number): Observable<Reason[]> {
    return this.http.get<Reason[]>(environment.apiUrl + "Reason/GetAllReason/"+id)
  }
  // Post Reason
  addReason(reason: Reason) {
    return this.http
      .post<{ message: string }>(environment.apiUrl + "Reason/AddReason", reason)
  }
  // Delete Reason
  deleteReason(reasonId: number) {
    return this.http.delete<{ message: string}>(environment.apiUrl + "Reason/Delete/" + reasonId);
  }
  //Get Reason
  getReason(id: number) {
  
    return this.http.get<{ 
        reasonId: number;
        reasonCode: string;
        reasonName: string;
        reasonFlag: number;
        remarks: string;
      livestatus: boolean;
      createdBy: number;
      createdDate:Date;
      updatedBy: number;
      updatedDate:Date; }>(
      environment.apiUrl + "Reason/ReasonBy/" + id
    );
  }
  //Update Mode of Transport
  updateReason(reason:Reason) {
    return this.http
      .put<{ message: string}>(environment.apiUrl + "Reason/UpdateReason",reason);
  }

  getAllReasonFlag(): Observable<ReasonFlag[]>{
    return this.http.get<ReasonFlag[]>(environment.apiUrl + "DropDown/GetAllReasonflags")

  }
  isActiveReason(id: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "Reason/IsActive/" + id);
  }
}
