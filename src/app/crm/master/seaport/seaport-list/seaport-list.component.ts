import { Component } from '@angular/core';
import { SeaportService } from '../seaport.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Seaport } from 'src/app/Models/crm/master/Seaport';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-seaport-list',
  templateUrl: './seaport-list.component.html',
  styleUrls: ['./seaport-list.component.css']
})
export class SeaportListComponent {
  seaports: Seaport[] = [];
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor(private seaportSvc: SeaportService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,) {}
  ngOnInit(): void {
    this.getSeaports();    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }
  onview(item: any){
    if(item){
      this.seaportSvc.isView=true;
      this.seaportSvc.setItemId(item.seaportId);
      this.router.navigate(["/crm/master/seaport/create"]);
    }
  }
   add(){
    this.router.navigate(["/crm/master/seaport/create"]);
    this.seaportSvc.isView=false;
    this.seaportSvc.setItemId(0);
   }
   
  //#region Get All Airport in list
  getSeaports() {
    this.seaportSvc.getallSeaports().subscribe(result => {
      this.seaports = result;
    })
  }
  //#endregion Get All Airport in list

  //#region Delete Airport
  onDelete(seaport: any) {
    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete " + seaport.seaportName + '...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.seaportSvc.deleteSeaport(seaport.seaportId).subscribe((res) => {
          this.getSeaports();
          Swal.fire(
            'Deleted!',
            'Seaport ' + seaport.seaportName + ' has been deleted',
            'success'
          )
        });
      }
    })
  }
  //#endregion

  //#region edit
  onEdit(item: any){
    this.seaportSvc.setItemId(item.seaportId);
    this.seaportSvc.isView=false;
    this.router.navigate(['/crm/master/seaport/create']);
  }
  //#endregion
}
