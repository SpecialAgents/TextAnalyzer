
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip 
} from 'recharts';
import { AnalysisResult, Sentiment } from '../types';
import { SENTIMENT_COLORS, BRAND_COLORS } from '../constants';

interface ChartsProps {
  results: AnalysisResult[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-emerald-950 text-white p-4 rounded-xl shadow-xl border-none outline-none">
        <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40">{payload[0].name}</p>
        <p className="text-xl font-black text-emerald-400">{payload[0].value}<span className="text-xs ml-0.5">%</span></p>
      </div>
    );
  }
  return null;
};

export const SentimentPieChart: React.FC<ChartsProps> = ({ results }) => {
  const counts = results.reduce((acc, curr) => {
    acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(counts).map(key => ({
    name: key,
    value: counts[key],
    color: SENTIMENT_COLORS[key as Sentiment]
  }));

  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-200 text-[10px] font-black uppercase">Awaiting Signals</div>;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            iconSize={8}
            formatter={(value) => <span className="text-[9px] font-bold text-slate-400 px-2 uppercase tracking-tight">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ConfidenceTrendChart: React.FC<ChartsProps> = ({ results }) => {
  const data = results.slice(-8).map((r, i) => ({
    name: `E${results.length - 7 + i > 0 ? results.length - 7 + i : i + 1}`,
    confidence: Math.round(r.confidence * 100),
  }));

  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-200 text-[10px] font-black uppercase">No Trend Data</div>;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fontStyle: 'bold', fill: '#cbd5e1' }} 
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fontStyle: 'bold', fill: '#cbd5e1' }} 
          />
          <ChartTooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
          <Bar 
            dataKey="confidence" 
            fill={BRAND_COLORS.PRIMARY} 
            radius={[4, 4, 0, 0]} 
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
