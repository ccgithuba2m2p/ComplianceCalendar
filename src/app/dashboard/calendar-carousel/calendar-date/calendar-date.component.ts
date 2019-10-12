import { Component, Input, OnInit } from '@angular/core';
import { CalendarDate } from '../../calendar/calendar.component';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-calendar-date',
  templateUrl: './calendar-date.component.html',
  styleUrls: ['./calendar-date.component.scss']
})
export class CalendarDateComponent{
  
  @Input() date : any;

  complianceDateList = [];
  weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  constructor(private dashboardService : DashboardService){}

  ngOnInit(){
    this.dashboardService.complianceDateList.subscribe(dateList => {
      this.complianceDateList = dateList;
    });
  }
}
