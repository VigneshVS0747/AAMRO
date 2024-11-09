import { Component } from "@angular/core";
import { City } from "src/app/Models/ums/city.model";
import { Country } from "src/app/ums/masters/countries/country.model";
import { State } from "src/app/ums/masters/states/state.model";
import { Employee } from "../employee.model";
import { Designation } from "src/app/Models/ums/designation.model";
import { Branch } from "src/app/ums/masters/branch/branch.model";
import { Department } from "src/app/ums/masters/department/department.model";
import { EmployeeService } from "../employee.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { CommonService } from "src/app/services/common.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatOptionSelectionChange } from "@angular/material/core";
import { isEmptyString } from "src/app/ums/ums.util";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";

@Component({
  selector: "app-employee-create",
  templateUrl: "./employee-create.component.html",
  styleUrls: ["./employee-create.component.css", "../../../ums.styles.css"],
})
export class EmployeeCreateComponent {
  Employee!: FormGroup;
  date!: Date | null;
  isInvalidDate: boolean = false;
  maxSignatureLength: number = 50;
  maxAddressLength: number = 50;
  isSubmitted: boolean = false;
  address: string = "";
  signature: string = "";
  title: string = "New Employee";
  doj: Date;
  employeeStatus: boolean = true;
  maxDate: Date;
  Livestatus = 1;

  currentDepartment!: string;
  departments: Department[] = [];
  selectedDepartmentId: number = 0;
  filteredDepartments: any[] = [];

  currentEmployee!: string;
  employees: Employee[] = [];
  selectedReportingTo: number = 0;
  filteredEmployees: any[] = [];

  currentDesignation!: string;
  designations: Designation[] = [];
  selectedDesignationId: number = 0;
  filteredDesignations: any[] = [];

  currentBranch!: string;
  branches: Branch[] = [];
  selectedBranchId: number = 0;
  filteredBranches: any[] = [];

  currentCountry!: string;
  countries: Country[] = [];
  selectedCountryId: number = 0;
  filteredCountries: any[] = [];

  currentState!: string;
  states: State[] = [];
  selectedStateId: number = 0;
  filteredStates: any[] = [];
  disablefields: boolean = false;

  currentCity!: string;
  cities: City[] = [];
  selectedCityId: number = 0;
  filteredCities: any[] = [];

  editedEmployee: Employee | null = null;
  currentPath: string = "";
  isCreatedFlag: boolean = true;
  private employeeId: number = 0;
  userId$:string;

  constructor(
    private employeeService: EmployeeService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private UserIdstore: Store<{ app: AppState }>
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.date = new Date();
    this.GetUserId();
    this.commonService.getDepartments(this.Livestatus).subscribe((result) => {
      this.departments = result;
      this.doFilterDepartment();
    });

    this.commonService.getEmployees(this.Livestatus).subscribe((result) => {
      this.employees = result;
      this.doFilterEmployee();
    });

    this.commonService.getDesignations(this.Livestatus).subscribe((result) => {
      this.designations = result;
      this.doFilterDesignation();
    });

    this.commonService.getBranches(this.Livestatus).subscribe((result) => {
      this.branches = result;
      this.doFilterBranch();
    });

    this.commonService.getCountries(this.Livestatus).subscribe((result) => {
      this.countries = result;
      this.doFilter(1);
    });

    this.currentPath = this.router.url;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      /* Edit */
      if (
        this.currentPath ==
        "/ums/master/employ/edit/" + paramMap.get("employeeId")
      ) {
        this.disablefields = false;
        this.title = "Update Employee";
        this.employeeId = Number(paramMap.get("employeeId"));

        this.isCreatedFlag = false;
        this.employeeService
          .getEmployee(this.employeeId)
          .subscribe((employeeData) => {
            this.editedEmployee = employeeData;

            this.selectedBranchId = this.editedEmployee.branchId;
            this.currentBranch = this.editedEmployee.branchName;

            this.selectedDepartmentId = this.editedEmployee.departmentId;
            this.currentDepartment = this.editedEmployee.departmentName;

            this.selectedDesignationId = this.editedEmployee.designationId;
            this.currentDesignation = this.editedEmployee.designationName;

            this.selectedReportingTo = this.editedEmployee.reportingTo;
            this.currentEmployee = this.editedEmployee.reportingName;

            this.selectedCountryId = this.editedEmployee.countryId;
            this.currentCountry = this.editedEmployee.countryName;

            this.commonService
              .getStatesForSelectedCountry(this.selectedCountryId)
              .subscribe((result) => {
                this.states = result;
              });
            this.selectedStateId = this.editedEmployee.stateId;
            this.currentState = this.editedEmployee.stateName;

            this.commonService
              .getCityForSelectedState(this.selectedStateId)
              .subscribe((result) => {
                this.cities = result;
              });
            this.selectedCityId = this.editedEmployee.cityId;
            this.currentCity = this.editedEmployee.cityName;

            this.employeeStatus = this.editedEmployee.livestatus ? true : false;
            this.address = this.editedEmployee.address;
            this.signature = this.editedEmployee.empSignature;
            this.date = this.editedEmployee.doj;
          });
      } else {
        /* Add */
        this.disablefields = false;
        this.employeeStatus = true;
        this.isCreatedFlag = true;
        this.employeeId = 0;
      }
    });

    /*View*/
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (
        this.currentPath ==
        "/ums/master/employ/view/" + paramMap.get("employeeId")
      ) {
        this.disablefields = true;
        this.title = "View Employee";
        this.employeeId = Number(paramMap.get("employeeId"));

        this.isCreatedFlag = false;
        this.employeeService
          .getEmployee(this.employeeId)
          .subscribe((employeeData) => {
            this.editedEmployee = employeeData;

            this.selectedBranchId = this.editedEmployee.branchId;
            this.currentBranch = this.editedEmployee.branchName;

            this.selectedDepartmentId = this.editedEmployee.departmentId;
            this.currentDepartment = this.editedEmployee.departmentName;

            this.selectedDesignationId = this.editedEmployee.designationId;
            this.currentDesignation = this.editedEmployee.designationName;

            this.selectedReportingTo = this.editedEmployee.reportingTo;
            this.currentEmployee = this.editedEmployee.reportingName;

            this.selectedCountryId = this.editedEmployee.countryId;
            this.currentCountry = this.editedEmployee.countryName;

            this.commonService
              .getStatesForSelectedCountry(this.selectedCountryId)
              .subscribe((result) => {
                this.states = result;
              });
            this.selectedStateId = this.editedEmployee.stateId;
            this.currentState = this.editedEmployee.stateName;

            this.commonService
              .getCityForSelectedState(this.selectedStateId)
              .subscribe((result) => {
                this.cities = result;
              });
            this.selectedCityId = this.editedEmployee.cityId;
            this.currentCity = this.editedEmployee.cityName;

            this.employeeStatus = this.editedEmployee.livestatus ? true : false;
            this.address = this.editedEmployee.address;
            this.signature = this.editedEmployee.empSignature;
            this.date = this.editedEmployee.doj;
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
    this.employeeStatus = $event.checked;
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value;
    if (event.value === null) {
      this.isInvalidDate = true;
    } else {
      this.isInvalidDate = false;
    }
  }

  customEmailValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    if (!control.value || !emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  doFilterDepartment() {
    // Check if the entered value exists in the list of departments

    const filtered = this.departments.filter(
      (department) =>
        this.currentDepartment &&
        department.departmentName
          .toLowerCase()
          .includes(this.currentDepartment.toLowerCase())
    );
    if (filtered.length === 0) {
      this.currentDepartment = "";
    }

    if (filtered.length > 0) {
      this.filteredDepartments = filtered;
    } else {
      this.selectedDepartmentId = 0;

      if (this.currentDepartment) {
        // Invalid country name

        this.filteredDepartments = [
          { departmentName: "Not found", departmentId: 0, isNotFound: true },
        ];
        this.currentDepartment="";
      } else {
        //All country list if no input
        this.filteredDepartments = this.departments;
      }
    }
  }

  doFilterEmployee() {
    // Check if the entered value exists in the list of Employees

    const filtered = this.employees.filter(
      (employee) =>
        this.currentEmployee &&
        employee.employeeName
          .toLowerCase()
          .includes(this.currentEmployee.toLowerCase())
    );

    if (filtered.length > 0) {
      this.filteredEmployees = filtered;
    } else {
      this.selectedReportingTo = 0;

      if (this.currentEmployee) {
        // Invalid country name
        this.currentEmployee="";
        this.filteredEmployees = [
          { employeeName: "Not found", employeeId: 0, isNotFound: true },
        ];
      } else {
        //All country list if no input

        this.filteredEmployees = this.employees;
      }
    }
  }

  doFilterDesignation() {
    // Check if the entered value exists in the list of designations

    const filtered = this.designations.filter(
      (designation) =>
        this.currentDesignation &&
        designation.designationName
          .toLowerCase()
          .includes(this.currentDesignation.toLowerCase())
    );

    if (filtered.length > 0) {
      this.filteredDesignations = filtered;
    } else {
      this.selectedReportingTo = 0;

      if (this.currentDesignation) {
        // Invalid Designation name
       
        this.filteredDesignations = [
          { designationName: "Not found", designationId: 0, isNotFound: true },
        ];
        this.currentDesignation="";
        return;
      } else {
        //All designation list if no input
        this.filteredDesignations = this.designations;
      }
    }
  }

  doFilterBranch() {
    // Check if the entered value exists in the list of branchs

    const filtered = this.branches.filter(
      (branch) =>
        this.currentBranch &&
        branch.branchName
          .toLowerCase()
          .includes(this.currentBranch.toLowerCase())
    );

    if (filtered.length > 0) {
      this.filteredBranches = filtered;
    } else {
      this.selectedBranchId = 0;

      if (this.currentBranch) {
        // Invalid branch name

        this.filteredBranches = [
          { branchName: "Not found", branchId: 0, isNotFound: true },
        ];
      } else {
        //All branch list if no input
        this.filteredBranches = this.branches;
      }
    }
  }

  onDepartmentSelected(
    event: MatOptionSelectionChange,
    department: Department
  ) {
    if (event.isUserInput) {
      this.selectedDepartmentId = department.departmentId;
    }
  }

  onEmployeeSelected(event: MatOptionSelectionChange, employee: Employee) {
    if (event.isUserInput) {
      this.selectedReportingTo = employee.employeeId;
    }
  }

  onDesignationSelected(
    event: MatOptionSelectionChange,
    designation: Designation
  ) {
    if (event.isUserInput) {
      this.selectedDesignationId = designation.designationId;
    }
  }

  onBranchSelected(event: MatOptionSelectionChange, branch: Branch) {
    if (event.isUserInput) {
      this.selectedBranchId = branch.branchId;
      this.selectedCountryId = branch.countryId;
      this.selectedStateId = branch.stateId;
      this.selectedCityId = branch.cityId;
      this.currentCountry = branch.countryName;
      this.currentState = branch.stateName;
      this.currentCity = branch.cityName;

      this.commonService
        .getStatesForSelectedCountry(this.selectedCountryId)
        .subscribe((result) => {
          this.states = result;
        });
    }
    this.commonService
        .getCityForSelectedState(this.selectedStateId)
        .subscribe((result) => {
          this.cities = result;
        });
  }

  doFilter(value: number) {
    // Check if the entered value exists in the list of countries
    if (value === 1) {
      const filtered = this.countries.filter(
        (country) =>
          this.currentCountry &&
          country.countryName
            .toLowerCase()
            .includes(this.currentCountry.toLowerCase())
      );

      if (filtered.length > 0) {
        this.filteredCountries = filtered;
      } else {
        this.selectedCountryId = 0;

        if (this.currentCountry) {
          // Invalid country name

          this.filteredCountries = [
            { countryName: "Not found", countryId: 0, isNotFound: true },
          ];
        } else {
          //All country list if no input
          this.filteredCountries = this.countries;
        }
      }
    } else if (value === 2) {
      // Check if the entered value exists in the list of states
      const filtered = this.states.filter(
        (state) =>
          this.currentState &&
          state.stateName
            .toLowerCase()
            .includes(this.currentState.toLowerCase())
      );

      if (filtered.length > 0) {
        this.filteredStates = filtered;
      } else {
        this.selectedStateId = 0;

        if (this.currentState) {
          // Invalid state name

          this.filteredStates = [
            { stateName: "Not found", stateId: 0, isNotFound: true },
          ];
        } //All state list if no input
        else {
          this.filteredStates = this.states;
        }
      }
    } else if (value === 3) {
      // Check if the entered value exists in the list of cities
      const filtered = this.cities.filter(
        (city) =>
          this.currentCity &&
          city.cityName.toLowerCase().includes(this.currentCity.toLowerCase())
      );

      if (filtered.length > 0) {
        this.filteredCities = filtered;
      } else {
        this.selectedCityId = 0;

        if (this.currentCity) {
          // Invalid state name

          this.filteredCities = [
            { cityName: "Not found", cityId: 0, isNotFound: true },
          ];
        } //All city list if no input
        else {
          this.filteredCities = this.cities;
        }
      }
    }
  }

  onCountrySelected(event: MatOptionSelectionChange, country: Country) {
    if (event.isUserInput) {
      this.selectedCountryId = country.countryId;
      this.commonService
        .getStatesForSelectedCountry(this.selectedCountryId)
        .subscribe((result) => {
          this.states = result;
        });
      //Reset the values
      this.selectedStateId = 0;
      this.currentState = "";
      this.filteredStates = [];
    }
  }

  onStateSelected(event: MatOptionSelectionChange, state: State) {
    if (event.isUserInput) {
      this.selectedStateId = state.stateId;
      this.commonService
        .getCityForSelectedState(this.selectedStateId)
        .subscribe((result) => {
          this.cities = result;
        });
      //Reset the values
      this.selectedCityId = 0;
      this.currentCity = "";
      this.filteredCities = [];
    }
  }

  onCitySelected(event: MatOptionSelectionChange, city: City) {
    if (event.isUserInput) {
      this.selectedCityId = city.cityId;
    }
  }

  onSaveEmployee(form: NgForm) {
    this.isSubmitted = true;
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

    //Custom logic for Country
    if (
      this.selectedCountryId == 0 ||
      this.countries.filter(
        (country) =>
          country.countryName.toLowerCase() ===
          this.currentCountry.toLocaleLowerCase()
      ).length === 0
    ) {
      this.currentCountry="";
      return;
    }
    //Custom logic for state
    if (
      this.selectedStateId === 0 ||
      this.states.filter(
        (state) =>
          state.stateName.toLowerCase() ===
          this.currentState.toLocaleLowerCase()
      ).length === 0
    ) {
      this.currentState="";
      return;
    }

    //Custom logic for City
    if (
      this.selectedCityId == 0 ||
      this.cities.filter(
        (city) =>
          city.cityName.toLowerCase() === this.currentCity.toLocaleLowerCase()
      ).length === 0
    ) {
      this.currentCity;
      return;
    }

    const selectedDate = this.date;
    // const utcDate = new Date(Date.UTC(selectedDate!.getFullYear(), selectedDate!.getMonth(), selectedDate!.getDate()));
    // this.date = utcDate;

    //Getting user input values from Form
    const formData = form.value;

    //Custom logic required field
    if (isEmptyString(formData.employeeCode) || isEmptyString(formData.employeeName)) {
      return;
    }

    //  const offset = new Date().getTimezoneOffset();
    //  const adjustedDate = new Date(formData.date.getTime() - (offset * 60 * 1000));

    //#region Update DOJ w.r.to the datatype
    let a = typeof (this.date)
    let adjustedDate: Date
    if (a.toString() === 'object') {
      const offset = new Date().getTimezoneOffset();
      adjustedDate = new Date(formData.date.getTime() - (offset * 60 * 1000));
      formData.effectiveYear = (adjustedDate);
    }
    if (a != 'object') {
      formData.effectiveYear = this.date;
    }
    //#endregion

    const employee: Employee = {
      employeeId: 0,
      employeeCode: formData.employeeCode.trim(),  //trim is necessary that it will remove the leading and trailing whitespaces
      employeeName: formData.employeeName.trim(),
      departmentId: this.selectedDepartmentId,
      departmentName: "",
      reportingTo: this.selectedReportingTo,
      reportingName: "",
      designationId: this.selectedDesignationId,
      designationName: "",
      branchId: this.selectedBranchId,
      branchName: "",
      cityId: this.selectedCityId,
      cityName: "",
      stateId: this.selectedStateId,
      stateName: "",
      countryId: this.selectedCountryId,
      countryName: "",
      email: formData.email,
      contactNumber: formData.contactNumber,
      doj: formData.effectiveYear,
      address: this.address,
      empSignature: this.signature,
      livestatus: this.employeeStatus ? true : false,
      createdBy: parseInt(this.userId$),
      createdDate: new Date(),
      updatedBy: parseInt(this.userId$),
      updatedDate: new Date(),
    };
    console.log(employee);

    /* Add */
    if (this.isCreatedFlag) {
      this.employeeService.addEmployee(employee).subscribe(
        (res) => {
          if(res.message == 'SUCCESS'){
            form.resetForm();
            this.initializeControls();
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Added Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.returnToList();
          }
        },(error) => {
          if(error.error.message == 'DUPLICATE'){
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Employee Already Exist",
              showConfirmButton: false,
              timer: 2000,
            });
          }else{
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Some Other Error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
        
      );
    } else {
      /* Update */
      employee.employeeId = this.employeeId;
      employee.updatedBy = parseInt(this.userId$)
      this.employeeService.updateEmployee(employee).subscribe(
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
          
          if (error.error.message == 'DUPLICATE') {
            Swal.fire({
              icon: "error",
              title: "error",
              text: "Employee already Exist.",
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
    if (this.currentPath.includes("/ums/master/employ")) {
      this.router.navigate(["/ums/master/employ"]);
    }
  }

  initializeControls() {
    this.employeeStatus = true;
    this.isSubmitted = false;
    this.isInvalidDate = false;
    this.date = this.maxDate;
  }

  resetButtonClickforSave(form: NgForm) {
    form.resetForm();
    this.initializeControls();
    //window.location.reload();
  }
  resetButtonClick() {
    this.editedEmployee = {
      employeeId: 0,
      employeeCode: '',
      employeeName: '',
      departmentId: 0,
      departmentName: '',
      reportingTo: 0,
      reportingName: '',
      designationId: 0,
      designationName: '',
      branchId: 0,
      branchName: '',
      cityId: 0,
      cityName: '',
      stateId: 0,
      stateName: '',
      countryId: 0,
      countryName: '',
      email: '',
      contactNumber: '',
      doj: this.maxDate,
      address: '',
      empSignature: '',
      livestatus: true,
      createdBy: 0,
      createdDate: '',
      updatedBy: null,
      updatedDate: '',
    }
    this.employeeService
      .getEmployee(this.employeeId)
      .subscribe((employeeData) => {
        this.editedEmployee = employeeData;

        this.selectedBranchId = this.editedEmployee.branchId;
        this.currentBranch = this.editedEmployee.branchName;

        this.selectedDepartmentId = this.editedEmployee.departmentId;
        this.currentDepartment = this.editedEmployee.departmentName;

        this.selectedDesignationId = this.editedEmployee.designationId;
        this.currentDesignation = this.editedEmployee.designationName;

        this.selectedReportingTo = this.editedEmployee.reportingTo;
        this.currentEmployee = this.editedEmployee.reportingName;

        this.selectedCountryId = this.editedEmployee.countryId;
        this.currentCountry = this.editedEmployee.countryName;

        this.commonService
          .getStatesForSelectedCountry(this.selectedCountryId)
          .subscribe((result) => {
            this.states = result;
          });
        this.selectedStateId = this.editedEmployee.stateId;
        this.currentState = this.editedEmployee.stateName;

        this.commonService
          .getCityForSelectedState(this.selectedStateId)
          .subscribe((result) => {
            this.cities = result;
          });
        this.selectedCityId = this.editedEmployee.cityId;
        this.currentCity = this.editedEmployee.cityName;

        this.employeeStatus = this.editedEmployee.livestatus ? true : false;
        this.address = this.editedEmployee.address;
        this.signature = this.editedEmployee.empSignature;
        this.date = this.editedEmployee.doj;
      });
  }
  returnToList() {
    this.router.navigate(["/ums/master/employ"]);
  }
  //#region phone number validation
  onKeydown($event: any) {
    // filter away which is not numbers,apace, hyphen,+
    let unallowableValues: Array<string | number> = ['~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '_', '|', '{', '}', '[', ']', ';', ':', '<', '>', ',', '.', 222, 191, 220];
    unallowableValues.forEach((data: any) => {
      if (($event.keyCode == data) || ($event.key == data)) {
        $event.preventDefault();
      }
    })
    if (($event.keyCode >= 65 && $event.keyCode <= 90) || ($event.keyCode == 187 && $event.key != '+')) {
      $event.preventDefault();
    }
  }
  //#endregion 
}
