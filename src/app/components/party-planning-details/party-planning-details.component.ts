import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
    @Output() savedStoryPoints = new EventEmitter<UserStory>();


    usPlanning: UserStory
    planningGoing: boolean = false;
    planningListResults = new Map<number, any>();
    

    private planningConcludedSub: Subscription;
    private planningStartedSub: Subscription;
    private numberOfUsersSub: Subscription;

    constructor(private socketService: SocketWebService,
                private toast: NotificationService,
                private votationService: VotationService) { }

    ngOnInit(): void {
        this.listenServerEvents();
    }

    ngOnDestroy(): void {
        this.planningConcludedSub.unsubscribe();
    }

    listenServerEvents(): void { 
        this.planningStartedSub = this.socketService.planningStarted$.subscribe({
            next: (data) => {
                this.usPlanning = data.userStory;
                this.planningGoing = true;

                if(this.planningUSResults)
                    this.planningListResults.delete(this.selectedUS.id)
            }
        }) 

        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                console.log('PartyPlanningDetailsComponent planningConcludedSub', data)
                let userStory = data.userStory;
                let isFirstRound = data.isFirstRound;
                this.planningGoing = false;

                this.numberOfUsersSub = this.socketService.getnumberOfConnectedUsersIntoParty().subscribe({
                    next: (numberOfUsers) => {
                        this.numberOfUsersSub.unsubscribe();

                        let saveStoryPoints = (isFirstRound) ? false : true;

                        this.votationService.getPlanningDetails(userStory.id, (numberOfUsers-1), saveStoryPoints).subscribe({
                            next: (details) => {     
                                console.log('details',details)                          
                                let planningResults = {
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
                                    },
                                    isFirstRound: data.isFirstRound
                                }

                                this.planningListResults.set(userStory.id, planningResults)
                                
                                if(saveStoryPoints) {
                                    this.savedStoryPoints.emit(userStory);
                                }
                                    

                                    //TODO: CUNADO EL TIEMPO TERMINA / EL ADMIN TOMA LA US HASTA EL MOMENTO, MOSTRAR MENSAJE DE STORY POINTS
                                    
                                    
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
        console.log('story points', storyPoints)
        this.votationService.saveFinalVotationResult(this.selectedUS.id, storyPoints).subscribe({
            next: (data) => {
                console.log('saveFinalVotationResult', data);
                this.savedStoryPoints.emit(this.selectedUS);
                //this.selectedUS.storyPoints = storyPoints;
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
        let votation = this.planningListResults.get(this.selectedUS.id).highVotation;
        return `${votation.user}: ${votation.value} SP` 
    }

    get lowVotationInfo() {
        let votation = this.planningListResults.get(this.selectedUS.id).lowVotation;
        return `${votation.user}: ${votation.value} SP`
    }

    get storyPointsResult() {
        return `The session has concluded with ${this.planningListResults.get(this.selectedUS.id).storyPoints} Story Points`
    }

    get votationsReceived() {
        return `${this.planningListResults.get(this.selectedUS.id).votationsReceived} players`;
    }

    get votationsLeft() {
        return `${this.planningListResults.get(this.selectedUS.id).votationsLeft} players`;
    }

    get usWithStoryPoints() {
        return (this.isOwner && this.selectedUS && this.selectedUS.storyPoints);
    } 

    get planningUSResults() {
        return (this.selectedUS) ? this.planningListResults.get(this.selectedUS.id) : undefined;
    }

    showdata() {
        console.group(this.planningUSResults);
    }

}
