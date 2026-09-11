import submitHandler from '../api/submit';
import evaluateHandler from '../api/evaluate';
import verifyHandler from '../api/admin/verify';
import submissionsHandler from '../api/admin/submissions';
import { ADVISER_GRADE, createEvaluationToken, verifyEvaluationToken } from '../api/_lib';
import { GRADE_LEVELS, parseSubmitPayload, parseEvaluationPayload } from '../api/_validation';

process.env.ADMIN_USERNAME = 'verify-admin';
process.env.ADMIN_PASSWORD = 'verify-password-not-for-production';
process.env.ENGINEERING_ADMIN_USERNAME = 'verify-engineering-admin';
process.env.ENGINEERING_ADMIN_PASSWORD = 'verify-engineering-password';
process.env.MEDICAL_ADMIN_USERNAME = 'verify-medical-admin';
process.env.MEDICAL_ADMIN_PASSWORD = 'verify-medical-password';
process.env.STEM_ADMIN_USERNAME = 'verify-stem-admin';
process.env.STEM_ADMIN_PASSWORD = 'verify-stem-password';
process.env.ABM_ADMIN_USERNAME = 'verify-abm-admin';
process.env.ABM_ADMIN_PASSWORD = 'verify-abm-password';
process.env.EVALUATION_TOKEN_SECRET = 'verify-evaluation-token-secret-32chars';

type MockRes = {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
  setHeader: (key: string, value: string) => void;
  end: (payload?: string) => void;
};

function createRes(): MockRes {
  const res: MockRes = {
    statusCode: 0,
    body: '',
    headers: {},
    setHeader(key, value) {
      res.headers[key] = value;
    },
    end(payload = '') {
      res.body = payload;
    },
  };
  return res;
}

async function call(handler: (req: any, res: any) => Promise<any>, req: Record<string, unknown>) {
  const res = createRes();
  await handler(req, res);
  return { statusCode: res.statusCode, json: res.body ? JSON.parse(res.body) : null };
}

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const validSubmit = {
  consent_given: true,
  age_bracket: '17-18',
  sex: 'Female',
  grade_level: '11 Academic-Engineering',
  pf1: 2,
  pf2: 2,
  pf3: 2,
  pf4: 2,
  pf5: 2,
  cf1: 2,
  cf2: 2,
  cf3: 2,
  cf4: 2,
  cf5: 2,
  sleep_duration: '7–8 hours',
  study_break_frequency: 'Sometimes',
  pre_bed_screen_time: '30m–1h',
};

const parsedSubmit = parseSubmitPayload(validSubmit);
assert(parsedSubmit.ok, 'Expected valid submit payload to parse');
if (parsedSubmit.ok) {
  assert(parsedSubmit.data.student_name === null, 'Expected missing student_name to default to null');
}

const parsedWithName = parseSubmitPayload({ ...validSubmit, student_name: '  Juan Dela Cruz  ' });
assert(parsedWithName.ok && parsedWithName.data.student_name === 'Juan Dela Cruz', 'Expected optional student_name to parse and trim');
const parsedWithBlankName = parseSubmitPayload({ ...validSubmit, student_name: '   ' });
assert(parsedWithBlankName.ok && parsedWithBlankName.data.student_name === null, 'Expected blank student_name to normalize to null');

const parsedEngineering = parseSubmitPayload({ ...validSubmit, grade_level: '11 Academic-Engineering' });
assert(parsedEngineering.ok, 'Expected 11 Academic-Engineering to parse');
const parsedMedical = parseSubmitPayload({ ...validSubmit, grade_level: '11 Academic-Medical' });
assert(parsedMedical.ok, 'Expected 11 Academic-Medical to parse');
const parsedStem = parseSubmitPayload({ ...validSubmit, grade_level: '12 Academic-STEM' });
assert(parsedStem.ok, 'Expected 12 Academic-STEM to parse');
const parsedAbm = parseSubmitPayload({ ...validSubmit, grade_level: '11 Academic-ABM' });
assert(parsedAbm.ok, 'Expected 11 Academic-ABM to parse');
const invalidStrand = parseSubmitPayload({ ...validSubmit, grade_level: '11 Academic' });
assert(!invalidStrand.ok, 'Expected unlisted grade_level to fail');
const removedGrade11 = parseSubmitPayload({ ...validSubmit, grade_level: 'Grade 11' });
assert(!removedGrade11.ok, 'Expected removed Grade 11 grade_level to fail');
const removedGrade12 = parseSubmitPayload({ ...validSubmit, grade_level: 'Grade 12' });
assert(!removedGrade12.ok, 'Expected removed Grade 12 grade_level to fail');

const invalidScore = parseSubmitPayload({ ...validSubmit, pf1: 9 });
assert(!invalidScore.ok, 'Expected out-of-range pf1 to fail');

// Regression: unevaluated submits must store NULLs, not phantom 5s.
const parsedNoEval = parseSubmitPayload(validSubmit);
assert(parsedNoEval.ok, 'Expected submit without eval keys to parse');
if (parsedNoEval.ok) {
  assert(
    parsedNoEval.data.f1 === null && parsedNoEval.data.f2 === null && parsedNoEval.data.u1 === null &&
    parsedNoEval.data.u2 === null && parsedNoEval.data.r1 === null && parsedNoEval.data.r2 === null,
    'Expected missing eval scores to normalize to null (not 5)'
  );
}

const parsedWithEval = parseSubmitPayload({ ...validSubmit, f1: 4, f2: 3, u1: 5, u2: 2, r1: 4, r2: 3 });
assert(
  parsedWithEval.ok && parsedWithEval.data.f1 === 4 && parsedWithEval.data.r2 === 3,
  'Expected explicit eval scores to be preserved'
);

const invalidEval = parseEvaluationPayload({ response_id: 'not-valid', f1: 1, f2: 1, u1: 1, u2: 1, r1: 1, r2: 1 });
assert(!invalidEval.ok, 'Expected invalid response_id to fail');

const token = createEvaluationToken('RSP-ABCDEF12');
assert(verifyEvaluationToken('RSP-ABCDEF12', token), 'Expected matching evaluation token to verify');
assert(!verifyEvaluationToken('RSP-ZZZZZZZZ', token), 'Expected mismatched response_id to fail token check');

const submitGet = await call(submitHandler, { method: 'GET', body: {} });
assert(submitGet.statusCode === 405, `Expected submit GET 405, got ${submitGet.statusCode}`);

const submitBad = await call(submitHandler, { method: 'POST', body: { consent_given: false } });
assert(submitBad.statusCode === 400, `Expected submit without consent 400, got ${submitBad.statusCode}`);

const evaluateUnauthorized = await call(evaluateHandler, {
  method: 'POST',
  headers: {},
  body: {
    response_id: 'RSP-ABCDEF12',
    f1: 5,
    f2: 5,
    u1: 5,
    u2: 5,
    r1: 5,
    r2: 5,
  },
});
assert(evaluateUnauthorized.statusCode === 401, `Expected evaluate without token 401, got ${evaluateUnauthorized.statusCode}`);

const verifyMissing = await call(verifyHandler, { method: 'POST', body: { username: 'wrong', password: 'wrong' } });
assert(verifyMissing.statusCode === 403, `Expected admin verify 403, got ${verifyMissing.statusCode}`);

// Adviser role resolution: each credential pair must map to the right role.
const verifyMain = await call(verifyHandler, { method: 'POST', body: { username: 'verify-admin', password: 'verify-password-not-for-production' } });
assert(verifyMain.statusCode === 200 && verifyMain.json?.role === 'main', `Expected main verify 200 + role main, got ${verifyMain.statusCode}`);
const verifyEngineering = await call(verifyHandler, { method: 'POST', body: { username: 'verify-engineering-admin', password: 'verify-engineering-password' } });
assert(verifyEngineering.statusCode === 200 && verifyEngineering.json?.role === 'engineering', `Expected engineering verify 200 + role engineering, got ${verifyEngineering.statusCode}`);
const verifyMedical = await call(verifyHandler, { method: 'POST', body: { username: 'verify-medical-admin', password: 'verify-medical-password' } });
assert(verifyMedical.statusCode === 200 && verifyMedical.json?.role === 'medical', `Expected medical verify 200 + role medical, got ${verifyMedical.statusCode}`);
const verifyStem = await call(verifyHandler, { method: 'POST', body: { username: 'verify-stem-admin', password: 'verify-stem-password' } });
assert(verifyStem.statusCode === 200 && verifyStem.json?.role === 'stem', `Expected stem verify 200 + role stem, got ${verifyStem.statusCode}`);
const verifyAbm = await call(verifyHandler, { method: 'POST', body: { username: 'verify-abm-admin', password: 'verify-abm-password' } });
assert(verifyAbm.statusCode === 200 && verifyAbm.json?.role === 'abm', `Expected abm verify 200 + role abm, got ${verifyAbm.statusCode}`);

// Adviser grade map must stay aligned with the API allow-list.
assert(
  ADVISER_GRADE.engineering === '11 Academic-Engineering' &&
  ADVISER_GRADE.medical === '11 Academic-Medical' &&
  ADVISER_GRADE.stem === '12 Academic-STEM' &&
  ADVISER_GRADE.abm === '11 Academic-ABM',
  'Expected ADVISER_GRADE to map engineering/medical/stem/abm to their strand values'
);
assert(
  GRADE_LEVELS.length === 4 &&
  GRADE_LEVELS.includes(ADVISER_GRADE.engineering) &&
  GRADE_LEVELS.includes(ADVISER_GRADE.medical) &&
  GRADE_LEVELS.includes(ADVISER_GRADE.stem) &&
  GRADE_LEVELS.includes(ADVISER_GRADE.abm),
  'Expected ADVISER_GRADE values to match GRADE_LEVELS allow-list'
);

const submissionsUnauthorized = await call(submissionsHandler, { method: 'GET', headers: {} });
assert(submissionsUnauthorized.statusCode === 401, `Expected admin submissions 401, got ${submissionsUnauthorized.statusCode}`);

console.log('API hardening smoke tests passed.');
