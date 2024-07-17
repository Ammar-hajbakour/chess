import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GameOptions } from '../../types/models';
import { getDatabase } from "firebase/database";
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment.development';
import { LocalBoardComponent } from '../../components/local-board/local-board.component';
import { StockfishBoardComponent } from "../../components/stockfish-board/stockfish-board.component";
import { OnlineBoardComponent } from "../../components/online-board/online-board.component";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
export type GameMode = 'local' | 'against-friend' | 'against-computer';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [RouterModule, NgClass, LocalBoardComponent, StockfishBoardComponent, OnlineBoardComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export default class GamePageComponent implements OnInit {

  // private readonly fb = inject(FbService)
  // private readonly gm = inject(GameService)
  private readonly id = inject(ActivatedRoute).snapshot.params['id']

  options = signal<GameOptions | null>(history.state?.options ?? null)
  async ngOnInit(): Promise<void> {

  }

  // private async resolveGameOptions(id: string): Promise<any> {
  //   let opts = history.state?.options
  //   if (id) opts = await firstValueFrom(this.fb.getItem('games', id))

  //   if (!opts) throw 'Game not found'
  //   let color = opts.color

  //   if (opts['type'] === 'freind') {
  //     color = opts['white'] === this.gm.user ? 'w' : 'b'
  //   }
  //   console.log(opts);

  //   const gos = {
  //     id,
  //     user: this.gm.user,
  //     color,
  //     level: opts['level'],
  //     provider: opts['type'] ?? opts['provider'] as "local" | "freind" | "stockfish"
  //   } as GameOptions
  //   console.log(gos);
  //   return gos
  // }
}

