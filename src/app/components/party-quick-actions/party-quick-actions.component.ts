import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { VotationService } from 'src/app/services/votation.service';

@Component({
	selector: 'app-party-quick-actions',
	templateUrl: './party-quick-actions.component.html',
	styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit, OnChanges, OnDestroy {

	@Input() partyID: string;
	@Input() selectedUS: UserStory;
    @Output() votationRestarted = new EventEmitter<UserStory>();

	showButtons = true;
	votingUS: UserStory;

    planningStatusMap = new Map<number, any>();
    planningConcludedSub: Subscription;

	constructor(private socketService: SocketWebService,
                private votationService: VotationService,
                private toast: NotificationService) { }
                
	ngOnInit(): void { 
        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                if(data.isFirstRound)
                    this.planningStatusMap.set(data.userStory.id, { isFirstRound: false})
                
                this.votingUS = undefined
                this.showButtons = true;      
            }
        })
    }

    ngOnDestroy(): void {
        this.planningConcludedSub.unsubscribe();
    }

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['selectedUS'] && changes['selectedUS'].currentValue && !changes['selectedUS'].firstChange) {
			this.showButtons = (changes['selectedUS'].currentValue != this.votingUS) ? true : false;
        }
	}

	startPlanning(): void {
        this.votingUS = this.selectedUS;
        this.showButtons = false;
        
        if (!this.planningStatusMap.has(this.selectedUS.id)) {
            this.planningStatusMap.set(this.selectedUS.id, { isFirstRound: true })
        }
        else{
            this.votationService.restartPlanning(this.selectedUS.id).subscribe({
                next: (userStory) => {
                    this.votationRestarted.emit(userStory);
                },
                error: (apiError) => {
                    console.error('votation error', apiError);
                }
            })
        }
        this.socketService.planningStarted(this.selectedUS, this.usPlanningStatus.isFirstRound);

        this.toast.infoToast({
            title: 'Votation time started',
            description: 'Players now can vote the item.'
        })
	}

    finishPlanning(): void {
        this.votingUS = undefined
        this.showButtons = true;
        let isFirstRound = this.planningStatusMap.get(this.selectedUS.id).isFirstRound;
		    this.socketService.plannigConcluded(this.selectedUS, true, isFirstRound);
    }

    get usPlanningStatus() {
        return this.planningStatusMap.get(this.selectedUS.id);
    }

    get usWithStoryPoints() {
        return (this.selectedUS && this.selectedUS.storyPoints) ? true : false;
    } 

    get initialButtonText() {
        return (!this.usPlanningStatus) ? 'Start Planning' : (this.usPlanningStatus.isFirstRound) ? 'Start Planning' : 'Restart Planning'
    }
}
