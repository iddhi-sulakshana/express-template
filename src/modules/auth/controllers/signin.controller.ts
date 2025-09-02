import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { emailSigninService, googleSigninService, mobileSigninService } from '../services';
import { emailSigninSchema } from '../dto/signin.dto';

const router: ExpressRouter = Router();

router.post('/email', async (req, res) => {
  try {
    const data = await emailSigninSchema.parseAsync(req.body);
    const response = await emailSigninService(data);
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

router.post('/mobile', async (_, res) => {
  try {
    const response = await mobileSigninService();
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

router.post('/google', async (_, res) => {
  try {
    const response = await googleSigninService();
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

export default router;
