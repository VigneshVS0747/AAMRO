import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowUpComponent } from './FollowUp/follow-up/follow-up.component';
import { FollowuplistComponent } from './FollowUp/followuplist/followuplist.component';
import { EnquiryComponent } from './Enquiry/enquiry/enquiry.component';

import { PurchaseQuotationGenerateComponent } from './purchese-quotation/purchase-quotation-generate/purchase-quotation-generate.component';
import { PurchaseQuotationCuvComponent } from './purchese-quotation/purchase-quotation-cuv/purchase-quotation-cuv.component';
import { PurchaseQuotationListComponent } from './purchese-quotation/purchase-quotation-list/purchase-quotation-list.component';
import { EnquiryListComponent } from './Enquiry/EnquiryList/enquiry-list/enquiry-list.component';
import { RfqComponent } from './RFQ/RFQ-CUV/rfq/rfq.component';
import { RfqlistComponent } from './RFQ/rfqlist/rfqlist.component';
import { SalesopportunityCuvComponent } from './salesopportunity/salesopportunity-cuv/salesopportunity-cuv.component';

const routes: Routes = [
  {path:'followup', component:FollowUpComponent},

  {path:'purchasequotation/cuv', component:PurchaseQuotationCuvComponent},
  {path:'purchasequotationlist', component:PurchaseQuotationListComponent},
  {path:'purchasequotationlist/:id', component:PurchaseQuotationListComponent},
  {path:'purchasequotationgenerate', component:PurchaseQuotationGenerateComponent},

  {path:'followup/create', component:FollowUpComponent},
  {path:'followuplist', component:FollowuplistComponent},
  {path:'followuplist/:id', component:FollowuplistComponent},
  {path:'followup/edit/:id', component:FollowUpComponent},
  {path:'followup/view/:id', component:FollowUpComponent},
  {path:'followup/:param1/:param2', component:FollowUpComponent},


  //Enquiry//
  {path:'enquiry/create', component:EnquiryComponent},
  {path:'enquiry/edit/:id', component:EnquiryComponent},
  {path:'enquiry/view/:id', component:EnquiryComponent},
  {path:'enquirylist', component:EnquiryListComponent},
  {path:'enquirylist/:id', component:EnquiryListComponent},


  //RFQ//
  {path:'rfq/create', component:RfqComponent},
  {path:"rfqlist",component:RfqlistComponent},
  {path:"rfqlist/:id",component:RfqlistComponent},

  {path:'salesopportunity/create', component:SalesopportunityCuvComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
