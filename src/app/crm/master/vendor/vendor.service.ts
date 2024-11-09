import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor, VendorModelContainer, VendorRanking, VendorType } from 'src/app/Models/crm/master/Vendor';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  public itemId: number;
  public isView: boolean = false;
  public isApprove: boolean = false;
  public isApproveHistory:boolean=false;
  public editFromApprove:boolean=false;

  constructor(private http: HttpClient) { }

  getAllVendor(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(environment.apiUrl + "Vendor/VendorGetAll");
  }
  VendorGetAllActive(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(environment.apiUrl + "Vendor/VendorGetAllActive");
  }
  addVendor(vendor: VendorModelContainer) {
    return this.http.post<{ message: string }>(environment.apiUrl + "Vendor/VendorGeneralSave", vendor)
  }
  getVendorbyId(id: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "Vendor/VendorGetAllById" + "/" + id);
  }
  //#region operation on add-edit-view
  setItemId(id: number): void {
    this.itemId = id;
  }
  //#endregion
  deleteVendor(vendorId: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "Vendor/Delete/" + vendorId);
  }
  //------dropdown get list--------//
  getvendorType(): Observable<VendorType[]> {
    return this.http.get<VendorType[]>(environment.apiUrl + "DropDown/GetAllCVType");
  }
  getvendorRanking(): Observable<VendorRanking[]> {
    return this.http.get<VendorRanking[]>(environment.apiUrl + "DropDown/GetAllVendorRanking");
  }
}
