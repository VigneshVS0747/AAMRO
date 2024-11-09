import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
// import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgFor, AsyncPipe } from "@angular/common";
import { GridModule } from "@progress/kendo-angular-grid";
// import { InputsModule } from "@progress/kendo-angular-inputs";
// import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { MatMenuModule } from "@angular/material/menu";


// import {MatIconModule} from '@angular/material/icon';

import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from "@angular/material/slide-toggle";
import { DatePipe } from "@angular/common";
import { DesignationListComponent } from "./masters/designation/designation-list/designation-list.component";
import { DepartmentListComponent } from "./masters/department/department-list/department-list.component";
import { CountryListComponent } from "./masters/countries/country-list/country-list.component";
import { StateListComponent } from "./masters/states/state-list/state-list.component";
import { CurrencyCreateComponent } from "./masters/currencies/currency-create/currency-create.component";
import { CurrencyListComponent } from "./masters/currencies/currency-list/currency-list.component";
import { CityListComponent } from "./masters/cities/city-list/city-list.component";
import { BranchCreateComponent } from "./masters/branch/branch-create/branch-create.component";
import { BranchListComponent } from "./masters/branch/branch-list/branch-list.component";
import { EmployeeCreateComponent } from "./masters/employee/employee-create/employee-create.component";
import { EmployeeListComponent } from "./masters/employee/employee-list/employee-list.component";
import { ActCreateComponent } from "./masters/access-control-template/act-create/act-create.component";
import { ActListComponent } from "./masters/access-control-template/act-list/act-list.component";
import { LoginComponent } from "./admin/user/login/login.component";
import { DashboardlayoutComponent } from "../dashboardlayout/dashboardlayout.component";
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { DeleteConfirmationDialogComponent } from "../dialog/confirmation/delete-confirmation-dialog.component";
import { UmsRoutingModule } from "./ums-routing.module";
import { UserCreateComponent } from "./admin/user/user-create/user-create.component";
import { UserListComponent } from "./admin/user/user-list/user-list.component";
import { AuthorizationMatrixDialogComponent } from "../dialog/authorization-matrix/authorization-matrix-dialog.component";
import { AuthorizationitemComponent } from "./admin/authorizationitem/authorizationitem.component";
import { AuthorizationmatrixComponent } from "./admin/authorizationmatrix/authorizationmatrix.component";
import { AuthorizationmatrixlistComponent } from "./admin/authorizationmatrixlist/authorizationmatrixlist.component";
import { NotificationconfigurationComponent } from "./admin/notificationconfiguration/notificationconfiguration.component";
import { AuthorizationitemmasterComponent } from "./admin/authorizationitemmaster/authorizationitemmaster.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { NotificationconfigurationlistComponent } from "./admin/notificationconfigurationlist/notificationconfigurationlist.component";
import { AccessControlDialogComponent } from "../dialog/access-control-dialog/access-control-dialog.component";
import { ApprovalConfigurationComponent } from "./admin/approval-configuration/approval-configuration.component";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { ToastrModule } from "ngx-toastr";
import { ApprovalConfigurationListComponent } from "./admin/approval-configuration-list/approval-configuration-list.component";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EncryptDecryptComponent } from './masters/encrypt-decrypt/encrypt-decrypt.component';
import { StreangthcheckComponent } from "./admin/user/streangthcheck/streangthcheck.component";
import { MatSortModule } from "@angular/material/sort";


import { ChartsModule } from "@progress/kendo-angular-charts";
import { MaterialModule } from '../material.module';
import { EnquiryPopupComponent } from './landing-page/Popup-grid-components/enquiry-popup/enquiry-popup.component';
import { FollowupPopupComponent } from './landing-page/Popup-grid-components/followup-popup/followup-popup.component';
import { CustomerPopupComponent } from './landing-page/Popup-grid-components/customer-popup/customer-popup.component';
import { PotentialCustomerPopupComponent } from './landing-page/Popup-grid-components/potential-customer-popup/potential-customer-popup.component'

import { NotificationbellComponent } from "../navbar/notificationbell/notificationbell.component";
import { EmailComponent } from './Email/email/email.component';
import { CurrencysaplistComponent } from './masters/currencies/currency-sap/currencysaplist/currencysaplist.component';


@NgModule({
  declarations: [
    DesignationListComponent,
    DepartmentListComponent,
    CountryListComponent,
    StateListComponent,
    CurrencyCreateComponent,
    CurrencyListComponent,
    CityListComponent,
    BranchCreateComponent,
    BranchListComponent,
    EmployeeCreateComponent,
    EmployeeListComponent,
    ActCreateComponent,
    ActListComponent,
    LoginComponent,
    DashboardlayoutComponent,
    FooterComponent,
    NavbarComponent,
    NotificationbellComponent,
    DeleteConfirmationDialogComponent,
    UserCreateComponent,
    UserListComponent,
    AuthorizationMatrixDialogComponent,
    AccessControlDialogComponent,
    AuthorizationitemComponent,
    AuthorizationmatrixComponent,
    AuthorizationmatrixlistComponent,
    NotificationconfigurationComponent,
    AuthorizationitemmasterComponent,
    NotificationconfigurationlistComponent,
    ApprovalConfigurationComponent,
    ApprovalConfigurationListComponent,
    LandingPageComponent,
    EncryptDecryptComponent,
    StreangthcheckComponent,
    EnquiryPopupComponent,
    FollowupPopupComponent,
    CustomerPopupComponent,
    PotentialCustomerPopupComponent,
    EmailComponent,
    CurrencysaplistComponent
  
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatAutocompleteModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSortModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    UmsRoutingModule,
    GridModule,
    InputsModule,
    ButtonsModule,
    DropDownsModule,
    NgFor,
    AsyncPipe,
    MatSlideToggleModule,
    DatePipe,
    AutocompleteLibModule,
    MatCardModule,
    ChartsModule,
    MaterialModule
  ],

})

export class UmsModule {}
