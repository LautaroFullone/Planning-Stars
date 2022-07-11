import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthNotGuard } from '../guards/auth-not.guard';
import { AuthGuard } from '../guards/auth.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginRegisterComponent } from '../components/login-register/login-register.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { PartySwitchComponent } from '../components/party-switch/party-switch.component';
import { PartyExistsGuard } from '../guards/party-exists.guard';
import { UserConnectedGuard } from '../guards/user-connected.guard';
import { AdminDisconnectGuard } from '../guards/admin-disconnect.guard';

const routes: Routes = [
    {
        path: 'login',
        component: LoginRegisterComponent,
        canActivate: [AuthNotGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'party/:id',
        component: PartySwitchComponent,
        canActivate: [AuthGuard, PartyExistsGuard, UserConnectedGuard],
        canDeactivate: [AdminDisconnectGuard]
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/not-found',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
