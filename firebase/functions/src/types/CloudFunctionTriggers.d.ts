import { CloudFunction } from 'firebase-functions';

export interface CloudFunctionTriggers {
  [name: string]: CloudFunction<any>;
}
