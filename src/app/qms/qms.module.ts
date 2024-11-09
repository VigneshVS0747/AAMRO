import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QmsRoutingModule } from './qms-routing.module';
import { MasterModule } from '../qms/master/master.module'
import { MasterRoutingModule } from '../qms/master/master-routing.module'
import { TransactionRoutingModule } from '../qms/transaction/transaction-routing.module'
import { TransactionModule } from '../qms/transaction/transaction.module';
import { MaterialModule } from './../material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QmsRoutingModule,
    MasterModule,
    MasterRoutingModule,
    TransactionRoutingModule,
    TransactionModule,
    MaterialModule
  ]
})
export class QmsModule { }
