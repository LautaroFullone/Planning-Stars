import { LiteralArrayExpr } from '@angular/compiler';
import { Component, OnInit, Output, EventEmitter, Renderer2, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserStory } from 'src/app/models/user-story';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-user-stories-list',
    templateUrl: './party-user-stories-list.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class UserStoriesListComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() partyID: string;
    @Input() addedUserStory: UserStory;
    @Input() deletedUserStoryId: number;
    @Output() selectedUserStory = new EventEmitter<UserStory>();
    @Output() resetSelectedUserStory = new EventEmitter<any>();

    userStoriesList = new Array<UserStory>()
    itemSelected: HTMLElement;
    selectedUS: UserStory;

    constructor(private partyService: PartyService,
                private render: Renderer2,
                private toast: NgToastService) { }

    ngOnInit(): void {
        this.getPartyUserStories();
    }

    ngAfterViewInit(): void {
        this.asingClasses();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('UserStoriesListComponent', changes);
        if ( changes['addedUserStory'] && (changes['addedUserStory'].previousValue != changes['addedUserStory'].currentValue) ) {
            this.userStoriesList.push(this.addedUserStory);
        }

        if (changes['deletedUserStoryId'] && !changes['deletedUserStoryId'].firstChange){
            let usIDtoDelete = changes['deletedUserStoryId'].currentValue;
            this.deleteUSFromList(usIDtoDelete);
            this.resetSelectedUS();
        }
    }

    asingClasses(){
        this.userStoriesList.forEach((us) => {
            if (!us.isActive) {
                let elementUS = document.getElementById(`us-${us.id}`);
                this.render.addClass(elementUS, "disabled");
            }
        }); 
    }

    getPartyUserStories() {
        this.partyService.getPartyUserStories(this.partyID).subscribe((response) => {
            if(response)
                this.userStoriesList = response; 
            else
                this.userStoriesList = new Array();
            
        },
            (apiError) => {
                this.toast.error({
                    detail: apiError.error.message,
                    summary: apiError.error.errors[0],
                    position: 'br', duration: 6000
                })
            });
    }

    resetSelectedUS(){
        this.resetSelectedUserStory.emit();
        
        if (this.itemSelected)
            this.render.removeClass(this.itemSelected, "active");
    }

    handleClickItem(us: UserStory){
        if(this.itemSelected)
            this.render.removeClass(this.itemSelected, "active");

        this.selectedUS = us;
        this.itemSelected = document.getElementById(`us-${us.id}`);
        this.render.addClass(this.itemSelected, "active");
        
        this.selectedUserStory.emit(us);
    }

    handleAddedUs(newUS){
        this.userStoriesList.push(newUS);
    }

    deleteUSFromList(usID: number) {
        this.userStoriesList.forEach((item, index) => {
            if (item.id === usID) {
                this.userStoriesList.splice(index, 1);
            }
        });
    }
}
