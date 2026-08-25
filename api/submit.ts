import { buildSubmissionRecord, calculateScore, createEvaluationToken, saveSubmission, sendJson } from './_lib';
import { parseSubmitPayload } from './_validation';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const parsed = parseSubmitPayload(req.body || {});
    if (parsed.ok === false) {
      return sendJson(res, 400, { error: parsed.error });
    }

    const calculated = calculateScore(parsed.data);
    const record = buildSubmissionRecord(parsed.data, calculated);
    const saved = await saveSubmission(record);
    const evaluation_token = createEvaluationToken(saved.response_id);

    return sendJson(res, 200, {
      response_id: saved.response_id,
      evaluation_token,
      submitted_at: saved.submitted_at,
      result_percent: saved.result_percent,
      result_label: saved.result_label,
      suggestion: saved.suggestion,
      raw_physical_score: saved.raw_physical_score,
      raw_cognitive_score: saved.raw_cognitive_score,
      raw_total_score: saved.raw_total_score,
    });
  } catch (error) {
    console.error('Submit failed:', error);
    return sendJson(res, 500, { error: 'Submission failed' });
  }
}
