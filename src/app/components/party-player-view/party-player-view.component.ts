import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
    selector: 'app-party-player-view',
    templateUrl: './party-player-view.component.html',
    styleUrls: ['./party-player-view.component.css']
})
export class PartyPlayerViewComponent implements OnInit {

    @Input() partyID: string;
    actualUserStory: UserStory;

    constructor(private socketService: SocketWebService,
                private toast: NotificationService) { }

    ngOnInit(): void {
        this.socketService.selectedUS$.subscribe({
            next: (userStory) => {
                this.actualUserStory = userStory;

                this.toast.infoToast({
                    title: 'New Item selected',
                    description: 'Admin has selected a US'
                })
            }
        })
    }
}