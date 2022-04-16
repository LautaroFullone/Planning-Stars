import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { TestingServiceService } from 'src/app/services/testing-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usersList = new Array<User>();

  constructor(private testingService: TestingServiceService) { }

  ngOnInit(): void {
    this.testingService.getUsers().subscribe((response) => {
      console.log('---RESPONSE---');
      console.log(response);
      this.usersList = response;
    });

  }

}
