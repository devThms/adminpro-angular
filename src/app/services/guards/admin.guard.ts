import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService,
    ) { }

  canActivate() {

    if ( this._usuarioService.usuario.role === 'ADMIN_ROLE' ) {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this._usuarioService.logout();
      return false;
    }
  }
}
