import React, { useState } from 'react';
import { RefreshCw, ChevronLeft } from 'lucide-react';
import Board from './components/Board';
import ChessPiece from './components/ChessPiece';
import { Difficulty, PieceColor, PieceType, GameMode } from './types';
import { motion, AnimatePresence } from 'framer-motion';

type ViewState = 'menu' | 'difficulty' | 'game';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PvC);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  
  const [gameState, setGameState] = useState<{
    isCheckmate: boolean;
    isDraw: boolean;
    isCheck: boolean;
    turn: PieceColor;
  }>({
    isCheckmate: false,
    isDraw: false,
    isCheck: false,
    turn: 'w',
  });
  const [captured, setCaptured] = useState<{ w: PieceType[]; b: PieceType[] }>({ w: [], b: [] });
  const [resetCount, setResetCount] = useState(0);

  const handleGameStateChange = (
    fen: string,
    isCheckmate: boolean,
    isDraw: boolean,
    isCheck: boolean,
    turn: PieceColor
  ) => {
    setGameState({ isCheckmate, isDraw, isCheck, turn });
  };

  const handleReset = () => {
    setResetCount(prev => prev + 1);
    setGameState({
      isCheckmate: false,
      isDraw: false,
      isCheck: false,
      turn: 'w',
    });
    setCaptured({ w: [], b: [] });
  };

  const onSinglePlayerClick = () => {
    setGameMode(GameMode.PvC);
    setView('difficulty');
  };

  const onMultiplayerClick = () => {
    setGameMode(GameMode.PvP);
    setView('game');
    handleReset();
  };

  const onDifficultySelect = (level: Difficulty) => {
    setDifficulty(level);
    setView('game');
    handleReset();
  };

  const goHome = () => {
    setView('menu');
  };

  const getStatusMessage = () => {
    if (gameState.isCheckmate) {
      if (gameMode === GameMode.PvC) {
        return gameState.turn === 'w' ? 'Game Over' : 'Victory';
      }
      return gameState.turn === 'w' ? 'Black Wins' : 'White Wins';
    }
    if (gameState.isDraw) return 'Stalemate';
    if (gameState.isCheck) return 'Check';
    
    if (gameMode === GameMode.PvC) {
      return gameState.turn === 'w' ? 'Your Move' : 'Thinking...';
    } else {
      return gameState.turn === 'w' ? "White's Turn" : "Black's Turn";
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.4, ease: "easeInOut" } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 flex flex-col font-sans overflow-hidden selection:bg-zinc-700 selection:text-white">
      <AnimatePresence mode="wait">
        
        {/* --- MENU VIEW --- */}
        {view === 'menu' && (
          <motion.div 
            key="menu"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-grow flex flex-col items-center justify-center p-4 relative z-10"
          >
            <div className="text-center space-y-12 max-w-md w-full">
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white">
                  ZEN<br/><span className="font-bold text-zinc-600">CHESS</span>
                </h1>
                <div className="h-px w-12 bg-zinc-700 mx-auto mt-8" />
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-4 pt-4 px-4 sm:px-0">
                <button
                  onClick={onSinglePlayerClick}
                  className="group relative w-full py-4 bg-transparent hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all duration-300 rounded-sm uppercase tracking-widest text-xs font-medium"
                >
                  Single Player
                </button>

                <button
                  onClick={onMultiplayerClick}
                  className="group relative w-full py-4 bg-transparent hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all duration-300 rounded-sm uppercase tracking-widest text-xs font-medium"
                >
                  Multiplayer
                </button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-12">
                 <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Designed for Focus</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* --- DIFFICULTY VIEW --- */}
        {view === 'difficulty' && (
          <motion.div 
            key="difficulty"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-grow flex flex-col items-center justify-center p-4"
          >
             <motion.button 
              variants={itemVariants}
              onClick={goHome}
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-zinc-900 text-zinc-600 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="max-w-md w-full text-center">
              <motion.h2 variants={itemVariants} className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-12">
                Select Difficulty
              </motion.h2>
              
              <div className="flex flex-col gap-3">
                {[
                  { id: Difficulty.Easy, label: 'Casual', sub: 'For relaxation' },
                  { id: Difficulty.Medium, label: 'Tactical', sub: 'Standard challenge' },
                  { id: Difficulty.Hard, label: 'Master', sub: 'Deep calculation' }
                ].map((level) => (
                  <motion.button 
                    key={level.id}
                    variants={itemVariants}
                    onClick={() => onDifficultySelect(level.id)}
                    className="group flex items-center justify-between w-full p-6 border-b border-zinc-800 hover:border-white hover:bg-zinc-900/30 transition-all duration-300 text-left"
                  >
                    <span className="text-xl sm:text-2xl font-light text-zinc-300 group-hover:text-white tracking-wide transition-colors">
                      {level.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      {level.sub}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- GAME VIEW --- */}
        {view === 'game' && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="flex flex-col min-h-screen"
          >
            {/* Navbar */}
            <header className="w-full p-4 md:p-6 flex items-center justify-between border-b border-zinc-800/50 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={goHome}
                  className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                   <h1 className="text-sm font-medium tracking-widest text-zinc-300 uppercase">
                     Zen Chess 
                   </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                   {gameMode === GameMode.PvC && (
                     <span className="hidden sm:inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500 border border-zinc-800 rounded-sm">
                       {difficulty}
                     </span>
                   )}
                   <button 
                    onClick={handleReset}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                    title="Restart Game"
                   >
                    <RefreshCw className="w-4 h-4" />
                   </button>
              </div>
            </header>

            <main className="flex-grow flex flex-col lg:flex-row items-center justify-center p-2 md:p-8 gap-6 lg:gap-20 max-w-7xl mx-auto w-full">
              
              {/* Mobile Status Indicator (Visible only on small screens) */}
              <div className="lg:hidden text-center -mb-2">
                 <span className="text-2xl font-thin text-white tracking-tight">{getStatusMessage()}</span>
              </div>

              {/* Board Container */}
              <div className="order-1 flex-shrink-0 w-full max-w-[min(100vw,45rem)] aspect-square">
                <div className="w-full h-full p-1 md:p-4 rounded-sm bg-[#09090b] border border-zinc-900">
                  <Board
                    gameMode={gameMode}
                    difficulty={difficulty}
                    onGameStateChange={handleGameStateChange}
                    onCapture={setCaptured}
                    resetTrigger={resetCount}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="order-2 w-full max-w-md lg:max-w-xs flex flex-col gap-6 lg:gap-12 px-4 md:px-0">
                
                {/* Status Panel (Desktop) */}
                <div className="hidden lg:block text-center lg:text-left space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600">Status</div>
                  <div className="text-4xl font-thin text-white tracking-tight">
                      {getStatusMessage()}
                  </div>
                </div>

                {/* Captures */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                  <div className="space-y-2">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                         {gameMode === GameMode.PvC ? 'Opponent' : 'White'}
                      </div>
                      <div className="flex flex-wrap gap-1 min-h-[1.5rem] content-start">
                        {captured.w.map((p, i) => (
                          <div key={i} className="w-5 h-5 opacity-60 grayscale hover:grayscale-0 transition-all"><ChessPiece type={p} color="w" /></div>
                        ))}
                        {captured.w.length === 0 && <div className="w-1 h-1 bg-zinc-800 rounded-full" />}
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                         {gameMode === GameMode.PvC ? 'You' : 'Black'}
                      </div>
                      <div className="flex flex-wrap gap-1 min-h-[1.5rem] content-start">
                        {captured.b.map((p, i) => (
                          <div key={i} className="w-5 h-5 opacity-60 grayscale hover:grayscale-0 transition-all"><ChessPiece type={p} color="b" /></div>
                        ))}
                         {captured.b.length === 0 && <div className="w-1 h-1 bg-zinc-800 rounded-full" />}
                      </div>
                  </div>
                </div>

              </div>
            </main>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default App;