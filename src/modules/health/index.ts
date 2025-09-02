import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import healthRouter from './controllers/health.controller';

const router: ExpressRouter = Router();

router.use('/', healthRouter);

export default router;
