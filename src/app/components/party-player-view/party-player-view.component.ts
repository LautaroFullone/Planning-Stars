import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-player-view',
  templateUrl: './party-player-view.component.html',
  styleUrls: ['./party-player-view.component.css']
})
export class PartyPlayerViewComponent implements OnInit {

  @Input() partyID: string;

  constructor() { }

  ngOnInit(): void {
  }

}
