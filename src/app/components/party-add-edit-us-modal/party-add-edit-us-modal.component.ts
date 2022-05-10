import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { UserStory } from 'src/app/models/user-story';
import { PartyService } from 'src/app/services/party.service';

@Component({
    selector: 'app-party-add-edit-us-modal',
    templateUrl: './party-add-edit-us-modal.component.html',
    styleUrls: ['./party-add-edit-us-modal.component.css']
})
export class PartyAddEditUsModalComponent implements OnInit {

    @Input() partyID: string;
    @Output() addedUserStory = new EventEmitter<UserStory>();

    userStoryForm = new FormGroup({
        tag: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        sprint: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        description: new FormControl('', [Validators.required]),
        workArea: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        storyWritter: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        fileLink: new FormControl('', [Validators.required]),
    });

    get usTag() { return this.userStoryForm.get('tag').value; }
    get usName() { return this.userStoryForm.get('name').value; }
    get usSprint() { return this.userStoryForm.get('sprint').value; }
    get usDescription() { return this.userStoryForm.get('description').value; }
    get usWorkArea() { return this.userStoryForm.get('workArea').value; }
    get usStoryWritter() { return this.userStoryForm.get('storyWritter').value; }
    get usFileLink() { return this.userStoryForm.get('fileLink').value; }

    constructor(private partyService: PartyService,
        private toast: NgToastService) { }

    ngOnInit(): void {
    }

    ngSubmit() {

        let usData = new UserStory();
        usData.tag = this.usTag;
        usData.name = this.usName;
        usData.sprint = this.usSprint;
        usData.description = this.usDescription;
        usData.workArea = this.usWorkArea;
        usData.storyWritter = this.usStoryWritter;
        usData.fileLink = this.usFileLink;

        this.partyService.createUserStory(usData).subscribe(usResponse => {

            this.partyService.addUserStoryToParty(this.partyID, usResponse.id).subscribe(response => {

                console.log("adding us");
                console.log(usResponse);

                this.addedUserStory.emit(usResponse);

                this.toast.success({
                    detail: "US CREATED",
                    summary: `${usResponse.name} was successfully created`,
                    position: 'br', duration: 6000
                })
            }),
                (apiError) => {
                    this.toast.error({
                        detail: "US ERROR",
                        summary: apiError,
                        position: 'br', duration: 6000
                    })
                }
        }),
            (apiError) => {
                this.toast.error({
                    detail: "US ERROR",
                    summary: apiError,
                    position: 'br', duration: 6000
                })
            }

        this.userStoryForm.reset();

    }

}
