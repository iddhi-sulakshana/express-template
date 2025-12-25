import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { validateUserService } from '../services';
import { authorize } from '@/middlewares';
import type { AuthRequest } from '@/types';

const router: ExpressRouter = Router();

router.get('/', authorize(), async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const response = await validateUserService(userId);
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

export default router;
