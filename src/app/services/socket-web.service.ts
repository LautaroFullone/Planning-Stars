import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class SocketWebService {

    _playerJoin = this.socket.fromEvent<any>('playerJoin_socket');
    _playerLeave = this.socket.fromEvent<any>('playerLeave_socket');

    dummyUser = {
        id: '001',
        name: 'Danny Ocean',
        email: 'dany.ocean@hotmail.com',
    }

    @Output() outputEvent: EventEmitter<any> = new EventEmitter();

    constructor(private socket: Socket) { }

    joinParty(partyID: string) {
        this.socket.emit('joinParty', { party: partyID, user: this.dummyUser });
    }

    leaveParty(partyID: string) {
        this.socket.emit('leaveParty', { party: partyID, user: this.dummyUser });
        sessionStorage.removeItem('party');
    }

}
