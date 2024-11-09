import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrandDialogComponent } from '../brand-dialog/brand-dialog.component';
import { BrandDetails } from 'src/app/Models/crm/master/brandDetails';
import { ImageDetails } from 'src/app/Models/crm/master/imagedetails';
import { PartmasterService } from '../partmaster.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { CommonService } from 'src/app/services/common.service';
import { PartMaster, PartMasterContainer } from 'src/app/Models/crm/master/partmaster';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { StoragetypeService } from '../../StorageType/storagetype.service';
import { StorageType } from 'src/app/Models/crm/master/storagetype';
import { AuthorizationitemService } from 'src/app/services/ums/authorizationitem.service';
import { Brand } from 'src/app/Models/ums/brand.modal';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { map, Observable, startWith } from 'rxjs';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';


@Component({
  selector: 'app-partmaster',
  templateUrl: './partmaster.component.html',
  styleUrls: ['./partmaster.component.css', '../../../../ums/ums.styles.css']
})
export class PartmasterComponent implements OnInit {
  Part!: FormGroup;
  Image!: FormGroup;
  Date = new Date();
  rows: any[] = []; // Array to hold your rows
  BrandDetailsArray: BrandDetails[] = [];
  ImageDetailsArray: any[] = [];
  ImageDataArray: ImageDetails[] = [];
  StorageMaster: StorageType[] = [];
  UOM: any[] = [];
  titile: string;
  disablefields: boolean = false;
  showbutton: boolean;
  ShowUpdate: boolean;
  Showsave: boolean;
  ShowReset: boolean;
  path = environment.Fileretrive;
  Livestatus = 1;
  checkedIndex: number = -1; // Initialize as -1 to indicate none is checked

  imageform: ImageDetails = {
    livestatus: true,
    createdBy: 0,
    createdDate: '',
    updatedBy: 0,
    updatedDate: '',
    message: '',
    partImageId: 0,
    imageName: '',
    defaultImage: false,
    selected: false
  }
  image: any[] = [];
  imagePath: any[] = [];
  ImageStore: any[] = [];
  brand: Brand[] = [];
  partmasterobj: PartMaster = new PartMaster();
  userId$: string;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  hasDefaultImage: boolean;
  edit: boolean;
  Livestaus = 1;
  CountryDatalist: Country[];
  filteredCountryOptions$: Observable<any[]>;
  countryId: any;
  selectedIndex = 0;

  constructor(private FB: FormBuilder,
    public dialog: MatDialog,
    private service: PartmasterService,
    private Fs: FileuploadService,
    private Brandservice: AuthorizationitemService,
    private ErrorHandling: ErrorhandlingService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private UserIdstore: Store<{ app: AppState }>,
    private StorageService: StoragetypeService,
    private http: HttpClient,
    private errorHandler: ApiErrorHandlerService
  ) {

  }
  ngOnInit(): void {
    this.GetUserId();
    this.titile = "Add Part";
    this.IntializeForm();
    this.getCountryMasterListdata();
    this.EditMode();
    this.ViewMode();
    this.GetStorageMaster();
    this.GetUOM();
    this.GetBrand();
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  EditMode() {
    var Path1 = this.router.url;
    if (Path1 == "/crm/master/part/edit/" + this.route.snapshot.params["id"]) {
      this.titile = "Edit Part";
      this.disablefields = false;
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
      this.edit = true;

      this.service
        .GetAllPartMasterById(this.route.snapshot.params["id"])
        .subscribe((result: PartMasterContainer) => {

          console.log("result", result)

          this.partmasterobj = result.partMaster;
          this.Part.controls['countryId'].setValue(result.partMaster);
          console.log("this.partmasterobj", this.partmasterobj)
          this.countryId = this.partmasterobj.countryId;

          this.Part.patchValue({
            partId: this.partmasterobj.partId,
            partNumber: this.partmasterobj.partNumber,
            partName: this.partmasterobj.partName,
            modelNumber: this.partmasterobj.modelNumber,

            partDescription: this.partmasterobj.partDescription,
            livestatus: this.partmasterobj.livestatus,
            createdBy: this.partmasterobj.createdBy,
            createdDate: this.partmasterobj.createdDate,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.Date
          });
          this.BrandDetailsArray = result.brandDetails;
          this.ImageDataArray = result.imageDetails;

          this.ImageDataArray.forEach((row => {
            this.ImageStore.push(row.imageName);
          }));

        });
    }
  }

  ViewMode() {
    var Path1 = this.router.url;
    if (Path1 == "/crm/master/part/view/" + this.route.snapshot.params["id"]) {
      this.titile = "View Part";
      this.disablefields = true;
      this.ShowUpdate = false;
      this.Showsave = false;
      this.ShowReset = false;

      this.service
        .GetAllPartMasterById(this.route.snapshot.params["id"])
        .subscribe((result: PartMasterContainer) => {

          console.log("result", result)

          this.partmasterobj = result.partMaster;

          console.log("this.partmasterobj", this.partmasterobj)
          this.Part.controls['countryId'].setValue(result.partMaster);
          this.countryId = this.partmasterobj.countryId;

          this.Part.patchValue({
            partId: this.partmasterobj.partId,
            partNumber: this.partmasterobj.partNumber,
            partName: this.partmasterobj.partName,
            modelNumber: this.partmasterobj.modelNumber,

            partDescription: this.partmasterobj.partDescription,
            livestatus: this.partmasterobj.livestatus,
            createdBy: this.partmasterobj.createdBy,
            createdDate: this.partmasterobj.createdDate,
            updatedBy: this.partmasterobj.updatedBy,
            updatedDate: this.Date
          });
          this.BrandDetailsArray = result.brandDetails;
          this.ImageDataArray = result.imageDetails;

          this.ImageDataArray.forEach((row => {
            this.ImageStore.push(row.imageName);
          }));

        });
    }
  }

  IntializeForm() {
    this.Part = this.FB.group({
      partId: [0],
      partNumber: ["", [Validators.required]],
      partName: ["", Validators.required],
      modelNumber: [null],
      countryId: [null],
      partDescription: [null],
      livestatus: [true, Validators.required],
      createdBy: [parseInt(this.userId$), Validators.required],
      createdDate: [this.Date, Validators.required],
      updatedBy: [parseInt(this.userId$), Validators.required],
      updatedDate: [this.Date, Validators.required],
    });
  }
  //#region country autocomplete
  getCountryMasterListdata() {
    this.commonService.getCountries(this.Livestaus).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.Part.controls['countryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this.filterCountryFunType(name) : this.CountryDatalist?.slice()))
    );
  }
  private filterCountryFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CountryDatalist.filter((option: any) => option.countryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoData();
  }
  NoData(): any {
    this.Part.controls['countryId'].setValue('');
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.countryId = selectedCountry.countryId;
  }
  CEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.countryId = null;
    }
  }
  //#endregion

  openDialog() {
    //const dialogRef = this.dialog.open(BrandDialogComponent);

    const dialogRef = this.dialog.open(BrandDialogComponent, {
      data: {
        Dataarray: this.BrandDetailsArray
      }, disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null) {
        this.BrandDetailsArray.push(result);
      }
    });
  }

  GetUOM() {
    this.service.GetAllUOM().subscribe({
      next: (res) => {
        this.UOM = res;
        console.log("LineItemMaster==>", res);
      },
      error: (error) => {
        console.log("error==>", error);
      },
    });
  }

  GetBrand() {
    this.Brandservice.Getbrand().subscribe({
      next: (res) => {
        this.brand = res;
        console.log("LineItemMaster==>", res);
      },
      error: (error) => {
        console.log("error==>", error);
      },
    });
  }
  selectFile(evt: any) {
    if (evt?.target?.files && evt.target.files.length > 0) {
      const files = evt.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

        // Check if the file type is allowed (jpg or png)
        if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg' || fileType === 'jfif') {
          // Check if the image already exists, then update it
          const existingIndex = this.ImageDetailsArray.findIndex(img => img.name.toLowerCase() === fileName);
          if (existingIndex !== -1) {
            // If the image already exists, update it
            this.ImageDetailsArray[existingIndex] = file;

          } else {
            // If the image doesn't exist, add it to the array
            this.ImageDetailsArray.push(file);


            this.addRow();
          }
        } else {
          // Handle unsupported file types
          this.commonService.displayToaster(
            "error",
            "error",
            "Please Choose JPG & PNG & JPEG & JFIF Files."
          );
        }

      }

    }
  }
  downloadImage(event: any) {
    this.Fs.DownloadFile(event).subscribe(response => {
      saveAs(response, event);
    });
  }
  downloadMultipleImage() {
    const selectedImages = this.ImageDataArray.filter(image => image.selected == true);
    selectedImages.forEach(((item: any) => {
      const image = item.imageName;
      this.Fs.DownloadFile(image).subscribe(response => {
        saveAs(response, image);
      });
    }));

  }
  addRow() {
    if (this.ImageDetailsArray.length > 0) {
      for (let imageDetail of this.ImageDetailsArray) {
        // Rename the 'name' property to 'imagePath'
        const imageName = imageDetail.name;

        // Check if the object with the same 'imagePath' already exists in ImageDataArray
        const existingImageData = this.ImageDataArray.find(data => data.imageName === imageName);

        // If the object doesn't exist, add it to ImageDataArray
        if (!existingImageData) {
          // Create a new object with the modified property name
          const modifiedImageDetail = { ...imageDetail, imageName };

          const Value: ImageDetails = {
            ...modifiedImageDetail,
            livestatus: true,
            defaultImage: false,
            selected: false
          }
          // Push the modified object into ImageDataArray
          this.ImageDataArray.push(Value);
          console.log("this.ImageDataArray", this.ImageDataArray);

        }

      }
      if (this.ImageStore.length > 0) {
        //this.image=[];
        this.ImageDataArray.forEach(item => {
          if (!this.ImageStore.includes(item.imageName)) {

            const ImageDetails = {
              ...this.imageform,
              imageName: item.imageName
            }
            this.image.push(ImageDetails);
          }
        });
      } else {
        //this.image=[];
        this.ImageDataArray.forEach(item => {
          const ImageDetails = {
            ...this.imageform,
            imageName: item.imageName
          }
          this.image.push(ImageDetails);
        });
      }
    } else {
      this.commonService.displayToaster(
        "error",
        "error",
        "Please Choose Files."
      );
    }

  }

  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.Part.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(this.capitalizeWords(this.toUpperCaseAndTrimId(name)));
      }
    }
    return invalidControls;
  }

  toUpperCaseAndTrimId(name: string): string {
    if (name.endsWith('Id')) {
      name = name.slice(0, -2);
    }
    return name;
  }
  capitalizeWords(name: string): string {
    const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  SavePartMaster() {
    if (this.Part.valid) {

      const PastMasterContainer: PartMasterContainer = {
        partMaster: this.Part.value,
        brandDetails: this.BrandDetailsArray,
        imageDetails: this.ImageDataArray,
        message: ''
      }
      PastMasterContainer.partMaster.countryId = this.countryId

      this.service
        .CreateLineItemMaster(PastMasterContainer).subscribe({
          next: (res) => {
            const formData = new FormData();
            this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
            this.Fs.FileUpload(formData).subscribe({
              next: (res) => {

              },
              error: (error) => {

              }
            });
            if (!this.edit) {
              const partId = res.message
              this.commonService.displayToaster(
                "success",
                "Success",
                "Added Sucessfully."
              );
              this.router.navigate(["/crm/master/partlist"]);
              // const formData = new FormData();
              // const id = 1;
              // formData.append('id', partId); // Append the id here
              // this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
              // this.service.UploadImage(formData).subscribe({
              //   next: (res) => {
              //     this.commonService.displayToaster(
              //       "success",
              //       "Success",
              //       "Added Sucessfully"
              //     );
              //     this.router.navigate(["/crm/master/partlist"]);
              //   },
              //   error: (error) => {
              //     var ErrorHandle = this.ErrorHandling.handleApiError(error)
              //     this.commonService.displayToaster(
              //       "error",
              //       "Error",
              //       ErrorHandle
              //     );
              //   }
              // });
            } else {
              this.commonService.displayToaster(
                "success",
                "Success",
                "Updated Sucessfully."
              );
              this.router.navigate(["/crm/master/partlist"]);
            }
          },
          error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if(stausCode === 500){
              this.errorHandler.handleError(err);
            } else if(stausCode === 400){
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          },
        });
    } else {
      const invalidControls = this.findInvalidControls();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
      this.changeTab(0);
      this.Part.markAllAsTouched();
      this.validateall(this.Part);
    }

  }
  toggleCheckbox(index: number) {
    this.ImageDataArray.forEach((row, i) => {
      if (i !== index) {
        row.defaultImage = false;
      }
    });
  }
  Edit(Data: any, i: number) {

    this.BrandDetailsArray.splice(i, 1);
    const dialogRef = this.dialog.open(BrandDialogComponent, {
      data: {
        BrandData: Data,
        mode: 'Edit',
        Dataarray: this.BrandDetailsArray,
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.BrandDetailsArray.splice(
          i,
          0,
          result
        );
      }
    });
  }

  View(Data: any, i: number) {
    const dialogRef = this.dialog.open(BrandDialogComponent, {
      data: {
        BrandData: Data,
        mode: 'view',
      }, disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.BrandDetailsArray.splice(i, 1);
        this.BrandDetailsArray.splice(
          i,
          0,
          result
        );
      }
    });
  }
  private validateall(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateall(control);
      }
    });
  }
  GetStorageMaster() {
    this.StorageService.GetAllStorageMaster(this.Livestatus).subscribe({
      next: (res) => {
        this.StorageMaster = res;
        console.log("LineItemMaster==>", res);
      },
      error: (error) => {
        console.log("error==>", error);
      },
    });
  }
  getSelectedstorageType(selectedId: number): string {
    const selectedStype = this.StorageMaster.find(
      (item) => item.storageTypeId === selectedId
    );
    return selectedStype ? selectedStype.storageTypeName : "";
  }

  getSelecteduom(selectedId: number): string {
    const selectedStype = this.UOM.find(
      (item) => item.uomId === selectedId
    );
    return selectedStype ? selectedStype.uomName : "";
  }
  getSelectedbrand(selectedId: number): string {
    const selectedbrand = this.brand.find(
      (item) => item.brandId === selectedId
    );
    return selectedbrand ? selectedbrand.brandName : "";
  }

  //Gallery view///
  // showImage(event: any): void {
  //   const src = event.target.src;
  //   let popupImage: HTMLImageElement = document.getElementById("popupImage") as HTMLImageElement;
  //   popupImage.src = src;

  //   let imagePopup: HTMLElement = document.getElementById("imagePopup") as HTMLImageElement;
  //   imagePopup.style.display = "block";
  //   document.body.style.overflow = "hidden";
  // }
  showImage(event: any) {
    let dialogRef = this.dialog.open(this.imagePreview,
      { data: event?.target?.src });
  }

  show(event: any): void {
    let dialogRef = this.dialog.open(this.imagePreview,
      { data: this.path + event });
  }

  closeImage(): void {
    let imagePopup: HTMLElement = document.getElementById("imagePopup") as HTMLImageElement;
    imagePopup.style.display = "none";
    document.body.style.overflow = "auto";
  }


  DeleteBrand(item: any, i: number) {
    if (i !== -1) {
      this.BrandDetailsArray.splice(i, 1);
    }
  }

  DeleteImage(item: any, i: number) {
    if (i !== -1) {
      this.ImageDataArray.splice(i, 1);
    }
  }

  Reset() {
    var Path1 = this.router.url;
    if (Path1 == "/crm/master/part/edit/" + this.route.snapshot.params["id"]) {
      this.service
        .GetAllPartMasterById(this.route.snapshot.params["id"])
        .subscribe((result: PartMasterContainer) => {

          console.log("result", result)

          this.partmasterobj = result.partMaster;
          this.Part.controls['countryId'].setValue(result.partMaster);
          console.log("this.partmasterobj", this.partmasterobj)
          this.countryId = this.partmasterobj.countryId;
          this.Part.patchValue({
            partId: this.partmasterobj.partId,
            partNumber: this.partmasterobj.partNumber,
            partName: this.partmasterobj.partName,
            modelNumber: this.partmasterobj.modelNumber,

            partDescription: this.partmasterobj.partDescription,
            livestatus: this.partmasterobj.livestatus,
            createdBy: this.partmasterobj.createdBy,
            createdDate: this.partmasterobj.createdDate,
            updatedBy: parseInt(this.userId$),
            updatedDate: this.Date
          });
          this.BrandDetailsArray = result.brandDetails;
          this.ImageDataArray = result.imageDetails;

          this.ImageDataArray.forEach((row => {
            this.ImageStore.push(row.imageName);
          }));

        });

    } else {
      this.Part.reset();
      this.IntializeForm();
      this.BrandDetailsArray = [];
      this.ImageDataArray = [];
      this.ImageDetailsArray = [];
      this.ImageStore = [];
    }
  }
  togglelivestatus(i: number, event: any) {
    if (event.checked === false) {
      this.hasDefaultImage = this.ImageDataArray[i].defaultImage == true;
      if (this.hasDefaultImage) {
        Swal.fire({
          title: "Are you sure?",
          text: "This is set as default image.Do you want to in active this.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            this.ImageDataArray[i].defaultImage = false;
            this.ImageDataArray[i].livestatus = false;
            this.ImageDataArray = [...this.ImageDataArray];
          } else {
            this.ImageDataArray[i].livestatus = true;
            this.ImageDataArray[i].defaultImage = true;
            this.ImageDataArray = [...this.ImageDataArray];
          }
        });
      }
    }
  }

		
  changeTab(index: number): void {
    this.selectedIndex = index;
  }
  

}
