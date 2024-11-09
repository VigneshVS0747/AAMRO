import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartMaster } from 'src/app/Models/crm/master/partmaster';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PartmasterserviceService {

  constructor(private http: HttpClient) { }



  GetAllPartMaster(id:number): Observable<PartMaster[]> {
    return this.http.get<PartMaster[]>(
      environment.apiUrl + "PartMaster/GetAllPart"+'/'+ id
    );
  }
}
