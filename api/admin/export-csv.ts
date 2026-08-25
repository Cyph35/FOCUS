import { getAllSubmissions, isAdminAuthorized, sendCsv, sendJson } from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return sendJson(res, 401, { error: 'Incorrect credentials' });
  }

  try {
    const submissions = await getAllSubmissions();

    if (!submissions.length) {
      return sendJson(res, 404, { error: 'No data to export' });
    }

    const headers = Object.keys(submissions[0]);
    const csvRows = [headers.join(',')];

    for (const row of submissions) {
      const rowValues = headers.map((header) => {
        let value = (row as any)[header];
        if (value === null || value === undefined) value = '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(rowValues.join(','));
    }

    return sendCsv(res, 200, csvRows.join('\n'));
  } catch (error) {
    console.error('CSV export failed:', error);
    return sendJson(res, 500, { error: 'Export failed' });
  }
}
