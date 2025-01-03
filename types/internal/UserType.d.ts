import { CartType } from "./CartType";
import { WishListType } from "./WishListType";

export interface UserType {
    uid: string;
    email: string;
    locale: string;
    theme: string;
    currency: string;
    invitedBy: string | null;
    lastLogin: number;
    cart: CartType;
    wishlist: WishListType;
    isAdmin: boolean;
}