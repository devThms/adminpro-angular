import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { GraphComponent } from './pages/graph/graph.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';


const appRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: DashboardComponent },
    { path: 'progress', component: ProgressComponent },
    { path: 'graph', component: GraphComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', component: NotfoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true});
