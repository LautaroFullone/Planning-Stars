import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginRegisterComponent } from '../components/login-register/login-register.component';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';

const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: '', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
