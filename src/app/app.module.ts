import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppRoutingModule } from "./app-routing.module";
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UmsModule } from "./ums/ums.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import {MatIconModule} from '@angular/material/icon';
import { CUSTOME_DATE_FORMATS, MyDateAdapter } from "./custom-date-adapter";
import { GridModule } from "@progress/kendo-angular-grid";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { StoreModule } from "@ngrx/store";
import { privilegeReducer } from "./store/user_privileges/privileges.reducer";
import { privilegeGuardReducer } from "./store/guard_privileges/guard_privileges.reducer";
import { appReducer } from "./store/UserIdStore/UserId.reducer";
import { ChangepassworddialogComponent } from './dialog/changepassworddialog/changepassworddialog.component';
import { ForgetPassworddialogComponent } from './dialog/forget-passworddialog/forget-passworddialog.component';
import { VerifyOtpdialogComponent } from './dialog/verify-otpdialog/verify-otpdialog.component';
import { ForgetpasswordchangedialogComponent } from './dialog/forgetpasswordchangedialog/forgetpasswordchangedialog.component';
import { CrmModule } from "./crm/crm.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorsService } from "./services/ums/interceptors.service";
import { StreangthcheckComponent } from './streangthcheck/streangthcheck.component';
import { TwofactorauthdialogComponent } from './dialog/twofactorauthdialog/twofactorauthdialog.component';
import { DescriptiondialogComponent } from './dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MaterialModule } from './material.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { QmsModule } from "./qms/qms.module";
import { SharedModule } from './shared/shared.module';
import { MatChipsModule } from "@angular/material/chips";





@NgModule({
  declarations: [AppComponent, ChangepassworddialogComponent, 
    ForgetPassworddialogComponent, VerifyOtpdialogComponent, 
    ForgetpasswordchangedialogComponent,StreangthcheckComponent, 
    TwofactorauthdialogComponent, DescriptiondialogComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UmsModule,
    CrmModule,
    GridModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    AutocompleteLibModule,
    StoreModule.forRoot({
      privileges: privilegeReducer,
      guardPrivileges: privilegeGuardReducer,
      app: appReducer
    }),
    QmsModule,
    MaterialModule,
    DropDownsModule,
    SharedModule
  ],
  exports:[
      StreangthcheckComponent,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:InterceptorsService,multi:true},
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOME_DATE_FORMATS },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}