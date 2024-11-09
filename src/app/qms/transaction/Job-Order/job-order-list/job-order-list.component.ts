import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { map, Observable, startWith } from 'rxjs';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { ListStatusComponent } from '../grids-dailog-Component/list-status/list-status.component';
import { JOStatusHistoryModal } from '../job-order.modals';
import { JobOrderExpenseBookingService } from '../../job-order-expense-booking/job-order-expense-booking.service';
import { JobOrderRevenueBookingService } from '../../Job-Order-Revenue/Job-order-revenue.service';

@Component({
  selector: 'app-job-order-list',
  templateUrl: './job-order-list.component.html',
  styleUrls: ['./job-order-list.component.css' , '../../../qms.styles.css']
})
export class JobOrderListComponent {
  selectedCountryId: any;
  countries: any;


  selectedRegionId: any;
  regions: any;

  JobOrderList: any[] = [];
  pagePrivilege: Array<string>;

  showAddRow: boolean | undefined;
  userId$: any;
  editRow: boolean = false;
  pageSize = 10;
  skip = 0;
  sizes = [10, 20, 50];
  buttonCount = 2

  JOStatusList:any[]=[];
  StatusHistoryPopup:any;

  filteredJobOrderStageControl: Observable<any[]>;
  filteredJobOrderStatusControl: Observable<any[]>;
  JobOrderStageControl = new FormControl('',[Validators.required, this.JobOrderStageValidator.bind(this)]);
  JobOrderStatusControl = new FormControl('',[Validators.required, this.JobOrderStatusValidator.bind(this)]);
  DateControl = new FormControl('',[Validators.required]);
  remarksControl = new FormControl('',[Validators.maxLength(500)]);
  JobOrderStageList: any[]=[];
  JobOrderStatusList: any[]=[];
  ListStatusDailog: any;
  trastype: any;

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>,
     private regionService: RegionService,private UserIdstore: Store<{ app: AppState }>,
     public dialog: MatDialog,private jobOrderExpenseBookingService: JobOrderExpenseBookingService,
     private jobOrderRevenueBookingService: JobOrderRevenueBookingService,
  ) {  }


  ngOnInit(): void {
    this.GetUserId();
    this.getAllJobOrderList();
    this.store.select("privileges").subscribe({
      next: (res) => {
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    this.matFilter();
  }

  matFilter(){
    this.filteredJobOrderStageControl = this.JobOrderStageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredJobOrderStageControl(value || '')),
    );
    this.filteredJobOrderStatusControl = this.JobOrderStatusControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredJobOrderStatusControl(value || '')),
    );
  }

  private _filteredJobOrderStageControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStageList.filter((option: any) => option?.countryName.toLowerCase().includes(filterValue));
  }
  private _filteredJobOrderStatusControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStatusList.filter((option: any) => option?.countryName.toLowerCase().includes(filterValue));
  }

  JobOrderStageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '') {
      var isValid = this.JobOrderStageList?.some((option: any) => option?.countryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  JobOrderStatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '') {
      var isValid = this.JobOrderStatusList?.some((option: any) => option?.countryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  OnchangeEvent(event: any) {
    this.matFilter();
  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  getAllJobOrderList() {
    this.regionService.GetAllJobOrder().subscribe((res: any) => {
      this.JobOrderList = res;
      this.JobOrderList = this.JobOrderList.map(item => {
        return {
          ...item,
          jobOrderDate: new Date(item.jobOrderDate),
        };
      });
    })
  }

  add() {
    this.router.navigate(["/qms/transaction/add-job-order"]);
  }


  oncancel(obj: any) {

  }

  Edit(obj: any) {
    let jobOrderId = obj.jobOrderId;
    this.router.navigate(['/qms/transaction/add-job-order', jobOrderId]);
  }

  view(obj: any) {
    let jobOrderId = obj.jobOrderId;
    this.router.navigate(['/qms/transaction/add-job-order/view', jobOrderId]);
  }

  costView(data: any) {
    // if(data.isJOExpenseBooking==true)
    // {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Info",
    //     text: "Already cost booking done",
    //     showConfirmButton: false,
    //     timer:2000
    //   });
    //   return;
    // }
    this.jobOrderExpenseBookingService.isView = false;
    this.jobOrderExpenseBookingService.isEdit = false;
    this.jobOrderExpenseBookingService.setJOId(data.jobOrderId);
    this.router.navigate(["qms/transaction/job-order-expense-booking-cuv"]);
  }

  revenue(dataItem:any){
    // if(dataItem.isJORevenueBooking==true)
    //   {
    //     Swal.fire({
    //       icon: "info",
    //       title: "Info",
    //       text: "Already Revenue booking done",
    //       showConfirmButton: false,
    //       timer:2000
    //     });
    //     return;
    //   }

    this.jobOrderRevenueBookingService.isView = false;
    this.jobOrderRevenueBookingService.isEdit = false;
    this.jobOrderRevenueBookingService.setJOId(dataItem.jobOrderId)
    this.router.navigate(['/qms/transaction/add-job-order-revenue-booking']);
  }


  Save(obj: any) {

  }

  Update(obj: any) {

  }

  Delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Job Order!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.regionService.DeleteJobOrderById(id).subscribe((res: any) => {
          console.log(res)
          if (res['message'] == 1) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Deleted successfully",
              showConfirmButton: true,
            }).then((result) => {
              if (result.dismiss !== Swal.DismissReason.timer) {
                this.getAllJobOrderList();
              }
            });
            this.getAllJobOrderList();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Something went wrong",
              showConfirmButton: false,
              timer: 2000,
            });
            this.getAllJobOrderList();
          }
        },
          (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Something went wrong",
              showConfirmButton: false,
              timer: 2000,
            });
            this.getAllJobOrderList();
          }
        )
      }
    })

  }



  viewStatus(dataItem: any) {
    this.regionService.GetJobOrderById(dataItem?.jobOrderId).subscribe((res:any)=>{
      this.trastype = res.joTransportMode[0];
      this.ListStatusDailog = this.dialog.open(ListStatusComponent,{
        autoFocus: false,
        disableClose: true,
        data:{
          JOId: dataItem?.jobOrderId,
          jobtypeid:dataItem?.jobTypeId,
          ModeoftransId:this.trastype.transportModeId
        }
      });
      this.ListStatusDailog.afterClosed().subscribe((result: any) => {
        debugger;
        if(result!=null){
          this.regionService.JobOrderstatus(result).subscribe((res=>{
            
          }))
         console.log("result1234567890",result)
        }
      });
    });
    
    
  }


  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
}
