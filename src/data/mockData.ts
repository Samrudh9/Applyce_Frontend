export const features = [
  '🧠 AI Career Matching',
  '📊 ATS Score Analysis',
  '💼 Real Job Search',
  '🗺️ Career Roadmaps',
  '💰 Salary Estimation',
  '🔍 Skill Gap Analysis',
  '📈 Progress Tracking',
  '💡 Improvement Tips',
];

export const scoreHistory = [
  { month: 'Jan', resume: 62, ats: 58 },
  { month: 'Feb', resume: 69, ats: 64 },
  { month: 'Mar', resume: 74, ats: 70 },
  { month: 'Apr', resume: 79, ats: 76 },
  { month: 'May', resume: 84, ats: 81 },
  { month: 'Jun', resume: 88, ats: 86 },
];

export const resumeHistory = [
  { date: '2026-02-10', file: 'resume_v4.pdf', resume: 88, ats: 86, match: 'ML Engineer' },
  { date: '2026-01-28', file: 'resume_v3.pdf', resume: 84, ats: 81, match: 'Data Analyst' },
  { date: '2025-12-15', file: 'resume_v2.pdf', resume: 79, ats: 76, match: 'Software Engineer' },
];

export const jobs = [
  {
    title: 'Machine Learning Engineer',
    company: 'NeoLabs',
    location: 'Bengaluru',
    salary: '$90k - $120k',
    match: 92,
    remote: true,
    source: 'LinkedIn',
    matchingSkills: ['Python', 'TensorFlow', 'NLP'],
    missingSkills: ['MLOps'],
  },
  {
    title: 'Data Scientist',
    company: 'Quantiq',
    location: 'Mumbai',
    salary: '$80k - $110k',
    match: 84,
    remote: false,
    source: 'Indeed',
    matchingSkills: ['SQL', 'Pandas', 'Statistics'],
    missingSkills: ['Airflow'],
  },
];
