import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

    private playerJoinSub: Subscription;
    private playerLeaveSub: Subscription;
    private adminLeaveSub: Subscription;

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
        this.removeAllSubscriptions();
    }

    removeAllSubscriptions(): void {
        this.playerJoinSub.unsubscribe();
        this.playerLeaveSub.unsubscribe();
        this.adminLeaveSub.unsubscribe();
    }

    listenServerEvents(){
        let actualUserID = sessionStorage.getItem('user-id');

        this.playerJoinSub = this.socketService.playerJoin$.subscribe({
            next: (data) => {

                if (data.user.id == actualUserID) {
                    this.toast.successToast({
                        title: "You are in!",
                        description: `Welcome to the party.`
                    })
                }
                else {
                    this.toast.infoToast({
                        title: "Player Joined",
                        description: `${data.user.name} has just arrived to the party.`
                    })
                } 
            }
        })

        this.playerLeaveSub = this.socketService.playerLeave$.subscribe({
            next: (data) => {                               
                this.toast.infoToast({
                    title: "Player Leave",
                    description: `${data.user.name} has leave the party.`
                })
            }
        })

        this.adminLeaveSub = this.socketService.adminLeave$.subscribe({
            next: (response) => {

                this.toast.infoToast({
                    title: 'Admin left the party',
                    description: 'You just got redirected to dashboard'
                })

                this.socketService.leaveParty();
                this.router.navigate(['/dashboard'])
            }
        })
    }
}
