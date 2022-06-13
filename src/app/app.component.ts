import { Component, OnInit } from '@angular/core';
import { ViewService } from './services/view.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    showNavBar: boolean;
    title = 'Planning-Stars';

    constructor(private viewService: ViewService) { }

    ngOnInit(): void {
        this.viewService.getShowNavBar().subscribe({
            next: (response) => { this.showNavBar = response }
        });
    }
}