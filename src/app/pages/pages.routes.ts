import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { GraphComponent } from './graph/graph.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { LoginGuardGuard } from '../services/guards/login-guard.guard';

// Componentes Mantenimientos
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProfileComponent } from './profile/profile.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { PartidosComponent } from './partidos/partidos.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { CandidatoComponent } from './candidatos/candidato.component';


const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' } },
            { path: 'graph', component: GraphComponent,  data: { titulo: 'Graficas' } },
            { path: 'account', component: AccountSettingsComponent,  data: { titulo: 'Configuracion de Cuenta' } },
            { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de Usuario' } },
            // Administración
            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Mantenimiento de Usuarios' } },
            // Mantenimientos
            { path: 'perfiles', component: PerfilesComponent, data: { titulo: 'Mantenimiento de Perfiles Políticos' } },
            { path: 'partidos', component: PartidosComponent, data: { titulo: 'Mantenimiento de Partidos Políticos' } },
            { path: 'periodos', component: PeriodosComponent, data: { titulo: 'Mantenimiento de Periodos de Participación' } },
            { path: 'candidatos', component: CandidatosComponent, data: { titulo: 'Mantenimiento de Candidatos' } },
            { path: 'candidato/:id', component: CandidatoComponent, data: { titulo: 'Perfil de Candidato' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
