import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'sync-demo-dataset-plugin',
        configureServer(server) {
          server.middlewares.use('/api/sync-demo-dataset', (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const records = JSON.parse(body);
                  if (Array.isArray(records) && records.length > 0) {
                    const sampleHistoryPath = path.resolve(__dirname, 'src/data/sampleHistory.ts');
                    const jsonPath = path.resolve(__dirname, 'src/data/sampleHistory.json');
                    
                    fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf-8');
                    
                    const tsContent = `import { IndicatorRecord } from '../types';\n\nexport const INITIAL_SAMPLE_RECORDS: IndicatorRecord[] = ${JSON.stringify(records, null, 2)};\n`;
                    fs.writeFileSync(sampleHistoryPath, tsContent, 'utf-8');
                    
                    console.log(`[SyncDemo] Successfully saved ${records.length} demo records to sampleHistory.ts`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, count: records.length }));
                    return;
                  }
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Invalid records array' }));
                } catch (err: any) {
                  console.error('[SyncDemo] Error saving demo records:', err);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
            } else if (req.method === 'GET') {
              try {
                const jsonPath = path.resolve(__dirname, 'src/data/sampleHistory.json');
                if (fs.existsSync(jsonPath)) {
                  const data = fs.readFileSync(jsonPath, 'utf-8');
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(data);
                  return;
                }
              } catch {}
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'No demo records file found' }));
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Method not allowed' }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
