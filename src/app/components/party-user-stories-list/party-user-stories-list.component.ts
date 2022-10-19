import { Component, OnInit, Output, EventEmitter, Renderer2, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { PartyService } from 'src/app/services/party.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { UserStoryService } from 'src/app/services/user-story.service';

@Component({
    selector: 'app-party-user-stories-list',
    templateUrl: './party-user-stories-list.component.html',
    styleUrls: ['./party-user-stories-list.component.css',
            '../party-admin-view/party-admin-view.component.css']
})
export class UserStoriesListComponent implements OnInit {

    @Input() partyID: string;
    @Input() deletedUserStoryId: number;
    @Output() selectedUserStory = new EventEmitter<UserStory>();
    @Output() resetSelectedUserStory = new EventEmitter<any>();
    @Output() updatingUserStory = new EventEmitter<any>();
    @Output() deletingUserStory = new EventEmitter<any>();

    private planningStartedSub: Subscription;
    private planningConcludedSub: Subscription;

    iterableItemsList: Array<any> = [];
    applyClasses = false;

    constructor(private partyService: PartyService,
                private userStoryService: UserStoryService,
                private render: Renderer2,
                private toast: NotificationService,
                private socketService: SocketWebService) { }

    ngOnInit(): void {
        this.getPartyUserStories();

        this.listenServerEvents();
    }

    listenServerEvents() {
        this.planningStartedSub = this.socketService.planningStarted$.subscribe({
            next: (us) => {
                this.handlePlanningStarted();

                let usActions = document.getElementById(`actions-${us.id}`);
                this.render.addClass(usActions, "visually-hidden");
            }
        })
        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                this.getPartyUserStories();

                this.handlePlanningFinished(data.userStory);
            }
        })
    }

    getPartyUserStories(): void {
        this.partyService.getPartyUserStories(this.partyID).subscribe({
            next: (userStories) => {
                if (userStories) {
                    this.iterableItemsList = userStories.map( (us) => {
                        return (this.selectedItem && us.id == this.selectedItem.userStory.id) 
                                    ? { userStory: us, isSelected: true } 
                                        : { userStory: us, isSelected: false };
                    })

                    console.log('iterableItemsList', this.iterableItemsList);                 
                }                   
            },
            error: (apiError) => {
                this.toast.errorToast({
                    title: apiError.error.message,
                    description: apiError.error.errors[0]
                })
            }
        })
    }

    handlePlanningStarted(): void {
        console.log('selectedItem', this.selectedItem);

        if (this.selectedItem)
            this.render.removeClass(this.selectedItemHTML, "active");
        
        this.render.addClass(this.selectedItemHTML, "active");
    }

    handlePlanningFinished(us: UserStory): void {
        this.render.removeClass(this.selectedItemHTML, "active");
    }

    get selectedItem() {
        return this.iterableItemsList.find((item) => item.isSelected);
    }

    get selectedItemHTML() {
        let item = this.selectedItem;
        if(item) return document.getElementById(`us-${item.userStory.id}`);
        return undefined;
    }

    handleClickItem(us: UserStory): void {
        if(this.selectedItem) {
            this.render.removeAttribute(this.selectedItemHTML, 'style');
            this.selectedItem.isSelected = false;
        }

        let itemToSelect = this.iterableItemsList.find((item) => item.userStory.id == us.id);
        itemToSelect.isSelected = true;

        this.selectedUserStory.emit(itemToSelect.userStory);
    }

    handleUpdateUserStory(updatedUS: UserStory): void {
        this.getPartyUserStories();

        if(updatedUS.id == this.selectedItem.userStory.id) //if the selectedUS was updated, emit again the same iem to see the changes in the actualUS component
            this.selectedUserStory.emit(updatedUS);
    }

    handleDeleteUserStory(userStory: UserStory): void {

        this.userStoryService.deleteUserStory(userStory.id).subscribe({
            next: (response) => {
                this.deleteUSFromList(userStory.id);
                this.resetSelectedUS();

                this.toast.infoToast({
                    title: "Item Deleted",
                    description: `Item #${userStory.tag} was successfully deleted`
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
        this.iterableItemsList.push({ userStory: us, isSelected: false });
    }

    deleteUSFromList(usID: number): void {
        this.iterableItemsList.forEach((item, index) => {
            if (item.userStory.id === usID) {
                this.iterableItemsList.splice(index, 1);
            }
        });
    }

    updateUS(us: UserStory): void {
        this.updatingUserStory.emit(us);
    }

    deleteUS(us: UserStory): void {
        this.deletingUserStory.emit(us);
    }

    resetSelectedUS(): void {
        this.resetSelectedUserStory.emit();

        if (this.selectedItem)
            this.render.removeAttribute(this.selectedItemHTML, 'style');
    }

}
