import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import { UsuarioService } from '../usuario/usuario.service';
import { totalVoto } from '../../models/totalVoto.model';

import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VotingTotalService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarTotalVotos( mesaId: string, profileId: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/total-votos/' + mesaId + '/' + profileId;

    return this.http.get( url );

  }

  obtenerTotalVotos( profileId: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/total-votos-perfil/' + profileId;

    return this.http.get( url );

  }

  obtenerTotalVotosCentro( profileId: string, centerId: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/total-votos-centro/' + profileId + '/' + centerId;

    return this.http.get( url );

  }

  borrarTotalVotos( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/total-votos/' + id + '?token=' + this._usuarioService.token;

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

  crearTotalVotos( totalvoto: totalVoto ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/total-votos/' + '?token=' + this._usuarioService.token;

    return this.http.post( url, totalvoto )
                .pipe(map((resp: any) => {
                  return resp;
                }),
                catchError( err => throwError(err)));

  }

  actualizarTotalVotos( totalvoto: totalVoto ) {

    let url = URL_SERVICES + '/total-votos/' + totalvoto._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, totalvoto )
                    .pipe(map( (resp: any) => {
                      return resp.votes;
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
