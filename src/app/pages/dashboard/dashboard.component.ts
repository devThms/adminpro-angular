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
  totalVotos: number[] = [];
  desde: number = 0;

  validator: boolean = false;
  widthCard: string = 'col-md-12 col-sm-12';


  // Ng2-Charts
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
      backgroundColor: ['#FF7360', '#6FC8CE', '#FAFFF2', '#FFFCC4', '#6FC8E0', '#6FC698',
      '#6FC9E0', '#6FC8E0', '#H568E0', '#T96960', '#GTG666', '#FFF963', '#HHH965', '#FFF695',
      '#000986', '#FFF783']
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
    public _votingControlService: VotingControlService
  ) { }

  ngOnInit() {

    this._politicalProfileService.cargarPerfiles( this.desde )
                        .subscribe( (resp: any) => {
                          this.perfiles = resp.profiles;
                        });

    this._votingCenterService.cargarCentros( this.desde )
                        .subscribe( (resp: any) => {
                          this.centros = resp.centers;
                        });

    // this.inicializarData(this.totalVotos);
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
      console.log(profileId);

      this._votingControlService.ObtenerVotos( this.perfil._id)
                                .subscribe( (resp: any) => {
                                  this.votosRegistrados = resp.votosRegistrados;
                                  console.log(this.votosRegistrados);
                                  this.cargarData();
                                  this.inicializarData(this.totalVotos);
                                });

      this.validator = true;
      this.widthCard = 'col-md-9 col-sm-12';
    } else {
      this.validator = false;
      this.widthCard = 'col-md-12 col-sm-12';
      // TODO Vaciar la data de la gráfica
      return;
    }

  }

  obtenerVotosCentro( centerId: string ) {

    this.centro._id = centerId;

    this._votingControlService.ObtenerVotosCentro( this.perfil._id, this.centro._id )
                              .subscribe( (resp: any) => {
                                this.votosRegistrados = resp.votosRegistrados;
                                console.log(this.votosRegistrados);
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
