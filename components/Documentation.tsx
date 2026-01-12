
import React from 'react';
import { exportDocumentationToPDF } from '../exportUtils';

const Documentation: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h1 className="text-4xl font-black text-[#728156]">Documentation & User Guide</h1>
          <button 
            onClick={exportDocumentationToPDF}
            className="px-8 py-3 bg-[#728156] hover:bg-[#88976C] text-white rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Export Docs PDF
          </button>
        </div>
        
        <div className="prose prose-stone max-w-none text-gray-600">
          <h3 className="text-2xl font-bold text-[#88976C]">1. Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-white border border-[#CFE1BB] rounded-2xl text-center">
              <div className="text-[#728156] font-bold text-sm">Language</div>
              <p className="text-xs">TypeScript</p>
            </div>
            <div className="p-4 bg-white border border-[#CFE1BB] rounded-2xl text-center">
              <div className="text-[#728156] font-bold text-sm">Frontend</div>
              <p className="text-xs">React 19</p>
            </div>
            <div className="p-4 bg-white border border-[#CFE1BB] rounded-2xl text-center">
              <div className="text-[#728156] font-bold text-sm">Styling</div>
              <p className="text-xs">Tailwind CSS</p>
            </div>
            <div className="p-4 bg-white border border-[#CFE1BB] rounded-2xl text-center">
              <div className="text-[#728156] font-bold text-sm">AI Engine</div>
              <p className="text-xs">Gemini 3 Flash</p>
            </div>
            <div className="p-4 bg-white border border-[#CFE1BB] rounded-2xl text-center">
              <div className="text-[#728156] font-bold text-sm">Visualization</div>
              <p className="text-xs">Recharts</p>
            </div>
            <div className="p-4 bg-white border border-[#CFE1BB] rounded-2xl text-center">
              <div className="text-[#728156] font-bold text-sm">Exporting</div>
              <p className="text-xs">jsPDF & AutoTable</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#88976C] mt-8">2. API Selection Justification</h3>
          <p>We selected the <strong>Google Gemini API (gemini-3-flash-preview)</strong> as our primary NLP engine. Gemini offers a generative approach that provides not just a label, but a reasoned explanation and keyword extraction in a single low-latency call.</p>

          <h3 className="text-2xl font-bold text-[#88976C] mt-8">3. Implementation Challenges</h3>
          <ul className="list-disc pl-5 space-y-2 text-[#728156]">
            <li><strong>JSON Parsing Stability:</strong> Ensuring the AI always returns valid JSON.</li>
            <li><strong>PDF Exporting:</strong> Generating multi-page PDF reports in the client-side environment.</li>
            <li><strong>Batch Processing Latency:</strong> Balancing user experience while processing multiple texts.</li>
          </ul>

          <h3 className="text-2xl font-bold text-[#88976C] mt-8">4. User Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-6 bg-white border border-[#CFE1BB] rounded-3xl">
              <div className="font-bold text-[#728156] mb-2">Step 1: Input Data</div>
              <p className="text-sm">Type a sentence directly or upload a text/csv file.</p>
            </div>
            <div className="p-6 bg-white border border-[#CFE1BB] rounded-3xl">
              <div className="font-bold text-[#728156] mb-2">Step 2: Analyze</div>
              <p className="text-sm">Click 'Perform Deep Analysis'. The AI will classify sentiment and identify drivers.</p>
            </div>
            <div className="p-6 bg-white border border-[#CFE1BB] rounded-3xl">
              <div className="font-bold text-[#728156] mb-2">Step 3: Explore Visuals</div>
              <p className="text-sm">Check the distribution charts to see the emotional health of your dataset.</p>
            </div>
            <div className="p-6 bg-white border border-[#CFE1BB] rounded-3xl">
              <div className="font-bold text-[#728156] mb-2">Step 4: Export</div>
              <p className="text-sm">Use the Export buttons to save your results as CSV, JSON, or PDF.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="p-10 bg-[#E8F4DC] rounded-[2rem] border border-[#B6C99C]">
        <h4 className="text-xl font-bold text-[#728156] mb-4">Model Limitations & Thresholds</h4>
        <div className="space-y-4 text-[#88976C] text-sm">
          <p><strong>Confidence Threshold:</strong> We recommend flagging any sentiment with a confidence score below <strong>0.65</strong> for manual review.</p>
          <p><strong>Maximum Text Length:</strong> Optimal analysis occurs on texts between 10 and 500 words.</p>
          <p><strong>Languages:</strong> Optimized for English, with multi-lingual support.</p>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
