import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// interface ComplianceDateMapper{
//   date : string;
//   compliance : [];
// }

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class DashboardService{
  private complianceListSource = new BehaviorSubject<any>([]);
  complianceList = this.complianceListSource.asObservable();

  private complianceDateListSource = new BehaviorSubject<any>([]);
  complianceDateList = this.complianceDateListSource.asObservable();

  private complianceDateMapperSource = new BehaviorSubject<any>({});
  complianceDateMapper = this.complianceDateMapperSource.asObservable();

  constructor(){}

  setComplianceList(complianceList : any){
      this.complianceListSource.next(complianceList);
  }

  setComplianceDateList(complianceDateList : any){
    this.complianceDateListSource.next(complianceDateList);
  }

  setComplianceDateMapper(complianceDateMapper : any){
    this.complianceDateMapperSource.next(complianceDateMapper);
  }
}