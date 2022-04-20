import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthNotGuard } from '../auth/auth-not.guard';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginRegisterComponent } from '../components/login-register/login-register.component';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';

const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent, canActivate: [AuthNotGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
