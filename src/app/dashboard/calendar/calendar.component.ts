import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}

@Component({
  selector: 'app-dashboard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  @Input() weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  @Input() currentDate = moment();
  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();
  makePopupVisible = false;
  date : any;

  constructor() {

    if(this.currentDate === null){
      this.currentDate = moment();
    }
  }

  ngOnInit(): void {
    // this.generateCalendar();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.selectedDates &&
  //       changes.selectedDates.currentValue &&
  //       changes.selectedDates.currentValue.length  > 1) {
  //     // sort on date changes for better performance when range checking
  //     this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
  //     this.generateCalendar();
  //   }
  // }

  // date checkers

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    this.onSelectDate.emit(date);
  }

  // actions from calendar

  // prevMonth(): void {
  //   this.currentDate = moment(this.currentDate);
  //   this.generateCalendar();
  // }

  // nextMonth(): void {
  //   this.currentDate = moment(this.currentDate);
  //   this.generateCalendar();
  // }

  // firstMonth(): void {
  //   this.currentDate = moment(this.currentDate).startOf('year');
  //   this.generateCalendar();
  // }

  // lastMonth(): void {
  //   this.currentDate = moment(this.currentDate).endOf('year');
  //   this.generateCalendar();
  // }

  // prevYear(): void {
  //   this.currentDate = moment(this.currentDate).subtract(1, 'year');
  //   this.generateCalendar();
  // }

  // nextYear(): void {
  //   this.currentDate = moment(this.currentDate).add(1, 'year');
  //   this.generateCalendar();
  // }

  // generate the calendar grid

  setPopupContent(date){
    this.makePopupVisible = true;
    this.date = date;
  }
  
}