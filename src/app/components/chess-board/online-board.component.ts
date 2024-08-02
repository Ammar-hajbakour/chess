import { Component, DestroyRef, OnDestroy, OnInit, SimpleChanges, computed, effect, inject, signal } from '@angular/core';
import { MainBoardComponent } from './main-board.component';
import { Subscription, filter, firstValueFrom } from 'rxjs';
import { Color, FENChar } from '../../chess-logic/types';
import { StockfishService } from '../../services/stockfish.service';
import { ChessBoardService, DBMove } from '../../services/chess-board.service';
import { NgClass } from '@angular/common';
import { MoveListComponent } from '../move-list/move-list.component';
import { FriendService } from '../../services/friend.service';
import { ChessMove, DBGame, GameStatus } from '../../types/models';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getMoveFromString } from '../../chess-logic/BOARDConverter';
import { ChessBoard } from '../../chess-logic/chess-board';

@Component({
  selector: 'online-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
  standalone: true,
  imports: [NgClass, MoveListComponent]
})
export class OnlineBoardComponent extends MainBoardComponent implements OnInit, OnDestroy {
  private readonly gameId = inject(ActivatedRoute).snapshot.params['id']
  private readonly destroyRef = inject(DestroyRef);
  private friendSubscriptions$ = new Subscription();
  private readonly friendService = inject(FriendService)
  private readonly localStorageUser = localStorage.getItem('USER') ?? 'guest';
  private friendColor!: Color
  private gameStatus!: GameStatus
  private lm = signal<ChessMove | null>(null)

  isReloaded = true;
  constructor() {
    super(inject(ChessBoardService));
    if (!this.gameId) return
    this.friendService.getGame(this.gameId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: async (res) => {
        if (!res) return
        this.gameStatus = res.status
        if (res.gameOverMessage) this.chessBoard._gameOverMessage = res.gameOverMessage
        this.gameOverMessage.set(this.chessBoard.gameOverMessage);
        if (!res.moves?.length) return
        if (res.moves[res.moves?.length - 1] === this.chessBoard.moves[this.chessBoard.moves?.length - 1]) return
        this.chessBoard._moves = res.moves;
        const [prevX, prevY, newX, newY, promotedPiece] = getMoveFromString(res.moves[res.moves?.length - 1])
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece!);
      }
    })

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.friendColor = this.localStorageUser === this.options.whitePlayer ? Color.Black : Color.White;
      if (this.friendColor === Color.White) {
        this.flipBoard();
      }
    }
  }
  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    await firstValueFrom(this.friendService.getGame(this.gameId))
    this.reDrawBoard();

    this.chessBoardService.lastMove$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (move) => {
        if (!move) return
        if (this.playerColor !== this.friendColor && !this.isReloaded) return
        const [prevX, prevY, newX, newY, promotedPiece] = move;
        this.postMove(this.newMove(prevX, prevY, newX, newY, promotedPiece!));
      }
    })
  }

  reDrawBoard(): void {
    this.chessBoard.moves.forEach(move => {
      const [prevX, prevY, newX, newY, promotedPiece] = getMoveFromString(move);
      this.updateBoard(prevX, prevY, newX, newY, promotedPiece!)
    })
    this.isReloaded = false
    this.chessBoard._isGameOver = this.gameStatus === GameStatus.Finished
  }
  override updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): void {
    super.updateBoard(prevX, prevY, newX, newY, promotedPiece);
    if (this.isReloaded) return
    this.chessBoardService.lastMove$.next([prevX, prevY, newX, newY, promotedPiece])
  }

  override promotePiece(piece: FENChar): void {
    super.promotePiece(piece);
    if (!this.promotionCoords || !this.selectedSquare.piece) return;
    const { x: newX, y: newY } = this.promotionCoords;
    const { x: prevX, y: prevY } = this.selectedSquare;
    this.postMove(this.newMove(prevX, prevY, newX, newY, piece));
  }
  override move(x: number, y: number): void {
    super.move(x, y);
    if (this.chessBoard.isGameOver) this.updateGame(GameStatus.Finished, this.playerColor, this.chessBoard.gameOverMessage);
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.friendSubscriptions$.unsubscribe();
  }

  private updateGame(status: GameStatus = GameStatus.Active, winner: Color | null = null, gameOverMessage: string | null = null): void {
    const payload: DBGame = {
      ...this.options,
      moves: this.chessBoard.moves,
      status,
      winner,
      gameOverMessage
    }
    this.friendService.updateGame(this.gameId, payload)

  }
  postMove(newMove: DBMove): void {
    if (this.chessBoard.isGameOver) return
    const n_m = JSON.stringify(newMove).split('[').join('').split(']').join('').split(',').join('').split('"').join('');
    this.chessBoard._moves.push(n_m);
    this.updateGame();
  }
  private newMove = (prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): DBMove => {
    return promotedPiece ?
      [prevX, prevY, newX, newY, promotedPiece]
      : [prevX, prevY, newX, newY];
  }
}