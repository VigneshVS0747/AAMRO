// import { Component } from '@angular/core';
// import { SalesOpportunityService } from '../salesopportunity.service';
// import { Router } from '@angular/router';
// import { SalesOpportunity } from '../salesopportunity.model';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-salesopportunity-list',
//   templateUrl: './salesopportunity-list.component.html',
//   styleUrls: ['./salesopportunity-list.component.css']
// })
//  export class SalesopportunityListComponent {
//    salesOppourtunitys: SalesOpportunity [];
//   constructor(
//     private salesOppourtunityService:SalesOpportunityService,
//     private router: Router)
//   {

//   }

//   ngOnInit()
//   {
//     this.getAllSalesOppourtunity();
//   }
//   getAllSalesOppourtunity()
// {
//   this.salesOppourtunityService.getAllSalesOpportunity().subscribe((result: any) => {
//   this.salesOppourtunitys = result;
//   });
// }

// add(){
//   this.salesOppourtunityService.isView=false;
//   this.salesOppourtunityService.isEdit=false;
//   this.router.navigate(["/crm/transaction/salesopportunity/create"]);
//   this.salesOppourtunityService.setItemId(0)
//  }

//  onEdit(item:any)
//  {
//   debugger
//   this.salesOppourtunityService.isView=false;
//   this.salesOppourtunityService.isEdit=true;
//   this.salesOppourtunityService.setItemId(item.salesOppId);
//   this.router.navigate(["/crm/transaction/salesopportunity/create"]);
//  }

//  onview(item:any) 
//  {
//   if(item){
//     debugger
//     this.salesOppourtunityService.isView=true;
//     this.salesOppourtunityService.isEdit=false;
//     this.salesOppourtunityService.setItemId(item.salesOppId);
//     this.router.navigate(["/crm/transaction/salesopportunity/create"]);
//   }
//  }
//  onMail(data:any)
//  {
//   alert('Mail');
//  }
//  onDelete(data:any)
//  {
//   Swal.fire({
//     title: 'Are you sure to?',
//     text: "Delete " + data.salesOppourtunityName + '...!',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, delete it!'
//   }).then((result: { isConfirmed: any; }) => {
//     if (result.isConfirmed) {
//       this.salesOppourtunityService.deleteSalesOpportunity(data.salesOppId).subscribe((res: any) => {
//         this.getAllSalesOppourtunity();
//         Swal.fire(
//           'Deleted!',
//           'SalesOppourtunity ' + data.salesOppourtunityName + ' has been deleted',
//           'success'
//         )
//       },);
//     }
//   })

//  }
//  }
