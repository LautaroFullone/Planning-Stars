import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/auth/auth.service';
import { Party } from 'src/app/models/party';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-create-modal',
    templateUrl: './party-create-modal.component.html',
    styleUrls: ['./party-create-modal.component.css']
})
export class PartyCreateModalComponent implements OnInit, AfterViewInit{

    @ViewChild("partyID") partyID: ElementRef;
    
    partyID_value: string;
    isPartyCreated: boolean = false;

    createForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        id: new FormControl(''),
        size: new FormControl('', [Validators.required, Validators.min(2), Validators.max(30)]),

    });

    get partyName() { return this.createForm.get('name').value; }
    get partySize() { return this.createForm.get('size').value; }

    constructor(private partyService: PartyService,
        private authService: AuthService,
        private router: Router,
        private render: Renderer2,
        private toast: NgToastService) { }

    ngOnInit(): void {
 
    }

    ngAfterViewInit(): void {
        this.render.listen(this.partyID.nativeElement, "focus", () => {
            if(this.partyID.nativeElement.value)    
                this.render.addClass(this.partyID.nativeElement, "nonSelection");
        })
    }

    ngSubmit() {
        let partyData = new Party;
        partyData.name = this.partyName;
        partyData.maxPlayer = this.partySize;
        partyData.createdBy = this.authService.getUser().name;

        this.partyService.createParty(partyData).subscribe(response => {

            this.render.setProperty(this.partyID.nativeElement, 'value', '#'+response.id);
            this.isPartyCreated = true;
            this.partyID_value = response.id;

            this.toast.success({
                detail: "PARTY CREATED",
                summary: `${response.name} was successfully created`,
                position: 'br', duration: 6000
            })
        }),
            (apiError) => {
                this.toast.error({
                    detail: "PARTY ERROR",
                    summary: apiError,
                    position: 'br', duration: 6000
                })
            }

    }

    resetForm(){
        this.createForm.reset();
    }

    joinParty(){
        this.resetForm()
        this.isPartyCreated= false;

        console.log('enter');
        console.log(this.partyID_value);
    }

    copyToClipboard(): void {
        console.log('tratando de copiar');
        if(this.isPartyCreated){
            this.partyID.nativeElement.select();
            document.execCommand("copy");

            this.toast.success({
                detail: "ID COPIED",
                summary: `The party ID was copied to clipboard`,
                position: 'br', duration: 6000
            })
        }  
    }

}
