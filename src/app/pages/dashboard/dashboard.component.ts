import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Label } from 'ng2-charts';

// Models
import { Perfil } from '../../models/perfil.model';

// Services
import {
  PoliticalProfileService,
  VotingControlService,
 } from '../../services/service.index';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  // Data de BD
  perfiles: Perfil[] = [];
  votosRegistrados: any[] = [];
  totalVotos: number[] = [];

  desde: number = 0;

  // Ng2-Charts
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [],
      label: 'Votos Registrados'
    }
  ];

  constructor(
    // tslint:disable-next-line:variable-name
    public _politicalProfileService: PoliticalProfileService,
    // tslint:disable-next-line:variable-name
    public _votingControlService: VotingControlService
  ) { }

  ngOnInit() {

    this._politicalProfileService.cargarPerfiles( this.desde )
                        .subscribe( (resp: any) => {
                          this.perfiles = resp.profiles;
                        });

    this.inicializarData(this.totalVotos);
  }


   // events
   public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  cambioPerfil( profileId: string ) {

    this._votingControlService.ObtenerVotos( profileId )
                              .subscribe( (resp: any) => {
                                this.votosRegistrados = resp.votosRegistrados;
                                this.cargarData();
                                this.inicializarData(this.totalVotos);
                              });
  }

  inicializarData( data: number[] ) {
    setTimeout(() => {
      this.chart.chart.data.datasets[0].data = data;
      this.chart.chart.update();
  }, 1000);

  }

  cargarData() {

    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.votosRegistrados.length; i++ ) {
      this.barChartLabels[i] = this.votosRegistrados[i].partidos[0].name;
      this.totalVotos[i] = this.votosRegistrados[i].totalVotos;
    }
    this.totalVotos.push(1);

  }

}
