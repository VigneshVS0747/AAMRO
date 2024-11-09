import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documents } from 'src/app/Models/crm/master/documents';
import { environment } from 'src/environments/environment.development';
@Injectable({
    providedIn: 'root'
})
export class DocmentsService {
    constructor(private http: HttpClient) { }
    getDocuments(id:number) : Observable<Documents[]>{
        return this.http.get<Documents[]>(environment.apiUrl + "Document/GetAllDocuments/"+id)
       }
    addDocument(document: Documents) {
        return this.http
            .post<{ message: string }>(environment.apiUrl + "Document/AddDocument", document)
    }
    deleteDocument(documentId: number) {
        return this.http.delete<{ message: string }>(environment.apiUrl + "Document/Delete/" + documentId);
    }
    updateDocument(document: Documents) {
        return this.http
            .put<{ message: string }>(environment.apiUrl + "Document/UpdateDocuments", document);
    }
    getDocument(id: number) {

        return this.http.get<{
            documentId: number;
            documentCode: string;
            documentName: string;
            livestatus: boolean;
            createdBy: number;
            createdDate: Date;
            updatedBy: number | null;
            updatedDate: Date;
        }>(
            environment.apiUrl + "Document/DocumentBy/" + id
        );
    }
    isActiveDocument(docid: number){
        return this.http.delete<{ message: string}>(environment.apiUrl + "Document/IsActive/" + docid);
      }
}