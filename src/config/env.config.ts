import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('env', () => ({
  openaiApiKey: process.env.OPENAI_API_KEY,
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  databaseUrl: process.env.DATABASE_URL,
}));

export const envValidationSchema = Joi.object({
  OPENAI_API_KEY: Joi.string().required(),
  FIREBASE_API_KEY: Joi.string().required(),
  FIREBASE_AUTH_DOMAIN: Joi.string().required(),
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_STORAGE_BUCKET: Joi.string().required(),
  FIREBASE_MESSAGING_SENDER_ID: Joi.string().required(),
  FIREBASE_APP_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
}); 