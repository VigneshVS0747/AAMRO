import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobModeofTransports } from 'src/app/Models/crm/master/Dropdowns';
import { joborderstatus, joborderstauslist } from 'src/app/qms/transaction/Job-Order/job-order.modals';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private http: HttpClient) { }


  getAllRegionMapping(): Observable<any> {
    let url = environment.apiUrl + 'Region/GetAllRegionMapping';
    return this.http.get(url);
  }
  getCountries(): Observable<any> {
    let url = environment.apiUrl + 'Region/GetCountryList';
    return this.http.get(url);
  }
  getRegions(): Observable<{ regionId: number, regionName: string, regionCode: string, livestatus: any }[]> {
    let url = environment.apiUrl + 'Region/GetRegionList';
    return this.http.get<{ regionId: number, regionName: string, regionCode: string, livestatus: any }[]>(url);
  }

  AddRegionMapping(data: any) {
    let url = environment.apiUrl + 'Region/AddRegionMapping';
    return this.http.post(url, data);
  }
  UpdateRegionMapping(data: any) {
    let url = environment.apiUrl + 'Region/UpdateRegionMapping';
    return this.http.put(url, data);
  }

  DeleteRegionMapping(id: any) {
    let url = environment.apiUrl + `Region/DeleteRegionMapping?RegionMapId=${id}`;
    return this.http.delete(url);
  }


  //ContractCustomer
  GetAllContractCustomer() {
    let url = environment.apiUrl + 'CustomerContract/GetAllContractCustomer';
    return this.http.get(url);
  }
  GetAllContractCustomerById(id: any) {
    let url = environment.apiUrl + `CustomerContract/GetAllContractCustomerById?CustomerContractFFSId=${id}`;
    return this.http.get(url);
  }
  CustomerGetAll() {
    let url = environment.apiUrl + 'Customer/CustomerGetAll';
    return this.http.get(url);
  }
  getAllCountries(id: number) {
    let url = environment.apiUrl + 'Country/GetAllCountry/' + id;
    return this.http.get(url);
  }
  GetAllCurrency(id: number) {
    let url = environment.apiUrl + 'Currency/GetAllCurrency/' + id;
    return this.http.get(url);
  }
  GetAllContractCustomerStatus() {
    let url = environment.apiUrl + 'CustomerContract/GetAllContractCustomerStatus';
    return this.http.get(url);
  }
  GetAllContractCustomerApprovalStatus() {
    let url = environment.apiUrl + 'CustomerContract/GetAllContractCustomerApprovalStatus';
    return this.http.get(url);
  }

  AddContractCustomer(data: any) {
    let url = environment.apiUrl + 'CustomerContract/AddContractCustomer';
    return this.http.post(url, data);
  }

  DeleteCustomerContract(id: any) {
    let url = environment.apiUrl + `CustomerContract/DeleteCustomerContract?Id=${id}`;
    return this.http.delete(url);
  }

  GetAllCalculationParameter() {
    let url = environment.apiUrl + 'CustomerContract/GetAllCalculationParameter';
    return this.http.get(url);
  }
  GetAllCalculationType() {
    let url = environment.apiUrl + 'CustomerContract/GetAllCalculationType';
    return this.http.get(url);
  }

  getAddressByCustomerId(id: any) {
    let url = environment.apiUrl + `CustomerContract/getAddressByCustomerId?CustomerId=${id}`;
    return this.http.get(url);
  }

  GetAllTaxType() {
    let url = environment.apiUrl + 'CustomerContract/GetAllTaxType';
    return this.http.get(url);
  }



  //Vendor Contract
  getAddressByVendorId(id: any) {
    let url = environment.apiUrl + `VendorContract/getAddressByVendorId?id=${id}`;
    return this.http.get(url);
  }

  AddVendorContract(data: any) {
    let url = environment.apiUrl + 'VendorContract/AddVendorContract';
    return this.http.post(url, data);
  }
  GetAllVendorCustomer() {
    let url = environment.apiUrl + 'VendorContract/GetAllVendorCustomer';
    return this.http.get(url);
  }

  GetAllVendorById(id: any) {
    let url = environment.apiUrl + `VendorContract/GetAllVendorById?VendorFFSId=${id}`;
    return this.http.get(url);
  }

  DeleteVendorContract(id: any) {
    let url = environment.apiUrl + `VendorContract/DeleteVendorContract?Id=${id}`;
    return this.http.delete(url);
  }

  GetVendorMappingById(id: any) {
    let url = environment.apiUrl + `VendorContract/GetVendorMappingById?VCFFSDetailId=${id}`;
    return this.http.get(url);
  }



  //Job Order
  GetAllJOAgainst() {
    let url = environment.apiUrl + 'DropDown/GetAllJOAgainst';
    return this.http.get(url);
  }

  AddJobOrder(data:any){
    let url = environment.apiUrl + 'JobOrder/AddJobOrder';
    return this.http.post(url, data);
  }
  GetAllJobOrder(){
    let url = environment.apiUrl + 'JobOrder/GetAllJobOrder';
    return this.http.get(url);
  }
  GetJobOrderById(id: any) {
    let url = environment.apiUrl + `JobOrder/GetJobOrderById?Id=${id}`;
    return this.http.get(url);
  }
  GetAirStatusById(id: any) {
    let url = environment.apiUrl + `JobOrder/GetAirStatusById?Id=${id}`;
    return this.http.get(url);
  }
  GetSeaStatusById(id: any) {
    let url = environment.apiUrl + `JobOrder/GetSeaStatusById?Id=${id}`;
    return this.http.get(url);
  }
  GetRoadStatusById(id: any) {
    let url = environment.apiUrl + `JobOrder/GetRoadStatusById?Id=${id}`;
    return this.http.get(url);
  }

  DeleteJobOrderById(id: any) {
    let url = environment.apiUrl + `JobOrder/DeleteJobOrderById?Id=${id}`;
    return this.http.delete(url);
  }

  GetStatusListByJoId(id: any) {
    let url = environment.apiUrl + `JobOrder/GetStatusListByJoId?Id=${id}`;
    return this.http.get(url);
  }


  GetJOIsExpenseBooking() {
    let url = environment.apiUrl + 'JobOrder/GetJOIsExpenseBooking';
    return this.http.get(url);
  }

  GetJoByStatus() {
    let url = environment.apiUrl + 'JobOrder/GetJoByStatus';
    return this.http.get(url);
  }
  
  GetJOIsJORevenueBooking() {
    let url = environment.apiUrl + 'JobOrder/GetJOIsJORevenueBooking';
    return this.http.get(url);
  }

  GetAllJobModeofTransport() {
    return this.http.get<JobModeofTransports[]>(
      environment.apiUrl + "JobOrder/GetAllJobModeofTransport");
  }

  JobOrderstatus(jostatus: joborderstauslist): Observable<joborderstauslist> {
    return this.http.post<joborderstauslist>(environment.apiUrl + "JobOrder/JobOrderstatus", jostatus)
  }


  JobOrderStatusList(jobstatus: joborderstatus): Observable<joborderstatus[]> {
    return this.http.post<joborderstatus[]>(
      environment.apiUrl + "JobOrder/JobOrderStatusList", jobstatus
    );
  }

  JobOrderLatestStage(jobstatus: joborderstatus): Observable<joborderstatus> {
    return this.http.post<joborderstatus>(
      environment.apiUrl + "JobOrder/JobOrderLatestStage", jobstatus
    );
  }

  GetJOReferenceByCustomer(customerId: any, JOAgainstId: any, userId: any) {
    let url = environment.apiUrl + `JobOrder/GetJOReferenceByCustomer?CustomerId=${customerId}&JOAgainstId=${JOAgainstId}&userId=${userId}`;
    return this.http.get(url);
  }

  GetAllContractCustomerByIds(ids: any) {
    let url = environment.apiUrl + `CustomerContract/GetAllContractCustomerByIds?customerContractFFSIds`;
    return this.http.post(url, ids);
  }
  GetAllDocumentMappingByScreenId(id:number) {
    return this.http.get<any[]>(
        environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
  }
}  
