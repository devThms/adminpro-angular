import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    // tslint:disable-next-line:variable-name
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  ngOnInit() {

    init_plugins();

    this.form = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      correo: new FormControl( null, [Validators.required, Validators.email] ),
      password: new FormControl( null, Validators.required )
    });

  }

  registrarUsuario() {

    if (this.form.invalid) {
      return;
    }

    const usuario = new Usuario(
      this.form.value.nombre,
      this.form.value.correo,
      this.form.value.password
    );

    this._usuarioService.crearUsuario( usuario )
                        .subscribe( resp => this.router.navigate(['/login']) );

  }

}
