import { CloudFunctionTriggers } from '../types/CloudFunctionTriggers';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { CheckoutType } from '../../../../types/internal/CheckoutType';
import FirestoreModule from '../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';
import MailerModule, { MailerRecipientType } from '../modules/MailerModule';
import TemplateEngineModule from '../modules/TemplateEngineModule';

const PaymentTriggers: CloudFunctionTriggers = {};

PaymentTriggers['checkoutCompleted'] = onDocumentUpdated(
  'checkouts/{docId}',
  async (event) => {
    const beforeCheckout = <CheckoutType>event.data?.before.data();
    const afterCheckout = <CheckoutType>event.data?.after.data();

    if (
      beforeCheckout.status !== afterCheckout.status &&
      afterCheckout.status === 'done'
    ) {
      const user = await FirestoreModule<UserType>().getDoc(
        'users',
        beforeCheckout.userUid
      );

      if (!user) {
        return;
      }

      await FirestoreModule<UserType>().writeDoc('users', user.uid, {
        ...user,
        cart: {
          lineItems: [],
        },
      });

      const admins = await FirestoreModule<UserType>().getCollection('users', [
        {
          property: 'isAdmin',
          opStr: '==',
          value: true,
        },
      ]);

      const recipients: MailerRecipientType[] = admins.map((user) => ({
        name: user.email,
        email: user.email,
      }));

      const html = await TemplateEngineModule().build('newOrder', {
        uid: beforeCheckout.uid,
      });

      MailerModule().sendMail('New order', recipients, html);
    }
  }
);

export default PaymentTriggers;
