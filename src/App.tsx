/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShieldCheck, Menu, Lightbulb, Lock, Shield, ArrowLeft, ArrowRight, Check, ChevronLeft, Smartphone, Wind, Moon, Sun, User, X, Search, Users, CheckCircle, Clock, Star, Info, TrendingUp, Download, Filter, Table, ChevronRight, AlertCircle, MoreVertical, ArrowUp, ArrowDown, FastForward, Sparkles, Heart, Brain, Coffee, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SkeletalResultsLoader from './components/SkeletalResultsLoader';
import CozyBackground from './components/CozyBackground';
import { AnimatedPercentage, CircularProgress } from './components/AnimatedPercentage';
import PercentageBreakdownCard from './components/PercentageBreakdownCard';



const physicalQuestions = [
  { id: 'PF1', text: 'Do you experience problems with tiredness or physical exhaustion after completing your assessment tests?' },
  { id: 'PF2', text: 'Do you feel a lack of physical energy to perform routine tasks following assessment periods?' },
  { id: 'PF3', text: 'Do you feel physically weak or notice reduced muscle strength after assessment periods?' },
  { id: 'PF4', text: 'Do you feel sleepy, drowsy, or feel the need to rest significantly more after assessments?' },
  { id: 'PF5', text: 'Do you have difficulty starting physical activities due to physical tiredness post-assessment?' }
];

const cognitiveQuestions = [
  { id: 'CF1', text: 'How mentally tired or drained do you feel after completing your assessment tests?' },
  { id: 'CF2', text: 'Do you have difficulty maintaining concentration or focus on tasks after assessment periods?' },
  { id: 'CF3', text: 'Do you find it harder to think quickly or process complex information post-assessment?' },
  { id: 'CF4', text: 'Do you experience short-term memory slips or trouble recalling information following assessments?' },
  { id: 'CF5', text: 'Do you struggle to stay motivated to complete remaining schoolwork following assessment periods?' }
];

const pfOptions = [
  { value: 1, label: '1 - Less than usual' },
  { value: 2, label: '2 - No more than usual' },
  { value: 3, label: '3 - More than usual' },
  { value: 4, label: '4 - Much more than usual' }
];

const cfOptions = [
  { value: 1, label: '1 - Better/Less than usual' },
  { value: 2, label: '2 - No worse than usual' },
  { value: 3, label: '3 - Worse than usual' },
  { value: 4, label: '4 - Much worse than usual' }
];

const lifestyleQuestions = [
  {
    id: 'sleep',
    text: 'How many hours of sleep did you get last night?',
    options: ['Less than 5 hours', '5–6 hours', '6–7 hours', '7–8 hours', 'More than 8 hours']
  },
  {
    id: 'breaks',
    text: 'How often do you take breaks during long study sessions?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'devices',
    text: 'How long do you usually use electronic devices before going to sleep?',
    options: ['Less than 30 mins', '30m–1h', '1–2 hours', '2–3 hours', '3+ hours']
  }
];

const evaluationQuestions = [
  { id: 'F1', text: 'The application accurately processes input data and displays the corresponding fatigue level.' },
  { id: 'F2', text: 'All features, buttons, and navigation options operate without system errors or technical bugs.' },
  { id: 'U1', text: 'The web application interface is user-friendly, clear, and easy to navigate.' },
  { id: 'U2', text: 'The fatigue assessment outputs and recommendations are presented in an understandable format.' },
  { id: 'R1', text: 'The web application loads consistently and performs reliably every time it is accessed.' },
  { id: 'R2', text: 'The generated fatigue result accurately reflects my actual perceived state of fatigue post-assessment.' }
];

export interface SuggestionItem {
  label: string;
  dotColor: string;
  badgeBg: string;
  suggestion: string;
}

const simpleSuggestionsList: SuggestionItem[] = [
  {
    label: 'Energized',
    dotColor: '#22C55E',
    badgeBg: 'bg-[#22C55E]',
    suggestion: 'Keep it up! Stay hydrated, maintain your sleep routine, and continue taking short study breaks.'
  },
  {
    label: 'Fresh',
    dotColor: '#22C55E',
    badgeBg: 'bg-[#22C55E]',
    suggestion: "You're doing well! Keep a regular sleep schedule and take short breaks while studying."
  },
  {
    label: 'Mildly Fatigued',
    dotColor: '#EAB308',
    badgeBg: 'bg-[#EAB308]',
    suggestion: 'Take a short break. Drink some water, stretch, and give yourself time to rest before continuing.'
  },
  {
    label: 'Fatigued',
    dotColor: '#F97316',
    badgeBg: 'bg-[#F97316]',
    suggestion: 'Prioritize rest. Take a longer break, reduce unnecessary screen time, and try to get enough sleep tonight.'
  },
  {
    label: 'Exhausted',
    dotColor: '#EF4444',
    badgeBg: 'bg-[#EF4444]',
    suggestion: "Stop and rest. Take a substantial break, hydrate, and prioritize a good night's sleep. If this level happens frequently, consider talking to a parent/guardian, school counselor, or healthcare professional."
  }
];

type Screen = 'landing' | 'howItWorks' | 'consent' | 'demographic' | 'physicalFatigue' | 'cognitiveFatigue' | 'lifestyle' | 'evaluation' | 'analyzing' | 'results' | 'adminDashboard';

export function calculateLocalScore(answers: Record<string, number>) {
  const pf_scores = ['PF1', 'PF2', 'PF3', 'PF4', 'PF5'].map(id => Number(answers[id]) || 2);
  const cf_scores = ['CF1', 'CF2', 'CF3', 'CF4', 'CF5'].map(id => Number(answers[id]) || 2);

  const raw_physical_score = pf_scores.reduce((a, b) => a + b, 0);
  const raw_cognitive_score = cf_scores.reduce((a, b) => a + b, 0);
  const raw_total_score = raw_physical_score + raw_cognitive_score;

  let result_percent = Math.round(100 - (((raw_total_score - 10) / 30) * 100));
  result_percent = Math.max(0, Math.min(100, result_percent));

  let result_label = "Exhausted";
  let suggestion = "Take a break, sleep early, avoid screens.";

  if (result_percent >= 80) {
    result_label = "Fully Energized";
    suggestion = "You are in great shape! Maintain your good habits and keep staying active.";
  } else if (result_percent >= 60) {
    result_label = "Fresh";
    suggestion = "You're doing well! Keep a regular sleep schedule and take short breaks while studying.";
  } else if (result_percent >= 40) {
    result_label = "Mildly Fatigued";
    suggestion = "Take a short break. Drink some water, stretch, and give yourself time to rest before continuing.";
  } else if (result_percent >= 20) {
    result_label = "Fatigued";
    suggestion = "Prioritize rest. Take a longer break, reduce unnecessary screen time, and try to get enough sleep tonight.";
  }

  return {
    response_id: `RSP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    raw_physical_score,
    raw_cognitive_score,
    raw_total_score,
    result_percent,
    result_label,
    suggestion
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'respondents' | 'reports'>('dashboard');
  const [adminSortOption, setAdminSortOption] = useState<'default' | 'lowest' | 'highest'>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [respondentSearch, setRespondentSearch] = useState('');
  const [respondentPage, setRespondentPage] = useState(1);
  const [agreed, setAgreed] = useState(false);

  // Demographic state
  const [ageBracket, setAgeBracket] = useState<string | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);

  // Fatigue Scales state
  const [fatigueAnswers, setFatigueAnswers] = useState<Record<string, number>>({});
  const allPhysicalAnswered = physicalQuestions.every(q => fatigueAnswers[q.id] !== undefined);
  const allCognitiveAnswered = cognitiveQuestions.every(q => fatigueAnswers[q.id] !== undefined);

  // Lifestyle state
  const [lifestyleAnswers, setLifestyleAnswers] = useState<Record<string, string>>({});
  const allLifestyleAnswered = lifestyleQuestions.every(q => lifestyleAnswers[q.id] !== undefined);

  // Evaluation state
  const [evaluationAnswers, setEvaluationAnswers] = useState<Record<string, number>>({});
  const allEvaluationAnswered = evaluationQuestions.every(q => evaluationAnswers[q.id] !== undefined);
  const [isEvaluationSubmitting, setIsEvaluationSubmitting] = useState(false);
  const [evaluationSubmitted, setEvaluationSubmitted] = useState(false);
  const [evaluationSuccessToast, setEvaluationSuccessToast] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('focus_assessment_result');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // 1. Immediately calculate deterministic client-side score so results are always available
    const localResult = calculateLocalScore(fatigueAnswers);
    setAssessmentResult(localResult);
    try {
      localStorage.setItem('focus_assessment_result', JSON.stringify(localResult));
    } catch (e) {}

    // 2. Smoothly transition to analyzing screen
    setCurrentScreen('analyzing');

    // 3. Submit data to server in background
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent_given: agreed,
          age_bracket: ageBracket,
          sex,
          grade_level: gradeLevel,
          pf1: fatigueAnswers['PF1'], pf2: fatigueAnswers['PF2'], pf3: fatigueAnswers['PF3'], pf4: fatigueAnswers['PF4'], pf5: fatigueAnswers['PF5'],
          cf1: fatigueAnswers['CF1'], cf2: fatigueAnswers['CF2'], cf3: fatigueAnswers['CF3'], cf4: fatigueAnswers['CF4'], cf5: fatigueAnswers['CF5'],
          sleep_duration: lifestyleAnswers['sleep'],
          study_break_frequency: lifestyleAnswers['breaks'],
          pre_bed_screen_time: lifestyleAnswers['devices']
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAssessmentResult((prev: any) => ({ ...localResult, ...data }));
        try {
          localStorage.setItem('focus_assessment_result', JSON.stringify({ ...localResult, ...data }));
        } catch (e) {}
      }
    } catch (error) {
      console.warn('Background submission note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluationSubmit = async () => {
    setIsEvaluationSubmitting(true);
    try {
      const currentRespId = assessmentResult?.response_id;
      const evaluationToken = assessmentResult?.evaluation_token;
      if (!currentRespId || !evaluationToken) {
        throw new Error('Missing signed evaluation token. Submit the assessment first.');
      }
      await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_id: currentRespId,
          evaluation_token: evaluationToken,
          f1: evaluationAnswers['F1'],
          f2: evaluationAnswers['F2'],
          u1: evaluationAnswers['U1'],
          u2: evaluationAnswers['U2'],
          r1: evaluationAnswers['R1'],
          r2: evaluationAnswers['R2']
        })
      });
    } catch (err) {
      console.error('Evaluation submit error:', err);
    } finally {
      setIsEvaluationSubmitting(false);
      setEvaluationSubmitted(true);
      setEvaluationSuccessToast(true);

      // Ensure assessmentResult is non-null
      setAssessmentResult((prev: any) => {
        if (prev) return prev;
        const fallback = calculateLocalScore(fatigueAnswers);
        try {
          localStorage.setItem('focus_assessment_result', JSON.stringify(fallback));
        } catch (e) {}
        return fallback;
      });

      // Always return reliably to results
      setCurrentScreen('results');
      setTimeout(() => {
        setEvaluationSuccessToast(false);
      }, 6000);
    }
  };

  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminInputPassword, setAdminInputPassword] = useState('');
  const [adminInputUsername, setAdminInputUsername] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [dbRespondents, setDbRespondents] = useState<any[]>([]);
  const [dbReports, setDbReports] = useState<any[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  
  const fetchAdminData = async (username: string, password: string) => {
    setIsAdminLoading(true);
    setAdminLoginError('');
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: {
          'X-Admin-Username': username.trim(),
          'X-Admin-Password': password.trim()
        }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setAdminLoginError('Incorrect username or password.');
        } else {
          setAdminLoginError(`Unable to connect (Status ${res.status}).`);
        }
        setIsAdminLoading(false);
        return false;
      }
      const data = await res.json();
      
      try {
        const repRes = await fetch('/api/admin/reports', {
          headers: {
            'X-Admin-Username': username.trim(),
            'X-Admin-Password': password.trim()
          }
        });
        if (repRes.ok) {
          const repData = await repRes.json();
          setDbReports(repData || []);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      }
      // map DB format to frontend table format
      const mapped = Array.isArray(data) ? data.map((row: any) => ({
        id: row.response_id || 'RSP-ANON',
        date: row.submitted_at ? new Date(row.submitted_at).toLocaleString() : new Date().toLocaleString(),
        age: row.age_bracket || 'N/A',
        sex: row.sex || 'N/A',
        grade: row.grade_level || 'N/A',
        pf: [row.pf1 ?? 1, row.pf2 ?? 1, row.pf3 ?? 1, row.pf4 ?? 1, row.pf5 ?? 1],
        cf: [row.cf1 ?? 1, row.cf2 ?? 1, row.cf3 ?? 1, row.cf4 ?? 1, row.cf5 ?? 1],
        raw: row.raw_total_score ?? ((row.pf1 ?? 1) + (row.pf2 ?? 1) + (row.pf3 ?? 1) + (row.pf4 ?? 1) + (row.pf5 ?? 1) + (row.cf1 ?? 1) + (row.cf2 ?? 1) + (row.cf3 ?? 1) + (row.cf4 ?? 1) + (row.cf5 ?? 1))
      })) : [];
      setDbRespondents(mapped);
      setAdminUsername(username.trim());
      setAdminPassword(password.trim());
      return true;
    } catch (e: any) {
      console.error(e);
      setAdminLoginError('Network or server error while connecting.');
      setIsAdminLoading(false);
      return false;
    } finally {
      setIsAdminLoading(false);
    }
  };

  const sortedRespondents = [...dbRespondents].filter(r => 
    r.id.toLowerCase().includes(respondentSearch.toLowerCase())
  ).sort((a, b) => {
    if (adminSortOption === 'lowest') return a.raw - b.raw;
    if (adminSortOption === 'highest') return b.raw - a.raw;
    return 0;
  });


  const respondentsPerPage = 10;
  const totalPages = Math.ceil(sortedRespondents.length / respondentsPerPage) || 1;
  
  useEffect(() => {
    setRespondentPage(1);
  }, [respondentSearch, adminSortOption]);

  const displayedRespondents = sortedRespondents.slice(
    (respondentPage - 1) * respondentsPerPage, 
    respondentPage * respondentsPerPage
  );


  const handleDownloadCSV = async () => {
    if (!adminUsername || !adminPassword) return;
    try {
      const res = await fetch('/api/admin/export-csv', {
        headers: {
          'X-Admin-Username': adminUsername,
          'X-Admin-Password': adminPassword
        }
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'focus_assessment_results.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(e) {
      alert('Error downloading CSV');
    }
  };


  return (
    <div className={`min-h-screen bg-[#F4F0E6] text-[#594A42] font-sans relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'dark' : ''}`}>
      <CozyBackground />
      <style>{`
        .dark {
          background-color: #1E1A18 !important; 
          color: #EAE6DF !important;
        }
        .dark .bg-white, .dark .sm\\:bg-white, .dark .md\\:bg-white, .dark .bg-white\\/60, .dark .bg-white\\/80 { background-color: #2A2421 !important; }
        .dark .bg-\\[\\#F4F0E6\\] { background-color: #1E1A18 !important; }
        .dark .bg-\\[\\#FAF8F5\\] { background-color: #2A2421 !important; }
        .dark .text-\\[\\#594A42\\] { color: #EAE6DF !important; }
        .dark .text-\\[\\#594A42\\]\\/80 { color: rgba(234, 230, 223, 0.8) !important; }
        .dark .text-\\[\\#594A42\\]\\/90 { color: rgba(234, 230, 223, 0.9) !important; }
        .dark .text-\\[\\#594A42\\]\\/70 { color: rgba(234, 230, 223, 0.7) !important; }
        .dark .text-\\[\\#594A42\\]\\/50 { color: rgba(234, 230, 223, 0.5) !important; }
        .dark .text-\\[\\#332A25\\] { color: #ffffff !important; }
        .dark .border-\\[\\#E8E3D9\\] { border-color: #3A312D !important; }
        .dark .border-\\[\\#C5BDB6\\] { border-color: #594A42 !important; }
        .dark .border-\\[\\#594A42\\] { border-color: #EAE6DF !important; }
        .dark .bg-\\[\\#4A3C34\\] { background-color: #C5BDB6 !important; color: #1E1A18 !important; }
        .dark .bg-\\[\\#7A6455\\] { background-color: #C5BDB6 !important; color: #1E1A18 !important; }
        .dark .hover\\:bg-\\[\\#3A2C24\\]:hover { background-color: #EAE6DF !important; color: #1E1A18 !important; }
        .dark .bg-\\[\\#594A42\\] { background-color: #C5BDB6 !important; }
        .dark .hover\\:bg-\\[\\#4A3C34\\]:hover { background-color: #EAE6DF !important; }
        .dark .bg-\\[\\#4A3C34\\]\\/70 { background-color: rgba(197, 189, 182, 0.1) !important; color: rgba(234, 230, 223, 0.5) !important; }
        .dark .bg-\\[\\#7A6455\\]\\/70 { background-color: rgba(197, 189, 182, 0.1) !important; color: rgba(234, 230, 223, 0.5) !important; }
        .dark .bg-\\[\\#E8E3D9\\] { background-color: #3A312D !important; }
        .dark .from-\\[\\#FAF8F5\\] { --tw-gradient-from: #2A2421 !important; --tw-gradient-stops: var(--tw-gradient-from), #2A2421, var(--tw-gradient-to) !important; }
        .dark .to-white { --tw-gradient-to: #2A2421 !important; }
        .dark .bg-gradient-to-r.from-\\[\\#FAF8F5\\].to-white { background: #2A2421 !important; }
        .dark .text-amber-800 { color: #FCD34D !important; }
        .dark .text-amber-900 { color: #FDE68A !important; }
        .dark .text-amber-950 { color: #FEF3C7 !important; }
        .dark .bg-amber-500\\/10 { background-color: rgba(245, 158, 11, 0.1) !important; }
        .dark .border-amber-500\\/20 { border-color: rgba(245, 158, 11, 0.2) !important; }
        .dark .bg-amber-100 { background-color: rgba(245, 158, 11, 0.2) !important; color: #FDE68A !important; }
        .dark .text-emerald-950 { color: #A7F3D0 !important; }
        .dark .text-emerald-900 { color: #34D399 !important; }
        .dark .text-emerald-800 { color: #6EE7B7 !important; }
        .dark .bg-emerald-50 { background-color: rgba(16, 185, 129, 0.1) !important; border-color: rgba(16, 185, 129, 0.2) !important; }
        .dark .bg-emerald-200 { background-color: rgba(16, 185, 129, 0.2) !important; }
        .dark .border-emerald-300 { border-color: rgba(16, 185, 129, 0.3) !important; }
        .dark .bg-white\/40, .dark .bg-white\/50 { background-color: rgba(42, 36, 33, 0.5) !important; }
        .dark .bg-\\[\\#FAF8F5\\]\\/80 { background-color: #2A2421 !important; border-color: #3A312D !important; }

        

        

        

        .dark .text-\\[\\#7A6455\\] { color: #EAE6DF !important; }
        .dark .text-amber-700 { color: #FBBF24 !important; }
        .dark .text-amber-600 { color: #F59E0B !important; }
        .dark .text-amber-500 { color: #F59E0B !important; }
        .dark .fill-amber-500 { fill: #F59E0B !important; }
        .dark .fill-amber-600 { fill: #FBBF24 !important; }
      `}</style>
      <AnimatePresence mode="wait">
        {currentScreen === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16"
          >
            {/* Landing Top Section */}
            <header className="flex flex-col sm:flex-row justify-between items-start w-full gap-4 sm:gap-0">
              <button className="text-xs md:text-sm tracking-[0.25em] font-light uppercase hover:opacity-70 transition-opacity">
                About
              </button>
              <p className="text-sm md:text-base font-light italic text-left sm:text-right max-w-[280px] leading-relaxed opacity-80">
                A study fatigue indicator through a short questionnaire assessment.
              </p>
            </header>

            {/* Landing Main Section */}
            <main className="flex flex-col items-center justify-center flex-grow py-12">
              <div className="relative flex flex-col items-center justify-center group cursor-default w-full">
                <h1 className="text-[4.5rem] min-[400px]:text-[5.5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] xl:text-[16rem] font-serif leading-none text-center -tracking-[0.03em] select-none text-[#594A42]">
                  FOCUS
                </h1>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide text-[#594A42] opacity-80 text-center max-w-2xl px-4">
                  Fatigue Observation through Cognitive User Screening
                </p>
              </div>
              
              <div className="mt-12 sm:mt-16 flex flex-col items-center gap-6 sm:gap-8">
                <p className="text-xs md:text-sm tracking-[0.4em] uppercase font-light opacity-80">
                  STEM PR
                </p>
                <p className="text-lg sm:text-xl md:text-3xl font-serif italic opacity-90 text-center tracking-wide px-4">
                  know your limits, find your <span className="font-semibold">focus.</span>
                </p>
              </div>
            </main>

            {/* Landing Bottom Section */}
            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-8 sm:gap-0">
              <div className="flex items-start gap-4 max-w-[320px]">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 shrink-0 stroke-[1.25] mt-1 sm:mt-0 opacity-80" />
                <p className="text-xs md:text-sm font-light italic leading-relaxed opacity-80">
                  Responses are confidential and used for assessment purposes only.
                </p>
              </div>
              <button 
                onClick={() => setCurrentScreen('howItWorks')}
                className="group flex items-center gap-3 text-xl md:text-2xl tracking-[0.25em] uppercase font-light italic transition-all self-end sm:self-auto cursor-pointer border-b border-[#594A42]/30 hover:border-[#594A42] pb-1 hover:opacity-80"
              >
                <span>Start</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </footer>
          </motion.div>
        )}
        
        {currentScreen === 'howItWorks' && (
          <motion.div
            key="howItWorks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16"
          >
            {/* How It Works Header */}
            <header className="flex justify-between items-center w-full">
              <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity z-10 cursor-pointer">
                <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.25]" />
              </button>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2">
                FOCUS
              </h2>
            </header>

            {/* How It Works Main */}
            <main className="flex flex-col items-center justify-center flex-grow py-12 max-w-3xl mx-auto w-full gap-10 sm:gap-14">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-serif uppercase tracking-[0.15em] text-center mt-4 sm:mt-8">
                How It Works:
              </h1>
              
              <div className="flex flex-col items-center gap-8 text-center text-[15px] sm:text-lg md:text-[22px] font-light opacity-90 leading-relaxed px-4 w-full">
                <p>Start with the pre-assessment</p>
                <p>Answer questionnaire after summative tests or exams</p>
                <p className="max-w-[550px]">Get results of your fatigue level (highly encouraged to follow the simple suggestions given for your own health)</p>
              </div>

              <button 
                onClick={() => setCurrentScreen('consent')}
                className="mt-8 px-10 sm:px-12 py-3 sm:py-4 border-[0.5px] border-dashed border-[#594A42] rounded-[3rem] text-[11px] sm:text-xs tracking-[0.2em] font-serif uppercase hover:bg-[#594A42] hover:text-[#F4F0E6] transition-colors cursor-pointer"
              >
                I understand!
              </button>
            </main>

            {/* How It Works Footer */}
            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-8 sm:gap-0">
              <div className="flex items-start gap-4 max-w-[320px]">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 shrink-0 stroke-[1.25] mt-1 sm:mt-0 opacity-80" />
                <p className="text-xs md:text-sm font-light italic leading-relaxed opacity-80">
                  Responses are confidential and used for assessment purposes only.
                </p>
              </div>
              <button 
                onClick={() => setCurrentScreen('landing')}
                className="text-xl md:text-2xl tracking-[0.25em] uppercase font-light italic hover:opacity-70 transition-opacity self-end sm:self-auto cursor-pointer"
              >
                Back
              </button>
            </footer>
          </motion.div>
        )}

        {currentScreen === 'consent' && (
          <motion.div
            key="consent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col items-center p-6 sm:p-8 md:p-12 lg:p-16"
          >
            {/* Consent Header */}
            <header className="flex justify-between items-center w-full mb-8 sm:mb-12">
              <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity z-10 cursor-pointer">
                <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.25]" />
              </button>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2">
                FOCUS
              </h2>
            </header>

            {/* Consent Card */}
            <main className="w-full max-w-3xl bg-white/60 sm:bg-white rounded-[2rem] shadow-[0_8px_40px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-10 md:p-12 flex flex-col">
              <div className="text-center mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest text-[#594A42] mb-3">
                  Informed Consent
                </h1>
                <p className="text-[#594A42]/80 text-sm md:text-base font-light">
                  Assessment of Fatigue Levels Among Senior High School Students
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-10">
                {/* Info Card 1 */}
                <div className="border border-[#E8E3D9] rounded-2xl p-6 sm:p-8 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-[#594A42] stroke-[1.5]" />
                    <h3 className="font-serif font-bold text-lg md:text-xl text-[#594A42]">Purpose</h3>
                  </div>
                  <p className="text-sm md:text-[15px] font-light leading-relaxed text-[#594A42]/80">
                    This study aims to understand the cognitive and physical fatigue levels of students during academic assessments. By participating, you contribute to critical research aimed at improving student wellness and learning environments.
                  </p>
                </div>

                {/* Info Card 2 */}
                <div className="border border-[#E8E3D9] rounded-2xl p-6 sm:p-8 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-[#594A42] stroke-[1.5]" />
                    <h3 className="font-serif font-bold text-lg md:text-xl text-[#594A42]">Confidentiality</h3>
                  </div>
                  <p className="text-sm md:text-[15px] font-light leading-relaxed text-[#594A42]/80">
                    Your responses are completely confidential and will be used solely for research and assessment purposes. No personally identifiable information will be shared with third parties or your educational institution without explicit, separate permission.
                  </p>
                </div>

                {/* Info Card 3 */}
                <div className="border border-[#E8E3D9] rounded-2xl p-6 sm:p-8 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#594A42] stroke-[1.5]" />
                    <h3 className="font-serif font-bold text-lg md:text-xl text-[#594A42]">Your Rights</h3>
                  </div>
                  <p className="text-sm md:text-[15px] font-light leading-relaxed text-[#594A42]/80">
                    Your participation is strictly voluntary. You maintain the right to withdraw from the assessment at any time without any penalty or consequence to your academic standing.
                  </p>
                </div>
              </div>

              {/* Actions Area */}
              <div className="flex flex-col gap-6 pt-6 border-t border-[#E8E3D9]">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#C5BDB6] bg-white group-hover:border-[#594A42] transition-colors">
                    <input 
                      type="checkbox" 
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    {agreed && (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-3 h-3 bg-[#594A42] rounded-[2px]" 
                      />
                    )}
                  </div>
                  <span className="text-sm md:text-[15px] font-light text-[#594A42]/90 select-none group-hover:text-[#594A42] transition-colors">
                    I have read and agree to the terms and conditions
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => setCurrentScreen('howItWorks')}
                    className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-full border border-[#C5BDB6] text-sm font-semibold text-[#594A42] hover:bg-[#F4F0E6] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2]" />
                    Back to How It Works
                  </button>
                  <button 
                    onClick={() => {
                      if (agreed) setCurrentScreen('demographic');
                    }}
                    disabled={!agreed}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-full text-sm font-semibold transition-all duration-300
                      ${agreed 
                        ? 'bg-[#594A42] hover:bg-[#332A25] text-white cursor-pointer shadow-md' 
                        : 'bg-[#C5BDB6] text-white/60 cursor-not-allowed'
                      }`}
                  >
                    I CONSENT & START ASSESSMENT
                    <ArrowRight className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                <p className="text-[11px] sm:text-xs text-center text-[#594A42]/60 font-light mt-2">
                  By clicking consent, you acknowledge that you have read and understood the information provided above.
                </p>
              </div>
            </main>
          </motion.div>
        )}

        {currentScreen === 'demographic' && (
          <motion.div
            key="demographic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col items-center p-6 sm:p-8 md:p-12 lg:p-16"
          >
            {/* Header */}
            <header className="flex flex-col items-center w-full mb-8 sm:mb-12 relative">
              <div className="flex justify-between items-center w-full mb-6">
                <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity z-10 cursor-pointer">
                  <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.25]" />
                </button>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2">
                  FOCUS
                </h2>
              </div>
              
              <div className="flex flex-col items-center w-full max-w-sm mt-4">
                <span className="text-[10px] sm:text-xs tracking-[0.15em] font-semibold text-[#594A42] mb-3 opacity-90">
                  STEP 1 OF 4
                </span>
                <div className="w-full h-[2px] bg-[#E8E3D9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#594A42] w-1/4 rounded-full" />
                </div>
              </div>
            </header>

            {/* Main Card */}
            <main className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_8px_40px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-12 md:p-16 flex flex-col items-center relative z-10">
              <div className="text-center mb-10 md:mb-12 max-w-lg">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#594A42] mb-4 uppercase" style={{ fontVariant: 'small-caps' }}>
                  Part I: Demographic Profile
                </h1>
                <p className="text-[#594A42]/80 text-sm md:text-base font-medium leading-relaxed">
                  Please provide a few basic details to help us contextualize your assessment results.
                </p>
              </div>

              <div className="w-full flex flex-col gap-8 max-w-xl">
                {/* Age Bracket */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-[#594A42]">Age Bracket</label>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {['15-16', '17-18', '19+'].map(age => (
                      <button
                        key={age}
                        onClick={() => setAgeBracket(age)}
                        className={`py-3 sm:py-4 px-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                          ageBracket === age 
                            ? 'border-[#594A42] bg-[#F4F0E6] text-[#594A42]' 
                            : 'border-[#E8E3D9] bg-white text-[#594A42] hover:border-[#C5BDB6]'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sex */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-[#594A42]">Sex</label>
                  <div className="flex flex-col gap-3">
                    {['Male', 'Female', 'Prefer not to say'].map(s => (
                      <label 
                        key={s}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                          sex === s 
                            ? 'border-[#594A42] bg-[#F4F0E6]' 
                            : 'border-[#E8E3D9] bg-white hover:border-[#C5BDB6]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          sex === s ? 'border-[#594A42]' : 'border-[#C5BDB6]'
                        }`}>
                          {sex === s && <div className="w-2.5 h-2.5 rounded-full bg-[#594A42]" />}
                        </div>
                        <input 
                          type="radio" 
                          name="sex" 
                          className="hidden" 
                          checked={sex === s}
                          onChange={() => setSex(s)}
                        />
                        <span className="text-sm font-medium text-[#594A42]">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Grade Level */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-[#594A42]">Grade Level</label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {['Grade 11', 'Grade 12'].map(grade => (
                      <button
                        key={grade}
                        onClick={() => setGradeLevel(grade)}
                        className={`py-3 sm:py-4 px-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                          gradeLevel === grade 
                            ? 'border-[#594A42] bg-[#F4F0E6] text-[#594A42]' 
                            : 'border-[#E8E3D9] bg-white text-[#594A42] hover:border-[#C5BDB6]'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Bottom Actions */}
            <div className="w-full max-w-3xl flex justify-center gap-4 mt-10 z-0 px-4">
              <button 
                onClick={() => setCurrentScreen('consent')}
                className="w-40 sm:w-48 py-4 rounded-full border border-[#594A42] text-[#594A42] text-xs sm:text-sm font-bold tracking-[0.1em] hover:bg-white transition-colors cursor-pointer"
              >
                BACK
              </button>
              <button 
                onClick={() => {
                  if (ageBracket && sex && gradeLevel) setCurrentScreen('physicalFatigue');
                }}
                disabled={!(ageBracket && sex && gradeLevel)}
                className={`w-40 sm:w-48 py-4 rounded-full text-white text-xs sm:text-sm font-bold tracking-[0.1em] transition-colors ${
                  ageBracket && sex && gradeLevel 
                    ? 'bg-[#4A3C34] hover:bg-[#3A2C24] cursor-pointer' 
                    : 'bg-[#4A3C34]/70 cursor-not-allowed'
                }`}
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        )}

        {currentScreen === 'physicalFatigue' && (
          <motion.div
            key="physicalFatigue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col items-center p-6 sm:p-8 md:p-12 lg:p-16"
          >
            {/* Header */}
            <header className="flex flex-col items-center w-full mb-8 sm:mb-12 relative">
              <div className="flex justify-between items-center w-full mb-6">
                <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity z-10 cursor-pointer">
                  <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.25]" />
                </button>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2">
                  FOCUS
                </h2>
              </div>
              
              <div className="flex flex-col items-center w-full max-w-sm mt-4">
                <span className="text-[10px] sm:text-xs tracking-[0.15em] font-semibold text-[#594A42] mb-3 opacity-90">
                  STEP 2 OF 4
                </span>
                <div className="w-full h-[2px] bg-[#E8E3D9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#594A42] w-2/4 rounded-full" />
                </div>
              </div>
            </header>

            {/* Main Card */}
            <main className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_40px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-10 md:p-14 flex flex-col items-center relative z-10">
              <div className="text-center mb-10 max-w-xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#594A42] mb-4 uppercase" style={{ fontVariant: 'small-caps' }}>
                  Part II: Physical Fatigue
                </h1>
                <p className="text-[#594A42]/80 text-sm md:text-base font-medium leading-relaxed">
                  Please reflect on how you feel after completing your assessment tests.
                </p>
              </div>

              <div className="w-full flex flex-col gap-12">
                {/* Physical Fatigue Section */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-8">
                    {physicalQuestions.map((q) => (
                      <div key={q.id} className="flex flex-col gap-4">
                        <p className="text-[15px] sm:text-base font-bold text-[#594A42]">
                          {q.id}: <span className="font-medium text-[#594A42]/90">{q.text}</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {pfOptions.map((opt) => (
                            <label 
                              key={opt.value}
                              className={`flex items-start sm:items-center gap-3 p-4 sm:p-3 rounded-xl border cursor-pointer transition-colors ${
                                fatigueAnswers[q.id] === opt.value 
                                  ? 'border-[#594A42] bg-[#F4F0E6]' 
                                  : 'border-[#E8E3D9] bg-white hover:border-[#C5BDB6]'
                              }`}
                            >
                              <div className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center mt-0.5 sm:mt-0 ${
                                fatigueAnswers[q.id] === opt.value ? 'border-[#594A42]' : 'border-[#C5BDB6]'
                              }`}>
                                {fatigueAnswers[q.id] === opt.value && <div className="w-2 h-2 rounded-full bg-[#594A42]" />}
                              </div>
                              <input 
                                type="radio" 
                                name={q.id} 
                                className="hidden" 
                                checked={fatigueAnswers[q.id] === opt.value}
                                onChange={() => setFatigueAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                              />
                              <span className="text-xs sm:text-[13px] font-bold text-[#594A42] leading-tight">
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="w-full flex justify-center gap-4 mt-16 z-0">
                <button 
                  onClick={() => setCurrentScreen('demographic')}
                  className="w-40 sm:w-48 py-4 rounded-full border border-[#594A42] text-[#594A42] text-xs sm:text-sm font-bold tracking-[0.1em] hover:bg-[#F4F0E6] transition-colors cursor-pointer"
                >
                  BACK
                </button>
                <button 
                  onClick={() => setCurrentScreen('cognitiveFatigue')}
                  disabled={!allPhysicalAnswered}
                  className={`w-40 sm:w-48 py-4 rounded-full text-white text-xs sm:text-sm font-bold tracking-[0.1em] transition-colors ${
                    allPhysicalAnswered 
                      ? 'bg-[#4A3C34] hover:bg-[#3A2C24] cursor-pointer' 
                      : 'bg-[#4A3C34]/70 cursor-not-allowed'
                  }`}
                >
                  CONTINUE
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {currentScreen === 'cognitiveFatigue' && (
          <motion.div
            key="cognitiveFatigue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col items-center p-6 sm:p-8 md:p-12 lg:p-16"
          >
            {/* Header */}
            <header className="flex flex-col items-center w-full mb-8 sm:mb-12 relative">
              <div className="flex justify-between items-center w-full mb-6">
                <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity z-10 cursor-pointer">
                  <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.25]" />
                </button>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2">
                  FOCUS
                </h2>
              </div>
              
              <div className="flex flex-col items-center w-full max-w-sm mt-4">
                <span className="text-[10px] sm:text-xs tracking-[0.15em] font-semibold text-[#594A42] mb-3 opacity-90">
                  STEP 3 OF 4
                </span>
                <div className="w-full h-[2px] bg-[#E8E3D9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#594A42] w-3/4 rounded-full" />
                </div>
              </div>
            </header>

            {/* Main Card */}
            <main className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_40px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-10 md:p-14 flex flex-col items-center relative z-10">
              <div className="text-center mb-10 max-w-xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#594A42] mb-4 uppercase" style={{ fontVariant: 'small-caps' }}>
                  Part III: Cognitive/Mental Fatigue
                </h1>
                <p className="text-[#594A42]/80 text-sm md:text-base font-medium leading-relaxed">
                  Please reflect on how you feel after completing your assessment tests.
                </p>
              </div>

              <div className="w-full flex flex-col gap-12">
                {/* Cognitive/Mental Fatigue Section */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-8">
                    {cognitiveQuestions.map((q) => (
                      <div key={q.id} className="flex flex-col gap-4">
                        <p className="text-[15px] sm:text-base font-bold text-[#594A42]">
                          {q.id}: <span className="font-medium text-[#594A42]/90">{q.text}</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {cfOptions.map((opt) => (
                            <label 
                              key={opt.value}
                              className={`flex items-start sm:items-center gap-3 p-4 sm:p-3 rounded-xl border cursor-pointer transition-colors ${
                                fatigueAnswers[q.id] === opt.value 
                                  ? 'border-[#594A42] bg-[#F4F0E6]' 
                                  : 'border-[#E8E3D9] bg-white hover:border-[#C5BDB6]'
                              }`}
                            >
                              <div className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center mt-0.5 sm:mt-0 ${
                                fatigueAnswers[q.id] === opt.value ? 'border-[#594A42]' : 'border-[#C5BDB6]'
                              }`}>
                                {fatigueAnswers[q.id] === opt.value && <div className="w-2 h-2 rounded-full bg-[#594A42]" />}
                              </div>
                              <input 
                                type="radio" 
                                name={q.id} 
                                className="hidden" 
                                checked={fatigueAnswers[q.id] === opt.value}
                                onChange={() => setFatigueAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                              />
                              <span className="text-xs sm:text-[13px] font-bold text-[#594A42] leading-tight whitespace-pre-wrap">
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="w-full flex justify-center gap-4 mt-16 z-0">
                <button 
                  onClick={() => setCurrentScreen('physicalFatigue')}
                  className="w-40 sm:w-48 py-4 rounded-full border border-[#594A42] text-[#594A42] text-xs sm:text-sm font-bold tracking-[0.1em] hover:bg-[#F4F0E6] transition-colors cursor-pointer"
                >
                  BACK
                </button>
                <button 
                  onClick={() => setCurrentScreen('lifestyle')}
                  disabled={!allCognitiveAnswered}
                  className={`w-40 sm:w-48 py-4 rounded-full text-white text-xs sm:text-sm font-bold tracking-[0.1em] transition-colors ${
                    allCognitiveAnswered 
                      ? 'bg-[#4A3C34] hover:bg-[#3A2C24] cursor-pointer' 
                      : 'bg-[#4A3C34]/70 cursor-not-allowed'
                  }`}
                >
                  CONTINUE
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {currentScreen === 'lifestyle' && (
          <motion.div
            key="lifestyle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col items-center p-6 sm:p-8 md:p-12 lg:p-16"
          >
            {/* Header */}
            <header className="flex flex-col items-center w-full mb-8 sm:mb-12 relative">
              <div className="flex justify-between items-center w-full mb-6">
                <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity z-10 cursor-pointer">
                  <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.25]" />
                </button>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2">
                  FOCUS
                </h2>
              </div>
              
              <div className="flex flex-col items-center w-full max-w-sm mt-4">
                <span className="text-[10px] sm:text-xs tracking-[0.15em] font-semibold text-[#594A42] mb-3 opacity-90">
                  STEP 4 OF 4
                </span>
                <div className="w-full h-[2px] bg-[#E8E3D9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#594A42] w-full rounded-full" />
                </div>
              </div>
            </header>

            {/* Main Card */}
            <main className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_40px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-10 md:p-14 flex flex-col items-center relative z-10">
              <div className="text-center mb-10 max-w-xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#594A42] mb-4 uppercase" style={{ fontVariant: 'small-caps' }}>
                  Part IV: Context & Lifestyle
                </h1>
                <p className="text-[#594A42]/80 text-sm md:text-base font-medium leading-relaxed">
                  Please provide some context about your daily habits and lifestyle.
                </p>
              </div>

              <div className="w-full flex flex-col gap-10">
                {lifestyleQuestions.map((q) => (
                  <div key={q.id} className="flex flex-col gap-4">
                    <p className="text-[15px] sm:text-base font-bold text-[#594A42]">
                      {q.text}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {q.options.map((opt) => (
                        <label 
                          key={opt}
                          className={`flex items-start sm:items-center gap-3 p-4 sm:p-3 rounded-xl border cursor-pointer transition-colors ${
                            lifestyleAnswers[q.id] === opt 
                              ? 'border-[#594A42] bg-[#F4F0E6]' 
                              : 'border-[#E8E3D9] bg-white hover:border-[#C5BDB6]'
                          }`}
                        >
                          <div className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center mt-0.5 sm:mt-0 ${
                            lifestyleAnswers[q.id] === opt ? 'border-[#594A42]' : 'border-[#C5BDB6]'
                          }`}>
                            {lifestyleAnswers[q.id] === opt && <div className="w-2 h-2 rounded-full bg-[#594A42]" />}
                          </div>
                          <input 
                            type="radio" 
                            name={q.id} 
                            className="hidden" 
                            checked={lifestyleAnswers[q.id] === opt}
                            onChange={() => setLifestyleAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          />
                          <span className="text-xs sm:text-[13px] font-bold text-[#594A42] leading-tight whitespace-pre-wrap">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="w-full flex justify-center gap-4 mt-16 z-0">
                <button 
                  onClick={() => setCurrentScreen('cognitiveFatigue')}
                  className="w-40 sm:w-48 py-4 rounded-full border border-[#594A42] text-[#594A42] text-xs sm:text-sm font-bold tracking-[0.1em] hover:bg-[#F4F0E6] transition-colors cursor-pointer"
                >
                  BACK
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!allLifestyleAnswered || isSubmitting}
                  className={`w-52 sm:w-60 py-4 rounded-full text-white text-xs sm:text-sm font-bold tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${
                    allLifestyleAnswered && !isSubmitting
                      ? 'bg-[#4A3C34] hover:bg-[#3A2C24] hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md' 
                      : 'bg-[#4A3C34]/70 cursor-not-allowed opacity-75'
                  }`}
                >
                  {isSubmitting ? 'PROCESSING...' : 'FINISH & VIEW RESULTS'}
                  {!isSubmitting && <Check className="w-4 h-4" strokeWidth={2.5} />}
                </button>
              </div>
            </main>
          </motion.div>
        )}

        {currentScreen === 'evaluation' && (
          <motion.div
            key="evaluation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-screen flex flex-col items-center p-6 sm:p-8 md:p-12 lg:p-16 pb-32"
          >
            {/* Header */}
            <header className="flex flex-col items-center w-full mb-8 sm:mb-12 relative max-w-4xl mx-auto">
              <div className="flex justify-between items-center w-full mb-6">
                <button 
                  onClick={() => setCurrentScreen('results')} 
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3D9] text-[#594A42] hover:bg-[#FAF8F5] text-xs font-bold transition-all cursor-pointer shadow-xs z-10 hover:scale-105 active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Results</span>
                </button>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2 text-[#594A42]">
                  FOCUS
                </h2>
                <div className="w-24"></div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-4xl flex flex-col items-center relative z-10">
              <div className="text-center mb-8 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                  <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>System Evaluation & Feedback</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[#332A25] mb-3 uppercase tracking-wide">
                  EVALUATE OUR SYSTEM
                </h1>
                <p className="text-[#594A42]/90 text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto">
                  Please rate your experience with the FOCUS web application based on the statements below. Your feedback will help us improve and refine the system.
                </p>
              </div>

              {/* Legend Card */}
              <div className="bg-white rounded-xl border border-[#E8E3D9] p-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mb-8 w-full max-w-4xl shadow-sm">
                {[
                  { n: 1, label: 'Strongly Disagree' },
                  { n: 2, label: 'Disagree' },
                  { n: 3, label: 'Neutral' },
                  { n: 4, label: 'Agree' },
                  { n: 5, label: 'Strongly Agree' }
                ].map(item => (
                  <div key={item.n} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#F4F0E6] text-[#594A42] text-[10px] font-bold flex items-center justify-center">
                      {item.n}
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#594A42]">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Questions */}
              <div className="w-full max-w-4xl flex flex-col gap-4">
                {evaluationQuestions.map((q) => (
                  <div key={q.id} className="bg-white rounded-xl border border-[#E8E3D9] p-6 md:p-8 flex flex-col gap-8 w-full shadow-sm">
                    <p className="text-[14px] sm:text-[15px] font-semibold text-[#332A25]">
                      {q.id}: {q.text}
                    </p>
                    
                    <div className="relative flex justify-between w-full max-w-md mx-auto">
                      {/* Connecting Line */}
                      <div className="absolute top-[13px] sm:top-[15px] left-[5%] right-[5%] h-[1px] bg-[#E8E3D9] z-0" />
                      
                      {[1, 2, 3, 4, 5].map(num => (
                        <label key={num} className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name={q.id} 
                            className="hidden" 
                            checked={evaluationAnswers[q.id] === num}
                            onChange={() => setEvaluationAnswers(prev => ({ ...prev, [q.id]: num }))}
                          />
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border bg-white flex items-center justify-center transition-all ${
                            evaluationAnswers[q.id] === num ? 'border-[#594A42] scale-110' : 'border-[#C5BDB6] group-hover:border-[#594A42]'
                          }`}>
                            {evaluationAnswers[q.id] === num && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#594A42]" />}
                          </div>
                          <span className="text-[11px] sm:text-xs font-semibold text-[#594A42]">{num}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </main>
            
            {/* Bottom Actions Fixed/Relative */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-center gap-4 mt-12 pt-8 border-t border-[#E8E3D9] z-0">
              <button 
                onClick={() => setCurrentScreen('results')}
                className="w-full sm:w-[240px] py-4 rounded-lg border border-[#C5BDB6] text-[#594A42] text-xs font-bold tracking-[0.1em] hover:bg-[#E8E3D9] transition-colors cursor-pointer flex justify-center items-center gap-2 bg-white shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={3} /> RETURN TO RESULTS
              </button>
              <button 
                onClick={handleEvaluationSubmit}
                disabled={!allEvaluationAnswered || isEvaluationSubmitting}
                className={`w-full sm:w-[260px] py-4 rounded-lg text-white text-xs font-bold tracking-[0.1em] transition-all flex justify-center items-center gap-2 shadow-md ${
                  allEvaluationAnswered && !isEvaluationSubmitting
                    ? 'bg-[#7A6455] hover:bg-[#594A42] hover:scale-[1.02] active:scale-[0.98] cursor-pointer' 
                    : 'bg-[#7A6455]/70 cursor-not-allowed opacity-60'
                }`}
              >
                {isEvaluationSubmitting ? 'SAVING FEEDBACK...' : 'SUBMIT EVALUATION'} 
                {!isEvaluationSubmitting && <Check className="w-4 h-4" strokeWidth={3} />}
              </button>
            </div>
          </motion.div>
        )}

        {currentScreen === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 relative z-10"
          >
            <SkeletalResultsLoader onComplete={() => setCurrentScreen('results')} />
          </motion.div>
        )}

        {currentScreen === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen flex flex-col items-center p-6 sm:p-8 md:p-12 lg:p-16 pb-32"
          >
            {/* Header */}
            <header className="flex justify-between items-center w-full mb-8 sm:mb-12 relative max-w-4xl mx-auto">
              <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity z-10 cursor-pointer">
                <Menu className="w-6 h-6 md:w-8 md:h-8 stroke-[1.25]" />
              </button>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif -tracking-[0.03em] select-none text-center absolute left-1/2 -translate-x-1/2">
                FOCUS
              </h2>
              <div className="w-6 md:w-8 z-10" />
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-4xl flex flex-col items-center relative z-10">
              <AnimatePresence>
                {evaluationSuccessToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.97 }}
                    transition={{ duration: 0.35 }}
                    className="w-full mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-emerald-950">Evaluation Saved Successfully!</p>
                        <p className="text-[11px] sm:text-xs text-emerald-800 font-medium">Thank you for evaluating and rating the FOCUS system.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEvaluationSuccessToast(false)} 
                      className="text-emerald-700 hover:text-emerald-950 p-1.5 rounded-lg hover:bg-emerald-100/80 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 max-w-xl"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Assessment Complete</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#332A25] mb-3 tracking-tight">
                  Your Wellness Profile
                </h1>
                <p className="text-[#594A42]/90 text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto">
                  Based on your responses, here is an overview of your current fatigue levels and personalized guidance.
                </p>
              </motion.div>

              {/* Status & Vitality Card */}
              {(() => {
                const currentLabel = assessmentResult?.result_label || "Fresh";
                const currentItem = simpleSuggestionsList.find(s => s.label.toLowerCase() === currentLabel.toLowerCase()) || simpleSuggestionsList[1];
                const vitalityPercent = assessmentResult?.result_percent !== undefined ? assessmentResult.result_percent : 57;
                const rawPhysical = assessmentResult?.raw_physical_score || 12;
                const rawCognitive = assessmentResult?.raw_cognitive_score || 11;
                const rawTotal = assessmentResult?.raw_total_score || (rawPhysical + rawCognitive);

                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-[24px] border border-[#E8E3D9] p-6 sm:p-8 md:p-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 mb-6 shadow-sm relative overflow-hidden group"
                    style={{
                      boxShadow: `0 12px 36px -12px ${currentItem.dotColor}25`
                    }}
                  >
                    {/* Cozy ambient glow background */}
                    <div 
                      className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
                      style={{ backgroundColor: currentItem.dotColor }}
                    />

                    {/* Status Info Column */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
                      <span className="text-[11px] sm:text-xs tracking-[0.15em] font-bold text-[#594A42]/70 uppercase mb-2 sm:mb-3">
                        Overall Wellness Status
                      </span>
                      <div className="flex items-center gap-3.5 mb-3">
                        <div 
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shrink-0 shadow-sm animate-breathe" 
                          style={{ 
                            backgroundColor: currentItem.dotColor,
                            boxShadow: `0 0 14px ${currentItem.dotColor}80` 
                          }} 
                        />
                        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-sans font-bold text-[#332A25] leading-none tracking-tight">
                          {currentLabel}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-[#594A42]/80 font-medium max-w-sm">
                        Total score <span className="font-bold text-[#332A25]">{rawTotal} / 40 points</span> ({Math.round((rawTotal / 40) * 100)}% cumulative load).
                      </p>
                    </div>

                    {/* Animated Vitality Gauge */}
                    <div className="flex flex-col items-center justify-center relative z-10 shrink-0 bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E8E3D9]">
                      <CircularProgress 
                        percentage={vitalityPercent}
                        color={currentItem.dotColor}
                        bgColor="#E8E3D9"
                        label="Vitality Index"
                        sublabel="Recovery Capacity"
                        size={130}
                        strokeWidth={9}
                      />
                    </div>
                  </motion.div>
                );
              })()}

              {/* Levels Grid with Animated Percentages */}
              {(() => {
                const activeResult = assessmentResult || calculateLocalScore(fatigueAnswers);
                const rawPhysical = activeResult?.raw_physical_score ?? 12;
                const rawCognitive = activeResult?.raw_cognitive_score ?? 11;
                const physicalPercent = Math.round((rawPhysical / 20) * 100);
                const cognitivePercent = Math.round((rawCognitive / 20) * 100);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mb-8">
                    {/* Physical */}
                    <motion.div 
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.2 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-4 h-4 text-[#7A6455]" />
                            <span className="text-[15px] sm:text-base font-bold text-[#332A25]">Physical Fatigue</span>
                          </div>
                          <span className="text-xs text-[#594A42]/60 font-medium">Muscular & physical exertion</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-[#332A25]">
                            {rawPhysical} <span className="text-[#594A42]/50 text-lg sm:text-xl font-medium">/ 20</span>
                          </div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#7A6455] text-[11px] font-bold mt-1">
                            <AnimatedPercentage value={physicalPercent} /> Intensity
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-3.5 sm:h-4 bg-[#F4F0E6] rounded-full overflow-hidden p-0.5 border border-[#E8E3D9]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(5, physicalPercent))}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-[#7A6455] to-[#594A42] rounded-full" 
                        />
                      </div>
                    </motion.div>

                    {/* Cognitive */}
                    <motion.div 
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.25 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4 text-[#7A6455]" />
                            <span className="text-[15px] sm:text-base font-bold text-[#332A25]">Cognitive Fatigue</span>
                          </div>
                          <span className="text-xs text-[#594A42]/60 font-medium">Attention & cognitive load</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-[#332A25]">
                            {rawCognitive} <span className="text-[#594A42]/50 text-lg sm:text-xl font-medium">/ 20</span>
                          </div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#7A6455] text-[11px] font-bold mt-1">
                            <AnimatedPercentage value={cognitivePercent} /> Load
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-3.5 sm:h-4 bg-[#F4F0E6] rounded-full overflow-hidden p-0.5 border border-[#E8E3D9]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(5, cognitivePercent))}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.35 }}
                          className="h-full bg-gradient-to-r from-[#7A6455] to-[#594A42] rounded-full" 
                        />
                      </div>
                    </motion.div>
                  </div>
                );
              })()}

              {/* Percentage Breakdown & Calculation Card */}
              {(() => {
                const activeResult = assessmentResult || calculateLocalScore(fatigueAnswers);
                const currentLabel = activeResult?.result_label || "Fresh";
                const currentItem = simpleSuggestionsList.find(s => s.label.toLowerCase() === currentLabel.toLowerCase()) || simpleSuggestionsList[1];
                const vitalityPercent = activeResult?.result_percent !== undefined ? activeResult.result_percent : 57;
                const rawPhysical = activeResult?.raw_physical_score !== undefined ? activeResult.raw_physical_score : 12;
                const rawCognitive = activeResult?.raw_cognitive_score !== undefined ? activeResult.raw_cognitive_score : 11;
                const rawTotal = activeResult?.raw_total_score !== undefined ? activeResult.raw_total_score : (rawPhysical + rawCognitive);

                return (
                  <PercentageBreakdownCard
                    rawPhysical={rawPhysical}
                    rawCognitive={rawCognitive}
                    rawTotal={rawTotal}
                    vitalityPercent={vitalityPercent}
                    resultLabel={currentLabel}
                    dotColor={currentItem.dotColor}
                  />
                );
              })()}

              {/* Suggestion Card (Only displays the matched assessment result suggestion) */}
              {(() => {
                const activeResult = assessmentResult || calculateLocalScore(fatigueAnswers);
                const currentLabel = activeResult?.result_label || "Fresh";
                const matchedItem = simpleSuggestionsList.find(s => s.label.toLowerCase() === currentLabel.toLowerCase()) || simpleSuggestionsList[1];
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.3 }}
                    className="w-full bg-white rounded-[20px] border border-[#E8E3D9] overflow-hidden shadow-sm mb-8"
                  >
                    <div className="p-5 sm:p-6 border-b border-[#E8E3D9] bg-[#FAF8F5] flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-[#332A25] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Suggestion
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8E3D9] text-[#594A42]">
                        Tailored to your score
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="bg-[#F4F0E6] text-xs font-bold uppercase tracking-wider text-[#594A42] border-b border-[#E8E3D9]">
                            <th className="py-3.5 px-5 sm:px-6 w-[180px]">Result</th>
                            <th className="py-3.5 px-5 sm:px-6">Suggestion</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white hover:bg-[#FAF8F5]/60 transition-colors">
                            <td className="py-4 px-5 sm:px-6 align-top">
                              <div className="flex items-center gap-2.5">
                                <div 
                                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" 
                                  style={{ backgroundColor: matchedItem.dotColor, boxShadow: `0 0 8px ${matchedItem.dotColor}66` }} 
                                />
                                <span className="text-sm font-bold text-[#332A25]">
                                  {matchedItem.label}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-5 sm:px-6 text-xs sm:text-sm text-[#594A42] leading-relaxed font-medium">
                              {assessmentResult?.suggestion || matchedItem.suggestion}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Recommendations */}
              <div className="w-full mb-8">
                <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#332A25] mb-6 border-b border-[#E8E3D9] pb-4 flex items-center justify-between">
                  <span>Actionable Recommendations</span>
                  <span className="text-xs font-medium text-[#594A42]/70 font-sans">Daily recovery tips</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Digital Detox */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    whileHover={{ y: -4, scale: 1.015 }}
                    className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 flex flex-col shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all group cursor-default"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-50 group-hover:bg-amber-100/70 border border-amber-200/50 flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                      <Smartphone className="w-6 h-6 text-[#594A42] group-hover:text-amber-900 transition-colors" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#332A25] mb-2 sm:mb-3">Digital Detox</h4>
                    <p className="text-xs sm:text-[14px] text-[#594A42]/80 leading-relaxed font-medium">
                      Take a 15-minute screen-free break to rest your eyes and allow mental focus to regenerate.
                    </p>
                  </motion.div>

                  {/* Mindfulness */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    whileHover={{ y: -4, scale: 1.015 }}
                    className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 flex flex-col shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all group cursor-default"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-50 group-hover:bg-amber-100/70 border border-amber-200/50 flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                      <Wind className="w-6 h-6 text-[#594A42] group-hover:text-amber-900 transition-colors" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#332A25] mb-2 sm:mb-3">Mindfulness</h4>
                    <p className="text-xs sm:text-[14px] text-[#594A42]/80 leading-relaxed font-medium">
                      Try a 10-minute guided meditation or simple diaphragmatic breathing to release physical tension.
                    </p>
                  </motion.div>

                  {/* Rest Recovery */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                    whileHover={{ y: -4, scale: 1.015 }}
                    className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 flex flex-col shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all group cursor-default"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-50 group-hover:bg-amber-100/70 border border-amber-200/50 flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                      <Moon className="w-6 h-6 text-[#594A42] group-hover:text-amber-900 transition-colors" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#332A25] mb-2 sm:mb-3">Rest Recovery</h4>
                    <p className="text-xs sm:text-[14px] text-[#594A42]/80 leading-relaxed font-medium">
                      Prioritize a steady 8-hour sleep schedule tonight to maximize cognitive memory consolidation.
                    </p>
                  </motion.div>
                </div>
              </div>
            </main>
            
            {/* Bottom Actions Fixed/Relative */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 z-0">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentScreen('evaluation')}
                className={`w-full sm:w-[290px] py-4 rounded-xl text-xs font-bold tracking-[0.1em] transition-all cursor-pointer flex justify-center items-center gap-2.5 shadow-md ${
                  evaluationSubmitted
                    ? 'bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 text-amber-950 shadow-amber-900/5'
                    : 'bg-[#8B5E3C] hover:bg-[#734B2E] text-white border border-[#734B2E] shadow-[#8B5E3C]/20'
                }`}
              >
                <Star className={`w-4 h-4 ${evaluationSubmitted ? 'text-amber-700 fill-amber-600' : 'text-amber-200 fill-amber-300'}`} />
                <span>{evaluationSubmitted ? 'EVALUATE OUR SYSTEM (SUBMITTED ✓)' : 'EVALUATE OUR SYSTEM'}</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAgeBracket(null);
                  setSex(null);
                  setGradeLevel(null);
                  setFatigueAnswers({});
                  setLifestyleAnswers({});
                  setEvaluationAnswers({});
                  setEvaluationSubmitted(false);
                  setEvaluationSuccessToast(false);
                  setCurrentScreen('landing');
                }}
                className="w-full sm:w-[250px] py-4 rounded-xl bg-[#594A42] text-white text-xs font-bold tracking-[0.1em] hover:bg-[#4A3C34] transition-all cursor-pointer flex justify-center items-center shadow-md hover:shadow-lg"
              >
                RETURN TO HOME
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentScreen === 'adminDashboard' && (
          <motion.div
            key="adminDashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#F4F0E6] flex flex-col w-full absolute inset-0 z-20 overflow-y-auto"
          >
            {/* Navbar */}
            <nav className="w-full bg-[#F4F0E6] border-b border-[#E8E3D9] flex flex-col md:flex-row md:items-center justify-between px-6 sm:px-12 shrink-0">
              {/* Top row (always visible) */}
              <div className="flex items-center justify-between h-16 sm:h-20 w-full md:w-auto">
                <div className="flex items-center gap-8 sm:gap-12">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#594A42]">FOCUS</h2>
                  <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
                    <button onClick={() => setAdminTab('dashboard')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'dashboard' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Dashboard</button>
                    <button onClick={() => setAdminTab('respondents')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'respondents' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Respondents</button>
                    <button onClick={() => setAdminTab('reports')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'reports' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Reports</button>
                    
                  </div>
                </div>
                {/* Mobile Right Tools */}
                <div className="flex items-center gap-4 md:hidden">
                  <button onClick={() => setCurrentScreen('landing')} className="text-xs sm:text-sm font-semibold text-[#594A42] hover:opacity-70 transition-opacity cursor-pointer">Sign Out</button>
                  <div className="w-8 h-8 rounded-full bg-[#E8E3D9] overflow-hidden border border-[#C5BDB6]">
                    <div className="w-full h-full bg-[#594A42]/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#594A42]" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile tabs row (hidden on md) */}
              <div className="md:hidden flex items-center gap-6 text-sm font-semibold pb-4 overflow-x-auto no-scrollbar">
                <button onClick={() => setAdminTab('dashboard')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'dashboard' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Dashboard</button>
                <button onClick={() => setAdminTab('respondents')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'respondents' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Respondents</button>
                <button onClick={() => setAdminTab('reports')} className={`py-1 cursor-pointer whitespace-nowrap transition-colors ${adminTab === 'reports' ? 'text-[#594A42] border-b-2 border-[#594A42]' : 'text-[#594A42]/60 hover:text-[#594A42] border-b-2 border-transparent'}`}>Reports</button>
              </div>

              {/* Desktop Right Tools */}
              <div className="hidden md:flex items-center gap-4 sm:gap-6 h-16 sm:h-20">
                {adminTab === 'dashboard' ? (
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#594A42]/50" />
                    <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-lg border border-[#C5BDB6] bg-transparent text-sm outline-none focus:border-[#594A42] text-[#594A42] placeholder:text-[#594A42]/50 w-48 transition-colors" />
                  </div>
                ) : adminTab === 'respondents' ? (
                  <button 
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 bg-[#594A42] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4A3C34] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download as CSV
                  </button>
                ) : null}
                <button onClick={() => setCurrentScreen('landing')} className="text-sm font-semibold text-[#594A42] hover:opacity-70 transition-opacity cursor-pointer">Sign Out</button>
                <div className="w-8 h-8 rounded-full bg-[#E8E3D9] overflow-hidden border border-[#C5BDB6]">
                  <div className="w-full h-full bg-[#594A42]/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#594A42]" />
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            {adminTab === 'dashboard' && (
            <div className="flex-1 w-full max-w-6xl mx-auto p-6 sm:p-8 md:p-12 flex flex-col gap-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#332A25] mb-2">Analytics Overview</h1>
                <p className="text-[#594A42]/80 text-sm sm:text-base font-medium">Summary of participant demographics and platform feedback</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#594A42]/80 uppercase tracking-widest text-[10px] font-bold">
                    <Users className="w-4 h-4" /> TOTAL RESPONDENTS
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#594A42] mb-2">{dbRespondents.length}</div>
                  <div className="text-xs font-semibold flex items-center gap-1 text-[#594A42]/70">
                    Active Responses
                  </div>
                </div>
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#594A42]/80 uppercase tracking-widest text-[10px] font-bold">
                    <CheckCircle className="w-4 h-4" /> COMPLETION RATE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#594A42] mb-2">{dbRespondents.length > 0 ? "100%" : "0%"}</div>
                  <div className="text-xs font-semibold text-[#594A42]/70">
                    Across all active assessments
                  </div>
                </div>
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-[#594A42]/80 uppercase tracking-widest text-[10px] font-bold">
                    <Clock className="w-4 h-4" /> AVG. TIME TO COMPLETE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#594A42] mb-2">N/A</div>
                  <div className="text-xs font-semibold text-[#594A42]/70">
                    Median duration per session
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#332A25] mb-6">Demographics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Gender Distribution */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-[#332A25] mb-6">Gender Distribution</h3>
                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                      {dbRespondents.length > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Female', value: dbRespondents.filter(r => r.sex === 'Female').length },
                                  { name: 'Male', value: dbRespondents.filter(r => r.sex === 'Male').length },
                                  { name: 'Other', value: dbRespondents.filter(r => r.sex !== 'Female' && r.sex !== 'Male').length },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={95}
                                stroke="none"
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                              >
                                <Cell fill="#91815A" />
                                <Cell fill="#EAE6DF" />
                                <Cell fill="#C5BDB6" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-[#332A25]">{dbRespondents.length}</span>
                            <span className="text-xs font-semibold text-[#594A42]/60">Total</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm font-semibold text-[#594A42]/60">No data available</div>
                      )}
                    </div>
                    {dbRespondents.length > 0 && (
                      <div className="flex justify-center gap-4 sm:gap-6 mt-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#594A42]">
                          <div className="w-3 h-3 rounded-full bg-[#91815A]" /> Female
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#594A42]">
                          <div className="w-3 h-3 rounded-full bg-[#EAE6DF]" /> Male
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#594A42]">
                          <div className="w-3 h-3 rounded-full bg-[#C5BDB6]" /> Other
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grade Level */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[#332A25] mb-8">Grade Level</h3>
                      <div className="flex flex-col gap-6">
                        {dbRespondents.length === 0 ? (
                          <div className="text-sm font-semibold text-[#594A42]/60 text-center py-10">No data available</div>
                        ) : (
                          ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College'].map(grade => {
                            const count = dbRespondents.filter(r => r.grade === grade).length;
                            if (count === 0) return null;
                            const percentage = Math.round((count / dbRespondents.length) * 100);
                            return (
                              <div key={grade}>
                                <div className="flex justify-between text-sm font-semibold text-[#332A25] mb-2">
                                  <span>{grade}</span>
                                  <span className="text-[#594A42]/70 font-medium">{count} students</span>
                                </div>
                                <div className="w-full h-4 bg-[#EAE6DF] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#E1D7C6] rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            )}

            {adminTab === 'respondents' && (
              <div className="flex-1 w-full max-w-[1400px] mx-auto p-6 sm:p-8 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#332A25] mb-2">Live Results</h1>
                    <p className="text-[#594A42]/80 text-sm sm:text-base font-medium">Real-time assessment data collection and monitoring.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 bg-[#E8E3D9] text-[#594A42] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#C5BDB6] transition-colors cursor-pointer">
                        <Filter className="w-4 h-4" /> Filter Data
                      </button>
                      <AnimatePresence>
                        {isFilterOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E8E3D9] overflow-hidden z-30"
                          >
                            <div className="flex flex-col py-2">
                              <button onClick={() => { setAdminSortOption('default'); setIsFilterOpen(false); }} className={`px-4 py-2 text-sm text-left hover:bg-[#F4F0E6] transition-colors cursor-pointer ${adminSortOption === 'default' ? 'font-bold text-[#594A42]' : 'text-[#594A42]/80'}`}>Time Created (Default)</button>
                              <button onClick={() => { setAdminSortOption('lowest'); setIsFilterOpen(false); }} className={`px-4 py-2 text-sm text-left hover:bg-[#F4F0E6] transition-colors cursor-pointer ${adminSortOption === 'lowest' ? 'font-bold text-[#594A42]' : 'text-[#594A42]/80'}`}>Lowest Score</button>
                              <button onClick={() => { setAdminSortOption('highest'); setIsFilterOpen(false); }} className={`px-4 py-2 text-sm text-left hover:bg-[#F4F0E6] transition-colors cursor-pointer ${adminSortOption === 'highest' ? 'font-bold text-[#594A42]' : 'text-[#594A42]/80'}`}>Highest Score</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#594A42]/50" />
                      <input 
                        type="text" 
                        placeholder="Search ID..." 
                        value={respondentSearch}
                        onChange={(e) => setRespondentSearch(e.target.value)}
                        className="pl-9 pr-4 py-2.5 rounded-lg border border-[#C5BDB6] bg-[#E8E3D9]/50 text-sm outline-none focus:border-[#594A42] text-[#594A42] placeholder:text-[#594A42]/70 w-full sm:w-48 transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] overflow-hidden flex flex-col shadow-sm w-full">
                  {/* Table Header */}
                  <div className="p-5 sm:p-6 border-b border-[#E8E3D9] flex items-center gap-4">
                    <div className="flex items-center gap-2 font-bold text-[#332A25]">
                      <Table className="w-5 h-5 text-[#594A42]" /> Participant Responses
                    </div>
                    <div className="bg-[#E8E3D9] text-[#594A42] px-3 py-1 rounded-full text-xs font-bold">
                      {sortedRespondents.length} Total
                    </div>
                  </div>

                  {/* Table content */}
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                      <thead>
                        <tr className="bg-[#F4F0E6] text-xs sm:text-sm text-[#594A42] border-b border-[#E8E3D9]">
                          <th className="p-4 font-semibold whitespace-nowrap border-r border-[#E8E3D9]">Response ID</th>
                          <th className="p-4 font-semibold whitespace-nowrap border-r border-[#E8E3D9]">Submitted At</th>
                          <th className="p-4 font-semibold whitespace-nowrap border-r border-[#E8E3D9]">Age Bracket</th>
                          <th className="p-4 font-semibold whitespace-nowrap border-r border-[#E8E3D9]">Sex</th>
                          <th className="p-4 font-semibold whitespace-nowrap border-r border-[#E8E3D9]">Grade Level</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">PF1</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">PF2</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">PF3</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">PF4</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">PF5</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">CF1</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">CF2</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">CF3</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">CF4</th>
                          <th className="p-4 font-semibold border-r border-[#E8E3D9]">CF5</th>
                          <th className="p-4 font-semibold">Raw Physical</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedRespondents.map((row, i) => (
                          <tr key={i} className="border-b border-[#E8E3D9] hover:bg-[#F4F0E6]/50 transition-colors">
                            <td className="p-4 text-sm font-bold text-[#5A4A42] border-r border-[#E8E3D9]">{row.id}</td>
                            <td className="p-4 text-sm font-medium text-[#594A42] border-r border-[#E8E3D9] whitespace-nowrap">{row.date}</td>
                            <td className="p-4 text-sm font-medium text-[#594A42] border-r border-[#E8E3D9]">{row.age}</td>
                            <td className="p-4 text-sm font-medium text-[#594A42] border-r border-[#E8E3D9]">{row.sex}</td>
                            <td className="p-4 text-sm font-medium text-[#594A42] border-r border-[#E8E3D9] whitespace-nowrap">{row.grade}</td>
                            {row.pf.map((val, idx) => (
                              <td key={`pf-${idx}`} className="p-4 text-sm font-medium text-[#594A42] border-r border-[#E8E3D9]">{val}</td>
                            ))}
                            {row.cf.map((val, idx) => (
                              <td key={`cf-${idx}`} className="p-4 text-sm font-medium text-[#594A42] border-r border-[#E8E3D9]">{val}</td>
                            ))}
                            <td className={`p-4 text-sm font-bold ${row.raw < 15 ? 'text-[#D94F4F]' : 'text-[#332A25]'}`}>{row.raw}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination footer */}
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5]">
                    <span className="text-sm text-[#594A42]/80 font-medium">
                      Showing {(respondentPage - 1) * respondentsPerPage + (sortedRespondents.length > 0 ? 1 : 0)} to {Math.min(respondentPage * respondentsPerPage, sortedRespondents.length)} of {sortedRespondents.length} entries
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setRespondentPage(Math.max(1, respondentPage - 1))}
                        disabled={respondentPage === 1}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${respondentPage === 1 ? 'bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed' : 'bg-[#E8E3D9] text-[#594A42] hover:bg-[#C5BDB6] cursor-pointer'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        // Very simple pagination display: show current, first, last, and +/- 1
                        if (page === 1 || page === totalPages || (page >= respondentPage - 1 && page <= respondentPage + 1)) {
                          return (
                            <button 
                              key={page}
                              onClick={() => setRespondentPage(page)}
                              className={`w-8 h-8 flex items-center justify-center rounded font-semibold transition-colors cursor-pointer ${
                                respondentPage === page 
                                  ? 'bg-[#594A42] text-white' 
                                  : 'hover:bg-[#E8E3D9] text-[#594A42]'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === respondentPage - 2 || page === respondentPage + 2) {
                          return <span key={page} className="w-8 h-8 flex items-center justify-center text-[#594A42]">...</span>;
                        }
                        return null;
                      })}

                      <button 
                        onClick={() => setRespondentPage(Math.min(totalPages, respondentPage + 1))}
                        disabled={respondentPage === totalPages}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${respondentPage === totalPages ? 'bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed' : 'bg-[#E8E3D9] text-[#594A42] hover:bg-[#C5BDB6] cursor-pointer'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'reports' && (
              <div className="flex-1 w-full max-w-[1400px] mx-auto p-6 sm:p-8 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#332A25]">System Reports</h1>
                  <p className="text-[#594A42]/80 text-sm sm:text-base font-medium">Monitor and manage participant-reported issues and technical feedback.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Open Issues</span>
                      <div className="w-8 h-8 rounded-full bg-[#D94F4F]/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-white fill-[#D94F4F]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">{dbReports.filter(r => r.status !== 'Resolved').length}</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">Total open</span>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Resolved</span>
                      <div className="w-8 h-8 rounded-full bg-[#91815A]/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[#332A25] fill-[#D9B34F]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">{dbReports.filter(r => r.status === 'Resolved').length}</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">Total resolved</span>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Avg Resolution Time</span>
                      <div className="w-8 h-8 rounded-full bg-[#E8E3D9] flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white fill-[#887F7A]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">N/A</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">Insufficient data</span>
                    </div>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] overflow-hidden flex flex-col shadow-sm w-full">
                  {/* Table Header */}
                  <div className="p-5 sm:p-6 border-b border-[#E8E3D9] flex items-center justify-between">
                    <div className="font-bold text-[#332A25]">
                      Recent Reports
                    </div>
                    <div className="flex items-center gap-4 text-[#594A42]">
                      <Filter className="w-5 h-5 cursor-pointer hover:text-[#332A25] transition-colors" />
                      <MoreVertical className="w-5 h-5 cursor-pointer hover:text-[#332A25] transition-colors" />
                    </div>
                  </div>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#F4F0E6] text-xs uppercase tracking-wider text-[#594A42]">
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Report ID</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Date</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Category</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Status</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Respondent ID</th>
                          <th className="p-4 sm:px-6 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbReports.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-sm font-medium text-[#594A42]/60">
                              No reports found.
                            </td>
                          </tr>
                        ) : (
                          dbReports.map((row, i) => (
                            <tr key={i} className="border-b border-[#E8E3D9] hover:bg-[#F4F0E6]/50 transition-colors">
                              <td className="p-4 sm:px-6 text-sm font-bold text-[#332A25]">{row.id}</td>
                              <td className="p-4 sm:px-6 text-sm font-medium text-[#594A42] whitespace-nowrap">{row.date}</td>
                              <td className="p-4 sm:px-6">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                                  row.category === 'Bug' ? 'bg-[#D94F4F]/10 text-[#D94F4F]' :
                                  row.category === 'UI/UX' ? 'bg-[#E8E3D9] text-[#594A42]' :
                                  'bg-[#4F7CD9]/10 text-[#4F7CD9]'
                                }`}>
                                  {row.category}
                                </span>
                              </td>
                              <td className="p-4 sm:px-6">
                                <div className="flex items-center gap-2 text-sm font-medium text-[#594A42]">
                                  <div className={`w-2 h-2 rounded-full ${
                                    row.status === 'New' ? 'bg-[#D94F4F]' :
                                    row.status === 'Investigating' ? 'bg-[#D9B34F]' :
                                    'bg-[#887F7A]'
                                  }`} />
                                  {row.status}
                                </div>
                              </td>
                              <td className="p-4 sm:px-6 text-sm font-medium text-[#594A42]">{row.respondentId}</td>
                              <td className="p-4 sm:px-6 text-right">
                                {/* Actions like view/edit can go here */}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination footer */}
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5]">
                    <span className="text-sm text-[#594A42]/80 font-medium">
                      Showing {(respondentPage - 1) * respondentsPerPage + (sortedRespondents.length > 0 ? 1 : 0)} to {Math.min(respondentPage * respondentsPerPage, sortedRespondents.length)} of {sortedRespondents.length} entries
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setRespondentPage(Math.max(1, respondentPage - 1))}
                        disabled={respondentPage === 1}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${respondentPage === 1 ? 'bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed' : 'bg-[#E8E3D9] text-[#594A42] hover:bg-[#C5BDB6] cursor-pointer'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        // Very simple pagination display: show current, first, last, and +/- 1
                        if (page === 1 || page === totalPages || (page >= respondentPage - 1 && page <= respondentPage + 1)) {
                          return (
                            <button 
                              key={page}
                              onClick={() => setRespondentPage(page)}
                              className={`w-8 h-8 flex items-center justify-center rounded font-semibold transition-colors cursor-pointer ${
                                respondentPage === page 
                                  ? 'bg-[#594A42] text-white' 
                                  : 'hover:bg-[#E8E3D9] text-[#594A42]'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === respondentPage - 2 || page === respondentPage + 2) {
                          return <span key={page} className="w-8 h-8 flex items-center justify-center text-[#594A42]">...</span>;
                        }
                        return null;
                      })}

                      <button 
                        onClick={() => setRespondentPage(Math.min(totalPages, respondentPage + 1))}
                        disabled={respondentPage === totalPages}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${respondentPage === totalPages ? 'bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed' : 'bg-[#E8E3D9] text-[#594A42] hover:bg-[#C5BDB6] cursor-pointer'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'reports' && (
              <div className="flex-1 w-full max-w-[1400px] mx-auto p-6 sm:p-8 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#332A25]">System Reports</h1>
                  <p className="text-[#594A42]/80 text-sm sm:text-base font-medium">Monitor and manage participant-reported issues and technical feedback.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Open Issues</span>
                      <div className="w-8 h-8 rounded-full bg-[#D94F4F]/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-white fill-[#D94F4F]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">0</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">--</span>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Resolved</span>
                      <div className="w-8 h-8 rounded-full bg-[#91815A]/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[#332A25] fill-[#D9B34F]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">0</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">--</span>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#594A42] tracking-wider uppercase">Avg Resolution Time</span>
                      <div className="w-8 h-8 rounded-full bg-[#E8E3D9] flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white fill-[#887F7A]" />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-[#332A25]">0h</span>
                      <span className="text-sm font-semibold text-[#594A42]/70 flex items-center pb-1">--</span>
                    </div>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] overflow-hidden flex flex-col shadow-sm w-full">
                  {/* Table Header */}
                  <div className="p-5 sm:p-6 border-b border-[#E8E3D9] flex items-center justify-between">
                    <div className="font-bold text-[#332A25]">
                      Recent Reports
                    </div>
                    <div className="flex items-center gap-4 text-[#594A42]">
                      <Filter className="w-5 h-5 cursor-pointer hover:text-[#332A25] transition-colors" />
                      <MoreVertical className="w-5 h-5 cursor-pointer hover:text-[#332A25] transition-colors" />
                    </div>
                  </div>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#F4F0E6] text-xs uppercase tracking-wider text-[#594A42]">
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Report ID</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Date</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Category</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Status</th>
                          <th className="p-4 sm:px-6 font-semibold whitespace-nowrap">Respondent ID</th>
                          <th className="p-4 sm:px-6 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-sm font-medium text-[#594A42]/60">
                            No reports found.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination footer */}
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5]">
                    <span className="text-sm text-[#594A42]/80 font-medium">Showing {dbReports.length > 0 ? 1 : 0} to {dbReports.length} of {dbReports.length} entries</span>
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                      <button className="w-8 h-8 flex items-center justify-center rounded bg-[#E8E3D9]/50 text-[#594A42]/50 cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#E8E3D9] flex justify-between items-center">
                <h3 className="font-serif text-2xl font-bold tracking-wide text-[#332A25]">MENU</h3>
                <button onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity cursor-pointer">
                  <X className="w-6 h-6 text-[#594A42]" />
                </button>
              </div>
              <div className="flex flex-col py-4">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full px-8 py-5 flex items-center gap-4 text-[#594A42] hover:bg-[#F4F0E6] transition-colors text-left cursor-pointer"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span className="font-bold text-sm tracking-widest uppercase">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAdminModalOpen(true);
                  }}
                  className="w-full px-8 py-5 flex items-center gap-4 text-[#594A42] hover:bg-[#F4F0E6] transition-colors text-left cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-widest uppercase">Admin Login</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }} 
              className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-sm relative z-10 shadow-2xl flex flex-col items-center"
            >
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="absolute top-6 right-6 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <X className="w-5 h-5 text-[#594A42]" />
              </button>
              
              <div className="w-12 h-12 bg-[#F4F0E6] rounded-full flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[#594A42]" />
              </div>
              <h3 className="font-serif text-2xl font-bold tracking-wide text-[#332A25] mb-2 uppercase">
                Admin Access
              </h3>
              <p className="text-xs text-[#594A42]/70 text-center mb-8 font-medium">
                Please enter your credentials to access the admin dashboard.
              </p>
              
              <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                const success = await fetchAdminData(adminInputUsername, adminInputPassword);
                if (success) {
                  setIsAdminModalOpen(false);
                  setCurrentScreen('adminDashboard');
                }
              }}>
                {adminLoginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center font-bold">
                    {adminLoginError}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold tracking-wider text-[#594A42]/70 uppercase">
                    Username
                  </label>
                  <input 
                    type="text" 
                    value={adminInputUsername}
                    onChange={(e) => setAdminInputUsername(e.target.value)}
                    placeholder="Enter username" 
                    className="w-full px-5 py-3.5 bg-[#F4F0E6] rounded-xl text-sm outline-none border border-transparent focus:border-[#594A42] transition-colors placeholder:text-[#594A42]/40 text-[#594A42] font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold tracking-wider text-[#594A42]/70 uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showAdminPassword ? 'text' : 'password'} 
                      value={adminInputPassword}
                      onChange={(e) => setAdminInputPassword(e.target.value)}
                      placeholder="Enter password" 
                      className="w-full px-5 py-3.5 pr-12 bg-[#F4F0E6] rounded-xl text-sm outline-none border border-transparent focus:border-[#594A42] transition-colors placeholder:text-[#594A42]/40 text-[#594A42] font-semibold"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowAdminPassword(prev => !prev)}
                      aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showAdminPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#594A42]/50 hover:text-[#594A42] transition-colors cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isAdminLoading}
                  className="w-full py-4 mt-2 rounded-xl bg-[#594A42] text-white text-xs font-bold tracking-[0.1em] hover:bg-[#4A3C34] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isAdminLoading ? 'AUTHENTICATING...' : 'LOG IN'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
