import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

import {
  SidebarService,
  SharedService,
  UsuarioService,
  LoginGuardGuard,
  AdminGuard,
  SubirArchivoService,
  PoliticalProfileService,
  PoliticalPartyService,
  ParticipationPeriodService,
  CandidateService,
  VotingCenterService,
  RangeTablesService,
  TableService,
  VotingControlService,
  VotingTotalService
} from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SidebarService,
    SharedService,
    UsuarioService,
    LoginGuardGuard,
    AdminGuard,
    SubirArchivoService,
    ModalUploadService,
    PoliticalProfileService,
    PoliticalPartyService,
    ParticipationPeriodService,
    CandidateService,
    VotingCenterService,
    RangeTablesService,
    TableService,
    VotingControlService,
    VotingTotalService
  ]
})
export class ServiceModule { }
