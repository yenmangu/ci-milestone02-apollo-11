import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/route.js';
const app = express();

app.use(cors());
app.use('/api', apiRouter);

export default app;
