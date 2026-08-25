import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import evaluateHandler from './api/evaluate';
import submitHandler from './api/submit';
import verifyHandler from './api/admin/verify';
import submissionsHandler from './api/admin/submissions';
import reportsHandler from './api/admin/reports';
import exportCsvHandler from './api/admin/export-csv';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '32kb' }));

app.post('/api/admin/verify', (req, res) => {
  void verifyHandler(req, res);
});

app.post('/api/submit', (req, res) => {
  void submitHandler(req, res);
});

app.post('/api/evaluate', (req, res) => {
  void evaluateHandler(req, res);
});

app.get('/api/admin/submissions', (req, res) => {
  void submissionsHandler(req, res);
});

app.get('/api/admin/reports', (req, res) => {
  void reportsHandler(req, res);
});

app.get('/api/admin/export-csv', (req, res) => {
  void exportCsvHandler(req, res);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
