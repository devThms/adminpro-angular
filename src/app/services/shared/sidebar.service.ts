import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: any = [
    {
      titulo: 'Administracion',
      icono: 'mdi mdi-clipboard-text',
      submenu: [
        { titulo: 'Usuarios', url: '/usuarios', icono: 'mdi mdi-account-box' }
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-archive',
      submenu: [
        { titulo: 'Perfil Politico', url: '/perfiles', icono: 'mdi mdi-account-card-details' },
        { titulo: 'Periodo', url: '/periodos', icono: 'mdi mdi-timer-sand' },
        { titulo: 'Partido Politico', url: '/partidos', icono: 'mdi mdi-cards-outline' },
        { titulo: 'Candidatos', url: '/candidatos', icono: 'mdi mdi-account-multiple' },
        { titulo: 'Centros de Votación', url: '/centros', icono: 'mdi mdi-bank' }
      ]
    }
  ];

  menuOperator: any = [
    {
      titulo: 'Operaciones',
      icono: 'mdi mdi-book-open-page-variant',
      submenu: [
        { titulo: 'Registro Votación', url: '/centros-votacion', icono: 'mdi mdi-fingerprint' }
      ]
    }
  ];

  constructor() { }
}
