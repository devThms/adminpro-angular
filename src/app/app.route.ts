import { Routes, RouterModule } from '@angular/router';

// Componentes
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent, data: { titulo: 'Elections-API' } },
    { path: 'register', component: RegisterComponent, data: { titulo: 'Registro' } },
    { path: '**', component: NotfoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true});
