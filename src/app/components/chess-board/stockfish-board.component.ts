import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { MainBoardComponent } from './main-board.component';
import { Subscription, firstValueFrom } from 'rxjs';
import { Color } from '../../chess-logic/types';
import { StockfishService } from '../../services/stockfish.service';
import { ChessBoardService } from '../../services/chess-board.service';
import { NgClass, NgStyle } from '@angular/common';
import { MoveListComponent } from '../move-list/move-list.component';


@Component({
  selector: 'stockfish-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, MoveListComponent]
})
export class StockfishBoardComponent extends MainBoardComponent implements OnInit, OnDestroy, OnChanges {
  private stockfishSubscriptions$ = new Subscription();
  private stockfishColor!: Color

  constructor(private stockfishService: StockfishService) {
    super(inject(ChessBoardService));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.stockfishColor = this.options.whitePlayer === 'stockfish' ? Color.White : Color.Black;
      if (this.stockfishColor === Color.White) {
        this.flipBoard();
      }
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        if (this.chessBoard.isGameOver) {
          chessBoardStateSubscription$.unsubscribe();
          return;
        }
        const currentColor: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
        if (currentColor !== this.stockfishColor) return

        const { prevX, prevY, newX, newY, promotedPiece } = await firstValueFrom(this.stockfishService.getBestMove(FEN, this.stockfishColor));
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
      }
    });

    this.stockfishSubscriptions$.add(chessBoardStateSubscription$);
  }


  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.stockfishSubscriptions$.unsubscribe();
  }
}