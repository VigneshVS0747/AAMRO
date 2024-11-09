import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { JobOrderExpenseBookingService } from '../job-order-expense-booking.service';
import { JOCostBookingGeneral } from '../job-order-expense-booking.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-job-order-expense-booking-list',
  templateUrl: './job-order-expense-booking-list.component.html',
  styleUrls: ['./job-order-expense-booking-list.component.css', '../../../qms.styles.css']
})
export class JobOrderExpenseBookingListComponent {
  pagePrivilege: Array<string>;
  userId$: string;

  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  joCostBookingList: JOCostBookingGeneral[];

  constructor(private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService
  ) { }

  ngOnInit() {
    this.GetUserId();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
    this.GetAllJOCostBooking();

  }

  GetAllJOCostBooking() {
    this.jobOrderExpenseBookingService.GetAllJOCostBooking().subscribe(res => {
      this.joCostBookingList = res;
      this.joCostBookingList = this.joCostBookingList.map(item => {
        return {
          ...item,
          costBookingDate: item?.costBookingDate === '1900-01-01T00:00:00' ? null : this.resetTime(new Date(item?.costBookingDate)),
          jobOrderDate: item.jobOrderDate === '1900-01-01T00:00:00' ? null : this.resetTime(new Date(item.jobOrderDate)),
        };
      });

      console.log(this.joCostBookingList);
    });
  }
  resetTime(date: any) {
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
        //Get list by login user...
        //this.getAllList();
      }
    });
  }
  add() {
    this.jobOrderExpenseBookingService.isView = false;
    this.jobOrderExpenseBookingService.isEdit = false;
    this.router.navigate(["qms/transaction/job-order-expense-booking-cuv"]);
    this.jobOrderExpenseBookingService.setItemId(0)
  }

  onview(data: any){
    this.jobOrderExpenseBookingService.isView = true;
    this.jobOrderExpenseBookingService.isEdit = false;
    this.jobOrderExpenseBookingService.setItemId(data.joCostBookingId)
    this.router.navigate(["qms/transaction/job-order-expense-booking-cuv"]);
  }
  onEdit(data: any) {
    this.jobOrderExpenseBookingService.isView = false;
    this.jobOrderExpenseBookingService.isEdit = true;
    this.jobOrderExpenseBookingService.setItemId(data.joCostBookingId)
    this.router.navigate(["qms/transaction/job-order-expense-booking-cuv"]);
  }
  onDelete(data: any) {
if(!data.isDraft){
  Swal.fire({
    icon: "warning",
    title: "Warning!",
    text: "This " + data.referenceNumber + " is not in draft, so you can't delete it.",
    showConfirmButton: false,
    timer: 2000,
});
  return;
}

    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete " + data.referenceNumber + '...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobOrderExpenseBookingService.JOCostBookingDelete(data.joCostBookingId).subscribe((res) => {
          this.GetAllJOCostBooking();
          Swal.fire(
            'Deleted!',
            'Job Order Expense Booking ' + data.referenceNumber + ' has been deleted',
            'success'
          )
        },);
      }
    })


  }
  formatDate(dateString: any): any {
    if(dateString!=null){
      return new Date(dateString);
    }
    else{
      return null;
    }
  }

}
