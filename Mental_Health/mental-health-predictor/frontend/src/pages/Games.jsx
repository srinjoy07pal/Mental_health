import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const MemoryGame = ({ onComplete }) => {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  
  const startTimeRef = useRef(0);
  const userSeqRef = useRef([]);

  const startGame = () => {
    setPlaying(true);
    setScore(0);
    setMistakes(0);
    startTimeRef.current = Date.now();
    setSequence([]);
    userSeqRef.current = [];
    setTimeout(() => playNextRound([]), 500);
  };
  
  const playNextRound = async (currentSequence) => {
    setIsShowingSequence(true);
    const newSeq = [...currentSequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    userSeqRef.current = [];
    
    // Flash sequence
    for (let i = 0; i < newSeq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveColor(newSeq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(null);
    }
    setIsShowingSequence(false);
  };
  
  const handleColorClick = (colorIdx) => {
    if (isShowingSequence) return;
    
    setActiveColor(colorIdx);
    setTimeout(() => setActiveColor(null), 200);

    userSeqRef.current.push(colorIdx);
    const currentUserSeq = userSeqRef.current;
    
    if (currentUserSeq[currentUserSeq.length - 1] !== sequence[currentUserSeq.length - 1]) {
      const finalMistakes = mistakes + 1;
      setMistakes(finalMistakes);
      setPlaying(false);
      const rt = (Date.now() - startTimeRef.current) / 1000 / (score || 1);
      onComplete('memory', score, Math.min(rt, 5), finalMistakes);
    } else if (currentUserSeq.length === sequence.length) {
      const newScore = score + 10;
      setScore(newScore);
      setIsShowingSequence(true); // Prevent clicks while waiting
      setTimeout(() => playNextRound(sequence), 1000);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-2xl border border-white/10 text-center h-full flex flex-col justify-center">
      <h3 className="text-xl font-bold mb-4">Memory Challenge</h3>
      {!playing ? (
        <button onClick={startGame} className="bg-primary px-6 py-2 rounded-lg font-bold w-48 mx-auto">Start Game</button>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-4 w-48 mx-auto mb-4">
            {[0,1,2,3].map(i => (
              <div 
                key={i} 
                onClick={() => handleColorClick(i)}
                className={`h-20 w-20 rounded-xl cursor-pointer transition-all duration-200 ${
                  i===0 ? 'bg-red-500' : i===1 ? 'bg-blue-500' : i===2 ? 'bg-green-500' : 'bg-yellow-500'
                } ${activeColor === i ? 'brightness-150 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'brightness-75 hover:brightness-90'} ${isShowingSequence ? 'pointer-events-none' : ''}`}
              ></div>
            ))}
          </div>
          <p className="text-sm text-gray-400 h-5">
            {isShowingSequence ? "Watch the sequence..." : "Your turn!"}
          </p>
        </div>
      )}
      <p className="mt-4 font-bold text-lg">Score: {score}</p>
    </div>
  );
};

const ColorReactionGame = ({ onComplete }) => {
  const [gameState, setGameState] = useState('idle');
  const [reactionTimes, setReactionTimes] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef(null);
  
  const startRound = () => {
    setGameState('waiting');
    const delay = Math.random() * 2000 + 1000;
    timeoutRef.current = setTimeout(() => {
      setGameState('click');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const startGame = () => {
    setReactionTimes([]);
    setMistakes(0);
    startRound();
  };
  
  const handleClick = () => {
    if (gameState === 'waiting') {
      clearTimeout(timeoutRef.current);
      setMistakes(m => m + 1);
      setGameState('idle');
      alert('Too early! Wait for green.');
      if (reactionTimes.length < 5) {
        setTimeout(startRound, 1000);
      }
    } else if (gameState === 'click') {
      const rt = Date.now() - startTimeRef.current;
      const newTimes = [...reactionTimes, rt];
      setReactionTimes(newTimes);
      
      if (newTimes.length >= 5) {
        setGameState('finished');
        const avgRt = newTimes.reduce((a,b)=>a+b, 0) / newTimes.length;
        const score = Math.max(0, 100 - (avgRt / 10));
        onComplete('color', score, avgRt / 1000, mistakes);
      } else {
        setGameState('idle');
        setTimeout(startRound, 1000);
      }
    }
  };

  return (
    <div className="bg-surface p-6 rounded-2xl border border-white/10 text-center h-full flex flex-col justify-center items-center relative min-h-[250px]">
      <h3 className="text-xl font-bold mb-2 absolute top-6">Reaction Test</h3>
      {gameState === 'idle' && reactionTimes.length === 0 ? (
        <button onClick={startGame} className="bg-primary px-6 py-2 rounded-lg font-bold">Start Game</button>
      ) : gameState === 'finished' ? (
        <div className="mt-8">
          <p className="text-xl font-bold mb-2">Game Over</p>
          <p>Avg Reaction: {(reactionTimes.reduce((a,b)=>a+b,0)/5).toFixed(0)}ms</p>
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className={`w-full h-32 mt-8 rounded-xl cursor-pointer flex items-center justify-center text-2xl font-bold transition-colors ${
            gameState === 'waiting' ? 'bg-red-500' : gameState === 'click' ? 'bg-green-500' : 'bg-surface border-2 border-dashed border-gray-600'
          }`}
        >
          {gameState === 'waiting' ? 'Wait...' : gameState === 'click' ? 'CLICK NOW!' : 'Get Ready...'}
        </div>
      )}
      {reactionTimes.length > 0 && gameState !== 'finished' && (
        <p className="mt-4 absolute bottom-6 text-sm text-gray-400">Round: {reactionTimes.length}/5</p>
      )}
    </div>
  );
};

const FocusGame = ({ onComplete }) => {
  const [playing, setPlaying] = useState(false);
  const [targetsHit, setTargetsHit] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const startTimeRef = useRef(0);
  
  const startGame = () => {
    setPlaying(true);
    setTargetsHit(0);
    setMistakes(0);
    startTimeRef.current = Date.now();
    moveTarget();
  };

  const moveTarget = () => {
    setTargetPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10
    });
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();
    const newHits = targetsHit + 1;
    setTargetsHit(newHits);
    
    if (newHits >= 10) {
      setPlaying(false);
      const finalScore = newHits * 10 - mistakes * 2;
      const rt = (Date.now() - startTimeRef.current) / 1000 / newHits;
      onComplete('focus', Math.max(0, finalScore), Math.min(rt, 5), mistakes);
    } else {
      moveTarget();
    }
  };

  const handleBgClick = () => {
    if (playing) {
      setMistakes(m => m + 1);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-2xl border border-white/10 text-center h-full min-h-[250px] flex flex-col items-center relative overflow-hidden" onClick={handleBgClick}>
      <h3 className="text-xl font-bold mb-2 z-10 pointer-events-none">Target Focus</h3>
      {!playing ? (
        <div className="m-auto z-10 flex flex-col items-center">
          <p className="text-gray-400 mb-4 text-sm">Click the target 10 times fast.</p>
          <button onClick={startGame} className="bg-primary px-6 py-2 rounded-lg font-bold">Start Game</button>
        </div>
      ) : (
        <div className="absolute top-12 left-0 right-0 bottom-0 bg-black/20">
          <div 
            onClick={handleTargetClick}
            className="absolute w-8 h-8 bg-accent rounded-full cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-100"
            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%`, transform: 'translate(-50%, -50%)' }}
          />
          <p className="absolute bottom-2 left-0 right-0 text-gray-400 text-sm pointer-events-none">Hits: {targetsHit}/10</p>
        </div>
      )}
    </div>
  );
};

const Games = () => {
  const [results, setResults] = useState([]);

  const handleGameComplete = async (game_type, score, reaction_time, mistakes) => {
    const data = { game_type, score, reaction_time, mistakes };
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://mental-health-prediction-f4md.onrender.com/api/games/', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults([...results, { ...data, saved: true }]);
      alert(`Game saved! Score: ${score.toFixed(0)}`);
    } catch (err) {
      alert("Failed to save game metrics");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Cognitive Assessment Games</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <MemoryGame onComplete={handleGameComplete} />
        <ColorReactionGame onComplete={handleGameComplete} />
        <div className="md:col-span-2">
          <FocusGame onComplete={handleGameComplete} />
        </div>
      </div>
    </div>
  );
};

export default Games;
