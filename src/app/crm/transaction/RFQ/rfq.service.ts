import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { rfqagainstLineItem } from 'src/app/Models/crm/master/transactions/RFQ/RfqLineitem';
import { RFQcombine, Rfqgeneral, VendorAddressList, VendorContactList, vendorfilter, vendorfilterList } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';
import { environment } from 'src/environments/environment.development';
import { PQcompare, PqPrice, PurchaseQuotation } from '../purchese-quotation/purchase-quotation.model';

@Injectable({
  providedIn: 'root'
})
export class RfqService {

  public isView: boolean = false;
  public isEdit:boolean=false;
  public rfq:boolean=false;
  public enq:boolean=false;
  public job:boolean=false;
  public Fromrfq:boolean=false;



  public itemId: number;

  constructor(private http: HttpClient) { }


  GetRfqAgainst(Rfqagainst:rfqagainstLineItem):Observable<rfqagainstLineItem[]>{
    return this.http.post<rfqagainstLineItem[]>(environment.apiUrl+"RFQ/GetRfqAgainst",Rfqagainst)
  }

  GetFiltervendors(Filter:vendorfilter):Observable<vendorfilterList[]>{
    return this.http.post<vendorfilterList[]>(environment.apiUrl+"RFQ/GetRfqvendorFilters",Filter)
  }

  Getvendorcontacts(Filter:any):Observable<VendorContactList[]>{
    return this.http.post<VendorContactList[]>(environment.apiUrl+"RFQ/GetRfqvendorcontact",Filter)
  }

  GetvendorAddress(Filter:any):Observable<VendorAddressList[]>{
    return this.http.post<VendorAddressList[]>(environment.apiUrl+"RFQ/GetRfqvendoraddress",Filter)
  }


  CreateRFQ(RFQ:RFQcombine):Observable<RFQcombine>{
    return this.http.post<RFQcombine>(environment.apiUrl+"RFQ/AddRFQ",RFQ)
  }

  GetAllRfq(id:number): Observable<Rfqgeneral[]> {
    return this.http.get<Rfqgeneral[]>(
      environment.apiUrl + "RFQ/GetAllRFQ"+'/'+ id
    );
  }
  GetAllopenRfq(): Observable<Rfqgeneral[]> {
    return this.http.get<Rfqgeneral[]>(
      environment.apiUrl + "RFQ/GetAllOpenRfq"
    );
  }

  GetAllRFQById(id:number): Observable<RFQcombine> {
    return this.http.get<RFQcombine>(
      environment.apiUrl + "RFQ/GetAllRFQBYId"+'/'+ id
    );
  }
  GetPqcomparevendor(id:number): Observable<PurchaseQuotation[]> {
    return this.http.get<PurchaseQuotation[]>(
      environment.apiUrl + "RFQ/GetPqcomparevendor"+'/'+ id
    );
  }
  
  GetvendorcontactsById(id:number): Observable<VendorContactList[]> {
    return this.http.get<VendorContactList[]>(
      environment.apiUrl + "RFQ/GetvendorcontactsbyId"+'/'+ id
    );
  }

  GetVendorsByName(vendorid: string,id:number): Observable<PQcompare[]> {
    return this.http.get<PQcompare[]>(`${environment.apiUrl}RFQ/GetVendorByName/${vendorid}/${id}`);
  }
  GetvendorAddressById(id:number): Observable<VendorAddressList[]> {
    return this.http.get<VendorAddressList[]>(
      environment.apiUrl + "RFQ/GetvendorAddressbyId"+'/'+ id
    );
  }

  setItemId(id: number): void {
    this.itemId = id;
}

DeleteRFQ(id:number):Observable<RFQcombine>{
  return this.http.delete<RFQcombine>(environment.apiUrl+"RFQ/Delete"+'/'+id);
}
GetAllDocumentMappingByScreenId(id: number) {
  return this.http.get<any>(
    environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/" + id);
}

GetRFQbasedVendorEmail(id:number): Observable<any> {
  return this.http.get<any>(
    environment.apiUrl + "RFQ/GetRFQbasedVendorEmail/" + id);
}

downloadRFQPdf(id: number) {
  return this.http.get(`${ environment.apiUrl}RFQ/GetRFQPdf/${id}`, {
    responseType: 'blob', // Set response type to blob for file download
  });
}

GetPendingPQReportByFilterdColumn(fromDate: any,toDate: any,rfqAgainst: any, referenceNo: any,rfqNo: any,rfqStatus: any ): Observable<any[]>  {
  return this.http.get<any[]>(
    environment.apiUrl + "RFQ/GetPendingPQReportByFilterdColumn/" + fromDate+"/"+ toDate+"/"+ rfqAgainst+"/"+ referenceNo+"/"+ rfqNo+"/"+ rfqStatus);
}
}
