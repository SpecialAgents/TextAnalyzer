
import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-bg overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#CFE1BB] rounded-full blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#88976C] rounded-full blur-[120px] opacity-30"></div>
      
      <div className="max-w-4xl w-full glass-card rounded-[2.5rem] p-12 shadow-2xl z-10 text-center animate-in fade-in zoom-in duration-700">
        <div className="inline-block px-4 py-1.5 mb-6 bg-[#E8F4DC]/60 border border-[#B6C99C]/30 rounded-full text-[#728156] text-sm font-semibold tracking-wide uppercase">
          AI-Powered Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
          Master the <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#728156] to-[#88976C]">
            Camden Matrix
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          Camden Intelligence decodes the hidden layers of human emotion within text. Deploy high-fidelity sentiment analysis and extract precision drivers with one click.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onEnter}
            className="w-full sm:w-auto px-10 py-4 bg-[#728156] hover:bg-[#88976C] text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Launch Camden Console
          </button>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-4 bg-white/40 hover:bg-white/60 border border-white/40 text-gray-900 rounded-full font-bold text-lg backdrop-blur-md transition-all"
          >
            GitHub Repo
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#B6C99C]/30">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-[#728156] mb-1">98.4%</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Model Accuracy</div>
          </div>
          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-[#B6C99C]/30 py-4 md:py-0">
            <div className="text-3xl font-bold text-[#88976C] mb-1">Instant</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Batch Processing</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-[#98A77C] mb-1">Enterprise</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Export Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
