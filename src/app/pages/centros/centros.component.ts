import { Component, OnInit } from '@angular/core';

import { Centro } from 'src/app/models/centro.model';
import { VotingCenterService } from '../../services/votingCenter/voting-center.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-centros',
  templateUrl: './centros.component.html',
  styles: []
})
export class CentrosComponent implements OnInit {

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

  borrarCentro( centro: Centro ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: '¿Está seguro que desea eliminar el candidato politico',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Asi es',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this._votingCenterService.borrarCentro( centro._id )
                            .subscribe( borrado => {
                              this.cargarCentros();
                            });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El centro de votación ha sido eliminado',
          'success'
        );

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Accion cancelada por el usuario',
          'error'
        );
      }
    });

  }



}
