import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortType, Seaport } from 'src/app/Models/crm/master/Seaport';
import { City } from 'src/app/Models/ums/city.model';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { State } from 'src/app/ums/masters/states/state.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SeaportService {
  public itemId: number;
  public isView:boolean=false;

  constructor(private http: HttpClient) { }

  addSeaport(seaport: Seaport) {
    console.log(seaport);
    
    return this.http
      .post<{ message: string }>(environment.apiUrl + "Seaport/AddSeaport", seaport);
  }
  deleteSeaport(seaportId: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "Seaport/Delete/" + seaportId);
  }
  updateSeaport(seaport: Seaport) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "Seaport/UpdateSeaport", seaport);
  }
  getallSeaports(): Observable<Seaport[]> {
    return this.http.get<Seaport[]>(environment.apiUrl + "Seaport/GetAllSeaport");
  }
  getallActiveSeaports(id: any): Observable<Seaport[]> {
    return this.http.get<Seaport[]>(environment.apiUrl + "Seaport/GetAllActiveSeaport/"+id);
  }
  getSeaport(id:number) {
    return this.http.get<Seaport[]>( environment.apiUrl + "Seaport/SeaportBy/" + id )
  }
  //#region operation on add-edit-view
  setItemId(id: number): void {
    this.itemId = id;
  }
  //#endregion
  getCountries(id: number): Observable<Country[]> {
    return this.http.get<Country[]>(
      environment.apiUrl + "Country/GetAllCountry" + "/" + id
    );
  }
  getStatesForSelectedCountry(selectedCountryId: number) {
    return this.http.get<State[]>(
      environment.apiUrl + "States/StatesbyCountryId/" + selectedCountryId
    );
  }
  getCityForSelectedState(selectedStateId: number) {
    return this.http.get<City[]>(
      environment.apiUrl + "City/CitiesbystateId/" + selectedStateId
    );
  }
  getPorttype(): Observable<PortType[]>{
    return this.http.get<PortType[]>(environment.apiUrl + "DropDown/GetAllPortType");
  }
}
