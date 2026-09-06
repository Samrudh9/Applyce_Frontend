import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api, ApiError } from '../lib/api';

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validate = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) return 'Only PDF and DOCX files are supported.';
    if (f.size > MAX_FILE_SIZE) return 'File size exceeds 5 MB limit.';
    return null;
  };

  const handleFile = (f: File) => {
    const err = validate(f);
    if (err) { setError(err); return; }
    setError(null);
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setProgress(0); setError(null);

    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 90));
    }, 300);

    try {
      const result = await api.analyzeResume(file);
      clearInterval(timer);
      setProgress(100);
      const fileUrl = URL.createObjectURL(file);
      setTimeout(() => {
        navigate('/result', { state: { analysisResult: result, fileName: file.name, fileUrl, fileType: file.type } });
      }, 500);
    } catch (err) {
      clearInterval(timer);
      setProgress(0);
      setError(err instanceof ApiError ? err.message : 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeading
        align="center"
        title="Upload Your Resume"
        subtitle="Our AI will analyze your resume, identify your strengths, and recommend career paths."
        badge={<Badge tone="info" icon={<Upload size={12} />}>Resume Analysis</Badge>}
      />

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            <AlertCircle size={16} className="shrink-0" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError(null)}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      <Card hover={false} className="p-0">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => { if (!uploading) document.getElementById('file-input')?.click(); }}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 transition-all duration-300 ${dragging ? 'border-accent bg-accent/5' : file ? 'border-accent/30 bg-accent/[0.02]' : 'border-line-strong bg-canvas hover:border-accent/40 hover:bg-accent/[0.02]'
            }`}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />

          {file ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
              <FileText size={40} className="mx-auto text-accent" />
              <p className="mt-3 font-semibold text-ink">{file.name}</p>
              <p className="text-sm text-ink-sec">{(file.size / 1024).toFixed(0)} KB</p>
            </motion.div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/8">
                <Upload size={28} className="text-accent" />
              </div>
              <p className="text-lg font-semibold text-ink">Drop your resume here</p>
              <p className="mt-1 text-sm text-ink-sec">or click to browse · PDF, DOCX up to 5 MB</p>
            </div>
          )}
        </div>
      </Card>

      {/* Upload progress */}
      {uploading && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <ProgressBar value={progress} animated />
          <p className="mt-2 text-center text-sm text-ink-sec">
            {progress < 30 ? 'Uploading resume…' : progress < 70 ? 'Analyzing content with AI…' : progress < 100 ? 'Generating career insights…' : 'Done!'}
          </p>
        </motion.div>
      )}

      {/* Submit button */}
      {file && !uploading && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={handleUpload} className="w-full" size="lg">
            <Upload size={18} /> Analyze Resume
          </Button>
        </motion.div>
      )}

      {/* Success */}
      {progress === 100 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-accent-strong">
          <CheckCircle2 size={20} />
          <span className="font-semibold">Analysis complete — redirecting…</span>
        </motion.div>
      )}
    </div>
  );
}
