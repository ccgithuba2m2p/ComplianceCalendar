import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarComponent } from './dashboard/calendar/calendar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarCarouselComponent } from './dashboard/calendar-carousel/calendar-carousel.component';
import { CalendarDatePopupComponent } from './dashboard/calendar/calendar-date-popup/calendar-date-popup.component';
import { CalendarDateComponent } from './dashboard/calendar-carousel/calendar-date/calendar-date.component';
import { PieChartComponent } from './dashboard/piechart/piechart.component';
import { TableComponent } from './table/table.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './authguard.service';
import { StorageServiceModule} from 'angular-webstorage-service';
import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    DashboardComponent,
    CalendarComponent,
    CalendarCarouselComponent,
    CalendarDatePopupComponent,
    CalendarDateComponent,
    PieChartComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    BrowserAnimationsModule,
    StorageServiceModule,
    GoogleChartsModule,
	  ToastrModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    ])
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
