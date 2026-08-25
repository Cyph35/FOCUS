import { saveEvaluation, sendJson, verifyEvaluationToken } from './_lib.js';
import { parseEvaluationPayload, parseEvaluationToken } from './_validation.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const parsed = parseEvaluationPayload(req.body || {});
    if (parsed.ok === false) {
      return sendJson(res, 400, { error: parsed.error });
    }

    const token = parseEvaluationToken(req.body || {}, req.headers || {});
    if (!verifyEvaluationToken(parsed.data.response_id, token)) {
      return sendJson(res, 401, { error: 'Unauthorized evaluation update' });
    }

    await saveEvaluation(parsed.data.response_id, parsed.data.patch);
    return sendJson(res, 200, { ok: true, message: 'Evaluation saved successfully' });
  } catch (error) {
    console.error('Evaluation failed:', error);
    if (error instanceof Error && error.message === 'Submission not found') {
      return sendJson(res, 404, { error: 'Submission not found' });
    }
    return sendJson(res, 500, { error: 'Evaluation failed' });
  }
}
