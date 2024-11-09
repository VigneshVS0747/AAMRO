import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModeOfTransportComponent } from './mode-of-transport/mode-of-transport.component';
import { IncotermsComponent } from './incoterm/incoterms/incoterms.component';
import { DocumentsComponent } from './document/documents/documents.component';
import { AirportListComponent } from './airport/airport-list/airport.component';
import { AirportCreateComponent } from './airport/airport-cuv/airport-create.component';
import { InfosourceComponent } from './infosource/infosource/infosource.component';
import { DynamicGuard } from 'src/app/guards/auth.guard';
import { CommodityListComponent } from './commodity/commodity-list/commodity-list.component';
import { UnitofmeasureListComponent } from './unitofmeasure/unitofmeasure-list/unitofmeasure-list.component';
import { UomconversionListComponent } from './uomconversion/uomconversion-list/uomconversion-list.component';
import { SeaportListComponent } from './seaport/seaport-list/seaport-list.component';
import { PermitListComponent } from './permit/permit-list/permit-list.component';
import { ContainertypeListComponent } from './containertype/containertype-list/containertype-list.component';
import { PackagetypeListComponent } from './packagetype/packagetype-list/packagetype-list.component';

import { SeaportCuvComponent } from './seaport/seaport-cuv/seaport-cuv.component';
import { LineitemcategoryComponent } from './lineitemcategory/lineitemcategory.component';
import { ServicetypeComponent } from './servicetype/servicetype.component';
import { StoragetypelistComponent } from './StorageType/storagetypelist/storagetypelist.component';
import { LineItemMasterComponent } from './LineItemMaster/line-item-master/line-item-master.component';
import { LineitemmasterlistComponent } from './LineItemMaster/lineitemmasterlist/lineitemmasterlist.component';
import { PartMasterListComponent } from './PartMaster/part-master-list/part-master-list.component';
import { PartmasterComponent } from './PartMaster/partmaster/partmaster.component';
import { StoragetypeComponent } from './StorageType/storagetype/storagetype.component';
import { CustomerrankingComponent } from './customerranking/customerranking/customerranking.component';
import { IndustryTypeComponent } from './industry-type/industry-type.component';
import { JobtypecreateComponent } from './jobtype/jobtypecreate/jobtypecreate.component';
import { JobtypelistComponent } from './jobtype/jobtypelist/jobtypelist.component';
import { PotentialCustomerCreateComponent } from './potential-customer/potential-customer-create/potential-customer-create.component';
import { PotentialCustomerListComponent } from './potential-customer/potential-customer-list/potential-customer-list.component';
import { TrailerTypeComponent } from './trailer-type/trailer-type.component';
import { HscodeListComponent } from './hscode/hscode-list/hscode-list.component';
import { HscodeCuvComponent } from './hscode/hscode-cuv/hscode-cuv.component';
import { PotentialVendorListComponent } from './potential-vendor/potential-vendor-list/potential-vendor-list.component';
import { PotentialVendorCuvComponent } from './potential-vendor/potential-vendor-cuv/potential-vendor-cuv.component';
import { CustomerCuvComponent } from './customer/customer-cuv/customer-cuv.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { ReasonCrudComponent } from './reason/reason-crud/reason-crud.component';
import { VendorCuvComponent } from './vendor/vendor-cuv/vendor-cuv.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { ContactTypeComponent } from './contact-type/contact-type-crud/contact-type.component';
import { HsCodecategoryComponent } from './hs-codecategory/hs-codecategory.component';
import { AddressCrudComponent } from './address/address-crud/address-crud.component';
import { DocumentMappingComponent } from './document-mapping/document-mapping.component';
import { ApprovalHistoryListComponent } from './approval/approval-history-list/approval-history-list.component';


const routes: Routes = [
  { path: 'modeoftransport', component: ModeOfTransportComponent, canActivate: [DynamicGuard] },
  { path: 'incoterms', component: IncotermsComponent },
  { path: 'documents', component: DocumentsComponent },

  { path: 'airport', component: AirportListComponent, canActivate: [DynamicGuard] },
  { path: 'airport/create', component: AirportCreateComponent },
  { path: 'address-crud', component: AddressCrudComponent },

  { path: 'seaport', component: SeaportListComponent },

  { path: 'infosource', component: InfosourceComponent },

  { path: 'commodity', component: CommodityListComponent },

  { path: 'containertype', component: ContainertypeListComponent },

  { path: 'permit', component: PermitListComponent },

  { path: 'unitofmeasure', component: UnitofmeasureListComponent },

  { path: 'uomconversion', component: UomconversionListComponent },

  { path: 'packagetype', component: PackagetypeListComponent },


  { path: 'seaport', component: SeaportListComponent },
  { path: 'seaport/create', component: SeaportCuvComponent },

  { path: 'infosource', component: InfosourceComponent },
  { path: 'reason', component: ReasonCrudComponent },

  //HS Code
  { path: 'hscode', component: HscodeListComponent },
  { path: 'hscode/create', component: HscodeCuvComponent },

  //Hs cat //
  { path: 'hscodecat', component: HsCodecategoryComponent },
  //Vendor
  { path: 'vendor', component: VendorListComponent },
  { path: 'vendor/create-edit-view', component: VendorCuvComponent },

  { path: 'potentialcustomer/create', component: PotentialCustomerCreateComponent },
  { path: 'potentialcustomerlist', component: PotentialCustomerListComponent },

  { path: 'potentialvendor/create', component: PotentialVendorCuvComponent },
  { path: 'potentialvendorlist', component: PotentialVendorListComponent },

  { path: 'jobtypelist', component: JobtypelistComponent },
  { path: 'jobtype/create', component: JobtypecreateComponent },

  { path: 'customerlist', component: CustomerListComponent },
  { path: 'customer/create', component: CustomerCuvComponent },

  { path: 'Documentmappinglist', component: DocumentMappingComponent },

  { path: 'customerranking', component: CustomerrankingComponent },
  { path: 'industrytype', component: IndustryTypeComponent, canActivate: [DynamicGuard] },
  { path: 'servicetype', component: ServicetypeComponent },
  { path: 'lineitem', component: LineitemcategoryComponent },
  { path: 'trailer', component: TrailerTypeComponent },
  // Line Item Master
  { path: 'lineitemmaster/create', component: LineItemMasterComponent },
  { path: 'lineitemmaster/edit/:id', component: LineItemMasterComponent },
  { path: 'lineitemmaster/view/:id', component: LineItemMasterComponent },
  { path: 'lineitemmaster', component: LineitemmasterlistComponent },

  //StorageTypeMaster
  { path: 'storagetype/create', component: StoragetypeComponent },
  { path: 'storagetype/edit/:id', component: StoragetypeComponent },
  { path: 'storagetype/view/:id', component: StoragetypeComponent },
  { path: 'storagetypelist', component: StoragetypelistComponent },
  //part Master
  { path: 'part/create', component: PartmasterComponent },
  { path: 'part/edit/:id', component: PartmasterComponent },
  { path: 'part/view/:id', component: PartmasterComponent },
  { path: 'partlist', component: PartMasterListComponent },
  //potential vendor
  { path: 'potentialvendor/create', component: PotentialVendorCuvComponent },
  { path: 'potentialvendorlist', component: PotentialVendorListComponent },
  { path: 'contacttype', component: ContactTypeComponent },

  // {path:'followup/1/:id', component:FollowUpComponent},

  { path: 'approvalhistorylist', component: ApprovalHistoryListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
