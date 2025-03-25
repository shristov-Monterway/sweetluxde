import { ScheduleFunction } from 'firebase-functions/v2/scheduler';

export interface CloudFunctionSchedules {
  [name: string]: ScheduleFunction;
}
