import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar-date-popup',
  templateUrl: './calendar-date-popup.component.html',
  styleUrls: ['./calendar-date-popup.component.scss']
})
export class CalendarDatePopupComponent {
    @Input() date :  moment.Moment = moment();

    constructor(){
    }
}
