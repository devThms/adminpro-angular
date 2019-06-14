import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICES } from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Candidato } from '../../models/candidato.model';

import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarCandidatos( desde: number = 0, limit: number = 0 ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos?desde=' + desde + '&limit=' + limit;

    return this.http.get( url );

  }

  obtenerCandidato( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos/' + id;

    return this.http.get( url )
                .pipe(map( (resp: any) => {
                  return resp.candidate;
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

  borrarCandidato( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos/' + id + '?token=' + this._usuarioService.token;

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

  crearCandidato( candidato: Candidato ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/candidatos';

    if ( candidato._id ) {
    // Actualizar Candidato
      url += '/' + candidato._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, candidato )
                    .pipe(map( (resp: any) => {
                      Swal.fire({
                        type: 'success',
                        title: 'Candidato Politico Actualizado',
                        text: candidato.firstName + ' ' + candidato.lastName
                      });
                      return resp.candidate;
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
    // Crear Candidato
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, candidato )
                .pipe(map((resp: any) => {
                  Swal.fire({
                    type: 'success',
                    title: 'Candidato Politico Creado',
                    text: candidato.firstName + ' ' + candidato.lastName
                  });
                  return resp.candidate;
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

  buscarCandidato( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/candidatos/' + termino;

    return this.http.get( url )
                    .pipe(map( (resp: any) => resp.candidatos) );

  }

}
