import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-party-switch',
  templateUrl: './party-switch.component.html',
  styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit {

  isAdmin: boolean = true;
  partyParamID: string;

  constructor(private activatedRoute: ActivatedRoute,
              private viewService: ViewService) { 

    this.viewService.setShowNarBar(true, false);
  }

  ngOnInit(): void {
    this.partyParamID = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
