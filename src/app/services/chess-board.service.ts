import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FENConverter } from '../chess-logic/FENConverter';
import { FENChar } from '../chess-logic/types';

export type DBMove = [number, number, number, number, (FENChar | null)?];

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {

  chessBoardState$ = new BehaviorSubject<string>(FENConverter.initialPosition);
  lastMove$ = new BehaviorSubject<DBMove | null>(null);
}