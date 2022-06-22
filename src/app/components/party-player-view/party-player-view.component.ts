import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
    selector: 'app-party-player-view',
    templateUrl: './party-player-view.component.html',
    styleUrls: ['./party-player-view.component.css']
})
export class PartyPlayerViewComponent implements OnInit {

    @Input() partyID: string;
    @Input() actualUserStory: UserStory;

    constructor() { }

    ngOnInit(): void { }
}