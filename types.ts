
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum GameMode {
  PvC = 'PvC', // Player vs Computer
  PvP = 'PvP', // Player vs Player
}

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface BoardPiece {
  id: string; // Unique ID for animation tracking
  type: PieceType;
  color: PieceColor;
  square: string; // e.g., 'e2'
}

export interface Move {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameState {
  fen: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  turn: PieceColor;
  history: string[];
  captured: { w: PieceType[], b: PieceType[] };
}
