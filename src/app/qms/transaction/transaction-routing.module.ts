import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JoborderComponent } from './joborder/joborder.component';
import { AuthGuard, DynamicGuard } from 'src/app/guards/auth.guard';
import { CustomerContractListComponent } from './customer-contract/customer-contract-list/customer-contract-list.component';
import { AddCustomerContractComponent } from './customer-contract/add-customer-contract/add-customer-contract.component';
import { VendorContractListComponent } from './vendor-contract/vendor-contract-list/vendor-contract-list.component';
import { AddVendorContractComponent } from './vendor-contract/add-vendor-contract/add-vendor-contract.component';
import { JobOrderListComponent } from './Job-Order/job-order-list/job-order-list.component';
import { AddJobOrderComponent } from './Job-Order/add-job-order/add-job-order.component';
import { QuotationComponent } from './Quotations/quotation-cuv/quotation.component';
import { JobOrderExpenseBookingListComponent } from './job-order-expense-booking/job-order-expense-booking-list/job-order-expense-booking-list.component';
import { JobOrderExpenseBookingCuvComponent } from './job-order-expense-booking/job-order-expense-booking-cuv/job-order-expense-booking-cuv.component';
import { QuotationlineitemComponent } from './Quotations/quotationlineitem/quotationlineitem.component';
import { QuotationlistComponent } from './Quotations/quotationlist/quotationlist.component';
import { ProformaInvoiceListComponent } from './Proforma Invoice/proforma-invoice-list/proforma-invoice-list.component';
import { ProformaInvoiceAddComponent } from './Proforma Invoice/proforma-invoice-add/proforma-invoice-add.component';
import { RevenueListComponent } from './Job-Order-Revenue/revenue-list/revenue-list.component';
import { AddRevenueBookingComponent } from './Job-Order-Revenue/add-revenue-booking/add-revenue-booking.component';
import { PurchaseInvoiceListComponent } from './Purchase Invoice/purchase-invoice-list/purchase-invoice-list.component';
import { AddPurchaseInvoiceComponent } from './Purchase Invoice/add-purchase-invoice/add-purchase-invoice.component';

const routes: Routes = [
  {
    path: 'customer-contract-list',
    component: CustomerContractListComponent, canActivate: [DynamicGuard]
  },
  {
    path: 'add-contract-customer',
    component: AddCustomerContractComponent
  },
  {
    path: 'add-contract-customer/:id',
    component: AddCustomerContractComponent
  },
  {
    path: 'add-contract-customer/view/:id',
    component: AddCustomerContractComponent
  },

  //Vendor
  {
    path: 'vendor-contract-list',
    component: VendorContractListComponent, canActivate: [DynamicGuard]
  },
  {
    path: 'add-vendor-contract',
    component: AddVendorContractComponent
  },
  {
    path: 'add-vendor-contract/:id',
    component: AddVendorContractComponent
  },
  {
    path: 'add-vendor-contract/view/:id',
    component: AddVendorContractComponent
  },

  //Job Order
  {
    path: 'job-order-list',
    component: JobOrderListComponent, canActivate: [DynamicGuard]
  },
  {
    path: 'add-job-order',
    component: AddJobOrderComponent
  },
  {
    path: 'add-job-order/:id',
    component: AddJobOrderComponent
  },
  {
    path: 'add-job-order/view/:id',
    component: AddJobOrderComponent
  },
  {
    path: 'add-job-order/:id',
    component: AddJobOrderComponent
  },

  //job-order//
  {
    path: 'joborder',
    component: JoborderComponent
  },

  //Quotation//
  {
    path: 'Quote',
    component: QuotationComponent
  },
  {
    path: 'Quotelist',
    component: QuotationlistComponent
  },
  {
    path: 'Quote/edit/:id', component: QuotationComponent
  },
  {
    path: 'Quote/create', component: QuotationComponent
  },
  {
    path: 'Quote/view/:id', component: QuotationComponent,canActivate:[AuthGuard]
  },
  {
    path:'Quote/revision/:id', component:QuotationComponent
  },

  //job order expense booking list 
  {
    path: 'job-order-expense-booking-list',
    component: JobOrderExpenseBookingListComponent
  },
  {
    path: 'job-order-expense-booking-cuv',
    component: JobOrderExpenseBookingCuvComponent
  },

  //Proforma Invoice
  {
    path: 'proforma-invoice-list',
    component: ProformaInvoiceListComponent, canActivate: [DynamicGuard]
  },
  {
    path: 'add-proforma-invoice',
    component: ProformaInvoiceAddComponent
  },
  {
    path: 'add-proforma-invoice/:id',
    component: ProformaInvoiceAddComponent
  },
  {
    path: 'add-proforma-invoice/view/:id',
    component: ProformaInvoiceAddComponent
  },

  //Job Order Revenue Booking
  {
    path: 'job-order-revenue-booking-list',
    component: RevenueListComponent, canActivate: [DynamicGuard]
  },
  {
    path: 'add-job-order-revenue-booking',
    component: AddRevenueBookingComponent
  },
  {
    path: 'add-job-order-revenue-booking/:id',
    component: AddRevenueBookingComponent
  },
  {
    path: 'add-job-order-revenue-booking/view/:id',
    component: AddRevenueBookingComponent
  },
  //Purchase Invoice
  {
    path: 'purchase-invoice-list',
    component: PurchaseInvoiceListComponent, canActivate: [DynamicGuard]
  },
  {
    path: 'add-purchase-invoice',
    component: AddPurchaseInvoiceComponent
  },
  {
    path: 'add-purchase-invoice/edit/:id',
    component: AddPurchaseInvoiceComponent
  },
  {
    path: 'add-purchase-invoice/view/:id',
    component: AddPurchaseInvoiceComponent
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
