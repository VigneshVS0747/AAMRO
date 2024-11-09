import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class IncoTermService {
    constructor(private http: HttpClient) { }
    getIncoterms(id:number): Observable<Incoterm[]> {
        return this.http.get<Incoterm[]>(environment.apiUrl + 'Incoterm/GetAllIncoterm/'+id);
    }
    addIncoterm(incoterm: any) {
        return this.http.post<{ message: string }>(environment.apiUrl + "Incoterm/AddIncoterm", incoterm)
    }

    deleteIncoterm(incotermId: number) {
        return this.http.delete<{ message: string }>(environment.apiUrl + "Incoterm/Delete/" + incotermId);
    }

    getIncoterm(id: number) {

        return this.http.get<{
            incoTermId: number;
            incoTermCode: string;
            incoTermDescription: string;
            effectiveYear: Date | null;
            livestatus: boolean;
            createdBy: number;
            createdDate: Date | string;
            updatedBy: number | null;
            updatedDate: Date | string;
        }>(
            environment.apiUrl + "Incoterm/Incoterm/" + id
        );
    }
    updateIncoterm(incoterm: Incoterm) {
        return this.http
            .put<{ message: string }>(environment.apiUrl + "Incoterm/UpdateIncoterm", incoterm);
    }
    IsActive(id:number):Observable<Incoterm>{
        return this.http.delete<Incoterm>(environment.apiUrl+"Incoterm/IsActive"+'/'+id);
      } 
}