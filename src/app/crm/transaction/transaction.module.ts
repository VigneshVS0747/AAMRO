import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOME_DATE_FORMATS, MyDateAdapter } from 'src/app/custom-date-adapter';

import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { QuillModule } from 'ngx-quill';
import { MasterRoutingModule } from '../master/master-routing.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ExcelExportModule } from "@progress/kendo-angular-excel-export";
import { PurchaseQuotationGenerateComponent } from './purchese-quotation/purchase-quotation-generate/purchase-quotation-generate.component';
import { PackageDialogComponent } from './purchese-quotation/package-dialog/package-dialog.component';
import { StandaloneDialogComponent } from './purchese-quotation/standalone-dialog/standalone-dialog.component';
import { PriceDialogComponent } from './purchese-quotation/price-dialog/price-dialog.component';
import { FollowUpComponent } from './FollowUp/follow-up/follow-up.component';
import { FollowuplistComponent } from './FollowUp/followuplist/followuplist.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { PurchaseQuotationListComponent } from './purchese-quotation/purchase-quotation-list/purchase-quotation-list.component';
import { EnqpackageDialogComponent } from './Enquiry/enquiry/enqpackage-dialog/enqpackage-dialog.component';
import { EnquiryListComponent } from './Enquiry/EnquiryList/enquiry-list/enquiry-list.component';
import { FollowuphistoryComponent } from './Enquiry/enquiry/FollowUphistory/followuphistory/followuphistory.component';
import {MatIconModule} from '@angular/material/icon';
import { EnquiryComponent } from './Enquiry/enquiry/enquiry.component';
import { RfqlistComponent } from './RFQ/rfqlist/rfqlist.component';
import { RfqComponent } from './RFQ/RFQ-CUV/rfq/rfq.component';
import { RfqpackageComponent } from './RFQ/RFQPackage-dialog/rfqpackage/rfqpackage.component';
import { RfqaddressdialogComponent } from './RFQ/rfqaddressdialog/rfqaddressdialog.component';
import { RfqvendorcontactdialogComponent } from './RFQ/rfqvendorcontactdialog/rfqvendorcontactdialog.component';
import { VendorfilterdialogComponent } from './RFQ/vendorfilterdialog/vendorfilterdialog.component';
import { MappingDialogComponent } from './purchese-quotation/mapping-dialog/mapping-dialog.component';
import { SalesopportunityCuvComponent } from './salesopportunity/salesopportunity-cuv/salesopportunity-cuv.component';
//import { SalesopportunityListComponent } from './salesopportunity/salesopportunity-list/salesopportunity-list.component'
import {MatTooltipModule} from '@angular/material/tooltip';
import { PurchaseQuotationCuvComponent } from './purchese-quotation/purchase-quotation-cuv/purchase-quotation-cuv.component';
import { EnquiryvalidityComponent } from './Enquiry/enquiryvalidity/enquiryvalidity.component';
import { SalesfunnellistComponent } from './Enquiry/salesfunnellist/salesfunnellist.component';
import { PqcompareComponent } from './RFQ/pqcompare/pqcompare.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MaingridComponent } from './RFQ/subgrids/maingrid/maingrid.component';
import { Subgrid01Component } from './RFQ/subgrids/subgrid01/subgrid01.component';
import { Subgrid02Component } from './RFQ/subgrids/subgrid02/subgrid02.component';
import { Subgrid03Component } from './RFQ/subgrids/subgrid03/subgrid03.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpiryDialogComponent } from './purchese-quotation/expiry-dialog/expiry-dialog.component';
@NgModule({
  declarations: [
    FollowUpComponent,
    FollowuplistComponent,
    SalesopportunityCuvComponent,
    EnquiryComponent,
    PurchaseQuotationListComponent,
    PurchaseQuotationCuvComponent,
    PurchaseQuotationGenerateComponent,
    PackageDialogComponent,
    StandaloneDialogComponent,
    PriceDialogComponent,
    FollowuplistComponent,
    EnqpackageDialogComponent,
    EnquiryListComponent,
    FollowuphistoryComponent,
    RfqComponent,
    RfqpackageComponent,
    VendorfilterdialogComponent,
    RfqvendorcontactdialogComponent,
    RfqaddressdialogComponent,
    RfqlistComponent,
    MappingDialogComponent,
    EnquiryvalidityComponent,
    SalesfunnellistComponent,
    PqcompareComponent,
    MaingridComponent,
    Subgrid01Component,
    Subgrid02Component,
    Subgrid03Component,
    ExpiryDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DropDownListModule,
    // Kendo UI Angular modules
    GridModule,ExcelModule,
    DropDownsModule,
    IntlModule,
    ButtonsModule,
    AutocompleteLibModule,
    ExcelExportModule,

    // Angular Material modules
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    QuillModule.forRoot(),

    // Your application-specific modules
    TransactionRoutingModule,
    // ... other modules
    BrowserAnimationsModule,
    MatSelectModule,
    //DateTime Picker//
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    NgxMatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    SharedModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOME_DATE_FORMATS },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionModule { }
