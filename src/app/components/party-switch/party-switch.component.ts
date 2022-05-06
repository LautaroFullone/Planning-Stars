import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-switch',
  templateUrl: './party-switch.component.html',
  styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit {

  isAdmin: Boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}
