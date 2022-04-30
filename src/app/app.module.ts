import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NgToastModule } from 'ng-angular-popup';
import { InterceptorService } from './auth/interceptor.service';
import { PartyModalsComponent } from './components/party-modals/party-modals.component';
import { PartySwitchComponent } from './components/party-switch/party-switch.component';
import { PartyPlayerViewComponent } from './components/party-player-view/party-player-view.component';
import { PartyAdminViewComponent } from './components/party-admin-view/party-admin-view.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    DashboardComponent,
    NavBarComponent,
    PartyModalsComponent,
    PartySwitchComponent,
    PartyPlayerViewComponent,
    PartyAdminViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }