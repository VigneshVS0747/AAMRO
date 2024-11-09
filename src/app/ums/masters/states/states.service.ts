import { Injectable } from '@angular/core';
import { State } from './state.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  
  constructor(private http: HttpClient) { }

  getStates(id:number) : Observable<State[]>{
    return this.http.get<State[]>(environment.apiUrl + "States/GetAllStates"+'/'+id)
    
   }

  addState(state:State) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "States/AddStates",state)
}

deleteState(stateId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "States/Delete/" + stateId);
}

isActiveState(stateId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "States/IsActive/" + stateId);
}
getState(id: number) {
  
  return this.http.get<{ stateId: number;
    stateCode: string;
    stateName: string;
    countryId: number;
    countryName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; }>(
      environment.apiUrl + "States/StatesBy/" + id
  );
}

updateState(state:State) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "States/UpdateStates",state);
}
}
