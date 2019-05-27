import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Periodo } from 'src/app/models/periodo.model';
import { ParticipationPeriodService } from '../../services/participationPeriod/participation-period.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styles: []
})
export class PeriodosComponent implements OnInit {

  periodos: Periodo[] = [];
  periodo: Periodo = new Periodo('', '', '', true, '');
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  modalCreate: string = 'ocultar';
  modalUpdate: string = 'ocultar';
  form: FormGroup;

  constructor(
    // tslint:disable-next-line:variable-name
    public _participationPeriodService: ParticipationPeriodService
  ) { }

  ngOnInit() {
    this.cargarPeriodos();

    this.form = new FormGroup({
      period: new FormControl( null, Validators.required ),
      year: new FormControl( null, Validators.required ),
      dateVoting: new FormControl( null, Validators.required)
    });

  }

  hideModalCreate() {
    this.modalCreate = 'ocultar';
  }

  showModalCreate() {
    this.modalCreate = '';
  }

  hideModalUpdate() {
    this.modalUpdate = 'ocultar';
  }

  showModalUpdate( periodo: Periodo ) {
    this.periodo = periodo;
    this.modalUpdate = '';
  }

  cargarPeriodos() {

    this.cargando = true;

    this._participationPeriodService.cargarPeriodos( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.periodos = resp.periods;
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
    this.cargarPeriodos();
  }

  borrarPeriodo( periodo: Periodo ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: '¿Está seguro que desea eliminar el periodo de participación',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Asi es',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this._participationPeriodService.borrarPeriodo( periodo._id )
                            .subscribe( borrado => {
                              console.log(borrado);
                              this.cargarPeriodos();
                            });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El periodo de participación ha sido eliminado',
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

  actualizarPeriodo( periodo: Periodo ) {

    this.periodo.period = periodo.period;
    this.periodo.year = periodo.year;
    this.periodo.dateVoting = periodo.dateVoting;

    this._participationPeriodService.actualizarPeriodo( this.periodo )
                        .subscribe(resp => {
                          Swal.fire({
                            type: 'success',
                            title: 'Periodo de Participación Actualizado',
                            text: this.periodo.period
                          });
                          this.cargarPeriodos();
                          this.hideModalUpdate();
                        });
  }

  crearPeriodo() {

    if (this.form.invalid) {
      return;
    }

    // tslint:disable-next-line:prefer-const
    let periodo = new Periodo(
      this.form.value.period,
      this.form.value.year,
      this.form.value.dateVoting
    );

    this._participationPeriodService.crearPeriodo(periodo)
                                .subscribe( resp => {
                                  Swal.fire({
                                    type: 'success',
                                    title: 'Perfil Politico Creado',
                                    text: periodo.period
                                  });
                                  this.hideModalCreate();
                                  this.cargarPeriodos();
                                });
  }


}
