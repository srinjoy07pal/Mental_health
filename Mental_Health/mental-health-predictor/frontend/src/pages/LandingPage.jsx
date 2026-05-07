import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Activity, ShieldCheck, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors"
  >
    <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="space-y-32 py-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 text-sm text-primary border border-white/10"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span>AI-Powered Mental Health Analysis</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Understand Your <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Mental Well-being
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Evaluate your anxiety, depression, stress, and tension levels through advanced psychological modeling and interactive cognitive games.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center items-center space-x-4"
        >
          <Link to="/signup" className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition shadow-lg shadow-primary/20 text-lg">
            Start Free Assessment
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition border border-white/10 text-lg">
            Sign In
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Brain} 
          title="Cognitive Games" 
          desc="Play interactive mini-games designed to measure focus, reaction time, and memory under pressure."
          delay={0.4}
        />
        <FeatureCard 
          icon={Activity} 
          title="Real-time ML Analysis" 
          desc="Our machine learning models process your behavioral data and questionnaire responses instantly."
          delay={0.5}
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="Private & Secure" 
          desc="Your mental health data is encrypted and completely private. We never share your results."
          delay={0.6}
        />
      </section>
      
    </div>
  );
};

export default LandingPage;
