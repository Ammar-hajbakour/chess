import { Component, inject, Input, input, OnDestroy, OnInit, signal } from '@angular/core';
import { SelectedSquare } from './models';
import { Subscription, filter, fromEvent, tap } from 'rxjs';
import { ChessBoard } from '../../chess-logic/chess-board';
import { ChessBoardService } from '../../services/chess-board.service';
import { FENConverter } from '../../chess-logic/FENConverter';
import { pieceImagePaths, FENChar, Color, SafeSquares, Coords, LastMove, CheckState, MoveList, GameHistory, MoveType } from '../../chess-logic/types';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { GameOptions } from '../../types/models';
import { MoveListComponent } from '../move-list/move-list.component';

@Component({
  selector: 'main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
  standalone: true,
  imports: [NgClass, MoveListComponent]
})
export class MainBoardComponent implements OnInit, OnDestroy {

  router = inject(Router);
  @Input() options!: GameOptions;

  pieceImagePaths = pieceImagePaths;

  protected chessBoard = new ChessBoard();
  chessBoardView = signal<(FENChar | null)[][]>(this.chessBoard.chessBoardView);
  get playerColor(): Color { return this.chessBoard.playerColor; };
  get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; };
  gameOverMessage = signal<string | undefined>(this.chessBoard.gameOverMessage);
  selectedSquare: SelectedSquare = { piece: null };

  private pieceSafeSquares: Coords[] = [];
  private lastMove: LastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkState;

  get moveList(): MoveList { return this.chessBoard.moveList; };
  get gameHistory(): GameHistory { return this.chessBoard.gameHistory; };
  gameHistoryPointer: number = 0;

  // promotion properties
  isPromotionActive = false
  promotionCoords: Coords | null = null;
  promotedPiece = signal<FENChar | null>(null);
  promotionPieces(): FENChar[] {
    return this.playerColor === Color.White ?
      [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen] :
      [FENChar.BlackKnight, FENChar.BlackBishop, FENChar.BlackRook, FENChar.BlackQueen];
  }

  flipMode = signal(false);
  private subscriptions$ = new Subscription();
  soundsMuted = true
  confirmation: { img: string, message: string, action: () => void } | undefined = undefined
  constructor(protected chessBoardService: ChessBoardService) { }

  ngOnInit(): void {
    const keyEventSubscription$: Subscription = fromEvent<KeyboardEvent>(document, "keyup")
      .pipe(
        filter(event => event.key === "ArrowRight" || event.key === "ArrowLeft"),
        tap(event => {
          switch (event.key) {
            case "ArrowRight":
              if (this.gameHistoryPointer === this.gameHistory.length - 1) return;
              this.gameHistoryPointer++;
              break;
            case "ArrowLeft":
              if (this.gameHistoryPointer === 0) return;
              this.gameHistoryPointer--;
              break;
            default:
              break;
          }

          this.showPreviousMove(this.gameHistoryPointer);
        })
      )
      .subscribe();

    this.subscriptions$.add(keyEventSubscription$);
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.chessBoardService.chessBoardState$.next(FENConverter.initialPosition);
  }

  flipBoard(): void {
    this.flipMode.update(p => !p);
  }

  isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y);
  }

  isSquareLastMove(x: number, y: number): boolean {
    if (!this.lastMove) return false;
    const { prevX, prevY, currX, currY } = this.lastMove;
    return x === prevX && y === prevY || x === currX && y === currY;
  }

  isSquareChecked(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  isSquarePromotionSquare(x: number, y: number): boolean {
    if (!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }

  private unmarkingPreviouslySlectedAndSafeSquares(): void {
    this.selectedSquare = { piece: null };
    this.pieceSafeSquares = [];

    if (this.isPromotionActive) {
      this.isPromotionActive = false;
      this.promotedPiece.set(null);
      this.promotionCoords = null;
    }
  }

  private selectingPiece(x: number, y: number): void {

    this.soundsMuted = false
    if (this.gameOverMessage() !== undefined) return;
    const piece: FENChar | null = this.chessBoardView()[x][y];
    if (!piece) return;

    if (this.isWrongPieceSelected(piece)) return

    const isSameSquareClicked: boolean = !!this.selectedSquare.piece && this.selectedSquare.x === x && this.selectedSquare.y === y;
    this.unmarkingPreviouslySlectedAndSafeSquares();
    if (isSameSquareClicked) return

    this.selectedSquare = { piece, x, y };

    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];

  }

  protected placingPiece(newX: number, newY: number): void {
    if (!this.selectedSquare.piece) return;
    if (!this.isSquareSafeForSelectedPiece(newX, newY)) return;

    // pawn promotion
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.BlackPawn;
    const isPawnOnlastRank: boolean = isPawnSelected && (newX === 7 || newX === 0);
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnlastRank;

    if (shouldOpenPromotionDialog) {
      this.pieceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = { x: newX, y: newY };
      // because now we wait for player to choose promoted piece
      return;
    }

    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece());

  }

  protected updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): void {
    this.chessBoard.move(prevX, prevY, newX, newY, promotedPiece);
    this.chessBoardView.set(this.chessBoard.chessBoardView)
    this.markLastMoveAndCheckState(this.chessBoard.lastMove, this.chessBoard.checkState);
    this.unmarkingPreviouslySlectedAndSafeSquares();
    this.gameHistoryPointer++;
    if (this.options.type === 'stockfish') {
      this.chessBoardService.chessBoardState$.next(this.chessBoard.boardAsFEN);
    }
  }

  promotePiece(piece: FENChar): void {
    if (!this.promotionCoords || !this.selectedSquare.piece) return;
    this.promotedPiece.set(piece)
    const { x: newX, y: newY } = this.promotionCoords;
    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece());
  }



  private markLastMoveAndCheckState(lastMove: LastMove | undefined, checkState: CheckState): void {
    this.lastMove = lastMove;
    this.checkState = checkState;

    if (this.lastMove)
      this.moveSound(this.lastMove.moveType);
    else
      this.moveSound(new Set<MoveType>([MoveType.BasicMove]));
  }
  move(x: number, y: number): void {
    this.selectingPiece(x, y);
    this.placingPiece(x, y);
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const localStorageUser = localStorage.getItem("USER") ?? 'guest';
    const stockfishColor = this.options.whitePlayer === "stockfish" ? Color.White : Color.Black;
    const friendColor = this.options.whitePlayer === localStorageUser ? Color.Black : Color.White;
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColor === Color.Black ||
      !isWhitePieceSelected && this.playerColor === Color.White ||
      (this.options.type === "stockfish" && this.playerColor === stockfishColor) ||
      (this.options.type === 'friend' && this.playerColor === friendColor);

  }

  showPreviousMove(moveNumber: number): void {
    const { board, checkState, lastMove } = this.gameHistory[moveNumber];
    this.chessBoardView.set(board);
    this.markLastMoveAndCheckState(lastMove, checkState);
    this.gameHistoryPointer = moveNumber;
  }

  private moveSound(moveType: Set<MoveType>): void {
    const moveSound = new Audio("assets/sounds/move.mp3");
    moveSound.muted
    if (moveType.has(MoveType.Promotion)) moveSound.src = "assets/sounds/promote.mp3";
    else if (moveType.has(MoveType.Capture)) moveSound.src = "assets/sounds/capture.mp3";
    else if (moveType.has(MoveType.Castling)) moveSound.src = "assets/sounds/castling.mp3";

    if (moveType.has(MoveType.CheckMate)) moveSound.src = "assets/sounds/checkmate.webm";
    else if (moveType.has(MoveType.Check)) moveSound.src = "assets/sounds/check.mp3";
    if (this.soundsMuted) return
    moveSound.play();
  }
  closePromotionDialog(): void {
    this.unmarkingPreviouslySlectedAndSafeSquares();
  }


  surrender() {
    const message = this.playerColor === Color.White ? "Black won the game because White surrendered" : "White won the game because Black surrendered";
    this.chessBoard._gameOverMessage = message;
    this.chessBoard._isGameOver = true;
    this.gameOverMessage.set(message);
  }
  handleActions(action: string) {
    switch (action) {
      case 'reset':
        this.confirmation = {
          img: 'assets/icons/restart.png',
          message: 'Are you sure you want to reset the game?',
          action: () => this.reset()
        };
        break;
      case 'home':
        this.confirmation = {
          img: 'assets/icons/home.png',
          message: 'Are you sure you want to go back to the home page?',
          action: () => this.router.navigate(['/'])
        };
        break;
      case 'surrender':
        this.confirmation = {
          img: 'assets/icons/finish.png',
          message: 'Are you sure you want to surrender?',
          action: () => this.surrender()
        };
        break;
    }
  }
  doAction() {
    if (!this.confirmation) return
    this.confirmation.action();
    this.confirmation = undefined
  }
  reset() {
    this.chessBoard = new ChessBoard()
    this.chessBoardView.set(this.chessBoard.chessBoardView)
    this.selectedSquare = { piece: null };
    this.pieceSafeSquares = [];
    this.lastMove = this.chessBoard.lastMove;
    this.checkState = this.chessBoard.checkState;
    this.gameOverMessage.set(this.chessBoard.gameOverMessage);
    this.gameHistoryPointer = 0;
    this.isPromotionActive = false;
    this.promotionCoords = null;
    this.promotedPiece.set(null);
    this.flipMode.set(false);
    this.soundsMuted = true;
    this.confirmation = undefined;
    this.unmarkingPreviouslySlectedAndSafeSquares();
  }
}