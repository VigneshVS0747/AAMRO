import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { PartMaster, PartMasterContainer } from 'src/app/Models/crm/master/partmaster';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PartmasterService {

  private filterState = new BehaviorSubject<any>(null);
 
  constructor(private http: HttpClient) { }

  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }


  CreateLineItemMaster(PartMaster:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"PartMaster/AddPartMaster",PartMaster)
  }

  UploadImage(PartMaster:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}PartMaster/UploadFile`,PartMaster)
  }

  GetAllPartMaster(id:number): Observable<PartMaster[]> {
    return this.http.get<PartMaster[]>(
      environment.apiUrl + "PartMaster/GetAllPart"+'/'+ id
    );
  }

  GetAllPartMasterById(id:number): Observable<PartMasterContainer> {
    return this.http.get<PartMasterContainer>(
      environment.apiUrl + "PartMaster/GetAllPartMaster"+'/'+ id
    );
  }

  GetAllUOM(): Observable<PartMaster[]> {
    return this.http.get<PartMaster[]>(
      environment.apiUrl + "UOM/GetAllUOMs"
    );
  }

  DeletePartMaster(id:number):Observable<PartMasterContainer>{
    return this.http.delete<PartMasterContainer>(environment.apiUrl+"PartMaster/Delete"+'/'+id);
  }

  IsActivePartMaster(Id: number) {
    return this.http.delete<{ message: string}>(environment.apiUrl + "PartMaster/IsActive/" + Id);
  }
}