import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  
  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-bank',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard', icono: 'mdi mdi-gauge' },
        { titulo: 'ProgressBar', url: '/progress', icono: 'mdi mdi-chart-gantt' },
        { titulo: 'Graficas', url: '/graph', icono: 'mdi mdi-chart-bar' }

      ]
    }
  ];

  constructor() { }
}
