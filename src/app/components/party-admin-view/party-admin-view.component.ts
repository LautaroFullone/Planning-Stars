import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserStory } from 'src/app/models/user-story';
import { PartyService } from 'src/app/services/party.service';
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
    updateUserStory: boolean;

    constructor(private partyService: PartyService,
        private toast: NgToastService) { }

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

    handleUpdatedUS() {  //when user has updated and US, ti's needed to charge the list of us in order to see the changes
        this.userStoriesList_ChildComponent.getPartyUserStories();
    }

    handleDeletedUS(event) {
        if (this.selectedUS) {
            this.partyService.deleteUserStory(event).subscribe((response) => {

                this.deletedUserStoryId = event;

                this.toast.info({
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

}