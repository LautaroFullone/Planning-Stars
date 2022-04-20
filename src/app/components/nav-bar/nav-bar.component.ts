import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

    username: String = '...';

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.username = this.authService.getUser().name;
    }

    logOut() {
        this.authService.logOut();
    }

}
