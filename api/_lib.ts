import 'dotenv/config';
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { SubmitPayload } from './_validation.js';

export interface SubmissionRecord {
  response_id: string;
  submitted_at: string;
  consent_given: boolean;
  age_bracket: string;
  sex: string;
  grade_level: string;
  pf1: number;
  pf2: number;
  pf3: number;
  pf4: number;
  pf5: number;
  cf1: number;
  cf2: number;
  cf3: number;
  cf4: number;
  cf5: number;
  sleep_duration: string;
  study_break_frequency: string;
  pre_bed_screen_time: string;
  f1: number;
  f2: number;
  u1: number;
  u2: number;
  r1: number;
  r2: number;
  raw_physical_score: number;
  raw_cognitive_score: number;
  raw_total_score: number;
  result_percent: number;
  result_label: string;
  suggestion: string;
}

const EVALUATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function readEnv(name: string): string {
  return (process.env[name] || '').trim();
}

export function getAdminCredentials(): { username: string; password: string } | null {
  const username = readEnv('ADMIN_USERNAME');
  const password = readEnv('ADMIN_PASSWORD');
  if (!username || !password) {
    return null;
  }
  return { username, password };
}

function getEvaluationTokenSecret(): string | null {
  const secret = readEnv('EVALUATION_TOKEN_SECRET');
  return secret || null;
}

const supabaseUrl = readEnv('SUPABASE_URL');
const supabaseKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function safeEqual(left: string, right: string): boolean {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function calculateScore(body: Pick<SubmitPayload, 'pf1' | 'pf2' | 'pf3' | 'pf4' | 'pf5' | 'cf1' | 'cf2' | 'cf3' | 'cf4' | 'cf5'>) {
  const pf = [body.pf1, body.pf2, body.pf3, body.pf4, body.pf5];
  const cf = [body.cf1, body.cf2, body.cf3, body.cf4, body.cf5];

  const raw_physical_score = pf.reduce((a, b) => a + b, 0);
  const raw_cognitive_score = cf.reduce((a, b) => a + b, 0);
  const raw_total_score = raw_physical_score + raw_cognitive_score;

  const result_percent = Math.max(0, Math.min(100, Math.round(100 - ((raw_total_score - 10) / 30) * 100)));

  let result_label = 'Exhausted';
  let suggestion = "Stop and rest. Take a substantial break, hydrate, and prioritize a good night's sleep. If this level happens frequently, consider talking to a parent/guardian, school counselor, or healthcare professional.";

  if (result_percent >= 80) {
    result_label = 'Energized';
    suggestion = 'Keep it up! Stay hydrated, maintain your sleep routine, and continue taking short study breaks.';
  } else if (result_percent >= 60) {
    result_label = 'Fresh';
    suggestion = "You're doing well! Keep a regular sleep schedule and take short breaks while studying.";
  } else if (result_percent >= 40) {
    result_label = 'Mildly Fatigued';
    suggestion = 'Take a short break. Drink some water, stretch, and give yourself time to rest before continuing.';
  } else if (result_percent >= 20) {
    result_label = 'Fatigued';
    suggestion = 'Prioritize rest. Take a longer break, reduce unnecessary screen time, and try to get enough sleep tonight.';
  }

  return { raw_physical_score, raw_cognitive_score, raw_total_score, result_percent, result_label, suggestion };
}

export function isAdminAuthorized(req: { headers?: Record<string, unknown> }) {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return false;
  }

  const username = String(req.headers?.['x-admin-username'] || '').trim();
  const password = String(req.headers?.['x-admin-password'] || '').trim();
  return safeEqual(username, credentials.username) && safeEqual(password, credentials.password);
}

export function sendJson(res: any, statusCode: number, payload: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export function sendCsv(res: any, statusCode: number, csv: string, filename = 'focus_assessment_results.csv') {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.end(csv);
}

export async function getAllSubmissions(): Promise<SubmissionRecord[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error || !data) {
    throw error ?? new Error('Failed to read submissions');
  }

  return data as SubmissionRecord[];
}

export async function saveSubmission(record: SubmissionRecord): Promise<SubmissionRecord> {
  if (!supabase) {
    throw new Error('Supabase service role key is missing');
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert(record)
    .select('*')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to insert submission');
  }

  return data as SubmissionRecord;
}

export async function saveEvaluation(
  responseId: string,
  patch: Pick<SubmissionRecord, 'f1' | 'f2' | 'u1' | 'u2' | 'r1' | 'r2'>
) {
  if (!supabase) {
    throw new Error('Supabase service role key is missing');
  }

  const { data, error } = await supabase
    .from('submissions')
    .update(patch)
    .eq('response_id', responseId)
    .select('response_id')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Submission not found');
  }
}

export function createEvaluationToken(responseId: string): string {
  const secret = getEvaluationTokenSecret();
  if (!secret) {
    throw new Error('EVALUATION_TOKEN_SECRET is not configured');
  }

  const expiresAt = Date.now() + EVALUATION_TOKEN_TTL_MS;
  const payload = `${responseId}.${expiresAt}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifyEvaluationToken(responseId: string, token: string): boolean {
  const secret = getEvaluationTokenSecret();
  if (!secret || !token) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  const [tokenResponseId, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!tokenResponseId || !signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  if (!safeEqual(tokenResponseId, responseId)) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(`${tokenResponseId}.${expiresAtRaw}`).digest('hex');
  return safeEqual(signature, expected);
}

export function buildSubmissionRecord(body: SubmitPayload, calculated: ReturnType<typeof calculateScore>): SubmissionRecord {
  return {
    response_id: `RSP-${cryptoRandomId()}`,
    submitted_at: new Date().toISOString(),
    consent_given: true,
    age_bracket: body.age_bracket,
    sex: body.sex,
    grade_level: body.grade_level,
    pf1: body.pf1,
    pf2: body.pf2,
    pf3: body.pf3,
    pf4: body.pf4,
    pf5: body.pf5,
    cf1: body.cf1,
    cf2: body.cf2,
    cf3: body.cf3,
    cf4: body.cf4,
    cf5: body.cf5,
    sleep_duration: body.sleep_duration,
    study_break_frequency: body.study_break_frequency,
    pre_bed_screen_time: body.pre_bed_screen_time,
    f1: body.f1,
    f2: body.f2,
    u1: body.u1,
    u2: body.u2,
    r1: body.r1,
    r2: body.r2,
    raw_physical_score: calculated.raw_physical_score,
    raw_cognitive_score: calculated.raw_cognitive_score,
    raw_total_score: calculated.raw_total_score,
    result_percent: calculated.result_percent,
    result_label: calculated.result_label,
    suggestion: calculated.suggestion,
  };
}

function cryptoRandomId() {
  return randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
}
