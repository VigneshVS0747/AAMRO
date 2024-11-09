import { Component } from '@angular/core';
import { AirportService } from '../airport.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Airport } from 'src/app/Models/crm/master/Airport';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.css']
})
export class AirportListComponent {
  airports: Airport[] = [];
  pagePrivilege: Array<string>;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
  
  constructor(private airportSvc: AirportService,private router: Router,
    private store: Store<{ privileges: { privileges: any } }>) {}
  ngOnInit(): void {
    this.getAirports();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }
 
  onview(item: any){
    if(item){
      this.airportSvc.isView=true;
      this.airportSvc.setItemId(item.airportId);
      this.router.navigate(["/crm/master/airport/create"]);
    }
  }
   add(){
    this.router.navigate(["/crm/master/airport/create"]);
    this.airportSvc.isView=false;
    this.airportSvc.setItemId(0)
   }
   
  //#region Get All Airport in list
  getAirports() {
    this.airportSvc.getAirports().subscribe((result:any) => {
      this.airports = result;
    }
    )
  }
  //#endregion Get All Airport in list

  //#region Delete Airport
  onDelete(airport: any) {
    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete this record" ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.airportSvc.deleteAirport(airport.airportId)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Airport you are trying to delete is already in use. Do you want to in-active this Airport ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.airportSvc.isActiveAirport(airport.airportId).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getAirports();
                    Swal.fire(
                      "Success",
                      "Airport has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getAirports();
                    Swal.fire("Info", "Airport is already in-active !", "info");
                  }
                });
              }
            });
            return throwError(error); // Re-throw the error to propagate it to the subscriber
          })
        )
        .subscribe((res) => {
          this.getAirports();
          Swal.fire(
            'Deleted!',
            'Airport ' + airport.airportName + ' has been deleted',
            'success'
          )
        });
      }
    })
  }
  //#endregion

  //#region edit
  onEdit(item: any){
    this.airportSvc.setItemId(item.airportId);
    this.airportSvc.isView=false;
    this.router.navigate(['/crm/master/airport/create']);
  }
  //#endregion
}
