import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QuotationService } from '../quotation.service';
import { PotentialCustomerService } from 'src/app/crm/master/potential-customer/potential-customer.service';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { PotentialCustomer } from 'src/app/crm/master/potential-customer/potential-customer.model';
import { Customer } from 'src/app/crm/master/customer/customer.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-quotevalidity',
  templateUrl: './quotevalidity.component.html',
  styleUrls: ['./quotevalidity.component.css']
})
export class QuotevalidityComponent implements OnInit {
  Quotation:any[]=[];

  PotentialCustomer: PotentialCustomer[]=[];
  Customer: Customer []=[];
  NewEnquiry:any[]=[];
  pagePrivilege: Array<string>;
  isChecked:boolean=false;
  constructor(private service:QuotationService,
    private PCs:PotentialCustomerService,
    private Cus:CustomerService,
    public dialog: MatDialog,
    private router: Router, public dialogRef: MatDialogRef<QuotevalidityComponent>){
  
      this.fetchDropDownData();
  
  }
  ngOnInit(): void {
    this.GetAllEnquiry();
   }
 
   GetAllEnquiry(){
 
     this.service.GetOpenQuotationforvalidity().subscribe((res)=>{
       this.Quotation = res;
     });
   }
   toggleSelectAll(event: any): void {
    const checked = event.checked;
    this.Quotation.forEach(item => {
      item.selected = checked;
    });
    this.isChecked = checked; // Update the property
  }

  toggleSelect(event: any): void {
    this.isChecked = this.Quotation.some(item => item.selected); // Update the property
  }
 
   optionSelectedCustomername(id: number,cusid:1): string {
     if(cusid==1){
       const selectedid = this.PotentialCustomer.find(
         (item) => item.potentialCustomerId === id
       );
   
       return selectedid ? selectedid.customerName : "";
     }else{
       const selectedid = this.Customer.find(
         (item) => item.customerId === id
       );
   
       return selectedid ? selectedid.customerName : "";
     } 
   }
 
   fetchDropDownData() {

    const PotentialC$ = this.PCs.getAllActivePotentialCustomer();
    const Cust$ = this.Cus.getAllActiveCustomer();
 
      
     
    
    forkJoin([Cust$,PotentialC$]).subscribe({
      next: ([Cust,PotentialC]) => {
       this.PotentialCustomer = PotentialC;
       this.Customer = Cust;
    
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }
  Close(){
    this.dialogRef.close(this.Quotation);
  }

  Closemodal(){
    this.dialogRef.close();
  }
}
