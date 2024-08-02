import { NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Color } from '../../chess-logic/types';
import { DBGame, GameOptions, GameStatus } from '../../types/models';
import { FirebaseService } from '../../services/firebase.service';
import { ChessBoardService } from '../../services/chess-board.service';
import { FENConverter } from '../../chess-logic/FENConverter';

type GameType = 'local' | 'friend' | 'stockfish';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router);
  chessBoardService = inject(ChessBoardService);
  firebase = inject(FirebaseService);

  options: GameOptions = {
    whitePlayer: 'guest',
    color: Color.White,
    level: null,
    type: 'local',
    allowSelectingOtherPlayerPieces: true
  };
  gameType = signal<GameType>('local');
  piecesColor: 'w' | 'b' = 'w';
  stockfishLevel: readonly number[] = [1, 2, 3, 4, 5]
  currenStockfishLevel = 1
  optionsDialogState: 'close' | 'open' = 'close';

  user = ''
  gameId: string | undefined = undefined;
  gameLink: string | undefined = undefined;

  isCopied = false;
  async startGame() {
    switch (this.gameType()) {
      case 'friend':
        this.options.type = 'friend';
        this.options.color = this.piecesColor === 'w' ? Color.White : Color.Black;
        this.options.whitePlayer = this.piecesColor === 'w' ? this.user : 'guest';
        this.options.allowSelectingOtherPlayerPieces = false
        break;

      case 'stockfish':
        this.options.type = 'stockfish';
        this.options.color = this.piecesColor === 'w' ? Color.White : Color.Black;
        this.options.level = this.currenStockfishLevel;
        this.options.whitePlayer = this.piecesColor === 'w' ? 'guest' : 'stockfish';
        this.options.allowSelectingOtherPlayerPieces = false
        break;

      default:
        this.options.allowSelectingOtherPlayerPieces = true
        break;
    }
    if (!this.options) return;

    if (this.options.type !== 'friend') {
      this.router.navigate([`/game`], { state: { options: this.options } });
      return
    }
    if (this.user.length < 3 || this.user.length > 20 || this.user === 'guest') {
      alert('Invalid nickname, it should be between 3 and 20 characters.')
      return
    }
    localStorage.setItem('USER', this.user)
    await this.createGame()
  }

  async createGame() {
    const dbGame: DBGame = {
      ...this.options,
      moves: [],
      status: GameStatus.Active,
      winner: null,
      gameOverMessage: null
    }

    this.gameId = await this.firebase.createGame(dbGame)
    this.gameLink = window.location.origin + `/game/${this.gameId}`
  }
  joinGame() {
    this.router.navigate([`/game`, this.gameId]);
  }
  copyLink() {
    if (!this.gameLink) return
    navigator.clipboard.writeText(this.gameLink);
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000)
  }
}

