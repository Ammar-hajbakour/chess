import { FENChar, Coords, Color } from "../types";
import { Piece } from "./piece";

export class King extends Piece {
  private _hasMoved: boolean = false;
  get hasMoved(): boolean {
    return this._hasMoved;
  }
  set hasMoved(_) {
    this._hasMoved = true;
  }
  protected override _FENChar: FENChar;
  protected override _directions: Coords[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 }
  ];

  constructor(private pieceColor: Color) {
    super(pieceColor);
    this._FENChar = pieceColor === Color.White ? FENChar.WhiteKing : FENChar.BlackKing;
  }
}