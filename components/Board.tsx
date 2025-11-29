import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import ChessPiece from './ChessPiece';
import { PieceType, PieceColor, Difficulty, GameMode } from '../types';
import { getBestMove } from '../services/geminiService';

interface BoardProps {
  difficulty: Difficulty;
  gameMode: GameMode;
  onGameStateChange: (fen: string, isCheckmate: boolean, isDraw: boolean, isCheck: boolean, turn: PieceColor) => void;
  onCapture: (captured: { w: PieceType[], b: PieceType[] }) => void;
  resetTrigger: number;
}

const Board: React.FC<BoardProps> = ({ difficulty, gameMode, onGameStateChange, onCapture, resetTrigger }) => {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const HUMAN_COLOR_PVC = 'w';
  const capturedRef = useRef<{ w: PieceType[], b: PieceType[] }>({ w: [], b: [] });

  useEffect(() => {
    chess.reset();
    setFen(chess.fen());
    capturedRef.current = { w: [], b: [] };
    onCapture({ w: [], b: [] });
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setIsAiThinking(false);
    onGameStateChange(chess.fen(), false, false, false, 'w');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger, gameMode]);

  const updateGameState = () => {
    onGameStateChange(chess.fen(), chess.isCheckmate(), chess.isDraw(), chess.isCheck(), chess.turn());
    
    if (gameMode === GameMode.PvC && chess.turn() !== HUMAN_COLOR_PVC && !chess.isGameOver()) {
      setTimeout(makeAiMove, 100);
    }
  };

  const makeAiMove = async () => {
    setIsAiThinking(true);
    
    const moves = chess.moves();
    const bestMove = await getBestMove(chess.fen(), difficulty, moves);

    if (bestMove) {
        try {
            const moveResult = chess.move(bestMove);
            if (moveResult) {
                if (moveResult.captured) {
                   const capturedColor = moveResult.color === 'w' ? 'b' : 'w'; 
                   const newCaptured = { ...capturedRef.current };
                   newCaptured[capturedColor].push(moveResult.captured);
                   capturedRef.current = newCaptured;
                   onCapture(newCaptured);
                }
                setLastMove({ from: moveResult.from, to: moveResult.to });
            }
            setFen(chess.fen());
            updateGameState();
        } catch (e) {
            console.error("Move execution failed", e);
        }
    }
    setIsAiThinking(false);
  };

  const handleSquareClick = (square: Square) => {
    if (chess.isGameOver()) return;
    if (isAiThinking) return;
    if (gameMode === GameMode.PvC && chess.turn() !== HUMAN_COLOR_PVC) return;

    const piece = chess.get(square);
    const currentTurn = chess.turn();

    if (piece && piece.color === currentTurn) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        setSelectedSquare(square);
        const moves = chess.moves({ square, verbose: true }).map(m => m.to);
        setPossibleMoves(moves);
      }
      return;
    }

    if (selectedSquare) {
      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', 
        });

        if (move) {
          if (move.captured) {
             const capturedColor = move.color === 'w' ? 'b' : 'w';
             const newCaptured = { ...capturedRef.current };
             newCaptured[capturedColor].push(move.captured);
             capturedRef.current = newCaptured;
             onCapture(newCaptured);
          }
          setLastMove({ from: move.from, to: move.to });
          setFen(chess.fen());
          setSelectedSquare(null);
          setPossibleMoves([]);
          updateGameState();
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      } catch (e) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    }
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div className="relative select-none w-full">
      <div className="grid grid-cols-8 rounded overflow-hidden relative bg-zinc-800 aspect-square w-full">
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const square = `${file}${rank}` as Square;
            const isDark = (rIdx + fIdx) % 2 === 1;
            const piece = chess.get(square);
            const isSelected = selectedSquare === square;
            const isPossibleMove = possibleMoves.includes(square);
            const isLastMoveSource = lastMove?.from === square;
            const isLastMoveDest = lastMove?.to === square;
            const isCheckSquare = piece && piece.type === 'k' && piece.color === chess.turn() && chess.isCheck();

            // Background Colors - Minimalist Palette
            // Dark: Zinc-800 (#27272a)
            // Light: Zinc-700 (#3f3f46)
            let bgClass = isDark ? 'bg-[#27272a]' : 'bg-[#3f3f46]';
            
            // Move Highlights - purely flat colors, no gradients or shadows
            if (isLastMoveSource || isLastMoveDest) bgClass = isDark ? 'bg-indigo-900/40' : 'bg-indigo-800/40';
            if (isSelected) bgClass = 'bg-teal-700/60';
            if (isCheckSquare) bgClass = 'bg-rose-900/60';

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`
                  relative
                  w-full h-full
                  ${bgClass}
                  cursor-pointer transition-colors duration-200
                `}
              >
                {/* Coordinates */}
                {fIdx === 0 && (
                  <span className={`absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-medium opacity-40 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span className={`absolute bottom-0 right-1 text-[8px] sm:text-[10px] font-medium opacity-40 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {file}
                  </span>
                )}

                {/* Move Hints */}
                {isPossibleMove && !piece && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[15%] h-[15%] rounded-full bg-black/20" />
                   </div>
                )}
                {isPossibleMove && piece && (
                   <div className="absolute inset-0 border-[3px] border-black/20 rounded-sm" />
                )}
                
                {/* Piece Animation */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center pointer-events-none pb-[5%]">
                  <AnimatePresence>
                    {piece && (
                      <motion.div
                        key={`${piece.type}-${piece.color}-${square}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ 
                           type: "spring", 
                           stiffness: 400, 
                           damping: 30 
                        }}
                        className="w-[90%] h-[90%] relative z-10"
                        style={{ transformOrigin: 'bottom center' }}
                      >
                         <ChessPiece type={piece.type} color={piece.color} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;