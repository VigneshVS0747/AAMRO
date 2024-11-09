import { Component, OnInit } from '@angular/core';
import { FollowupService } from '../followup.service';
import { FollowUp, FollowUplist } from 'src/app/Models/crm/master/transactions/Followup';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';

@Component({
  selector: 'app-followuplist',
  templateUrl: './followuplist.component.html',
  styleUrls: ['./followuplist.component.css']
})
export class FollowuplistComponent implements OnInit {
  Followup: FollowUplist[] = [];
  pagePrivilege: Array<string>;
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor(private service: FollowupService, private router: Router, private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private route: ActivatedRoute,private Ns:NofificationconfigurationService
  ) {

  }
  ngOnInit(): void {
    this.GetUserId();
    //this.getFollowups();
    this.Redirect();
  }
  Redirect() {
    const pathmain = this.router.url;
    if (pathmain == "/crm/transaction/followuplist/" + this.route.snapshot.params["id"]) {
      var Path = "/crm/transaction/followup/view/" + this.route.snapshot.params["id"];
      this.router.navigate([Path]);
    }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
        //Get list by login user...
        this.getFollowups();
      }
    });
  }

  getFollowups() {
    this.service.GetAllFollowup(parseInt(this.userId$)).subscribe((res) => {
      this.Followup = res
      console.log("res-------------------->", res)
    });

    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }

  Delete(data:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Follow-up!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteFollowup(data.followUpId).subscribe((res) => {

          const parms ={
            MenuId:51,
            currentUser:this.userId$,
            activityName:"Deletion",
            id:data.followUpId,
            code:data.followUpCode
          }
          this.Ns.TriggerNotification(parms).subscribe((res=>{

          }));
          this.getFollowups();

          Swal.fire(
            'Deleted!',
            'Follow-Up has been deleted',
            'success'
          )
        });

      }
    })
  }

}
