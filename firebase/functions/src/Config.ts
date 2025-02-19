import { ConfigType } from '../../../types/internal/ConfigType';

const Config: ConfigType = {
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'BGN', 'AED', 'CAD', 'ANG'],
  stripeSecretKey:
    'sk_test_51NIyYzLadHO4qOyFcedEE9H3nKPkgQMi2KmW74Uj3VO6BxX7jLwKYpP2rRKztslkfHptWNXhJywz03eN2fR3iILb00KvJ9Z2Au',
  stripeWebhookSecretKey:
    'whsec_b7176a49daa031aa728f43b60c8af76f85022c7ef313f1e0492b0f8e17c3372f',
  authenticationMethods: ['google', 'email', 'phone'],
  attributesToFilter: ['size'],
  headerHeight: 90,
  hasInvitations: true,
  hasRequiredInvitation: true,
};

export default Config;
