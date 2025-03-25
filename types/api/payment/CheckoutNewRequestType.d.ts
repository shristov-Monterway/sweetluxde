import {AddressType} from "../../internal/AddressType";

export interface CheckoutNewRequestType {
  lineItems: {
    product: string;
    variation: string;
    attributes: {
      [uid: string]: string;
    };
    quantity: number;
  }[];
  successUrl: string;
  address: AddressType;
}
