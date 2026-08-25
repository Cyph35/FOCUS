import { isAdminAuthorized, sendJson } from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return sendJson(res, 401, { error: 'Incorrect credentials' });
  }

  return sendJson(res, 200, []);
}
