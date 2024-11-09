import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enquiry, EnquiryCombine, EnquirySalesfunnel, Enquiryvaliditycloser } from 'src/app/Models/crm/master/transactions/Enquiry';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  itemId: number;
  public Fromenq: boolean = false;


  constructor(private http: HttpClient) { }

  CreateEnquiry(Enquiry: EnquiryCombine): Observable<EnquiryCombine> {
    return this.http.post<EnquiryCombine>(environment.apiUrl + "Enquirey/AddEnquiry", Enquiry)
  }
  GetAllEnquiry(id: number): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + "Enquirey/GetAllEnquiry" + '/' + id
    );
  }
  setItemId(id: number): void {
    this.itemId = id;
  }
  GetOpenEnquiry(): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + "Enquirey/GetOpenEnquiry"
    );
  }
  GetOpenEnquiryforvalidity(): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + "Enquirey/GetOpenEnquiryforvalidity"
    );
  }


  GetAllEnquiryById(id: number): Observable<EnquiryCombine> {
    return this.http.get<EnquiryCombine>(
      environment.apiUrl + "Enquirey/GetAllEnquirybyId" + '/' + id
    );
  }
  GetAllsalesfunnel(id: number): Observable<EnquirySalesfunnel[]> {
    return this.http.get<EnquirySalesfunnel[]>(
      environment.apiUrl + "Enquirey/GetEnquirySalesfunnel" + '/' + id
    );
  }

  DeleteEnquiry(id: number): Observable<EnquiryCombine> {
    return this.http.delete<EnquiryCombine>(environment.apiUrl + "Enquirey/Delete" + '/' + id);
  }

  PostEnquiryStatusList(Enquiry: Enquiryvaliditycloser): Observable<Enquiryvaliditycloser> {
    return this.http.post<Enquiryvaliditycloser>(environment.apiUrl + "Enquirey/ValiditystatusList", Enquiry)
  }

  GetAllEnquiryCount() {
    let url = environment.apiUrl + 'Enquirey/GetAllEnquiryCount';
    return this.http.get(url)
  }
  getEnquiryListByStatus(id: any) {
    let url = environment.apiUrl + `Enquirey/GetAllEnquiryByStatusID?id=${id}`;
    return this.http.get(url)
  }
  GetMonthlyEnquiryCounts(year: any) {
    let url = environment.apiUrl + `Enquirey/GetMonthlyEnquiryCounts?id=${year}`;
    return this.http.get(url)
  }

  GetEnquiryByCustomer(id: number, catId: number): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + "Enquirey/GetEnquiryByCustomer/" + id + "/" + catId);
  }

  GetEnquirybasedCustomerEmailandFile(id: number): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl + "Enquirey/GetEnquirybasedCustomerEmailandFile/" + id);
  }

  downloadPdf(data: any) {
    return this.http.post(environment.apiUrl + "Mail/GetPdf", data, {
      responseType: 'blob' // Specify that the response is a Blob
    });
  }

  SendMail(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Mail/SendMail", data)
  }
  GetAllDocumentMappingByScreenId(id: number) {
    return this.http.get<any>(
      environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/" + id);
  }

  GetInvalidFieldsId(invalid: string): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + "Enquirey/GetInvalidFieldsId/" + invalid);
  }
  GetEnquiryReportByFilterdColumn(fromDate: any, toDate: any, modeOfTransport: any, originCountry: any, destinationCountry: any, informationSource: any, commodity: any): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + "Enquirey/GetEnquiryReportByFilterdColumn/" + fromDate + "/" + toDate + "/" + modeOfTransport + "/" + originCountry + "/" + destinationCountry + "/" + informationSource + "/" + commodity);
  }
}
