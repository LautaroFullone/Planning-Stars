import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { VotationService } from 'src/app/services/votation.service';

@Component({
    selector: 'app-party-planning-details',
    templateUrl: './party-planning-details.component.html',
    styleUrls: ['./party-planning-details.component.css',
                '../party-player-view/party-player-view.component.css']
})
export class PartyPlanningDetailsComponent implements OnInit, OnDestroy {
    
    @Input() userType: string;

    planningResults = undefined;

    private planningConcludedSub: Subscription;
    private numberOfUsersSub: Subscription;

    constructor(private socketService: SocketWebService,
                private votationService: VotationService) { }

    ngOnInit(): void {
        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                console.log('plannigConcluded',data)
                let userStory = data.userStory;

                this.numberOfUsersSub = this.socketService.getnumberOfConnectedUsersIntoParty().subscribe({
                    next: (numberOfUsers) => {
                        console.log('getnumberOfConnectedUsersIntoParty', numberOfUsers);

                        this.votationService.getPlanningDetails(userStory.id, numberOfUsers).subscribe({
                            next: (details) => {

                                this.numberOfUsersSub.unsubscribe();
                                console.log(details)
                                
                                this.planningResults = {
                                    votationsReceived: details.userVotes.length,
                                    votationsLeft: details.usersNotVote,
                                    storyPoints: details.averageVote,
                                    highVotation: {
                                        value: details.maxVote.vote,
                                        user: details.maxVote.name,
                                    },
                                    lowVotation: {
                                        value: details.minVote.vote,
                                        user: details.minVote.name,
                                    }
                                }
                                console.log('planningResults', this.planningResults);


                            } 
                        })
                    }
                })
        
            }
        })
    }

    ngOnDestroy(): void {
        this.planningConcludedSub.unsubscribe();
    }

    get isOwner() {
        return this.userType == 'owner';
    }

    get highVotationInfo() {
        let votation = this.planningResults.highVotation;
        return `${votation.user}: ${votation.value} SP` 
    }

    get lowVotationInfo() {
        let votation = this.planningResults.lowVotation;
        return `${votation.user}: ${votation.value} SP`
    }

    get storyPointsResult() {
        return `The session has concluded with ${this.planningResults.storyPoints} Story Points`
    }

    get votationsReceived() {
        return `${this.planningResults.votationsReceived} players`;
    }

    get votationsLeft() {
        return `${this.planningResults.votationsLeft} players`;
    }

}
