import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiDownload, FiEye, FiTrash2, FiFileText, FiUpload } from 'react-icons/fi';
import { resumeService } from '../services/resumeService';
import { formatDate, formatFileSize } from '../utils/format';
import { CardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function ResumeDetailsPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchResumes = () => {
    setLoading(true);
    resumeService
      .getAll()
      .then(({ data }) => setResumes(data.results || data))
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDownload = async (resume) => {
    try {
      const { data } = await resumeService.download(resume.id);
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.original_filename;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch {
      toast.error('Download failed');
    }
  };

  const handleView = (resume) => {
    if (resume.file_url) {
      window.open(resume.file_url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('File URL not available');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await resumeService.delete(deleteId);
      toast.success('Resume deleted');
      setDeleteId(null);
      fetchResumes();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">My Resume</h1>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!resumes.length) {
    return (
      <div className="mx-auto max-w-lg text-center animate-fade-in py-16">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5">
          <FiFileText size={48} className="text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-white">No resumes yet</h2>
        <p className="mt-2 text-slate-400">Upload your first PDF resume to get started</p>
        <Link to="/dashboard/upload" className="btn-primary mt-8 inline-flex">
          <FiUpload />
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">My Resume</h1>
          <p className="mt-1 text-slate-400">{resumes.length} file(s) uploaded</p>
        </div>
        <Link to="/dashboard/upload" className="btn-primary">
          <FiUpload />
          Upload New
        </Link>
      </div>

      <div className="space-y-4">
        {resumes.map((resume) => (
          <div key={resume.id} className="card">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <FiFileText size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{resume.original_filename}</h3>
                  <dl className="mt-2 grid gap-1 text-sm text-slate-400 sm:grid-cols-3 sm:gap-4">
                    <div>
                      <dt className="text-xs text-slate-500">Upload Date</dt>
                      <dd>{formatDate(resume.uploaded_at)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">File Size</dt>
                      <dd>{resume.file_size_display || formatFileSize(resume.file_size)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => handleView(resume)}>
                  <FiEye />
                  View
                </Button>
                <Button variant="secondary" onClick={() => handleDownload(resume)}>
                  <FiDownload />
                  Download
                </Button>
                <Button variant="danger" onClick={() => setDeleteId(resume.id)}>
                  <FiTrash2 />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Resume">
        <p className="text-slate-400 text-sm">This action cannot be undone. Are you sure?</p>
        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
