import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from '../components/login-register/login-register.component';

const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
