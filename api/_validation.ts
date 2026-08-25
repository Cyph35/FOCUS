export const AGE_BRACKETS = ['15-16', '17-18', '19+'] as const;
export const SEX_OPTIONS = ['Male', 'Female', 'Prefer not to say'] as const;
export const GRADE_LEVELS = ['Grade 11', 'Grade 12'] as const;
export const SLEEP_DURATION_OPTIONS = [
  'Less than 5 hours',
  '5–6 hours',
  '6–7 hours',
  '7–8 hours',
  'More than 8 hours',
] as const;
export const STUDY_BREAK_OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] as const;
export const PRE_BED_SCREEN_OPTIONS = [
  'Less than 30 mins',
  '30m–1h',
  '1–2 hours',
  '2–3 hours',
  '3+ hours',
] as const;

export type SubmitPayload = {
  consent_given: true;
  age_bracket: (typeof AGE_BRACKETS)[number];
  sex: (typeof SEX_OPTIONS)[number];
  grade_level: (typeof GRADE_LEVELS)[number];
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
  sleep_duration: (typeof SLEEP_DURATION_OPTIONS)[number];
  study_break_frequency: (typeof STUDY_BREAK_OPTIONS)[number];
  pre_bed_screen_time: (typeof PRE_BED_SCREEN_OPTIONS)[number];
  f1: number;
  f2: number;
  u1: number;
  u2: number;
  r1: number;
  r2: number;
};

export type EvaluationPatch = {
  f1: number;
  f2: number;
  u1: number;
  u2: number;
  r1: number;
  r2: number;
};

export type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string };

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

function parseIntInRange(value: unknown, min: number, max: number): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value >= min && value <= max ? value : null;
  }
  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
  }
  return null;
}

function requireScale(
  body: Record<string, unknown>,
  key: string,
  min: number,
  max: number
): number | string {
  const parsed = parseIntInRange(body[key], min, max);
  if (parsed === null) {
    return `${key} must be an integer between ${min} and ${max}`;
  }
  return parsed;
}

export function parseSubmitPayload(body: unknown): ParseResult<SubmitPayload> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid payload.' };
  }

  const input = body as Record<string, unknown>;

  if (input.consent_given !== true) {
    return { ok: false, error: 'Consent must be given.' };
  }

  if (!isOneOf(input.age_bracket, AGE_BRACKETS)) {
    return { ok: false, error: 'Invalid age_bracket.' };
  }
  if (!isOneOf(input.sex, SEX_OPTIONS)) {
    return { ok: false, error: 'Invalid sex.' };
  }
  if (!isOneOf(input.grade_level, GRADE_LEVELS)) {
    return { ok: false, error: 'Invalid grade_level.' };
  }
  if (!isOneOf(input.sleep_duration, SLEEP_DURATION_OPTIONS)) {
    return { ok: false, error: 'Invalid sleep_duration.' };
  }
  if (!isOneOf(input.study_break_frequency, STUDY_BREAK_OPTIONS)) {
    return { ok: false, error: 'Invalid study_break_frequency.' };
  }
  if (!isOneOf(input.pre_bed_screen_time, PRE_BED_SCREEN_OPTIONS)) {
    return { ok: false, error: 'Invalid pre_bed_screen_time.' };
  }

  const pfKeys = ['pf1', 'pf2', 'pf3', 'pf4', 'pf5'] as const;
  const cfKeys = ['cf1', 'cf2', 'cf3', 'cf4', 'cf5'] as const;
  const evalKeys = ['f1', 'f2', 'u1', 'u2', 'r1', 'r2'] as const;

  const scales: Record<string, number> = {};
  for (const key of pfKeys) {
    const value = requireScale(input, key, 1, 4);
    if (typeof value === 'string') return { ok: false, error: value };
    scales[key] = value;
  }
  for (const key of cfKeys) {
    const value = requireScale(input, key, 1, 4);
    if (typeof value === 'string') return { ok: false, error: value };
    scales[key] = value;
  }
  for (const key of evalKeys) {
    const raw = input[key];
    if (raw === undefined || raw === null || raw === '') {
      scales[key] = 5;
      continue;
    }
    const value = requireScale(input, key, 1, 5);
    if (typeof value === 'string') return { ok: false, error: value };
    scales[key] = value;
  }

  return {
    ok: true,
    data: {
      consent_given: true,
      age_bracket: input.age_bracket,
      sex: input.sex,
      grade_level: input.grade_level,
      sleep_duration: input.sleep_duration,
      study_break_frequency: input.study_break_frequency,
      pre_bed_screen_time: input.pre_bed_screen_time,
      pf1: scales.pf1,
      pf2: scales.pf2,
      pf3: scales.pf3,
      pf4: scales.pf4,
      pf5: scales.pf5,
      cf1: scales.cf1,
      cf2: scales.cf2,
      cf3: scales.cf3,
      cf4: scales.cf4,
      cf5: scales.cf5,
      f1: scales.f1,
      f2: scales.f2,
      u1: scales.u1,
      u2: scales.u2,
      r1: scales.r1,
      r2: scales.r2,
    },
  };
}

const RESPONSE_ID_PATTERN = /^RSP-[A-Z0-9]{8}$/;

export function parseEvaluationPayload(body: unknown): ParseResult<{ response_id: string; patch: EvaluationPatch }> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Invalid payload.' };
  }

  const input = body as Record<string, unknown>;
  const responseId = typeof input.response_id === 'string' ? input.response_id.trim() : '';
  if (!RESPONSE_ID_PATTERN.test(responseId)) {
    return { ok: false, error: 'Invalid response_id.' };
  }

  const evalKeys = ['f1', 'f2', 'u1', 'u2', 'r1', 'r2'] as const;
  const patch = {} as EvaluationPatch;
  for (const key of evalKeys) {
    const value = requireScale(input, key, 1, 5);
    if (typeof value === 'string') return { ok: false, error: value };
    patch[key] = value;
  }

  return { ok: true, data: { response_id: responseId, patch } };
}

export function parseEvaluationToken(body: unknown, headers: Record<string, unknown>): string {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const token = (body as Record<string, unknown>).evaluation_token;
    if (typeof token === 'string' && token.trim()) {
      return token.trim();
    }
  }

  const headerToken = headers['x-evaluation-token'] ?? headers['X-Evaluation-Token'];
  return typeof headerToken === 'string' ? headerToken.trim() : '';
}
