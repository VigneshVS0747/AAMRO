import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EnqpackageDialogComponent } from '../../enqpackage-dialog/enqpackage-dialog.component';
import { FollowupService } from 'src/app/crm/transaction/FollowUp/followup.service';
import { FollowUpHistory } from 'src/app/Models/crm/master/transactions/Followup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-followuphistory',
  templateUrl: './followuphistory.component.html',
  styleUrls: ['./followuphistory.component.css']
})
export class FollowuphistoryComponent implements OnInit {
  FollowUpHistory:FollowUpHistory[]=[];
  values: any;
  Link: string;
  StatusId:number;
  screennumber: any;

  constructor(public dialog: MatDialog,
    public FS:FollowupService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FollowuphistoryComponent>){

  }

  ngOnInit(): void {
    this.screennumber = this.data.screen;
    this.StatusId=this.data.status

   this.GetHistory();
  }
  isStatusValid(): any {
    switch (this.screennumber) {
      case 1:
        return this.StatusId === 1;

      case 2:
        return this.StatusId === 1 || this.StatusId === 3;
      case 3:
        return this.StatusId === 1;
      case 4:
        return this.StatusId != 2;
        case 5:
          return this.StatusId != 2;
     case 6:
      return this.StatusId === 1;
      case 7:
        return this.StatusId === 1 || this.StatusId === 3;
      default:
        console.warn('No action defined for this UOM');
    }
    
  }

  GetHistory(){
    this.values=this.data.parms
    this.FS.GetFollowUpHistory(this.values).subscribe((res)=>{
      this.FollowUpHistory = res;
    });
  }

  Add(){
    this.Link="/crm/transaction/followup/"+this.values.baseDocNameId+"/"+this.values.baseDocId;
    this.router.navigate([this.Link]);
    this.dialogRef.close();
    
  }

  Close(){
    this.dialogRef.close();
  }

  formatDate(dateString: any): any {
    debugger
    if(dateString != null && dateString != ""){
      return new Date(dateString);
    } else {
      return null;
    }
  }

}
