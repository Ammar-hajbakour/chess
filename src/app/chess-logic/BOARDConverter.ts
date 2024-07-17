import { ChessMove } from "../types/models";
import { Bishop } from "./pieces/bishop";
import { King } from "./pieces/king";
import { Knight } from "./pieces/knight";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Queen } from "./pieces/queen";
import { Rook } from "./pieces/rook";
import { FENChar, Color } from "./types";


// const e2e4MovesList = ['b5d5', 'h2f3', 'a5c5', 'g1e1', 'a6e2', 'h1h2']
// export const convertListOfE2E4ToFen = (movesList: string[]): string => {
//   let fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
//   const pieceMap: { [key: string]: string } = {
//     P: 'P',
//     N: 'N',
//     B: 'B',
//     R: 'R',
//     Q: 'Q',
//     K: 'K',
//     p: 'p',
//     n: 'n',
//     b: 'b',
//     r: 'r',
//     q: 'q',
//     k: 'k'
//   };

//   for (const move of movesList) {
//     if (move.length !== 4) {
//       throw new Error(`Invalid move: ${move}`);
//     }

//     // const piece: string = move[0];
//     const start: string = move.substring(0, 2);
//     const end: string = move.substring(2, 4);

//     const startFile: string = start.charAt(0);
//     const startRank: string = start.charAt(1);
//     const endFile: string = end.charAt(0);
//     const endRank: string = end.charAt(1);

//     const startIndex: number = (parseInt(startRank) - 1) * 8 + 'abcdefgh'.indexOf(startFile);
//     const endIndex: number = (parseInt(endRank) - 1) * 8 + 'abcdefgh'.indexOf(endFile);

//     if (startIndex < 0 || startIndex >= fen.length || endIndex < 0 || endIndex >= fen.length) {
//       throw new Error(`Invalid move: ${move}`);
//     }

//     const pieceToMove: string = fen[startIndex];
//     const pieceToCapture: string = fen[endIndex];

//     if (!pieceToMove || !pieceMap[pieceToMove]) {
//       throw new Error(`Invalid move: ${move} - piece not found at ${start}`);
//     }

//     if (!pieceToCapture) {
//       throw new Error(`Invalid move: ${move} - captured piece not found at ${end}`);
//     }

//     fen = fen.substring(0, startIndex) + pieceMap[pieceToMove] + fen.substring(startIndex + 1);
//     fen = fen.substring(0, endIndex) + pieceMap[pieceToCapture] + fen.substring(endIndex + 1);
//   }
//   console.log(fen);

//   return fen;
// }



export const convertMoveToChessJsMove = (move: ChessMove, piece: FENChar | null): string => {
  const { prevX, prevY, newX, newY, promotedPiece } = move;
  const fromRank = 8 - prevY;
  const fromFile = String.fromCharCode(97 + prevX);
  const toRank = 8 - newY;
  const toFile = String.fromCharCode(97 + newX);

  if (promotedPiece) {
    return `${piece}${fromFile}${fromRank}${toFile}${toRank}${promotedPiece}`;
  }

  return `${piece}${fromFile}${fromRank}${toFile}${toRank}`;
}

function convertFenToBoard(FEN: string): (Piece | null)[][] {
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

export default convertFenToBoard