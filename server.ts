import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleAITutorRequest } from './src/server/aiTutorHandler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// API route for AI Physics Tutor
app.post('/api/ai-tutor', async (req, res) => {
  try {
    const result = await handleAITutorRequest(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Server error in /api/ai-tutor:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Serve static assets from dist
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Catch-all route to serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Physics Lab 10 server listening on port ${PORT}`);
});
