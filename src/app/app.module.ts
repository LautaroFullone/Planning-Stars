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
import { InterceptorService } from './services/interceptor.service';
import { PartySwitchComponent } from './components/party-switch/party-switch.component';
import { PartyPlayerViewComponent } from './components/party-player-view/party-player-view.component';
import { PartyAdminViewComponent } from './components/party-admin-view/party-admin-view.component';
import { PartyJoinModalComponent } from './components/party-join-modal/party-join-modal.component';
import { PartyCreateModalComponent } from './components/party-create-modal/party-create-modal.component';
import { UserStoriesListComponent } from './components/party-user-stories-list/party-user-stories-list.component';
import { ActualUserStoryComponent } from './components/party-actual-user-story/party-actual-user-story.component';
import { PartyListPlayersComponent } from './components/party-list-players/party-list-players.component';
import { QuickActionsComponent } from './components/party-quick-actions/party-quick-actions.component';
import { PartyAddEditUsModalComponent } from './components/party-add-edit-us-modal/party-add-edit-us-modal.component';
import { PartyDeleteUsConfComponent } from './components/party-delete-us-conf/party-delete-us-conf.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PartyPlayerCardsComponent } from './components/party-player-cards/party-player-cards.component';
import { PartyPlayerTimerComponent } from './components/party-player-timer/party-player-timer.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { UserRenameModalComponent } from './components/user-rename-modal/user-rename-modal.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.serverURL, options: {} }; 

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    DashboardComponent,
    NavBarComponent,
    PartySwitchComponent,
    PartyPlayerViewComponent,
    PartyAdminViewComponent,
    PartyJoinModalComponent,
    PartyCreateModalComponent,
    UserStoriesListComponent,
    ActualUserStoryComponent,
    PartyListPlayersComponent,
    QuickActionsComponent,
    PartyAddEditUsModalComponent,
    PartyDeleteUsConfComponent,
    NotFoundComponent,
    PartyPlayerCardsComponent,
    PartyPlayerTimerComponent,
    UserRenameModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule,
    SocketIoModule.forRoot(config)
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