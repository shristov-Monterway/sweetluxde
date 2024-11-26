import { CartType } from "./CartType";

export interface UserType {
    uid: string;
    email: string;
    stripeId: string;
    stripeLink: string;
    locale: string;
    theme: string;
    currency: string;
    invitedBy: string | null;
    lastLogin: number;
    cart: CartType;
}