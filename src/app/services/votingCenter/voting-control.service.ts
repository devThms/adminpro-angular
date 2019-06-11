import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import { UsuarioService } from '../usuario/usuario.service';
import { Voto } from '../../models/voto.model';

import { map } from 'rxjs/operators';
import { Perfil } from 'src/app/models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class VotingControlService {

  constructor(
    public http: HttpClient,
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService
  ) { }

  cargarVotos( desde: number = 0, mesaId: string, profileId: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/controlVotos/' + mesaId + '/' + profileId + '?desde=' + desde;

    return this.http.get( url );

  }

  ObtenerVotos( profileId: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/control-votos/' + profileId;

    return this.http.get( url );

  }

  ObtenerVotosCentro( profileId: string, centerId: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/control-votos/' + profileId + '/' + centerId;

    return this.http.get( url );

  }


  borrarVoto( id: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/controlVotos/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete( url );

  }

  crearVoto( voto: Voto ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/controlVotos/' + '?token=' + this._usuarioService.token;

    return this.http.post( url, voto )
                .pipe(map((resp: any) => {
                  return resp;
                }));

  }

  actualizarVoto( voto: Voto ) {

    let url = URL_SERVICES + '/controlVotos/' + voto._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, voto )
                    .pipe(map( (resp: any) => {
                      return resp.control;
                    }));

  }


}
