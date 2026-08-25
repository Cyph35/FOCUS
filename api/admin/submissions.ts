import { getAllSubmissions, isAdminAuthorized, sendJson } from '../_lib';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return sendJson(res, 401, { error: 'Incorrect credentials' });
  }

  try {
    const submissions = await getAllSubmissions();
    return sendJson(res, 200, submissions);
  } catch (error) {
    console.error('Failed to read submissions:', error);
    const message = error instanceof Error ? error.message : String(error);
    return sendJson(res, 500, { error: 'Failed to read submissions', details: message });
  }
}
