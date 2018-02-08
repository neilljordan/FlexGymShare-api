const dripToken = 'f09fa8614a60e8608344142e80c2ac63';
const dripAccount = 5370499;
const client = require('drip-nodejs')({ token: dripToken, accountId: dripAccount });

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
