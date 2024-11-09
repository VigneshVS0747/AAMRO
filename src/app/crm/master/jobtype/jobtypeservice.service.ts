import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoicingFlags, JobCategory, JobTypeDocument, JobTypeGeneral, JobTypeModelContainer, StatusTypeInJobTypes } from './jobtypemodel.model';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobtypeserviceService {
  private filterState = new BehaviorSubject<any>(null);
  public itemId: number;
  public isView:boolean=false;
  public isEdit:boolean=false;

  constructor(private http:HttpClient) { }

  setFilterState(filter: any) {
    this.filterState.next(filter);
  }
    //#region operation on add-edit-view
    setItemId(id: number): void {
      this.itemId = id;
    }
    //#endregion

getAllJobTypes() {
    return this.http.get<JobTypeGeneral[]>(
        environment.apiUrl + "JobTypeGeneral/JobTypeGetAll");
}
getAllActiveJobTypes() {
  return this.http.get<JobTypeGeneral[]>(
      environment.apiUrl + "JobTypeGeneral/JobTypeGetAllActive");
}
getJobTypesByJobCatId(id:number) {
  return this.http.get<JobTypeGeneral[]>(
      environment.apiUrl + "JobTypeGeneral/JobTypeByjobcatId/"+id);
}
getAllJopTypeById(id:number) {
  return this.http.get<JobTypeModelContainer>(
      environment.apiUrl + "JobTypeGeneral/JobTypeGetAllById/"+id);
}

GeneralSave(datas: JobTypeModelContainer)
{
  debugger
  return this.http.post<{message : string}>(environment.apiUrl +"JobTypeGeneral/JobTypeGeneralSave",datas);
}
GeneralDelete(id:number)
{
  return this.http.delete<{message : string}>(environment.apiUrl+"JobTypeGeneral/JobTypeGeneralDelete/"+id)
}
isActiveJobType(id: number){
  return this.http.delete<{ message: string}>(environment.apiUrl + "JobTypeGeneral/IsActive/" + id);
}
///Dropdowns
getAllStatusType() {
  return this.http.get<StatusTypeInJobTypes[]>(
      environment.apiUrl + "DropDown/GetAllJobStageStatus");
}
getAllInvoice() {
  return this.http.get<InvoicingFlags[]>(
      environment.apiUrl + "DropDown/GetAllInvoicingFlags");
}

GetAllJobCategory()
{
  return this.http.get<JobCategory[]>(
    environment.apiUrl + "DropDown/GetAllJobCategory");
}

GetAllJobStage() {
  let url = environment.apiUrl +"JobTypeGeneral/GetAllJobStage";
  return this.http.get(url);
}

GetAllDocumentMappingByScreenId(id:number) {
  return this.http.get<JobTypeDocument[]>(
      environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
}
}
