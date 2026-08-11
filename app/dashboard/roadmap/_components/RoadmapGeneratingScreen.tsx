'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Calendar, BookOpen, Mic, Sparkles, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

interface RoadmapGeneratingScreenProps {
  preferences: any;
  onComplete: (roadmapData: any) => void;
}

const LOADING_STEPS = [
  { message: "Analyzing Your Profile...", icon: User },
  { message: "Mapping Company Patterns...", icon: Building2 },
  { message: "Optimizing Timeline...", icon: Calendar },
  { message: "Selecting Best Resources...", icon: BookOpen },
  { message: "Preparing Interview Plan...", icon: Mic },
  { message: "Almost Ready...", icon: Sparkles },
];

const STEP_DURATION = 2000;
const TOTAL_ANIMATION_TIME = LOADING_STEPS.length * STEP_DURATION;

export default function RoadmapGeneratingScreen({ preferences, onComplete }: RoadmapGeneratingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  
  const apiDataRef = useRef<any>(null);
  const animationDoneRef = useRef(false);

  const startGeneration = async () => {
    setError(null);
    setIsGenerating(true);
    apiDataRef.current = null;
    animationDoneRef.current = false;
    setCurrentStep(0);

    // Start API call
    const apiPromise = fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentRole: 'Student',
        desiredRole: preferences?.role || 'Software Engineer',
        skills: [preferences?.language || 'JavaScript'],
        timeline: preferences?.duration || '3 Months'
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to generate roadmap');
        return res.json();
      })
      .then(data => {
        apiDataRef.current = data;
        checkCompletion();
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'An error occurred while generating your roadmap.');
        setIsGenerating(false);
      });

    // Handle animation sequence
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        animationDoneRef.current = true;
        checkCompletion();
      }
    }, STEP_DURATION);

    return () => clearInterval(interval);
  };

  const checkCompletion = () => {
    if (apiDataRef.current && animationDoneRef.current) {
      onComplete(apiDataRef.current);
    }
  };

  useEffect(() => {
    const cleanup = startGeneration();
    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, []);

  const CurrentIcon = LOADING_STEPS[Math.min(currentStep, LOADING_STEPS.length - 1)].icon;
  const currentMessage = LOADING_STEPS[Math.min(currentStep, LOADING_STEPS.length - 1)].message;

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center overflow-hidden rounded-3xl bg-[#0B0E14]">
      {/* Background Particles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-[#111620]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_50px_rgba(138,92,255,0.15)] flex flex-col items-center text-center"
      >
        {error ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Generation Failed</h3>
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={startGeneration}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl font-medium transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Progress Ring */}
            <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  className="fill-none stroke-white/[0.05] stroke-[4]"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  className="fill-none stroke-purple-500 stroke-[4]"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 300" }}
                  animate={{ 
                    strokeDasharray: `${(Math.min(currentStep + 1, LOADING_STEPS.length) / LOADING_STEPS.length) * 300} 300` 
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </svg>

              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 flex items-center justify-center border border-white/[0.08]">
                  <AnimatePresence mode="wait">
                    {animationDoneRef.current && !apiDataRef.current ? (
                      <motion.div
                        key="spinner"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CurrentIcon className="w-10 h-10 text-cyan-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="h-16 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={animationDoneRef.current && !apiDataRef.current ? 'finishing' : currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {animationDoneRef.current && !apiDataRef.current ? "Finalizing Details..." : currentMessage}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-6">
              {LOADING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-cyan-400 w-6'
                      : index < currentStep
                      ? 'bg-purple-500'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
