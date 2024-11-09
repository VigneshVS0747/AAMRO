import { Injectable } from '@angular/core';
import { City } from '../../../Models/ums/city.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  
  constructor(private http: HttpClient) { }

  getCities(id:number) : Observable<City[]>{
    return this.http.get<City[]>(environment.apiUrl + "City/GetAllCities"+'/'+id)
    
   }

  addCity(city:City) {
    
    return this.http
    .post<{ message: string}>(environment.apiUrl + "City/AddCities",city)
}

deleteCity(cityId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "City/Delete/" + cityId);
}
isActiveCity(cityId: number) {

  return this.http.delete<{ message: string}>(environment.apiUrl + "City/IsActive/" + cityId);
}

getCity(id: number) {
  
  return this.http.get<{ cityId: number;
    cityCode: string;
    cityName: string;
    stateId: number;
    stateName: string;
    countryId: number;
    countryName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; }>(
      environment.apiUrl + "City/CitiesBy/" + id
  );
}

updateCity(city:City) {
  console.log("The city value is " + JSON.stringify(city));
  return this.http
    .put<{ message: string}>(environment.apiUrl + "City/UpdateCities",city);
}

}

