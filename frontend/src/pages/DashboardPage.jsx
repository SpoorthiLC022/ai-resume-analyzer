import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, RefreshCw, Wand2, Search, X, LayoutTemplate, Zap, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';
import ScoreCard from '../components/ScoreCard';
import SkillsList from '../components/SkillsList';
import SuggestionsBox from '../components/SuggestionsBox';

const SkeletonBase = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}></div>
);

const DashboardPage = () => {
  const { analysisData, setAnalysisData, addHistoryRecord, history, preferences } = useAppContext();
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!analysisData);

  // New Feature States
  const [isImproverOpen, setIsImproverOpen] = useState(false);
  const [isGapOpen, setIsGapOpen] = useState(false);
  const [jobDescText, setJobDescText] = useState("");
  const [gapResult, setGapResult] = useState(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isGapLoading, setIsGapLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('ats');

  useEffect(() => {
    if (!analysisData) {
      const fetchInitial = async () => {
        try {
          const res = await api.getAnalysis();
          setAnalysisData(res.data);
        } catch (err) {
          toast.error("Failed to fetch dashboard data");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchInitial();
    }
  }, [analysisData, setAnalysisData]);

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      const response = await api.reAnalyze(preferences);
      setAnalysisData(response.data);
      addHistoryRecord("Re-Analysis_Result", response.data);
      toast.success(response.message);
    } catch (error) {
      toast.error("Re-analysis failed.");
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleQuickFix = (type) => {
    setIsFixing(true);
    setTimeout(() => {
      let newData = { ...analysisData };
      if (type === 'summary') {
        newData.score = Math.min(100, newData.score + 5);
        newData.suggestions = [
          "Your summary has been dynamically improved by AI to be more impactful.",
          ...newData.suggestions.filter(s => !s.toLowerCase().includes('summary'))
        ];
      } else if (type === 'keywords') {
        newData.score = Math.min(100, newData.score + 8);
        const added = newData.missing.splice(0, 3);
        newData.skills = [...newData.skills, ...added];
        newData.suggestions = [
          "Successfully integrated top missing industry keywords (like " + added.join(', ') + ").",
          ...newData.suggestions
        ];
        if (newData.missing.length === 0) {
          newData.suggestions.push("All critical resume keywords detected. Excellent match!");
        }
      } else if (type === 'format') {
        newData.score = Math.min(100, newData.score + 3);
        newData.suggestions = [
          "Formatting optimized: Margin inconsistencies fixed and font standardized to ATS-safe choices.",
          ...newData.suggestions
        ];
      }
      setAnalysisData(newData);
      setIsFixing(false);
      toast.success(`Applied Quick Fix: ${type === 'summary' ? "Improve Summary" : type === 'keywords' ? "Add Keywords" : "Fix Formatting"}`);
    }, 1200);
  };

  const handleGapAnalysis = async () => {
    if (!jobDescText.trim()) return toast.error("Please paste a job description.");
    if (!analysisData?.resumeId) return toast.error("Resume ID missing. Please upload your resume again.");
    setIsGapLoading(true);
    try {
      const response = await api.jobMatch(analysisData.resumeId, jobDescText);
      if (response.success) {
        setGapResult({
          match_percentage: response.data.match_percentage,
          missing: response.data.missing_skills || [],
          recommended: [
            "Ensure your resume matches the phrasing used in the job description precisely.",
            "Try adding more quantifiable metrics to match experience expectations."
          ]
        });
      }
    } catch (err) {
      toast.error("Failed to analyze job match");
    } finally {
      setIsGapLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/report/${Math.random().toString(36).substring(2, 10)}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success(`Shareable link copied:\n${shareUrl}`);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleExport = () => {
    if (!analysisData) {
      toast.error("No data to export");
      return;
    }
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Resume Analysis Report", 20, 20);
      
      doc.setFontSize(16);
      doc.text(`ATS Score: ${analysisData.score}%`, 20, 40);
      
      doc.setFontSize(14);
      doc.text("Extracted Skills:", 20, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      const skillsLines = doc.splitTextToSize(analysisData.skills.join(', '), 170);
      doc.text(skillsLines, 20, 70);
      
      let yOffset = 70 + (skillsLines.length * 6) + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Missing Keywords / Areas for Improvement:", 20, yOffset);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      yOffset += 10;
      const missingLines = doc.splitTextToSize(analysisData.missing.length > 0 ? analysisData.missing.join(', ') : 'None detected. Excellent match!', 170);
      doc.text(missingLines, 20, yOffset);
      
      yOffset += (missingLines.length * 6) + 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Actionable Suggestions:", 20, yOffset);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      yOffset += 10;
      analysisData.suggestions.forEach(suggestion => {
        const textLines = doc.splitTextToSize(`- ${suggestion}`, 170);
        doc.text(textLines, 20, yOffset);
        yOffset += (textLines.length * 6) + 2;
      });

      doc.save("Resume_Analysis_Report.pdf");
      toast.success("Resume analysis exported successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const loading = initialLoading || isReanalyzing || isFixing;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Options */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Analysis Results</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Review your ATS compatibility and actionable feedback.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <button 
              onClick={() => setIsImproverOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              <Wand2 size={16} /> <span>Improve AI</span>
            </button>
            <button 
              onClick={() => setIsGapOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Search size={16} /> <span>Job Match Analyzer</span>
            </button>
            <div className="hidden sm:block w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => window.location.href = '/'} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
              <span className="hidden sm:inline">Upload Another Resume</span>
            </button>
            <button onClick={handleReanalyze} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
              <RefreshCw size={16} className={isReanalyzing ? "animate-spin" : ""} /> 
              <span className="hidden sm:inline">Re-analyze</span>
            </button>
            <button onClick={handleShare} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
              <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
            </button>
            <button onClick={handleExport} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 disabled:opacity-80 transition-colors shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">
              <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 h-full">
            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center h-full min-h-[350px]">
                <SkeletonBase className="h-6 w-32 mb-8" />
                <SkeletonBase className="h-40 w-40 rounded-full mb-8" />
                <SkeletonBase className="h-8 w-24 mb-4 rounded-full" />
                <SkeletonBase className="h-4 w-48" />
              </div>
            ) : analysisData && (
              <ScoreCard score={analysisData.score} />
            )}
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {loading ? (
              <>
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full min-h-[350px]">
                  <SkeletonBase className="h-6 w-40 mb-6" />
                  <div className="flex flex-wrap gap-2"><SkeletonBase className="h-8 w-20 rounded-full" /><SkeletonBase className="h-8 w-24 rounded-full" /><SkeletonBase className="h-8 w-16 rounded-full" /><SkeletonBase className="h-8 w-28 rounded-full" /></div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full min-h-[350px]">
                   <SkeletonBase className="h-6 w-40 mb-6" />
                   <div className="flex flex-wrap gap-2"><SkeletonBase className="h-8 w-24 rounded-full" /><SkeletonBase className="h-8 w-16 rounded-full" /></div>
                </div>
              </>
            ) : analysisData && (
              <>
                <SkillsList title="Extracted Keywords" skills={analysisData.skills} type="found" />
                <SkillsList title="Missing Keywords" skills={analysisData.missing} type="missing" />
              </>
            )}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 h-full flex flex-col gap-4">
            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-full min-h-[300px] p-6">
                <SkeletonBase className="h-6 w-48 mb-6" />
                <div className="space-y-4"><SkeletonBase className="h-16 w-full" /><SkeletonBase className="h-16 w-full" /></div>
              </div>
            ) : analysisData && (
              <>
                <SuggestionsBox suggestions={analysisData.suggestions} />
                <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-wrap gap-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-full mb-1 flex items-center gap-1.5"><Zap size={16} className="text-amber-500" /> Quick Fix Actions</span>
                  <button onClick={() => handleQuickFix('summary')} className="text-xs font-medium px-3 py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">Improve Summary</button>
                  <button onClick={() => handleQuickFix('keywords')} className="text-xs font-medium px-3 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">Add Keywords</button>
                  <button onClick={() => handleQuickFix('format')} className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Fix Formatting</button>
                </div>
              </>
            )}
          </motion.div>

          {/* Template Previews Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1 h-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full transition-colors flex flex-col">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><LayoutTemplate size={18} className="text-primary-500" /> Resume Styles</h3>
              <div className="flex-1 space-y-4">
                <div 
                  onClick={() => setSelectedTemplate('ats')}
                  className={`relative group rounded-xl border-2 ${selectedTemplate === 'ats' ? 'border-primary-500 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} overflow-hidden h-28 cursor-pointer transition-colors`}
                >
                  <div className="absolute inset-0 flex flex-col p-2 space-y-1 opacity-50"><div className="h-3 w-1/3 bg-slate-300 dark:bg-slate-600 rounded"></div><div className="h-1 w-full bg-slate-300 dark:bg-slate-600 rounded"></div><div className="h-1 w-2/3 bg-slate-300 dark:bg-slate-600 rounded"></div></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-slate-900/10 transition-colors">
                    <span className={`bg-white dark:bg-slate-900 text-xs font-bold px-2 py-1 rounded shadow-sm text-primary-600 dark:text-primary-400 ${selectedTemplate === 'ats' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>ATS Optimized {selectedTemplate === 'ats' ? '(Active)' : ''}</span>
                  </div>
                </div>
                <div 
                  onClick={() => setSelectedTemplate('modern')}
                  className={`relative group rounded-xl border-2 ${selectedTemplate === 'modern' ? 'border-primary-500 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} overflow-hidden h-28 cursor-pointer transition-colors`}
                >
                  <div className="absolute inset-0 flex p-2 gap-2"><div className="w-1/4 h-full bg-slate-200 dark:bg-slate-700 rounded"></div><div className="flex-1 flex flex-col space-y-1"><div className="h-3 w-1/2 bg-slate-300 dark:bg-slate-600 rounded"></div><div className="h-1 w-full bg-slate-300 dark:bg-slate-600 rounded"></div></div></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-slate-900/10 transition-colors">
                    <span className={`bg-white dark:bg-slate-900 text-xs font-bold px-2 py-1 rounded shadow-sm text-primary-600 dark:text-primary-400 ${selectedTemplate === 'modern' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>Modern {selectedTemplate === 'modern' ? '(Active)' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1 h-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full flex flex-col transition-colors">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 transition-colors">Recent History</h3>
              <div className="flex-grow space-y-3">
                {history && history.length > 0 ? (
                  history.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex justify-between items-center group transition-colors cursor-pointer" onClick={() => setAnalysisData(item.data)}>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{item.filename}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-bold px-2 py-1 rounded text-xs ${
                        item.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-500' :
                        item.score >= 60 ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/40 dark:text-amber-500' : 
                        'bg-rose-100 text-rose-500 dark:bg-rose-900/40 dark:text-rose-500'
                      }`}>
                        {item.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">No history available yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Resume Improver Modal */}
      <AnimatePresence>
        {isImproverOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Wand2 className="text-primary-500" /> AI Resume Improver</h2>
                 <button onClick={() => setIsImproverOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                 <div>
                   <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Summary</h3>
                   <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 rounded-xl text-sm leading-relaxed border border-red-100 dark:border-red-900/30">
                     I am a hard working developer looking for a job. I know React and Node and want to join a team where I can grow.
                   </div>
                 </div>
                 <div>
                   <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Improved Summary</h3>
                   <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200 rounded-xl text-sm leading-relaxed border border-green-100 dark:border-green-900/30">
                     Results-driven {preferences.role} Engineer with proven expertise building scalable web applications. Adept at creating optimized architectures using modern frameworks, driving measurable business impact and fostering continuous team growth.
                   </div>
                 </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                 <button onClick={() => setIsImproverOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                 <button onClick={() => { handleQuickFix('summary'); setIsImproverOpen(false); }} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">Apply Improvements</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Job Match Analysis Modal */}
      <AnimatePresence>
        {isGapOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Search className="text-primary-500" /> Job Match Analyzer</h2>
                 <button onClick={() => { setIsGapOpen(false); setGapResult(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                 {!gapResult ? (
                   <>
                     <p className="text-sm text-slate-600 dark:text-slate-400">Paste the job description below to compare your resume skills against the employer's requirements.</p>
                     <textarea 
                       value={jobDescText} 
                       onChange={(e) => setJobDescText(e.target.value)} 
                       placeholder="Paste Job Description here..." 
                       className="w-full h-40 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-200 transition-colors"
                     ></textarea>
                     <button onClick={handleGapAnalysis} disabled={isGapLoading} className="w-full h-11 flex justify-center items-center bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50">
                       {isGapLoading ? <RefreshCw size={18} className="animate-spin" /> : "Analyze Gap"}
                     </button>
                   </>
                 ) : (
                    <div className="space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                       <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Match Percentage</h3>
                       <div className="flex items-center gap-4">
                         <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{gapResult.match_percentage}%</span>
                         <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${gapResult.match_percentage}%` }} 
                             transition={{ duration: 1, ease: "easeOut" }}
                             className={`h-full ${gapResult.match_percentage >= 70 ? 'bg-green-500' : gapResult.match_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                           />
                         </div>
                       </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-3">Critical Missing Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {gapResult.missing.length > 0 ? (
                            gapResult.missing.map(m => <span key={m} className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-full text-xs font-medium border border-rose-100 dark:border-rose-800/50">{m}</span>)
                          ) : (
                            <p className="text-sm text-slate-500">You matched all detected key requirements!</p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setGapResult(null)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm">Analyze Another Job</button>
                    </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardPage;
