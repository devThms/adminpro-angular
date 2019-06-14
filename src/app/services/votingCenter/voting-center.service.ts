import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';

import { UsuarioService } from '../usuario/usuario.service';
import { Centro } from '../../models/centro.model';

import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VotingCenterService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarCentros( desde: number = 0) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/centros?desde=' + desde;

    return this.http.get( url );

  }

  obtenerCentro( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/centros/' + id;

    return this.http.get( url )
                .pipe(map( (resp: any) => {
                  return resp.center;
                }));

  }

  borrarCentro( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/centros/' + id + '?token=' + this._usuarioService.token;

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

  crearCentro( centro: Centro ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/centros';

    if ( centro._id ) {
    // Actualizar Centro de Votación
      url += '/' + centro._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, centro )
                    .pipe(map( (resp: any) => {
                      Swal.fire({
                        type: 'success',
                        title: 'Centro de Votación Actualizado',
                        text: centro.name
                      });
                      return resp.center;
                    }),
                    catchError( err => {

                      Swal.fire({
                        type: 'error',
                        title: err.error.mensaje,
                        text: err.error.err.message
                      });

                      return throwError(err);

                    }));

    } else {
    // Crear Centro de Votación
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, centro )
                .pipe(map((resp: any) => {
                  Swal.fire({
                    type: 'success',
                    title: 'Centro de Votación Creado',
                    text: centro.name
                  });
                  return resp.center;
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

  buscarCentro( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/centros/' + termino;

    return this.http.get( url )
                    .pipe(map( (resp: any) => resp.centros) );

  }

}
