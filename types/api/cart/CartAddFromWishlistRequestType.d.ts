export interface CartAddFromWishlistRequestType {
  product: string;
  variation: string;
  attributes: {
    [uid: string]: string;
  };
}
