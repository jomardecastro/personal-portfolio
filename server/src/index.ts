import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mlmRoutes from './routes/mlm';
import contactRoutes from './routes/contact';
import posRoutes from './routes/pos';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/mlm', mlmRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/pos', posRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
