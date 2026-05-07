import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  { id: 1, category: 'anxiety', text: 'I feel more nervous and anxious than usual.' },
  { id: 2, category: 'anxiety', text: 'I feel afraid for no reason at all.' },
  { id: 3, category: 'anxiety', text: 'I get upset easily or feel panicky.' },
  { id: 4, category: 'depression', text: 'I feel down-hearted and blue.' },
  { id: 5, category: 'depression', text: 'I have trouble sleeping at night.' },
  { id: 6, category: 'depression', text: 'I feel that I am not useful or needed.' },
  { id: 7, category: 'stress', text: 'I find it hard to wind down.' },
  { id: 8, category: 'stress', text: 'I tend to over-react to situations.' },
  { id: 9, category: 'stress', text: 'I feel that I am using a lot of nervous energy.' },
  { id: 10, category: 'tension', text: 'I find it difficult to relax.' },
  { id: 11, category: 'tension', text: 'I feel tense or "wound up".' },
  { id: 12, category: 'tension', text: 'I experience muscle tension or stiffness.' }
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleSelect = (value) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value });
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate averages per category
    let scores = { anxiety: 0, depression: 0, stress: 0, tension: 0 };
    let counts = { anxiety: 0, depression: 0, stress: 0, tension: 0 };
    
    questions.forEach(q => {
      if(answers[q.id]) {
        scores[q.category] += answers[q.id];
        counts[q.category] += 1;
      }
    });

    const payload = {
      q_anxiety_score: counts.anxiety ? scores.anxiety / counts.anxiety : 1,
      q_depression_score: counts.depression ? scores.depression / counts.depression : 1,
      q_stress_score: counts.stress ? scores.stress / counts.stress : 1,
      q_tension_score: counts.tension ? scores.tension / counts.tension : 1,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/questionnaire/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      alert("Failed to submit questionnaire");
    }
  };

  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-xl relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-medium mb-8 text-center min-h-[64px]">
              {questions[currentStep].text}
            </h2>
            
            <div className="space-y-3">
              {[
                { val: 1, label: 'Never' },
                { val: 2, label: 'Rarely' },
                { val: 3, label: 'Sometimes' },
                { val: 4, label: 'Often' },
                { val: 5, label: 'Always' }
              ].map(option => (
                <button
                  key={option.val}
                  onClick={() => handleSelect(option.val)}
                  className={`w-full py-4 px-6 rounded-xl border text-left transition-all ${
                    answers[questions[currentStep].id] === option.val
                      ? 'bg-primary/20 border-primary text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {currentStep === questions.length - 1 && Object.keys(answers).length === questions.length && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition"
        >
          Submit Answers
        </motion.button>
      )}
    </div>
  );
};

export default Questionnaire;
