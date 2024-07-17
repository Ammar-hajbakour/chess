import { NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Color } from '../../chess-logic/types';
import { DBGame, GameOptions } from '../../types/models';
import { FirebaseService } from '../../services/firebase.service';

type GameType = 'local' | 'against-friend' | 'against-computer';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router);
  firebase = inject(FirebaseService);

  options: GameOptions = {
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

  user = 'user'


  async startGame() {

    switch (this.gameType()) {
      case 'against-friend':
        this.options.type = 'against-friend';
        this.options.allowSelectingOtherPlayerPieces = false
        break;

      case 'against-computer':
        this.options.type = 'against-computer';
        this.options.level = this.currenStockfishLevel;
        this.options.allowSelectingOtherPlayerPieces = false
        break;

      default:
        this.options.allowSelectingOtherPlayerPieces = true
        break;
    }
    this.options.color = this.piecesColor === 'w' ? Color.White : Color.Black;
    if (!this.options) return;

    if (this.options.type !== 'against-friend') {
      this.router.navigate([`/game`], { state: { options: this.options } });
      return
    }

    const dbGame: DBGame = {
      ...this.options,
      user: this.user,
      moves: []
    }
    // const game = this.firebase.createGame(dbGame)
    // console.log(game);

    // show dialog with the link with join game button
    // const gameLink = window.location.origin + `/game/${game.key}`
    // console.log(gameLink);

    // navigate to game when clicks on join game button
    // this.router.navigate([`/game`, game.key]);
  }
}

