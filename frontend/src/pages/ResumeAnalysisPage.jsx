import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCpu, FiRefreshCw, FiUpload } from 'react-icons/fi';
import { resumeService } from '../services/resumeService';
import { aiService } from '../services/aiService';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import ScoreRing from '../components/ai/ScoreRing';
import InsightList from '../components/ai/InsightList';

export default function ResumeAnalysisPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    resumeService
      .getAll()
      .then(({ data }) => {
        const list = data.results || data;
        setResumes(list);
        if (list.length) setSelectedId(list[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    aiService
      .getResumeAI(selectedId)
      .then(({ data }) => {
        setAnalysis(data.analysis);
        setParsed(data.parsed_data);
      })
      .catch(() => {});
  }, [selectedId]);

  const runParse = async () => {
    if (!selectedId) return;
    setParsing(true);
    try {
      const { data } = await aiService.parseResume(selectedId);
      setParsed(data.parsed_data);
      toast.success('Resume parsed successfully');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Parse failed');
    } finally {
      setParsing(false);
    }
  };

  const runAnalyze = async () => {
    if (!selectedId) return;
    setAnalyzing(true);
    try {
      const { data } = await aiService.analyzeResume(selectedId);
      setAnalysis(data.analysis);
      toast.success('AI analysis complete');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">AI Resume Analysis</h1>
        <CardSkeleton />
      </div>
    );
  }

  if (!resumes.length) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <FiCpu className="mx-auto text-slate-600" size={48} />
        <h2 className="mt-4 text-xl font-semibold text-white">No resume to analyze</h2>
        <p className="mt-2 text-slate-400">Upload a PDF resume first</p>
        <Link to="/dashboard/upload" className="btn-primary mt-6 inline-flex">
          <FiUpload /> Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl flex items-center gap-2">
            <FiCpu className="text-indigo-400" />
            AI Resume Analysis
          </h1>
          <p className="mt-1 text-slate-400">ATS scoring, strengths, and career recommendations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" loading={parsing} onClick={runParse}>
            <FiRefreshCw /> Parse Resume
          </Button>
          <Button loading={analyzing} onClick={runAnalyze}>
            Run ATS Analysis
          </Button>
        </div>
      </div>

      <div className="card">
        <label className="text-sm text-slate-400">Select resume</label>
        <select
          className="input-field mt-2 max-w-md"
          value={selectedId || ''}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>{r.original_filename}</option>
          ))}
        </select>
      </div>

      {parsed && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Parsed Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-white">{parsed.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-white">{parsed.email || '—'}</p>
            </div>
          </div>
          {parsed.skills?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {parsed.skills.map((s) => (
                  <span key={s} className="rounded-lg bg-indigo-500/15 px-3 py-1 text-sm text-indigo-300 border border-indigo-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {analysis ? (
        <div className="space-y-6">
          <div className="card flex flex-col items-center py-8">
            <ScoreRing score={analysis.ats_score ?? 0} />
            <p className="mt-4 text-sm text-slate-400 text-center max-w-md">
              Score based on ATS standards, modern tech skills, and industry readiness
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InsightList title="Strengths" items={analysis.strengths} variant="success" />
            <InsightList title="Weaknesses" items={analysis.weaknesses} variant="warning" />
            <InsightList title="Missing Skills" items={analysis.missing_skills} variant="danger" />
            <InsightList title="Recommendations" items={analysis.recommendations} />
          </div>

          {analysis.job_role_suitability?.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-3">Suitable Roles</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.job_role_suitability.map((role) => (
                  <span key={role} className="rounded-full bg-violet-500/15 px-4 py-1.5 text-sm text-violet-300 border border-violet-500/25">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12 text-slate-400">
          <FiCpu className="mx-auto mb-4 text-indigo-500/50" size={40} />
          <p>Click <strong className="text-white">Run ATS Analysis</strong> to get your AI career report</p>
        </div>
      )}
    </div>
  );
}
