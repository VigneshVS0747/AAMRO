import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PotentialCustomer, PotentialCustomerAddress, PotentialCustomerContact, PotentialCustomerContainer, PotentialCustomerDocument } from './potential-customer.model';
import { environment } from 'src/environments/environment.development';
import { Intrestlevel, ModeofFollowUp, StatusTypeInPC } from 'src/app/Models/crm/master/Dropdowns';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PotentialCustomerService {
    public isView: boolean = false;
    public isEdit:boolean=false;
    public isAdd:boolean=false;

    public movetoCustomer: boolean=false;
    public salesOppourtunity:boolean=false;
    public itemId: number;
    constructor(private http: HttpClient) { }

    getAllPotentialCustomer() {
        return this.http.get<PotentialCustomer[]>(
            environment.apiUrl + "PotentialCustomerGeneral/PotentialCustomerGetAll");
    }
    getAllActivePotentialCustomer() {
        return this.http.get<PotentialCustomer[]>(
            environment.apiUrl + "PotentialCustomerGeneral/PotentialCustomerGetAllActive");
    }
    getAllPotentialCustomerById(id:number):Observable<PotentialCustomerContainer> {
        debugger
        return this.http.get<PotentialCustomerContainer>(
            environment.apiUrl + "PotentialCustomerGeneral/PotentialCustomerGetAllById/"+id);
    }
    PotentialCustomerSave(PotentialCustomer:any) {
        return this.http.post<PotentialCustomerContainer>(
            environment.apiUrl + "PotentialCustomerGeneral/PotentialCustomerGeneralSave",PotentialCustomer);
    }
    PotentialCustomerContactById(id:number) {
        return this.http.get<PotentialCustomerContact>(
            environment.apiUrl + "PotentialCustomerGeneral/CustomerContactbyId/"+id);
    }
    PotentialCustomerAddressById(id:number) {
        return this.http.get<PotentialCustomerAddress>(
            environment.apiUrl + "PotentialCustomerGeneral/CustomerAddressbyId/"+id);
    }
    PotentialCustomerDocumentById(id:number) {
        return this.http.get<PotentialCustomerDocument>(
            environment.apiUrl + "PotentialCustomerGeneral/CustomerDocumentbyId/"+id);
    }
    deletePotentialCustomer(id:number)  
    {
        return this.http.delete<{ message: string }>(
            environment.apiUrl + "PotentialCustomerGeneral/PotentialCustomerDelete/"+ id);
    }
    //#region operation on add-edit-view
    setItemId(id: number): void {
        this.itemId = id;
    }
    //#endregion

    // getFileUrl(fileName: string): string {
    //     return "C:/Users/vignesh.vs/Downloads" + fileName;
    //   }
    GetAllPCustomerStatusID(id:any) {
        let url = environment.apiUrl +`PotentialCustomerGeneral/GetAllPCustomerStatusID?id=${id}`;
        return this.http.get(url);
      }

      GetAllDocumentMappingByScreenId(id:number) {
        return this.http.get<PotentialCustomerDocument[]>(
            environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
      }
}
