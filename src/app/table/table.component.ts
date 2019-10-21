import { Component, ViewChild, HostListener, ChangeDetectorRef, AfterViewInit, Input, Inject } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import * as firebase from "firebase/app";
import "firebase/database";
import * as moment from 'moment';
import { CalendarDate } from '../dashboard/calendar/calendar.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard/dashboard.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

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
  complianceMasterList = [];
  companyName : string = '';
  departmentName : string = '';
  companyId : string ='';
  departmentId : string = '';
  

  constructor(private toast: ToastrService, private cdRef: ChangeDetectorRef, private dashboardService : DashboardService, @Inject(SESSION_STORAGE) private storage: WebStorageService) { 
    this.companyName = storage.get('company');
    this.departmentName = storage.get('department');
    this.companyId = storage.get('companyId');
    this.departmentId = storage.get('departmentId');
  }

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
      this.complianceList = [];
      list.forEach(compliance => {
        this.complianceList.push(compliance);
      });
      this.mdbTable.setDataSource(this.complianceList);
      this.complianceList = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    });

    this.dashboardService.complianceMasterList.subscribe(list => {
      this.complianceMasterList = [];
      list.forEach(compliance => {
        this.complianceMasterList.push(compliance);
      });
    });
    
    this.addNewForm = new FormGroup({
      addNewCompanyName: new FormControl(this.companyName, Validators.required),
      addNewDepartment: new FormControl(this.departmentName, Validators.required),
      addNewAct: new FormControl('', Validators.required),
      addNewSection: new FormControl('', Validators.required),
      addNewComplainceList: new FormControl('', Validators.required),
      addNewDueDate: new FormControl('', Validators.required),
      addNewFormName: new FormControl('', Validators.required),
      addNewFrequency: new FormControl('', Validators.required)
    });

    this.addNewForm.controls['addNewCompanyName'].disable();
    this.addNewForm.controls['addNewDepartment'].disable();
    this.addNewForm.controls['addNewAct'].disable();
    this.addNewForm.controls['addNewSection'].disable();
    this.addNewForm.controls['addNewFormName'].disable();

    this.editComplianceObject = {
      id: "",
      company: this.companyName,
      department: this.departmentName,
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

    this.editForm.controls['editCompanyName'].disable();
    this.editForm.controls['editDepartment'].disable();
    this.editForm.controls['editAct'].disable();
    this.editForm.controls['editSection'].disable();
    this.editForm.controls['editFormName'].disable();
    
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

  get addNewComplainceList(){
    return this.addNewForm.get('addNewComplainceList');
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
      compliance : this.addNewForm.get('addNewComplainceList').value,
      dueDate : moment(this.addNewForm.get('addNewDueDate').value).format('YYYY/MM/DD'),
      frequency : this.addNewForm.get('addNewFrequency').value
    };
    let complianceRef = firebase.database().ref('/ComplianceMain').child(this.companyId).child(this.departmentId).push(newCompliance);
    let newComplianceFrequencyMaster = {
      nextEmailDate : moment(this.addNewForm.get('addNewDueDate').value).subtract(1, 'month').format('YYYY/MM/DD')
    }
    firebase.database().ref('/FrequencyMaster').child(complianceRef.key).set(newComplianceFrequencyMaster);
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
  }

  editCompliance(){
    let updatedCompliance = {
      compliance : this.editComplianceObject['name'],
      dueDate : moment(this.editComplianceObject['dueDate']).format('YYYY/MM/DD'),
      frequency : this.editComplianceObject['frequency']
    };

    let updateFrequencyMaster = {
      nextEmailDate : moment(this.editComplianceObject['dueDate']).subtract(1, 'month').format('YYYY/MM/DD')
    };
    firebase.database().ref('/ComplianceMain').child(this.companyId).child(this.departmentId).child(this.editComplianceObject['id']).update(updatedCompliance);
    firebase.database().ref('/FrequencyMaster').child(this.editComplianceObject['id']).update(updateFrequencyMaster);
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

  updateAddNewFormFields(){
    let id = this.addNewForm.get('addNewComplainceList').value;
    let compliances = this.complianceMasterList.filter(c => c.id === id);

    if(compliances.length > 0){
      let compliance = compliances[0];
      this.addNewForm.controls['addNewAct'].setValue(compliance['act']);
      this.addNewForm.controls['addNewSection'].setValue(compliance['section']);
      this.addNewForm.controls['addNewFormName'].setValue(compliance['formName']);
    }  
  }

  updateEditFormFields(){
    let id = this.editForm.get('editName').value;
    let compliances = this.complianceMasterList.filter(c => c.id === id);

    if(compliances.length > 0){
      let compliance = compliances[0];
      this.editForm.controls['editAct'].setValue(compliance['act']);
      this.editForm.controls['editSection'].setValue(compliance['section']);
      this.editForm.controls['editFormName'].setValue(compliance['formName']);
    }  
  }
}