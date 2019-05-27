import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Perfil } from '../../models/perfil.model';
import { PoliticalProfileService } from '../../services/politicalProfile/political-profile.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styles: []
})


export class PerfilesComponent implements OnInit {

  perfiles: Perfil[] = [];
  perfil: Perfil = new Perfil('', '', true, '');
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  modalCreate: string = 'ocultar';
  modalUpdate: string = 'ocultar';
  form: FormGroup;

  constructor(
    // tslint:disable-next-line:variable-name
    public _politicalProfileService: PoliticalProfileService
  ) { }

  ngOnInit() {
    this.cargarPerfiles();

    this.form = new FormGroup({
      name: new FormControl( null, Validators.required ),
      summary: new FormControl( null, Validators.required )
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

  showModalUpdate( perfil: Perfil ) {
    this.perfil = perfil;
    this.modalUpdate = '';
  }


  cargarPerfiles() {

    this.cargando = true;

    this._politicalProfileService.cargarPerfiles( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.perfiles = resp.profiles;
                          this.cargando = false;
                        });
  }

  // obtenerPerfil( id: string ) {
  //   this._politicalProfileService.obtenerPerfil( id )
  //                               .subscribe( resp => this.perfil = resp.profile );
  // }

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
    this.cargarPerfiles();
  }

  buscarPerfil( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarPerfiles();
      return;
    }

    this._politicalProfileService.buscarPerfil( termino )
                        .subscribe( (perfiles: Perfil[]) => {
                          this.perfiles = perfiles;
                        });
  }

  borrarPerfil( perfil: Perfil ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: '¿Está seguro que desea eliminar el perfil politico',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Asi es',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this._politicalProfileService.borrarPerfil( perfil._id )
                            .subscribe( borrado => {
                              console.log(borrado);
                              this.cargarPerfiles();
                            });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El perfil politico ha sido eliminado',
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

  actualizarPerfil( perfil: Perfil) {

    this.perfil.name = perfil.name;
    this.perfil.summary = perfil.summary;

    this._politicalProfileService.actualizarPerfil( this.perfil )
                        .subscribe((resp: any) => {
                          Swal.fire({
                            type: 'success',
                            title: 'Perfil Politico Actualizado',
                            text: this.perfil.name
                          });
                          this.cargarPerfiles();
                          this.hideModalUpdate();
                        });
  }

  crearPerfil() {

    if (this.form.invalid) {
      return;
    }

    // tslint:disable-next-line:prefer-const
    let perfil = new Perfil(
      this.form.value.name,
      this.form.value.summary
    );

    this._politicalProfileService.crearPerfil(perfil)
                                .subscribe( resp => {
                                  Swal.fire({
                                    type: 'success',
                                    title: 'Perfil Politico Creado',
                                    text: perfil.name
                                  });
                                  this.hideModalCreate();
                                  this.cargarPerfiles();
                                });
  }

}
