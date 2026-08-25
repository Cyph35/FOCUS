import { getAdminCredentials, isAdminAuthorized, sendJson } from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const credentials = getAdminCredentials();
  if (!credentials) {
    return sendJson(res, 503, { ok: false, error: 'Admin credentials are not configured' });
  }

  const body = req.body || {};
  const username = String(body.username || '').trim();
  const password = String(body.password || '').trim();

  if (!isAdminAuthorized({ headers: { 'x-admin-username': username, 'x-admin-password': password } })) {
    return sendJson(res, 403, { ok: false, error: 'Incorrect credentials' });
  }

  return sendJson(res, 200, { ok: true });
}
