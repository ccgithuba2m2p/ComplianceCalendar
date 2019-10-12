import { Component } from '@angular/core';

@Component({
  selector: 'piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss'],
})
export class PieChartComponent {
  public chartType: string = 'pie';

  public chartDatasets: Array<any> = [
    { data: [50, 100], label: 'My First dataset' }
  ];

  public chartLabels: Array<any> = ['Compliance', 'Non-Compliance'];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#701fce', '#949FB1'],
      hoverBackgroundColor: ['#701F9D', '#343a40'],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true,
    is3D: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}