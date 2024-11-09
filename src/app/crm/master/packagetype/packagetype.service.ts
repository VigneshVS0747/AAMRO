import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackageType } from './packagetype.model'
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class packagetypeService {

  constructor(private http: HttpClient) { }

  getAllpackagetype(): Observable<PackageType[]> {
    return this.http.get<PackageType[]>(environment.apiUrl + "packagetype/GetAllpackagetype")

  }
  getAllActivePackagetype(): Observable<PackageType[]> {
    return this.http.get<PackageType[]>(environment.apiUrl + "packagetype/PackageTypeGetAllActive")

  }

  addpackagetype(packagetype: PackageType) {

    return this.http
      .post<{ message: string }>(environment.apiUrl + "packagetype/Addpackagetype", packagetype)
  }

  deletepackagetype(packagetypeId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "packagetype/Delete/" + packagetypeId);
  }

  getpackagetype(id: number) {

    return this.http.get<{
      packagetypeId: number;
      packagetypeCode: string;
      packagetypeName: string;
      description: string;
      livestatus: boolean;
      createdBy: number;
      createdDate: Date;
      updatedBy: number | null;
      updatedDate: Date;
    }>(
      environment.apiUrl + "packagetype/packagetypeBy/" + id
    );
  }

  updatepackagetype(packagetype: PackageType) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "packagetype/Updatepackagetype", packagetype);
  }
  isActivePackagetype(id: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "packagetype/IsActive/" + id);
  }
}

