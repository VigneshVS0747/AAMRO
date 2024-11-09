import { Injectable } from '@angular/core';
import { Country } from './country.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient) { }

  addCountry(country:Country) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "Country/AddCountry",country)
}

deleteCountry(countryId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "Country/Delete/" + countryId);
}
IsActiveCountry(countryId: number) {
  return this.http.delete<{ message: string}>(environment.apiUrl + "Country/IsActive/" + countryId);
}

getCountry(id: number) {
  
  return this.http.get<{ countryId: number;
    countryCode2L: string;
    countryCode3L: string;
    countryName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; }>(
      environment.apiUrl + "Country/CountryBy/" + id
  );
}

getAllCountries(id: number){
  return this.http.get<Country[]>(
      environment.apiUrl + "Country/GetAllCountry/" + id);
}

updateCountry(country:Country) {
  return this.http
    .put<{ message: string}>(environment.apiUrl + "Country/UpdateCountry",country);
}
}
