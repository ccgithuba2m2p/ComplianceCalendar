import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-calendar-date-popup',
  templateUrl: './calendar-date-popup.component.html',
  styleUrls: ['./calendar-date-popup.component.scss']
})
export class CalendarDatePopupComponent {
  @Input() date :  moment.Moment = moment();

  complianceList = [];

  constructor(private dashboardService : DashboardService){}

  ngOnInit(){
    this.dashboardService.complianceDateMapper.subscribe(mapper => {
      this.complianceList = mapper[this.date.format('YYYY/MM/DD')];
    });
  }
}
