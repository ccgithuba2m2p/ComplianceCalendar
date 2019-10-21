import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { DashboardService } from './dashboard.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
   
  complianceList = [];
  complianceMasterList = [];
  complianceDateList = [];
  complianceDateMapper : {[date : string] : any[]} = {};

  constructor(private service: DashboardService, @Inject(SESSION_STORAGE) private storage: WebStorageService){
    let companyId = storage.get('companyId');
    let departmentId = storage.get('departmentId');
    let companyName = storage.get('company');
    let departmentName = storage.get('department');
    firebase.database().ref('/ComplianceMaster').on('value', snapshot=>{
      firebase.database().ref('/ComplianceMain').child(companyId).child(departmentId).on('value', snapshot2 => {
        this.complianceList = [];      
        this.complianceDateList = [];
        this.complianceDateMapper = {};
        this.complianceMasterList = [];

        snapshot.forEach(e => {
          let compliance = e.val();
          this.complianceMasterList.push({
            id : e.key,
            act : compliance.act,
            section : compliance.section,
            name : compliance.name,
            formName : compliance.formName
          });
        });
        
        snapshot2.forEach(e => {
          let value = e.val();
          let compliances = this.complianceMasterList.filter(c => c.id === value.compliance);
          if(compliances.length > 0){
            let compliance = compliances[0];
            this.complianceList.push({
              id: e.key,
              name: compliance.name,
              act: compliance.act,
              section : compliance.section,
              formName : compliance.formName,
              dueDate : value.dueDate,
              frequency : value.frequency,
              company: companyName,
              department: departmentName
            });

            this.complianceDateList.push(value.dueDate);
            if(!this.complianceDateMapper[value.dueDate]){
              this.complianceDateMapper[value.dueDate] = [];
            }
            this.complianceDateMapper[value.dueDate].push({
              id: e.key,
              name: compliance.name,
              act: compliance.act,
              section : compliance.section,
              formName : compliance.formName,
              dueDate : value.dueDate,
              frequency : value.frequency,
              company: companyName,
              department: departmentName
            });
          }
        });
        service.setComplianceList(this.complianceList);
        service.setComplianceMasterList(this.complianceMasterList);
        service.setComplianceDateList(this.complianceDateList);
        service.setComplianceDateMapper(this.complianceDateMapper);
      });    
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
  }
}
