export interface notificationconfiguration {
    activityId:number,
    authorizationItemId:number,
    isReportingManager: number,
    isPopup: string,
    isMail: string,
    isMessage: string,
    sequenceOrder:number,
    userIdescalation:number,
    escalationtime:string,
    timetype:string,
    isReportingManagerescalation:boolean,
    isNotifytoRoute:boolean,
    createdby: number;
    createddate:Date;
    updatedby:number;
    updateddate:Date,   
  }
  export interface notificationpopup {
    userId:number;
    message:string;
    menuUrl:string;
    id:number;
    isMail:number;
    isMessage:number;
    isPopup:number;
    activityName:string;
    autoId:number;
  }