import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { PartyCountdownTimerComponent } from '../party-countdown-timer/party-countdown-timer.component';

@Component({
    selector: 'app-party-player-view',
    templateUrl: './party-player-view.component.html',
    styleUrls: ['./party-player-view.component.css']
})
export class PartyPlayerViewComponent implements OnInit, OnDestroy {

    @Input() partyID: string;


    actualUserStory: UserStory;
    private planningStartedSub: Subscription;

    constructor(private socketService: SocketWebService,
                private toast: NotificationService) { }

    ngOnInit(): void {
        this.listenServerEvents();
    }

    ngOnDestroy(): void {
        this.removeAllSubscriptions();
    }

    listenServerEvents() {
        this.planningStartedSub = this.socketService.planningStarted$.subscribe({
            next: (us) => {
                this.actualUserStory = us;
                this.toast.infoToast({
                    title: "It's time to vote",
                    description: `Item #${us.tag} votation Started`
                })
            }
        })
    }

    removeAllSubscriptions() {
        this.planningStartedSub.unsubscribe();
    }
}