
import React, { useState, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Sentiment, SentimentResult } from '../types';
import { analyzeSentiment, batchAnalyzeSentiment } from '../geminiService';
import { exportToCSV, exportToJSON, exportToPDF } from '../exportUtils';

interface DashboardProps {
  results: SentimentResult[];
  setResults: React.Dispatch<React.SetStateAction<SentimentResult[]>>;
}

const COLORS = {
  [Sentiment.POSITIVE]: '#88976C', // Medium Olive
  [Sentiment.NEUTRAL]: '#B6C99C',  // Light Sage
  [Sentiment.NEGATIVE]: '#728156', // Dark Olive
};

const Dashboard: React.FC<DashboardProps> = ({ results, setResults }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'batch'>('individual');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processTextBatch = async (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    if (lines.length === 0) {
      alert("No valid text found in file.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const batchResults = await batchAnalyzeSentiment(lines.slice(0, 15)); // Increased slightly for batch
      setResults(prev => [...batchResults, ...prev]);
      setActiveTab('batch');
    } catch (error) {
      console.error(error);
      alert("Batch processing failed. Check connection or API keys.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSingleAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeSentiment(inputText);
      setResults(prev => [result, ...prev]);
      setInputText('');
    } catch (error) {
      alert("Failed to analyze sentiment. Please check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      await processTextBatch(text);
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const sentimentData = [
    { name: 'Positive', value: results.filter(r => r.sentiment === Sentiment.POSITIVE).length },
    { name: 'Neutral', value: results.filter(r => r.sentiment === Sentiment.NEUTRAL).length },
    { name: 'Negative', value: results.filter(r => r.sentiment === Sentiment.NEGATIVE).length },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500 relative">
      {/* Analysis Loader Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#E8F4DC]/80 backdrop-blur-md transition-all animate-in fade-in">
          <div className="w-24 h-24 border-4 border-[#CFE1BB] border-t-[#728156] rounded-full animate-spin mb-6"></div>
          <h2 className="text-4xl font-black text-[#728156] animate-pulse-text tracking-tighter">
            Camden Intelligence
          </h2>
          <p className="mt-4 text-[#88976C] font-semibold uppercase tracking-widest text-sm">Analyzing Emotional Matrix...</p>
        </div>
      )}

      {/* Input Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#B6C99C]/20 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#728156]">Intelligence Console</h2>
              <div className="flex bg-[#E8F4DC] p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('individual')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'individual' ? 'bg-white shadow-sm text-[#728156]' : 'text-[#88976C]'}`}
                >
                  Direct Entry
                </button>
                <button 
                  onClick={() => setActiveTab('batch')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'batch' ? 'bg-white shadow-sm text-[#728156]' : 'text-[#88976C]'}`}
                >
                  Batch Matrix
                </button>
              </div>
            </div>

            {activeTab === 'individual' ? (
              <div className="space-y-4">
                <textarea 
                  className="w-full h-44 p-5 rounded-2xl border-2 border-[#E8F4DC] focus:border-[#B6C99C] focus:ring-4 focus:ring-[#E8F4DC]/50 outline-none transition-all resize-none text-gray-700 leading-relaxed font-medium"
                  placeholder="Paste intelligence source here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  onClick={handleSingleAnalysis}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="w-full py-4 bg-[#728156] hover:bg-[#88976C] disabled:bg-[#B6C99C] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
                >
                  Initialize Analysis
                </button>
              </div>
            ) : (
              <div 
                className={`h-44 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all ${
                  isDragging ? 'border-[#728156] bg-[#CFE1BB]/40' : 'border-[#B6C99C] bg-[#E8F4DC]/30'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-[#728156]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#728156]">
                    {isDragging ? 'Drop Intelligence File Now' : 'Drag Intelligence Source File'}
                  </p>
                  <p className="text-xs text-[#88976C] mt-1">Supports .csv, .txt (Limit 15 entries for processing speed)</p>
                </div>
                <input 
                  type="file" 
                  accept=".csv,.txt" 
                  className="hidden" 
                  id="batch-upload"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="batch-upload" 
                  className="px-8 py-2.5 bg-white border border-[#B6C99C] rounded-xl text-sm font-bold text-[#728156] cursor-pointer hover:bg-[#E8F4DC] transition-all shadow-sm hover:shadow-md"
                >
                  Upload Local Source
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#B6C99C]/20 h-full flex flex-col justify-between">
            <h3 className="text-xl font-bold text-[#728156] mb-4">Matrix Stats</h3>
            
            {/* Latest Vector Row */}
            {results.length > 0 && (
              <div className="mb-4 p-4 bg-[#CFE1BB]/10 rounded-2xl border border-[#B6C99C]/20 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-[#88976C] uppercase tracking-widest mb-1">Latest Vector</p>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-black tracking-tight ${
                    results[0].sentiment === 'POSITIVE' ? 'text-[#728156]' :
                    results[0].sentiment === 'NEGATIVE' ? 'text-red-800' : 'text-gray-600'
                  }`}>
                    {results[0].sentiment}
                  </span>
                  <span className="text-[10px] font-bold text-[#88976C] tabular-nums bg-white px-2 py-0.5 rounded-md border border-[#B6C99C]/20 shadow-sm">
                    {(results[0].confidence * 100).toFixed(0)}% FDLTY
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 flex-grow">
              <div className="p-4 bg-[#E8F4DC] rounded-2xl flex flex-col justify-center">
                <div className="text-[#728156] text-3xl font-black">{results.length}</div>
                <div className="text-[10px] text-[#88976C] font-bold uppercase tracking-widest mt-1">Decoded</div>
              </div>
              <div className="p-4 bg-[#CFE1BB]/30 rounded-2xl flex flex-col justify-center">
                <div className="text-[#88976C] text-3xl font-black">
                  {results.length > 0 ? ((results.filter(r => r.sentiment === 'POSITIVE').length / results.length) * 100).toFixed(0) : 0}%
                </div>
                <div className="text-[10px] text-[#728156] font-bold uppercase tracking-widest mt-1">Positive Pos.</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[#E8F4DC] flex flex-col gap-2">
              <p className="text-[10px] font-black text-[#98A77C] uppercase tracking-[0.2em] mb-2">Security Export</p>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => exportToJSON(results)}
                  disabled={results.length === 0}
                  className="px-2 py-2.5 bg-[#E8F4DC] hover:bg-[#CFE1BB] rounded-xl text-xs font-bold text-[#728156] disabled:opacity-50 transition-colors"
                >
                  JSON
                </button>
                <button 
                  onClick={() => exportToCSV(results)}
                  disabled={results.length === 0}
                  className="px-2 py-2.5 bg-[#E8F4DC] hover:bg-[#CFE1BB] rounded-xl text-xs font-bold text-[#728156] disabled:opacity-50 transition-colors"
                >
                  CSV
                </button>
                <button 
                  onClick={() => exportToPDF(results)}
                  disabled={results.length === 0}
                  className="px-2 py-2.5 bg-[#B6C99C] hover:bg-[#98A77C] rounded-xl text-xs font-bold text-white disabled:opacity-50 transition-colors shadow-sm"
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visualizations Section */}
      {results.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#B6C99C]/20">
            <h3 className="text-xl font-bold text-[#728156] mb-6 tracking-tight">Emotional Spectrum Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F4DC" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#88976C', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#88976C', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#E8F4DC'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toUpperCase() as Sentiment]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#B6C99C]/20">
            <h3 className="text-xl font-bold text-[#728156] mb-6 tracking-tight">Intelligence Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={10}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toUpperCase() as Sentiment]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Results Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-[#B6C99C]/20 overflow-hidden">
        <div className="p-8 border-b border-[#E8F4DC] flex justify-between items-center bg-gray-50/20">
          <h3 className="text-xl font-bold text-[#728156]">Layered Decryption Table</h3>
          <div className="text-xs font-bold text-[#88976C] uppercase tracking-widest">{results.length} Nodes Resolved</div>
        </div>
        {results.length === 0 ? (
          <div className="p-24 text-center space-y-4">
            <div className="w-20 h-20 bg-[#E8F4DC] rounded-full flex items-center justify-center mx-auto text-[#88976C]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <p className="text-[#88976C] font-semibold tracking-wide">Awaiting Data Injection...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#E8F4DC]/30">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-[#88976C] uppercase tracking-wider">Target Node</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#88976C] uppercase tracking-wider">Vector</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#88976C] uppercase tracking-wider">Fidelity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#88976C] uppercase tracking-wider">Drivers</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#88976C] uppercase tracking-wider">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F4DC]">
                {results.map((res) => (
                  <tr key={res.id} className="hover:bg-[#E8F4DC]/10 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm text-gray-700 font-semibold max-w-md line-clamp-2">{res.text}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                        res.sentiment === 'POSITIVE' ? 'bg-[#E8F4DC] border-[#B6C99C] text-[#728156]' :
                        res.sentiment === 'NEGATIVE' ? 'bg-[#CFE1BB]/50 border-[#88976C] text-[#728156]' :
                        'bg-gray-100 border-gray-200 text-gray-600'
                      }`}>
                        {res.sentiment}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-[#E8F4DC] h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-[#728156]`}
                            style={{ width: `${res.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#88976C] tabular-nums">{(res.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5">
                        {res.keywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="text-[10px] px-2.5 py-1 bg-[#E8F4DC] text-[#728156] rounded-lg font-bold uppercase tracking-tighter border border-[#B6C99C]/20">{kw}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="group relative">
                        <button className="p-2.5 hover:bg-[#E8F4DC] rounded-xl text-[#88976C] hover:text-[#728156] transition-all border border-transparent hover:border-[#B6C99C]/30">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                        <div className="absolute right-0 bottom-full mb-3 w-72 p-5 bg-white shadow-2xl rounded-2xl border border-[#E8F4DC] opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-[110] text-xs text-gray-600 leading-relaxed translate-y-2 group-hover:translate-y-0">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 bg-[#728156] rounded-full"></div>
                             <p className="font-black text-[#728156] uppercase tracking-[0.1em]">AI Rationale</p>
                          </div>
                          {res.explanation}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
