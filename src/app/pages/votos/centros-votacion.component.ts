import { Component, OnInit } from '@angular/core';

import { Centro } from 'src/app/models/centro.model';
import { VotingCenterService } from '../../services/votingCenter/voting-center.service';

@Component({
  selector: 'app-centros-votacion',
  templateUrl: './centros-votacion.component.html',
  styles: []
})
export class CentrosVotacionComponent implements OnInit {

  centros: Centro[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;


  constructor(
    // tslint:disable-next-line:variable-name
    public _votingCenterService: VotingCenterService
  ) { }

  ngOnInit() {
    this.cargarCentros();
  }

  cargarCentros() {

    this.cargando = true;

    this._votingCenterService.cargarCentros( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.centros = resp.centers;
                          this.cargando = false;
                        });

  }

  cambiarDesde( valor: number ) {

    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarCentros();
  }

  buscarCentro( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarCentros();
      return;
    }

    this._votingCenterService.buscarCentro( termino )
                        .subscribe( (centros: Centro[]) => {
                          this.centros = centros;
                        });
  }


}
