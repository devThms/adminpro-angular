import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';

import { UsuarioService } from '../usuario/usuario.service';
import { Rango } from '../../models/rangoMesa.model';

import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class RangeTablesService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  obtenerRango( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/rangos/' + id;

    return this.http.get( url )
                .pipe(map( (resp: any) => {
                  return resp.range;
                }));

  }

  crearRango( rango: Rango ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/rangos';

    if ( rango._id ) {
    // Actualizar Rango de Mesas
      url += '/' + rango._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, rango )
                    .pipe(map( (resp: any) => {
                      Swal.fire({
                        type: 'success',
                        title: 'Rango de mesas Actualizado'
                      });
                      return resp.range;
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
    // Crear Rango de Mesas
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, rango )
                .pipe(map((resp: any) => {
                  Swal.fire({
                    type: 'success',
                    title: 'Rango de mesas Creado'
                  });
                  return resp.range;
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


}
