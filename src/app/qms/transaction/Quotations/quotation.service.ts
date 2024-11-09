import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { changeExchange, Exchange, QuotationContainer, quotationDocument, QuotationGeneral, Quotevaliditycloser, vendorQuotationFilter, vendorQuotationFilterList } from './quotation-model/quote';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private http: HttpClient) { }

  GetFiltervendors(Filter:vendorQuotationFilter):Observable<vendorQuotationFilterList[]>{
    return this.http.post<vendorQuotationFilterList[]>(environment.apiUrl+"RFQ/FilterQuotationVendors",Filter)
  }
  
  QuotationSave(Quote:QuotationContainer):Observable<QuotationContainer>{
    return this.http.post<QuotationContainer>(environment.apiUrl+"Quotation/QuotationSave",Quote)
  }
  Searchcontractvendorrs(vendor:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Quotation/Searchcontractvendorrs",vendor)
  }
  Searchpq(vendor:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"Quotation/Searchpq",vendor)
  }
  GetAllQuotation(id:number): Observable<QuotationGeneral[]> {
    return this.http.get<QuotationGeneral[]>(
      environment.apiUrl + "Quotation/GetAllQuotation"+'/'+ id
    );
  }

  GetQuotationHistory(Qnumber:string): Observable<QuotationGeneral[]> {
    return this.http.get<QuotationGeneral[]>(
      environment.apiUrl + "Quotation/GetQuotationHistory"+'/'+ Qnumber
    );
  }

  GetAllQuotationById(id:number): Observable<QuotationContainer> {
    return this.http.get<QuotationContainer>(
      environment.apiUrl + "Quotation/GetAllQuotationById"+'/'+ id
    );
  }
  DeleteQuotation(id:number): Observable<any> {
    return this.http.delete<any>(
      environment.apiUrl + "Quotation/DeleteQuotation"+'/'+ id
    );
  }
  GetQVerndorDetails(selectedValue: string,vendorTypeId:number,vendorId:number,lineItem:number) {
    return this.http.get<vendorQuotationFilterList[]>(
      environment.apiUrl + "Quotation/GetQVerndorDetails/" + selectedValue+"/"+ vendorTypeId+"/"+vendorId +"/"+lineItem);
  }

  CurrencyExchanges(Quote:any):Observable<changeExchange>{
    return this.http.post<changeExchange>(environment.apiUrl+"Quotation/CurrencyExchanges",Quote)
  }

  GetOpenQuotationforvalidity(): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + "Quotation/GetOpenQuotationforvalidity"
    );
  }

 QuoteStatusCloser(Quote:Quotevaliditycloser):Observable<Quotevaliditycloser>{
    return this.http.post<Quotevaliditycloser>(environment.apiUrl+"Quotation/QuoteStatusCloser",Quote)
  }
  GetAllDocumentMappingByScreenId(id:number) {
    return this.http.get<quotationDocument[]>(
        environment.apiUrl + "DocumentMapping/GetAllDocumentMappingByScreenId/"+id);
  }
}
