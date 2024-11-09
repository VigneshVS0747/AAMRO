import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InfosourceService {


  constructor(private http: HttpClient) { }
  getInfosource(id:number): Observable<Infosource[]> {    
     return this.http.get<Infosource[]>(environment.apiUrl + "Infosource/GetAllInfosource/"+id)
  }
  addInfosource(infosource: Infosource) {
    return this.http
      .post<{ message: string }>(environment.apiUrl + "Infosource/AddInfosource", infosource)
  }
  deleteInfosource(infosourceId: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "Infosource/Delete/" + infosourceId);
  }
  updateInfosource(infosource: Infosource) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "Infosource/UpdateInfosource", infosource);
  }
  isActiveInfosource(infosourceid: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "Infosource/IsActive/" + infosourceid);
  }
}
