import { Color, FENChar, MoveList } from "../chess-logic/types";


export type StockfishQueryParams = {
  fen: string;
  depth: number;
}

export type ChessMove = {
  prevX: number;
  prevY: number;
  newX: number;
  newY: number;
  promotedPiece: FENChar | null;
}

export type StockfishResponse = {
  success: boolean;
  evaulatuion: number | null;
  mate: number | null;
  bestmove: string;
  continuation: string;
}

export type GameOptions = {
  type: 'local' | 'friend' | 'stockfish';
  color?: Color;
  whitePlayer: string,
  allowSelectingOtherPlayerPieces: boolean;
  level: number | null;
}
export enum GameStatus {
  Active = 'active',
  Closed = 'closed',
  Finished = 'finished'
}
export type DBGame = GameOptions & { moves: string[], status: GameStatus, winner: Color | null, gameOverMessage: string | null };
export const stockfishLevels: Readonly<Record<number, number>> = {
  1: 10,
  2: 11,
  3: 12,
  4: 13,
  5: 15
}

export const columns = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;