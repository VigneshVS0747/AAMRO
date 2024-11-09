import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { DocumentMapping } from './document-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentMappingService {
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

    GetAllDocumentMapping() {
    return this.http.get<DocumentMapping[]>(
        environment.apiUrl + "DocumentMapping/GetAllDocumentMapping");
}
// GetAllActiveDocumentMapping() {
//   return this.http.get<DocumentMapping[]>(
//       environment.apiUrl + "DocumentMapping/GetAllActiveDocumentMapping");
// }
GetAllDocumentMappingByScreenId(id:number) {
  return this.http.get<DocumentMapping[]>(
      environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
}
SaveDocumentMap(datas: DocumentMapping)
{
  return this.http.post<{message : string}>(environment.apiUrl +"DocumentMapping/SaveDocumentMap",datas);
}

DeleteDocumentMapping(id:number)
{
  return this.http.delete<{message : string}>(environment.apiUrl+"DocumentMapping/DeleteDocumentMapping/"+id)
}
// isActiveDocumentMapping(id: number){
//   return this.http.delete<{ message: string}>(environment.apiUrl + "DocumentMapping/IsActive/" + id);
// }
}
