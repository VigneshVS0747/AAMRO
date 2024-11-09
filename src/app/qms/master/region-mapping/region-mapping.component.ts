import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, debounceTime, map, startWith, switchMap } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-region-mapping',
  templateUrl: './region-mapping.component.html',
  styleUrls: ['./region-mapping.component.css','../../qms.styles.css']
})
export class RegionMappingComponent implements OnInit{

  countryControl = new FormControl('', [Validators.required, this.CountryOptionValidator.bind(this)]);
  filteredCountries: Observable<{ countryId: number, countryName: string,countryCode2L:string,livestatus:any }[]>;
  selectedCountryId: any;
  countries:any;

  regionControl = new FormControl('', [Validators.required, this.RegionOptionValidator.bind(this)]);
  filteredRegions: Observable<{ regionId: number, regionName: string,regionCode:string,livestatus:any }[]>;
  selectedRegionId: any;
  regions:any;

  mappingList:any[]=[];
  pagePrivilege: Array<string>;

  showAddRow: boolean | undefined;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  userId$: any;
  editRow:boolean=false;
  pageSize = 10;
  skip = 0;
  sizes = [10, 20, 50];
  buttonCount = 2
  
  constructor(private router: Router,private store: Store<{ privileges: { privileges: any } }>,private regionService:RegionService,
    private UserIdstore: Store<{ app: AppState }>,private commonService: CommonService,private errorHandler: ApiErrorHandlerService
  ){


    this.filteredRegions = this.regionControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._regionFilter(value))
    );
  }


  ngOnInit(): void {
    this.GetUserId();
    this.getAllRegionMapping();
    this.getAllRegion();
    this.getAllContry();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => this._countryFilter(value))
    );
  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  getAllRegionMapping(){
    this.regionService.getAllRegionMapping().subscribe((res:any)=>{
      this.mappingList = res;
    })
  }
  getAllRegion(){
  this.regionService.getRegions().subscribe(data => {
    this.regions = data;
  });
  }
  getAllContry(){
  this.commonService.getCountries(1).subscribe(data => {
    this.countries = data;
  });
  }
  add(){
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if(!this.showAddRow){
      const newRow = {
        "regionMapId": 0,
        "regionName": "",
        "countryName": "",
        "livestatus": true,
        Isedit: true,
      }
      this.mappingList = [newRow, ...this.mappingList];
      this.showAddRow = true;
      this.editRow = false;
    }

  }


  //Region Dropdown filter 
  private _regionFilter(value: any): Observable<{ regionId: number, regionName: string,regionCode:string,livestatus:any }[]> {
    return this.regionService.getRegions().pipe(
      map(regions => this._regionFilterOptions(value, regions))
    );
  }

  private _regionFilterOptions(value: string, options: { regionId: number, regionName: string,regionCode:string,livestatus:any }[]): { regionId: number, regionName: string,regionCode:string,livestatus:any}[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.regionName.toLowerCase().includes(filterValue));
  }

  // Country filter
  private _countryFilter(value: any): Observable<{ countryId: number, countryName: string,countryCode2L:string,livestatus:any }[]> {
    return this.commonService.getCountries(1).pipe(
      map(countries => this._countryFilterOptions(value, countries))
    );
  }

  private _countryFilterOptions(value: string, options: { countryId: number, countryName: string,countryCode2L:string,livestatus:any }[]): { countryId: number,countryName: string,countryCode2L:string,livestatus:any }[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.countryName.toLowerCase().includes(filterValue));
  }

  validatePastedRegionValue() {
    const pastedValue = this.regionControl?.value;
    const matchingOption = this.regions.find((option:any) => option.regionName === pastedValue);
    if (matchingOption?.regionName) {
      this.SelectedRegion(matchingOption?.regionName);
    }
  }
  SelectedRegion(regionName: any) {
    let val = this.regions.filter((c:any) => c?.regionName?.toLowerCase() === regionName?.toLowerCase());
    this.selectedRegionId = val[0]?.regionId
  }


  validatePastedCountryValue() {
    debugger
    const pastedValue = this.countryControl?.value;
    const matchingOption = this.countries.find((option:any) => option.countryName === pastedValue);
    if (matchingOption?.countryName) {
      this.SelectedCountry(matchingOption?.countryName);
    }
  }
  SelectedCountry(countryName: any) {
    this.countryControl.setValue(countryName, { emitEvent: false });

    let val = this.countries.filter((c:any) => c.countryName?.toLowerCase() === countryName?.toLowerCase());
    this.selectedCountryId = val[0]?.countryId;

    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._countryFilter(value))
    );
    this.countryControl.setValue(countryName)
  }

  oncancel(obj: any) {
    obj.Isedit = false;
    this.getAllRegionMapping();
    this.getAllContry();
    this.showAddRow = false;
    this.editRow = false;
    this.countryControl.reset();
    this.regionControl.reset();
  }

  Edit(obj: any) {
    console.log(obj)
    console.log(obj['countryName']);
    // this.RegionFn(obj);
    //this.CountryFn({ countryName: obj['countryName'] });
     this.countryControl.setValue(obj['countryName']);
     this.regionControl.setValue(obj['regionName']);


    this.mappingList.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = true;
    this.editRow = true;
  }

  Save(obj: any) {
    if (this.countryControl.invalid || this.regionControl.invalid) {
      this.countryControl.markAsTouched();
      this.regionControl.markAsTouched();
      Swal.fire({
        icon: 'info',
        title: 'info',
        text: 'Please fill the mandatory and valid fields',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    } else {
      let payload = {
        regionMapId: obj['regionMapId'],
        //regionId: null,
        regionId: this.selectedRegionId,
        countryId: this.selectedCountryId,
        livestatus: obj['livestatus'],
        createdBy: parseInt(this.userId$),
        createdDate: new Date(),
        updatedBy: 1,
        updatedDate: new Date()
      }
      console.log(payload)
      this.regionService.AddRegionMapping(payload).subscribe((res:any)=>{
        console.log(res)
        if(res['message'] == "Success"){
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added successfully",
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              this.getAllRegionMapping();
              this.showAddRow = false;
              this.editRow = false;
              this.countryControl.reset();
              this.regionControl.reset();
            }
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Region already mapped",
            showConfirmButton: false,
            timer: 2000,
          });
          // this.getAllRegionMapping();
          // this.showAddRow = false;
          // this.editRow = false;
          // this.countryControl.reset();
          // this.regionControl.reset();
        }
      },
        (err: HttpErrorResponse) => {
          let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
          if(stausCode === 500){
            this.errorHandler.handleError(err);
          } else if(stausCode === 400){
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        }
      )
    }   
  }

  Update(obj: any) {
    if (this.countryControl.invalid || this.regionControl.invalid) {
      this.countryControl.markAsTouched();
      this.regionControl.markAsTouched();
      Swal.fire({
        icon: 'info',
        title: 'info',
        text: 'Please fill the mandatory and valid fields',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
     else {


      let region = this.regionControl.value
      this.SelectedRegion(region);

      let country = this.countryControl.value;
      this.SelectedCountry(country);

      let payload = {
        regionMapId: obj['regionMapId'],
        regionId: this.selectedRegionId,
        countryId: this.selectedCountryId,
        livestatus: obj['livestatus'],
        createdBy: parseInt(this.userId$),
        createdDate: new Date(),
        updatedBy: parseInt(this.userId$),
        updatedDate: new Date()
      }
      console.log(payload)
      this.regionService.UpdateRegionMapping(payload).subscribe((res:any)=>{
        console.log(res)
        if(res['message'] == "Success"){
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Updated successfully",
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              this.getAllRegionMapping();
              this.showAddRow = false;
              this.editRow = false;
              this.countryControl.reset();
              this.regionControl.reset();
            }
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Region already mapped",
            showConfirmButton: false,
            timer: 2000,
          });
          // this.getAllRegionMapping();
          // this.showAddRow = false;
          // this.editRow = false;
          // this.countryControl.reset();
          // this.regionControl.reset();
        }
      },
      (err: HttpErrorResponse) => {
        let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
        if(stausCode === 500){
          this.errorHandler.handleError(err);
        } else if(stausCode === 400){
          this.errorHandler.FourHundredErrorHandler(err);
        } else {
          this.errorHandler.commonMsg();
        }
      }
      )
    }  
  }

  Delete(id:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Mapped Region!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.regionService.DeleteRegionMapping(id).subscribe((res:any)=>{
          console.log(res)
          if(res['message'] == 1){
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Deleted successfully",
              showConfirmButton: true,
            }).then((result) => {
              if (result.dismiss !== Swal.DismissReason.timer) {
                this.getAllRegionMapping();
                this.showAddRow = false;
                this.editRow = false;
                this.countryControl.reset();
                this.regionControl.reset();
              }
            });
            this.getAllRegionMapping();
            this.showAddRow = false;
            this.editRow = false;
            this.countryControl.reset();
            this.regionControl.reset();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Something went wrong",
              showConfirmButton: false,
              timer: 2000,
            });
            this.getAllRegionMapping();
            this.showAddRow = false;
            this.editRow = false;
            this.countryControl.reset();
            this.regionControl.reset();
          }
        },
          (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Something went wrong",
              showConfirmButton: false,
              timer: 2000,
            });
            this.getAllRegionMapping();
            this.showAddRow = false;
            this.editRow = false;
            this.countryControl.reset();
            this.regionControl.reset();
          }
        )
      }
    })

  }

  //#region Keyboard tab operation

  /// to provoke csave or update method
  hndlKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
      this.editRow = false;
    }
  }
  /// to reach submit button
  handleChange(event: any, dataItem: any) {
    if (event.key === "Tab" || event.key === "Enter") {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChange(event: any) {
    if (event.key === "Tab") {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.oncancel(dataItem);
    }
  }

  //#endregion

  //#region Validations
  RegionOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.regionName ? control.value?.regionName : control.value;
    var isValid = this.regions?.some((option:any) => option.regionName === value);
    return isValid ? null : { invalidOption: true };
  }
  CountryOptionValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const value = control.value?.countryName ? control.value?.countryName : control.value;
    var isValid = this.countries?.some((option:any) => option.countryName === value);
    return isValid ? null : { invalidOption: true };
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  // RegionFn(data:any):any{
  //   return data && data.regionName;
  // }
  // CountryFn(data:any):any{
  //   debugger
  //   //this.countryControl?.setValue(data.countryName ? data.countryName : data);
  //   //this.regionControl?.setValue(data?.['regionName']);
  //   return data && data.countryName;
    
  // }
}
