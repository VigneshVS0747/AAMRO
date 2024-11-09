import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { JobOrderRevenueBookingService } from '../Job-order-revenue.service';
import { CommonService } from 'src/app/services/common.service';
import { JORevenueBookingGeneral } from '../Job-order-revenue-modals';

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrls: ['./revenue-list.component.css', '../../../qms.styles.css']
})
export class RevenueListComponent {
  pagePrivilege: Array<string>;

  showAddRow: boolean | undefined;
  userId$: any;
  editRow: boolean = false;

  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  revenueBookingList: JORevenueBookingGeneral[];

  constructor(private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog,
    private jobOrderRevenueBookingService: JobOrderRevenueBookingService,
    private common: CommonService

  ) { }


  ngOnInit(): void {
    this.GetUserId();
    this.getAllRevenueBookingList();
    
    this.store.select("privileges").subscribe({
      next: (res) => {
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }




  getAllRevenueBookingList() {
    this.jobOrderRevenueBookingService.GetAllJORevenueBooking().subscribe(res => {
      this.revenueBookingList = res;
      this.revenueBookingList = this.revenueBookingList.map(item => {
        return {
          ...item,
          revenueBookingDate: item?.revenueBookingDate === '1900-01-01T00:00:00' ? null : this.resetTime(new Date(item?.revenueBookingDate)),
          jobOrderDate: item.jobOrderDate === '1900-01-01T00:00:00' ? null : this.resetTime(new Date(item.jobOrderDate)),
        };
      });

    })
  }
  resetTime(date: any) {
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  add() {
    this.jobOrderRevenueBookingService.isView = false;
    this.jobOrderRevenueBookingService.isEdit = false;
    this.jobOrderRevenueBookingService.setItemId(0)
    this.router.navigate(["/qms/transaction/add-job-order-revenue-booking"]);
  }

  onEdit(obj: any) {
    this.jobOrderRevenueBookingService.isView = false;
    this.jobOrderRevenueBookingService.isEdit = true;
    this.jobOrderRevenueBookingService.setItemId(obj.joRevenueBookingId)

    let joRevenueBookingId = obj.joRevenueBookingId;
    this.router.navigate(['/qms/transaction/add-job-order-revenue-booking']);
  }

  onview(obj: any) {
    this.jobOrderRevenueBookingService.isView = true;
    this.jobOrderRevenueBookingService.isEdit = false;
    this.jobOrderRevenueBookingService.setItemId(obj.joRevenueBookingId)

    let joRevenueBookingId = obj.joRevenueBookingId;
    this.router.navigate(['/qms/transaction/add-job-order-revenue-booking']);
  }

  onDelete(obj: any) {
    if (!obj.isDraft) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "This " + obj.referenceNumber + " is not in draft, so you can't delete it.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete " + obj.referenceNumber + '...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobOrderRevenueBookingService.JORevenueBookingDelete(obj.joRevenueBookingId).subscribe((res) => {
          this.getAllRevenueBookingList();
          Swal.fire(
            'Deleted!',
            'Job Order Revenue Booking ' + obj.referenceNumber + ' has been deleted',
            'success'
          )
        },);
      }
    })
        
  }

}


