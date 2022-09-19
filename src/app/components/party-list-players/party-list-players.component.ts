import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { VotationService } from 'src/app/services/votation.service';

@Component({
    selector: 'app-party-list-players',
    templateUrl: './party-list-players.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css',
                 './party-list-players.component.css']
})
export class PartyListPlayersComponent implements OnInit, OnDestroy{

    @Input() partyID: string;
    @Input() selectedUS: UserStory;

    votationsList = new Array<any>();
    socketsList = new Array<any>();
    adminID: string;
    votingUS: UserStory = undefined;
    showIcons = false;

    private partyPlayersSub: Subscription;
    private playersVotationSub: Subscription;

    constructor(private socketService: SocketWebService,
                private votationService: VotationService) { }
               
    ngOnInit(): void {
        this.listenServerEvents();
    }

    ngOnDestroy(): void {
        this.removeAllSubscriptions();
    }

    removeAllSubscriptions(): void {
        this.partyPlayersSub.unsubscribe();
        this.playersVotationSub.unsubscribe();
    }

    handlePlanningStarted(us: UserStory): void {
        this.votingUS = us;
        this.showIcons = true;
    }

    listenServerEvents(): void { 
        this.partyPlayersSub = this.socketService.partyPlayers$.subscribe({
            next: (sockets) => {
                this.socketsList = sockets;
            }
        })

        this.playersVotationSub = this.socketService.playerVotation$.subscribe({  //WHEN USER VOTE
            next: (votationData) => {
                //then i retrive from api all votations
                let userWhoVoted = this.socketsList.find(socket => socket.user.id == votationData.userID);
                userWhoVoted.votation = votationData.votation;
                
                /*this.votationService.getUserStoryVotations(this.selectedUS.id).subscribe({
                    next: (usVotations) => {
                        this.votationsList = usVotations;
                    }
                })*/
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
