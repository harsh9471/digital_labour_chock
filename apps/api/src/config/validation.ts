import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  API_PORT: Joi.number().default(3001),
  API_HOST: Joi.string().default('0.0.0.0'),
  API_PREFIX: Joi.string().default('api/v1'),

  DATABASE_URL: Joi.string().required(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(''),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  OTP_EXPIRY_MINUTES: Joi.number().default(10),
  OTP_MAX_ATTEMPTS: Joi.number().default(3),

  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),

  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
});
