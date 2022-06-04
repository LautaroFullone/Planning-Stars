import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  usersList = new Array<User>();

  constructor(private viewService: ViewService) { 
    this.viewService.setShowNarBar(true, true);
  }
    
  ngOnInit(): void {  }

}
