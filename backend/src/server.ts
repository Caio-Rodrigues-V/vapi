import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import { env } from './config/env.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDirCandidates = [
  path.resolve(process.cwd(), 'dist'),
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../../dist')
];
const staticDir = staticDirCandidates.find((candidate) => fs.existsSync(path.join(candidate, 'index.html')));

if (staticDir) {
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    return res.sendFile(path.join(staticDir, 'index.html'));
  });
}

app.listen(env.port, () => {
  console.log(`[backend] running on http://localhost:${env.port}`);
});
