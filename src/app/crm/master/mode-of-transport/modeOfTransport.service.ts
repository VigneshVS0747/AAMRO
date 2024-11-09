import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeofTransport } from 'src/app/Models/crm/master/ModeofTransport';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ModeofTransportService {
  map: any;
  constructor(private http: HttpClient) { }
  // Get All Mode of Transport
  getAllModeofTransport(): Observable<ModeofTransport[]> {
    return this.http.get<ModeofTransport[]>(environment.apiUrl + "ModeofTransport/GetAllModeofTransport")
  }
  // Post Mode of Transport
  addModeofTtansport(modeOfTransport: ModeofTransport) {
    return this.http
      .post<{ message: string }>(environment.apiUrl + "ModeofTransport/AddModeofTransport", modeOfTransport)
  }
  // Delete Mode of Transport
  deleteModeofTtansport(modeofTransportIdId: number) {
    return this.http.delete<{ message: string}>(environment.apiUrl + "ModeofTransport/Delete/" + modeofTransportIdId);
  }
  //Get Mode of Transport by id
  getModeofTtansport(id: number) {
  
    return this.http.get<{ designationId: number;
      modeofTransportCode: string;
      modeofTransportName: string;
      livestatus: boolean;
      createdBy: number;
      createdDate:Date;
      updatedBy: number|null;
      updatedDate:Date; }>(
      environment.apiUrl + "ModeofTransport/GetModeofTransportBy/" + id
    );
  }
  //Update Mode of Transport
  updateModeofTransport(modeOfTransport:ModeofTransport) {
    return this.http
      .put<{ message: string}>(environment.apiUrl + "ModeofTransport/UpdateModeofTransport",modeOfTransport);
  }
}
