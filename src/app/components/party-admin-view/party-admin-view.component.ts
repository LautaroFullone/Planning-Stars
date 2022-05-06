import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-admin-view',
  templateUrl: './party-admin-view.component.html',
  styleUrls: ['./party-admin-view.component.css']
})
export class PartyAdminViewComponent implements OnInit {

  @Input() partyID: string;
  
  isItemSelected: Boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
