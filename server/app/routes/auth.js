const Joi = require('joi');
const RateLimit = require('express-rate-limit');
const router = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });
const authController = require('../controllers/auth-controller');
const am = require('../../utils/async-middleware');
const { authGuard } = require('../middlewares/auth-guard');
const { createUserError } = require('../../utils');
const logger = require('../../logger');

const rateLimiter = new RateLimit({
  windowMs: 1000 * 60 * 15, // 15 min window
  delayAfter: 3, // begin slowing down responses after the first request
  delayMs: 500, // slow down subsequent responses by 0.5 second per request
  max: 10, // start blocking after 10 requests
  message: 'Too many requests were made to auth related services from this IP, please try again in 20 minutes',
  onLimitReached: req => logger.warn(`[RATE LIMIT REACHED]: For request ${req.path} by ${req.ip}`),
});


// Use a rate limiter to prevent auth spamming
// Any abuse with login / reset / define password / email change
// will be prevented
router.use(rateLimiter);

router.post(
  '/login',
  validator.body(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    rememberMe: Joi.number().integer().min(1).max(30)
      .default(1),
  })),
  am(authController.login),
);

router.post(
  '/reset-password',
  validator.body(Joi.object({ email: Joi.string().email().required() })),
  am(authController.resetPassword),
);
router.put(
  '/reset-password',
  validator.body(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
      .error(createUserError(
        'WeakPassword',
        'Password must be at least 8 characters, with at least 1 uppercase, 1 lowercase and 1 digit',
      ))
      .required(),
    oldPassword: Joi.string(),
    passwordToken: Joi.string(),
  }).xor('oldPassword', 'passwordToken')),
  am(authController.definePassword),
);

router.post(
  '/email-verification',
  validator.body(Joi.object({
    userId: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    emailToken: Joi.string().required(),
  })),
  am(authController.emailVerify),
);

router.post(
  '/cancel-email-verification',
  validator.body(Joi.object({
    userId: Joi.number().integer().required(),
    email: Joi.string().email().required(),
  })),
  am(authController.cancelEmailVerify),
);

// AUTHENTICATION NEEDED
router.use(authGuard());

router.get(
  '/logout',
  am(authController.logout),
);

module.exports = router;
