import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { VotationService } from 'src/app/services/votation.service';

@Component({
    selector: 'app-party-list-players',
    templateUrl: './party-list-players.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css',
                 './party-list-players.component.css']
})
export class ListPlayersComponent implements OnInit{

    @Input() partyID: string;
    @Input() selectedUS: UserStory;

    votationsList = new Array<any>();
    socketsList = new Array<any>();
    adminID: string;

    constructor(private socketService: SocketWebService,
                private votationService: VotationService) { }

    ngOnInit(): void {
        this.socketService.partyPlayers$.subscribe({
            next: (sockets) => {
                this.socketsList = sockets;
            }
        })
        
        this.socketService.playerVotation$.subscribe({  //WHEN USER VOTE
            next: (votation) => {
                //then i retrive from api all votations
                this.votationService.getUserStoryVotations(this.selectedUS.id).subscribe({
                    next: (usVotations) => {
                        this.votationsList = usVotations;
                    }
                })
            }
        })  
    }

    /*
    whenTimeFinish(){
        console.log('starter planning');
        this.votationService.getUserStoryVotations(this.selectedUS.id).subscribe({
            next: (response) => {
                console.log('response', response);
                this.votationsList = response;
            },
            error: (apiError) => {
                console.log(apiError);
            }
        })
    } 
    */
}
