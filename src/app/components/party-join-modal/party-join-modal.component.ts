import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-join-modal',
    templateUrl: './party-join-modal.component.html',
    styleUrls: ['./party-join-modal.component.css']
})
export class PartyJoinModalComponent implements OnInit {

    partyForm = new FormGroup({
        id: new FormControl('', [Validators.required]),
    });

    get id() { return this.partyForm.get('id').value; }

    constructor(private partyService: PartyService,
                private router: Router,
                private toast: NgToastService) { }

    ngOnInit(): void {
        
    }

    ngSubmit() {
        this.partyService.getPartyByID(this.id).subscribe({
            next: () => {   this.router.navigateByUrl(`/party/${this.id}`)  },
            error: (apiError) => {
                this.toast.error({
                    detail: apiError.error.message,
                    summary: apiError.error.errors[0],
                    position: 'br', duration: 6000
                })
            }
        })
    }

}
