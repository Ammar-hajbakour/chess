import { FENChar, Coords, Color } from "../types";
import { Piece } from "./piece";

export class Pawn extends Piece {
  private _hasMoved: boolean = false;
  get hasMoved(): boolean {
    return this._hasMoved;
  }
  set hasMoved(value: boolean) {
    this._hasMoved = true;
    this._directions = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 }
    ]
    if (this.pieceColor === Color.Black) this.setBlackPawnDirections();
  }
  protected override _FENChar: FENChar;
  protected override _directions: Coords[] = [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 }
  ];

  constructor(private pieceColor: Color) {
    super(pieceColor);
    if (pieceColor === Color.Black) this.setBlackPawnDirections();
    this._FENChar = pieceColor === Color.White ? FENChar.WhitePawn : FENChar.BlackPawn;
  }

  setBlackPawnDirections() {
    this._directions = this._directions.map(({ x, y }) => ({ x: -1 * x, y }))
  }
}