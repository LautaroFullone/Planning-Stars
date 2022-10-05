import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-party-planning-details',
    templateUrl: './party-planning-details.component.html',
    styleUrls: ['./party-planning-details.component.css']
})
export class PartyPlanningDetailsComponent implements OnInit {
    
    @Input() userType: string;

    constructor() { }

    ngOnInit(): void { }

    get isOwner() {
        return this.userType == 'owner';
    }

}
