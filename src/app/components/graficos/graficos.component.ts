import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styles: []
})
export class GraficosComponent implements OnInit {

  @Input() public ChartLabels: Label[] = [];
  @Input() public ChartData: MultiDataSet = [ ];
  @Input() public ChartType: ChartType = 'doughnut';


  constructor() { }

  ngOnInit() {
  }

}
