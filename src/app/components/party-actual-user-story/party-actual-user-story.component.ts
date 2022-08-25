import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
    selector: 'app-party-actual-user-story',
    templateUrl: './party-actual-user-story.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class ActualUserStoryComponent implements OnInit {

    @Input() selectedUS: UserStory = new UserStory();
    @Input() messageType: string;

    waitingMessage: string;

    constructor() { }

    ngOnInit(): void {
        this.waitingMessage = (this.isOwner) ? 'Please select a item from the list' : 'Waiting admin item selection';
    }

    get isOwner() {
        return this.messageType == 'owner';
    }
}
