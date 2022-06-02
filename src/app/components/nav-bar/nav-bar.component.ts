import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
    showOptions: boolean;
    username: String = '...';

    constructor(private authService: AuthService,
                private viewService: ViewService) { }

    ngOnInit(): void {
        this.username = this.authService.getUserName();

        this.viewService.getShowNavBarOptions().subscribe(value => {
            this.showOptions = value
        });
    }

    logOut() {
        this.authService.logOut();
    }

}
