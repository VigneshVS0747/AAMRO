import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { invoiceFlag } from 'src/app/Models/crm/master/invoiceFlag';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LineitemmasterService {
  private filterState = new BehaviorSubject<any>(null);
  
  constructor(private http: HttpClient) { }

 

  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }

  GetAllInvoiceFlag(): Observable<invoiceFlag[]> {
    return this.http.get<invoiceFlag[]>(
      environment.apiUrl + "DropDown/GetAllInvoicingFlags"
    );
  }

  GetAllLineItemCategory(id:number): Observable<lineitem[]> {
    return this.http.get<lineitem[]>(
      environment.apiUrl + "LineItemCategory/GetAllLineItemCategory"+'/'+ id
    );
  }

  CreateLineItemMaster(LineItemMaster:LineItemMaster):Observable<LineItemMaster>{
    return this.http.post<LineItemMaster>(environment.apiUrl+"LineItem/AddLineItem",LineItemMaster)
  }

  GetbyLineItemCategoryId(id:number): Observable<LineItemMaster[]> {
    return this.http.get<LineItemMaster[]>(
      environment.apiUrl + "LineItem/GetbyLineItemCategoryId"+'/'+ id
    );
  }
  GetAllLineItemMaster(id:number): Observable<LineItemMaster[]> {
    return this.http.get<LineItemMaster[]>(
      environment.apiUrl + "LineItem/GetAllLineItem"+'/'+ id
    );
  }

  GetAllLineItemMasterById(id:number): Observable<LineItemMaster> {
    return this.http.get<LineItemMaster>(
      environment.apiUrl + "LineItem/LineItemBy"+'/'+ id
    );
  }

  DeleteLineItem(id: number): Observable<any> {
    return this.http.delete<LineItemMaster[]>(
      environment.apiUrl + "LineItem/Delete/" + id
    );
  }
  isActiveLineItem(id: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "LineItem/IsActive/" + id);
  }
}
