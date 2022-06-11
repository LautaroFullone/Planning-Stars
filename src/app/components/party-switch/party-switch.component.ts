import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-party-switch',
    templateUrl: './party-switch.component.html',
    styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit {

    isAdmin: boolean = true;
    partyParamID: string;
    

    constructor(private activatedRoute: ActivatedRoute,
                private viewService: ViewService,
                private toast: NgToastService,
                private socketService: SocketWebService) {
                    
        this.viewService.setShowNarBar(true, false);
    }

    ngOnInit(): void {
        this.partyParamID = this.activatedRoute.snapshot.paramMap.get('id');
        
        sessionStorage.setItem('party', this.partyParamID);
        console.log('party', this.partyParamID);

        /*this.socketService.joinSocketParty();

        this.socketService._playerJoinned.subscribe(partyID => {
            console.log('recibi algo');
            this.toast.success({
                detail: "Player Joined",
                summary: `A player has joned into the party ${partyID}`,
                position: 'br', duration: 6000
            })
        })*/
            
            
            




    }



}
