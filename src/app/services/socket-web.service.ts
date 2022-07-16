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
    _hasUserAccess = this.socket.fromEvent<any>('hasUserAccess_socket');
    hasUserAccess$ = this.socket.fromEvent<any>('test_socket');

    _userPartyOwner = this.socket.fromEvent<any>('userPartyOwner_socket');
    _socketConnected = this.socket.fromEvent<any>('socketConnected_socket');

    _playerJoin = this.socket.fromEvent<any>('playerJoin_socket');
    _playerLeave = this.socket.fromEvent<any>('playerLeave_socket'); 
    _adminLeave = this.socket.fromEvent<any>('adminLeave_socket');
    _partyPlayers = this.socket.fromEvent<any>('partyPlayers_socket');

    _selectedUS = this.socket.fromEvent<any>('selectedUS_socket');

    _playerVotation = this.socket.fromEvent<any>('playerVotation_socket');
    
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

    hasUserAccess (party: Party){
        this.socket.emit('hasUserAccess', { user: this.userLogged, party:party.id, partyOwnerID: party.partyOwnerId })

        return this.hasUserAccess$.pipe(
            map(response => {
                return response;
            })
        );
    }

    joinParty(partyID: string) {       
        this.socket.emit('joinParty', { party: partyID, user: this.userLogged });

        return this._userPartyOwner.pipe(
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

        return this._socketConnected.pipe(
            map(response => {
                if(response)
                    return 'YES';
                else
                    return 'NO';
            })
        );
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
