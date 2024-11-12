import * as express from 'express';

export interface RequestTransformationHandlerType {
  transformRequestBody: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => void;
}

const RequestTransformationHandler: RequestTransformationHandlerType = {
  transformRequestBody: (req, res, next) => {
    if (
      typeof req.body !== 'undefined' &&
      typeof req.body.data !== 'undefined'
    ) {
      if (typeof req.body.data.locale !== 'undefined') {
        req.locale = req.body.data.locale;
      }
      if (typeof req.body.data.data !== 'undefined') {
        req.body = req.body.data.data;
      }
    }
    next();
  },
};

export default RequestTransformationHandler;
