import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/route.js';
const app = express();

console.log('apiRouter: ', apiRouter);
app.use(cors());
app.use('/apollo', apiRouter);

export default app;
