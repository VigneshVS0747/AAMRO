import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { JOCBLineItem, JOCBModelContainer, JOCostBookingDetail, JOCostBookingGeneral, VendorFilter, VendorIdbyCurrency, VendorIdbyValue } from './job-order-expense-booking.model';

@Injectable({
  providedIn: 'root'
})
export class JobOrderExpenseBookingService {
  public isView: boolean = false;
  public isEdit: boolean = false;
  public itemId: number;
  public joId: number;

  constructor(private http: HttpClient) { }



  GetAllJOCostBooking() {
    return this.http.get<JOCostBookingGeneral[]>(
      environment.apiUrl + "JobOrderCostBooking/GetAllJOCostBooking");
  }
  GetAllVendors() {
    return this.http.get<VendorFilter[]>(
      environment.apiUrl + "JobOrderCostBooking/GetAllVendors");
  }
  GetVerndorDetails(selectedValue: string,vendorTypeId:number,vendorId:number,lineItem:number) {
    return this.http.get<VendorIdbyValue[]>(
      environment.apiUrl + "JobOrderCostBooking/GetVerndorDetails/" + selectedValue+"/"+ vendorTypeId+"/"+vendorId+"/"+lineItem);
  }
  GetVerndorCurrencyDetails(selectedSource: string,vendorTypeId:number,vendorId:number,refNumber:string) {
    return this.http.get<VendorIdbyCurrency[]>(
      environment.apiUrl + "JobOrderCostBooking/GetVerndorCurrencyDetails/" + selectedSource+"/"+ vendorTypeId+"/"+vendorId+"/"+refNumber);
  }
  GetAllByIdJOCostBookingId(id: number) {
    return this.http.get<JOCBModelContainer>(
      environment.apiUrl + "JobOrderCostBooking/GetAllByIdJOCostBookingId/" + id);
  }
  GetAllJOCostBookingDocumentByJOCostBookingDetailId(id: number) {
    return this.http.get<JOCBModelContainer>(
      environment.apiUrl + "JobOrderCostBooking/GetAllJOCostBookingDocumentByJOCostBookingDetailId/" + id);
  }
  JOCostBookingSave(datas: JOCBModelContainer) {
    debugger
    return this.http.post<{ message: string }>(environment.apiUrl + "JobOrderCostBooking/JOCostBookingSave", datas);
  }
  JOCostBookingDelete(id: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "JobOrderCostBooking/JOCostBookingDelete/" + id)
  }
  GetJOCostBookingPurchaseInvoiceHistory(lineItemId: number,jobOrderId:number) {
    return this.http.get<JOCBLineItem[]>(environment.apiUrl + "JobOrderCostBooking/GetJOCostBookingPurchaseInvoiceHistory/" + lineItemId+"/"+jobOrderId)
  }
  GetJOCBInvoiceDetailsId(joId: number,lineItemId: number) {
    return this.http.get<JOCostBookingDetail>(environment.apiUrl + "JobOrderCostBooking/GetJOCBInvoiceDetailsId/"+joId+"/" +lineItemId)
  }
  
  GetJOCostBookingLineItemDetails(jobOrderId:number) {
    return this.http.get<JOCostBookingDetail[]>(environment.apiUrl + "JobOrderCostBooking/GetJOCostBookingLineItemDetails/"+jobOrderId)
  }
  

  setItemId(id: number): void {
    this.itemId = id;
  }
  setJOId(id: number): void {
    this.joId = id;
  }
}
