import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/uploads/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  subirImagen: File;
  imagenView: any;

  constructor(
    // tslint:disable-next-line:variable-name
    public _subirArchivoService: SubirArchivoService,
    // tslint:disable-next-line:variable-name
    public _modalUploadService: ModalUploadService,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) {  }

  ngOnInit() {
  }

  cerrarModal() {
    this.subirImagen = null;
    this.imagenView = null;

    this._modalUploadService.hideModal();
  }

  updateImage() {

    this._subirArchivoService.subirArchivo( this.subirImagen, this._modalUploadService.tipo, this._modalUploadService.id )
                              .then( (resp: any) => {
                                this._modalUploadService.notification.emit( resp );
                                this._usuarioService.usuario.img = resp.usuarioActualizado.img;
                                this.cerrarModal();
                              })
                              .catch( err => {
                                console.log(err);
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

}
