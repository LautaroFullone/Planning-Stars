import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-list-players',
    templateUrl: './party-list-players.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class ListPlayersComponent implements OnInit {

    @Input() partyID: string;

    playersList = new Array<any>();

    constructor(private partyService: PartyService,
        private toast: NgToastService) { }

    ngOnInit(): void {
        this.getPartyPlayers();
    }

    getPartyPlayers() {
        this.partyService.getPartyPlayers(this.partyID).subscribe({
            next: (response) => { this.playersList = response; },
            error: (apiError) => {
                this.toast.error({
                    detail: apiError.error.message,
                    summary: apiError.error.errors[0],
                    position: 'br', duration: 6000
                })
            }
        })
    }

}
