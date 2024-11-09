import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageType } from 'src/app/Models/crm/master/storagetype';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StoragetypeService {
  private filterState = new BehaviorSubject<any>(null);
  
  constructor(private http: HttpClient) { }

 

  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }

  
  CreateStorageMaster(StorageType:StorageType):Observable<StorageType>{
    return this.http.post<StorageType>(environment.apiUrl+"StorageType/AddStorageType",StorageType)
  }

  GetAllStorageMaster(id:number): Observable<StorageType[]> {
    return this.http.get<StorageType[]>(
      environment.apiUrl + "StorageType/GetAllStorageType"+'/'+ id
    );
  }

  GetAllStorageMasterById(id:number): Observable<StorageType> {
    return this.http.get<StorageType>(
      environment.apiUrl + "StorageType/StorageTypeBy"+'/'+ id
    );
  }

  DeleteStorage(id: number): Observable<any> {
    return this.http.delete<StorageType[]>(
      environment.apiUrl + "StorageType/Delete/" + id
    );
  }

  IsActive(id:number):Observable<StorageType>{
    return this.http.delete<StorageType>(environment.apiUrl+"StorageType/IsActive"+'/'+id);
  } 
}
