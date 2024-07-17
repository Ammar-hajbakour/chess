import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { LocalBoardComponent } from '../local-board/local-board.component';
import { Subscription, firstValueFrom } from 'rxjs';
import { Color } from '../../chess-logic/types';
import { StockfishService } from '../../services/stockfish.service';
import { ChessBoardService } from '../../services/chess-board.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'stockfish-board',
  templateUrl: '../local-board/local-board.component.html',
  styleUrls: ['../local-board/local-board.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class StockfishBoardComponent extends LocalBoardComponent implements OnInit, OnDestroy, OnChanges {
  private stockfishSubscriptions$ = new Subscription();
  constructor(private stockfishService: StockfishService) {
    super(inject(ChessBoardService));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.stockfishService.stockfishOptions$.next({ ...this.options, color: this.options.color === Color.White ? Color.Black : Color.White });
      if (this.options.color === Color.Black) {
        this.flipBoard();
      }
    }
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    // const computerConfiSubscription$: Subscription = this.stockfishService.stockfishOptions$.subscribe({
    //   next: (stockfishOptions) => {
    //     if (stockfishOptions.color === Color.White) this.flipBoard();
    //   }
    // });
    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        if (this.chessBoard.isGameOver) {
          chessBoardStateSubscription$.unsubscribe();
          return;
        }
        const currentColor: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;

        if (currentColor !== this.stockfishService.stockfishOptions$.value.color
          // || playerColor !== this.stockfishService.stockfishOptions$.value.color
        ) {
          // this.turn = this.stockfishService.stockfishOptions$.value.color;
          return;
        }
        console.log('request move');

        const { prevX, prevY, newX, newY, promotedPiece } = await firstValueFrom(this.stockfishService.getBestMove(FEN));
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
        // this.turn = playerColor;
      }
    });

    this.stockfishSubscriptions$.add(chessBoardStateSubscription$);
    // this.stockfishSubscriptions$.add(computerConfiSubscription$);
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.stockfishSubscriptions$.unsubscribe();
  }
}