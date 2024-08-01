import { inject, Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DBGame } from '../types/models';
import { firstValueFrom, map } from 'rxjs';
import { ref, set } from 'firebase/database';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  protected db = inject(AngularFireDatabase)
  private basePath = '/games';


  // Create a new game
  async createGame(game: DBGame): Promise<string> {
    let gameId: string | undefined = ''
    const _game = await this.db.list(this.basePath).push(game)
      .then(ref => gameId = ref.key as string)
      .catch(error => this.handleError(error));

    return gameId ?? '';
  }

  // Get a single game by id
  getGame(key: string) {
    return this.db.object<DBGame>(this.basePath + '/' + key).valueChanges();
  }

  // Get all games
  getGames() {
    return this.db.list<DBGame>(this.basePath).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  // Update a game
  updateGame(key: string, value: any): void {
    this.db.list(this.basePath).update(key, value)
      .catch(error => this.handleError(error));
  }

  // Delete a game
  deleteGame(key: string): void {
    this.db.list(this.basePath).remove(key)
      .catch(error => this.handleError(error));
  }

  // Delete everything
  deleteAll(): void {
    this.db.list(this.basePath).remove()
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
  }
}