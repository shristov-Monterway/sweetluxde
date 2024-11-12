import * as admin from 'firebase-admin';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import AuthenticationHandler from './handlers/AuthenticationHandler';
import RequestTransformationHandler from './handlers/RequestTransformationHandler';
import PaymentRoutes from './routes/PaymentRoutes';
import ProductRoutes from './routes/ProductRoutes';
import { CloudFunctionTriggers } from './types/CloudFunctionTriggers';
import PaymentTriggers from './triggers/PaymentTriggers';
import ProductTriggers from './triggers/ProductTriggers';
import { CloudFunctionSchedules } from './types/CloudFunctionSchedules';
import PaymentSchedules from './schedules/PaymentSchedules';
import ProductSchedules from './schedules/ProductSchedules';

admin.initializeApp();

const app = express();
const appCors = cors({ origin: true });
const appCookieParser = cookieParser();

app.use(appCors);
app.use(appCookieParser);

app.use(AuthenticationHandler.setUserInRequest);
app.use(RequestTransformationHandler.transformRequestBody);

app.use('/payment', PaymentRoutes);
app.use('/product', ProductRoutes);

exports.app = functions.https.onRequest(
  {
    region: 'europe-west3',
  },
  app
);

const triggers: CloudFunctionTriggers = {
  ...PaymentTriggers,
  ...ProductTriggers,
};

Object.keys(triggers).forEach((name) => {
  exports[`trigger_${name}`] = triggers[name];
});

const schedules: CloudFunctionSchedules = {
  ...PaymentSchedules,
  ...ProductSchedules,
};

Object.keys(schedules).forEach((name) => {
  exports[`schedule_${name}`] = schedules[name];
});
