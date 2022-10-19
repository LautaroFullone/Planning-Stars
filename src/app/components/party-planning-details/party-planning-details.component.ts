import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
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
    @Input() selectedUS: UserStory;

    usPlanning: UserStory
    planningResults = undefined;
    planningGoing: boolean = false;

    private planningConcludedSub: Subscription;
    private planningStartedSub: Subscription;
    private numberOfUsersSub: Subscription;

    constructor(private socketService: SocketWebService,
                private toast: NotificationService,
                private votationService: VotationService) { }


    ngOnInit(): void { 
        this.planningStartedSub = this.socketService.planningStarted$.subscribe({
            next: (us) => {
                this.usPlanning = us;
                this.planningGoing = true;
            }
        }) 

        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                // console.log('plannigConcluded',data)
                let userStory = data.userStory;
                this.planningGoing = false;

                this.numberOfUsersSub = this.socketService.getnumberOfConnectedUsersIntoParty().subscribe({
                    next: (numberOfUsers) => {
                        // console.log('getnumberOfConnectedUsersIntoParty', numberOfUsers);
                        this.numberOfUsersSub.unsubscribe();

                        this.votationService.getPlanningDetails(userStory.id, (numberOfUsers-1)).subscribe({
                            next: (details) => {
                                console.log('getPlanningDetails',details);
                                
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
                                // console.log('planningResults', this.planningResults);
                            },
                            error: (apiError) => {
                                this.toast.errorToast({
                                    title: apiError.error.message,
                                    description: apiError.error.errors[0]
                                })
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

    get isPlanningUsSelected() {
        return (this.planningGoing && this.selectedUS && this.usPlanning && this.selectedUS.id == this.usPlanning.id);
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

    get usWithStoryPoints() {
        return (this.isOwner && this.selectedUS && this.selectedUS.storyPoints);
    } 

}
