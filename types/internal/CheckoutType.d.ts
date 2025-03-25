import {AddressType} from "./AddressType";

export interface CheckoutLineItemType {
  productUid: string;
  productName: string;
  productDescription: string;
  variationUid: string;
  variationName: string;
  variationDescription: string;
  price: number;
  currency: string;
  attributes: {
    [uid: string]: {
      name: string;
      optionUid: string;
      optionName: string;
    };
  };
  image: string | null;
  quantity: number;
}

export interface CheckoutType {
  uid: string;
  userUid: string;
  userEmail: string;
  lineItems: CheckoutLineItemType[];
  currency: string;
  locale: string;
  successUrl: string;
  status: "waiting" | "done";
  url: string;
  address: AddressType;
}
