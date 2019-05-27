import { Component, OnInit } from '@angular/core';

import { Candidato } from '../../models/candidato.model';
import { CandidateService } from '../../services/candidate/candidate.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styles: []
})
export class CandidatosComponent implements OnInit {

  candidatos: Candidato[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;


  constructor(
    // tslint:disable-next-line:variable-name
    public _candidateService: CandidateService
  ) { }

  ngOnInit() {
    this.cargarCandidatos();

  }


  cargarCandidatos() {

    this.cargando = true;

    this._candidateService.cargarCandidatos( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.candidatos = resp.candidates;
                          console.log(this.candidatos);
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
    this.cargarCandidatos();
  }

  buscarCandidato( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarCandidatos();
      return;
    }

    this._candidateService.buscarCandidato( termino )
                        .subscribe( (candidatos: Candidato[]) => {
                          this.candidatos = candidatos;
                        });
  }

  borrarCandidato( candidato: Candidato ) {

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

        this._candidateService.borrarCandidato( candidato._id )
                            .subscribe( borrado => {
                              console.log(borrado);
                              this.cargarCandidatos();
                            });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El candidato politico ha sido eliminado',
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
