import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class SocketWebService {

    _playerJoin = this.socket.fromEvent<any>('playerJoin_socket');
    _actualPlayerJoin = this.socket.fromEvent<any>('actualPlayerJoin_socket');
    _playerLeave = this.socket.fromEvent<any>('playerLeave_socket');

    private userLogged: User;

    constructor(private socket: Socket,
                private authService: AuthService) {  }

    joinParty(partyID: string) {
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
