import { Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';
import { Votation } from 'src/app/models/votation';
import { NotificationService } from 'src/app/services/notification.service';
import { PartyService } from 'src/app/services/party.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { VotationService } from 'src/app/services/votation.service';

@Component({
    selector: 'app-party-player-cards',
    templateUrl: './party-player-cards.component.html',
    styleUrls: ['../party-player-view/party-player-view.component.css',
                './party-player-cards.component.css']
})
export class PartyPlayerCardsComponent implements OnInit, OnChanges {

    @Input() selectedUS: UserStory;

    cardSelected: HTMLElement;
    cardsList: Array<any>;
    showButton = true

    constructor(private partyService: PartyService,
                private votationService: VotationService,
                private socketService: SocketWebService, 
                private render: Renderer2,
                private toast: NotificationService) { }

    ngOnInit(): void {
        this.cardsList = this.partyService.getCardsList();

        if(!this.selectedUS)
            this.showButton = false

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedUS'] && changes['selectedUS'].currentValue)
            this.showButton = true;
    }

    refreshCards() {
        if(this.showButton) 
            this.showButton = false;

        if(this.cardSelected) {
            this.cardSelected = undefined;
            this.cardsList.forEach(card => {
                let cardToRefresh = document.getElementById(`card-${card.id}`);
                this.render.removeClass(cardToRefresh, 'inactive');
                this.render.removeClass(cardToRefresh, 'active');                
            });
        }
    }

    handleClickCard(card: any){
        if(this.cardSelected)
            this.render.removeClass(this.cardSelected, "active");

        this.cardSelected = document.getElementById(`card-${card.id}`);
        this.render.addClass(this.cardSelected, "active");
    }

    handleVote(){
        if(this.cardSelected){ 
            let votation = new Votation;
            votation.userID = sessionStorage.getItem('user-id');
            
            if(this.cardSelected.innerHTML == '\u221e')
                votation.value = '-1';
            else if(this.cardSelected.innerHTML == '½')
                votation.value = '0.5';
            else
                votation.value = this.cardSelected.innerHTML;

            this.votationService.createVotation(votation, this.selectedUS.id).subscribe({
                next: () => {
                    this.showButton = false;
                    this.socketService.sendPlayerVotation(votation, this.selectedUS.id);
                    this.inactivateRestOfCards();
                    
                    this.toast.successToast({
                        title: "Vote Sent",
                        description: "Your score was sent."
                    })
                },
                error: (apiError) => {
                    this.toast.errorToast({
                        title: apiError.error.message,
                        description: apiError.error.errors[0]
                    })
                }
            })
        } else{
            this.toast.warningToast({
                title: "Invalid Action",
                description: "Please select a card before vote."
            })
        }
    }

    inactivateRestOfCards() {
        this.cardsList.forEach(card => {
            if(`card-${card.id}` != this.cardSelected.id) {
                let cardToInactivate = document.getElementById(`card-${card.id}`);
                this.render.addClass(cardToInactivate, "inactive");
            }
        });
    }

}