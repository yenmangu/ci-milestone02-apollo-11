import express from 'express';
import { apiRouter } from './routes/route.js';
const app = express();

app.use('/api', apiRouter);

export default app;
