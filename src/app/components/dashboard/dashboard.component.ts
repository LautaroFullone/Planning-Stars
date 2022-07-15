import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    usersList = new Array<User>();

    constructor(private viewService: ViewService,
                private socketService: SocketWebService) {
        this.viewService.setShowNarBar(true, true);
    }

    ngOnInit(): void {
        this.socketService.isSocketConnected().subscribe({
            next: (response) => {
                if(response == 'YES')
                    this.socketService.connectSocketIO(); 
            }
        })
    }

}
