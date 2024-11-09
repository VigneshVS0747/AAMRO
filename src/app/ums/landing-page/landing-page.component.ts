import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { geometry, Element, Layout, Text } from "@progress/kendo-drawing";
import {
  RenderEvent,
  SeriesVisualArgs,
  SeriesLabelsContentArgs,
  SeriesLabelsAlignment,
} from "@progress/kendo-angular-charts";
import { EnquiryService } from "src/app/crm/transaction/Enquiry/enquiry.service";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { State,process  } from "@progress/kendo-data-query";
import { FollowupService } from "src/app/crm/transaction/FollowUp/followup.service";
import { FormControl } from "@angular/forms";
import { CustomerService } from "src/app/crm/master/customer/customer.service";
import { PotentialCustomerService } from "src/app/crm/master/potential-customer/potential-customer.service";
import { Chart } from "chart.js";
import { MatDialog } from "@angular/material/dialog";
import { EnquiryPopupComponent } from "./Popup-grid-components/enquiry-popup/enquiry-popup.component";
import { FollowupPopupComponent } from "./Popup-grid-components/followup-popup/followup-popup.component";
import { CustomerPopupComponent } from "./Popup-grid-components/customer-popup/customer-popup.component";
import { PotentialCustomerPopupComponent } from "./Popup-grid-components/potential-customer-popup/potential-customer-popup.component";



@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.css"],
})
export class LandingPageComponent implements OnInit{

  //Enquiry
  EnquiryData:any[]=[];
  totalCount: number = 0;
  totalList: any = 0;
  public EgridData: any;
  EnquirychartData: any[];
  enquryControl= new FormControl('');

  //FollowUp
  public FgridData: any;
  FollowUpData:any[]=[];
  public model: any[] = [];
  FollowUpchartData: any[];
  selectedFollowUpOption: number;
  followControl= new FormControl('');



  //P to C
  public CChartData: any[] = [];
  public CChartOptionData: any[] = [];
  public customerCategories: string[] = ['Active', 'InActive', 'Pending for Approval', 'Rejected', 'Draft'];
  public pcustomerCategories: string[] = ['Active', 'InActive', 'Moved to customer', 'Pending for Approval'];
  selectedCustomerOption: number;
  selectedPCustomerOption: number;
  public selectedCustomerData: any[] = [];
  public selectedType: string = '';
  public CustomerGridData: any;
  public PCustomerGridData: any;
  PtoCControl= new FormControl();
  CustomerControl= new FormControl('');

  selectedEnquiryOption:any;
  sizes = [10, 20, 50];
  buttonCount = 3;


  public labelAlign: SeriesLabelsAlignment = "column";
  // background = '#fdf6f6';
  //Chart Js

  //popups
  enquiryDialog:any;
  followUpDialog:any;
  customerDialog:any;
  pcustomerDialog:any;
  
  constructor(private enquiryService:EnquiryService,private followupService: FollowupService,private customerService:CustomerService,
    private pCustomerService: PotentialCustomerService,public dialog: MatDialog,
  ){}


  ngOnInit(): void {
    this.getEnquiryCount();
    this.getFollowUpCount();
    this.getCustomerStatusCounts();
    // this.loadEGridData();
    // this.loadFGridData();
    const currentYear = new Date().getFullYear();
    this.fetchEnquiryCounts(currentYear);
    this.getCustomerTransformationCounts();
  }

   //Enquiry
  getEnquiryCount(){
    this.enquiryService.GetAllEnquiryCount().subscribe((res:any)=>{
      this.EnquiryData = res?.map((item:any) => ({
        ...item,
        color: this.getEColor(item.label)  
      }));
      this.EnquirychartData = this.EnquiryData.filter(item => item.label !== 'All');
      this.totalCount = this.EnquiryData.reduce((acc, item) => acc + item.count, 0);
      this.totalList = this.EnquiryData.find(option => option?.label === 'All');
    })
  }

  getEColor(label: string): string {
    switch (label) {
      case 'All': return '#ff6384';
      case 'Open': return '#32a889';
      case 'Close': return '#a83269';
      default: return '#dddddd';
    }
  }

  enquiryChange(event:any){
    this.EgridData = [];
    let value = event?.value;
    if(value === "All"){
      this.selectedEnquiryOption = 0;
    } else if(value === "Open"){
      this.selectedEnquiryOption = 1;
    } else if(value === "Close"){
      this.selectedEnquiryOption = 2;
    } else {
      this.selectedEnquiryOption = 3;
    }
    this.followControl.reset();
    this.CustomerControl.reset();
    this.loadEGridData();
  }


  private loadEGridData() {
    this.enquiryService.getEnquiryListByStatus(this.selectedEnquiryOption).subscribe((data: any) => {
      this.EgridData =  data;

      this.enquiryDialog = this.dialog.open(EnquiryPopupComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          list: this.EgridData
        },
      });

    });
  }

  labelContent(): string {
    return `${this.totalCount}`;
  }
  private center!: geometry.Point; 
  private radius!: number;
  public visualHandler = this.visual.bind(this);
  public visual(e: SeriesVisualArgs): Element {
    this.center = e.center!;
    this.radius = e.innerRadius!;

    return e.createVisual();
  }
  public onRender(e: RenderEvent): void {
    const circleGeometry = new geometry.Circle(
      [this.center.x, this.center.y],
      this.radius
    );
    const bbox = circleGeometry.bbox();
    const heading = new Text(this.totalList?.count, [0, 0], {
      font: "28px Verdana,Arial,sans-serif",
    });

    const line1 = new Text("Enquiry", [0, 0], {
      font: "16px Verdana,Arial,sans-serif",
    });

    const layout = new Layout(bbox, {
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      spacing: 5,
    });

    layout.append(heading, line1);
    layout.reflow();
    e.sender.surface.draw(layout);
  }
  public ElabelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }


  //Followup
  getFollowUpCount(){
    this.followupService.GetAllFollowUpCount().subscribe((res:any)=>{
      //this.FollowUpData = res;
      this.FollowUpData = res?.map((item:any) => ({
        category: item.label,
        value: item.count,
        color: this.getColor(item.label)  
      }));
      this.FollowUpchartData = this.FollowUpData.filter(item => item.category !== 'All');
      this.model = [
        {
          name: 'Enquiry Status',
          data: this.FollowUpchartData
        }
      ];
    })
  }

  getColor(label: string): string {
    switch (label) {
      case 'All': return '#ff6384';
      case 'Open': return '#36a2eb';
      case 'NextFollowUp': return '#cc65fe';
      case 'Close': return '#8C3061';
      default: return '#dddddd';
    }
  }

  public FollowlabelContent(e: any): string {
    return `${e.category}: ${e.value}`;
  }

  followupChange(event:any){
    this.FgridData = [];
    let value = event?.value;
    if(value === "All"){
      this.selectedFollowUpOption = 0;
    } else if(value === "Open"){
      this.selectedFollowUpOption = 1;
    } else if(value === "Next Follow Up"){
      this.selectedFollowUpOption = 2;
    } else if(value === "Close"){
      this.selectedFollowUpOption = 3;
    } else {
      this.selectedFollowUpOption = 4;
    }
    this.enquryControl.reset();
    this.CustomerControl.reset();
    this.loadFGridData();
  }



  private loadFGridData() {
    this.followupService.GetAllFollowUpByStatusID(this.selectedFollowUpOption).subscribe((data: any) => {
      this.FgridData = data;

      this.followUpDialog = this.dialog.open(FollowupPopupComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          list: this.FgridData
        },
      });
    });
  }


  private loadCGridData() {
    this.customerService.GetAllCustomerStatusID(this.selectedCustomerOption).subscribe((data: any) => {
      this.CustomerGridData = data;

      this.customerDialog = this.dialog.open(CustomerPopupComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          list: this.CustomerGridData
        },
      });
    });
  }



  private loadPCGridData() {
    this.pCustomerService.GetAllPCustomerStatusID(this.selectedPCustomerOption).subscribe((data: any) => {
      this.PCustomerGridData = data;
      this.pcustomerDialog = this.dialog.open(PotentialCustomerPopupComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          list: this.PCustomerGridData
        },
      });
    });
  }

  //PCustomer to Customer
  getCustomerStatusCounts() {
    this.customerService.GetAllPCustomerTOCustomerCount().subscribe((res: any) => {
      const customerCounts = res.filter((item: any) => item.label === 'Customer');
      const potentialCustomerCounts = res.filter((item: any) => item.label === 'PotentialCustomer');
      const allCustomerCount = res.find((item: any) => item.label === 'All Customer');
      const allPotentialCustomerCount = res.find((item: any) => item.label === 'All Potential Customer');
  
      this.CChartOptionData = [
        {
          name: 'Customer',
          data: [
            {
              category: 'All Customer',
              value: allCustomerCount ? allCustomerCount.count : 0,
              color: this.getCColor('All Customer')
            },
            ...this.customerCategories.map(status => {
              const statusCount = customerCounts.find((item: any) => item.statusName === status);
              return {
                category: status,
                value: statusCount ? statusCount.count : 0,
                color: this.getCColor(status)
              };
            })
          ]
        },
        {
          name: 'Potential Customer',
          data: [
            {
              category: 'All Potential Customer',
              value: allPotentialCustomerCount ? allPotentialCustomerCount.count : 0,
              color: this.getCColor('All Potential Customer')
            },
            ...this.pcustomerCategories.map(status => {
              const statusCount = potentialCustomerCounts.find((item: any) => item.statusName === status);
              return {
                category: status,
                value: statusCount ? statusCount.count : 0,
                color: this.getCColor(status)
              };
            })
          ]
        }
      ];

      this.CChartData = this.CChartOptionData.map(group => ({
        name: group.name,
        data: group.data.filter((item:any) => item.category !== 'All Customer' && item.category !== 'All Potential Customer')
      }));
    });
  }

  public ClabelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}`;
  }

  getCColor(status: string): string {
    switch (status) {
      case 'Active':
        return '#9de219';
      case 'InActive':
        return '#90cc38';
      case 'Pending for Approval':
        return '#068c35';
      case 'Rejected':
        return '#006634';
      case 'Draft':
        return '#004d38';
      case 'Moved to customer':
      return '#4ca832';
      default:
        return '#033939';  
    }
  }

  followChangeEvent(event:any){
    let value = event?.value;
    this.selectedCustomerData = value?.data;
    this.selectedType = value?.name;
  }

  sendStatusId(event: any) {
    const selectedStatus = event.value;
    if (this.selectedType === 'Customer') {
      if(selectedStatus?.category === "Active"){
        this.selectedCustomerOption = 1;
      } else if(selectedStatus?.category === "InActive"){
        this.selectedCustomerOption = 2;
      } else if(selectedStatus?.category === "Pending for Approval"){
        this.selectedCustomerOption = 3;
      } else if(selectedStatus?.category === "Rejected"){
        this.selectedCustomerOption = 4;
      }  else if(selectedStatus?.category === "Draft"){
        this.selectedCustomerOption = 5;
      }else {
        this.selectedCustomerOption = 0;
      } 
      this.CustomerGridData = [];

      this.customerService.GetAllCustomerStatusID(this.selectedCustomerOption).subscribe((res: any) => {
        this.CustomerGridData = res;
         this.loadCGridData();
        this.enquryControl.reset();
        this.followControl.reset();
       });
    } 
    else if (this.selectedType === 'Potential Customer') {
      if(selectedStatus?.category === "Active"){
        this.selectedPCustomerOption = 1;
      } else if(selectedStatus?.category === "InActive"){
        this.selectedPCustomerOption = 2;
      } else if(selectedStatus?.category === "Pending for Approval"){
        this.selectedPCustomerOption = 4;
      } else if(selectedStatus?.category === "Moved to customer"){
        this.selectedPCustomerOption = 3;
      }else {
        this.selectedPCustomerOption = 0;
      } 

      this.PCustomerGridData = [];


      this.pCustomerService.GetAllPCustomerStatusID(this.selectedPCustomerOption).subscribe((res: any) => {
        this.PCustomerGridData = res;
        this.loadPCGridData();
      });
    }
  }



  





  //Enquiry Status by year
  years: number[] = [2022, 2023, 2024]; 
  categories: string[] = [];
  enquiryCounts: number[] = [];
  onYearChange(event: any) {
    const selectedYear = event;
    this.fetchEnquiryCounts(selectedYear);
  }
  fetchEnquiryCounts(year: number) {
    this.enquiryService.GetMonthlyEnquiryCounts(year).subscribe((data: any) => {
      this.categories = data.map((item: any) => item.monthName);
      this.enquiryCounts = data.map((item: any) => item.enquiryCount);
    });
  }




  /// PC to C
  transformationData:any[]=[];
  chartData:any[]=[];
  getCustomerTransformationCounts() {
    this.customerService.GetCustomerTransformationCounts().subscribe((res: any) => {
      this.transformationData = res.map((item: any) => ({
        label: item.label,
        count: item.count
      }));
  
      this.prepareChartData();
    });
  }
  
  prepareChartData() {
    this.chartData = [
      {
        name: 'Customer',
        data: this.transformationData.filter(item => item.label === 'Customer').map(item => item.count),
        color: '#1f77b4'
      },
      {
        name: 'Potential Customer',
        data: this.transformationData.filter(item => item.label === 'PotentialCustomer').map(item => item.count),
        color: '#ff7f0e'
      },
      {
        name: 'Converted Potential Customer',
        data: this.transformationData.filter(item => item.label === 'ConvertedPotentialCustomer').map(item => item.count),
        color: '#2ca02c'
      }
    ];
  }

  public PtoClabelContent(e: any): string {
    return `${e.label}: \n ${e.count}`;
  }
  
}
