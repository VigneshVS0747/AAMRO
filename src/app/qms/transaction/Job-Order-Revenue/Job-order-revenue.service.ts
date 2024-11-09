import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ContractOrQuotation, JORBLineItem, JORBModelContainer, JORevenueBookingDetail, JORevenueBookingGeneral } from './Job-order-revenue-modals';

@Injectable({
  providedIn: 'root'
})
export class JobOrderRevenueBookingService {
    public isView: boolean = false;
    public isEdit: boolean = false;
    public itemId: number;
    public joId: number;
  
    constructor(private http: HttpClient) { }
  
  
  
    GetAllJORevenueBooking() {
      return this.http.get<JORevenueBookingGeneral[]>(
        environment.apiUrl + "JobOrderRevenueBooking/GetAllJORevenueBooking");
    }

    // GetAllVendors() {
    //   return this.http.get<VendorFilter[]>(
    //     environment.apiUrl + "JobOrderRevenueBooking/GetAllVendors");
    // }

    // GetVerndorDetails(selectedValue: string,vendorTypeId:number,vendorId:number) {
    //   return this.http.get<VendorIdbyValue[]>(
    //     environment.apiUrl + "JobOrderRevenueBooking/GetVerndorDetails/" + selectedValue+"/"+ vendorTypeId+"/"+vendorId);
    // }
    
    GetAllByIdJORevenueBookingId(id: number) {
      return this.http.get<JORBModelContainer>(
        environment.apiUrl + "JobOrderRevenueBooking/GetAllByIdJORevenueBookingId/" + id);
    }

    JORevenueBookingSave(datas: JORBModelContainer) {
      debugger
      return this.http.post<{ message: string }>(environment.apiUrl + "JobOrderRevenueBooking/JORevenueBookingSave", datas);
    }
    JORevenueBookingDelete(id: number) {
      return this.http.delete<{ message: string }>(environment.apiUrl + "JobOrderRevenueBooking/JORevenueBookingDelete/" + id)
    }

    GetJORevenueBookingProformaInvoiceHistory(lineItemId: number,jobOrderId:number) {
      return this.http.get<JORBLineItem[]>(environment.apiUrl + "JobOrderRevenueBooking/GetJORevenueBookingProformaInvoiceHistory/"  + lineItemId+"/"+jobOrderId)
    }

    GetContractOrQuotationDetails(customerId:number ,lineItemId: number) {
      return this.http.get<ContractOrQuotation[]>(environment.apiUrl + "JobOrderRevenueBooking/GetContractOrQuotationDetails/" + customerId+"/"+ lineItemId)
    }    
    GetContractOrQuotationDetailsForRevenueBookingSourceId(customerId:number ,lineItemId: number,sourceId:number) {
      return this.http.get<ContractOrQuotation[]>(environment.apiUrl + "JobOrderRevenueBooking/GetContractOrQuotationDetailsForRevenueBookingSourceId/" + customerId+"/"+ lineItemId +"/"+sourceId)
    }    
    GetContractOrQuotationDetailsForRevenueBookingRefNumberId(customerId:number ,lineItemId: number,sourceId:number,refNumberId:number) {
      return this.http.get<ContractOrQuotation[]>(environment.apiUrl + "JobOrderRevenueBooking/GetContractOrQuotationDetailsForRevenueBookingRefNumberId/" + customerId+"/"+ lineItemId +"/"+sourceId+"/"+refNumberId)
    }

    setItemId(id: number): void {
      this.itemId = id;
    }
    setJOId(id: number): void {
      this.joId = id;
    }

    GetJORevenueBookingLineItemDetails(jobOrderId:number) {
      return this.http.get<JORevenueBookingDetail[]>(environment.apiUrl + "JobOrderRevenueBooking/GetJORevenueBookingLineItemDetails/"+jobOrderId)
    }
    
    GetQuatityFromJO(jobOrderId:number, calculationParameterId:number) {
      return this.http.get<string>(environment.apiUrl + "JobOrderRevenueBooking/GetQuatityFromJO/"+jobOrderId+"/"+calculationParameterId)
    }

  }
  