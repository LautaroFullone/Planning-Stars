import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { PartyService } from 'src/app/services/party.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
    selector: 'app-party-join-modal',
    templateUrl: './party-join-modal.component.html',
    styleUrls: ['./party-join-modal.component.css']
})
export class PartyJoinModalComponent implements OnInit {

    partyForm = new FormGroup({
        id: new FormControl('13ADFA', [Validators.required]),
    });

    private hasUserAccessSub: Subscription;

    get partyID() { return this.partyForm.get('id').value; }

    constructor(private partyService: PartyService,
                private socketService: SocketWebService,
                private router: Router,
                private toast: NotificationService) {  }

    ngOnInit(): void { }

    ngSubmit() {
        this.partyService.getPartyByID(this.partyID).subscribe({
            next: (partyResponse) => {
                let party = this.partyID

                this.hasUserAccessSub = this.socketService.hasUserAccess(partyResponse).subscribe({
                    next: (response) => {
                        
                        if (response.hasAccess)
                            this.router.navigateByUrl(`/party/${party}`);  
                        else {
                            this.toast.warningToast({
                                title: "Joining Party Validation",
                                description: response.reason
                            })
                        }

                        this.partyForm.reset();
                        this.hasUserAccessSub.unsubscribe();
                    },
                    error: (socketError) => {
                        console.error(socketError);
                        this.hasUserAccessSub.unsubscribe();
                    }
                })
            },
            error: (apiError) => {
                this.toast.errorToast({
                    title: 'Party Not Found',
                    description: `The party #${this.partyID} do not exists`
                })
                this.cleanModal();
            }
        })
    }


    cleanModal() {
        setTimeout(() => this.partyForm.reset(), 500)
    }

}
