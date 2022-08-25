import { Component, OnInit, Output, EventEmitter, Renderer2, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { PartyService } from 'src/app/services/party.service';
import { UserStoryService } from 'src/app/services/user-story.service';

@Component({
    selector: 'app-party-user-stories-list',
    templateUrl: './party-user-stories-list.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class UserStoriesListComponent implements OnInit {

    @Input() partyID: string;
    @Input() deletedUserStoryId: number;
    @Output() selectedUserStory = new EventEmitter<UserStory>();
    @Output() resetSelectedUserStory = new EventEmitter<any>();

    userStoriesList: Array<UserStory> = [];
    itemSelected: HTMLElement;
    selectedUS: UserStory;
    applyClasses = false;

    constructor(private partyService: PartyService,
                private userStoryService: UserStoryService,
                private render: Renderer2,
                private toast: NotificationService) { }

    ngOnInit(): void {
        this.getPartyUserStories();
    }

    getPartyUserStories(): void {
        
        this.partyService.getPartyUserStories(this.partyID).subscribe({
            next: (response) => {
                if(response)
                    this.userStoriesList = response;             
            },
            error: (apiError) => {
                this.toast.errorToast({
                    title: apiError.error.message,
                    description: apiError.error.errors[0]
                })
            }
        })
    }

    resetSelectedUS(): void {
        this.resetSelectedUserStory.emit();
        
        if (this.itemSelected)
            this.render.removeAttribute(this.itemSelected, 'style');
    }

    handleClickItem(us: UserStory): void {
        if(this.itemSelected)
            this.render.removeAttribute(this.itemSelected, 'style');
        
        this.selectedUS = us;    
        this.itemSelected = document.getElementById(`us-${us.id}`);     
        this.render.setAttribute(this.itemSelected, 'style', 'font-weight: bolder')
        this.selectedUserStory.emit(us);
    }

    handleDeleteUserStory(userStoryID: number): void {

        this.userStoryService.deleteUserStory(userStoryID).subscribe({
            next: (response) => {
                this.deleteUSFromList(userStoryID);
                this.resetSelectedUS();

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

    handleUserStoryCreated(us: UserStory): void {
        this.userStoriesList.push(us);
    }

    handlePlanningStarted(): void {
        let usID = this.selectedUS.id;
        if(this.itemSelected)
            this.render.removeClass(this.itemSelected, "active");

        this.itemSelected = document.getElementById(`us-${usID}`);
        this.render.addClass(this.itemSelected, "active");
    }
    
    handlePlanningFinished(us: UserStory): void {       
        let usVoted = document.getElementById(`us-${us.id}`);
        
        this.resetSelectedUS();

        this.render.removeClass(usVoted, "active");
        this.render.addClass(usVoted, "disabled");
    }

    handleAddedUs(newUS): void {
        this.userStoriesList.push(newUS);
    }

    deleteUSFromList(usID: number): void {
        this.userStoriesList.forEach((item, index) => {
            if (item.id === usID) {
                this.userStoriesList.splice(index, 1);
            }
        });
    }
}
