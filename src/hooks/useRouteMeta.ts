import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Lightweight, non-breaking per-route <title> for the client-side SPA.
 * Falls back gracefully and never throws — if a route isn't mapped it keeps
 * the static <title> from index.html. This is a progressive enhancement only;
 * the static metadata (Open Graph, Twitter, canonical, JSON-LD) lives in
 * index.html and does not depend on JS.
 */

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Applyce - AI Career Recommendation Platform',
  '/about': 'About - Applyce',
  '/pricing': 'Pricing - Applyce',
  '/login': 'Sign in - Applyce',
  '/dashboard': 'Dashboard - Applyce',
  '/upload': 'Upload Resume - Applyce',
  '/result': 'Your Career Report - Applyce',
  '/jobs': 'Jobs - Applyce',
  '/roadmap': 'Career Roadmap - Applyce',
  '/ats-report': 'ATS Report - Applyce',
  '/resume-builder': 'Resume Builder - Applyce',
  '/cover-letter': 'Cover Letter - Applyce',
  '/interview': 'Interview Prep - Applyce',
  '/quizzes': 'Skill Quizzes - Applyce',
  '/tracker': 'Application Tracker - Applyce',
  '/scorecard': 'Scorecard - Applyce',
  '/apply-agent': 'Apply Agent - Applyce',
  '/auth/callback': 'Signing you in... - Applyce',
};

const DEFAULT_TITLE = 'Applyce - AI Career Recommendation Platform';

function titleFor(pathname: string): string {
  return ROUTE_TITLES[pathname] ?? DEFAULT_TITLE;
}

/**
 * Sets document.title based on the current route. Place once inside the
 * routed tree so it re-runs whenever the location changes.
 */
export function useRouteMeta(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titleFor(pathname);
  }, [pathname]);
}
