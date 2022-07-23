import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-party-switch',
    templateUrl: './party-switch.component.html',
    styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit, OnDestroy {

    isOwner: boolean;
    partyParamID: string;

    constructor(private activatedRoute: ActivatedRoute,
                private viewService: ViewService,
                private toast: NotificationService,
                private socketService: SocketWebService,
                private router: Router) {
                    
        this.viewService.setShowNarBar(true, false, true);
    }

    ngOnInit(): void {
        this.partyParamID = this.activatedRoute.snapshot.paramMap.get('id');

        this.socketService.joinParty(this.partyParamID).subscribe({
            next: (isUserOwner) => {
                this.isOwner = isUserOwner;
            }
        })
       
        this.listenServerEvents();
    }

    ngOnDestroy(): void {
        this.socketService.leaveParty();
    }

    listenServerEvents(){
        let actualUserID = sessionStorage.getItem('user-id');

        this.socketService.playerJoin$.subscribe({
            next: (user) => {

                if(user.id == actualUserID) {
                    this.toast.successToast({
                        title: "You are in!",
                        description: `Welcome to the party.`
                    })
                }
                else {
                    this.toast.successToast({
                        title: "Player Joined",
                        description: `${user.name} has just arrived to the party.`
                    })
                } 
            }
        })

        this.socketService.playerLeave$.subscribe({
            next: (response) => {  
                              
                this.toast.infoToast({
                    title: "Player Leave",
                    description: `${response.user.name} has leave the party.`
                })
            }
        })

        this.socketService.adminLeave$.subscribe({
            next: (response) => {
                this.router.navigateByUrl('/dashboard')

                this.toast.infoToast({
                    title: 'Admin left the party',
                    description: 'You just got redirected to dashboard'
                })

                this.socketService.leaveParty();
            }
        })
    }
}
