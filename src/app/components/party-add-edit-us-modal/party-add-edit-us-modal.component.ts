import { Component, Input, OnInit, Output, EventEmitter, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserStory } from 'src/app/models/user-story';
import { NotificationService } from 'src/app/services/notification.service';
import { UserStoryService } from 'src/app/services/user-story.service';

@Component({
    selector: 'app-party-add-edit-us-modal',
    templateUrl: './party-add-edit-us-modal.component.html',
    styleUrls: ['./party-add-edit-us-modal.component.css']
})
export class PartyAddEditUsModalComponent implements OnInit {

    @Input() partyID: string;
    @Output() addedUserStory = new EventEmitter<UserStory>();
    @Output() updatedUserStory = new EventEmitter<any>();

    private actions = {
        CREATE: 'Create',
        UPDATE: 'Update'
    }

    formAction: string = this.actions.CREATE;
    actionUserStory: UserStory;

    userStoryForm = new FormGroup({
        tag: new FormControl('', [Validators.required, Validators.maxLength(6)]),
        name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        sprint: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        description: new FormControl('', [Validators.required]),
        workArea: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        storyWritter: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        fileLink: new FormControl('', [Validators.required]),
        timeMinutes: new FormControl('', [Validators.required, Validators.min(0)]),
        timeSeconds: new FormControl('', [Validators.required, Validators.min(0)]),
    });

    get usTag() { return this.userStoryForm.get('tag').value; }
    get usName() { return this.userStoryForm.get('name').value; }
    get usSprint() { return this.userStoryForm.get('sprint').value; }
    get usDescription() { return this.userStoryForm.get('description').value; }
    get usWorkArea() { return this.userStoryForm.get('workArea').value; }
    get usStoryWritter() { return this.userStoryForm.get('storyWritter').value; }
    get usFileLink() { return this.userStoryForm.get('fileLink').value; }
    get minutes() { return this.userStoryForm.get('timeMinutes').value; }
    get seconds() { return this.userStoryForm.get('timeSeconds').value; }

    constructor(private userStoryService: UserStoryService,
                private toast: NotificationService,
                private render: Renderer2) { }


    ngOnInit(): void {
        this.render.listen(document, "keydown", (event) => {
            if (event.key == 'Escape') 
                this.cleanModal();   
        })
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
        usData.timeInSeconds = (this.minutes * 60) + this.seconds;
        
        if (this.isUpdate) {
            usData.id = this.actionUserStory.id;

            this.userStoryService.updateUserStory(this.actionUserStory.id, usData).subscribe({
                next: (response) => {
                    this.updatedUserStory.emit();

                    this.toast.infoToast({
                        title: "User Story Updated",
                        description: `Item #${response.tag} was successfully updated`
                    })
                },
                error: (apiError) => {
                    this.toast.errorToast({
                        title: apiError.error.message,
                        description: apiError.error.errors[0]
                    })
                }
            });
        }
        else if(this.isCreate){
            this.userStoryService.createUserStory(usData).subscribe({
                next: (createResponse) => {
                    this.userStoryService.addUserStoryToParty(this.partyID, createResponse.id).subscribe({
                        next: (addResponse) => {
                            this.addedUserStory.emit(createResponse);

                            this.toast.successToast({
                                title: "User Story Created",
                                description: `Item #${createResponse.tag} was successfully created`
                            })
                        },
                        error: (apiError) => {
                            this.toast.errorToast({
                                title: apiError.error.message,
                                description: apiError.error.errors[0]
                            })
                        }
                    })
                },
                error: (apiError) => {
                    this.toast.errorToast({
                        title: apiError.error.message,
                        description: apiError.error.errors[0]
                    })
                }
            });

            this.userStoryForm.reset();
        }
    }

    cleanModal() {
        setTimeout(() => this.userStoryForm.reset(), 500)
    }

    initUpdateAction(userStoryToUpdate: UserStory) {
        this.formAction = this.actions.UPDATE;
        this.actionUserStory = userStoryToUpdate;
        
        let seconds = (userStoryToUpdate.timeInSeconds % 60);
        
        this.userStoryForm.setValue({
            tag: userStoryToUpdate.tag,
            name: userStoryToUpdate.name,
            sprint: userStoryToUpdate.sprint,
            description: userStoryToUpdate.description,
            workArea: userStoryToUpdate.workArea,
            storyWritter: userStoryToUpdate.storyWritter,
            fileLink: userStoryToUpdate.fileLink,
            timeSeconds: (seconds < 10) ? '0'+seconds : seconds,
            timeMinutes: Math.trunc(userStoryToUpdate.timeInSeconds / 60 )
        });
    }


    get isCreate() {
        return this.formAction == this.actions.CREATE;
    }

    get isUpdate(){
        return this.formAction == this.actions.UPDATE;
    }
}
