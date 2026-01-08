
import React, { useState } from 'react';
import { GeminiService } from './services/geminiService';
import { AnalysisResult, Sentiment } from './types';
import { SENTIMENT_COLORS, BRAND_COLORS, SAMPLE_TEXTS } from './constants';
import { SentimentPieChart, ConfidenceTrendChart } from './components/Charts';
import { AccuracyReport } from './components/AccuracyReport';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#f1f5f9]">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-white skew-x-12 translate-x-1/4 opacity-50 pointer-events-none" />
    
    <div className="relative z-10 max-w-4xl px-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">Camden Engine V3.2</span>
      </div>

      <h1 className="text-7xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none animate-in fade-in zoom-in-95 duration-1000">
        Camden<span className="text-emerald-800">.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-500 font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        Professional text intelligence. Decode <span className="text-emerald-900 font-medium">customer sentiment</span> with an ultra-clean, AI-powered workspace designed for precision.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <button 
          onClick={onStart}
          className="group px-10 py-4 bg-emerald-900 text-white rounded-lg font-bold transition-all hover:bg-black active:scale-95 shadow-xl shadow-emerald-900/10 flex items-center gap-3"
        >
          Enter Workspace
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
        <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-all shadow-sm">
          Technical Docs
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyze' | 'summary' | 'accuracy'>('analyze');
  const [error, setError] = useState<string | null>(null);

  const gemini = GeminiService.getInstance();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await gemini.analyzeText(inputText);
      setResults(prev => [result, ...prev]);
      setInputText('');
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const text = await file.text();
      let textsToAnalyze: string[] = [];
      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        textsToAnalyze = Array.isArray(json) ? json : [json.text].filter(Boolean);
      } else {
        textsToAnalyze = text.split(/\r?\n/).filter(line => line.trim().length > 5).slice(0, 30);
      }
      const batchResults = await gemini.analyzeBatch(textsToAnalyze, `File: ${file.name}`);
      setResults(prev => [...batchResults, ...prev]);
      setActiveTab('summary');
    } catch (err: any) {
      setError('Batch processing failed. Check file integrity.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    if (results.length === 0) return;
    const content = format === 'json' 
      ? JSON.stringify(results, null, 2)
      : "ID,Sentiment,Confidence,Text,Explanation\n" + results.map(r => 
          `${r.id},${r.sentiment},${r.confidence},"${r.text.replace(/"/g, '""')}",${r.explanation.replace(/"/g, '""')}`
        ).join("\n");
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `camden_export_${new Date().getTime()}.${format}`;
    link.click();
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('app')} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-emerald-950 flex flex-col shrink-0 z-40 no-print transition-all duration-300">
        <div className="p-6 lg:p-8 flex items-center justify-center lg:justify-start gap-3 cursor-pointer mb-6" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter hidden lg:block">Camden</h1>
        </div>

        <nav className="flex-1 px-3 lg:px-4 space-y-1">
          {[
            { id: 'analyze', label: 'Workplace', icon: (p:any)=><svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
            { id: 'summary', label: 'Insights', icon: (p:any)=><svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
            { id: 'accuracy', label: 'Quality', icon: (p:any)=><svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-emerald-900 text-white shadow-inner scale-[1.02]' 
                  : 'text-emerald-100/40 hover:text-white hover:bg-white/5'
              }`}
              title={tab.label}
            >
              {tab.icon({ className: `w-5 h-5 ${activeTab === tab.id ? 'text-emerald-400' : 'text-current'}` })}
              <span className="hidden lg:block tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 lg:p-6 mt-auto">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/20 mb-2 hidden lg:block">System Load</p>
            <div className="h-1 bg-emerald-950 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '28%' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 z-30 no-print">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Analysis Hub</h2>
            <div className="h-4 w-px bg-slate-100" />
            <div className="text-sm font-bold text-slate-900 tracking-tight">{activeTab.toUpperCase()}</div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setResults([])} 
              className="text-[10px] font-black uppercase tracking-widest text-emerald-800 hover:text-emerald-600 transition-colors"
            >
              Clear Session
            </button>
            <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">BU</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 print-full">
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium flex items-center gap-3 no-print animate-in slide-in-from-top-4 duration-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* STICKY INPUT AREA */}
              <div className="w-full lg:w-[360px] shrink-0 no-print">
                <div className="sticky-column space-y-4">
                  <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Input Processor</h3>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-50" />
                        <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-20" />
                      </div>
                    </div>
                    
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste text for emotional analysis..."
                      className="w-full h-44 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 outline-none resize-none transition-all text-sm leading-relaxed text-slate-800 placeholder:text-slate-300"
                    />
                    
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !inputText.trim()}
                      className="w-full mt-4 bg-emerald-900 text-white font-bold py-3.5 rounded-2xl transition-all hover:bg-black active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-900/10"
                    >
                      {isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Run Analysis'}
                    </button>
                    
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Tools</span>
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 hover:underline cursor-pointer flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          Batch Upload
                          <input type="file" className="hidden" accept=".csv,.json" onChange={handleFileUpload} />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {SAMPLE_TEXTS.slice(0, 3).map((_, i) => (
                          <button 
                            key={i} 
                            onClick={() => setInputText(SAMPLE_TEXTS[i])} 
                            className="text-left px-4 py-3 bg-slate-50 text-[11px] font-bold text-slate-500 hover:bg-emerald-50 hover:text-emerald-900 transition-all rounded-xl border border-slate-200/60 truncate"
                          >
                            Sample {i + 1}: "{SAMPLE_TEXTS[i].substring(0, 25)}..."
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10px] font-bold text-emerald-800 leading-tight">
                    TIP: Analyze up to 30 lines simultaneously using the batch upload feature for aggregate insights.
                  </div>
                </div>
              </div>

              {/* SCROLLABLE FEED SECTION */}
              <div className="flex-1 space-y-4 pb-24 print-full">
                <div className="flex items-center justify-between mb-4 px-2 no-print">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Result Stream</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{results.length} ENTRIES</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                {results.length === 0 ? (
                  <div className="py-32 flex flex-col items-center justify-center text-slate-200 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-12 h-12 mb-4 opacity-10 text-emerald-900">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Awaiting Ingestion Signal</p>
                  </div>
                ) : (
                  results.map((res, index) => (
                    <div 
                      key={res.id} 
                      className="glass-card p-5 rounded-2xl border-l-4 break-inside-avoid animate-in slide-in-from-right-4 duration-300" 
                      style={{ borderLeftColor: SENTIMENT_COLORS[res.sentiment], animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                            {res.sentiment}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Confidence: {Math.round(res.confidence * 100)}%</span>
                        </div>
                        <button 
                          onClick={() => setResults(prev => prev.filter(r => r.id !== res.id))} 
                          className="text-slate-200 hover:text-rose-600 transition-colors no-print"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <p className="text-slate-800 font-bold leading-relaxed mb-4 text-sm tracking-tight">"{res.text}"</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {res.keywords.map((k, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-md border border-slate-200 uppercase tracking-tighter">#{k}</span>
                        ))}
                      </div>
                      <div className="bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/30">
                        <p className="text-[10px] font-medium text-slate-500 italic leading-relaxed">"{res.explanation}"</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20 print-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Sentiment Profile</h3>
                  <SentimentPieChart results={results} />
                </div>
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Data Integrity</h3>
                  <ConfidenceTrendChart results={results} />
                </div>
              </div>

              <div className="bg-emerald-950 p-10 lg:p-14 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden print:bg-white print:text-slate-900 print:border print:border-slate-200 print:shadow-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start lg:items-end gap-10 mb-20">
                    <div className="max-w-xl">
                      <div className="w-16 h-1 bg-emerald-500 mb-8 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                      <h2 className="text-5xl font-black mb-6 tracking-tighter leading-none uppercase">Aggregate Report</h2>
                      <p className="text-lg text-emerald-100/50 font-light leading-relaxed">Unified metrics for current batch session. Export high-fidelity reports below.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 no-print">
                      <button onClick={() => exportData('csv')} className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white hover:text-emerald-950 transition-all text-xs tracking-widest uppercase">Export CSV</button>
                      <button onClick={() => exportData('json')} className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white hover:text-emerald-950 transition-all text-xs tracking-widest uppercase">Export JSON</button>
                      <button onClick={() => window.print()} className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-black hover:bg-emerald-400 transition-all text-sm shadow-xl shadow-emerald-500/20 uppercase tracking-widest">Download PDF</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[Sentiment.POSITIVE, Sentiment.NEUTRAL, Sentiment.NEGATIVE].map((sent) => {
                      const list = results.filter(r => r.sentiment === sent);
                      const weight = results.length > 0 ? (list.length / results.length) * 100 : 0;
                      return (
                        <div key={sent} className="p-8 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-center mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-100/30 print:text-slate-400">{sent}</span>
                            <span className="text-6xl font-black tracking-tighter transition-transform group-hover:scale-110 duration-500" style={{ color: SENTIMENT_COLORS[sent] }}>
                                <span>{list.length}</span>
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6 print:bg-slate-200">
                            <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${weight}%`, backgroundColor: SENTIMENT_COLORS[sent] }} />
                          </div>
                          <p className="text-[10px] font-black text-emerald-100/20 uppercase tracking-widest print:text-slate-300">{weight.toFixed(1)}% CONTRIBUTION</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accuracy' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24 print-full">
              <AccuracyReport />
            </div>
          )}
        </div>

        <footer className="h-14 px-8 flex items-center justify-between bg-white border-t border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
            </div>
            Camden Systems © 2024
          </div>
          <div className="flex gap-8">
            <span className="hover:text-emerald-800 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-emerald-800 cursor-pointer transition-colors">Privacy Protocal</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
