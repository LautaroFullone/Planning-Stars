import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
	selector: 'app-party-quick-actions',
	templateUrl: './party-quick-actions.component.html',
	styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit, OnChanges {

	@Input() partyID: string;
	@Input() selectedUS: UserStory
	@Output() updatingUserStory = new EventEmitter<any>();
    @Output() planningStarted = new EventEmitter<any>();
    @Output() planningFinished = new EventEmitter<any>();

	showButtons = true;
	votingUS: UserStory;

	constructor(private socketService: SocketWebService,
                private toast: NotificationService) { }
		
	ngOnInit(): void { }

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['selectedUS'] && changes['selectedUS'].currentValue && !changes['selectedUS'].firstChange)
			this.showButtons = (changes['selectedUS'].currentValue != this.votingUS) ? true : false;
	}

	startPlanning(): void {
		//this.socketService.sendSelectedUS(this.selectedUS);
        this.planningStarted.emit(this.selectedUS);
		this.votingUS = this.selectedUS;
		this.showButtons = false;

        this.socketService.planningStarted(this.selectedUS);

        this.toast.infoToast({
            title: 'New Item selected',
            description: 'Players have received the selected US'
        })
	}

    finishPlanning(): void {
        this.votingUS = undefined
        this.showButtons = true;
        //TODO: here should be called the logic to get the final story points of the US
        this.planningFinished.emit( { userStory: this.selectedUS, storyPoints: 99 } );
        //TODO: Here should be saved the story points with the api
		this.socketService.plannigConcluded();

    }
 
}
