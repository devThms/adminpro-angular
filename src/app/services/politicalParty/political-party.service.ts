import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';

import { UsuarioService } from '../usuario/usuario.service';
import { Partido } from '../../models/partido.model';

import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PoliticalPartyService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarPartidos( desde: number = 0, limit: number = 5 ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/partidos?desde=' + desde + '&limit=' + limit;

    return this.http.get( url );

  }

  obtenerPartido( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/partidos/' + id;

    return this.http.get( url )
                .pipe(map( (resp: any) => resp.political ));

  }

  borrarPartido( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/partidos/' + id + '?token=' + this._usuarioService.token;

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

  crearPartido( partido: Partido ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/partidos/' + '?token=' + this._usuarioService.token;

    return this.http.post( url, partido )
                .pipe(map((resp: any) => {
                  return resp.political;
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

  buscarPartido( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/partidos/' + termino;

    return this.http.get( url )
                    .pipe(map( (resp: any) => resp.partidos) );

  }

  actualizarPartido( partido: Partido ) {

    let url = URL_SERVICES + '/partidos/' + partido._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, partido )
                    .pipe(map( (resp: any) => {
                      return resp.political;
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
