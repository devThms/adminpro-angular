import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Partido } from '../../models/partido.model';
import { PoliticalPartyService } from '../../services/politicalParty/political-party.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styles: []
})
export class PartidosComponent implements OnInit {

  partidos: Partido[] = [];
  partido: Partido = new Partido('', '', '', '', '', '', true, '');
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  modalCreate: string = 'ocultar';
  modalUpdate: string = 'ocultar';
  form: FormGroup;

  constructor(
    // tslint:disable-next-line:variable-name
    public _politicalPartyService: PoliticalPartyService,
    // tslint:disable-next-line:variable-name
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarPartidos();

    this._modalUploadService.notification
                            .subscribe( () => this.cargarPartidos());

    this.form = new FormGroup({
      name: new FormControl( null, Validators.required ),
      address: new FormControl( null, Validators.required ),
      phone: new FormControl( null, Validators.required ),
      color: new FormControl( null, Validators.required ),
      foundation: new FormControl( null, Validators.required )
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

  showModalUpdate( partido: Partido ) {
    this.partido = partido;
    this.modalUpdate = '';
  }

  showModal( partido: Partido ) {
    this._modalUploadService.showModal( 'partidos', partido._id );
  }


  cargarPartidos() {

    this.cargando = true;

    this._politicalPartyService.cargarPartidos( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.partidos = resp.politicals;
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
    this.cargarPartidos();
  }

  buscarPartido( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarPartidos();
      return;
    }

    this._politicalPartyService.buscarPartido( termino )
                        .subscribe( (partidos: Partido[]) => {
                          this.partidos = partidos;
                        });
  }

  borrarPartido( partido: Partido ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: '¿Está seguro que desea eliminar el partido politico',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Asi es',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this._politicalPartyService.borrarPartido( partido._id )
                            .subscribe( borrado => {
                              console.log(borrado);
                              this.cargarPartidos();
                            });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El partido politico ha sido eliminado',
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

  actualizarPartido( partido: Partido ) {

    this.partido.name = partido.name;
    this.partido.address = partido.address;
    this.partido.phone = partido.phone;
    this.partido.color = partido.color;
    this.partido.foundation = partido.foundation;

    this._politicalPartyService.actualizarPartido( this.partido )
                        .subscribe(resp => {
                          Swal.fire({
                            type: 'success',
                            title: 'Partido Politico Actualizado',
                            text: this.partido.name
                          });
                          this.cargarPartidos();
                          this.hideModalUpdate();
                        });
  }

  crearPartido() {

    if (this.form.invalid) {
      return;
    }

    // tslint:disable-next-line:prefer-const
    let partido = new Partido(
      this.form.value.name,
      this.form.value.address,
      this.form.value.phone,
      this.form.value.color,
      this.form.value.foundation
    );

    this._politicalPartyService.crearPartido(partido)
                                .subscribe( resp => {
                                  Swal.fire({
                                    type: 'success',
                                    title: 'Partido Politico Creado',
                                    text: partido.name
                                  });
                                  this.hideModalCreate();
                                  this.cargarPartidos();
                                });

  }


}
