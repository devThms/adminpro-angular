import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarService, SharedService } from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    SidebarService,
    SharedService
  ]
})
export class ServiceModule { }
