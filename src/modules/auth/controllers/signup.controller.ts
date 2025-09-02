import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { emailSignupService, googleSignupService, mobileSignupService } from '../services';
import { emailSignupSchema } from '../dto/signup.dto';

const router: ExpressRouter = Router();

router.post('/email', async (req, res) => {
  try {
    const data = emailSignupSchema.parse(req.body);
    const response = await emailSignupService(data);
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

router.post('/mobile', async (_, res) => {
  try {
    const response = await mobileSignupService();
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

router.post('/google', async (_, res) => {
  try {
    const response = await googleSignupService();
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

export default router;
