import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-party-switch',
  templateUrl: './party-switch.component.html',
  styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit {

  isAdmin: boolean = true;
  partyParamID: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.partyParamID = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
