import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiFile } from 'react-icons/fi';
import { resumeService } from '../services/resumeService';
import Button from '../components/ui/Button';

const MAX_SIZE = 10 * 1024 * 1024;

function validatePdf(file) {
  if (!file) return 'No file selected';
  if (file.type !== 'application/pdf') return 'Only PDF files are allowed';
  if (file.size > MAX_SIZE) return 'File must be under 10 MB';
  return null;
}

export default function UploadResumePage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFile = (f) => {
    const err = validatePdf(f);
    if (err) {
      toast.error(err);
      return;
    }
    setFile(f);
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      await resumeService.upload(file, setProgress);
      toast.success('Resume uploaded successfully!');
      navigate('/dashboard/resume');
    } catch (err) {
      const msg = err.response?.data?.file?.[0] || err.response?.data?.detail || 'Upload failed';
      toast.error(typeof msg === 'string' ? msg : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Upload Resume</h1>
        <p className="mt-1 text-slate-400">Drag and drop your PDF resume or click to browse</p>
      </div>

      <div
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`card cursor-pointer border-2 border-dashed transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="flex flex-col items-center py-12 text-center">
          <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ${dragActive ? 'animate-pulse-glow' : ''}`}>
            <FiUploadCloud size={40} className="text-indigo-400" />
          </div>
          {file ? (
            <>
              <FiFile className="mb-2 text-indigo-400" size={24} />
              <p className="font-medium text-white">{file.name}</p>
              <p className="mt-1 text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-white">
                {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="mt-2 text-sm text-slate-500">or click to browse • PDF only • Max 10 MB</p>
            </>
          )}
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Button onClick={handleUpload} loading={uploading} disabled={!file} className="w-full sm:w-auto">
        Upload Resume
      </Button>
    </div>
  );
}
