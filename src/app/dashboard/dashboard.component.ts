import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
   
  complianceList = [];
  complianceDateList = [];
  complianceDateMapper : {[date : string] : any[]} = {};

  constructor(private service: DashboardService){
    firebase.database().ref('/ComplianceMaster').on('value', snapshot=>{
      let size = this.complianceList.length;
      for(let i = 0; i < size; ++i){
        this.complianceList.pop();
      }
      size = this.complianceDateList.length;
      for(let i = 0; i < size; ++i){
        this.complianceDateList.pop();
      }
      this.complianceDateMapper = {};
      snapshot.forEach(e => {
        let compliance = e.val();
        this.complianceList.push({
          id : e.key,
          company : compliance.company,
          department : compliance.department,
          act : compliance.act,
          section : compliance.section,
          name : compliance.name,
          dueDate : compliance.dueDate,
          formName : compliance.formName,
          frequency : compliance.frequency
        });

        this.complianceDateList.push(compliance.dueDate);
        if(!this.complianceDateMapper[compliance.dueDate]){
          this.complianceDateMapper[compliance.dueDate] = [];
        }
        this.complianceDateMapper[compliance.dueDate].push({
          id : e.key,
          company : compliance.company,
          department : compliance.department,
          act : compliance.act,
          section : compliance.section,
          name : compliance.name,
          dueDate : compliance.dueDate,
          formName : compliance.formName,
          frequency : compliance.frequency
        });
      });
      service.setComplianceList(this.complianceList);
      service.setComplianceDateList(this.complianceDateList);
      service.setComplianceDateMapper(this.complianceDateMapper);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
  }
}
