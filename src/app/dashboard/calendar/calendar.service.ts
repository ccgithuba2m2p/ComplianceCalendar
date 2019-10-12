import { Injectable, NgModule } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CalendarDate } from './calendar.component';

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class CalendarService {
    public constructor(){
    }

    generateCalendar(currentDate: moment.Moment): CalendarDate[][] {
        const dates = this.fillDates(currentDate);
        const weeks: CalendarDate[][] = [];
        while (dates.length > 0) {
          weeks.push(dates.splice(0, 7));
        }
        return weeks;
      }
    
      fillDates(currentMoment: moment.Moment): CalendarDate[] {
        const firstOfMonth = moment(currentMoment).startOf('month').day();
        const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
        const start = firstDayOfGrid.date();
        return _.range(start, start + 42)
                .map((date: number): CalendarDate => {
                  const d = moment(firstDayOfGrid).date(date);
                  return {
                    today: this.isToday(d),
                    //selected: this.isSelected(d),
                    mDate: d,
                  };
                });
      }
    
      isToday(date: moment.Moment): boolean {
        return moment().isSame(moment(date), 'day');
      }
    
      
    
}