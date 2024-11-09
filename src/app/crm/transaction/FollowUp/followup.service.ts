import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FollowUp, FollowUpCombine, FollowUpHistory, FollowUpHistoryParms, FollowUplist } from 'src/app/Models/crm/master/transactions/Followup';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FollowupService {

  constructor(private http: HttpClient) { }

  CreateFollowUp(Followup:FollowUpCombine):Observable<FollowUpCombine>{
    return this.http.post<FollowUpCombine>(environment.apiUrl+"FollowUp/AddFollowUp",Followup)
  }

  GetAllFollowup(id : number): Observable<FollowUplist[]> {
    return this.http.get<FollowUplist[]>(
      environment.apiUrl + "FollowUp/GetAllFollowup"+'/'+ id
    );
  }

  GetAllFollowUpById(id:number): Observable<FollowUpCombine> {
    return this.http.get<FollowUpCombine>(
      environment.apiUrl + "FollowUp/GetAllFollowupId"+'/'+ id
    );
  }

  DeleteFollowup(id:number):Observable<FollowUpCombine>{
    return this.http.delete<FollowUpCombine>(environment.apiUrl+"FollowUp/Delete"+'/'+id);
  }

  GetFollowUpHistory(Followuphistory:FollowUpHistoryParms):Observable<FollowUpHistory[]>{
    return this.http.post<FollowUpHistory[]>(environment.apiUrl+"FollowUp/fetchfollowUpHistory",Followuphistory)
  }

  GetAllFollowUpCount(){
    let url = environment.apiUrl + "FollowUp/GetAllFollowUpCount";
    return this.http.get(url);
  }

  GetAllFollowUpByStatusID(id:any){
    let url = environment.apiUrl + `FollowUp/GetAllFollowUpByStatusID?id=${id}`;
    return this.http.get(url);
  }

  GetAllDocumentMappingByScreenId(id: number) {
    return this.http.get<any>(
      environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/" + id);
  }
  GetEmpwisePendingFollowupByFilterdColumn(fromDate: any,toDate: any,userName: any): Observable<any[]>  {
    return this.http.get<any[]>(
      environment.apiUrl + "FollowUp/GetEmpwisePendingFollowupByFilterdColumn/" + fromDate+"/"+ toDate+"/"+ userName);
  }
  GetEmpActivityReportByFilterdColumn(fromDate: any,toDate: any,followUpStatus: any): Observable<any[]>  {
    return this.http.get<any[]>(
      environment.apiUrl + "FollowUp/GetEmpActivityReportByFilterdColumn/" + fromDate+"/"+ toDate+"/"+ followUpStatus);
  }
}
