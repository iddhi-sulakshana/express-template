import { rateLimit } from 'express-rate-limit';

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // 1000 requests per 15 minutes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
  skip: (req) => {
    // Skip rate limiting for swagger.json endpoint
    return req.path === '/swagger.json' || req.path === '/swagger' || req.path === '/scalar';
  },
});
