import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Authorizationmatrix } from "../../Models/ums/authorizationmatrix.modal";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class AuthmatlistService {
  private filterState = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}
  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }

  GetAuthorizationmatrix(id: number): Observable<Authorizationmatrix[]> {
    return this.http.get<Authorizationmatrix[]>(
      environment.apiUrl +
        "Authorizationmatrix/GetAllAuthorizationMatrix" +
        "/" +
        id
    );
  }

  DeleteAuthorizationmatrix(id: number): Observable<any> {
    return this.http.delete<Authorizationmatrix[]>(
      environment.apiUrl + "Authorizationmatrix/DeleteAuthmatrix/" + id
    );
  }

  IsActiveAuthmatrix(AuthId: number) {

    return this.http.delete<{ message: string}>(environment.apiUrl + "Authorizationmatrix/IsActive/" + AuthId);
  }
}
