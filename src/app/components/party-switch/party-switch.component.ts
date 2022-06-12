import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-party-switch',
    templateUrl: './party-switch.component.html',
    styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit, OnDestroy {

    isAdmin: boolean = true;
    partyParamID: string;
    
    constructor(private activatedRoute: ActivatedRoute,
                private viewService: ViewService,
                private toast: NgToastService,
                private socketService: SocketWebService) {
                    
        this.viewService.setShowNarBar(true, false);
    }

    ngOnDestroy(): void {
        this.socketService.leaveParty(this.partyParamID);
    }

    ngOnInit(): void {
        this.partyParamID = this.activatedRoute.snapshot.paramMap.get('id');
        
        this.socketService.joinParty(this.partyParamID);

        this.listenServerEvents();
    }

    listenServerEvents(){
        this.socketService._playerJoin.subscribe(username => {
            this.toast.info({
                detail: "Player Joined",
                summary: `${username} has just arrived to the party`,
                position: 'br', duration: 6000
            })
        })

        this.socketService._playerLeave.subscribe(username => {
            this.toast.info({
                detail: "Player Leave",
                summary: `${username} has leave the party`,
                position: 'br', duration: 6000
            })
        })

        this.socketService._actualPlayerJoin.subscribe( () => {
            this.toast.success({
                detail: "You are in!",
                summary: `Welcome to the party`,
                position: 'br', duration: 6000
            })
        })

    }

    



}
