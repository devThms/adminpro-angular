import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { SubirArchivoService } from '../uploads/subir-archivo.service';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

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

                      this.guardarStorage( resp.id, resp.token, resp.user, resp.menu );
                      return true;

                    }),
                    catchError( err => {

                      Swal.fire({
                        type: 'error',
                        title: 'Error en Login',
                        text: err.error.mensaje
                      });

                      return throwError(err);

                    }));

  }

  logout() {

    this.token = '';
    this.usuario = null;
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);

  }

  crearUsuario( usuario: Usuario) {

    const url = URL_SERVICES + '/usuarios';

    return this.http.post( url, usuario )
                .pipe(map((resp: any) => {
                  return resp.user;
                }),
                catchError( err => {

                  Swal.fire({
                    type: 'error',
                    title: err.error.mensaje,
                    text: err.error.err.message
                  });

                  return throwError(err);

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
                        this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );

                      }

                      return true;

                    }),
                    catchError( err => {

                      Swal.fire({
                        type: 'error',
                        title: err.error.mensaje,
                        text: err.error.err.message
                      });

                      return throwError(err);

                    }));

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
                              .then( (resp: any) => {

                                this.usuario.img = resp.usuarioActualizado.img;
                                this.guardarStorage( id, this.token, this.usuario, this.menu );

                                Swal.fire({
                                  type: 'success',
                                  title: 'Imagen Actualizada',
                                  text: this.usuario.name
                                });

                              })
                              .catch( resp => {
                                Swal.fire({
                                  type: 'error',
                                  title: 'Error al subir la imagen'
                                });
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

    return this.http.delete( url )
                  .pipe(map((resp: any) => {
                    return resp;
                  }),
                  catchError( err => {

                    Swal.fire({
                      type: 'error',
                      title: err.error.mensaje,
                      text: err.error.err.message
                    });

                    return throwError(err);

                  }));

  }

}
