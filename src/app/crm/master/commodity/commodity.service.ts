import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commodity } from './commodity.model'
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class CommodityService {

  constructor(private http: HttpClient) { }

  getCommodities(): Observable<Commodity[]> {
    return this.http.get<Commodity[]>(environment.apiUrl + "Commodity/GetAllCommodity")

  }
  getAllActiveCommodity() {
    return this.http.get<Commodity[]>( environment.apiUrl+ "Commodity/CommodityGetAllActive");
}

  addCommodity(commodity: Commodity) {

    return this.http
      .post<{ message: string }>(environment.apiUrl + "Commodity/AddCommodities", commodity)
  }

  deleteCommodity(commodityId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "Commodity/Delete/" + commodityId);
  }
  IsActiveCommodity(commodityId: number) {

    return this.http.delete<{ message: string }>(environment.apiUrl + "Commodity/IsActive/" + commodityId);
  }


  getCommodity(id: number) {

    return this.http.get<{
      commodityId: number;
      commodityCode: string;
      commodityName: string;
      commodityDescription: string;
      livestatus: boolean;
      createdBy: number;
      createdDate: Date;
      updatedBy: number | null;
      updatedDate: Date;
    }>(
      environment.apiUrl + "Commodity/CommodityBy/" + id
    );
  }

  updateCommodity(commodity: Commodity) {
    return this.http
      .put<{ message: string }>(environment.apiUrl + "Commodity/UpdateCommodity", commodity);
  }
}

