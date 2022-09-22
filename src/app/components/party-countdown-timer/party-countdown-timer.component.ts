import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
    selector: 'app-party-countdown-timer',
    templateUrl: './party-countdown-timer.component.html',
    styleUrls: ['./party-countdown-timer.component.css',
                '../party-player-view/party-player-view.component.css']
})
export class PartyCountdownTimerComponent implements OnInit,OnDestroy {

    protected minutes: number = 0;
    protected seconds: number = 0;
    protected intervalID: any;
    protected planningStartedSub: Subscription;
    protected planningConcludeSub: Subscription;
    @Input()userType: string;
    

   
    constructor(private socketService: SocketWebService,
                private toast: NotificationService) { }

    ngOnInit(): void {
        this.listenServerEvents();
    }

    ngOnDestroy(){
       this.removeAllSuscription();
    }

    startCountDown(time) {
        if(this.intervalID) this.stopCountDown();

        this.minutes = Math.trunc(time / 60)
        this.seconds = (time % 60);
        
        this.intervalID = setInterval(() => this.countDown(), 1000)
    }

    private countDown() {
        if(--this.seconds < 0) {
            this.seconds = 59;
            
            if(--this.minutes < 0) 
                this.stopCountDown();
        }
    }

    stopCountDown() {
        clearInterval(this.intervalID);
        this.intervalID = undefined;
        this.seconds = 0; this.minutes = 0;
        console.log('time ended');
        if(this.userType == 'owner'){
            this.socketService.plannigConcluded();
        }
      this.toast.infoToast({
        title: "Time Out",
        description: `The estimation has been stopped.`
      })
    }

    get minutesValue() {
        return (this.minutes < 10) ? `0${this.minutes}` : this.minutes;
    }
    get secondsValue() {
        return (this.seconds < 10) ? `0${this.seconds}` : this.seconds;
    }

    listenServerEvents(){
        this.planningStartedSub = this.socketService.planningStarted$.subscribe({
            next: (us) => {
                this.startCountDown(us.timeInSeconds);
            }
        }) 
        this.planningConcludeSub = this.socketService.plannigConcluded$.subscribe({
            next: () => {
               this.stopCountDown();
            }
        }) 
    }

    removeAllSuscription() {
        this.planningStartedSub.unsubscribe();
        this.planningConcludeSub.unsubscribe();
    }

}
   
