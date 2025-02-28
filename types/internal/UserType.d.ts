import { CartType } from "./CartType";
import { WishListType } from "./WishListType";
import { AddressType } from "./AddressType";

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
    addresses: AddressType[];
}