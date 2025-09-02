import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { refreshTokenService } from '../services';
import { refreshTokenSchema } from '../dto/token.dto';

const router: ExpressRouter = Router();

router.post('/refresh', async (req, res) => {
  try {
    // get the token from the header
    const token = req.headers.authorization?.split(' ')[1];
    const data = await refreshTokenSchema.parseAsync({ refreshToken: token });
    const response = await refreshTokenService(data);
    res.sendResponse(response);
  } catch (error: any) {
    res.sendResponse(error);
  }
});

export default router;
