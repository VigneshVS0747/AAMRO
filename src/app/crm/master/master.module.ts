import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { ModeOfTransportComponent } from './mode-of-transport/mode-of-transport.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IncotermsComponent } from './incoterm/incoterms/incoterms.component';
import { DocumentsComponent } from './document/documents/documents.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatTabsModule} from '@angular/material/tabs';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOME_DATE_FORMATS, MyDateAdapter } from 'src/app/custom-date-adapter';
import { AirportListComponent } from './airport/airport-list/airport.component';
import { AirportCreateComponent } from './airport/airport-cuv/airport-create.component';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SeaportListComponent } from './seaport/seaport-list/seaport-list.component';
import { InfosourceComponent } from './infosource/infosource/infosource.component';
import { SeaportCuvComponent } from './seaport/seaport-cuv/seaport-cuv.component';
import { ReasonCrudComponent } from './reason/reason-crud/reason-crud.component';
import { CommodityListComponent } from './commodity/commodity-list/commodity-list.component';
import { UnitofmeasureListComponent } from './unitofmeasure/unitofmeasure-list/unitofmeasure-list.component';
import { UomconversionListComponent } from './uomconversion/uomconversion-list/uomconversion-list.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PermitListComponent } from './permit/permit-list/permit-list.component';
import { ContainertypeListComponent } from './containertype/containertype-list/containertype-list.component';
import { PackagetypeListComponent } from './packagetype/packagetype-list/packagetype-list.component';
import { AddressCrudComponent } from './address/address-crud/address-crud.component';
import { ContactTypeComponent } from './contact-type/contact-type-crud/contact-type.component';
import { HscodeListComponent } from './hscode/hscode-list/hscode-list.component';
import { HscodeCuvComponent } from './hscode/hscode-cuv/hscode-cuv.component';
import { PotentialCustomerCreateComponent } from './potential-customer/potential-customer-create/potential-customer-create.component';
import { PotentialCustomerListComponent } from './potential-customer/potential-customer-list/potential-customer-list.component';
import { CustomerrankingComponent } from './customerranking/customerranking/customerranking.component';
import { IndustryTypeComponent } from './industry-type/industry-type.component';
import { ServicetypeComponent } from './servicetype/servicetype.component';
import { LineitemcategoryComponent } from './lineitemcategory/lineitemcategory.component';
import { LineItemMasterComponent} from './LineItemMaster/line-item-master/line-item-master.component';
import { LineitemmasterlistComponent } from './LineItemMaster/lineitemmasterlist/lineitemmasterlist.component';
import { JobtypelistComponent } from './jobtype/jobtypelist/jobtypelist.component';
import { JobtypecreateComponent } from './jobtype/jobtypecreate/jobtypecreate.component';
import { MatButtonModule } from '@angular/material/button';
import { TrailerTypeComponent } from './trailer-type/trailer-type.component';
import { StoragetypeComponent } from './StorageType/storagetype/storagetype.component';
import { StoragetypelistComponent } from './StorageType/storagetypelist/storagetypelist.component';

import { MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { ContactDialogComponent } from './potential-customer/contact-dialog/contact-dialog.component';
import { AddressDialogComponent } from './potential-customer/address-dialog/address-dialog.component';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorCuvComponent } from './vendor/vendor-cuv/vendor-cuv.component';
import { VcontactCuvDialogComponent } from './vendor/vcontact-cuv-dialog/vcontact-cuv-dialog.component';
import { VaddressCuvDialogComponent } from './vendor/vaddress-cuv-dialog/vaddress-cuv-dialog.component';
import { PotentialVendorListComponent } from './potential-vendor/potential-vendor-list/potential-vendor-list.component';
import { PotentialVendorCuvComponent } from './potential-vendor/potential-vendor-cuv/potential-vendor-cuv.component';
import { PotentialvendorAddressDialogComponent } from './potential-vendor/potentialvendor-address-dialog/potentialvendor-address-dialog/potentialvendor-address-dialog.component';
import { PotentialvendorContactDialogComponent } from './potential-vendor/potentialvendor-contact-dialog/potentialvendor-contact-dialog/potentialvendor-contact-dialog.component';
import { CustomerCuvComponent } from './customer/customer-cuv/customer-cuv.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CAddressDialogComponent } from './customer/c-address-dialog/c-address-dialog.component';
import { CContactDialogComponent } from './customer/c-contact-dialog/c-contact-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { HsCodecategoryComponent } from './hs-codecategory/hs-codecategory.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PartmasterComponent } from './PartMaster/partmaster/partmaster.component';
import { BrandDialogComponent } from './PartMaster/brand-dialog/brand-dialog.component';
import { PartMasterListComponent } from './PartMaster/part-master-list/part-master-list.component';
import { MatIconModule } from '@angular/material/icon';
import { DocumentMappingComponent } from './document-mapping/document-mapping.component';
import { VendorDocDialogComponentm } from './vendor/vendor-doc-dialog/vendor-doc-dialog.component';
import { CustomerDocDialogComponent } from './customer/customer-doc-dialog/customer-doc-dialog.component';
import { ApprovalDialogComponent } from './approval/approval-dialog/approval-dialog.component';
import { ApprovalHistoryListComponent } from './approval/approval-history-list/approval-history-list.component';
import { ApprovalHistoryDialogComponent } from './approval/approval-history-dialog/approval-history-dialog.component';



@NgModule({
  declarations: [
    ModeOfTransportComponent,
    IncotermsComponent, 
    DocumentsComponent,
    AirportListComponent,
    AirportCreateComponent,
    SeaportListComponent,
    InfosourceComponent,
    SeaportCuvComponent,
    ReasonCrudComponent,
    CommodityListComponent,
    UnitofmeasureListComponent,
    UomconversionListComponent,
    PermitListComponent,
    ContainertypeListComponent,
    PackagetypeListComponent,
   
  
    

    AddressCrudComponent,
    ContactTypeComponent,
    HscodeListComponent,
    HscodeCuvComponent,

    PotentialCustomerListComponent,
    PotentialCustomerCreateComponent,
    PotentialVendorListComponent,
    PotentialVendorCuvComponent,
    CustomerrankingComponent,
    IndustryTypeComponent,
    ServicetypeComponent,
    LineitemcategoryComponent,
    LineItemMasterComponent,
    LineitemmasterlistComponent,
    JobtypelistComponent,
    JobtypecreateComponent,
    TrailerTypeComponent,
    StoragetypeComponent,
    StoragetypelistComponent,
    PartmasterComponent,
    BrandDialogComponent,
    PartMasterListComponent,
    ContactDialogComponent,
    AddressDialogComponent,
    VendorListComponent,
    VendorCuvComponent,
    VcontactCuvDialogComponent,
    VaddressCuvDialogComponent,
    PotentialvendorAddressDialogComponent,
    PotentialvendorContactDialogComponent,
    CustomerCuvComponent,
    CustomerListComponent,
    CAddressDialogComponent,
    CContactDialogComponent,
    HsCodecategoryComponent,
    DocumentMappingComponent,
    VendorDocDialogComponentm,
    CustomerDocDialogComponent,
    ApprovalDialogComponent,
    ApprovalHistoryListComponent,
    ApprovalHistoryDialogComponent
  

  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AutocompleteLibModule,
    DropDownListModule,
    MatIconModule,
    // Kendo UI Angular modules
    GridModule,
    DropDownsModule,
    MatTooltipModule,
    ButtonsModule,
    AutocompleteLibModule,

    // Your application-specific modules
    MasterRoutingModule,
    // ... other modules
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatAutocompleteModule,
    DatePipe,
    MatTabsModule,
    DatePipe,
    MatButtonModule,
    QuillModule.forRoot(),
  ],

  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOME_DATE_FORMATS },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MasterModule { }