import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
    selector: 'app-party-delete-us-conf',
    templateUrl: './party-delete-us-conf.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class PartyDeleteUsConfComponent implements OnInit {

    @Input() userStory: UserStory;
    @Output() confirmation = new EventEmitter<any>();

    constructor() { }

    ngOnInit(): void { }

    confirmDeletion() {
        this.confirmation.emit(this.userStory);
    }

    get tagUserStory() {
        return (this.userStory != undefined) ? this.userStory.tag : '...';
    }

}
