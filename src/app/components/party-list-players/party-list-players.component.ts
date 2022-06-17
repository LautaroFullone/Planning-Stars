import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/auth/auth.service';
import { PartyService } from 'src/app/services/party.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
    selector: 'app-party-list-players',
    templateUrl: './party-list-players.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css',
                 './party-list-players.component.css']
})
export class ListPlayersComponent implements OnInit {

    @Input() partyID: string;

    playersList = new Array<any>();

    constructor(private socketService: SocketWebService) { }

    ngOnInit(): void {
        this.initPlayersList();
    }

    initPlayersList(){
        this.socketService._partyPlayers.subscribe({
            next: (players) => {
                this.playersList = Object.values(players);
            }
        })
    }

}
