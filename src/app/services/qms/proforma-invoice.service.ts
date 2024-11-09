import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProformaInvoiceService {

  constructor(private http: HttpClient) { }

  GetProformaInvoiceList(){
    let url = environment.apiUrl + 'ProformaInvoice/GetProformaInvoiceList';
    return this.http.get(url)
  }
  
  AddProformaInvoice(data:any){
    let url = environment.apiUrl + 'ProformaInvoice/AddProformaInvoice';
    return this.http.post(url, data)
  }

  GetPIStatusList(){
    let url = environment.apiUrl + 'ProformaInvoice/GetPIStatusList';
    return this.http.get(url)
  }

  GetPIById(Id:any){
    let url = environment.apiUrl + `ProformaInvoice/GetPIById?ProformaInvoiceId=${Id}`;
    return this.http.get(url)
  }

  DeletePIById(id: any) {
    let url = environment.apiUrl + `ProformaInvoice/DeletePIById?Id=${id}`;
    return this.http.delete(url);
  }

  getFilterJoList(data:any){
    let url = environment.apiUrl + 'ProformaInvoice/getFilterJoList';
    return this.http.post(url, data)
  }
  getJOLineItems(data:any){
    let url = environment.apiUrl + 'ProformaInvoice/getJOLineItems';
    return this.http.post(url, data)
  }
  getLIDetailsbyLIdandJoId(data:any){
    let url = environment.apiUrl + 'ProformaInvoice/getLIDetailsbyLIdandJoId';
    return this.http.post(url, data)
  }
}
