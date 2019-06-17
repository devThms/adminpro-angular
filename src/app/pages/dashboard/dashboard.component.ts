import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Label } from 'ng2-charts';

// Models
import { Perfil } from '../../models/perfil.model';
import { Centro } from '../../models/centro.model';

// Services
import {
  PoliticalProfileService,
  VotingControlService,
  VotingCenterService,
  VotingTotalService
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
  centros: Centro[] = [];
  perfil: Perfil = new Perfil('', '');
  centro: Centro = new Centro('', '', null);

  votosRegistrados: any[] = [];
  totalVotosRegistrados: any[] = [];
  totalVotos: number[] = [];
  desde: number = 0;
  limite: number = 0;

  validator: boolean = false;

  // Ng2-Charts Votos
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public chartColors: any[] = [
    {
      backgroundColor: []
    }];

  public barChartData: ChartDataSets[] = [
    { data: [],
      label: 'Votos Registrados'
    }
  ];

  constructor(
    // tslint:disable-next-line:variable-name
    public _politicalProfileService: PoliticalProfileService,
    // tslint:disable-next-line:variable-name
    public _votingCenterService: VotingCenterService,
    // tslint:disable-next-line:variable-name
    public _votingControlService: VotingControlService,
    // tslint:disable-next-line:variable-name
    public _votingTotalService: VotingTotalService
  ) { }

  ngOnInit() {

    this._politicalProfileService.cargarPerfiles( this.desde )
                        .subscribe( (resp: any) => {
                          this.perfiles = resp.profiles;
                        });

    this._votingCenterService.cargarCentros( this.desde, this.limite )
                        .subscribe( (resp: any) => {
                          this.centros = resp.centers;
                        });

  }


   // events
   public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  cambioPerfil( profileId: string ) {

    if (profileId) {

      this.perfil._id = profileId;

      this._votingControlService.ObtenerVotos( this.perfil._id)
                                .subscribe( (resp: any) => {
                                  this.votosRegistrados = resp.votosRegistrados;
                                  if (this.votosRegistrados.length < 1) {
                                    this.vaciarData();
                                    this.inicializarData(this.totalVotos);
                                  } else {
                                    this.cargarData();
                                    this.inicializarData(this.totalVotos);
                                  }
                                });

      this.validator = true;
    } else {
      this.validator = false;
      // TODO: limpiar la data del gráfico
      this.vaciarData();
      return;
    }

  }

  obtenerVotosCentro( centerId: string ) {

    this.centro._id = centerId;

    this._votingControlService.ObtenerVotosCentro( this.perfil._id, this.centro._id )
                              .subscribe( (resp: any) => {
                                this.votosRegistrados = resp.votosRegistrados;
                                if (this.votosRegistrados.length < 1) {
                                  this.vaciarData();
                                  this.inicializarData(this.totalVotos);
                                } else {
                                  this.cargarData();
                                  this.inicializarData(this.totalVotos);
                                }

                              });
  }


  inicializarData( data: number[] ) {
    setTimeout(() => {
      this.chart.chart.data.datasets[0].data = data;
      this.chart.chart.update();
    }, 100);
  }

  cargarData() {

      if ( this.votosRegistrados.length > 0 ) {
        // tslint:disable-next-line:prefer-for-of
        for ( let i = 0; i < this.votosRegistrados.length; i++ ) {
          this.barChartData[0].data.pop();
          this.chartColors[0].backgroundColor.pop();
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.votosRegistrados.length; i++ ) {
        this.barChartLabels[i] = this.votosRegistrados[i].partidos[0].name;
        this.chartColors[0].backgroundColor.push(this.votosRegistrados[i].partidos[0].color);
        this.totalVotos[i] = this.votosRegistrados[i].totalVotos;
      }
      this.totalVotos.push(1);

  }

  vaciarData() {

    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.totalVotos.length; i++ ) {
      this.barChartData[0].data.pop();
      this.chartColors[0].backgroundColor.pop();
    }
    this.totalVotos = [];

  }

}
