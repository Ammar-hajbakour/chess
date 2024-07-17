import { inject, Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DBGame } from '../types/models';
import { firstValueFrom } from 'rxjs';
import { ref, set } from 'firebase/database';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  protected db = inject(AngularFireDatabase)
  // createGame(game: DBGame) {
  //   set(ref(this.db.database, 'games/'), game);
  //   return this.db.list('games')
  // }
}