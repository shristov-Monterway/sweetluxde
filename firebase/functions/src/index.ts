import * as admin from 'firebase-admin';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import AuthenticationHandler from './handlers/AuthenticationHandler';
import RequestTransformationHandler from './handlers/RequestTransformationHandler';
import CartRoutes from './routes/CartRoutes';
import PaymentRoutes from './routes/PaymentRoutes';
import ProductRoutes from './routes/ProductRoutes';
import WishlistRoutes from './routes/WishlistRoutes';
import { CloudFunctionTriggers } from './types/CloudFunctionTriggers';
import CartTriggers from './triggers/CartTriggers';
import PaymentTriggers from './triggers/PaymentTriggers';
import ProductTriggers from './triggers/ProductTriggers';
import WishlistTriggers from './triggers/WishlistTriggers';
import { CloudFunctionSchedules } from './types/CloudFunctionSchedules';
import CartSchedules from './schedules/CartSchedules';
import PaymentSchedules from './schedules/PaymentSchedules';
import ProductSchedules from './schedules/ProductSchedules';
import WishlistSchedules from './schedules/WishlistSchedules';

admin.initializeApp();

const app = express();
const appCors = cors({ origin: true });
const appCookieParser = cookieParser();

app.use(appCors);
app.use(appCookieParser);

app.use(AuthenticationHandler.setUserInRequest);
app.use(RequestTransformationHandler.transformRequestBody);

app.use('/cart', CartRoutes);
app.use('/payment', PaymentRoutes);
app.use('/product', ProductRoutes);
app.use('/wishlist', WishlistRoutes);

exports.app = functions.https.onRequest(
  {
    region: 'europe-west3',
  },
  app
);

const triggers: CloudFunctionTriggers = {
  ...CartTriggers,
  ...PaymentTriggers,
  ...ProductTriggers,
  ...WishlistTriggers,
};

Object.keys(triggers).forEach((name) => {
  exports[`trigger_${name}`] = triggers[name];
});

const schedules: CloudFunctionSchedules = {
  ...CartSchedules,
  ...PaymentSchedules,
  ...ProductSchedules,
  ...WishlistSchedules,
};

Object.keys(schedules).forEach((name) => {
  exports[`schedule_${name}`] = schedules[name];
});
