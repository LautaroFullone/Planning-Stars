import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { PartyService } from 'src/app/services/party.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-party-switch',
    templateUrl: './party-switch.component.html',
    styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit, OnDestroy {

    isOwner: boolean;
    partyParamID: string;
    
    constructor(private activatedRoute: ActivatedRoute,
                private viewService: ViewService,
                private toast: NgToastService,
                private socketService: SocketWebService,
                private partyService: PartyService) {
                    
        this.viewService.setShowNarBar(true, false);
    }

    ngOnInit(): void {
        this.partyParamID = this.activatedRoute.snapshot.paramMap.get('id');

        this.partyService.getPartyByID(this.partyParamID).subscribe({
            next: (response) => { 
                console.log('response', response);
                let partyOwner = response.partyOwnerId;
                let actualUser = sessionStorage.getItem('user-id');
                this.isOwner = (partyOwner == actualUser)? true : false;

                this.socketService.joinParty(this.partyParamID);
            }
        })

        this.listenServerEvents();
    }
    
    ngOnDestroy(): void {
        this.socketService.leaveParty(this.partyParamID);
    }

    listenServerEvents(){
        this.socketService._playerJoin.subscribe({
            next: (user) => {
                this.toast.info({
                    detail: "Player Joined",
                    summary: `${user.name} has just arrived to the party`,
                    position: 'br', duration: 6000
                })
            }
        })

        this.socketService._playerLeave.subscribe({
            next: (user) => {
                this.toast.info({
                    detail: "Player Leave",
                    summary: `${user.name} has leave the party`,
                    position: 'br', duration: 6000
                })
            }
        })

        this.socketService._actualPlayerJoin.subscribe({
            next: () => {
                this.toast.success({
                    detail: "You are in!",
                    summary: `Welcome to the party`,
                    position: 'br', duration: 6000
                })
            }
        })

    }
}
