import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApprovalDashboard, ApprovalHistory, ApprovalLevelsSummary } from './approval-history.model';

@Injectable({
    providedIn: 'root'
})
export class ApprovalHistoryService {


    constructor(private http: HttpClient) { }

    getAllApprovalDashboard(id: number) {
        return this.http.get<ApprovalDashboard[]>(
            environment.apiUrl + "ApprovalHistory/ApprovalDashboardGetAll/"+ id );
    }
    GetApprovalHistoryById(id: number, sId: number) {
        return this.http.get<ApprovalHistory[]>(
            environment.apiUrl + "ApprovalHistory/GetApprovalHistoryById/" + id + "/" + sId);
    }
    GetApprovalLevelsSummary(menuId: number, sId: number,refId: number) {
        return this.http.get<ApprovalLevelsSummary[]>(
            environment.apiUrl + "ApprovalHistory/GetApprovalLevelsSummary/" + menuId + "/" + sId+"/"+refId);
    }

    SaveApprovalHistory(data: any) {
        return this.http.post<{ message: string }>(
            environment.apiUrl + "ApprovalHistory/SaveApprovalHistory", data);
    }
}
