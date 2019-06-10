import { NgModule } from '@angular/core';

// Rutas
import { PAGES_ROUTES } from './pages.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

// PipeModule
import { PipesModule } from '../pipes/pipes.module';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { GraphComponent } from './graph/graph.component';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficosComponent } from '../components/graficos/graficos.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProfileComponent } from './profile/profile.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PartidosComponent } from './partidos/partidos.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { CandidatoComponent } from './candidatos/candidato.component';
import { CentrosComponent } from './centros/centros.component';
import { CentroComponent } from './centros/centro.component';
import { ModalComponent } from '../components/modal/modal.component';
import { CentrosVotacionComponent } from './votos/centros-votacion.component';
import { MesasVotacionComponent } from './votos/mesas-votacion.component';

@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        GraphComponent,
        IncrementadorComponent,
        GraficosComponent,
        AccountSettingsComponent,
        UsuariosComponent,
        ProfileComponent,
        ModalUploadComponent,
        PerfilesComponent,
        PartidosComponent,
        PeriodosComponent,
        CandidatosComponent,
        CandidatoComponent,
        CentrosComponent,
        CentroComponent,
        ModalComponent,
        CentrosVotacionComponent,
        MesasVotacionComponent
    ],
    exports: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        GraphComponent
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        CommonModule,
        PipesModule
    ]
})
export class PagesModule { }
