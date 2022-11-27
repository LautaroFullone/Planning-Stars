import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStory } from 'src/app/models/user-story';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
    selector: 'app-party-list-players',
    templateUrl: './party-list-players.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css',
        './party-list-players.component.css']
})
export class PartyListPlayersComponent implements OnInit, OnDestroy {

    @Input() partyID: string;
    @Input() selectedUS: UserStory;

    socketsList = new Array<any>();

    private partyPlayersSub: Subscription;
    private playersVotationSub: Subscription;
    private playerJoinSub: Subscription;
    private playerLeaveSub: Subscription

    constructor(private socketService: SocketWebService) { }

    ngOnInit(): void {
        this.listenServerEvents();
    }

    userHasVotedUS(socket): boolean {
        let rta = false;
        if(socket.votations) {
            let keys = Array.from(socket.votations.keys());
            rta = keys.includes(this.selectedUS.id)
        }
        return rta;
    }

    userVotationUS(socket) {
        return socket.votations.get(this.selectedUS.id)
    }

    restartData(us: UserStory) {
        console.log('restartData', us)
        this.socketsList.forEach((socket) => {

            if (socket.votations && socket.votations.has(us.id))
                socket.votations.delete(us.id)
        })
    }

    listenServerEvents(): void {

        this.playerJoinSub = this.socketService.playerJoin$.subscribe({
            next: (socket) => {
                this.socketsList.push(socket);
            }
        })

        this.playerLeaveSub = this.socketService.playerLeave$.subscribe({
            next: (socket) => {
                this.socketsList.forEach((item, index) => {
                    if (item.user.id == socket.user.id)
                        this.socketsList.splice(index, 1);
                })
            }
        })

        this.partyPlayersSub = this.socketService.partyPlayers$.subscribe({
            next: (sockets) => {
                this.socketsList = sockets;
                this.partyPlayersSub.unsubscribe();
            }
        })

        this.playersVotationSub = this.socketService.playerVotation$.subscribe({
            next: (votationData) => {
                let userWhoVoted = this.socketsList.find(socket => socket.user.id == votationData.userID);

                if (userWhoVoted.votations == undefined)
                    userWhoVoted.votations = new Map<number, number>();

                userWhoVoted.votations.set(this.selectedUS.id, votationData.value);
            }
        })
    }

    ngOnDestroy(): void {
        this.removeAllSubscriptions();
    }

    removeAllSubscriptions(): void {
        this.playerJoinSub.unsubscribe();
        this.playerLeaveSub.unsubscribe();
        this.partyPlayersSub.unsubscribe();
        this.playersVotationSub.unsubscribe();
    }
}
