import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-joborder',
  templateUrl: './joborder.component.html',
  styleUrls: ['./joborder.component.css']
})
export class JoborderComponent implements OnInit {


  constructor(){

  }

  ngOnInit(): void {
   
  }

   //#region Joborder Date
   dateFilter1 = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return !date || date <= currentDate;
  };
}
