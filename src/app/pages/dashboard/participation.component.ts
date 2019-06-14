import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective } from 'ng2-charts';

import { VotingCenterService,
         VotingTotalService,
         PoliticalProfileService
        } from '../../services/service.index';

import { Perfil } from '../../models/perfil.model';
import { Centro } from '../../models/centro.model';

@Component({
  selector: 'app-participation',
  templateUrl: './participation.component.html',
  styles: []
})
export class ParticipationComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  // Data de BD
  perfiles: Perfil[] = [];
  centros: Centro[] = [];
  perfil: Perfil = new Perfil('', '');
  centro: Centro = new Centro('', '', null);

  totalVotosRegistrados: any[] = [];
  totalVotos: number[] = [];
  desde: number = 0;

  validator: boolean = false;

  // Ng2-Charts Votos
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };

  public barChartLabels: Label[] = ['Votos'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public chartColors: any[] = [
  //   {
  //     backgroundColor: ['#FF7360', '#6FC8CE', '#FAFFF2', '#FFFCC4', '#6FC8E0', '#6FC698',
  //     '#6FC9E0', '#6FC8E0', '#H568E0', '#T96960', '#GTG666', '#FFF963', '#HHH965', '#FFF695',
  //     '#000986', '#FFF783']
  //   }];

  public barChartData: ChartDataSets[] = [
    { data: [],
      label: 'Votos Validos'
    },
    {
      data: [],
      label: 'Votos Nulos'
    },
    {
      data: [],
      label: 'Votos en Blanco'
    },
    {
      data: [],
      label: 'Votos Impugnados'
    }

  ];


  constructor(
    // tslint:disable-next-line:variable-name
    public _politicalProfileService: PoliticalProfileService,
    // tslint:disable-next-line:variable-name
    public _votingCenterService: VotingCenterService,
    // tslint:disable-next-line:variable-name
    public _votingTotalService: VotingTotalService

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

      this._votingTotalService.obtenerTotalVotos( this.perfil._id )
                                .subscribe( (resp: any) => {
                                  this.totalVotosRegistrados = resp.totalVotos;
                                  console.log(this.totalVotosRegistrados);
                                  if (Object.keys(this.totalVotosRegistrados).length === 0) {
                                    this.inicializarData();
                                  } else {
                                    this.inicializarData();
                                  }
                                });

      this.validator = true;
    } else {
      this.validator = false;
      // TODO: limpiar la data del gráfico
      return;
    }

  }

  obtenerVotosCentro( centerId: string ) {

    this.centro._id = centerId;

    this._votingTotalService.obtenerTotalVotosCentro( this.perfil._id, this.centro._id )
                              .subscribe( (resp: any) => {
                                this.totalVotosRegistrados = resp.totalVotos;
                                console.log(this.totalVotosRegistrados);
                                if (Object.keys(this.totalVotosRegistrados).length === 0) {
                                  this.inicializarData();
                                } else {
                                  this.inicializarData();
                                }

                              });
  }


  inicializarData() {
    setTimeout(() => {

      if (Object.keys(this.totalVotosRegistrados).length === 0 ) {
        this.chart.chart.data.datasets[0].data = [];
        this.chart.chart.data.datasets[1].data = [];
        this.chart.chart.data.datasets[2].data = [];
        this.chart.chart.data.datasets[3].data = [];
        this.chart.chart.update();
      } else {
        this.chart.chart.data.datasets[0].data = [this.totalVotosRegistrados[0].votosValidos];
        this.chart.chart.data.datasets[1].data = [this.totalVotosRegistrados[0].votosNulos];
        this.chart.chart.data.datasets[2].data = [this.totalVotosRegistrados[0].votosBlancos];
        this.chart.chart.data.datasets[3].data = [this.totalVotosRegistrados[0].votosImpugnacion];
        this.chart.chart.update();
      }

    }, 1000);
  }


}
