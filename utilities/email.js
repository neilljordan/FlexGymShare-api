const dripToken = 'f09fa8614a60e8608344142e80c2ac63';
const dripAccount = 5370499;
const client = require('drip-nodejs')({ token: dripToken, accountId: dripAccount });

// const defaultPayload = {
//   subscribers: [{
//     email: 'john@acme.com',
//     time_zone: 'America/Los_Angeles',
//     custom_fields: {
//       name: 'John Doe',
//       invite_code: '092380428390',
//     },
//   }],
// };

exports.createSubscriber = (subscriberInfo) => {
  let payload = {};
  if (subscriberInfo) {
    payload = {
      subscribers: [subscriberInfo],
    };
  }

  client.createUpdateSubscriber(payload)
    .then((response) => {
      console.log(response.body);
    })
    .catch((error) => {
      console.warn(error);
    });
};
