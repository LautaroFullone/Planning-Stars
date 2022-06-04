import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { UserStory } from 'src/app/models/user-story';
import { UserStoryService } from 'src/app/services/user-story.service';

@Component({
    selector: 'app-party-add-edit-us-modal',
    templateUrl: './party-add-edit-us-modal.component.html',
    styleUrls: ['./party-add-edit-us-modal.component.css']
})
export class PartyAddEditUsModalComponent implements OnInit, OnChanges {

    @Input() partyID: string;
    @Input() selectedUS: UserStory;
    @Output() addedUserStory = new EventEmitter<UserStory>();
    @Output() updatedUserStory = new EventEmitter<any>();

    formAction: string;

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

    constructor(private userStoryService: UserStoryService,
                private toast: NgToastService,
                private render: Renderer2) { }

   
    ngOnChanges(changes: SimpleChanges) {
        this.formAction = (this.selectedUS) ? 'Update' : 'Create';
    }

    ngOnInit(): void {
       this.render.listen(document, "keydown", (event) => {
            if(event.key == 'Escape'){
               this.cleanModal();
            }
        })
    }

    cleanModal() {
        setTimeout(() => this.userStoryForm.reset(), 500)
    }

    populateInputs(){
        this.userStoryForm.setValue({
            tag: this.selectedUS.tag,
            name: this.selectedUS.name,
            sprint: this.selectedUS.sprint,
            description: this.selectedUS.description,
            workArea: this.selectedUS.workArea,
            storyWritter: this.selectedUS.storyWritter,
            fileLink: this.selectedUS.fileLink
        });
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

        if(this.selectedUS){
            usData.id = this.selectedUS.id;

            this.userStoryService.updateUserStory(this.selectedUS.id, usData).subscribe( response => {
                
                this.updatedUserStory.emit();

                this.toast.info({
                    detail: "US UPDATED",
                    summary: `${response.name} was successfully updated`,
                    position: 'br', duration: 6000
                }),
                    (apiError) => {
                        this.toast.error({
                            detail: "US ERROR",
                            summary: apiError,
                            position: 'br', duration: 6000
                        })
                    }
            })

        }
        else{ 
            this.userStoryService.createUserStory(usData).subscribe(usResponse => {

                this.userStoryService.addUserStoryToParty(this.partyID, usResponse.id).subscribe(response => {

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
        }
        this.userStoryForm.reset();
    }
}
