import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
    selector: 'app-party-delete-us-conf',
    templateUrl: './party-delete-us-conf.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class PartyDeleteUsConfComponent implements OnInit, OnChanges {

    @Input() userStory: UserStory;
    @Output() confirmation = new EventEmitter<number>();

    tag = '...'

    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userStory'] && changes['userStory'].currentValue)
            this.tag = changes['userStory'].currentValue.tag;
    }

    confirmDeletion() {
        this.confirmation.emit(this.userStory.id);
    }

}
