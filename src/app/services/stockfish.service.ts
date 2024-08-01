import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Color, FENChar } from '../chess-logic/types';
import { ChessMove, StockfishQueryParams, stockfishLevels, StockfishResponse, GameOptions } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class StockfishService {
  private readonly api: string = "https://stockfish.online/api/s/v2.php";

  stockfishOptions$ = new BehaviorSubject<GameOptions>({
    type: 'stockfish',
    color: Color.Black,
    whitePlayer: 'stockfish',
    level: 1,
    allowSelectingOtherPlayerPieces: false
  });

  constructor(private http: HttpClient) { }

  private convertColumnLetterToYCoord(string: string): number {
    return string.charCodeAt(0) - "a".charCodeAt(0);
  }

  private promotedPiece(piece: string | undefined, stockfishColor: Color): FENChar | null {
    if (!piece) return null;
    if (piece === "n") return stockfishColor === Color.White ? FENChar.WhiteKnight : FENChar.BlackKnight;
    if (piece === "b") return stockfishColor === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop;
    if (piece === "r") return stockfishColor === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
    return stockfishColor === Color.White ? FENChar.WhiteQueen : FENChar.BlackQueen;
  }

  private moveFromStockfishString(move: string, stockfishColor: Color): ChessMove {
    const prevY: number = this.convertColumnLetterToYCoord(move[0]);
    const prevX: number = Number(move[1]) - 1;
    const newY: number = this.convertColumnLetterToYCoord(move[2]);
    const newX: number = Number(move[3]) - 1;
    const promotedPiece = this.promotedPiece(move[4], stockfishColor);
    return { prevX, prevY, newX, newY, promotedPiece };
  }

  getBestMove(fen: string, stockfishColor: Color): Observable<ChessMove> {
    const queryParams: StockfishQueryParams = {
      fen,
      depth: stockfishLevels[this.stockfishOptions$.value.level as number],
    };

    let params = new HttpParams().appendAll(queryParams);

    return this.http.get<StockfishResponse>(this.api, { params })
      .pipe(
        switchMap(response => {
          const bestMove: string = response.bestmove.split(" ")[1];
          return of(this.moveFromStockfishString(bestMove, stockfishColor));
        })
      )
  }
}