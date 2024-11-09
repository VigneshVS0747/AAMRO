import { Injectable } from '@angular/core';
import { UserHeader, UserMenus, UserMenusAction } from '../../Models/ums/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  add(ucm:UserHeader) {
    return this.http
    .post<{ message: string}>(environment.apiUrl + "UserCreation_Mapping/AssignUser",ucm)
}

getUser(id: number) {
  return this.http.get<{ 
    userId: number;
    employeeId: number;
    employeeCode: string;
    employeeName: string;
    authorizationId: number;
    authorizationMatrixName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    menus?: UserMenus[];
  }>(
    environment.apiUrl + "UserCreation_Mapping/UserBy/" + id
  );
}

updateUser(user:UserHeader) {
  
  return this.http
    .put<{ message: string}>(environment.apiUrl + "UserCreation_Mapping/UpdateUser",user);
}

deleteUser(id: number) {
  return this.http
  .delete<{message: string}>(environment.apiUrl + "UserCreation_Mapping/DeleteUser/" + id);
}

deleteUserMenu(id: number) {
  
  return this.http
  .delete<{message: string}>(environment.apiUrl + "UserCreation_Mapping/DeleteMenu/" + id);
}

getActionId(actionName:string){
  const queryParams = `?actionName=${actionName}`;
  return this.http.get<{id:number}>(environment.apiUrl + "UserCreation_Mapping" + queryParams);
}

addMenusAction(uma:UserMenusAction){
  return this.http
  .post<{message:string, menuActionId:number}>(environment.apiUrl + "UserCreation_Mapping/AddMenusAction",uma)
}

}

