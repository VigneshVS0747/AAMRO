import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PotentialVendor, PotentialVendorAddress, PotentialVendorContact, PotentialVendorContainer, PotentialVendorDocument, PotentialVendorServiceDetails, PotentialVendorServices } from './potential-vendor.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class PotentialVendorService {
    public isView: boolean = false;
    public isEdit:boolean=false;
    public movetoVendor: boolean=false;
    public itemId: number;

    constructor(private http: HttpClient) { }

    getAllPotentialVendor() {
        return this.http.get<PotentialVendor[]>(
            environment.apiUrl + "PotentialVendorGeneral/PotentialVendorGetAll");
    }
    getAllActivePotentialVendor() {
        return this.http.get<PotentialVendor[]>(
            environment.apiUrl + "PotentialVendorGeneral/PotentialVendorGetAllActive");
    }
    getAllPotentialVendorById(id:number) {
        debugger
        return this.http.get<PotentialVendorContainer>(
            environment.apiUrl + "PotentialVendorGeneral/PotentialVendorGetAllById/"+id);
    }
    PotentialVendorSave(PotentialVendor:any) {
        return this.http.post<PotentialVendorContainer>(
            environment.apiUrl + "PotentialVendorGeneral/PotentialVendorGeneralSave",PotentialVendor);
    }
    PotentialVendorServiceById(id:number) {
        return this.http.get<PotentialVendorServices>(
            environment.apiUrl + "PotentialVendorGeneral/VendorServicebyId/"+id);
    }
    PotentialVendorServiceDetailsById(id:number) {
        return this.http.get<PotentialVendorServiceDetails>(
            environment.apiUrl + "PotentialVendorGeneral/VendorServiceDetailsbyId/"+id);
    }
    PotentialVendorContactById(id:number) {
        return this.http.get<PotentialVendorContact>(
            environment.apiUrl + "PotentialVendorGeneral/VendorContactbyId/"+id);
    }
    PotentialVendorAddressById(id:number) {
        return this.http.get<PotentialVendorAddress>(
            environment.apiUrl + "PotentialVendorGeneral/VendorAddressbyId/"+id);
    }
    PotentialVendorDocumentById(id:number) {
        return this.http.get<PotentialVendorDocument>(
            environment.apiUrl + "PotentialVendorGeneral/VendorDocumentbyId/"+id);
    }
    deletePotentialVendor(id:number)  
    {
        return this.http.delete<{ message: string }>(
            environment.apiUrl + "PotentialVendorGeneral/PotentialVendorDelete/"+ id);
    }
    //#region operation on add-edit-view
    setItemId(id: number): void {
        this.itemId = id;
    }
    //#endregion

    // getFileUrl(fileName: string): string {
    //     return "C:/Users/vignesh.vs/Downloads" + fileName;
    //   }
    GetAllDocumentMappingByScreenId(id:number) {
        return this.http.get<PotentialVendorDocument[]>(
            environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
      }
}
