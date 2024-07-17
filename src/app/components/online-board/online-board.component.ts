import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { LocalBoardComponent } from '../local-board/local-board.component';
import { Subscription, firstValueFrom } from 'rxjs';
import { Color } from '../../chess-logic/types';
import { StockfishService } from '../../services/stockfish.service';
import { ChessBoardService } from '../../services/chess-board.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'online-board',
  templateUrl: '../local-board/local-board.component.html',
  styleUrls: ['../local-board/local-board.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class OnlineBoardComponent extends LocalBoardComponent implements OnInit, OnDestroy {
  private stockfishSubscriptions$ = new Subscription();

  constructor(private stockfishService: StockfishService) {
    super(inject(ChessBoardService));
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    const computerConfiSubscription$: Subscription = this.stockfishService.stockfishOptions$.subscribe({
      next: (stockfishOptions) => {
        if (stockfishOptions.color === Color.White) this.flipBoard();
      }
    });

    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        if (this.chessBoard.isGameOver) {
          chessBoardStateSubscription$.unsubscribe();
          return;
        }

        const player: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
        if (player !== this.stockfishService.stockfishOptions$.value.color) return;

        const { prevX, prevY, newX, newY, promotedPiece } = await firstValueFrom(this.stockfishService.getBestMove(FEN));
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
      }
    });

    this.stockfishSubscriptions$.add(chessBoardStateSubscription$);
    this.stockfishSubscriptions$.add(computerConfiSubscription$);
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.stockfishSubscriptions$.unsubscribe();
  }
}