import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  // tslint:disable-next-line:variable-name
  constructor(
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService,
    // tslint:disable-next-line:variable-name
    public _modalUploadService: ModalUploadService
    ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notification
                            .subscribe( resp => this.cargarUsuarios() );
  }

  showModal( id: string ) {
    this._modalUploadService.showModal( 'usuarios', id );
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
                        .subscribe( (resp: any) => {
                          this.totalRegistros = resp.total;
                          this.usuarios = resp.users;
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
    this.cargarUsuarios();
  }

  buscarUsuarios( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this._usuarioService.buscarUsuario( termino )
                        .subscribe( (usuarios: Usuario[]) => {
                          this.usuarios = usuarios;
                        });
  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'El usuario no puede eliminarse a si mismo'
      });
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: '¿Está seguro que desea eliminar el usuario',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Asi es',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this._usuarioService.borrarUsuario( usuario._id )
                            .subscribe( borrado => {
                              console.log(borrado);
                              this.cargarUsuarios();
                            });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El usuario ha sido eliminado',
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

  actualizarUsuario( usuario: Usuario ) {

    this._usuarioService.actualizarUsuario( usuario )
                        .subscribe(resp => {
                          Swal.fire({
                            type: 'success',
                            title: 'Usuario Actualizado',
                            text: usuario.name
                          });
                        });
  }

}
