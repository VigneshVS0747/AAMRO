
import {
  UserHeader,
  UserMenus,
  UserMenusAction,
  UserData,
  UserPayload,
} from "./user.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class UserService {
 
  constructor(private http: HttpClient) {}

  add(ucm: any) {
    return this.http.post<any>(
      environment.apiUrl + "UserCreation_Mapping/AddUserCreations",
      ucm
    );
  }

  getUser(id: number) {
    return this.http.get<UserData>(
      environment.apiUrl + "UserCreation_Mapping/UserBy/" + id
    );
  }

  updateUser(user: any) {
    return this.http.put<{ message: string }>(
      environment.apiUrl + "UserCreation_Mapping/UpdateUserCreations",
      user
    );
  }

  deleteUser(id: number) {
    return this.http.delete<{ message: string }>(
      environment.apiUrl + "UserCreation_Mapping/DeleteUserCreation/" + id
    );
  }

  deleteUserMenu(id: number) {
    return this.http.delete<{ message: string }>(
      environment.apiUrl + "UserCreation_Mapping/DeleteMenu/" + id
    );
  }

  getActionId(actionId: number, actionName: string) {
    const queryParams = `?actionName=${actionName} & actionId=${actionId}`;
    return this.http.get<{ id: number }>(
      environment.apiUrl + "UserCreation_Mapping" + queryParams
    );
  }

  addMenusAction(uma: UserMenusAction) {
    return this.http.post<{ message: string; menuActionId: number }>(
      environment.apiUrl + "UserCreation_Mapping/AddMenusAction",
      uma
    );
  }
  createUserCreations(UserCreation: any): Observable<UserPayload> {
    return this.http.post<UserPayload>(environment.apiUrl, UserCreation);
  }
}
