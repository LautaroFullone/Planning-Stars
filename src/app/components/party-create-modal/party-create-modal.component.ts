import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Party } from 'src/app/models/party';
import { NotificationService } from 'src/app/services/notification.service';
import { PartyService } from 'src/app/services/party.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-party-create-modal',
    templateUrl: './party-create-modal.component.html',
    styleUrls: ['./party-create-modal.component.css']
})
export class PartyCreateModalComponent implements OnInit, AfterViewInit{

    @ViewChild("partyID") partyID: ElementRef;
    
    isPartyCreated: boolean = false;
    partyToJoin: Party;
    private hasUserAccessSub: Subscription;

    createForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        id: new FormControl(''),
        size: new FormControl('', [Validators.required, Validators.min(2), Validators.max(30)]),

    });

    get partyName() { return this.createForm.get('name').value; }
    get partySize() { return this.createForm.get('size').value; }

    constructor(private partyService: PartyService,
                private authService: AuthService,
                private socketService: SocketWebService,
                private router: Router,
                private render: Renderer2,
                private toast: NotificationService) { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.render.listen(this.partyID.nativeElement, "focus", () => {
            if(this.partyID.nativeElement.value)    
                this.render.addClass(this.partyID.nativeElement, "nonSelection");
        })
    }

    ngSubmit() {
        this.authService.getUser().subscribe({
            next: (response) => {
                let connectedUser = response
                let partyData = new Party;
                partyData.name = this.partyName;
                partyData.maxPlayer = this.partySize;
                partyData.createdBy = connectedUser.name;
                partyData.partyOwnerId = connectedUser.id;

                this.partyService.createParty(partyData).subscribe({
                    next: (response) => {
                        this.render.setProperty(this.partyID.nativeElement, 'value', response.id);
                        this.isPartyCreated = true;
                        this.partyToJoin = response;

                        this.toast.successToast({
                            title: "Party Created",
                            description: `${response.name} was successfully created.`
                        })
                    },
                    error: (apiError) => {
                        this.toast.errorToast({
                            title: apiError.error.message,
                            description: apiError.error.errors[0]
                        })
                    }
                })
            }
        })   
    }

    enterIntoParty() {
        this.hasUserAccessSub = this.socketService.hasUserAccess(this.partyToJoin).subscribe({
            next: (response) => {
                if (response.hasAccess) {
                    this.router.navigateByUrl(`/party/${this.partyToJoin.id}`);
                }
                else {
                    this.toast.warningToast({
                        title: "Joining Party Validation",
                        description: response.reason
                    })
                }
                this.hasUserAccessSub.unsubscribe();
            }
        })

        this.resetForm();
        this.isPartyCreated = false;
    }

    copyToClipboard(): void {
        if(this.isPartyCreated){
            this.partyID.nativeElement.select();
            document.execCommand("copy");

            this.toast.successToast({
                title: "Party ID Copied",
                description: "The ID was copied to your clipboard."
            })
        }  
    }

    resetForm() {
        setTimeout(() => this.createForm.reset(), 500)
    }
}
