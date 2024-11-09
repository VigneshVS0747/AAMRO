import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../quotation.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Router } from '@angular/router';
import { QuotationGeneral, Quotevaliditycloser } from '../quotation-model/quote';
import { MatDialog } from '@angular/material/dialog';
import { QuotationhistoryComponent } from '../quotationhistory/quotationhistory.component';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { Employee } from 'src/app/ums/masters/employee/employee.model';
import { QuotevalidityComponent } from '../quotevalidity/quotevalidity.component';

@Component({
  selector: 'app-quotationlist',
  templateUrl: './quotationlist.component.html',
  styleUrls: ['./quotationlist.component.css']
})
export class QuotationlistComponent implements OnInit {
  userId$: string;
  QuotationList: QuotationGeneral[];
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  pagePrivilege: Array<string>;
  EmployeeList: Employee[]=[];

  constructor(private Qs:QuotationService,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private router: Router,  public dialog: MatDialog, private Cservice: CommonService,
  ){

  }
  ngOnInit(): void {
    this.GetUserId();
    this.GetAllQuotation();
    this.Employee();
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

  Employee() {
    this.Cservice.getEmployees(1).subscribe((res) => {
      this.EmployeeList = res;
    })
  }

  optionSelectedCustomername(id: number): any {
    if (id != null) {
      const selectedid = this.EmployeeList.find(
        (item) => item.employeeId === id
      );

      return selectedid ? selectedid.employeeName : "";
    } 
  }


  GetAllQuotation(){
    this.Qs.GetAllQuotation(parseInt(this.userId$)).subscribe((res)=>{
      this.QuotationList = res;

      console.log(" this.QuotationList", this.QuotationList);
    });
  }

  QuotationHistory(Quotationnumber:any){
    const dialogRef = this.dialog.open(QuotationhistoryComponent, {
      data: {
        Qnumber:Quotationnumber
       
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }

  Add(){
    this.router.navigate(["/qms/transaction/Quote/create"]);
  }

  Delete(Data:any) {
    if(Data.quoteStatusId==1){
      Swal.fire({
        title: 'Are you sure?',
        text: "Delete the Quotation ?..",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.Qs.DeleteQuotation(Data.quotationId).subscribe((res) => {
           
            this.GetAllQuotation();
  
            Swal.fire(
              'Deleted!',
              'Quotation has been deleted',
              'success'
            )
          });
  
        }
      })
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "You can't delete this because its move to Approval process",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  Edit(Data:any){
    if(Data.quoteStatusId!=6){
      this.router.navigate(['/qms/transaction/Quote/edit/', Data.quotationId]);
    }
    else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "You can't edit this because its move to Job Order",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  Revision(Data:any){
    if(Data.quoteStatusId!=6){
      this.router.navigate(['/qms/transaction/Quote/revision/', Data.quotationId]);
    }
    else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "You can't Revision this because its move to Job Order",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  OpenValidity() {
    const dialogRef = this.dialog.open(QuotevalidityComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {

      const PayLoad: Quotevaliditycloser = {
        quotations:result
      }
      this.Qs.QuoteStatusCloser(PayLoad).subscribe((res) => {
        Swal.fire(
          'Closed!',
          'Quote has been Closed',
          'success'
        )
        this.GetAllQuotation();
      });
    });
  }
  
}
