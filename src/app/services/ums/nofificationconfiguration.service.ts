import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from 'date-fns/locale';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/Models/ums/Activity.modal';
import { AuthorizationItem } from 'src/app/Models/ums/authorizationitem.model';
import { Menus } from 'src/app/Models/ums/menus.modal';
import { notificationconfiguration, notificationpopup } from 'src/app/Models/ums/notificationconfiguration.modal';
import { environment } from 'src/environments/environment.development';









@Injectable({
  providedIn: 'root'
})
export class NofificationconfigurationService {

private filterState = new BehaviorSubject<any>(null);

  constructor(private http:HttpClient) { }
  setFilterState(filter: any) {
    this.filterState.next(filter);
  }

  getFilterState() {
    return this.filterState.asObservable();
  }
//getall modules//
GetAllModules() : Observable<Menus[]>{
  return this.http.get<Menus[]>(environment.apiUrl+"Menu/GetAllModules")
 }
 GetNotificationpopUp() : Observable<notificationpopup[]>{
  return this.http.get<notificationpopup[]>(environment.apiUrl+"NotificationConfiguration/Getnotificationpopup")
 }
 //get menu header//
 Getmenuheaderbyid(id:number): Observable<Menus[]>{
  return this.http.get<Menus[]>(environment.apiUrl+"Menu/Menuheader"+'/'+id);
 }
 // get Activityby header//
 GetActivitybyheaderid(data:any): Observable<Activity[]>{
  return this.http.post<Activity[]>(environment.apiUrl+"Activity/ActivityByheader",data);
 }
 GetActivitybyheaderidForApprovals(data:any): Observable<Activity[]>{
  return this.http.post<Activity[]>(environment.apiUrl+"Activity/ActivityByheaderForApprovals",data);
 }
 GetAuthorizationitem(id:number) : Observable<AuthorizationItem[]>{
  return this.http.get<AuthorizationItem[]>(environment.apiUrl+"AuthorizationItem/GetAllAuthorizationItem"+'/'+id)
 }

 Addnotification(data1:any):Observable<any>{
  return this.http.post<any>(environment.apiUrl+"NotificationConfiguration/Add",data1)
}
Updateiconnotification(id:number): Observable<Activity>{
  return this.http.put<Activity>(environment.apiUrl+"Activity/Updatenotification",id);
 }

 GetAllNotificationActivity() : Observable<notificationconfiguration[]>{
  return this.http.get<notificationconfiguration[]>(environment.apiUrl+"NotificationConfiguration/GetAllActivityNotification")
 }

 GetActivityByNotification(id:number) : Observable<notificationconfiguration[]>{
  return this.http.get<notificationconfiguration[]>(environment.apiUrl+"NotificationConfiguration/GetActivityByNotification"+'/'+id)
 }
 GetEscalationByNotification(id:number) : Observable<notificationconfiguration[]>{
  return this.http.get<notificationconfiguration[]>(environment.apiUrl+"NotificationConfiguration/GetEscalationByNotificationId"+'/'+id)
 }

 Updatenotification(data:any):Observable<any>{
  return this.http.post<any>(environment.apiUrl+"NotificationConfiguration/UpdateNotification",data)
}
DeleteUserNotification(id:number):Observable<notificationconfiguration>{
  return this.http.delete<notificationconfiguration>(environment.apiUrl+"NotificationConfiguration/Delete"+'/'+id);
}  

UpdateEscalation(data:any):Observable<any>{
  return this.http.post<any>(environment.apiUrl+"NotificationConfiguration/UpdateEscalation",data)
}


DeleteAllNotification(id:number):Observable<notificationconfiguration>{
  return this.http.delete<notificationconfiguration>(environment.apiUrl+"NotificationConfiguration/DeleteAllNotifications"+'/'+id);
} 

DeleteEscalationandUsers(id:number):Observable<notificationconfiguration>{
  return this.http.delete<notificationconfiguration>(environment.apiUrl+"NotificationConfiguration/DeleteEscalationandEscalationUsers"+'/'+id);
} 

DeleteActivity(id:number):Observable<notificationconfiguration>{
  return this.http.delete<notificationconfiguration>(environment.apiUrl+"NotificationConfiguration/DeleteActivity"+'/'+id);
}

GetAllEscalation() : Observable<notificationconfiguration[]>{
  return this.http.get<notificationconfiguration[]>(environment.apiUrl+"NotificationConfiguration/GetAllEscalation")
 }

 TriggerNotification(data:any):Observable<any>{
  return this.http.post<any>(environment.apiUrl+"NotificationConfiguration/TriggerNotification",data)
}

Deletenotificationdeletepopup(parms:any):Observable<any>{
  return this.http.post<any>(environment.apiUrl+"NotificationConfiguration/DeleteNotificationpopup",parms);
}


GetnotificationpopupList(id:number) : Observable<any[]>{
  return this.http.get<any[]>(environment.apiUrl+"NotificationConfiguration/GetnotificationpopupList"+'/'+id)
 }

 GetnotificationpopupBold(id:number) : Observable<any>{
  return this.http.get<any>(environment.apiUrl+"NotificationConfiguration/GetnotificationpopupBold"+'/'+id)
 }
}
