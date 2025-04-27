'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
};

const slideIn = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8 } }
};

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const slides = [
    {
      title: "ThreatEye - AI-Powered Security",
      content: "Real-time monitoring system for detecting extremist content and terror-related activity"
    },
    {
      title: "The Problem",
      content: "Terror plots and violent radicalization often remain undetected until it's too late. Human monitoring is impossible at scale."
    },
    {
      title: "Our Solution",
      content: "Automated surveillance using AI to detect dangerous imagery, extremist content, and hate speech in real-time."
    },
    {
      title: "Key Features",
      content: [
        "Continuous Monitoring via ScreenPipe",
        "AI-Powered Threat Detection using Groq",
        "Real-time Alerting System",
        "Secure Investigation Console"
      ]
    },
    {
      title: "How It Works",
      content: [
        "1. Screen content and audio is captured continuously",
        "2. AI models analyze for weapons, extremist symbols, and suspicious text",
        "3. Threats are instantly flagged with screenshots",
        "4. Security personnel receive immediate alerts"
      ]
    },
    {
      title: "Technology Stack",
      content: [
        "Next.js & React Frontend",
        "Groq AI for High-Speed Inference",
        "ScreenPipe for Content Capture",
        "Electron for Desktop Integration"
      ]
    },
    {
      title: "Implementation Strategy",
      content: "Deploy across key endpoints with minimal system footprint. Secure, encrypted communications ensure privacy compliance."
    },
    {
      title: "Ready for Deployment",
      content: "ThreatEye is operational and ready to be deployed to enhance your security infrastructure."
    }
  ];

  useEffect(() => {
    if (isTyping) {
      const text = typeof slides[currentSlide].content === 'string' 
        ? slides[currentSlide].content 
        : '';
      
      if (typedText.length < text.length) {
        const timeout = setTimeout(() => {
          setTypedText(text.substring(0, typedText.length + 1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [typedText, currentSlide, isTyping, slides]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setTypedText('');
      setIsTyping(true);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setTypedText('');
      setIsTyping(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 flex flex-col relative overflow-hidden font-mono">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      
      {/* Radar animation */}
      <div className="radar-container">
        <div className="radar-sweep"></div>
      </div>
      
      <header className="p-6 border-b border-green-700 relative z-10 backdrop-blur-sm bg-black/40">
        <div className="flex justify-between items-center">
          <div className="military-badge glow-text">
            <h1 className="text-xl tracking-wider">THREAT<span className="text-green-300">EYE</span></h1>
            <span className="text-xs">CLASSIFIED BRIEFING</span>
          </div>
          <div className="digital-counter">
            <span className="glow-text">SLIDE {currentSlide + 1}/{slides.length}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-8 flex items-center justify-center">
        <motion.div
          key={currentSlide}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-4xl w-full mx-auto bg-black/60 backdrop-blur-md p-8 rounded-md border border-green-700 shadow-glow relative"
        >
          <div className="border-top-indicator"></div>
          <div className="border-bottom-indicator"></div>
          
          <motion.h2 
            variants={slideIn}
            className="text-3xl mb-6 glow-text tracking-wide"
          >
            {slides[currentSlide].title}
          </motion.h2>
          
          {typeof slides[currentSlide].content === 'string' ? (
            <p className="text-xl leading-relaxed tracking-wide">
              <span className="typing-cursor">{typedText}</span>
            </p>
          ) : (
            <ul className="list-inside space-y-3">
              {slides[currentSlide].content.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className="flex items-center text-xl"
                >
                  <span className="mr-2 text-green-300">❯</span> {item}
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </main>
      
      <footer className="p-6 border-t border-green-700 backdrop-blur-sm bg-black/40 relative z-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            className={`military-btn ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-900'}`}
          >
            ◀ PREVIOUS
          </button>
          
          <div className="scan-line-container">
            <div className="scan-line"></div>
            <span className="security-status">SECURITY LEVEL: ALPHA</span>
          </div>
          
          <button 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
            className={`military-btn ${currentSlide === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-900'}`}
          >
            NEXT ▶
          </button>
        </div>
      </footer>
      
      <style jsx>{`
        .military-btn {
          background-color: rgba(0, 40, 0, 0.7);
          border: 1px solid #1aff1a;
          color: #1aff1a;
          padding: 0.5rem 1rem;
          transition: all 0.3s;
          font-weight: bold;
          text-shadow: 0 0 5px #1aff1a;
          letter-spacing: 1px;
        }
        
        .glow-text {
          text-shadow: 0 0 8px rgba(0, 255, 0, 0.7);
        }
        
        .shadow-glow {
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
        }
        
        .radar-container {
          position: absolute;
          top: 20%;
          right: 10%;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 2px solid rgba(0, 255, 0, 0.3);
          opacity: 0.6;
          pointer-events: none;
        }
        
        .radar-sweep {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(0, 255, 0, 0) 0%,
            rgba(0, 255, 0, 0.2) 10%,
            rgba(0, 255, 0, 0) 20%
          );
          animation: radarSweep 4s linear infinite;
        }
        
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .typing-cursor::after {
          content: '|';
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .border-top-indicator, .border-bottom-indicator {
          position: absolute;
          height: 2px;
          background-color: #1aff1a;
          width: 80px;
          animation: scanLine 2s linear infinite;
          opacity: 0.8;
          box-shadow: 0 0 10px #1aff1a;
        }
        
        .border-top-indicator {
          top: 0;
          left: 50px;
        }
        
        .border-bottom-indicator {
          bottom: 0;
          right: 50px;
          animation-delay: 1s;
        }
        
        @keyframes scanLine {
          0% { width: 0; opacity: 0; }
          50% { width: 80px; opacity: 1; }
          100% { width: 0; opacity: 0; }
        }
        
        .military-badge {
          background-color: rgba(0, 40, 0, 0.7);
          border: 1px solid #1aff1a;
          padding: 3px 10px;
          display: inline-block;
          position: relative;
        }
        
        .military-badge::before, .military-badge::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1px solid #1aff1a;
        }
        
        .military-badge::before {
          top: -3px;
          left: -3px;
          border-right: none;
          border-bottom: none;
        }
        
        .military-badge::after {
          bottom: -3px;
          right: -3px;
          border-left: none;
          border-top: none;
        }
        
        .scan-line-container {
          position: relative;
          width: 200px;
          height: 20px;
          background-color: rgba(0, 30, 0, 0.7);
          border: 1px solid #1aff1a;
          overflow: hidden;
        }
        
        .scan-line {
          position: absolute;
          top: 0;
          height: 100%;
          width: 5px;
          background-color: #1aff1a;
          box-shadow: 0 0 10px #1aff1a;
          animation: scanAnimation 2s linear infinite;
        }
        
        .security-status {
          position: absolute;
          width: 100%;
          text-align: center;
          font-size: 0.8rem;
          color: #1aff1a;
          top: 50%;
          transform: translateY(-50%);
          letter-spacing: 1px;
          font-weight: bold;
        }
        
        @keyframes scanAnimation {
          0% { left: 0; }
          100% { left: calc(100% - 5px); }
        }
        
        .bg-grid {
          background-image: 
            linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default Presentation; 