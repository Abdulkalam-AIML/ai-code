"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Terminal,
  Activity,
  Zap,
  Layers,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { ComplexityRadarChart } from '@/components/ComplexityChart';
import { CodeRain } from '@/components/CodeRain';

interface AnalysisData {
  cyclomaticComplexity: number;
  functionLength: number;
  nestedDepth: number;
  unusedVariables: string[];
  suggestions: string[];
  language: string;
  overallScore: number;
}

export default function AnalysisDashboard() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Complexity', value: Math.min(100, (result.cyclomaticComplexity / 15) * 100), fullMark: 100 },
    { name: 'Nesting', value: Math.min(100, (result.nestedDepth / 8) * 100), fullMark: 100 },
    { name: 'Length', value: Math.min(100, (result.functionLength / 100) * 100), fullMark: 100 },
    { name: 'Cleanliness', value: result.overallScore, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      <CodeRain />

      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full" />
            <div className="relative bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl flex items-center justify-center group hover:border-violet-500/50 transition-colors duration-500">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-violet-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/20">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    CODE<span className="text-violet-500 tracking-normal">X</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Complexity Engine
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800/50 text-[10px] font-bold text-slate-400 mb-6 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-[0.2em]">SYSTEM ONLINE & MONITORING</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent mb-6"
          >
            Next-Gen AST Analysis
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 max-w-2xl text-lg leading-relaxed"
          >
            Real-time AST parsing for JavaScript, TypeScript, and Python.
            Identify hotspots, reduce technical debt, and optimize your codebase.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-12 xl:col-span-7 space-y-6"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl opacity-20 group-focus-within:opacity-40 transition duration-500" />
              <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 p-1 flex flex-col h-[500px]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-2 ml-2">
                      <Terminal className="w-4 h-4" />
                      editor.ts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-slate-900 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="javascript">JavaScript / TS</option>
                      <option value="python">Python</option>
                    </select>
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !code}
                      className="flex items-center gap-2 px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here to analyze complexity..."
                  className="flex-1 bg-transparent p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none text-slate-300 custom-scrollbar"
                />
              </div>
            </div>
          </motion.div>

          {/* Metrics Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-12 xl:col-span-5 space-y-6"
          >
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-12 text-slate-500"
                >
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Enter code and click analyze to see metrics</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Overall Score Card */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <h4 className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Overall Health</h4>
                        <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                          {result.overallScore}%
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                        <div
                          className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-1000"
                          style={{ clipPath: `polygon(0 0, 100% 0, 100% ${result.overallScore}%, 0 ${result.overallScore}%)` }}
                        />
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>

                    <MetricCard
                      icon={<Layers className="w-4 h-4 text-violet-400" />}
                      label="Complexity"
                      value={result.cyclomaticComplexity}
                      suffix=""
                      sub="Target < 10"
                    />
                    <MetricCard
                      icon={<Activity className="w-4 h-4 text-blue-400" />}
                      label="Nesting"
                      value={result.nestedDepth}
                      suffix=""
                      sub="Target < 4"
                    />
                  </div>

                  {/* Visualization */}
                  <ComplexityRadarChart data={chartData} />

                  {/* Suggestions */}
                  <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-slate-100 text-sm font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Refactoring Suggestions
                    </h3>
                    <div className="space-y-3">
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed group">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-violet-500 group-hover:translate-x-1 transition-transform" />
                          <span>{s}</span>
                        </div>
                      ))}
                      {result.suggestions.length === 0 && (
                        <div className="text-sm text-emerald-400/80 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                          Your code looks exceptionally clean! No immediate improvements suggested.
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}

function MetricCard({ icon, label, value, suffix, sub }: any) {
  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold mb-1">
        {value}{suffix}
      </div>
      <div className="text-[10px] text-slate-500 font-medium">{sub}</div>
    </div>
  );
}
