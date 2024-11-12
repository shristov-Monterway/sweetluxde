import { UserType } from '../../../../types/internal/UserType';

declare global {
  namespace Express {
    export interface Request {
      user: UserType | null;
      locale: string;
      defaultCurrency: string;
    }
  }
}
