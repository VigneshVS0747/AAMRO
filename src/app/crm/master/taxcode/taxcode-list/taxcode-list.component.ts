import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService } from 'src/app/services/notification.service';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/confirmation/delete-confirmation-dialog.component';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TaxCode } from '../taxcode.model';
import { TaxcodeService } from '../taxcode.service';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-taxcode-list',
  templateUrl: './taxcode-list.component.html',
  styleUrls: ['./taxcode-list.component.css']
})
export class TaxcodeListComponent {
  taxCodes :TaxCode[] = [];
  Livestatus=0;
  pagePrivilege: Array<string>;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<TaxCode>;
   
  displayedColumns: string[] = ['taxCode','taxName','taxType','percentageOfTax','effectiveDate','countryName','livestatus','createdBy','createdDate','updatedBy','updatedDate','edit','delete'];
  
  constructor(private store: Store<{ privileges: { privileges: any } }>,private dialog: MatDialog,private _liveAnnouncer: LiveAnnouncer,private taxcodeService:TaxcodeService,private commonService: CommonService, private router: Router,private notificationService: NotificationService){}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.taxCodes);
    this.getTaxCodes();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }

    ngAfterViewInit() {
     
     this.dataSource.sort = this.sort;
     
    }

  announceSortChange(sortTaxCode: Sort) {
    if (sortTaxCode.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortTaxCode.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addTaxCode(){
    
    this.router.navigate(['/ums/currencies/create']);
  }

  onDelete(taxCode: any) {
    //console.log(taxCode.taxCodeId)
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the TaxCode!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
      if (result.isConfirmed) {
        this.taxcodeService.deleteTaxCode(taxCode.taxCodeId).subscribe((res) => {
          this.getTaxCodes();
          Swal.fire(
            'Deleted!',
            'TaxCode has been deleted',
            'success'
          )
        });
     
      }
      })
    }
   
    getTaxCodes(){
      this.taxcodeService.getTaxCodes().subscribe((result)=>{
      this.taxCodes = result;
      console.log(result)
      this.dataSource.data = this.taxCodes;
      })
    }
}
