import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
  selector: 'app-actual-user-story',
  templateUrl: './actual-user-story.component.html',
  styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class ActualUserStoryComponent implements OnInit {

  @Input() selectedUS: UserStory = new UserStory();

  constructor() { }

  ngOnInit(): void {
  }

}
