import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';

@Component({
  selector: 'app-notificationbell',
  templateUrl: './notificationbell.component.html',
  styleUrls: ['./notificationbell.component.css']
})
export class NotificationbellComponent implements OnInit {
  notificationlist: any[]=[];
  userId: any;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<NotificationbellComponent>,
  private NS:NofificationconfigurationService,
  private router: Router,){

  }

  ngOnInit(): void {
    this.userId = this.data.userId;
    this.getNotificationList();
  }
   
  getNotificationList(){
    this.NS.GetnotificationpopupList(this.userId).subscribe((res=>{
      this.notificationlist=res;
    }));
  }

  Delete(userId:number,autoId:number,index:number){
    const Notificationdeletepopup ={
      userId:userId,
      autoId:autoId
    }
    this.NS.Deletenotificationdeletepopup(Notificationdeletepopup).subscribe(res=>{
      this.getNotificationList();
      if(index!=null){
        this.dialogRef.close(index);
      }
    });
  }
  Rediect(Url:string,id:number,autoid:number){
    this.router.navigate(["/"+Url+"/"+id]);
    this.Close()
    this.NS.GetnotificationpopupBold(autoid).subscribe((res=>{}));
  }

  Close(){
    this.dialogRef.close();
  }
}
