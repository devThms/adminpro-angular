import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { UsuarioService } from '../usuario/usuario.service';
import { Periodo } from '../../models/periodo.model';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ParticipationPeriodService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarPeriodos( desde: number = 0) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/periodos?desde=' + desde;

    return this.http.get( url );

  }

  borrarPeriodo( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/periodos/' + id + '?token=' + this._usuarioService.token;

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

  crearPeriodo( periodo: Periodo ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/periodos/' + '?token=' + this._usuarioService.token;

    return this.http.post( url, periodo )
                .pipe(map((resp: any) => {
                  return resp.period;
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


  actualizarPeriodo( periodo: Periodo ) {

    let url = URL_SERVICES + '/periodos/' + periodo._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, periodo )
                    .pipe(map( (resp: any) => {
                      return resp.period;
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
