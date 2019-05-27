import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../uploads/subir-archivo.service';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    // tslint:disable-next-line:variable-name
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 1 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario =  JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage( id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;

  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICES + '/login';

    return this.http.post( url, usuario )
                    .pipe(map((resp: any) => {

                      this.guardarStorage( resp.id, resp.token, resp.user );
                      return true;

                    }));

  }

  logout() {

    this.token = '';
    this.usuario = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  crearUsuario( usuario: Usuario) {

    const url = URL_SERVICES + '/usuarios';

    return this.http.post( url, usuario )
                .pipe(map((resp: any) => {
                  return resp.user;
                }));

  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICES + '/usuarios/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
                    .pipe(map( (resp: any) => {

                      if ( usuario._id === this.usuario._id ) {

                        // tslint:disable-next-line:prefer-const
                        let usuarioDB: Usuario = resp.user;
                        this.usuario = usuarioDB;
                        this.guardarStorage( usuarioDB._id, this.token, usuarioDB);

                      }

                      return true;

                    }));

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
                              .then( (resp: any) => {

                                this.usuario.img = resp.usuarioActualizado.img;
                                this.guardarStorage( id, this.token, this.usuario );

                                Swal.fire({
                                  type: 'success',
                                  title: 'Imagen Actualizada',
                                  text: this.usuario.name
                                });

                              })
                              .catch( resp => {
                                console.log(resp);
                              });
  }

  cargarUsuarios( desde: number = 0 ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/usuarios?desde=' + desde;

    return this.http.get( url );

  }

  buscarUsuario( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get( url )
                    .pipe(map( (resp: any) => resp.usuarios) );

  }

  borrarUsuario( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/usuarios/' + id + '?token=' + this.token;

    return this.http.delete( url );

  }

}
