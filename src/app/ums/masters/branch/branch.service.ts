import { Injectable } from '@angular/core';
import { Branch } from './branch.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class BranchService {

 
  private filterState = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }
  //#region filter State
  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }
  //#endregion


  addBranch(branch:Branch) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "Branch/AddBranch",branch)
}

deleteBranch(branchId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "Branch/Delete/" + branchId);
}
isActiveBranch(branchId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "Branch/IsActive/" + branchId);
}


getBranch(id: number) {
  return this.http.get<{ branchId: number;
    branchCode: string;
    branchName: string;
    aliasName: string;
    branchType: number;
    contactPerson: string;
    contactNumber: string;
    branchAddressLine1: string;
    branchAddressLine2: string;
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    countryId: number;
    countryName: string;
    currencyId: number;
    currencyName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date ;
  }>(
    environment.apiUrl + "Branch/BranchBy/" + id
  );
}

updateBranch(branch:Branch) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "Branch/UpdateBranch",branch);
}

}
