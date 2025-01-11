import { CloudFunctionSchedules } from '../types/CloudFunctionSchedules';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import FirestoreModule from '../modules/FirestoreModule';
import { ProductType } from '../../../../types/internal/ProductType';
import FixtureModule from '../modules/FixtureModule';

const ProductSchedules: CloudFunctionSchedules = {};

ProductSchedules['productFixtureCreate'] = onSchedule(
  'every day 00:00',
  async () => {
    const product = FixtureModule().generateProduct();

    await FirestoreModule<ProductType>().writeDoc(
      'products',
      product.uid,
      product
    );
  }
);

export default ProductSchedules;
