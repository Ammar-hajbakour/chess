import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Color, FENChar } from '../chess-logic/types';
import { ChessMove, DBGame, GameOptions } from '../types/models';
import { FirebaseService } from './firebase.service';
import { ActivatedRoute } from '@angular/router';
import { convertFenToBoard } from '../chess-logic/BOARDConverter';
import { Piece } from '../chess-logic/pieces/piece';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private firebaseService = inject(FirebaseService);
  private readonly id = inject(ActivatedRoute).snapshot.params['id']
  private readonly localStorageUser = localStorage.getItem('USER') ?? '';

  constructor() { }

  private convertColumnLetterToYCoord(string: string): number {
    return string.charCodeAt(0) - "a".charCodeAt(0);
  }

  private promotedPiece(piece: string | undefined, friendColor: Color): FENChar | null {
    if (!piece) return null;
    if (piece === "n") return friendColor === Color.White ? FENChar.WhiteKnight : FENChar.BlackKnight;
    if (piece === "b") return friendColor === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop;
    if (piece === "r") return friendColor === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
    return friendColor === Color.White ? FENChar.WhiteQueen : FENChar.BlackQueen;
  }

  moveFromStockfishString(move: string, friendColor: Color): ChessMove {
    const prevY: number = this.convertColumnLetterToYCoord(move[0]);
    const prevX: number = Number(move[1]) - 1;
    const newY: number = this.convertColumnLetterToYCoord(move[2]);
    const newX: number = Number(move[3]) - 1;
    const promotedPiece = this.promotedPiece(move[4], friendColor);
    return { prevX, prevY, newX, newY, promotedPiece };
  }
  // updateGame(options: DBGame): void {
  //   this.firebaseService.updateGame(this.id, options);
  // }
  getGame(id: string): Observable<DBGame | null> {
    return this.firebaseService.getGame(id)
    // const queryParams: StockfishQueryParams = {
    //   fen,
    //   depth: stockfishLevels[this.gameOptions$.value.level as number],
    // };

    // let params = new HttpParams().appendAll(queryParams);

    // return this.http.get<StockfishResponse>(this.api, { params })
    //   .pipe(
    //     switchMap(response => {
    //       const bestMove: string = response.bestmove.split(" ")[1];
    //       return of(this.moveFromStockfishString(bestMove));
    //     })
    //   )
  }
  updateGame(id: string, options: DBGame): void {
    this.firebaseService.updateGame(id, options);
  }

}