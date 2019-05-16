import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    // {
    //   titulo: 'Components',
    //   icono: 'mdi mdi-bank',
    //   submenu: [
    //     { titulo: 'Dashboard', url: '/dashboard', icono: 'mdi mdi-gauge' },
    //     { titulo: 'ProgressBar', url: '/progress', icono: 'mdi mdi-chart-gantt' },
    //     { titulo: 'Graficas', url: '/graph', icono: 'mdi mdi-chart-bar' }

    //   ]
    // },
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
        { titulo: 'Partido Politico', url: '/partidos', icono: 'mdi mdi-cards-outline' },
        { titulo: 'Periodo de Participación', url: '/periodos', icono: 'mdi mdi-timer-sand' },
        { titulo: 'Candidatos', url: '/candidatos', icono: 'mdi mdi-account-multiple' }
      ]
    }
  ];

  constructor() { }
}
