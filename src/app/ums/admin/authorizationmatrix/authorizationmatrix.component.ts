import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, firstValueFrom } from "rxjs";
import { AuthorizationmatrixService } from "../../../services/ums/authorizationmatrix.service";
import { Authorizationmatrix } from "../../../Models/ums/authorizationmatrix.modal";
import { AuthorizationItem } from "../../../Models/ums/authorizationitem.model";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";

@Component({
  selector: "app-authorizationmatrix",
  templateUrl: "./authorizationmatrix.component.html",
  styleUrls: ["./authorizationmatrix.component.css", "../../ums.styles.css"],
})
export class AuthorizationmatrixComponent implements OnInit {
  //DECLARATIONS HERE//
  authname: any;
  authitem: AuthorizationItem[] = [];
  authmatrixbyid: any[] = [];
  authmatrixDatabyid: Authorizationmatrix[] = [];
  selectedItems: number[] = [];
  Date = new Date();
  Showtable: boolean | undefined;
  Showtable1: boolean | undefined;
  Showform: boolean | undefined;
  Showform1: boolean | undefined;
  matrixname: any;
  selected: number[] = [];
  unchange: number[] = [];
  uniqueValues: number[] | undefined;
  notunique: number[] = [];
  Showsave: boolean | undefined;
  Showupdate: boolean | undefined;
  matrixid: any;
  item: any;
  livestatus: boolean | undefined;
  submitted = false;
  title: string = " New Authorization Matrix";
  Livestatus = 1;
  userId$:string;

  Auth: Authorizationmatrix = {
    authorizationMatrixID: 0,
    authorizationMatrixName: "",
    authorizationMatrixDetailsID: 0,
    livestatus: true,
    createdby:0,
    createdDate: this.Date,
    updatedby:0,
    updatedDate: this.Date,
    brandId: 0,
    brandName: "",
    customerId: 0,
    customerName: "",
    jobTypeId: 0,
    jobtypeName: "",
    warehouseId: 0,
    warehouseName: "",
    authorizationItemName: "",
    authorizationItemID: undefined,
    message: "",
  };
  SelectedAuthItemId: any[] = [];
  selectedAuthitemUnchange: any[] = [];
  notuniqueauthid: any[] = [];
  TotalNotuniqedata: any[] = [];
  readOnly: boolean = false;
  uniqseparate: any[]= [];
  uniques: any[]=[];
  SelectedArray: any[]=[];
  Updateuniques: any[]=[];
  updatevalues: any[]=[];
  UpdatedArray: any[]=[];
  authmatrixData: any[]=[];
 
  //IN THIS CONSTRUCTOR I NEED THIS SERVICE TO LOAD FIRST SO I USED THIS HERE//
  constructor(
    private FB: FormBuilder,
    private service: AuthorizationmatrixService,
    private route: ActivatedRoute,
    private router: Router,
    private UserIdstore: Store<{ app: AppState }>
  ) {
    this.service.GetAuthorizationitems(this.Livestatus).subscribe((result) => {
      this.authname = result;
      console.log(result);
    });
  }
  //IN THIS WE GET THE DATA FROM API AND POPULATE TO GRID BASED ON CONDITIONS AND REQUIREMENTS//
  async ngOnInit() {
    this.GetUserId();
    this.readOnly =
      this.route.snapshot.params["readOnly"] &&
      JSON.parse(this.route.snapshot.params["readOnly"])
        ? JSON.parse(this.route.snapshot.params["readOnly"])
        : false;
    console.log("this.readOnly", this.readOnly);

    if (this.route.snapshot.params["id"]) {
      this.authmatrixbyid = await firstValueFrom(
        this.service.GetAuthorizationmatrixbyid(
          this.route.snapshot.params["id"]
        )
      );
      console.log(this.authmatrixbyid);
      this.authmatrixbyid.forEach((item) => {
        this.matrixname = item.authorizationMatrixName;
        this.matrixid = item.authorizationMatrixID;
        this.livestatus = item.livestatus;
        //this.selected.push(item.authorizationItemID)
        this.unchange.push(item.authorizationItemID);
      });
    }
    this.Showtable = false;
    this.Showtable1 = false;
    this.Showsave = true;
    if (this.route.snapshot.params["id"]) {
      this.Showform = false;
      this.Showform1 = true;
      this.Showupdate = true;
      this.Showsave = false;
      this.Showtable1 = true;
      this.title = "Update Authorization Matrix";
    } else {
      this.Showform = true;
    }
  }
  GetUserId(){  
    this.UserIdstore.select("app").subscribe({
      next:(res)=>{
       this.userId$=res.userId;
      }
    });
  }
  //IN THIS ONSELECTAUTHITEMS IS USED FOR FILTER THE DATA FROM THE MULTIPLE SELECT DROPDOWN//
  onSelectAuthItems() {
    this.uniques = this.notuniqueauthid.filter(item => !this.authmatrixbyid.some(otherItem => otherItem.authorizationItemID === item));
    if (this.uniques.length === 0) {
      this.notuniqueauthid=[];
      this.selectedItems = [];
      //alert("Alredy Selected...");
    }else{
      const stringArray = this.uniques;
      const numberArray = stringArray.map(Number);
      console.log(numberArray);
      const auth = {
        authorizationItemID: numberArray,
      };
      this.service.GetAuthorizationitemList(auth).subscribe((result) => {
        this.authmatrixDatabyid = result;
        this.authmatrixbyid.push(...this.authmatrixDatabyid);
        this.selectedItems = [];
      });
      this.Showtable1 = true;
      this.notuniqueauthid=[];
    }
    
  }
  //IN THIS ONSELECTAUTHITEMS IS USED FOR FILTER THE DATA FROM THE MULTIPLE SELECT DROPDOWN//
  onSelect() {
    if (this.updatevalues.length > 0) {
      const stringArray = this.updatevalues;
      const numberArray = stringArray.map(Number);
      console.log(numberArray);
      const auth = {
        authorizationItemID: numberArray,
      };
      this.service.GetAuthorizationitemList(auth).subscribe((result) => {
        // Check if each item in result already exists in this.authmatrixbyid
        this.authmatrixData = result;
        this.authmatrixbyid.push(...this.authmatrixData);
       
        console.log(this.authmatrixbyid);
      });
      
      this.Showtable1 = true;
      this.selected = [];
      this.updatevalues=[];
     } 
  }
  //IN THIS SAVE THE INPUTS ARE GET AND SAVE TO THE DATABASE//
  saveData() {

    this.authmatrixbyid.forEach((item) => {
      this.SelectedArray.push(item.authorizationItemID);
    });

    if (
      this.Auth.authorizationMatrixName !== "" &&
      this.SelectedArray.length > 0
    ) {
      const stringArray = this.SelectedArray;
      const numberArray = stringArray.map(Number);
      const authorizationmatrix = {
        ...this.Auth,
        createdBy:parseInt(this.userId$),
        updatedBy:parseInt(this.userId$),
        authorizationItemID: numberArray,
      };

      this.service
        .createAuthoriazationmatrix(authorizationmatrix)
        .pipe(
          catchError((error) => {
            this.selectedItems = [];
            this.resettextbox();
            this.Showtable1 = false;
            this.authitem = [];
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.error.message,
              showConfirmButton: false,
              timer: 2000,
            });

            throw error;
          })
        )
        .subscribe((result) => {
          if (result.message === "SUCCESS") {
            this.selectedItems = [];
            this.resettextbox();
            this.Showtable1 = false;
            this.authitem = [];
            this.SelectedArray=[];
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Added Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.returntolist();
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Please fill Mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!this.Auth.authorizationMatrixName) {
        // Focus on the mat-select element
        this.submitted = true;
        const element = document.getElementById("authorizationMatrixName");
        if (element) {
          element.focus();
        }

        // Stop further execution
        return;
      }
    }
  }

  //IN THIS UPDATE GET THE CURRENT SELECTED VALUE AND UPDATE THEM TO DATABASE//
  UpdateData() {
    if (this.matrixname !== "") {
    
      const authorizationUpdate={
        authorizationMatrixID: this.matrixid,
        authorizationmatrixname: this.matrixname,
        authorizationMatrixUpdateList:this.authmatrixbyid,
        livestatus: this.livestatus,
        createdby:parseInt(this.userId$),
        updatedby: parseInt(this.userId$),
        createddate: this.Date,
        updateddate: this.Date,

      }

      this.service
          .UpdateAuthmatrix(authorizationUpdate).pipe(
            catchError((error) => {

              if (error.error.ErrorDetails.includes("UNIQUE KEY")) {
                Swal.fire({
                  icon: "error",
                  title: "error",
                  text: "Authorization Matrix already exists!",
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
              throw error;
            })
          )
           .subscribe((result) => {
             Swal.fire({
              icon: "success",
              title: "Success",
              text: "Updated Successfully",
             showConfirmButton: false,
              timer: 2000,
            });
             this.getlist();
             this.UpdatedArray=[];
             this.returntolist();
          });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Please fill Mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!this.matrixname) {
        // Focus on the mat-select element
        this.submitted = true;
        const element = document.getElementById("authorizationMatrixName");
        if (element) {
          element.focus();
        }

        // Stop further execution
        return;
      }
    }
  }
  // THIS DELETE IS BASED ON INDEX LEVEL AND ALSO CLEAR THE SELECT INPUTS IN THE MULTIPLE SELECT DROPDOWN//
  deleteItem(item: any) {
    if(this.route.snapshot.params["id"]){
      const index = this.authmatrixbyid.findIndex(
        (data) => data.authorizationItemName === item.authorizationItemName
      );

     if (index !== -1) {
        this.authmatrixbyid.splice(index, 1);
      }
    }else{
      const index = this.authmatrixbyid.findIndex(
        (data) => data.authorizationItemName === item.authorizationItemName
      );
      if (index !== -1) {
        this.authmatrixbyid.splice(index, 1);
      }
      const ind = this.selected.indexOf(item.authorizationItemId);
      if (ind !== -1) {
        [this.selected.splice(ind, 1)];
        this.selected = [...this.selected];
      }
      const inde = this.notunique.indexOf(item.authorizationItemId);
      if (inde !== -1) {
        [this.notunique.splice(inde, 1)];
        this.notunique = [...this.notunique];
      }
      if (this.authmatrixbyid.length === 0) {
        this.Showtable1 = false;
      }
      const indexs = this.selectedItems.indexOf(item.authorizationItemId);
      if (indexs !== -1) {
        [this.selectedItems.splice(indexs, 1)];
        this.selectedItems = [...this.selectedItems];
      }
    }
    
  }
  //CHECK UNIQUE VALUES FOR UPDATE THE AUTHORIZATION MATRIX//
  onSelectionChange(event: any) {
      this.updatevalues=[];
    const valueToCheck = event.value;
    for (let value of event.value) {
      if (!this.authmatrixbyid.some(item => item.authorizationItemID === value)) {
        // If the value is not already in the array, push it
        if(!this.updatevalues.includes(value)){
          this.updatevalues.push(value);
        }
    }
    }
    
  }
  onSelectionChangeauthitem(event: any) {
    this.notuniqueauthid=[];
    // Loop through each value in the event array
    for (let value of event.value) {
      // Check if the value is not already in the notuniqueauthid array
      if (!this.notuniqueauthid.includes(value)) {
          // If the value is not already in the array, push it
          this.notuniqueauthid.push(value);
      }
  }

  }
  //RESET TEXTBOX//
  resettextbox() {
    this.Auth.authorizationMatrixName = "";
  }

  getlist() {
    this.service
      .GetAuthorizationmatrixbyid(this.route.snapshot.params["id"])
      .subscribe((result) => {
        this.authmatrixbyid = result;
      });
  }
  reset() {
    if (this.route.snapshot.params["id"]) {
      window.location.reload();
      // this.authmatrixbyid=[];
      // this.getlist();
    } else
      [
        (this.Auth.authorizationMatrixName = ""),
        (this.authmatrixbyid = []),
        (this.selectedItems = []),
        (this.Showtable1 = false),
      ];
  }

  returntolist(){
    this.router.navigate(["ums/activity/authmat"])
  }
}
