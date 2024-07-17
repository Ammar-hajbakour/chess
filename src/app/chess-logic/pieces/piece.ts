import { FENChar, Coords, Color } from "../types";

export abstract class Piece {
  protected abstract _FENChar: FENChar;
  protected abstract _directions: Coords[];

  constructor(private _color: Color) { }

  get FENChar(): FENChar {
    return this._FENChar;
  }
  get directions(): Coords[] {
    return this._directions;
  }
  get color(): Color {
    return this._color;
  }
}