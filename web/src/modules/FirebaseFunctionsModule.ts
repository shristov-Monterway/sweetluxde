import { RequestType } from '../../../types/api/RequestType';
import { ResponseType } from '../../../types/api/ResponseType';
import { httpsCallable } from '@firebase/functions';
import FirebaseFunctions from '../services/Firebase/FirebaseFunctions';

export interface FirebaseFunctionsModuleType<T, S> {
  call: (path: string, data: T, locale: string, currency: string) => Promise<S>;
}

const FirebaseFunctionsModule = <T, S>(): FirebaseFunctionsModuleType<T, S> => {
  return {
    call: async (path, data, locale, currency) => {
      const request: RequestType<T> = {
        locale: locale,
        currency,
        data: data,
      };
      const callable = httpsCallable(FirebaseFunctions, `app${path}`);
      const response = (await callable(request)) as ResponseType<S>;
      return response.data;
    },
  };
};

export default FirebaseFunctionsModule;
