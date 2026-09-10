import { getAllSubmissions, isAdminAuthorized, logSystemError, resolveAdminRole, sendJson } from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return sendJson(res, 401, { error: 'Incorrect credentials' });
  }

  try {
    const roleResult = resolveAdminRole(req.headers?.['x-admin-username'], req.headers?.['x-admin-password']);
    const submissions = await getAllSubmissions(roleResult?.grade ?? undefined);
    return sendJson(res, 200, submissions);
  } catch (error) {
    console.error('Failed to read submissions:', error);
    await logSystemError('admin.submissions', error);
    const message = error instanceof Error ? error.message : String(error);
    return sendJson(res, 500, { error: 'Failed to read submissions', details: message });
  }
}
