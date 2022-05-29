import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserStory } from 'src/app/models/user-story';
import { PartyService } from 'src/app/services/party.service';

@Component({
	selector: 'app-party-quick-actions',
	templateUrl: './party-quick-actions.component.html',
	styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit {

	@Input() partyID: string;
	@Input() selectedUS: UserStory = new UserStory();
	@Output() deletedUserStory = new EventEmitter<number>();
	@Output() updatingUserStory = new EventEmitter<any>();

	constructor(private partyService: PartyService,
				private toast: NgToastService) { }
		

	ngOnInit(): void {	
	}

	updateUS() {
		if(this.selectedUS){
			this.updatingUserStory.emit();
		}
	}
	
}
