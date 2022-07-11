import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { UserStory } from '../models/user-story';
import { Votation } from '../models/votation';

@Injectable({
    providedIn: 'root'
})
export class SocketWebService {
    _hasUserAccess = this.socket.fromEvent<any>('hasUserAccess_socket');

    _userPartyOwner = this.socket.fromEvent<any>('userPartyOwner_socket');

    _playerJoin = this.socket.fromEvent<any>('playerJoin_socket');
    _playerLeave = this.socket.fromEvent<any>('playerLeave_socket'); 
    _adminLeave = this.socket.fromEvent<any>('adminLeave_socket');
    _partyPlayers = this.socket.fromEvent<any>('partyPlayers_socket');

    _selectedUS = this.socket.fromEvent<any>('selectedUS_socket');

    _playerVotation = this.socket.fromEvent<any>('playerVotation_socket');
    
    private userLogged: User;

    constructor(private socket: Socket,
                private authService: AuthService) { }

    connectSocketIO(){
        this.socket.connect();
    }   
    
    disconnectSocketIO() {
        this.socket.disconnect();
    }

    joinParty(partyID: string, isUserOwner: boolean) {
        this.authService.getUser().subscribe({
            next: (response) => { 
                this.userLogged = response; 
                this.socket.emit('joinParty', { party: partyID, user: this.userLogged, isOwner: isUserOwner }); 
            }
        })
    }

    isUserPartyOwner(){
        this.socket.emit('isUserPartyOwner');
    }

    leaveParty(partyID: string, adminLeave: boolean) {
        this.socket.emit('leaveParty', { party: partyID, user: this.userLogged, adminLeave: adminLeave });
    }

    getPartyPlayers(partyID: string){
        this.socket.emit('partyPlayers', { party: partyID });
    }

    sendSelectedUS(userStory: UserStory) {
        this.socket.emit('selectUS', { us: userStory });
    }

    sendPlayerVotation(votation: Votation, userStoryID: number){
        this.socket.emit('playerVotation', { votation, userStoryID });        
    }
}
