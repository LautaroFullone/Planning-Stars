import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { first, Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
	selector: 'app-party-quick-actions',
	templateUrl: './party-quick-actions.component.html',
	styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit, OnChanges, OnDestroy {

	@Input() partyID: string;
	@Input() selectedUS: UserStory;

	showButtons = true;
	votingUS: UserStory;

    planningListStatus = new Map<number, any>();
    planningConcludedSub: Subscription;

	constructor(private socketService: SocketWebService,
                private toast: NotificationService) { }
                
	ngOnInit(): void { 
        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                if(data.isFirstRound)
                    this.planningListStatus.set(data.userStory.id, { isFirstRound: false})
                
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
        
        if (!this.planningListStatus.has(this.selectedUS.id)) {
            this.planningListStatus.set(this.selectedUS.id, { isFirstRound: true })
        }
        
        this.socketService.planningStarted(this.selectedUS, this.usPlanningStatus.isFirstRound);
       
        this.toast.infoToast({
            title: 'New Item selected',
            description: 'Players have received the selected US'
        })
	}

    finishPlanning(): void {
        this.votingUS = undefined
        this.showButtons = true;
        let isFirstRound = this.planningListStatus.get(this.selectedUS.id).isFirstRound;
		    this.socketService.plannigConcluded(this.selectedUS, true, isFirstRound);
    }

    get usPlanningStatus() {
        return this.planningListStatus.get(this.selectedUS.id);
    }

    get usWithStoryPoints() {
        return (this.selectedUS && this.selectedUS.storyPoints) ? true : false;
    } 

    get initialButtonText() {
        return (!this.usPlanningStatus) ? 'Start Planning' : (this.usPlanningStatus.isFirstRound) ? 'Start Planning' : 'Restart Planning'
    }
}
