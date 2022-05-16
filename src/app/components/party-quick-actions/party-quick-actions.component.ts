import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserStory } from 'src/app/models/user-story';
import { PartyService } from 'src/app/services/party.service';

@Component({
	selector: 'app-party-quick-actions',
	templateUrl: './party-quick-actions.component.html',
	styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit, OnChanges {

	@Input() partyID: string;
	@Input() selectedUS: UserStory = new UserStory();
	@Output() deletedUserStory = new EventEmitter<number>();

	constructor(private partyService: PartyService,
				private toast: NgToastService) { }

	ngOnChanges(changes: SimpleChanges){
		console.log(' QuickActionsComponent changesssssssssssssss');
		console.log(changes);

	}			

	ngOnInit(): void {
		this.selectedUS = new UserStory();
		this.selectedUS.tag='loading...'
	}

	showUS(){
		console.log('QuickActionsComponent US:');
		console.log(this.selectedUS);
		console.log('QuickActionsComponent PARTY:');
		console.log(this.partyID);
	}

	handleConfirmation() {
		console.log('handleConfirmation');
		if(this.selectedUS){

			this.partyService.deleteUserStory(this.selectedUS.id).subscribe((response) => {

				console.log('emiting');
				this.deletedUserStory.emit(this.selectedUS.id);

				this.toast.success({
					detail: "USER STORY DELETED",
					summary: `US #${this.selectedUS.tag} was successfully deleted`,
					position: 'br', duration: 6000
				})

			},
			(apiError) => {
				this.toast.error({
					detail: apiError.error.message,
					summary: apiError.error.errors[0],
					position: 'br', duration: 6000
				})
			});
		}
	}

	updateUserStory() {
		console.log('updateUserStory');
		if(this.selectedUS){

		}
		
	}
}
