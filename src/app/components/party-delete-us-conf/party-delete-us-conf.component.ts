import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-party-delete-us-conf',
  templateUrl: './party-delete-us-conf.component.html',
  styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class PartyDeleteUsConfComponent implements OnInit {

  @Input() usTag: string;
  @Output() confirmation = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  confirmDeletetion(){
    this.confirmation.emit();
  }

}
