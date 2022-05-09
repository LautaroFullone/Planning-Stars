import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit {

  @Input() selectedUS: UserStory = new UserStory();

  constructor() { }

  ngOnInit(): void {
  }

}
