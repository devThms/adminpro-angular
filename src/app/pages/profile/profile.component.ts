import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';

import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  subirImagen: File;
  imagenView: any;

  constructor(
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
  }

  actualizar( usuario: Usuario ) {

    this.usuario.name = usuario.name;
    this.usuario.email = usuario.email;

    this._usuarioService.actualizarUsuario( this.usuario )
                        .subscribe( resp => {

                          console.log(resp);

                          Swal.fire({
                            type: 'success',
                            title: 'Usuario Actualizado',
                            text: usuario.name
                          });

                        });

  }

  selectionImage( archivo: File ) {

    if ( !archivo ) {
      this.subirImagen = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire({
        type: 'error',
        title: 'Sólo Imagenes',
        text: 'El archivo seleccionado no es una imagen'
      });
      this.subirImagen = null;
    }

    this.subirImagen = archivo;

    // tslint:disable-next-line:prefer-const
    let reader = new FileReader();
    // tslint:disable-next-line:prefer-const
    let urlImagenView = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenView = reader.result;

  }

  updateImage() {

    this._usuarioService.cambiarImagen( this.subirImagen, this.usuario._id );

  }

}
