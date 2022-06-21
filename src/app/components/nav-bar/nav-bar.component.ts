import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
    showOptions: boolean;
    username: String;

    constructor(private authService: AuthService,
                private viewService: ViewService) { }

    ngOnInit(): void {
        this.viewService.getShowNavBarOptions().subscribe({
            next: (response) => { this.showOptions = response }
        })

        this.authService.getUser().subscribe({
            next: (response) => { this.username = response.name }
        })
    }

    handleUserRename(username){
        this.username = username;
    }

    logout() {
        this.authService.logout();
    }
}
