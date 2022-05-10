import { Component, OnInit, Output, EventEmitter, Renderer2, AfterViewInit, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserStory } from 'src/app/models/user-story';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-user-stories-list',
    templateUrl: './party-user-stories-list.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class UserStoriesListComponent implements OnInit,AfterViewInit {

    @Input() partyID: string;
    @Output() selectedUserStory = new EventEmitter<UserStory>();

    userStoriesList = new Array<any>();
    itemSelected: HTMLElement;

    constructor(private partyService: PartyService,
                private render: Renderer2,
                private toast: NgToastService) { }

    ngOnInit(): void {
        this.getPartyUserStories();
    }
    ngAfterViewInit(): void {
        this.asingClasses();
    }

    asingClasses(){
        this.userStoriesList.forEach((us) => {
            if (us.active == false) {
                let elementUS = document.getElementById(`us-${us.id}`);
                this.render.addClass(elementUS, "disabled");
            }

        }); 
    }

    getPartyUserStories() {
        this.partyService.getPartyUserStories(this.partyID).subscribe((response) => {
            this.userStoriesList = response; 
            
        },
            (apiError) => {
                this.toast.error({
                    detail: apiError.error.message,
                    summary: apiError.error.errors[0],
                    position: 'br', duration: 6000
                })
            });
    }

    handleClickItem(us: UserStory){
        if(this.itemSelected)
            this.render.removeClass(this.itemSelected, "active");

        this.itemSelected = document.getElementById(`us-${us.id}`);
        this.render.addClass(this.itemSelected, "active");
        
        this.selectedUserStory.emit(us);
        
    }
    handleAddedUs(newUS){
        this.userStoriesList.push(newUS);
    }
}
