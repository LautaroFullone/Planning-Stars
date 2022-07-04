import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { VotationService } from 'src/app/services/votation.service';

@Component({
    selector: 'app-party-list-players',
    templateUrl: './party-list-players.component.html',
    styleUrls: ['../party-admin-view/party-admin-view.component.css',
                 './party-list-players.component.css']
})
export class ListPlayersComponent implements OnInit{

    @Input() partyID: string;
    @Input() selectedUS: UserStory;

    votationsList = new Array<any>();
    playersList = new Array<any>();
    adminID: string;

    constructor(private socketService: SocketWebService,
                private votationService: VotationService,
                private toast: NotificationService,
                private render: Renderer2) { }

    ngOnInit(): void {
        this.adminID = sessionStorage.getItem('user-id');

        //listen event if a user join
        this.socketService._partyPlayers.subscribe({
            next: (players) => {
                this.playersList = Object.values(players);
                console.log('players', this.playersList);
                //this.initPlayersStatus(); 
            }
        })
        
        //this.whenTimeFinish()
        
        //listen if a user send his votation
        this.socketService._playerVotation.subscribe({  //WHEN USER VOTE
            next: (votation) => {
                //then i retrive from api all votations
                this.votationService.getUserStoryVotations(this.selectedUS.id).subscribe({
                    next: (usVotations) => {
                        console.log('votation',votation);
                        this.votationsList = usVotations;
                        console.log('votationsList', this.votationsList);
                    }
                })
            }
        })  
    }

    whenTimeFinish(){
        console.log('starter planning');
        this.votationService.getUserStoryVotations(this.selectedUS.id).subscribe({
            next: (response) => {
                console.log('response', response);

                this.votationsList = response;
                console.log('votationsList', this.votationsList);
            },
            error: (apiError) => {
                console.log(apiError);
            }
        })
    }

    //go over the votationsList and return true if a user has voted
    hasPlayerVoted(playerID: number){
        let rta = false
        this.votationsList.forEach( (votation) => {
            if(votation.userID == playerID)
                rta = true;
        })
        return rta;
    }

    initPlayersStatus(){
        setTimeout(() => {
            this.playersList.forEach((player) => {

                if(player.id != this.adminID){
                    let statusContainer = document.getElementById(`player-${player.id}`);
                    let icon = this.render.createElement('i');

                    console.log(`player ${player.name} has voted? ${this.hasPlayerVoted(player.id)}`);

                    if (this.hasPlayerVoted(player.id)) {
                        this.render.setAttribute(icon, 'class', 'fa-solid fa-check completed-color');
                        console.log('check added');
                    }
                    else {
                        this.render.setAttribute(icon, 'class', 'fa-solid fa-xmark incompleted-color');
                        console.log('x mark added');
                    }

                    this.render.appendChild(statusContainer, icon)    
                } 
            })}, 1000);
    }
}
