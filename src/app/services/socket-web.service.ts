import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService {

  _playerJoinned = this.socket.fromEvent<any>('playerJoined_socket');

  @Output() outputEvent: EventEmitter<any> = new EventEmitter();

  constructor(private socket: Socket) { }

  /*
  joinSocketParty() {
    this.socket.emit('joinParty', { partyID: sessionStorage.getItem('party'), user: });
  }*/

}
