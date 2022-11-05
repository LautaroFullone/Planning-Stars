import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { PartyAddEditUsModalComponent } from '../party-add-edit-us-modal/party-add-edit-us-modal.component';
import { PartyDeleteUsConfComponent } from '../party-delete-us-conf/party-delete-us-conf.component';
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
    @ViewChild(PartyDeleteUsConfComponent) partyDeleteUsConfirmationComponent: PartyDeleteUsConfComponent;

    selectedUS: UserStory;
    userStoryToDelete : UserStory = undefined;

    constructor() { }

    ngOnInit(): void { }

    handleSelectedUS(us): void {
        this.selectedUS = us;
    }

    handleResetUS(): void {
        this.selectedUS = undefined;
    }

    handleAddedUs(us): void {
        this.userStoriesListComponent.handleUserStoryCreated(us);
    }

    handleUpdatingUS(us: UserStory): void {
        this.partyAddEditUsModalComponent.initUpdateAction(us);//when user clicks on 'Update' button, is needed to populate all the fields into modal form
    }
    handleDeletingUS(us: UserStory): void {
        this.userStoryToDelete = us;
    }

    beforeUpdatedAction(us: UserStory): void {  
        this.userStoriesListComponent.handleUpdateUserStory(us);
    }

    beforeSaveStoryPointsIntoUS(userStoryWithNewSP: UserStory) {  //TODO: instead of reload the us list, add sp to the voted us only (already pass the item via parameter)
        this.userStoriesListComponent.getPartyUserStories()
        this.selectedUS = userStoryWithNewSP;
    }

    beforeDeleteConfimation(userStory: UserStory): void {
        this.userStoriesListComponent.handleDeleteUserStory(userStory);
    }

}