import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { PartyPlayerCardsComponent } from '../party-player-cards/party-player-cards.component';

@Component({
    selector: 'app-party-player-view',
    templateUrl: './party-player-view.component.html',
    styleUrls: ['./party-player-view.component.css']
})
export class PartyPlayerViewComponent implements OnInit, OnDestroy {

    @Input() partyID: string;

    @ViewChild(PartyPlayerCardsComponent) partyPlayerCardsComponent: PartyPlayerCardsComponent;

    actualUserStory: UserStory;

    private planningStartedSub: Subscription;
    private planningConcludedSub: Subscription;

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
            next: (data) => {
                this.actualUserStory = data.userStory;
                this.partyPlayerCardsComponent.refreshCards();
                this.toast.infoToast({
                    title: "It's time to vote",
                    description: `Votation of item #${data.userStory.tag} has started.`
                })
            }
        })

        this.planningConcludedSub = this.socketService.plannigConcluded$.subscribe({
            next: (data) => {
                this.partyPlayerCardsComponent.refreshCards();
                this.openPlanningDetailsModal();

            }
        })
    }

    removeAllSubscriptions() {
        this.planningStartedSub.unsubscribe();
        this.planningConcludedSub.unsubscribe();
    }

    openPlanningDetailsModal() {
        let modalButton = document.getElementById("openModalButton");
        modalButton.click();
    }
}