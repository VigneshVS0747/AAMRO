import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MenuItem, DynamicMenu } from "./menu.model";
import { Login } from "../Models/ums/Login.modal";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  //readonly apiUrl = "http://1.22.214.78/AamroApi/api/";

  constructor(private http: HttpClient) {}


 

  getMenuData(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(environment.apiUrl + "Menu/GetAllMenu");
  }
  getMenu(): Observable<MenuItem> {
    return this.http.get<MenuItem>(environment.apiUrl + "Menu/GetAllMenu");
  }
  getDynamicMenu(id: String): Observable<DynamicMenu[]> {
    return this.http.get<DynamicMenu[]>(`${environment.apiUrl}Menu/MenuAuth/${id}`);
  }
  getMenuPrivileges(id: string): Observable<any> {
    return this.http.get<DynamicMenu[]>(
      `${environment.apiUrl}Menu/MenuAuthPreviliges/${id}`
    );
  }
}
