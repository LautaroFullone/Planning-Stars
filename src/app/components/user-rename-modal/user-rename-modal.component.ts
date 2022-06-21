import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-user-rename-modal',
    templateUrl: './user-rename-modal.component.html',
    styleUrls: ['./user-rename-modal.component.css']
})
export class UserRenameModalComponent implements OnInit {

    @Output() updatedUserName = new EventEmitter<any>();

    renameForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(10)]),
    });

    get username() { return this.renameForm.get('username').value; }

    constructor(private authService: AuthService,
                private toast: NotificationService,
                private render: Renderer2) { }

    ngOnInit(): void {
        this.render.listen(document, "keydown", (event) => {
            if (event.key == 'Escape')
                this.cleanModal();
        })
    }

    ngSubmit() {
        let userID = sessionStorage.getItem('user-id');
        let newName = this.username;

        this.authService.getUser().subscribe({
            next: (userResponse) => {
                let actualUser = userResponse;
                actualUser.name = newName;

                this.authService.renameUserAccount(userID, actualUser).subscribe({
                    next: (response) => {                       
                        this.updatedUserName.emit(response.name);
                        this.authService.setUserName(response.name);
                        this.cleanModal();

                        this.toast.infoToast({
                            title: 'Name Updated',
                            description: `Your name was successfully updated.`
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
    
    cleanModal() {
        setTimeout(() => this.renameForm.reset(), 500)
    }
}
