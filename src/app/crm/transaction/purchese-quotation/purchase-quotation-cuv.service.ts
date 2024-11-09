import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PqDocument, PQMapping, PQModelContainer, PQvaliditycloser, PurchaseQuotation, VendorList } from './purchase-quotation.model';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseQuotationCuvService {
  public isApprove: boolean = false;
  public isApproveHistory:boolean=false;
  public editFromApprove:boolean=false;

  public isView: boolean = false;
  public isEdit: boolean = false;
  public itemId: number;
  public vendorId: number;
  public pqAgainstId: number;
  type: any;
  refNumberId: number;
  refNumber: number;
  constructor(private http: HttpClient) { }

  getAllPurchaseQuotation(id:number) {
    return this.http.get<PurchaseQuotation[]>(
      environment.apiUrl + "PurchaseQuotation/PurchaseQuotationGetAll/" + id);
  }
  PurchaseQuotationGetAllByStatus() {
    return this.http.get<PurchaseQuotation[]>(
      environment.apiUrl + "PurchaseQuotation/PurchaseQuotationGetAllByStatus");
  }
  PurchaseQuotationGetAllByValidity() {
    return this.http.get<PurchaseQuotation[]>(
      environment.apiUrl + "PurchaseQuotation/PurchaseQuotationGetAllByValidity");
  }

  getAllPurchaseQuotationById(id: number) {
    return this.http.get<PQModelContainer>(
      environment.apiUrl + "PurchaseQuotation/PurchaseQuotationGetAllbyId/" + id);
  }
  PurchaseQuotationGetPriceMappingById(id: number) {
    return this.http.get<PQMapping[]>(
      environment.apiUrl + "PurchaseQuotation/PurchaseQuotationGetPriceMappingById/" + id);
  }

  purchaseQuotationSave(datas: PQModelContainer) {
    debugger
    return this.http.post<PQModelContainer>(environment.apiUrl + "PurchaseQuotation/PurchaseQuotationSave", datas);
  }
  purchaseQuotationDelete(id: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "PurchaseQuotation/DeletePurchaseQuotation/" + id)
  }
  getAllSearchedVendors(value: any) {
    debugger
    return this.http.get<VendorList[]>(
      environment.apiUrl + "PurchaseQuotation/SearchVendorsByName/" + value);
  }

  PostPQStatusList(pqList:PQvaliditycloser):Observable<PQvaliditycloser>{
    return this.http.post<PQvaliditycloser>(environment.apiUrl+"PurchaseQuotation/ValiditystatusList",pqList)
  }
  setItemId(id: number): void {
    this.itemId = id;
  }

  setVendorId(id: number): void {
    this.vendorId = id;
  }
  setpqAgainstId(id: number): void {
    this.pqAgainstId = id;
  }
  setvendorTyppe(type: string): void {
    this.type = type;
  }
  setrefNumber(ref: number): void {
    this.refNumberId = ref;
  }
  setrefNumberValue(refValue: number): void {
    this.refNumber = refValue;
  }
  GetAllDocumentMappingByScreenId(id:number) {
    return this.http.get<PqDocument[]>(
        environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
  }
}
