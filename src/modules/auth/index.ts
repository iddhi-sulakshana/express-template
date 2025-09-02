import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import signinRouter from './controllers/signin.controller';
import signupRouter from './controllers/signup.controller';
import tokenRouter from './controllers/token.controller';
import validateRouter from './controllers/validate.controller';

const router: ExpressRouter = Router();

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);
router.use('/token', tokenRouter);
router.use('/validate', validateRouter);

export default router;
