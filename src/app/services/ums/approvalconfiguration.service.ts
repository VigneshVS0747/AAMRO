import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/Models/ums/Activity.modal';
import { Approvals, Escalation } from 'src/app/Models/ums/Approval.modal';
import { ApprovalFilter } from 'src/app/Models/ums/Approvalfilter.modal';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ApprovalconfigurationService {

  private filterState = new BehaviorSubject<any>(null);
  constructor(private http:HttpClient) { }
  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }

  CreateApprovals(Approvals:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"ApprovalConfiguration/AddApprovals",Approvals)
  }

  GetAllApprovalActivity() : Observable<Activity[]>{
    return this.http.get<Activity[]>(environment.apiUrl+"ApprovalConfiguration/GetAllApprovalActivity")
   }

   GetApprovalsByActivityId(id:number): Observable<Approvals[]>{
    return this.http.get<Approvals[]>(environment.apiUrl+"ApprovalConfiguration/GetApprovalsByActivityId"+'/'+id);
   }

   GetEscalationByLevelId(id:number): Observable<Escalation[]>{
    return this.http.get<Escalation[]>(environment.apiUrl+"ApprovalConfiguration/GetEscalationByLevelId"+'/'+id);
   }

   GetHeaderByActivityId(id:number): Observable<ApprovalFilter>{
    return this.http.get<ApprovalFilter>(environment.apiUrl+"ApprovalConfiguration/GetHeaderByActivityId"+'/'+id);
   }

   UpdateApprovals(Approvals:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"ApprovalConfiguration/UpdateApprovals",Approvals)
  }

  UpdateEscalationApprovals(Approvals:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"ApprovalConfiguration/UpdateEscalationApprovals",Approvals)
  }
  DeleteApprovals(id:number):Observable<Approvals>{
    return this.http.delete<Approvals>(environment.apiUrl+"ApprovalConfiguration/DeleteApprovals"+'/'+id);
  } 

  DeleteEscalationApprovals(id:number):Observable<Escalation>{
    return this.http.delete<Escalation>(environment.apiUrl+"ApprovalConfiguration/DeleteEscalationApprovals"+'/'+id);
  } 


  DeleteApprovalsBySubmenuid(id:number):Observable<Approvals>{
    return this.http.delete<Approvals>(environment.apiUrl+"ApprovalConfiguration/DeleteApprovalsBySubmenuId"+'/'+id);
  } 

}
