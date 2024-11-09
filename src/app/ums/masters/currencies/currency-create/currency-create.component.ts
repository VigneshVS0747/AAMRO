import { Component } from "@angular/core";
import { Currency } from "../currency.model";
import { CurrenciesService } from "../currencies.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { NgForm } from "@angular/forms";
import { isEmptyString } from "src/app/ums/ums.util";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";

@Component({
  selector: "app-currency-create",
  templateUrl: "./currency-create.component.html",
  styleUrls: ["./currency-create.component.css", "../../../ums.styles.css"],
})
export class CurrencyCreateComponent {
  title: string = "New Currency";
  isLocal: boolean = false;
  currencyStatus: boolean = true;
  ShowError: boolean = false;
  disablefields: boolean = false;

  editedCurrency: Currency | null = null;
  currentPath: string = "";
  isCreatedFlag: boolean = true; // Whether it is in Add or Edit
  private currencyId: number = 0;
  userId$:string;

  constructor(
    private currenciesService: CurrenciesService,
    private router: Router,
    private notificationService: NotificationService,
    public route: ActivatedRoute,
    private UserIdstore: Store<{ app: AppState }>
  ) {}

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.GetUserId();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      /* Edit */
      if (
        this.currentPath ==
        "/ums/master/currencies/edit/" + paramMap.get("currencyId")
      ) {
        this.disablefields = false;
        this.title = "Update Currency";
        this.currencyId = Number(paramMap.get("currencyId"));
        this.isCreatedFlag = false;
        this.currenciesService
          .getCurrency(this.currencyId)
          .subscribe((currencyData) => {
            this.editedCurrency = {
              currencyId: currencyData.currencyId,
              currencyCode: currencyData.currencyCode,
              currencyName: currencyData.currencyName,
              currencySymbol: currencyData.currencySymbol,
              denominationMain: currencyData.denominationMain,
              denominationSub: currencyData.denominationSub,
              livestatus: currencyData.livestatus,
              companyCurrency: false,
              createdBy: currencyData.createdBy,
              createdDate: currencyData.createdDate,
              updatedBy: currencyData.updatedBy,
              updatedDate: currencyData.updatedDate,
            };

            this.currencyStatus = this.editedCurrency.livestatus ? true : false;
          });
      } else {
        /* Add */
        this.disablefields = false;
        this.currencyStatus = true;
        this.isCreatedFlag = true;
        this.currencyId = 0;
      }
    });
    /*View*/
    this.currentPath = this.router.url;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (
        this.currentPath ==
        "/ums/master/currencies/view/" + paramMap.get("currencyId")
      ) {
        this.disablefields = true;
        this.title = "View Currency";
        this.currencyId = Number(paramMap.get("currencyId"));
        this.isCreatedFlag = false;
        this.currenciesService
          .getCurrency(this.currencyId)
          .subscribe((currencyData) => {
            this.editedCurrency = {
              currencyId: currencyData.currencyId,
              currencyCode: currencyData.currencyCode,
              currencyName: currencyData.currencyName,
              currencySymbol: currencyData.currencySymbol,
              denominationMain: currencyData.denominationMain,
              denominationSub: currencyData.denominationSub,
              livestatus: currencyData.livestatus,
              companyCurrency: false,
              createdBy: currencyData.createdBy,
              createdDate: currencyData.createdDate,
              updatedBy: currencyData.updatedBy,
              updatedDate: currencyData.updatedDate,
            };
            this.currencyStatus = this.editedCurrency.livestatus ? true : false;
          });
      }
    });
  }

  GetUserId(){
    
    this.UserIdstore.select("app").subscribe({
      next:(res)=>{
       this.userId$=res.userId;
      }
    });
  }

  valueChange($event: any) {
    //set the two-way binding here
    this.currencyStatus = $event.checked;
  }

  onSaveCurrency(form: NgForm) {
    this.ShowError = true;
    if (form.invalid) {
      form.form.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    //Getting user input values from Form
    const formData = form.value;
    //Custom logic required field
    if (
      isEmptyString(formData.currencyCode) ||
      isEmptyString(formData.currencyName) ||
      isEmptyString(formData.currencySymbol) ||
      isEmptyString(formData.mainDenomination) ||
      isEmptyString(formData.subDenomination)
    ) {
      return;
    }

    const currency: Currency = {
      currencyId: 0, // 0 for Add >0 for update
      currencyCode: formData.currencyCode.trim(), //trim is necessary that it will remove the leading and trailing whitespaces
      currencyName: formData.currencyName.trim(),
      currencySymbol: formData.currencySymbol.trim(),
      denominationMain: formData.mainDenomination.trim(),
      denominationSub: formData.subDenomination.trim(),
      livestatus: this.currencyStatus ? true : false,
      companyCurrency: false,
      createdBy: parseInt(this.userId$),
      createdDate: new Date(),
      updatedBy: parseInt(this.userId$),
      updatedDate: new Date(),
    };

    if (this.isCreatedFlag) {
      /* Add */

      this.currenciesService.addCurrency(currency).subscribe(
        (res) => {
          form.resetForm();
          this.initializeControls();
          this.resetNavigation();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.returnToList();
        },
        (error) => {
          if (error.error.message == 'DUPLICATE') {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Currency already exists!",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      );
    } else {
      /* Update */
      currency.currencyId = this.currencyId;
      currency.updatedBy = parseInt(this.userId$)

      this.currenciesService.updateCurrency(currency).subscribe(
        (res) => {
          form.resetForm();
          this.initializeControls();
          this.resetNavigation();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Updated Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.returnToList();
        },
        (error) => {
          
          if (error.error.ErrorDetails.includes('UNIQUE KEY')) {
            Swal.fire({
              icon: "error",
              title: "error",
              text: "Currency already Exist.",
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: JSON.stringify(error.error.ErrorDetails),
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      );
    }
  }

  resetNavigation() {
    if (this.currentPath.includes("/ums/currency")) {
      this.router.navigate(["/ums/currencies"]);
    }
  }

  initializeControls() {
    this.currencyStatus = true;
  }
  resetButtonClickforSave(form: NgForm) {
    form.resetForm();
    this.initializeControls();
  }
  resetButtonClick() {
    this.editedCurrency = {
      currencyId: 0,
      currencyCode: "",
      currencyName: "",
      currencySymbol: "",
      denominationMain: "",
      denominationSub: "",
      livestatus: true,
      companyCurrency: false,
      createdBy: 0,
      createdDate: "",
      updatedBy: 0,
      updatedDate: "",
    };
    this.currenciesService
      .getCurrency(this.currencyId)
      .subscribe((currencyData) => {
        this.editedCurrency = {
          currencyId: currencyData.currencyId,
          currencyCode: currencyData.currencyCode,
          currencyName: currencyData.currencyName,
          currencySymbol: currencyData.currencySymbol,
          denominationMain: currencyData.denominationMain,
          denominationSub: currencyData.denominationSub,
          livestatus: currencyData.livestatus,
          companyCurrency: false,
          createdBy: currencyData.createdBy,
          createdDate: currencyData.createdDate,
          updatedBy: currencyData.updatedBy,
          updatedDate: currencyData.updatedDate,
        };

        this.currencyStatus = this.editedCurrency.livestatus ? true : false;
      });
  }

  returnToList() {
    this.router.navigate(["/ums/master/currencies"]);
  }
}
