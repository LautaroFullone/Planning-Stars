import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class SocketWebService {
    
    _actualPlayerJoin = this.socket.fromEvent<any>('actualPlayerJoin_socket');
    _playerJoin = this.socket.fromEvent<any>('playerJoin_socket');
    _playerLeave = this.socket.fromEvent<any>('playerLeave_socket');
    _partyPlayers = this.socket.fromEvent<any>('partyPlayers_socket');

    private userLogged: User;

    constructor(private socket: Socket,
                private authService: AuthService) {  }

    joinParty(partyID: string) {
        this.socket.connect();
        
        this.authService.getUser().subscribe({
            next: (response) => { 
                this.userLogged = response; 
                this.socket.emit('joinParty', { party: partyID, user: this.userLogged }); 
            }
        })
    }

    leaveParty(partyID: string) {
        this.socket.emit('leaveParty', { party: partyID, user: this.userLogged });
        sessionStorage.removeItem('party');
        this.socket.disconnect();
    }

}
