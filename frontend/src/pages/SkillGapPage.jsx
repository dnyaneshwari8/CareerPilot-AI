import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTarget, FiUpload, FiTrendingUp } from 'react-icons/fi';
import { resumeService } from '../services/resumeService';
import { aiService } from '../services/aiService';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import InsightList from '../components/ai/InsightList';

export default function SkillGapPage() {
  const [resumes, setResumes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    Promise.all([resumeService.getAll(), aiService.getRoles()])
      .then(([resRes, rolesRes]) => {
        const list = resRes.data.results || resRes.data;
        setResumes(list);
        if (list.length) setSelectedId(list[0].id);
        const roleList = rolesRes.data.roles || [];
        setRoles(roleList);
        if (roleList.length) setTargetRole(roleList[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const runAnalysis = async () => {
    if (!selectedId || !targetRole) return;
    setAnalyzing(true);
    try {
      const { data } = await aiService.skillGap(selectedId, targetRole);
      setResult(data.result);
      toast.success('Skill gap analysis complete');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Skill Gap Analysis</h1>
        <CardSkeleton />
      </div>
    );
  }

  if (!resumes.length) {
    return (
      <div className="text-center py-16">
        <FiTarget className="mx-auto text-slate-600" size={48} />
        <h2 className="mt-4 text-xl font-semibold text-white">Upload a resume first</h2>
        <Link to="/dashboard/upload" className="btn-primary mt-6 inline-flex">
          <FiUpload /> Upload Resume
        </Link>
      </div>
    );
  }

  const gap = result?.skill_gap_percentage ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl flex items-center gap-2">
          <FiTarget className="text-violet-400" />
          Skill Gap Analysis
        </h1>
        <p className="mt-1 text-slate-400">Compare your skills against your dream role (2025 standards)</p>
      </div>

      <div className="card grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Resume</label>
          <select
            className="input-field mt-2"
            value={selectedId || ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>{r.original_filename}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-400">Target Role</label>
          <select
            className="input-field mt-2"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.id}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Button loading={analyzing} onClick={runAnalysis} className="w-full sm:w-auto">
            <FiTrendingUp /> Analyze Skill Gap
          </Button>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Target Role</p>
                <p className="text-xl font-semibold text-white">{result.target_role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Skill Gap</p>
                <p className="text-3xl font-bold gradient-text">{gap}%</p>
              </div>
            </div>
            <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                style={{ width: `${Math.min(gap, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {gap <= 20 ? 'You are close to role readiness!' : gap <= 40 ? 'Moderate gap — follow the learning path' : 'Significant upskilling recommended'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InsightList title="Current Skills" items={result.current_skills} variant="success" />
            <InsightList title="Required Skills" items={result.required_skills} />
            <InsightList title="Missing Skills" items={result.missing_skills} variant="danger" />
            <InsightList title="Learning Path" items={result.learning_path} variant="warning" />
          </div>
        </div>
      )}

      {!result && (
        <div className="card text-center py-12 text-slate-400">
          Select a role and run analysis to see your personalized learning path
        </div>
      )}
    </div>
  );
}
