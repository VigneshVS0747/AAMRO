import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Documents, HsCode, HsCodeCategory, HsCodeModelContainer, HsCodePermit, Partdetails, Permitdetails } from 'src/app/Models/crm/master/HsCode';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HscodeService {
  public itemId: number;
  public isView: boolean = false;
  constructor(private http: HttpClient) { }

  addHScode(hSCode: HsCodeModelContainer) {
    debugger
    return this.http.post<{ message: string }>(environment.apiUrl + "HsCode/HSCodeGeneralSave", hSCode)
  }
  getAllHsCodes(id: number): Observable<HsCode[]> {
    return this.http.get<HsCode[]>(environment.apiUrl + "HsCode/HSCodeGetAll/" + id);
  }
  getHscodebyId(id: number): Observable<HsCodeModelContainer[]> {
    return this.http.get<HsCodeModelContainer[]>(environment.apiUrl + "HsCode/HSCodeGetAllById" + "/" + id);
  }
  deletehSCode(hscodeId: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "HsCode/Delete/" + hscodeId);
  }
  //#region operation on add-edit-view
  setItemId(id: number): void {
    this.itemId = id;
  }
  //#endregion

  getCountries(id: number): Observable<Country[]> {
    return this.http.get<Country[]>(
      environment.apiUrl + "Country/GetAllCountry" + "/" + id
    );
  }
  getallHSCodecategory(id: number): Observable<HsCodeCategory[]> {
    return this.http.get<HsCodeCategory[]>(
      environment.apiUrl + "HSCodeCategory/GetAllHSCodeCategory" + "/" + id);
  }
  getallPermitCode(): Observable<Permitdetails[]> {
    return this.http.get<Permitdetails[]>(environment.apiUrl + "Permit/GetAllPermit/");
  }
  getallActivePermitCode(): Observable<Permitdetails[]> {
    return this.http.get<Permitdetails[]>(environment.apiUrl + "Permit/PermitGetAllActive/");
  }
  getallPartdetails(id: number): Observable<Partdetails[]> {
    return this.http.get<Partdetails[]>(environment.apiUrl + "PartMaster/GetAllPart/" + id)
  }
  getDocuments(): Observable<Documents[]> {
    return this.http.get<Documents[]>(environment.apiUrl + "Document/GetAllDocuments")
  }
  getPermitbyId(id: number) {
    return this.http.get(environment.apiUrl + "Permit/PermitBy/" + id)
  }

  GetAllDocumentMappingByScreenId(id: number) {
    return this.http.get<Documents[]>(
      environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/" + id);
  }
}
