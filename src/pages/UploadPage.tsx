import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, Shield, Sparkles, UploadCloud, Zap, X } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

const steps = [
  { icon: UploadCloud, title: 'Upload', desc: 'Drag & drop or click to browse' },
  { icon: Zap, title: 'AI Analyzes', desc: 'Our models parse & score your resume' },
  { icon: Sparkles, title: 'Results', desc: 'Get scores, career matches & roadmap' },
];

const benefits = [
  { icon: Shield, text: 'Your data is encrypted and never shared' },
  { icon: Zap, text: 'AI-powered analysis in under 10 seconds' },
  { icon: FileText, text: 'ATS compatibility check included' },
];

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) startUpload(f);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) startUpload(f);
  };

  const startUpload = (f: File) => {
    setFile(f);
    setUploading(true);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) { p = 100; clearInterval(interval); }
      setProgress(Math.round(p));
    }, 200);
  };

  const reset = () => { setFile(null); setUploading(false); setProgress(0); };

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* Heading */}
      <SectionHeading title="Upload Your Resume" subtitle="Let our AI analyze your resume, score it and match you to the best careers." badge={<Badge tone="info" icon={<Sparkles size={12} />}>AI-Powered</Badge>} />

      {/* Steps */}
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div key={step.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="flex items-start gap-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-xs text-muted">{step.desc}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Upload zone */}
      <Card glow className="relative overflow-hidden text-center">
        {/* decorative */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-amber/5 blur-3xl" />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.label
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-14 transition-all ${dragOver ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-amber/30 hover:border-amber hover:bg-parchment/[0.03]'}`}
            >
              <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileInput} />
              <motion.div animate={{ y: dragOver ? -8 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                <UploadCloud size={52} className="text-cyan" />
              </motion.div>
              <div>
                <p className="text-xl font-bold">Drag & drop your resume here</p>
                <p className="mt-1 text-sm text-muted">or click anywhere in this zone to browse files</p>
              </div>
              <div className="flex gap-2">
                <Badge tone="neutral">PDF</Badge>
                <Badge tone="neutral">DOCX</Badge>
                <Badge tone="neutral">Max 5 MB</Badge>
              </div>
            </motion.label>
          ) : (
            <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6 py-6">
              <div className="flex items-center justify-center gap-3">
                <FileText size={28} className="text-cyan" />
                <div className="text-left">
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button onClick={reset} className="ml-4 rounded-full p-1 text-stone hover:bg-parchment/10 hover:text-parchment"><X size={16} /></button>
              </div>

              {/* Progress */}
              <div className="mx-auto max-w-md">
                <div className="mb-1 flex justify-between text-xs text-muted"><span>Uploading…</span><span>{progress}%</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-parchment/10">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan to-mint" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut' }} />
                </div>
              </div>

              {progress >= 100 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
                  <CheckCircle className="text-success" size={32} />
                  <p className="font-semibold text-success">Upload complete!</p>
                  <Button>View Analysis Results</Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Benefits */}
      <div className="flex flex-wrap justify-center gap-6">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.text} className="flex items-center gap-2 text-sm text-muted">
              <Icon size={16} className="text-cyan" />
              <span>{b.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
