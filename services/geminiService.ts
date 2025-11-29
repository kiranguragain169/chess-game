
import { Chess, Move } from 'chess.js';
import { Difficulty } from "../types";

// --- Evaluation Constants ---

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (simplified for white, mirrored for black)
// Positive values encourage center control and development
const PAWN_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10, 5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_PST = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_PST = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];

const QUEEN_PST = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,   0,  5,  5,  5,  5,  0, -5],
  [0,    0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

const KING_PST = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

// --- Evaluation Logic ---

const getPieceValue = (piece: { type: string; color: string }, r: number, c: number): number => {
  if (!piece) return 0;
  
  let value = PIECE_VALUES[piece.type] || 0;
  
  // Use PSTs
  const isWhite = piece.color === 'w';
  // If white, use row index as is. If black, mirror row index (0->7, 7->0)
  const row = isWhite ? r : 7 - r;
  const col = c; // PSTs are generally symmetric horizontally or we assume simplistic center focus

  let positionBonus = 0;
  switch(piece.type) {
    case 'p': positionBonus = PAWN_PST[row][col]; break;
    case 'n': positionBonus = KNIGHT_PST[row][col]; break;
    case 'b': positionBonus = BISHOP_PST[row][col]; break;
    case 'r': positionBonus = ROOK_PST[row][col]; break;
    case 'q': positionBonus = QUEEN_PST[row][col]; break;
    case 'k': positionBonus = KING_PST[row][col]; break;
  }

  return isWhite ? value + positionBonus : -(value + positionBonus);
};

const evaluateBoard = (chess: Chess): number => {
  let totalEvaluation = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        totalEvaluation += getPieceValue(piece, r, c);
      }
    }
  }
  return totalEvaluation;
};

// --- Minimax with Alpha-Beta Pruning ---

const minimax = (
  chess: Chess, 
  depth: number, 
  alpha: number, 
  beta: number, 
  isMaximizingPlayer: boolean
): number => {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = chess.moves();

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalValue = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evalValue);
      alpha = Math.max(alpha, evalValue);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalValue = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evalValue);
      beta = Math.min(beta, evalValue);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

const findBestMove = (chess: Chess, depth: number): string | null => {
  const moves = chess.moves();
  if (moves.length === 0) return null;

  let bestMove = null;
  let bestValue = chess.turn() === 'w' ? -Infinity : Infinity;
  const isMaximizing = chess.turn() === 'w';

  // Shuffle moves to add a bit of randomness to equal moves
  moves.sort(() => Math.random() - 0.5);

  for (const move of moves) {
    chess.move(move);
    // After making a move, it's the opponent's turn, so we call minimax with !isMaximizing
    const boardValue = minimax(chess, depth - 1, -Infinity, Infinity, !isMaximizing);
    chess.undo();

    if (isMaximizing) {
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    } else {
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

// --- Public API ---

export const getBestMove = async (
  fen: string,
  difficulty: Difficulty,
  legalMoves: string[]
): Promise<string | null> => {
  if (legalMoves.length === 0) return null;

  // Reconstruct chess instance from FEN
  const chess = new Chess(fen);
  
  let depth = 1;
  if (difficulty === Difficulty.Easy) {
    // Mostly random but checks for immediate captures sometimes
    if (Math.random() < 0.3) return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    depth = 1; 
  } else if (difficulty === Difficulty.Medium) {
    depth = 2; // Look ahead 2 ply (1 move each)
  } else {
    depth = 3; // Look ahead 3 ply (White move, Black move, White move...)
  }

  return findBestMove(chess, depth);
};
