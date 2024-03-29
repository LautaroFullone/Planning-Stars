import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { UserStory } from '../models/user-story';
import { Votation } from '../models/votation';
import { map } from 'rxjs';
import { Party } from '../models/party';

@Injectable({
    providedIn: 'root'
})
export class SocketWebService {
    hasUserAccess$ = this.socket.fromEvent<any>('hasUserAccess_socket');

    userPartyOwner$ = this.socket.fromEvent<any>('userPartyOwner_socket');
    socketConnected$ = this.socket.fromEvent<any>('socketConnected_socket');

    playerJoin$ = this.socket.fromEvent<any>('playerJoin_socket');
    playerLeave$ = this.socket.fromEvent<any>('playerLeave_socket'); 
    adminLeave$ = this.socket.fromEvent<any>('adminLeave_socket');
    partyPlayers$ = this.socket.fromEvent<any>('partyPlayers_socket');

    selectedUS$ = this.socket.fromEvent<any>('selectedUS_socket');
    planningStarted$ = this.socket.fromEvent<any>('planningStarted_socket');
    plannigConcluded$ = this.socket.fromEvent<any>('plannigConcluded_socket');

    playerVotation$ = this.socket.fromEvent<any>('playerVotation_socket');
    
    private userLogged: User;

    constructor(private socket: Socket,
                private authService: AuthService) { 
        
        this.authService.getUser().subscribe({
            next: (response) => {
                this.userLogged = response;
            }
        })            
    }

    connectSocketIO(){
        this.socket.connect();
         
        this.authService.getUser().subscribe({
            next: (response) => {
                this.userLogged = response;
            }
        }) 
    }   
    
    disconnectSocketIO() {
        this.socket.disconnect();
        this.userLogged = undefined;
    }

    planningStarted(us: UserStory, isFirstRound: boolean){
        this.socket.emit('planningStarted', { us, isFirstRound })
    }

    plannigConcluded(userStory: UserStory, interruptedByOwner: boolean, isFirstRound: boolean){
        this.socket.emit('plannigConcluded', { userStory, interruptedByOwner, isFirstRound })
    }

    getnumberOfConnectedUsersIntoParty() {
        this.socket.emit('partyPlayers')

        return this.partyPlayers$.pipe(
            map(listSockets => {
                return listSockets.length;
            })
        );
    }

    hasUserAccess (party: Party){
        this.socket.emit('hasUserAccess', { user: this.userLogged, party })

        return this.hasUserAccess$.pipe(
            map(response => {
                return response;
            })
        );
    }

    joinParty(partyID: string) {       
        this.socket.emit('joinParty', { party: partyID, user: this.userLogged });

        return this.userPartyOwner$.pipe(
            map(response => {
                return response;
            })
        )
    }

    isUserPartyOwner(){
        this.socket.emit('isUserPartyOwner');
    }

    isSocketConnected(){
        this.socket.emit('isSocketConnected');

        return this.socketConnected$.pipe(
            map(response => {
                if(response)
                    return 'YES';
                else
                    return 'NO';
            })
        );
    }

    leaveParty() {
        this.socket.emit('leaveParty');
        this.socket.disconnect();
    }

    sendSelectedUS(userStory: UserStory) {
        this.socket.emit('selectUS', { us: userStory });
    }

    sendPlayerVotation(votation: Votation, userStoryID: number){
        this.socket.emit('playerVotation', { votation, userStoryID });        
    }
}
