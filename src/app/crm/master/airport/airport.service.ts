import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Airport } from 'src/app/Models/crm/master/Airport';
import { City } from 'src/app/Models/ums/city.model';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { State } from 'src/app/ums/masters/states/state.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  public itemId: number;
  public isView:boolean=false;
  constructor(private http: HttpClient) { }

  addAirport(airport: Airport) {
    return this.http
      .post<{ message: string }>(environment.apiUrl + "Airport/AddAirport", airport)
  }

  deleteAirport(airportId: number) {
    return this.http.delete<{ message: string }>(environment.apiUrl + "Airport/Delete/" + airportId);
  }
  updateAirport(airport: Airport) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "Airport/UpdateAirport", airport);
  }
  getAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(environment.apiUrl + "Airport/GetAllAirport");
  }
  getAllActiveAirports(id:any): Observable<Airport[]> {
    return this.http.get<Airport[]>(environment.apiUrl + "Airport/GetAllActiveAirport/" +id);
  }
  isActiveAirport(airportid: number){
    return this.http.delete<{ message: string}>(environment.apiUrl + "Airport/IsActive/" + airportid);
  }
  //#region operation on add-edit-view
  setItemId(id: number): void {
    this.itemId = id;
  }
  //#endregion
  getAirport(id:number) {
    return this.http.get<Airport[]>( environment.apiUrl + "Airport/AirportBy/" + id )
  }

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
}
