import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccessControlTemplate, AccessControlTemplateMenus } from "./act.model";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
// import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class ActService {

  private filterState = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }

  addAct(act: AccessControlTemplate) {
    return this.http.post<{ message: string }>(
      environment.apiUrl + "AccessControlTemplate/AddAct",
      act
    );
  }

  getAct(id: number): Observable<any> {
    return this.http.get<{
      accessControlId: number;
      accessControlCode: string;
      accessControlName: string;
      livestatus: boolean;
      createdBy: number;
      createdDate: Date | string;
      updatedBy: number | null;
      updatedDate: Date | string;
      menus?: AccessControlTemplateMenus[];
    }>(environment.apiUrl + "AccessControlTemplate/AccessControlBy/" + id);
  }

  updateAct(act: AccessControlTemplate) {
    return this.http.put<{ message: string }>(
      environment.apiUrl + "AccessControlTemplate/UpdateAct",
      act
    );
  }

  deleteAct(id: number) {
    return this.http.delete<{ message: string }>(
      environment.apiUrl + "AccessControlTemplate/DeleteAct/" + id
    );
  }
  IsActiveAct(id: number) {
    return this.http.delete<{ message: string }>(
      environment.apiUrl + "AccessControlTemplate/IsActive/" + id
    );
  }
  Getmenuheaderbyid(id: any): Observable<any> {
    return this.http.post<any>(
      environment.apiUrl + "AccessControlTemplate/AccessControlByheader",
      id
    );
  }
  Getsubmenubyid(id: any): Observable<any> {
    return this.http.post<any>(
      environment.apiUrl + "AccessControlTemplate/AccessControlsubmenu",
      id
    );
  }

  DeleteAccessMenus(id:number):Observable<any>{
    return this.http.delete<any>(environment.apiUrl+"AccessControlTemplate/AccessMenusDelete"+'/'+id);
  } 

}
