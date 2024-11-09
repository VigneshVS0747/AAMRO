import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PIContainer, PurchaseInvoice, PIDocument } from './purchase-invoice-modals';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { JOCostBookingDetail } from '../job-order-expense-booking/job-order-expense-booking.model';

@Injectable({
  providedIn: 'root'
})
export class PIService {

  constructor(private http: HttpClient) { }


  PurchaseInvoiceSave(PI:PIContainer):Observable<PIContainer>{
    return this.http.post<PIContainer>(environment.apiUrl+"PurchaseInvoice/PIGeneralSave",PI)
  }

  GetAllPurchaseInvoice(id:number): Observable<PurchaseInvoice[]> {
    return this.http.get<PurchaseInvoice[]>(
      environment.apiUrl + "PurchaseInvoice/GetAllPurchaseInvoice"+'/'+ id
    );
  }

  GetAllPurchaseInvoiceId(id:number): Observable<PIContainer> {
    return this.http.get<PIContainer>(
      environment.apiUrl + "PurchaseInvoice/GetAllPurchaseInvoiceId"+'/'+ id
    );
  }

  GetAllJonOrderExpenseByJobOrderId(joborderId:any,lineitemId:any) {
    return this.http.get<any[]>(
      environment.apiUrl + "PurchaseInvoice/GetAllJonOrderExpenseByJobOrderId/" + joborderId+"/"+ lineitemId);
  }

  GetAllJobOrderExpenseandJoborderByJobOrderId(joborderId:any,lineitemId:any,currencyId:any,source:any) {
    return this.http.get<any[]>(
      environment.apiUrl + "PurchaseInvoice/GetAllJobOrderExpenseandJoborderByJobOrderId/" + joborderId+"/"+ lineitemId+"/"+ currencyId+"/"+ source);
  }

  getFilterJoList(data:any){
    let url = environment.apiUrl + 'PurchaseInvoice/getFilterPIJoList';
    return this.http.post(url, data)
  }

  getFilterPIJoListConfirm(data:any){
    let url = environment.apiUrl + 'PurchaseInvoice/getFilterPIJoListConfirm';
    return this.http.post(url, data)
  }

  getJOLineItems(data:any){
    let url = environment.apiUrl + 'PurchaseInvoice/getPIJOLineItems';
    return this.http.post(url, data)
  }

  DeletePI(id:number): Observable<any> {
    return this.http.delete<any>(
      environment.apiUrl + "PurchaseInvoice/DeletePI"+'/'+ id
    );
  }
  GetAllDocumentMappingByScreenId(id:number) {
    return this.http.get<[PIDocument]>(
        environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
  }
}
