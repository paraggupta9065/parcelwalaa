const admin = require('firebase-admin');
const tokenModel = require('../model/token')



exports.orderNotificationVendor = async (number) => {
  try {
const findToken=await tokenModel.findOne({number});

if (!findToken) {
  throw new Error(`Invalid number or FCM tokens ${number}`);
}

    const message = {
      notification: {
        title: 'New Order Received',
        body: 'You have received a new order. Check your dashboard for details.',
      },
    };

    const response = await admin.messaging().sendToDevice(findToken.token, message);

    if ( response["failureCount"]!=0) {
        throw new Error('Invalid vendor or FCM tokens');
    }
    return response;
  } catch (error) {
    console.error('Error sending notification to vendor:', error);
    throw new Error('Failed to send notification to vendor');
  }
};
