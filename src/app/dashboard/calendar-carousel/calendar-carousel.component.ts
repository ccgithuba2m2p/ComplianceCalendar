import { Component } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CalendarDate } from '../calendar/calendar.component';
import { CalendarDateComponent } from './calendar-date/calendar-date.component';
import { CalendarService } from '../calendar/calendar.service';
import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'calendar-carousel',
  templateUrl: './calendar-carousel.component.html',
  styleUrls: ['./calendar-carousel.component.scss']
})
export class CalendarCarouselComponent {

  currentMonth = moment();
  prevMonth = moment().subtract(1, 'months');
  nextMonth = moment().add(1, 'months');
  localCurrentMonth = moment();
  currentMonthWeeks: CalendarDate[][] = [];
  prevMonthWeeks: CalendarDate[][] = [];
  nextMonthWeeks: CalendarDate[][] = [];
  largeCalendar = false;
  dates = [];
  middleDate = moment();

  constructor(private service : CalendarService, private dashboardService : DashboardService){
    this.currentMonthWeeks = service.generateCalendar(this.currentMonth);
    this.prevMonthWeeks = service.generateCalendar(this.prevMonth);
    this.nextMonthWeeks = service.generateCalendar(this.nextMonth);
    this.generateSmallCalendarDates(this.middleDate);
  }

  updateCalendar(key){
    if(key === 'up'){
      this.localCurrentMonth = moment(this.localCurrentMonth).subtract(1, 'months');
    }else{
      this.localCurrentMonth = moment(this.localCurrentMonth).add(1, 'months');
    }
    this.currentMonth = moment(this.localCurrentMonth);
    this.prevMonth = moment(this.localCurrentMonth).subtract(1, 'months');
    this.nextMonth = moment(this.localCurrentMonth).add(1, 'months');
    this.currentMonthWeeks = this.service.generateCalendar(this.currentMonth);
    this.prevMonthWeeks = this.service.generateCalendar(this.prevMonth);
    this.nextMonthWeeks = this.service.generateCalendar(this.nextMonth);
  }
  
  showLargeCalendar(){
    this.largeCalendar = true;
  }

  closeLargeCalendar(){
    this.largeCalendar = false;
  }

  generateSmallCalendarDates(middleDate) {
    let currentMonthDates = this.service.fillDates(moment());
    currentMonthDates.forEach(date => {
      if(date.mDate.format('MMMM') == moment().format('MMMM')){
        this.dates.push(date.mDate);
      }
    });
  }

  nextDatesSmallCalendar(middleDate){
    debugger;
    this.middleDate = this.middleDate.add(1, 'month');
    let size = this.dates.length;
    for(var i = 0; i < size; ++i){
      this.dates.pop();
    }
    let currentMonthDates = this.service.fillDates(this.middleDate);
    currentMonthDates.forEach(date => {
      if(date.mDate.format('MMMM') === this.middleDate.format('MMMM')){
        this.dates.push(date.mDate);
      }
    });
  }

  previousDatesSmallCalendar(middleDate){
    this.middleDate = this.middleDate.subtract(1, 'month');
    let size = this.dates.length;
    for(var i = 0; i < size; ++i){
      this.dates.pop();
    }
    let currentMonthDates = this.service.fillDates(this.middleDate);
    currentMonthDates.forEach(date => {
      if(date.mDate.format('MMMM') === this.middleDate.format('MMMM')){
        this.dates.push(date.mDate);
      }
    });
  }

  // isSelected(date: moment.Moment): boolean {
  //   return _.findIndex(this.selectedDates, (selectedDate) => {
  //     return moment(date).isSame(selectedDate.mDate, 'day');
  //   }) > -1;
  // }
}