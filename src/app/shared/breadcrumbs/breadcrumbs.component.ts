import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  label: string = '';

  // tslint:disable-next-line:variable-name
  constructor(
    private router: Router,
    public title: Title,
    public meta: Meta
    ) {

    this.getDataRoute()
        .subscribe( data => {

          // console.log(data);
          this.label = data.titulo;
          this.title.setTitle(this.label);

          // tslint:disable-next-line:prefer-const
          let metaTag: MetaDefinition = {
            name: 'description',
            content: this.label
          };

          this.meta.updateTag(metaTag);

        });
   }

  getDataRoute() {
    return this.router.events.pipe(
      filter( event => event instanceof ActivationEnd ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd) => event.snapshot.data));
  }


  ngOnInit() {
  }

}
