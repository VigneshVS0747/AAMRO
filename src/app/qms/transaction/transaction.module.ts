import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { GridModule } from "@progress/kendo-angular-grid";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionRoutingModule } from './transaction-routing.module';
import { CustomerContractListComponent } from './customer-contract/customer-contract-list/customer-contract-list.component';
import { AddCustomerContractComponent } from './customer-contract/add-customer-contract/add-customer-contract.component';
import { AddCustomerInfoComponent } from './customer-contract/add-customer-info/add-customer-info.component';
import { ImagePreviewComponent } from './customer-contract/image-preview/image-preview.component';
import { VendorContractListComponent } from './vendor-contract/vendor-contract-list/vendor-contract-list.component';
import { AddVendorContractComponent } from './vendor-contract/add-vendor-contract/add-vendor-contract.component';
import { AddVendorContractInfoComponent } from './vendor-contract/add-vendor-contract-info/add-vendor-contract-info.component';
import { AddVendorContractMappingComponent } from './vendor-contract/add-vendor-contract-mapping/add-vendor-contract-mapping.component';
import { JobOrderListComponent } from './Job-Order/job-order-list/job-order-list.component';
import { AddJobOrderComponent } from './Job-Order/add-job-order/add-job-order.component';
import { AirTransportComponent } from './Job-Order/grids-dailog-Component/air-transport/air-transport.component';
import { SeaTransportComponent } from './Job-Order/grids-dailog-Component/sea-transport/sea-transport.component';
import { RoadTransportComponent } from './Job-Order/grids-dailog-Component/road-transport/road-transport.component';
import { JobTypeComponent } from './Job-Order/grids-dailog-Component/job-type/job-type.component';
import { PackageDetailsComponent } from './Job-Order/grids-dailog-Component/package-details/package-details.component';
import { LineItemDetailsComponent } from './Job-Order/grids-dailog-Component/line-item-details/line-item-details.component';
import { AirStatusComponent } from './Job-Order/grids-dailog-Component/air-transport/air-status/air-status.component';
import { SeaStatusComponent } from './Job-Order/grids-dailog-Component/sea-transport/sea-status/sea-status.component';
import { RoadStatusComponent } from './Job-Order/grids-dailog-Component/road-transport/road-status/road-status.component';
import { QuillModule } from 'ngx-quill';
import { JobOrderExpenseBookingCuvComponent } from './job-order-expense-booking/job-order-expense-booking-cuv/job-order-expense-booking-cuv.component';
import { JobOrderExpenseBookingDialogComponent } from './job-order-expense-booking/job-order-expense-booking-dialog/job-order-expense-booking-dialog.component';
import { JobOrderExpenseBookingListComponent } from './job-order-expense-booking/job-order-expense-booking-list/job-order-expense-booking-list.component';
import { JoebDocumentDialogComponent } from './job-order-expense-booking/joeb-document-dialog/joeb-document-dialog.component';
import { JoebLineitemDialogComponent } from './job-order-expense-booking/joeb-lineitem-dialog/joeb-lineitem-dialog.component';
import { JoborderComponent } from './joborder/joborder.component';
import { QLIVendorValueDetailComponent } from './Quotations/qlivendor-value-detail/qlivendor-value-detail.component';
import { QuotationComponent } from './Quotations/quotation-cuv/quotation.component';
import { QuotationlineitemComponent } from './Quotations/quotationlineitem/quotationlineitem.component';
import { VendorfilterComponent } from './Quotations/vendorfilter/vendorfilter.component';
import { VendorvalueComponent } from './Quotations/vendorvalue/vendorvalue.component';
import { QuotationpackagedialogComponent } from './Quotations/quotationpackagedialog/quotationpackagedialog.component';
import { AttachmentComponent } from './Job-Order/grids-dailog-Component/attachment/attachment.component';
import { ListStatusComponent } from './Job-Order/grids-dailog-Component/list-status/list-status.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MyDateAdapter, CUSTOME_DATE_FORMATS } from 'src/app/custom-date-adapter';
import { QuotationlistComponent } from './Quotations/quotationlist/quotationlist.component';
import { LineVendorFilterComponent } from './Job-Order/grids-dailog-Component/line-item-details/line-vendor-filter/line-vendor-filter.component';
import { ProformaInvoiceListComponent } from './Proforma Invoice/proforma-invoice-list/proforma-invoice-list.component';
import { ProformaInvoiceAddComponent } from './Proforma Invoice/proforma-invoice-add/proforma-invoice-add.component';
import { ProformaInvoiceFilterComponent } from './Proforma Invoice/proforma-invoice-filter/proforma-invoice-filter.component';
import { ProformaInvoiceEditComponent } from './Proforma Invoice/proforma-invoice-edit/proforma-invoice-edit.component';
import { JoebVendorfilterDialogComponent } from './job-order-expense-booking/joeb-vendorfilter-dialog/joeb-vendorfilter-dialog.component';
import { RevenueListComponent } from './Job-Order-Revenue/revenue-list/revenue-list.component';
import { AddRevenueBookingComponent } from './Job-Order-Revenue/add-revenue-booking/add-revenue-booking.component';
import { PurchaseInvoiceListComponent } from './Purchase Invoice/purchase-invoice-list/purchase-invoice-list.component';
import { AddPurchaseInvoiceComponent } from './Purchase Invoice/add-purchase-invoice/add-purchase-invoice.component';
import { QuotationhistoryComponent } from './Quotations/quotationhistory/quotationhistory.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PIlineItemComponent } from './Purchase Invoice/piline-item/piline-item.component';
import { JorbDetailDialogComponent } from './Job-Order-Revenue/jorb-detail-dialog/jorb-detail-dialog.component';
import { JorbLineitemDialogComponent } from './Job-Order-Revenue/jorb-lineitem-dialog/jorb-lineitem-dialog.component';
import { PIvendorvalueComponent } from './Purchase Invoice/pivendorvalue/pivendorvalue.component';
import { PIdetailsComponent } from './Purchase Invoice/pidetails/pidetails.component';
import { PurchaseInvoiceFilterComponent } from './Purchase Invoice/purchase-invoice-filter/purchase-invoice-filter.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { QuotevalidityComponent } from './Quotations/quotevalidity/quotevalidity.component';


@NgModule({
  declarations: [
    CustomerContractListComponent,
    AddCustomerContractComponent,
    AddCustomerInfoComponent,
    ImagePreviewComponent,
    VendorContractListComponent,
    AddVendorContractComponent,
    AddVendorContractInfoComponent,
    AddVendorContractMappingComponent,
    JobOrderListComponent,
    AddJobOrderComponent,
    AirTransportComponent,
    SeaTransportComponent,
    RoadTransportComponent,
    JobTypeComponent,
    PackageDetailsComponent,
    LineItemDetailsComponent,
    AirStatusComponent,
    SeaStatusComponent,
    RoadStatusComponent,
    JoborderComponent,
    QuotationComponent,
    QuotationlineitemComponent,
    VendorfilterComponent,
    VendorvalueComponent,
    JobOrderExpenseBookingListComponent,
    JobOrderExpenseBookingCuvComponent,
    JobOrderExpenseBookingDialogComponent,
    JoebDocumentDialogComponent,
    JoebLineitemDialogComponent,
    QLIVendorValueDetailComponent,
    QuotationpackagedialogComponent,
    AttachmentComponent,
    ListStatusComponent,
    QuotationlistComponent,
    QuotationpackagedialogComponent,
    LineVendorFilterComponent,
    ProformaInvoiceListComponent,
    ProformaInvoiceAddComponent,
    ProformaInvoiceFilterComponent,
    ProformaInvoiceEditComponent,
    JoebVendorfilterDialogComponent,
    RevenueListComponent,
    AddRevenueBookingComponent,
    PurchaseInvoiceListComponent,
    AddPurchaseInvoiceComponent,
    QuotationhistoryComponent,
    PIlineItemComponent,
    JorbDetailDialogComponent,
    JorbLineitemDialogComponent,
    PIvendorvalueComponent,
    PIdetailsComponent,
    PurchaseInvoiceFilterComponent,
    QuotevalidityComponent,
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    MaterialModule,
    MatCheckboxModule,
    GridModule,FormsModule,ReactiveFormsModule,
    AutocompleteLibModule,
    QuillModule.forRoot(),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    NgxMatNativeDateModule,
    

  ],

  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionModule { }
