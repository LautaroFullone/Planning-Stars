import { Component, OnInit, Output, EventEmitter, Renderer2, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-user-stories-list',
    templateUrl: './party-user-stories-list.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class UserStoriesListComponent implements OnInit, OnChanges {

    @Input() partyID: string;
    @Input() addedUserStory: UserStory;
    @Input() deletedUserStoryId: number;
    @Output() selectedUserStory = new EventEmitter<UserStory>();
    @Output() resetSelectedUserStory = new EventEmitter<any>();

    userStoriesList = new Array<UserStory>()
    itemSelected: HTMLElement;
    selectedUS: UserStory;
    applyClasses = false;

    constructor(private partyService: PartyService,
                private render: Renderer2,
                private toast: NotificationService) { }

    ngOnInit(): void {
        this.getPartyUserStories();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if( changes['addedUserStory'] && (changes['addedUserStory'].previousValue != changes['addedUserStory'].currentValue) ) {
            this.userStoriesList.push(this.addedUserStory);
        }

        if(changes['deletedUserStoryId'] && !changes['deletedUserStoryId'].firstChange){
            let usIDtoDelete = changes['deletedUserStoryId'].currentValue;
            this.deleteUSFromList(usIDtoDelete);
            this.resetSelectedUS();
        }
    }
    getPartyUserStories(): void {
        
        this.partyService.getPartyUserStories(this.partyID).subscribe({
            next: (response) => {
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
            this.render.removeClass(this.itemSelected, "active");
    }

    handleClickItem(us: UserStory): void {
        if(this.itemSelected)
            this.render.removeAttribute(this.itemSelected, 'style');
        
        this.selectedUS = us;    
        this.itemSelected = document.getElementById(`us-${us.id}`);     
        this.render.setAttribute(this.itemSelected, 'style', 'font-weight: bolder')
        this.selectedUserStory.emit(us);
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

        this.render.removeAttribute(usVoted, "style");
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
