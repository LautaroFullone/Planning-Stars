import { Component, OnInit } from '@angular/core';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

    constructor(private viewService: ViewService) {
        this.viewService.setShowNarBar(false);
    }

    ngOnInit(): void { }

}
