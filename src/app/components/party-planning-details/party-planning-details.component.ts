import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { VotationService } from 'src/app/services/votation.service';

export class DetailsData {
    storyPoints: number;
    planningData: any;
    infoToShow: string;
}

@Component({
    selector: 'app-party-planning-details',
    templateUrl: './party-planning-details.component.html',
    styleUrls: ['./party-planning-details.component.css',
                '../party-player-view/party-player-view.component.css']
})
export class PartyPlanningDetailsComponent implements OnInit, OnDestroy, OnChanges {
    
    @Input() userType: string;
    @Input() selectedUS: UserStory;
    @Output() savedStoryPoints = new EventEmitter<UserStory>();

    private content = {
        showPlanningData: 'planning-data',
        showStoryPoints: 'story-points',
        showWaitingMessage: 'waiting-message'
    }

    planningGoing: boolean = false;
    planningMapResults = new Map<number, DetailsData>();

    private planningConcludedSub: Subscription;
    private planningStartedSub: Subscription;
    private numberOfUsersSub: Subscription;

    constructor(private socketService: SocketWebService,
                private toast: NotificationService,
                private votationService: VotationService) { }

    ngOnInit(): void {
        this.listenServerEvents();
    }

    get showTheStoryPoints() {
        return (this.selectedUS && this.planningUSResults.infoToShow == this.content.showStoryPoints);
    }

    get showWaitingMessage() {
        return (!this.selectedUS || this.planningUSResults.infoToShow == this.content.showWaitingMessage);
    }

    get showPlanningData() {
        return (this.selectedUS && this.planningUSResults.infoToShow == this.content.showPlanningData);
    }

    ngOnChanges(changes: SimpleChanges): void { 
        if (changes['selectedUS']?.currentValue && !this.planningMapResults.has(this.selectedUS.id)) {
            let sp = changes['selectedUS'].currentValue.storyPoints;
            this.planningMapResults.set(this.selectedUS.id, { storyPoints: sp, planningData: null, infoToShow: (sp ? this.content.showStoryPoints : this.content.showWaitingMessage) })
        }
    }

    ngOnDestroy(): void {
        this.planningStartedSub.unsubscribe();
        this.planningConcludedSub.unsubscribe();
    }

    listenServerEvents(): void { 
        this.planningStartedSub = this.socketService.planningStarted$.subscribe({
            next: (data) => {
                let us = data.userStory;
                this.planningGoing = true;

                if(!this.planningMapResults.has(us.id))
                    this.planningMapResults.set(us.id, { storyPoints: us.storyPoints, planningData: null, infoToShow: this.content.showWaitingMessage })

                this.planningMapResults.get(us.id).infoToShow = this.content.showWaitingMessage;                   
            }
        }) 

        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                let userStory = data.userStory;
                let isFirstRound = data.isFirstRound;
                this.planningGoing = false;

                this.numberOfUsersSub = this.socketService.getnumberOfConnectedUsersIntoParty().subscribe({
                    next: (numberOfUsers) => {
                        this.numberOfUsersSub.unsubscribe();

                        let saveStoryPoints = (isFirstRound) ? false : true;

                        this.votationService.getPlanningDetails(userStory.id, (numberOfUsers-1), saveStoryPoints).subscribe({
                            next: (details) => {     
                                let planningResults = {
                                    votationsReceived: details.userVotes.length,
                                    votationsLeft: details.usersNotVote,
                                    highVotation: {
                                        value: details.maxVote.vote,
                                        user: details.maxVote.name,
                                    },
                                    lowVotation: {
                                        value: details.minVote.vote,
                                        user: details.minVote.name,
                                    },
                                    isFirstRound: data.isFirstRound
                                }

                                let usResults = this.planningMapResults.get(userStory.id); 
                                usResults.storyPoints = details.averageVote;
                                usResults.planningData = planningResults;
                                usResults.infoToShow = (data.isFirstRound) ? this.content.showPlanningData : this.content.showStoryPoints;

                                this.selectedUS = userStory;
                                
                                if(saveStoryPoints) {
                                    this.selectedUS.storyPoints = details.averageVote
                                    this.savedStoryPoints.emit(this.selectedUS);
                                }  
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

    takeFirstStoryPoints(storyPoints: number) {
        this.votationService.saveFinalVotationResult(this.selectedUS.id, storyPoints).subscribe({
            next: (data) => {
                let usResults = this.planningUSResults;
                usResults.storyPoints = storyPoints;
                usResults.infoToShow = this.content.showStoryPoints;

                this.selectedUS.storyPoints = storyPoints
                this.savedStoryPoints.emit(this.selectedUS);
            },
            error: (apiError) => {
                this.toast.errorToast({
                    title: apiError.error.message,
                    description: apiError.error.errors[0]
                })
            } 
        })
    }
    
    get isOwner() {
        return this.userType == 'owner';
    }

    get highVotationInfo() {
        let votation = this.planningUSResults.planningData.highVotation;
        return `${votation.user}: ${votation.value} SP` 
    }

    get lowVotationInfo() {
        let votation = this.planningUSResults.planningData.lowVotation;
        return `${votation.user}: ${votation.value} SP`
    }

    get storyPointsResult() {
        return `The average result was ${this.planningUSResults.storyPoints} story points`
    }

    get votationsReceived() {
        return `${this.planningUSResults.planningData.votationsReceived} players`;
    }

    get votationsLeft() {
        return `${this.planningUSResults.planningData.votationsLeft} players`;
    } 

    get planningUSResults() {
        return (this.selectedUS) ? this.planningMapResults.get(this.selectedUS.id) : undefined;
    }

    get usWithStoryPoints() {
        return (this.isOwner && this.selectedUS && this.selectedUS.storyPoints);
    } 

}
