import { Component, ViewChild, HostListener, ChangeDetectorRef, AfterViewInit, Input } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import * as firebase from "firebase/app";
import "firebase/database";
import * as moment from 'moment';
import { CalendarDate } from '../dashboard/calendar/calendar.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit{
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  searchText: string = '';
  previous: string;
  datePicker = false;
  date = moment();
  weeks: CalendarDate[][] = [];
  popupXPosition = '';
  popupYPosition = '';
  public minDate: Date = new Date ("01/01/0001");
  public maxDate: Date = new Date ("12/31/2099");
  public dateValue: Date = new Date ("05/16/2017");
  addNewForm: FormGroup;
  editForm: FormGroup;
  disabledAddButton = true;
  disableEditButton = false;
  editComplianceObject: any;
  idForDelete: any;
  arrayBuffer:any;
  file:File;
  complianceList = [];
  

  constructor(private toast: ToastrService, private cdRef: ChangeDetectorRef, private dashboardService : DashboardService) { }

  @HostListener('input') oninput() {
    this.searchItems();

    if(this.addNewForm.valid){
      this.disabledAddButton = false;
    }else{
      this.disabledAddButton = true;
    }

    if(this.editForm.valid){
      this.disableEditButton = false;
    }else{
      this.disableEditButton = true;
    }
  }

  ngOnInit() {
    this.dashboardService.complianceList.subscribe(list => {
      let size = this.complianceList.length;
      for(let i = 0; i < size; ++i){
        this.complianceList.pop();
      }
      list.forEach(compliance => {
        this.complianceList.push(compliance);
      });
      this.mdbTable.setDataSource(this.complianceList);
      this.complianceList = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    });
    
    this.addNewForm = new FormGroup({
      addNewCompanyName: new FormControl('', Validators.required),
      addNewDepartment: new FormControl('', Validators.required),
      addNewAct: new FormControl('', Validators.required),
      addNewSection: new FormControl('', Validators.required),
      addNewName: new FormControl('', Validators.required),
      addNewDueDate: new FormControl('', Validators.required),
      addNewFormName: new FormControl('', Validators.required),
      addNewFrequency: new FormControl('', Validators.required)
    });

    this.editComplianceObject = {
      id: "",
      company: "Company Name",
      department: "Department",
      name: "Compliance Name",
      dueDate: "Due Date",
      act: "Act",
      section: "Section",
      formName: "Form Name",
      frequency: "Frequency"
    };

    this.editForm = new FormGroup({
      editCompanyName: new FormControl(this.editComplianceObject['company'], Validators.required),
      editDepartment : new FormControl(this.editComplianceObject['department'], Validators.required),
      editAct: new FormControl(this.editComplianceObject['act'], Validators.required),
      editSection: new FormControl(this.editComplianceObject['section'], Validators.required),
      editName: new FormControl(this.editComplianceObject['name'], Validators.required),
      editDueDate: new FormControl(this.editComplianceObject['dueDate'], Validators.required),
      editFormName: new FormControl(this.editComplianceObject['formName'], Validators.required),
      editFrequency: new FormControl(this.editComplianceObject['frequency'], Validators.required)
    });

    
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }
  
  get addNewCompanyName() {
    return this.addNewForm.get('addNewCompanyName');
  }

  get addNewDepartment() {
    return this.addNewForm.get('addNewDepartment');
  }

  get addNewAct() {
    return this.addNewForm.get('addNewAct');
  }

  get addNewSection(){
    return this.addNewForm.get('addNewSection');
  }

  get addNewName(){
    return this.addNewForm.get('addNewName');
  }

  get addNewDueDate(){
    return this.addNewForm.get('addNewDueDate');
  }

  get addNewFormName() {
    return this.addNewForm.get('addNewFormName');
  }

  get addNewFrequency() {
    return this.addNewForm.get('addNewFrequency');
  }

  get editCompanyName() {
    return this.editForm.get('editCompanyName');
  }

  get editDepartment() {
    return this.editForm.get('editDepartment');
  }

  get editAct() {
    return this.editForm.get('editAct');
  }

  get editSection(){
    return this.editForm.get('editSection');
  }

  get editName(){
    return this.editForm.get('editName');
  }

  get editDueDate(){
    return this.editForm.get('editDueDate');
  }

  get editFormName() {
    return this.editForm.get('editFormName');
  }

  get editFrequency() {
    return this.editForm.get('editFrequency');
  }

  searchItems() {
      const prev = this.mdbTable.getDataSource();
  
      if (!this.searchText) {
        this.mdbTable.setDataSource(this.previous);
        this.complianceList = this.mdbTable.getDataSource();
      }
  
      if (this.searchText) {
        this.complianceList = this.mdbTable.searchLocalDataBy(this.searchText);
        this.mdbTable.setDataSource(prev);
      }
  }

  addNewCompliance(){
    var newCompliance = {
      company : this.addNewForm.get('addNewCompanyName').value,
      department : this.addNewForm.get('addNewDepartment').value,
      act : this.addNewForm.get('addNewAct').value,
      section : this.addNewForm.get('addNewSection').value,
      name : this.addNewForm.get('addNewName').value,
      dueDate : moment(this.addNewForm.get('addNewDueDate').value).format('YYYY/MM/DD'),
      formName : this.addNewForm.get('addNewFormName').value,
      frequency : this.addNewForm.get('addNewFrequency').value
    };
    firebase.database().ref('/ComplianceMaster').push(newCompliance);
    this.toast.success("New Compliance added successfully!!!");
  }

  checkFormValid(){
    if(this.addNewForm.valid){
      this.disabledAddButton = false;
    }else{
      this.disabledAddButton = true;
    }
    if(this.editForm.valid){
      this.disableEditButton = false;
    }else{
      this.disableEditButton = true;
    }
  }

  initializeEditObject(compliance){
    this.editComplianceObject = {
      id: compliance['id'],
      company: compliance['company'],
      department: compliance['department'],
      act: compliance['act'],
      dueDate: compliance['dueDate'],
      section: compliance['section'],
      name: compliance['name'],
      formName: compliance['formName'],
      frequency: compliance['frequency']
    };
    console.log(this.editComplianceObject);
  }

  editCompliance(){
    let updatedCompliance = {
      company : this.editComplianceObject['company'],
      department : this.editComplianceObject['department'],
      act : this.editComplianceObject['act'],
      section : this.editComplianceObject['section'],
      name : this.editComplianceObject['name'],
      dueDate : moment(this.editComplianceObject['dueDate'],).format('YYYY/MM/DD'),
      formName : this.editComplianceObject['formName'],
      frequency : this.editComplianceObject['frequency']
    };
    firebase.database().ref('/ComplianceMaster').child(this.editComplianceObject['id']).update(updatedCompliance);
    this.toast.success("Compliance edited successfully!!!");
    return true;
  }

  setIdForDelete(id){
    this.idForDelete = id;
  }

  deleteCompliance(){
    firebase.database().ref('/ComplianceMaster').child(this.idForDelete).set(null);
    this.toast.success("Compliance deleted successfully!!!");
    this.idForDelete = '';
  }

  incomingfile(event) 
  {
    this.file= event.target.files[0]; 
  }

  Upload() 
  {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        let sheet = XLSX.utils.sheet_to_json(worksheet,{raw:true});
        let ref = firebase.database().ref('/LookUpCompliance');
        sheet.forEach(row => {
          if(row['Compliance Name'] != null && row['Compliance Name'] !== ''
              && row['Due Date'] != null && row['Due Date'] !== '' 
              && row['Frequency'] != null && row['Frequency'] !== '')
          {
            var newCompliance = {
              company : row['Company Name'] == null ? "" : row['Company Name'],
              act : row['Act'] == null? "" : row['Act'],
              section : row['Section'] == null ? "" : row['Section'],
              name : row['Compliance Name'],
              dueDate : row['Due Date'],
              frequency : row['Frequency']
            };
            ref.push(newCompliance);
          }
        });

        this.toast.success("All Compliance added successfully!!!");
    }
    fileReader.readAsArrayBuffer(this.file);
  }
}