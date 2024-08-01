import { DBMove } from "../services/chess-board.service";
import { ChessMove, columns } from "../types/models";
import { Bishop } from "./pieces/bishop";
import { King } from "./pieces/king";
import { Knight } from "./pieces/knight";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Queen } from "./pieces/queen";
import { Rook } from "./pieces/rook";
import { FENChar, Color, LastMove, MoveType, Move } from "./types";

function getPieceFromFENChar(fenChar: FENChar): Piece {
  switch (fenChar) {
    case FENChar.WhitePawn:
      return new Pawn(Color.White);
    case FENChar.WhiteBishop:
      return new Bishop(Color.White);
    case FENChar.WhiteKnight:
      return new Knight(Color.White);
    case FENChar.WhiteRook:
      return new Rook(Color.White);
    case FENChar.WhiteQueen:
      return new Queen(Color.White);
    case FENChar.WhiteKing:
      return new King(Color.White);
    case FENChar.BlackPawn:
      return new Pawn(Color.Black);
    case FENChar.BlackBishop:
      return new Bishop(Color.Black);
    case FENChar.BlackKnight:
      return new Knight(Color.Black);
    case FENChar.BlackRook:
      return new Rook(Color.Black);
    case FENChar.BlackQueen:
      return new Queen(Color.Black);
    case FENChar.BlackKing:
      return new King(Color.Black);
    default:
      throw new Error(`Unrecognized FEN character: ${fenChar}`);
  }
}
function getFENChar(char: string): FENChar | null {
  switch (char) {
    case 'k':
      return FENChar.WhiteKing;
    case 'q':
      return FENChar.WhiteQueen;
    case 'r':
      return FENChar.WhiteRook;
    case 'b':
      return FENChar.WhiteBishop;
    case 'n':
      return FENChar.WhiteKnight;
    case 'p':
      return FENChar.WhitePawn;
    case 'K':
      return FENChar.BlackKing;
    case 'Q':
      return FENChar.BlackQueen;
    case 'R':
      return FENChar.BlackRook;
    case 'B':
      return FENChar.BlackBishop;
    case 'N':
      return FENChar.BlackKnight;
    default:
      return null;
  }
}

export function getMoveFromString(move: string): DBMove {
  const prevX = +move.charAt(0);
  const prevY = +move.charAt(1);
  const newX = +move.charAt(2);
  const newY = +move.charAt(3);
  const promotedPiece = getFENChar(move.charAt(4))
  return [prevX, prevY, newX, newY, promotedPiece];
}
export function convertFenToBoard(FEN: string): (Piece | null)[][] {
  const [boardFEN, playerColor, castlingAvailability, enPassant, halfMoveCounter, fullMoveNumber] = FEN.split(" ");
  const board: (Piece | null)[][] = [];
  const ranks = boardFEN.split("/");

  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i];
    const row: (Piece | null)[] = [];

    let j = 0;
    while (j < rank.length) {
      const char = rank[j];
      if (isNaN(Number(char))) {
        const piece = getPieceFromFENChar(char as FENChar);
        row.push(piece);
        j++;
      } else {
        const emptySquares = Number(char);
        for (let k = 0; k < emptySquares; k++) {
          row.push(null);
        }
        j++;
      }
    }
    board.push(row);
  }

  return board;
}