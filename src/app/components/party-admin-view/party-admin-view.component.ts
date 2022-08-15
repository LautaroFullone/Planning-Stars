import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { UserStoryService } from 'src/app/services/user-story.service';
import { PartyAddEditUsModalComponent } from '../party-add-edit-us-modal/party-add-edit-us-modal.component';
import { PartyListPlayersComponent } from '../party-list-players/party-list-players.component';
import { UserStoriesListComponent } from '../party-user-stories-list/party-user-stories-list.component';

@Component({
    selector: 'app-party-admin-view',
    templateUrl: './party-admin-view.component.html',
    styleUrls: ['./party-admin-view.component.css']
})
export class PartyAdminViewComponent implements OnInit {

    @Input() partyID: string;

    @ViewChild(PartyAddEditUsModalComponent) partyAddEditUsModalComponent: PartyAddEditUsModalComponent;
    @ViewChild(UserStoriesListComponent) userStoriesListComponent : UserStoriesListComponent;
    @ViewChild(PartyListPlayersComponent) partyListPlayersComponent: PartyListPlayersComponent;

    selectedUS: UserStory;
    deletedUserStoryId: number;

    constructor(private userStoryService: UserStoryService) { }

    ngOnInit(): void { }

    handleSelectedUS(event): void {
        this.selectedUS = event;
    }

    handleResetUS(): void {
        this.selectedUS = undefined;
    }

    handleAddedUs(us): void {
        this.userStoriesListComponent.handleUserStoryCreated(us);
    }

    handleUpdatingUS(): void {  //when user clicks on 'Update' button, is needed to populate all the fields into modal form
        this.partyAddEditUsModalComponent.populateInputs();
    }

    handlePlanningStarted(us): void {
        this.userStoriesListComponent.handlePlanningStarted();
        this.partyListPlayersComponent.handlePlanningStarted(us);
    }

    handlePlanningFinished(data): void {
        let userStory = data.userStory;
        
        this.userStoriesListComponent.handlePlanningFinished(userStory);
        this.userStoryService.saveFinalVotationResult(userStory.id, data.storyPoints);
    }

    handleUpdatedUS(): void {  
        this.userStoriesListComponent.getPartyUserStories();
    }

    handleDeletedUS(userStoryID): void {
        this.userStoriesListComponent.handleDeleteUserStory(userStoryID);
    }

}