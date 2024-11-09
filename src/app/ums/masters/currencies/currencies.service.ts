import { Injectable } from '@angular/core';
import { Currency } from './currency.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  private filterState = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }
  //#region filter State
  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }
  //#endregion

  addCurrency(currency: Currency) {

    return this.http
      .post<{ message: string }>(environment.apiUrl + "Currency/AddCurrency", currency)
  }

  deleteCurrency(currencyId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "Currency/Delete/" + currencyId);
  }
  IsActiveCurrency(currencyId: number) {

    return this.http.delete<{ message: string}>(environment.apiUrl + "Currency/IsActive/" + currencyId);
  }

  getCurrency(id: number) {

    return this.http.get<{
      currencyId: number;
      currencyCode: string;
      currencyName: string;
      currencySymbol: string;
      denominationMain: string;
      denominationSub: string;
      livestatus: boolean;
      createdBy: number;
      createdDate: Date;
      updatedBy: number | null;
      updatedDate: Date;
    }>(
      environment.apiUrl + "Currency/CurrencyBy/" + id
    );
  }

  updateCurrency(currency: Currency) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "Currency/UpdateCurrency", currency);
  }

  GetCurrencyByCompanyCurrency() {
    return this.http
      .get<Currency[]>(environment.apiUrl + "Currency/GetCurrencyByCompanyCurrency");
  }

}
