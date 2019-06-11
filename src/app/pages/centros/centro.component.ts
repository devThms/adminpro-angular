import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Mesa } from '../../models/mesa.model';
import { Rango } from '../../models/rangoMesa.model';
import { Centro } from '../../models/centro.model';
import { VotingCenterService } from '../../services/votingCenter/voting-center.service';
import { RangeTablesService } from '../../services/votingCenter/range-tables.service';
import { TableService } from '../../services/votingCenter/table.service';


import Swal from 'sweetalert2';
import { $ } from 'protractor';
import { getLocaleNumberFormat } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-centro',
  templateUrl: './centro.component.html',
  styles: []
})
export class CentroComponent implements OnInit {

  @ViewChild(ModalComponent) modal: ModalComponent;

  mesas: Mesa[] = [];
  mesa: Mesa = new Mesa(null, null);
  rango: Rango = new Rango(0, 0, '', true, '');
  centro: Centro = new Centro('', '', 0);
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  modalCreate: string = 'ocultar';
  modalUpdate: string = 'ocultar';


  constructor(
    // tslint:disable-next-line:variable-name
    public _votingCenterService: VotingCenterService,
    // tslint:disable-next-line:variable-name
    public _rangeTableService: RangeTablesService,
    // tslint:disable-next-line:variable-name
    public _tableService: TableService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {

      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:no-string-literal
      const id = params['id'];

      if ( id !== 'nuevo' ) {
        this.obtenerCentro(id);
        this.obtenerRango(id);
        this.cargarMesas(id);
      }

    });
   }

  ngOnInit() {
  }

  obtenerCentro( id: string ) {

    this._votingCenterService.obtenerCentro( id )
          .subscribe( center => {
            this.centro = center;
          });

  }

  obtenerRango( id: string ) {

    this._rangeTableService.obtenerRango( id )
          .subscribe( range => {
            this.rango = range;
            this.rango.center = range.center._id;
          });

  }

  cargarMesas( id: string ) {

    this.cargando = true;

    this._tableService.cargarMesas( this.desde, id )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.mesas = resp.tables;
                          this.cargando = false;
                        });

  }

  crearCentro( centro: Centro ) {

    this.centro = centro;

    this._votingCenterService.crearCentro( this.centro )
                          .subscribe( center => {
                            this.centro = center;
                            this.router.navigate(['/centro', center._id]);
                          });


  }

  crearRango( rango: Rango ) {

    this.rango = rango;

    this._rangeTableService.crearRango( this.rango )
                          .subscribe( range => {
                            this.rango = range;
                          });


  }

  // Servicios para Mesas de Votación

  hideModalCreate( mesa: Mesa ) {
    this.mesa.localNumber = null;
    this.mesa.nationalNumber = null;
    this.modalCreate = 'ocultar';
    this.cargarMesas(this.centro._id);
  }

  showModalCreate() {
    this.modalCreate = '';
  }

  hideModalUpdate( mesa: Mesa ) {
    mesa.localNumber = null;
    mesa.nationalNumber = null;
    this.modalUpdate = 'ocultar';
    this.cargarMesas(this.centro._id);

  }

  showModalUpdate( mesa: Mesa ) {
    this.mesa = mesa;
    this.modalUpdate = '';
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
    this.cargarMesas(this.centro._id);
  }


  crearMesa( mesa: Mesa) {

    this.mesa.localNumber = mesa.localNumber;
    this.mesa.nationalNumber = mesa.nationalNumber;
    this.mesa.center = this.centro._id;

    console.log(this.mesa);

    this._tableService.crearMesa(this.mesa)
                                .subscribe( resp => {
                                  Swal.fire({
                                    type: 'success',
                                    title: 'Mesa de Votación Creada',
                                    text: 'Mesa Local No. ' + mesa.localNumber
                                  });
                                  this.hideModalCreate(mesa);
                                  this.cargarMesas(this.mesa.center);
                                });

    this.mesa.localNumber = null;
    this.mesa.nationalNumber = null;

  }

  buscarMesa( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMesas(this.centro._id);
      return;
    }

    this._tableService.buscarMesa( termino )
                        .subscribe( (mesas: Mesa[]) => {
                          this.mesas = mesas;
                        });
  }

  borrarMesa( mesa: Mesa ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: '¿Está seguro que desea eliminar la mesa de votación',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Asi es',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this._tableService.borrarMesa( mesa._id )
                            .subscribe( borrado => {
                              this.cargarMesas(this.centro._id);
                            });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'La mesa de votación ha sido eliminada',
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

  actualizarMesa( mesa: Mesa ) {

    this.mesa.localNumber = mesa.localNumber;
    this.mesa.nationalNumber = mesa.nationalNumber;
    this.mesa.center = this.centro._id;
    this.mesa.is_closed = mesa.is_closed;

    this._tableService.actualizarMesa( this.mesa )
                        .subscribe(resp => {
                          Swal.fire({
                            type: 'success',
                            title: 'Mesa de Votación Actualizada',
                            text: 'Mesa Local No. ' + mesa.localNumber
                          });
                          this.cargarMesas(this.centro._id);
                          this.hideModalUpdate(mesa);
                        });

    mesa.localNumber = null;
    mesa.nationalNumber = null;
  }




}
