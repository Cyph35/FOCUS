import { isAdminAuthorized, sendJson, getEvaluations, getSystemErrors, resolveAdminRole } from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return sendJson(res, 401, { error: 'Incorrect credentials' });
  }

  try {
    const roleResult = resolveAdminRole(req.headers?.['x-admin-username'], req.headers?.['x-admin-password']);
    const evaluations = await getEvaluations(roleResult?.grade ?? undefined);
    const systemErrors = await getSystemErrors();

    return sendJson(res, 200, {
      evaluations,
      system_errors: systemErrors,
    });
  } catch (error) {
    console.error('Failed to read reports:', error);
    const message = error instanceof Error ? error.message : String(error);
    return sendJson(res, 500, { error: 'Failed to read reports', details: message });
  }
}
