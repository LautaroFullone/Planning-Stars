import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { UserStoryService } from 'src/app/services/user-story.service';
import { PartyAddEditUsModalComponent } from '../party-add-edit-us-modal/party-add-edit-us-modal.component';
import { UserStoriesListComponent } from '../party-user-stories-list/party-user-stories-list.component';

@Component({
    selector: 'app-party-admin-view',
    templateUrl: './party-admin-view.component.html',
    styleUrls: ['./party-admin-view.component.css']
})
export class PartyAdminViewComponent implements OnInit {

    @Input() partyID: string;

    @ViewChild(PartyAddEditUsModalComponent) addEditUS_ChildComponent: PartyAddEditUsModalComponent;
    @ViewChild(UserStoriesListComponent) userStoriesList_ChildComponent: UserStoriesListComponent;

    selectedUS: UserStory;
    addedUS: UserStory;
    deletedUserStoryId: number;

    constructor(private userStoryService: UserStoryService,
                private toast: NotificationService) { }

    ngOnInit(): void { }

    handleSelectedUS(event) {
        this.selectedUS = event;
    }

    handleResetUS() {
        this.selectedUS = undefined;
    }

    handleAddedUs(event) {
        this.addedUS = event;
    }

    handleUpdatingUS() {  //when user clicks on 'Update' button, is needed to populate all the fields into modal form
        this.addEditUS_ChildComponent.populateInputs();
    }

    handlePlanningStarted() {
        this.userStoriesList_ChildComponent.asignClassToSelectedUS();
    }

    handleUpdatedUS() {  //when user has updated and US, ti's needed to charge the list of us in order to see the changes
        this.userStoriesList_ChildComponent.getPartyUserStories();
    }

    handleDeletedUS(event) {
        if (this.selectedUS) {
            this.userStoryService.deleteUserStory(event).subscribe({
                next: (response) => {
                    this.deletedUserStoryId = event;

                    this.toast.infoToast({
                        title: "Item Deleted",
                        description: `Item #${this.selectedUS.tag} was successfully deleted`
                    })
                },
                error: (apiError) => {
                    this.toast.errorToast({
                        title: apiError.error.message,
                        description: apiError.error.errors[0]
                    })
                }
            })
         }
    }

}