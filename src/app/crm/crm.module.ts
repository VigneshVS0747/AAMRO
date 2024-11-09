import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CrmRoutingModule } from './crm-routing.module';
import { MasterRoutingModule } from './master/master-routing.module';
import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { HttpClientModule } from '@angular/common/http';
import { MasterModule } from './master/master.module';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOME_DATE_FORMATS, MyDateAdapter } from '../custom-date-adapter';
import {MatTabsModule} from '@angular/material/tabs';
import { TransactionRoutingModule } from './transaction/transaction-routing.module';
import { TransactionModule } from './transaction/transaction.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Kendo UI Angular modules
    GridModule,
    DropDownsModule,
    InputsModule,
    ButtonsModule,

    // Your application-specific modules
    MasterRoutingModule,
    CrmRoutingModule,
    MasterModule,
    // ... other modules
    DatePipe,
    MatTabsModule,
    TransactionRoutingModule,
    TransactionModule,

  ],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOME_DATE_FORMATS },
  ],
})
export class CrmModule { }
