import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
	selector: 'app-party-quick-actions',
	templateUrl: './party-quick-actions.component.html',
	styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit, OnChanges {

	@Input() partyID: string;
	@Input() selectedUS: UserStory = new UserStory();
	@Output() updatingUserStory = new EventEmitter<any>();
    @Output() planningStarted = new EventEmitter<any>();

	showButtons = true;
	votingUS: UserStory;

	constructor(private socketService: SocketWebService) { }
		
	ngOnInit(): void { }

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['selectedUS'] && changes['selectedUS'].currentValue && !changes['selectedUS'].firstChange)
			this.showButtons = (changes['selectedUS'].currentValue != this.votingUS) ? true : false;
	}

	updateUS() {
		if(this.selectedUS)
			this.updatingUserStory.emit();
	}

	startPlanning(){
		this.socketService.sendSelectedUS(this.selectedUS);
        this.planningStarted.emit(this.selectedUS);
		this.votingUS = this.selectedUS;
		this.showButtons = false
	}

}
