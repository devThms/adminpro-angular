import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styles: []
})
export class GraphComponent implements OnInit {

  graficos: any = {
    'grafico1': {
      'labels': ['Del Monte', 'Gran Día', 'Señorial'],
      'data': [4000, 3000, 5500],
      'type': 'doughnut',
      'leyenda': 'Ventas del Mes'
    },
    'grafico2': {
      'labels': ['Nectar', 'Salsitas', 'Frijoles'],
      'data': [1500, 1000, 1500],
      'type': 'doughnut',
      'leyenda': 'Marca Del Monte'
    },
    'grafico3': {
      'labels': ['Cerealitos', 'Avenas', 'Granolas'],
      'data': [1500, 500, 500],
      'type': 'doughnut',
      'leyenda': 'Marca Gran Día'
    },
    'grafico4': {
      'labels': ['Presentacion 26 G', 'Presentacion 12 G', 'Presentacion Familiar'],
      'data': [2500, 2000, 1000],
      'type': 'doughnut',
      'leyenda': 'Marca Señorial'
    },
  };

  constructor() { }

  ngOnInit() {
  }

}
