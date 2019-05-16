import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})

export class LoginGuardGuard implements CanActivate {

  constructor(
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService,
    public router: Router
    ) { }

  canActivate() {

    if ( this._usuarioService.estaLogueado() ) {
      console.log('Paso el Login Guard');
      return true;
    } else {
      console.log('Bloqueado por el Login Guard');
      this.router.navigate(['/login']);
      return false;
    }

  }

}
